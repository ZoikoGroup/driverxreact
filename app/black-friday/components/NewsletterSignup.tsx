"use client";

import { useId, useState, type FormEvent } from "react";
import { FONT_DISPLAY, WDTH } from "./fonts";
import { Container } from "./shared";

type Status = "idle" | "error" | "success";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const inputId = useId();
  const messageId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("error");
      return;
    }

    // TODO: send `email.trim()` to your newsletter endpoint.
    setStatus("success");
    setEmail("");
  }

  return (
    <section
      aria-labelledby="updates-title"
      className="bg-[#12253a] py-14 lg:flex lg:min-h-[242px] lg:items-center lg:py-16"
    >
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="flex flex-col">
            <h2
              id="updates-title"
              className={`${FONT_DISPLAY} ${WDTH[108]} text-[26px] font-extrabold leading-[1.15] tracking-[-0.32px] text-[#edf2f5] sm:text-[32px] sm:leading-[36px]`}
            >
              Get Black Friday offer updates
            </h2>
            <p className="pt-[2px] text-[14px] leading-[22px] text-[#a9bac6]">
              We’ll email you when driver-plan offer terms are confirmed.
            </p>
          </div>

          <div className="flex flex-col gap-2 lg:w-[527px]">
            <form
              noValidate
              onSubmit={handleSubmit}
              className="flex flex-col gap-[10px] sm:flex-row"
            >
              <label htmlFor={inputId} className="sr-only">
                Email address
              </label>
              <input
                id={inputId}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                aria-invalid={status === "error"}
                aria-describedby={status === "idle" ? undefined : messageId}
                className="h-[46px] min-w-0 flex-1 rounded-full border border-white/10 bg-[#0e1b2d] px-[18px] text-[14.7px] text-[#edf2f5] placeholder:text-[#56677a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fcd018] aria-[invalid=true]:border-[#c2410c]"
              />
              <button
                type="submit"
                className="h-[46px] shrink-0 rounded-full bg-[#fcd018] px-6 text-[14.7px] font-bold leading-[19.2px] text-[#0c1a2b] transition-[filter] duration-150 hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fcd018]"
              >
                Get updates
              </button>
            </form>

            <p
              id={messageId}
              role="status"
              aria-live="polite"
              className={`px-[18px] text-[13px] leading-5 ${
                status === "error" ? "text-[#f4a77a]" : "text-[#6cc2b9]"
              }`}
            >
              {status === "error"
                ? "Enter a valid email address."
                : status === "success"
                  ? "Thanks. We’ll email you when the offer terms are confirmed."
                  : ""}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
