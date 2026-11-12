import Image from "next/image";
import { FONT_DISPLAY, WDTH } from "./fonts";
import { SignalIcon } from "./icons";
import { ButtonLink, Container } from "./shared";

const TITLE_LINES = ["Built", "for your", "busiest", "routes."] as const;

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[794px] items-center overflow-hidden bg-[linear-gradient(135deg,#1a3149_0%,#1e5b55_100%)] py-[58.27px]"
    >
      <Image
        src="/images/sale/1.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_40%]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(12,26,43,0.94)_0%,rgba(12,26,43,0.78)_42%,rgba(12,26,43,0.25)_100%),linear-gradient(0deg,#0c1a2b_0%,rgba(12,26,43,0)_30%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[36px] h-1 bg-[repeating-linear-gradient(90deg,rgba(252,208,24,0.55)_0,rgba(252,208,24,0.55)_64px,transparent_64px,transparent_112px)] opacity-50"
      />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <div className="flex max-w-[640px] flex-col gap-[6.8px] self-end border-4 border-[#fcd018] px-5 py-8 sm:px-[46px] sm:py-[45px]">
            <p className="flex h-[24.8px] items-center gap-[10px] text-base font-bold leading-[24.8px] text-[#fcd018]">
              <SignalIcon className="h-[22px] w-[22px] shrink-0" />
              DriverX Mobile Black Friday
            </p>

            <h1
              id="hero-title"
              className={`${FONT_DISPLAY} ${WDTH[112]} pt-[10.565px] text-[46px] font-black italic leading-[1.02] tracking-[-0.768px] text-[#edf2f5] sm:text-[62px] lg:text-[76.8px] lg:leading-[75.26px]`}
            >
              {TITLE_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p className="max-w-[392.42px] pt-[13.925px] text-[18.9px] leading-[29.26px] text-[#edf2f5]">
              Black Friday driver-plan savings from DriverX Mobile.
            </p>

            <p className="max-w-[411.25px] pb-[0.595px] text-base leading-[24.8px] text-[#a9bac6]">
              Your next shift deserves a stronger connection. Mobile plans
              shaped around how rideshare drivers, couriers and small fleets
              actually work.
            </p>

            <div className="flex flex-wrap gap-3 pt-[21.2px]">
              <ButtonLink href="#plans">Explore driver plans</ButtonLink>
              <ButtonLink href="#offer-conditions" variant="outline">
                Read offer conditions
              </ButtonLink>
            </div>
          </div>

          <div className="relative h-[280px] self-center overflow-hidden rounded-[20px] border border-white/10 sm:h-[374px]">
            <Image
              src="/images/sale/2.png"
              alt="White delivery van driving down a city street at sunset"
              fill
              sizes="(min-width: 1024px) 432px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
