"use client";

// Drixo public assistant UI (WF-00..WF-10), styled to the approved design image
// (docs/WhatsApp Image 2026-10-21 at 00.43.08.jpeg). The UI renders what the server returns; it never decides
// outcomes, builds links, or infers success from prose.
//
// Where the design and the project documents disagree, the documents win and the control is left out:
//  - "24/7 support" label: an unverified availability claim (Doc 06/07, decision D-05). Shown as "Public guidance".
//  - paperclip (attachments) and microphone (voice): both are off in P0 and "unsupported controls must be
//    omitted" (Doc 07). They are not rendered, so nothing looks clickable that does nothing.

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  MoreVertical,
  Maximize2,
  Minimize2,
  ArrowRight,
  Shield,
  ChevronRight,
  Headset,
  Truck,
  Star,
  RadioTower,
  ReceiptText,
  CardSim,
  User,
  RotateCcw,
  Sun,
  Moon,
  History as HistoryIcon,
  Trash2,
  ArrowLeft,
  Mic,
  Square,
  Volume2,
  VolumeX,
  SquarePen,
} from "lucide-react";
import { getDrixoConfig, FALLBACK_SUPPORT } from "./config";
import { DrixoApiError, DrixoClient, type TurnInput } from "./client";
import { lengthBucket, track } from "./analytics";
import { canListen, canSpeak, micErrorMessage, speak, startListening, stopSpeaking, type Listener } from "./voice";
import { FlowText, MotionStyles, TypingDots, revealMs, rippleOnPress } from "./motion";
import type { ChatMessage, DrixoConfig, IntentCode, QuickReply, Shortcut, TurnAction } from "./types";

// Design tokens (Doc 07 provisional palette, matched to the design image).
const DEEP_TEAL = "#064C52";
const TEAL = "#0B6E6E";
const YELLOW = "#FFD511";
const NAVY = "var(--dx-fg)";
const INK = "#092D3E"; // fixed dark ink for text on yellow
const CREAM = "var(--dx-cream)";
const ACCENT = "var(--dx-accent)"; // links and outlines: dark teal on light, light teal on dark
const BTN = "var(--dx-btn)"; // filled buttons and the visitor bubble
const BUBBLE = "var(--dx-bubble)";
const LINE = "var(--dx-line)";
const MAX_LEN = 2000;

const HIDDEN_TEXT = "Message hidden because it may contain sensitive information.";
const nowLabel = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

type View = "chat" | "privacy" | "confirmEnd" | "history" | "historyItem";
type Theme = "light" | "dark";
type LoadState = "loading" | "ready" | "unavailable";

/** The Drixo mark: white tile, teal square, three ascending yellow signal bars. */
function DrixoMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="11" fill="#FFFFFF" />
      <rect x="7" y="7" width="34" height="34" rx="8" fill={TEAL} />
      <rect x="13" y="26" width="6" height="9" rx="1.5" fill={YELLOW} />
      <rect x="21" y="20" width="6" height="15" rx="1.5" fill={YELLOW} />
      <rect x="29" y="13" width="6" height="22" rx="1.5" fill={YELLOW} />
    </svg>
  );
}

/** Ascending bars icon for "Fix my connection". */
function BarsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 26 26" aria-hidden="true" focusable="false">
      <rect x="3" y="15" width="5" height="8" rx="1.2" fill={YELLOW} stroke="var(--dx-accent)" strokeWidth="1.4" />
      <rect x="10.5" y="10" width="5" height="13" rx="1.2" fill={YELLOW} stroke="var(--dx-accent)" strokeWidth="1.4" />
      <rect x="18" y="3.5" width="5" height="19.5" rx="1.2" fill={YELLOW} stroke="var(--dx-accent)" strokeWidth="1.4" />
    </svg>
  );
}

function CardIcon({ code }: { code: IntentCode }) {
  const common = { size: 22, strokeWidth: 1.8, color: "var(--dx-accent)", "aria-hidden": true } as const;
  switch (code) {
    case "FIX_CONNECTION":
      return <BarsIcon />;
    case "ACTIVATE_SIM_ESIM":
      return <CardSim {...common} fill={YELLOW} />;
    case "PLANS_HOTSPOT":
      return <RadioTower {...common} />;
    case "BILLING_TOPUPS":
      return <ReceiptText {...common} fill={YELLOW} />;
    case "FLEET_IOT":
      return <Truck {...common} fill={YELLOW} />;
    case "DRIVER_BENEFITS":
      return <Star {...common} fill={YELLOW} />;
  }
}

/**
 * Non-identifying, tab-scoped rollout draw: a random number kept in sessionStorage so a visitor does
 * not flicker in and out while Ops raises the percentage (monotonic). It is not a user identifier and
 * is never sent anywhere. Storage failures fall back to a fresh draw.
 */
function inRollout(percent: number): boolean {
  if (percent >= 100) return true;
  if (percent <= 0) return false;
  let roll: number | undefined;
  try {
    const v = Number(sessionStorage.getItem("drixo_roll"));
    if (Number.isFinite(v) && v > 0) roll = v;
  } catch {
    /* storage unavailable */
  }
  if (roll === undefined) {
    roll = Math.random() * 100 || 0.0001;
    try {
      sessionStorage.setItem("drixo_roll", String(roll));
    } catch {
      /* storage unavailable */
    }
  }
  return roll < percent;
}

/** Length of the run of NO_SOURCE answers ending at index i (client-side only; no text involved). */
function noSourceStreak(msgs: ChatMessage[], i: number): number {
  if (!(msgs[i]?.role === "assistant" && msgs[i]?.responseClass === "NO_SOURCE")) return 0;
  let n = 0;
  for (let k = i; k >= 0; k--) {
    const x = msgs[k];
    if (x.role === "user") continue;
    if (x.role === "assistant" && x.responseClass === "NO_SOURCE") n++;
    else break;
  }
  return n;
}

// ---- Chat history: kept only in this browser (localStorage), read-only, deletable. Never sent anywhere. ----
const HIST_KEY = "drixo_history_v1";
const HIST_MAX_CHATS = 20;
const HIST_MAX_MSGS = 80;
interface SavedMsg {
  role: ChatMessage["role"];
  text: string;
  at?: string;
}
interface SavedChat {
  id: string;
  savedAt: number;
  title: string;
  messages: SavedMsg[];
}
function loadHistory(): SavedChat[] {
  try {
    const raw = JSON.parse(localStorage.getItem(HIST_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    const out: SavedChat[] = [];
    for (const c of raw.slice(0, HIST_MAX_CHATS)) {
      if (!c || typeof c.id !== "string" || typeof c.savedAt !== "number" || !Array.isArray(c.messages)) continue;
      const messages: SavedMsg[] = [];
      for (const m of c.messages.slice(0, HIST_MAX_MSGS)) {
        if (m && (m.role === "user" || m.role === "assistant" || m.role === "system") && typeof m.text === "string") {
          messages.push({ role: m.role, text: m.text.slice(0, 4000), at: typeof m.at === "string" ? m.at.slice(0, 20) : undefined });
        }
      }
      if (messages.length) out.push({ id: c.id.slice(0, 64), savedAt: c.savedAt, title: String(c.title ?? "Conversation").slice(0, 80), messages });
    }
    return out;
  } catch {
    return [];
  }
}
function storeHistory(list: SavedChat[]) {
  try {
    localStorage.setItem(HIST_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable or full: history is a convenience, never required */
  }
}
const newConvId = () => `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const when = (t: number) => new Date(t).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

let msgSeq = 0;
const newId = () => `m${++msgSeq}`;

export default function DrixoWidget() {
  const [open, setOpen] = useState(false);
  const [wide, setWide] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menuOpen]);
  useEffect(() => {
    if (!open) setMenuOpen(false);
  }, [open]);
  const [view, setView] = useState<View>("chat");
  const [config, setConfig] = useState<DrixoConfig | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [online, setOnline] = useState(true);
  const [rephrase, setRephrase] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [history, setHistory] = useState<SavedChat[]>([]);
  const [openChatId, setOpenChatId] = useState<string | null>(null);
  const convId = useRef(newConvId());
  // Voice (browser speech features; buttons only appear where the browser has them)
  const [canMic, setCanMic] = useState(false);
  const [canTts, setCanTts] = useState(false);
  const [listening, setListening] = useState(false);
  const [micNote, setMicNote] = useState("");
  const [voiceOut, setVoiceOut] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const listenerRef = useRef<Listener | undefined>(undefined);
  const draftBase = useRef("");
  const spokenRef = useRef<string | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const stickToBottom = useRef(true);
  const pathname = usePathname() ?? "";
  const [retry, setRetry] = useState<{ input: TurnInput } | null>(null);
  const clientRef = useRef<DrixoClient | null>(null);
  clientRef.current ??= new DrixoClient();

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Theme: the visitor's saved choice, otherwise the device setting (and it follows the device while unsaved).
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("drixo_theme");
    } catch {
      /* ignore */
    }
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      return;
    }
    const mq = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)") : null;
    if (!mq) return;
    setTheme(mq.matches ? "dark" : "light");
    const on = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("drixo_theme", next);
    } catch {
      /* ignore */
    }
  };

  // History: load once, then save the current conversation after each settled turn (never mid-send, so
  // text that the server is about to hide as a likely secret is not written to storage).
  useEffect(() => {
    setHistory(loadHistory());
  }, []);
  useEffect(() => {
    if (pending || messages.length === 0) return;
    const firstUser = messages.find((x) => x.role === "user" && x.text !== HIDDEN_TEXT);
    const entry: SavedChat = {
      id: convId.current,
      savedAt: Date.now(),
      title: (firstUser?.text ?? "Conversation").replace(/\s+/g, " ").trim().slice(0, 60) || "Conversation",
      messages: messages.slice(-HIST_MAX_MSGS).map((x) => ({ role: x.role, text: x.text, at: x.at })),
    };
    setHistory((h) => {
      const next = [entry, ...h.filter((c) => c.id !== entry.id)].slice(0, HIST_MAX_CHATS);
      storeHistory(next);
      return next;
    });
  }, [messages, pending]);
  // ---- Voice ----
  useEffect(() => {
    setCanMic(canListen());
    setCanTts(canSpeak());
    try {
      if (localStorage.getItem("drixo_voice_out") === "1") setVoiceOut(true);
    } catch {
      /* ignore */
    }
    return () => {
      listenerRef.current?.stop();
      stopSpeaking();
    };
  }, []);
  // Closing or minimizing the chat always silences the microphone and the speaker.
  useEffect(() => {
    if (open) return;
    listenerRef.current?.stop();
    listenerRef.current = undefined;
    stopSpeaking();
    setListening(false);
    setSpeakingId(null);
  }, [open]);
  const stopListen = () => {
    listenerRef.current?.stop();
    listenerRef.current = undefined;
    setListening(false);
  };
  const toggleMic = () => {
    if (listening) return stopListen();
    stopSpeaking();
    setSpeakingId(null);
    setMicNote("");
    draftBase.current = draft ? draft.trimEnd() + " " : "";
    const l = startListening({
      onText: (t) => setDraft(draftBase.current + t),
      onEnd: () => {
        listenerRef.current = undefined;
        setListening(false);
      },
      onError: (c) => setMicNote(micErrorMessage(c)),
    });
    if (l) {
      listenerRef.current = l;
      setListening(true);
      composerRef.current?.focus();
    }
  };
  // New chat: ends the current conversation (it stays in Chat history) and starts a fresh one.
  const newChat = () => {
    stopListen();
    stopSpeaking();
    setSpeakingId(null);
    setMicNote("");
    spokenRef.current = null;
    void endChat("RESTARTED");
  };
  const toggleVoiceOut = () => {
    const next = !voiceOut;
    setVoiceOut(next);
    try {
      localStorage.setItem("drixo_voice_out", next ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (next) spokenRef.current = messages[messages.length - 1]?.id ?? null; // only read new replies
    else {
      stopSpeaking();
      setSpeakingId(null);
    }
  };
  const onSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    stopListen();
    setSpeakingId(id);
    speak(text, () => setSpeakingId((c) => (c === id ? null : c)));
  };
  // Read each new assistant reply aloud when "Read replies aloud" is on.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!voiceOut || !open || pending || !last || last.role !== "assistant" || spokenRef.current === last.id) return;
    spokenRef.current = last.id;
    setSpeakingId(last.id);
    speak(last.text, () => setSpeakingId((c) => (c === last.id ? null : c)));
  }, [messages, voiceOut, open, pending]);

  const deleteChat = (id: string) =>
    setHistory((h) => {
      const next = h.filter((c) => c.id !== id);
      storeHistory(next);
      return next;
    });
  const clearHistory = () => {
    setHistory([]);
    storeHistory([]);
  };

  // Canary gate. Config is fetched once on mount (cached publicly for ~60s). The launcher is shown
  // only if this visitor falls inside Ops' rolloutPercent. If config cannot be loaded (kill switch,
  // outage, flags unreadable) the launcher stays hidden and the site is unaffected; the persistent
  // support links elsewhere on the site remain the fallback. Closed by default regardless (PR-001).
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let cancelled = false;
    getDrixoConfig()
      .then((c) => {
        if (cancelled) return;
        setConfig(c);
        setLoadState("ready");
        setVisible(inRollout(c.rolloutPercent ?? 100));
      })
      .catch(() => {
        if (cancelled) return;
        setLoadState("unavailable");
        setVisible(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Move focus into the panel on open.
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  // Follow new messages only while the visitor is already at the bottom; if they scrolled up to re-read,
  // do not pull them back down (FR-011). Sending a message always returns to the bottom.
  useEffect(() => {
    const el = listRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages, view]);

  // Offline awareness (WF-09): say so and hold the draft; no hidden backlog, no silent queue.
  useEffect(() => {
    const sync = () => setOnline(typeof navigator === "undefined" ? true : navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const restoreFocus = useRef(false);

  // Return focus to the launcher after it has re-rendered (FR-003). Done in an effect so it
  // cannot race the commit that swaps the panel for the launcher.
  useEffect(() => {
    if (!open && restoreFocus.current) {
      restoreFocus.current = false;
      launcherRef.current?.focus();
    }
  }, [open]);

  const close = useCallback(() => {
    track("dx_drixo_closed");
    restoreFocus.current = true;
    setOpen(false);
    setView("chat");
  }, []);

  // Clicking anywhere outside the chat minimizes it (the conversation is kept, as with the Minimize button).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node | null;
      if (!t || !t.isConnected) return; // the clicked element was removed by the click itself
      if (panelRef.current?.contains(t)) return;
      if ((t as Element).closest?.("[data-drixo-ignore-outside]")) return;
      close();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, close]);

  const sysNotice = (text: string, actions?: TurnAction[]): ChatMessage => ({
    id: newId(),
    role: "system",
    text,
    actions,
    at: nowLabel(),
  });

  /** Send one turn. addBubble=false is used for retrying a failed send (bubble already shown). */
  const submit = async (input: TurnInput, userLabel: string, addBubble = true) => {
    if (pending) return;
    stopSpeaking();
    setSpeakingId(null);
    const client = clientRef.current!;
    const userMsgId = newId();
    setRetry(null);
    setPending(true);
    stickToBottom.current = true;
    setRephrase(false);
    if (addBubble) setMessages((m) => [...m, { id: userMsgId, role: "user", text: userLabel, at: nowLabel() }]);
    try {
      const { turnId, result } = await client.turn(input);
      track("dx_drixo_answer_shown", { responseClass: result.responseClass, cited: result.sources.length > 0 });
      if (result.responseClass === "AUTH_GATE") track("dx_drixo_auth_gate");
      setMessages((m) => {
        // Never keep a likely secret on screen (FR-056).
        const cleaned =
          result.responseClass === "SECRET_WARNING" && input.type === "TEXT"
            ? m.map((x) => (x.id === userMsgId ? { ...x, text: HIDDEN_TEXT } : x))
            : m;
        return [
          ...cleaned,
          {
            id: newId(),
            role: "assistant",
            text: result.text,
            turnId,
            responseClass: result.responseClass,
            quickReplies: result.quickReplies,
            actions: result.actions,
            sources: result.sources,
            at: nowLabel(),
          },
        ];
      });
    } catch (e) {
      const err = e instanceof DrixoApiError ? e : new DrixoApiError("UNKNOWN", false);
      track("dx_drixo_error", { errorCode: err.code });
      const supportAction: TurnAction[] = [
        { actionId: "SUPPORT", kind: "SHOW_SUPPORT", label: "Official support", href: support.href },
      ];
      if (err.code === "STALE_CONTEXT") {
        setMessages((m) => [
          ...m,
          sysNotice("That choice is out of date. You can start over.", [
            { actionId: "RESTART", kind: "RESTART", label: "Start over" },
          ]),
        ]);
      } else if (err.code === "SESSION_EXPIRED") {
        setMessages((m) => [
          ...m,
          sysNotice("Your chat session expired. Please start a new conversation.", [
            { actionId: "RESTART", kind: "RESTART", label: "Start a new chat" },
            ...supportAction,
          ]),
        ]);
      } else if (err.code === "RATE_LIMITED") {
        const wait = err.retryAfterSec ? ` Please wait about ${err.retryAfterSec} seconds and try again.` : " Please try again shortly.";
        setMessages((m) => [...m, sysNotice(`You're sending messages quickly.${wait}`, supportAction)]);
      } else if (err.code === "INVALID") {
        setMessages((m) => [...m, sysNotice("I couldn't send that message. Please shorten or rephrase it.", supportAction)]);
      } else {
        // UNAVAILABLE / UNKNOWN: bounded retry offered, official support always available.
        setRetry({ input });
        setMessages((m) => [
          ...m,
          sysNotice("I couldn't reach Drixo. Your message may not have been sent. You can try again or use official support.", supportAction),
        ]);
      }
    } finally {
      setPending(false);
    }
  };

  const onShortcut = (s: Shortcut) => {
    track("dx_drixo_intent_selected", { intentCode: s.intentCode });
    return submit({ type: "SHORTCUT", intentCode: s.intentCode }, s.label);
  };

  const onQuickReply = (q: QuickReply) =>
    submit({ type: "QUICK_REPLY", stepId: q.stepId, optionId: q.optionId }, q.label);

  const tooLong = draft.length > MAX_LEN;

  const send = () => {
    const text = draft.trim();
    if (!text || pending || !online) return;
    // Never silently cut a message: over the limit the visitor sees an error and nothing is sent (FR-014).
    if (text.length > MAX_LEN) return;
    track("dx_drixo_message_sent", { inputType: "TEXT", lengthBucket: lengthBucket(text.length) });
    listenerRef.current?.stop();
    listenerRef.current = undefined;
    setListening(false);
    setDraft("");
    void submit({ type: "TEXT", text }, text);
  };

  const onRephrase = () => {
    setRephrase(true);
    composerRef.current?.focus();
  };

  const resetLocal = () => {
    convId.current = newConvId();
    setMessages([]);
    setDraft("");
    setRetry(null);
    setView("chat");
  };

  const endChat = async (reason: "USER_ENDED" | "RESTARTED") => {
    await clientRef.current!.end(reason);
    resetLocal();
  };

  const rate = (turnId: string, helpful: boolean) => {
    track("dx_drixo_helpful_vote", { helpful });
    setMessages((m) => m.map((x) => (x.turnId === turnId ? { ...x, rated: true } : x)));
    void clientRef.current!.feedback(turnId, helpful).catch(() => undefined);
  };

  const support = config?.supportTargets[0] ?? { ...FALLBACK_SUPPORT, kind: "PAGE" as const };

  const suppressed = (config?.suppressedPathPrefixes ?? []).some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!visible || suppressed) return null;

  const panelWidth = wide ? "md:w-[600px] md:max-w-[calc(100vw-48px)]" : "md:w-[420px] md:max-w-[448px]";

  return (
    <>
      <MotionStyles />
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => {
            track("dx_drixo_opened");
            setOpen(true);
          }}
          aria-label="Open Drixo AI assistant"
          className="dx-launch fixed z-[1000] flex h-[58px] w-[58px] items-center justify-center rounded-full shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-offset-2 md:h-[66px] md:w-[66px] motion-safe:transition-transform motion-safe:hover:scale-105"
          style={{
            background: DEEP_TEAL,
            right: "max(16px, env(safe-area-inset-right))",
            bottom: "max(16px, env(safe-area-inset-bottom))",
            // focus ring colour
            ["--tw-ring-color" as string]: YELLOW,
          }}
        >
          <DrixoMark size={38} />
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          tabIndex={-1}
          onPointerDown={rippleOnPress}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              if (menuOpen) {
                setMenuOpen(false);
                menuBtnRef.current?.focus();
              } else if (view !== "chat") setView("chat");
              else close();
            }
          }}
          className={`dx-panel dx-theme-${theme} fixed z-[1000] flex flex-col overflow-x-hidden overflow-y-auto bg-[var(--dx-surface)] outline-none max-md:inset-0 max-md:h-[100dvh] max-md:pt-[env(safe-area-inset-top)] max-md:pb-[env(safe-area-inset-bottom)] md:right-6 md:bottom-6 ${panelWidth} md:h-[min(760px,calc(100dvh-48px))] md:rounded-3xl md:shadow-2xl md:ring-1 md:ring-black/10`}
          style={{ color: NAVY }}
        >
          {/* Header (DX-03): identity + window controls. No live-agent or availability claim. */}
          <header className="dx-water flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 md:px-5" style={{ color: "#fff" }}>
            <DrixoMark size={40} />
            <div className="min-w-0 flex-1 basis-[7rem]">
              <h2 id={titleId} className="text-[22px] font-bold leading-7">
                Drixo
              </h2>
              <p className="text-sm leading-5 text-white/90">Your DriverX Copilot</p>
            </div>
            <div className="relative flex items-center" ref={menuRef}>
              {/* Expand stays visible in the header (desktop only). */}
              <span className="hidden md:inline-flex">
                <IconBtn
                  label={wide ? "Shrink chat window" : "Expand chat window"}
                  pressed={wide}
                  onClick={() => setWide((w) => !w)}
                >
                  {wide ? <Minimize2 aria-hidden="true" size={18} /> : <Maximize2 aria-hidden="true" size={18} />}
                </IconBtn>
              </span>
              {/* More options: the other secondary actions live here. "Minimize" is gone: it did the same as Close. */}
              <button
                ref={menuBtnRef}
                type="button"
                aria-label="More options"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
                className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg outline-none hover:bg-white/15 focus-visible:ring-4 focus-visible:ring-[#FFD511]"
              >
                <MoreVertical aria-hidden="true" size={20} />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  aria-label="Chat options"
                  className="absolute right-0 top-full z-10 mt-1 w-56 rounded-xl p-1 shadow-xl ring-1 ring-black/10"
                  style={{ background: "var(--dx-surface)", color: "var(--dx-fg)", border: "1px solid var(--dx-line)" }}
                >
                  <MenuItem
                    label="New chat"
                    icon={<SquarePen aria-hidden="true" size={18} />}
                    onClick={() => {
                      setMenuOpen(false);
                      newChat();
                    }}
                  />
                  <MenuItem
                    label="Chat history"
                    icon={<HistoryIcon aria-hidden="true" size={18} />}
                    onClick={() => {
                      setMenuOpen(false);
                      setView(view === "history" || view === "historyItem" ? "chat" : "history");
                    }}
                  />
                  <MenuItem
                    label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    icon={theme === "dark" ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
                    onClick={() => {
                      setMenuOpen(false);
                      toggleTheme();
                    }}
                  />
                </div>
              )}
              <IconBtn
                label="Close chat"
                onClick={() => {
                  // One click closes and ends the conversation. It stays readable in Chat history on this device.
                  void endChat("USER_ENDED");
                  close();
                }}
              >
                <X aria-hidden="true" size={20} />
              </IconBtn>
            </div>
          </header>

          {/* Exactly one scroll region */}
          <div
            ref={listRef}
            className="dx-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-3 pt-4 md:px-5"
            aria-live="polite"
            aria-relevant="additions"
            onScroll={(e) => {
              const el = e.currentTarget;
              stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
            }}
          >
            {view === "privacy" && <PrivacyView config={config} onBack={() => setView("chat")} onEnd={() => setView("confirmEnd")} />}

            {view === "history" && (
              <HistoryView
                chats={history}
                onBack={() => setView("chat")}
                onOpen={(id) => {
                  setOpenChatId(id);
                  setView("historyItem");
                }}
                onDelete={deleteChat}
                onClear={clearHistory}
                onNew={newChat}
              />
            )}

            {view === "historyItem" && (
              <HistoryTranscript
                chat={history.find((c) => c.id === openChatId)}
                onBack={() => setView("history")}
                onDelete={(id) => {
                  deleteChat(id);
                  setView("history");
                }}
              />
            )}

            {view === "confirmEnd" && (
              <ConfirmEnd
                onCancel={() => setView("chat")}
                onConfirm={() => {
                  void endChat("USER_ENDED");
                  close();
                }}
                onRestart={() => void endChat("RESTARTED")}
              />
            )}

            {view === "chat" && loadState === "loading" && <p className="text-[14px]">Loading…</p>}

            {view === "chat" && loadState === "unavailable" && (
              <div className="rounded-xl p-4" style={{ background: BUBBLE }}>
                <p className="text-base font-semibold">Chat is temporarily unavailable.</p>
                <p className="mt-1 text-sm">You can still reach official help.</p>
                <SupportLink href={FALLBACK_SUPPORT.href} label={FALLBACK_SUPPORT.label} />
              </div>
            )}

            {view === "chat" && loadState === "ready" && config && (
              <>
                {/* Status row: the assistant is an AI; "Public guidance" replaces the design's "24/7 support" */}
                <div className="flex items-center justify-between gap-3 text-[13px]" style={{ color: "var(--dx-muted)" }}>
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden="true" className="dx-live inline-block h-[8px] w-[8px] rounded-full" style={{ background: "#1FA971" }} />
                    AI assistant
                  </span>
                  <span>Public guidance</span>
                </div>

                <h3 className="mt-2 text-[24px] font-extrabold leading-[1.15] md:text-[26px]">Hey, I&apos;m Drixo.</h3>
                <p className="mt-1 text-[15px] font-semibold leading-snug md:text-[16px]">
                  Let&apos;s keep you connected and on route.
                </p>

                {/* Safety notice (DX-04): ahead of the actions in reading order */}
                <div role="note" className="mt-3 flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium" style={{ background: CREAM }}>
                  <span aria-hidden="true" className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--dx-cream2)" }}>
                    <Shield size={18} color="var(--dx-fg)" strokeWidth={2} />
                  </span>
                  <span>{config.safetyNotice}</span>
                </div>

                <ul className="mt-3 grid grid-cols-1 gap-2.5 min-[340px]:grid-cols-2" aria-label="What can I help with?">
                  {[...config.shortcuts]
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((s, idx) => (
                      <li key={s.intentCode} className="min-w-0">
                        <button
                          type="button"
                          data-intent={s.intentCode}
                          onClick={() => onShortcut(s)}
                          disabled={pending}
                          data-rip=""
                          className="dx-card dx-rip flex min-h-[56px] w-full items-center gap-2 rounded-xl border bg-[var(--dx-surface)] p-2 text-left shadow-sm outline-none hover:bg-[var(--dx-hover)] focus-visible:ring-4 focus-visible:ring-[#FFD511] disabled:opacity-60"
                          style={{ borderColor: LINE, color: NAVY, ["--i" as string]: idx }}
                        >
                          <span className="dx-ico flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--dx-field)" }}>
                            <CardIcon code={s.intentCode} />
                          </span>
                          <span className="min-w-0 flex-1 text-[14px] font-semibold leading-[18px] [overflow-wrap:break-word]">
                            {s.label}
                            <span className="sr-only">. {s.description}</span>
                          </span>
                          <ChevronRight aria-hidden="true" size={16} className="dx-chev hidden shrink-0 md:block" color="var(--dx-accent)" />
                        </button>
                      </li>
                    ))}
                </ul>

                {messages.map((m, i) => (
                  <MessageItem
                    key={m.id}
                    m={m}
                    // Only the newest assistant turn may offer quick replies; older ones are stale.
                    interactive={!pending && i === messages.length - 1}
                    onQuickReply={onQuickReply}
                    onRephrase={onRephrase}
                    onSupportClick={() => track("dx_drixo_handoff_selected")}
                    escalate={noSourceStreak(messages, i) >= 2}
                    onRate={rate}
                    onRestart={() => void endChat("RESTARTED")}
                    canTts={canTts}
                    speaking={speakingId === m.id}
                    onSpeak={onSpeak}
                  />
                ))}

                {pending && (
                  <Bubble role="assistant" anim>
                    <span role="status">
                      <span className="sr-only">Drixo is thinking…</span>
                      <TypingDots />
                    </span>
                  </Bubble>
                )}

                {retry && !pending && (
                  <button
                    type="button"
                    onClick={() =>
                      void submit(
                        retry.input,
                        retry.input.type === "TEXT" ? retry.input.text : "",
                        false,
                      )
                    }
                    data-rip=""
                    className="dx-press dx-rip mt-3 min-h-9 rounded-full border-2 px-4 font-semibold outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
                    style={{ color: ACCENT, borderColor: ACCENT }}
                  >
                    Try again
                  </button>
                )}

                {/* Persistent official support route (WF-08). Opens the official support page: it is
                    not a live transfer, and nothing here claims a person is waiting. */}
                <Link
                  href={support.href}
                  onClick={() => track("dx_drixo_handoff_selected")}
                  data-rip=""
                  className="dx-press dx-rip mt-3 flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full border-2 bg-[var(--dx-surface)] px-4 text-[14px] font-semibold outline-none hover:bg-[var(--dx-hover)] focus-visible:ring-4 focus-visible:ring-[#FFD511]"
                  style={{ color: ACCENT, borderColor: ACCENT }}
                >
                  <Headset aria-hidden="true" size={18} />
                  Talk to a person
                </Link>
              </>
            )}
          </div>

          {/* Composer (DX-08): Enter sends, Shift+Enter newline. No attachment or voice controls in P0. */}
          <form
            className="sticky bottom-0 border-t bg-[var(--dx-surface)] px-4 pb-2 pt-3 md:px-5"
            style={{ borderColor: LINE }}
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            {(listening || micNote) && (
              <p role="status" className="mb-1 text-[13px] font-medium" style={{ color: NAVY }}>
                {listening ? "Listening… speak now, then check the text and press Send. Your browser may process the audio to turn it into text." : micNote}
              </p>
            )}
            {!online && (
              <p role="status" className="mb-1 text-sm font-medium" style={{ color: NAVY }}>
                You appear to be offline. Your message is kept here; reconnect to send it.
              </p>
            )}
            {tooLong && (
              <p id={`${titleId}-err`} role="alert" className="mb-1 text-sm font-semibold" style={{ color: "var(--dx-error)" }}>
                Your message is too long ({draft.length} of {MAX_LEN} characters). Please shorten it.
              </p>
            )}
            <div className="flex items-center gap-2">
              <label htmlFor={`${titleId}-composer`} className="sr-only">
                Message Drixo
              </label>
              <textarea
                ref={composerRef}
                id={`${titleId}-composer`}
                value={draft}
                aria-invalid={tooLong}
                aria-describedby={tooLong ? `${titleId}-err` : undefined}
                rows={1}
                placeholder={rephrase ? "Try describing it in different words" : "Ask Drixo a question..."}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                className="max-h-32 min-h-[40px] min-w-0 flex-1 resize-none rounded-3xl border bg-[var(--dx-field)] px-4 py-2 text-[14px] outline-none placeholder:text-[var(--dx-muted)] focus-visible:ring-4 focus-visible:ring-[#FFD511]"
                style={{ color: NAVY, borderColor: LINE }}
              />
              {canMic && (
                <button
                  type="button"
                  onClick={toggleMic}
                  aria-pressed={listening}
                  aria-label={listening ? "Stop voice input" : "Start voice input"}
                  disabled={pending || !online}
                  data-rip=""
                  className={`${listening ? "dx-listen " : ""}dx-press dx-rip flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full border-2 outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511] disabled:opacity-50`}
                  style={listening ? { background: "#B3261E", borderColor: "#B3261E", color: "#fff" } : { borderColor: ACCENT, color: ACCENT }}
                >
                  {listening ? <Square aria-hidden="true" size={15} fill="currentColor" /> : <Mic aria-hidden="true" size={18} />}
                </button>
              )}
              <button
                type="submit"
                disabled={!draft.trim() || pending || tooLong || !online}
                aria-label="Send message"
                data-rip=""
                className="dx-press dx-send dx-rip flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[#0B6E6E] disabled:opacity-50"
                style={{ background: YELLOW, color: INK }}
              >
                <ArrowRight aria-hidden="true" size={20} strokeWidth={2.5} />
              </button>
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 text-[12px]" style={{ color: "var(--dx-muted)" }}>
              <span>For account-specific help, we&apos;ll ask you to sign in securely.</span>
              <span className="inline-flex items-center gap-2">
              {canTts && (
                <button
                  type="button"
                  onClick={toggleVoiceOut}
                  aria-pressed={voiceOut}
                  className="inline-flex min-h-[36px] items-center gap-1.5 text-[12px] font-semibold outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
                  style={{ color: ACCENT }}
                >
                  {voiceOut ? <Volume2 aria-hidden="true" size={15} /> : <VolumeX aria-hidden="true" size={15} />}
                  Read replies aloud
                </button>
              )}
              <button
                type="button"
                aria-label="Privacy and settings"
                onClick={() => setView(view === "privacy" ? "chat" : "privacy")}
                className="inline-flex min-h-[36px] min-w-[44px] items-center justify-center font-semibold underline outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
                style={{ color: ACCENT }}
              >
                Privacy
              </button>
              </span>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function IconBtn({
  label,
  onClick,
  children,
  pressed,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg outline-none hover:bg-white/15 focus-visible:ring-4 focus-visible:ring-[#FFD511]"
    >
      {children}
    </button>
  );
}

function MenuItem({
  label,
  icon,
  onClick,
  className = "",
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium outline-none hover:bg-[var(--dx-hover)] focus-visible:ring-4 focus-visible:ring-[#FFD511] ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}

function Avatar({ role }: { role: ChatMessage["role"] }) {
  if (role === "user") {
    return (
      <span aria-hidden="true" className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full" style={{ background: "#8CA0A8" }}>
        <User size={17} color="#fff" />
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="shrink-0">
      <DrixoMark size={30} />
    </span>
  );
}

function Bubble({ role, children, at, anim }: { role: ChatMessage["role"]; children: React.ReactNode; at?: string; anim?: boolean }) {
  const isUser = role === "user";
  return (
    <div className={`mt-2.5 flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"} ${anim ? (isUser ? "dx-msg-u" : "dx-msg-a") : ""}`}>
      {!isUser && <Avatar role={role} />}
      <div className={`flex min-w-0 max-w-[82%] flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`${isUser ? "rounded-3xl rounded-br-lg" : "rounded-3xl rounded-bl-lg"} px-3.5 py-2 text-[14px] leading-[21px] [overflow-wrap:anywhere]`}
          style={isUser ? { background: BTN, color: "#fff" } : { background: BUBBLE, color: NAVY }}
        >
          {role === "system" && <span className="sr-only">System notice: </span>}
          {children}
        </div>
        {at && (
          <span className="mt-0.5 px-1 text-[11px]" style={{ color: "var(--dx-muted)" }}>
            {at}
          </span>
        )}
      </div>
      {isUser && <Avatar role={role} />}
    </div>
  );
}

function SupportLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mt-2 block text-sm font-semibold underline outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
      style={{ color: ACCENT }}
    >
      {label}
    </Link>
  );
}

// WF-10: privacy and preferences. Only functional controls; no copy that
// promises permanent deletion (PR-020, D-04 open).
function PrivacyView({
  config,
  onBack,
  onEnd,
}: {
  config: DrixoConfig | null;
  onBack: () => void;
  onEnd: () => void;
}) {
  return (
    <section aria-label="Privacy and settings" className="space-y-4">
      <h3 className="text-lg font-bold">Privacy &amp; settings</h3>
      <p className="text-[14px]">
        Drixo gives public guidance only. Please don&apos;t share passwords, one-time codes, PINs or full
        card numbers in chat.
      </p>
      <p className="text-[14px]">
        Voice input uses your browser&apos;s speech service, which may send what you say to your browser&apos;s
        provider to turn it into text. Spoken replies are read aloud on your device. You can turn either off at any
        time.
      </p>
      <p className="text-[14px]">
        Chat history is saved only in this browser on this device, so you can read earlier chats. Open the history
        button at the top to delete one chat or all of them.
      </p>
      <Link
        href={config?.privacyUrl ?? "/privacy-policy"}
        className="block font-semibold underline outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
        style={{ color: ACCENT }}
      >
        Read the privacy policy
      </Link>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onEnd}
          className="min-h-10 rounded-full border-2 px-5 font-semibold outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
          style={{ color: ACCENT, borderColor: ACCENT }}
        >
          End chat
        </button>
        <button
          type="button"
          onClick={onBack}
          className="min-h-10 rounded-full px-5 font-semibold outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
          style={{ background: BTN, color: "#fff" }}
        >
          Back to chat
        </button>
      </div>
    </section>
  );
}

function ConfirmEnd({
  onCancel,
  onConfirm,
  onRestart,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  onRestart: () => void;
}) {
  return (
    <section aria-label="End chat" className="space-y-4" role="alertdialog" aria-describedby="drixo-end-desc">
      <h3 className="text-lg font-bold">Do you want to end this chat?</h3>
      <p id="drixo-end-desc" className="text-[14px]">
        Ending the chat closes this conversation. It does not affect your DriverX account. A read-only copy stays in your chat history on this device until you delete it.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onConfirm}
          className="min-h-10 rounded-full px-5 font-semibold outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
          style={{ background: BTN, color: "#fff" }}
        >
          End chat
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border-2 px-5 font-semibold outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
          style={{ color: ACCENT, borderColor: ACCENT }}
        >
          <RotateCcw aria-hidden="true" size={16} /> Start over
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-10 rounded-full px-5 font-semibold underline outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
          style={{ color: ACCENT }}
        >
          Keep chatting
        </button>
      </div>
    </section>
  );
}

// Messages already shown once (this page load) do not replay their entrance when the view is re-mounted.
const seenMessages = new Set<string>();

function MessageItem({
  m,
  interactive,
  onQuickReply,
  onRephrase,
  onSupportClick,
  escalate,
  onRate,
  onRestart,
  canTts,
  speaking,
  onSpeak,
}: {
  canTts: boolean;
  speaking: boolean;
  onSpeak: (id: string, text: string) => void;
  m: ChatMessage;
  interactive: boolean;
  onRephrase: () => void;
  onSupportClick: () => void;
  escalate: boolean;
  onQuickReply: (q: QuickReply) => void;
  onRate: (turnId: string, helpful: boolean) => void;
  onRestart: () => void;
}) {
  const [fresh] = useState(() => !seenMessages.has(m.id));
  useEffect(() => {
    seenMessages.add(m.id);
  }, [m.id]);
  const flow = fresh && m.role === "assistant";
  const rev = flow ? revealMs(m.text) : 0;
  const after = flow ? "dx-after" : "";
  const afterStyle = flow ? ({ ["--rev" as string]: `${rev}ms` } as React.CSSProperties) : undefined;
  return (
    <>
      <Bubble role={m.role} at={m.at} anim={fresh}>
        {flow ? <FlowText text={m.text} /> : m.text}

        {m.responseClass === "NO_SOURCE" && (
          <span className={`${after} mt-2 flex flex-col gap-1 text-sm`} style={afterStyle}>
            {escalate && <span className="font-semibold">Still not finding it? Official support can help with this.</span>}
            {interactive && (
              <button
                type="button"
                onClick={onRephrase}
                className="min-h-9 text-left font-semibold underline outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
                style={{ color: ACCENT }}
              >
                Rephrase my question
              </button>
            )}
          </span>
        )}

        {m.sources && m.sources.length > 0 && (
          <span className={`${after} mt-2 block text-sm`} style={afterStyle}>
            Source:{" "}
            {m.sources.map((src) => (
              <a
                key={`${src.sourceId}-${src.revision}`}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
                style={{ color: ACCENT }}
              >
                {src.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </span>
        )}

        {m.actions && m.actions.length > 0 && (
          <span className={`${after} mt-2 flex flex-col gap-1`} style={afterStyle}>
            {m.actions.map((a) =>
              a.kind === "RESTART" ? (
                <button
                  key={a.actionId}
                  type="button"
                  onClick={onRestart}
                  className="min-h-9 text-left text-[13px] font-semibold underline outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
                  style={{ color: ACCENT }}
                >
                  {a.label}
                </button>
              ) : a.href ? (
                <Link
                  key={a.actionId}
                  href={a.href}
                  onClick={a.kind === "SHOW_SUPPORT" ? onSupportClick : undefined}
                  className="flex min-h-9 items-center text-[13px] font-semibold underline outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
                  style={{ color: ACCENT }}
                >
                  {a.label}
                </Link>
              ) : null,
            )}
          </span>
        )}

        {canTts && m.role === "assistant" && m.text && (
          <span className={`${after} mt-1 flex`} style={afterStyle}>
            <button
              type="button"
              onClick={() => onSpeak(m.id, m.text)}
              aria-pressed={speaking}
              className="inline-flex min-h-9 items-center gap-1.5 text-[13px] font-semibold underline outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
              style={{ color: ACCENT }}
            >
              {speaking ? <VolumeX aria-hidden="true" size={15} /> : <Volume2 aria-hidden="true" size={15} />}
              {speaking ? "Stop" : "Listen"}
              <span className="sr-only"> to this reply</span>
            </button>
          </span>
        )}

        {m.turnId && m.responseClass !== "SECRET_WARNING" && (
          <span className={`${after} mt-2 flex items-center gap-2 text-sm`} style={afterStyle}>
            {m.rated ? (
              <span>Thanks for the feedback.</span>
            ) : (
              <>
                <span>Was this helpful?</span>
                <button
                  type="button"
                  onClick={() => onRate(m.turnId!, true)}
                  className="min-h-9 px-2 font-semibold underline outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
                  style={{ color: ACCENT }}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => onRate(m.turnId!, false)}
                  className="min-h-9 px-2 font-semibold underline outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
                  style={{ color: ACCENT }}
                >
                  No
                </button>
              </>
            )}
          </span>
        )}
      </Bubble>

      {/* Quick replies sit below the bubble as outlined pills, as in the design. Only the newest turn. */}
      {interactive && m.quickReplies && m.quickReplies.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2 pl-[38px]" role="group" aria-label="Quick replies">
          {m.quickReplies.map((q, qi) => (
            <button
              key={q.optionId}
              type="button"
              onClick={() => onQuickReply(q)}
              data-rip=""
              className={`${flow ? "dx-pill " : ""}dx-press dx-rip min-h-9 rounded-full border-2 bg-[var(--dx-surface)] px-4 text-[14px] font-semibold outline-none hover:bg-[var(--dx-hover)] focus-visible:ring-4 focus-visible:ring-[#FFD511]`}
              style={{ color: ACCENT, borderColor: ACCENT, ["--rev" as string]: `${rev}ms`, ["--i" as string]: qi }}
            >
              {q.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function HistoryView({
  chats,
  onBack,
  onOpen,
  onDelete,
  onClear,
  onNew,
}: {
  onNew: () => void;
  chats: SavedChat[];
  onBack: () => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}) {
  return (
    <section aria-label="Chat history" className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to chat"
          className="dx-press flex h-9 w-9 items-center justify-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
          style={{ color: ACCENT }}
        >
          <ArrowLeft aria-hidden="true" size={20} />
        </button>
        <h3 className="text-lg font-bold">Chat history</h3>
      </div>
      <p className="text-[13px]" style={{ color: "var(--dx-muted)" }}>
        Saved only in this browser on this device. Past chats are read-only.
      </p>
      <button
        type="button"
        onClick={onNew}
        data-rip=""
        className="dx-press dx-rip inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-[14px] font-semibold outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
        style={{ background: BTN, color: "#fff" }}
      >
        <SquarePen aria-hidden="true" size={16} /> Start a new chat
      </button>
      {chats.length === 0 ? (
        <p className="rounded-xl p-3 text-[14px]" style={{ background: BUBBLE }}>
          No saved chats yet. Your conversations will appear here.
        </p>
      ) : (
        <ul className="space-y-2">
          {chats.map((c, i) => (
            <li key={c.id} className="dx-card flex items-stretch gap-1" style={{ ["--i" as string]: i }}>
              <button
                type="button"
                onClick={() => onOpen(c.id)}
                data-rip=""
                className="dx-rip min-w-0 flex-1 rounded-xl border bg-[var(--dx-surface)] px-3 py-2 text-left outline-none hover:bg-[var(--dx-hover)] focus-visible:ring-4 focus-visible:ring-[#FFD511]"
                style={{ borderColor: LINE, color: NAVY }}
              >
                <span className="block truncate text-[14px] font-semibold">{c.title}</span>
                <span className="block text-[12px]" style={{ color: "var(--dx-muted)" }}>
                  {when(c.savedAt)} · {c.messages.length} message{c.messages.length === 1 ? "" : "s"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(c.id)}
                aria-label={`Delete chat: ${c.title}`}
                className="flex w-10 shrink-0 items-center justify-center rounded-xl outline-none hover:bg-[var(--dx-hover)] focus-visible:ring-4 focus-visible:ring-[#FFD511]"
                style={{ color: ACCENT }}
              >
                <Trash2 aria-hidden="true" size={17} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {chats.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="min-h-9 rounded-full border-2 px-4 text-[13px] font-semibold outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
          style={{ color: ACCENT, borderColor: ACCENT }}
        >
          Clear all history
        </button>
      )}
    </section>
  );
}

function HistoryTranscript({
  chat,
  onBack,
  onDelete,
}: {
  chat: SavedChat | undefined;
  onBack: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section aria-label="Saved chat" className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to chat history"
          className="dx-press flex h-9 w-9 items-center justify-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
          style={{ color: ACCENT }}
        >
          <ArrowLeft aria-hidden="true" size={20} />
        </button>
        <h3 className="min-w-0 flex-1 truncate text-lg font-bold">{chat?.title ?? "Chat not found"}</h3>
      </div>
      {chat ? (
        <>
          <p className="text-[13px]" style={{ color: "var(--dx-muted)" }}>
            {when(chat.savedAt)}. Read-only: start a new chat to ask something new.
          </p>
          {chat.messages.map((m, i) => (
            <Bubble key={i} role={m.role} at={m.at}>
              {m.text}
            </Bubble>
          ))}
          <button
            type="button"
            onClick={() => onDelete(chat.id)}
            className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-full border-2 px-4 text-[13px] font-semibold outline-none focus-visible:ring-4 focus-visible:ring-[#FFD511]"
            style={{ color: ACCENT, borderColor: ACCENT }}
          >
            <Trash2 aria-hidden="true" size={15} /> Delete this chat
          </button>
        </>
      ) : (
        <p className="text-[14px]">This chat is no longer saved.</p>
      )}
    </section>
  );
}
