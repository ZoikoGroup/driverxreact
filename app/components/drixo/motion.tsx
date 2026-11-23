"use client";

// Motion layer for the Drixo widget: everything here is decoration. It never changes what is said, what is
// clickable, or the order of anything. All movement is behind prefers-reduced-motion: no-preference, so a
// visitor who asks the system for less motion gets the same widget without any of it (WCAG 2.3.3).
//
//  - panel opens like a drop of water settling; header colour drifts slowly
//  - topic cards rise in as a wave, lift on hover, squash on press, and ripple from the click point
//  - messages float up from their side; the assistant's words then flow in one after another
//  - the thinking state is three dots moving in a wave
//  - the launcher breathes with a soft ring

import type { PointerEvent } from "react";

export function MotionStyles() {
  return (
    <style>{`
.dx-theme-light{--dx-fg:#092D3E;--dx-surface:#FFFFFF;--dx-bubble:#EEF3F4;--dx-line:#D5E2E4;--dx-cream:#FFF3C4;--dx-cream2:#FFE88A;--dx-accent:#064C52;--dx-btn:#064C52;--dx-muted:#4A5D66;--dx-field:#F6F8F8;--dx-hover:#F1F7F8;--dx-error:#8A1C1C;color-scheme:light}
.dx-theme-dark{--dx-fg:#E8F1F3;--dx-surface:#0F1B20;--dx-bubble:#1B2C33;--dx-line:#2B424B;--dx-cream:#3A3311;--dx-cream2:#5A4C12;--dx-accent:#6FD6D6;--dx-btn:#0B6E6E;--dx-muted:#A3B8C0;--dx-field:#16262C;--dx-hover:#1B2F36;--dx-error:#FF9A9A;color-scheme:dark}
.dx-water{background-color:#064C52;background-image:linear-gradient(110deg,#064C52 0%,#0B6E6E 48%,#064C52 100%);background-size:100% 100%}
.dx-rip{position:relative;overflow:hidden}
.dx-ripple{position:absolute;border-radius:9999px;pointer-events:none;background:currentColor}
@media (prefers-reduced-motion: no-preference){
  .dx-panel{animation:dx-open .6s cubic-bezier(.22,1.15,.36,1) both;transform-origin:100% 100%}
  .dx-water{background-size:260% 100%;animation:dx-flow 11s ease-in-out infinite alternate}
  .dx-scroll{scroll-behavior:smooth}
  .dx-live{animation:dx-pulse 2.4s ease-out infinite}

  .dx-launch{animation:dx-pop .5s cubic-bezier(.22,1.4,.36,1) both,dx-bob 5s ease-in-out .6s infinite}
  .dx-launch::after{content:"";position:absolute;inset:0;border-radius:9999px;border:2px solid #FFD511;animation:dx-ring 2.8s ease-out 1s infinite;pointer-events:none}
  .dx-launch:active{transform:scale(.92)}

  .dx-card{animation:dx-rise .65s cubic-bezier(.2,.9,.3,1.1) both;animation-delay:calc(var(--i,0) * 70ms + 180ms);
    transition:transform .3s cubic-bezier(.3,1.5,.5,1),box-shadow .3s ease,background-color .2s ease}
  .dx-card:not(:disabled):hover{transform:translateY(-3px);box-shadow:0 10px 22px -10px rgba(6,76,82,.45)}
  .dx-card:not(:disabled):active{transform:scale(.95);transition-duration:.1s}
  .dx-chev{transition:transform .3s cubic-bezier(.3,1.5,.5,1)}
  .dx-card:hover .dx-chev{transform:translateX(5px)}
  .dx-ico{transition:transform .35s cubic-bezier(.3,1.6,.5,1)}
  .dx-card:hover .dx-ico{transform:rotate(-8deg) scale(1.08)}
  .dx-card:active .dx-ico{transform:scale(.9)}

  .dx-press{transition:transform .25s cubic-bezier(.3,1.5,.5,1),background-color .2s ease,box-shadow .25s ease}
  .dx-press:not(:disabled):hover{transform:translateY(-2px)}
  .dx-press:not(:disabled):active{transform:scale(.94);transition-duration:.1s}
  .dx-send svg{transition:transform .3s cubic-bezier(.3,1.5,.5,1)}
  .dx-send:not(:disabled):hover svg{transform:translateX(4px)}
  .dx-send:not(:disabled):hover{box-shadow:0 0 0 6px rgba(255,213,17,.35)}

  .dx-msg-a{animation:dx-in-left .6s cubic-bezier(.2,.9,.3,1.15) both;transform-origin:0 100%}
  .dx-msg-u{animation:dx-in-right .5s cubic-bezier(.2,.9,.3,1.15) both;transform-origin:100% 100%}
  .dx-w{display:inline-block;animation:dx-word .7s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--d,0) * 1ms + 150ms)}
  .dx-after{animation:dx-fade .6s ease both;animation-delay:var(--rev,0ms)}
  .dx-pill{animation:dx-rise .6s cubic-bezier(.2,.9,.3,1.1) both;animation-delay:calc(var(--rev,0ms) + var(--i,0) * 90ms)}
  .dx-dot{animation:dx-wave 1.3s ease-in-out infinite;animation-delay:calc(var(--k,0) * 160ms)}
  .dx-listen{animation:dx-mic 1.4s ease-out infinite}
  .dx-view{animation:dx-fade .4s ease both}

  .dx-ripple{opacity:0;animation:dx-ripple .75s ease-out forwards}
}
@keyframes dx-open{from{opacity:0;transform:translateY(28px) scale(.9)}55%{opacity:1}to{opacity:1;transform:none}}
@keyframes dx-flow{from{background-position:0% 50%}to{background-position:100% 50%}}
@keyframes dx-pulse{0%{box-shadow:0 0 0 0 rgba(31,169,113,.55)}70%,100%{box-shadow:0 0 0 9px rgba(31,169,113,0)}}
@keyframes dx-pop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:none}}
@keyframes dx-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes dx-ring{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(1.55)}}
@keyframes dx-rise{from{opacity:0;transform:translateY(18px) scale(.94)}to{opacity:1;transform:none}}
@keyframes dx-in-left{from{opacity:0;transform:translate(-16px,18px) scale(.88)}to{opacity:1;transform:none}}
@keyframes dx-in-right{from{opacity:0;transform:translate(16px,18px) scale(.88)}to{opacity:1;transform:none}}
@keyframes dx-word{from{opacity:0;transform:translateY(7px);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes dx-fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes dx-wave{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-7px);opacity:1}}
@keyframes dx-mic{0%{box-shadow:0 0 0 0 rgba(179,38,30,.55)}100%{box-shadow:0 0 0 12px rgba(179,38,30,0)}}
@keyframes dx-ripple{from{opacity:.28;transform:scale(0)}to{opacity:0;transform:scale(1)}}
`}</style>
  );
}

/** Time (ms) the word-by-word reveal takes, so buttons and links can appear after the text has flowed in. */
export function revealMs(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.round(Math.min(words * 38, 1800)) + 350;
}

/** Words fade in left to right like a stream. The full text is still in the DOM, in order, with real spaces. */
export function FlowText({ text }: { text: string }) {
  const words = text.split(/(\s+)/);
  const count = words.filter((w) => w.trim()).length || 1;
  const step = Math.min(38, 1800 / count);
  let n = 0;
  return (
    <>
      {words.map((w, i) =>
        w.trim() ? (
          <span key={i} className="dx-w" style={{ ["--d" as string]: Math.round(n++ * step) }}>
            {w}
          </span>
        ) : (
          w
        ),
      )}
    </>
  );
}

export function TypingDots() {
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-1.5 py-1.5">
      {[0, 1, 2].map((k) => (
        <span key={k} className="dx-dot inline-block h-2 w-2 rounded-full" style={{ background: "#0B6E6E", ["--k" as string]: k }} />
      ))}
    </span>
  );
}

/** Ripple that grows from the exact point of the press, on any element marked data-rip. */
export function rippleOnPress(e: PointerEvent<HTMLElement>) {
  const el = (e.target as HTMLElement).closest<HTMLElement>("[data-rip]");
  if (!el || el.hasAttribute("disabled")) return;
  if (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = el.getBoundingClientRect();
  const size = Math.max(r.width, r.height) * 2.2;
  const s = document.createElement("span");
  s.className = "dx-ripple";
  s.setAttribute("aria-hidden", "true");
  s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
  el.appendChild(s);
  s.addEventListener("animationend", () => s.remove());
  window.setTimeout(() => s.remove(), 1200);
}
