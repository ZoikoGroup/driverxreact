"use client";

import { useState } from "react";
import { PlusIcon } from "./icons";
import { Container, SectionHead } from "./shared";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: "offer-live",
    question: "Is the 35% Black Friday offer live?",
    answer:
      "Not yet. It is a proposed offer for internal review only. If it isn’t approved, this page shows standard plan prices only.",
  },
  {
    id: "data-limit",
    question: "What happens when I use up my high-speed data?",
    answer:
      "Every DriverX Mobile driver plan keeps you online after your high-speed allowance with unlimited 2G data, so navigation and messaging don’t simply stop mid-shift.",
  },
  {
    id: "annual",
    question: "Can I pay annually?",
    answer:
      "The plans section lets you switch between Monthly and Annually billing. Taxes and mandatory fees are shown at checkout.",
  },
  {
    id: "unlimited",
    question: "Is the Unlimited plan unlimited data?",
    answer:
      "DriverX Unlimited includes 35 GB of high-speed data, then unlimited 2G data.",
  },
  {
    id: "availability",
    question: "Where is DriverX Mobile available?",
    answer:
      "Availability depends on your area and device. Check your eligibility before you sign up.",
  },
  {
    id: "fleets",
    question: "Are there plans for fleets?",
    answer:
      "Yes. Business & Fleet plans keep drivers and dispatch on the same page. Select the Business & Fleet tab in the plans section.",
  },
];

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section aria-labelledby="faq-title" className="py-14 lg:py-[72px]">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)] lg:gap-14">
          <SectionHead
            id="faq-title"
            title="Questions drivers ask"
            description="Straight answers about plans, data and the Black Friday offer."
          />

          <div className="border-t border-white/10">
            {FAQ_ITEMS.map((item) => {
              const open = item.id === openId;
              const panelId = `faq-panel-${item.id}`;
              return (
                <div key={item.id} className="border-b border-white/10">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenId(open ? null : item.id)}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fcd018]"
                    >
                      <span className="text-base font-bold leading-7 text-[#edf2f5]">
                        {item.question}
                      </span>
                      <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-white/[0.18] text-[#fcd018]">
                        <PlusIcon
                          className={`h-4 w-4 transition-transform duration-150 ${
                            open ? "rotate-45" : ""
                          }`}
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={undefined}
                    hidden={!open}
                    className="pb-5 pr-12 text-[15px] leading-6 text-[#a9bac6]"
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
