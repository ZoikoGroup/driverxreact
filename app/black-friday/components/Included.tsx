import Image from "next/image";
import { FONT_DISPLAY } from "./fonts";
import { Container, SectionHead } from "./shared";

type Service = {
  id: string;
  image: string;
  alt: string;
  title: string;
  text: string;
  tag?: string;
};

const SERVICES: readonly Service[] = [
  {
    id: "hotspot",
    image: "/images/sale/9.png",
    alt: "Laptop open on a desk next to a monitor",
    title: "Mobile hotspot",
    text: "Share your connection with a tablet or laptop for paperwork between jobs.",
    tag: "1 GB on Starter 5, up to 20 GB on Unlimited",
  },
  {
    id: "talk",
    image: "/images/sale/10.png",
    alt: "Smartphone showing a grid of app icons",
    title: "Talk and text",
    text: "Unlimited U.S. talk and text on every plan, with Canada and Mexico included from Cruise 15.",
    tag: "Included on all four plans",
  },
  {
    id: "international",
    image: "/images/sale/11.png",
    alt: "Aircraft wing above the clouds",
    title: "International calling",
    text: "Calls and texts to 100+ countries, or 220+ on Unlimited. Power 25 adds international roaming.",
  },
];

export function Included() {
  return (
    <section aria-labelledby="inc-title" className="py-14 lg:py-[72px]">
      <Container className="flex flex-col gap-[30.59px]">
        <SectionHead
          id="inc-title"
          title="What comes with driver plans"
          description="The essentials drivers rely on, with allowances that grow by plan."
        />

        <div id="services" className="grid items-start gap-6 md:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.id}
              className="flex min-w-0 flex-col gap-[5.3px] pb-[1.875px]"
            >
              <div className="relative h-[260px] overflow-hidden rounded-[14px] border-[3px] border-[#1a3149] bg-[linear-gradient(135deg,#1a3149_0%,#1e5b55_100%)]">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  sizes="(min-width: 768px) 384px, 100vw"
                  className="object-cover"
                />
              </div>
              <h3
                className={`${FONT_DISPLAY} pt-[10.7px] text-[19.2px] font-extrabold leading-[29.76px] text-[#edf2f5]`}
              >
                {service.title}
              </h3>
              <p className="pb-[4.615px] text-[15.2px] leading-[23.56px] text-[#a9bac6]">
                {service.text}
              </p>
              {service.tag ? (
                <p className="text-[13.4px] font-bold leading-[20.83px] text-[#6cc2b9]">
                  {service.tag}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
