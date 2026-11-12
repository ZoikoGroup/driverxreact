import Image from "next/image";
import { FONT_DISPLAY, WDTH } from "./fonts";
import { CheckIcon, ParkingIcon } from "./icons";
import { ButtonLink, Container } from "./shared";

const FACTS = [
  "5 GB to 35 GB of high-speed data, then unlimited 2G data",
  "1 GB to 20 GB of mobile hotspot for a second device",
  "Unlimited talk and text across the U.S., Canada and Mexico from Cruise 15",
] as const;

export function DowntimeSplit() {
  return (
    <section
      aria-labelledby="split-title"
      className="relative isolate flex items-center overflow-hidden py-14 lg:min-h-[828px] lg:py-[72px]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#1a3149_0%,#1e5b55_100%)] lg:right-[45%]">
        <Image
          src="/images/sale/8.png"
          alt="Aerial view of a dense city skyline at dusk"
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(rgba(12,26,43,0.8),rgba(12,26,43,0.8))] lg:bg-[linear-gradient(90deg,rgba(12,26,43,0.1)_0%,rgba(12,26,43,0.4)_60%,#0c1a2b_100%)]"
        />
      </div>

      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-[20.8px] lg:col-start-2">
            <div className="flex w-full flex-col gap-[5px] border-4 border-[#fcd018] bg-[#0c1a2b]/70 px-5 py-5 sm:px-7 sm:py-[26px]">
              <h2
                id="split-title"
                className={`${FONT_DISPLAY} ${WDTH[110]} text-[32px] font-black italic leading-[1.1] text-[#edf2f5] sm:text-[40px] sm:leading-[42px]`}
              >
                Downtime matters on <br className="hidden sm:block" />
                the road.
              </h2>
              <p className="pb-[0.8px] text-base font-bold leading-[24.8px] text-[#fcd018]">
                Pick a plan sized to how much you drive.
              </p>
            </div>

            <p className="max-w-[548.34px] pb-[0.595px] text-base leading-[24.8px] text-[#a9bac6]">
              Every DriverX Mobile driver plan keeps you online after your
              high-speed allowance, so navigation and messaging don’t simply
              stop mid-shift. Higher tiers add more hotspot and wider calling.
            </p>

            <ul className="flex w-full flex-col gap-[10px] pt-[1.2px]">
              {FACTS.map((fact) => (
                <li key={fact} className="flex items-start gap-3">
                  <span className="flex h-[22px] w-5 shrink-0 items-start pt-[2px]">
                    <CheckIcon className="h-5 w-5 text-[#6cc2b9]" />
                  </span>
                  <span className="text-base leading-[24.8px] text-[#edf2f5]">
                    {fact}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex w-full items-start gap-3 rounded-br-[10px] rounded-tr-[10px] border-l-4 border-[#338a83] bg-[#12253a] pb-[17.2px] pl-4 pr-4 pt-[13.2px]">
              <ParkingIcon className="h-[22px] w-[22px] shrink-0 text-[#6cc2b9]" />
              <p className="pr-0 text-[14.9px] leading-[23px] text-[#edf2f5] sm:pr-8">
                Set up your phone and routes while parked. Please don’t handle
                your phone while driving.
              </p>
            </div>

            <ButtonLink href="#plans">Explore driver plans</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
