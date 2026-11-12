import { FONT_DISPLAY, WDTH } from "./fonts";
import { Container, SectionHead } from "./shared";

type ChipTone = "pending" | "muted" | "positive";

type Condition = {
  label: string;
  detail: string;
  status: string;
  tone: ChipTone;
};

const CHIP_TONES: Record<ChipTone, string> = {
  pending:
    "border-[rgba(252,208,24,0.4)] bg-[rgba(252,208,24,0.14)] text-[#fcd018]",
  muted: "border-white/[0.18] bg-white/[0.06] text-[#a9bac6]",
  positive:
    "border-[rgba(108,194,185,0.4)] bg-[rgba(108,194,185,0.14)] text-[#6cc2b9]",
};

const CONDITIONS: readonly Condition[] = [
  {
    label: "Offer period",
    detail: "First 3 months of eligible driver-plan charges",
    status: "Proposed",
    tone: "pending",
  },
  {
    label: "Price after month 3",
    detail: "Regular monthly plan price applies",
    status: "Pending",
    tone: "pending",
  },
  {
    label: "Who qualifies",
    detail: "Eligible new lines and plans",
    status: "Pending",
    tone: "pending",
  },
  {
    label: "Taxes and mandatory fees",
    detail: "Shown at checkout",
    status: "Pending",
    tone: "pending",
  },
  {
    label: "Activation fee",
    detail: "Waiver requires separate approval",
    status: "Not offered",
    tone: "muted",
  },
  {
    label: "Campaign dates",
    detail:
      "Black Friday 27 Nov and Cyber Monday 30 Nov 2026. Exact offer window",
    status: "Pending",
    tone: "pending",
  },
  {
    label: "Monthly plan prices",
    detail: "Starter 5 $16, Cruise 15 $38, Power 25 $57, Unlimited $70",
    status: "Listed",
    tone: "positive",
  },
];

export function OfferConditions() {
  return (
    <section
      id="offer-conditions"
      aria-labelledby="offer-title"
      className="border-y border-white/10 bg-[#12253a] py-14 lg:py-[72px]"
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <div className="flex flex-col gap-[30.6px]">
            <SectionHead
              id="offer-title"
              title={
                <>
                  Black Friday <br className="hidden sm:block" />
                  offer conditions
                </>
              }
              description="What the proposed offer covers, and what still needs sign-off before it can go live."
            />

            <div className="relative flex flex-col gap-[7.5px] overflow-hidden rounded-[20px] border border-white/10 bg-[#0c1a2b] p-6 sm:p-8">
              <p
                className={`${FONT_DISPLAY} ${WDTH[115]} text-[72px] font-black italic leading-[0.95] text-[#fcd018] sm:text-[105.6px] sm:leading-[95px]`}
              >
                35%
              </p>
              <h3
                className={`${FONT_DISPLAY} max-w-[286px] text-[20.8px] font-extrabold leading-[24.96px] text-[#edf2f5]`}
              >
                off eligible driver-plan charges for the first 3 months
              </h3>
              <p className="pb-[0.725px] pt-[1.405px] text-[14.7px] leading-[22.82px] text-[#a9bac6]">
                Proposed offer for internal review only. If it isn’t approved,
                this page shows standard plan prices only.
              </p>

              <div className="pointer-events-none absolute right-[-47.19px] top-[-35.82px] flex h-[174px] w-[230.4px] items-center justify-center">
                <span className="block w-[260px] rotate-[35deg] bg-[#c2410c] pb-[5.84px] pt-[5.5px] text-center text-[11.8px] font-extrabold leading-[18.35px] text-white">
                  Friday sale
                </span>
              </div>
            </div>
          </div>

          <ul
            aria-label="Offer conditions and approval status"
            className="border-t border-white/10"
          >
            {CONDITIONS.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between gap-4 border-b border-white/10 py-[14px]"
              >
                <div className="min-w-0 flex-1">
                  <strong className="block text-[15.5px] font-bold leading-6 text-[#edf2f5]">
                    {item.label}
                  </strong>
                  <span className="block text-[14.1px] leading-[21.82px] text-[#a9bac6]">
                    {item.detail}
                  </span>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-3 pb-[3.84px] pt-[3.5px] text-[12.5px] font-bold leading-[19.34px] ${CHIP_TONES[item.tone]}`}
                >
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
