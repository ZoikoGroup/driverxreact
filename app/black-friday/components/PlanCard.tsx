import Link from "next/link";
import { FONT_DISPLAY, WDTH } from "./fonts";
import { ArrowRightIcon, CheckIcon } from "./icons";
import type { Plan } from "./pricing-data";

type PlanCardProps = {
  plan: Plan;
  showOffer: boolean;
};

export function PlanCard({ plan, showOffer }: PlanCardProps) {
  const titleId = `plan-${plan.id}`;
  const { featured = false } = plan;

  return (
    <article
      aria-labelledby={titleId}
      className={`flex min-w-0 flex-col rounded-[20px] border-2 bg-white px-5 pb-3 pt-5 ${
        featured
          ? "border-[#fcd018] shadow-[0_0_0_1px_#338a83]"
          : "border-transparent"
      }`}
    >
      <div className="min-h-[24.44px]">
        <h3
          id={titleId}
          className={`${FONT_DISPLAY} ${WDTH[104]} -mt-px pb-[3px] text-[19.5px] font-extrabold leading-[22.45px] text-[#13263a]`}
        >
          {plan.name}
        </h3>
      </div>

      <div className="min-h-[31.81px]">
        <p className="-mt-px pb-[11px] text-[14.1px] leading-[21.82px] text-[#56677a]">
          {plan.audience}
        </p>
      </div>

      <div className="min-h-[72px] pb-[10px]">
        <div className="relative h-[64.14px] min-h-[62px]">
          <p
            className={`${FONT_DISPLAY} absolute left-0 top-[19.5px] -translate-y-1/2 whitespace-nowrap text-[40px] font-black leading-[40px] tracking-[-0.8px] text-[#13263a]`}
          >
            ${plan.price}
            <span className="ml-[1.3px] align-baseline font-[family-name:var(--font-public-sans)] text-base font-normal leading-[24.8px] tracking-normal text-[#56677a]">
              /mo
            </span>
          </p>
          <p className="absolute inset-x-0 top-[44.8px] text-[12.5px] leading-[19.34px] text-[#56677a]">
            Billed monthly, plus taxes &amp; fees
          </p>
        </div>
      </div>

      {showOffer ? (
        <div className="pb-[10px]">
          <div className="flex items-center gap-[10px] rounded-[10px] border border-dashed border-[#c9a100] bg-[#fff7cf] px-[10px] py-2">
            <span
              className={`${FONT_DISPLAY} shrink-0 rounded-[7px] bg-[#fcd018] px-[7px] pb-[5px] pt-[6px] text-[20.8px] font-black italic leading-[20.8px] text-[#0c1a2b]`}
            >
              35%
            </span>
            <p className="w-[146px] text-[12.8px] leading-[16.64px] text-[#3a3200]">
              Off eligible charges for the first 3 months, then ${plan.price}/mo
            </p>
          </div>
        </div>
      ) : null}

      <div className="pb-3">
        <div className="rounded-[14px] bg-[#eaf3f2] p-[10px] text-center">
          <p
            className={`${FONT_DISPLAY} text-[26.4px] font-black leading-[27.72px] text-[#1e5b55]`}
          >
            {plan.data}
          </p>
          <p className="text-[14.1px] font-bold leading-[21.82px] text-[#1e5b55]">
            high-speed data
          </p>
          <p className="text-[12.5px] leading-[19.34px] text-[#56677a]">
            {plan.thereafter}
          </p>
        </div>
      </div>

      <div className="flex-1 pb-[14px]">
        <ul className="flex min-h-[122px] flex-col gap-2 border-t border-[#e3e9ee] pt-3">
          {plan.features.map((feature) => (
            <li key={feature.text} className="flex items-start gap-[10px]">
              <span className="flex h-[18px] w-4 shrink-0 items-start pt-[2px]">
                <CheckIcon
                  className="h-4 w-4 text-[#1e5b55]"
                  strokeWidth={2.25}
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-[0.28px]">
                <span className="text-[13.9px] leading-[18.79px] text-[#13263a]">
                  {feature.text}
                </span>
                {feature.note ? (
                  <em className="text-[12.8px] not-italic leading-[17.28px] text-[#56677a]">
                    {feature.note}
                  </em>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={plan.href}
        className={`flex items-center justify-between gap-4 rounded-full py-[6px] pl-5 pr-[6px] text-[15.2px] font-bold leading-[23.56px] transition-[filter] duration-150 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#338a83] ${
          featured ? "bg-[#fcd018] text-[#0c1a2b]" : "bg-[#1e5b55] text-white"
        }`}
      >
        <span>{plan.cta}</span>
        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-white text-[#0c1a2b]">
          <ArrowRightIcon className="h-4 w-4" />
        </span>
      </Link>

      <Link
        href={plan.detailsHref}
        className="flex items-center justify-center px-2 pb-[2.33px] pt-[9px] text-[14.4px] font-bold leading-[22.32px] text-[#13263a] underline [text-underline-position:from-font]"
      >
        View plan details
      </Link>
    </article>
  );
}
