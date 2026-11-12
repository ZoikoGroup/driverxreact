import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import { FONT_DISPLAY } from "./fonts";
import { ChartIcon, MapPinIcon, SteeringWheelIcon } from "./icons";
import { Container, SECTION_H2 } from "./shared";

type Step = {
  title: string;
  text: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const STEPS: readonly Step[] = [
  {
    title: "Explore driver plans",
    text: "Compare data, hotspot and calling across plans sized from lighter workweeks to full-time driving.",
    icon: ChartIcon,
  },
  {
    title: "Check your eligibility",
    text: "Confirm your area and device are supported before you sign up.",
    icon: MapPinIcon,
  },
  {
    title: "Sign up and drive",
    text: "Choose your plan and get set up while parked, so you’re connected before your first trip.",
    icon: SteeringWheelIcon,
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="py-14 lg:py-[72px]">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[560fr_568fr] lg:gap-[72px]">
          <div className="flex flex-col gap-[30.59px]">
            <h2 id="how-title" className={`${SECTION_H2} max-w-[680px]`}>
              Three steps to a plan <br className="hidden sm:block" />
              that works your hours
            </h2>

            <ol className="flex flex-col gap-8">
              {STEPS.map(({ title, text, icon: Icon }) => (
                <li key={title} className="flex items-start gap-[18px]">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[16px] border-2 border-[#fcd018] text-[#fcd018]">
                    <Icon className="h-[30px] w-[30px]" strokeWidth={1.75} />
                    <span
                      aria-hidden
                      className="absolute -right-[10px] -top-[10px] h-6 w-6 rounded-full bg-[#338a83]"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-[2.9px] pt-[2px]">
                    <h3
                      className={`${FONT_DISPLAY} text-[19.2px] font-extrabold leading-[29.76px] text-[#edf2f5]`}
                    >
                      {title}
                    </h3>
                    <p className="pb-[0.69px] text-[15.4px] leading-[23.81px] text-[#a9bac6]">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative h-[320px] overflow-hidden rounded-[20px] border-4 border-[#fcd018] bg-[linear-gradient(135deg,#1a3149_0%,#1e5b55_100%)] sm:h-[520px]">
            <Image
              src="/images/sale/3.png"
              alt="Dark sedan driving along a road at dusk"
              fill
              sizes="(min-width: 1024px) 568px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
