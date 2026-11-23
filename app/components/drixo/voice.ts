// Voice for the Drixo widget, using the browser's own speech features (no server, no extra vendor of ours).
//
//  - Input:  Web Speech API recognition. The spoken words are placed in the message box for the visitor to read
//            and edit; nothing is sent until they press Send, so the normal secret screening still applies.
//            Note: in Chrome and Edge the browser itself may send the audio to its speech service. The privacy
//            view says so.
//  - Output: speechSynthesis reads Drixo's reply text aloud on the device. Only the visible reply text is spoken.
//
// Both are optional: if the browser lacks them the buttons are not shown.

interface RecResult {
  isFinal: boolean;
  0: { transcript: string };
}
interface RecEvent {
  resultIndex: number;
  results: ArrayLike<RecResult>;
}
interface Rec {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: RecEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type RecCtor = new () => Rec;

const recCtor = (): RecCtor | undefined => {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { SpeechRecognition?: RecCtor; webkitSpeechRecognition?: RecCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

export const canListen = () => !!recCtor();
export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";

export interface Listener {
  stop: () => void;
}

/** Start one dictation. onText receives the full transcript so far (interim and final). */
export function startListening(handlers: {
  onText: (transcript: string) => void;
  onEnd: () => void;
  onError: (code: string) => void;
}): Listener | undefined {
  const Ctor = recCtor();
  if (!Ctor) return undefined;
  const rec = new Ctor();
  rec.lang = (typeof navigator !== "undefined" && navigator.language) || "en-US";
  rec.continuous = false;
  rec.interimResults = true;
  rec.onresult = (e) => {
    let text = "";
    for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
    handlers.onText(text.trim());
  };
  rec.onerror = (e) => handlers.onError(e.error);
  rec.onend = () => handlers.onEnd();
  try {
    rec.start();
  } catch {
    handlers.onError("start-failed");
    return undefined;
  }
  return { stop: () => { try { rec.stop(); } catch { /* already stopped */ } } };
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}

/** Read text aloud. Replaces anything already being spoken. */
export function speak(text: string, onDone: () => void) {
  if (!canSpeak()) return onDone();
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = (typeof navigator !== "undefined" && navigator.language) || "en-US";
  u.rate = 1;
  u.onend = onDone;
  u.onerror = onDone;
  synth.speak(u);
}

export const micErrorMessage = (code: string): string => {
  if (code === "not-allowed" || code === "service-not-allowed") return "Microphone access is blocked. Allow it in your browser to use voice input.";
  if (code === "no-speech") return "I didn't hear anything. Tap the microphone and try again.";
  if (code === "audio-capture") return "No microphone was found.";
  if (code === "aborted") return "";
  return "Voice input isn't available right now. You can type instead.";
};
