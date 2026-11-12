import Image from "next/image";
import { FONT_DISPLAY } from "./fonts";
import { Container, SectionHead } from "./shared";

type TileData = {
  id: string;
  src: string;
  alt: string;
  title: string;
  text: string;
};

const RIDESHARE: TileData = {
  id: "rideshare",
  src: "/images/sale/4.png",
  alt: "Driver with a hand on the steering wheel",
  title: "Rideshare drivers",
  text: "Stay reachable for pickups across a full shift.",
};

const COURIER: TileData = {
  id: "courier",
  src: "/images/sale/5.png",
  alt: "Courier handling a delivery package",
  title: "Delivery and couriers",
  text: "Confirm drop-offs and keep in touch with customers.",
};

const GIG: TileData = {
  id: "gig",
  src: "/images/sale/6.png",
  alt: "Person holding a smartphone",
  title: "Gig workers and contractors",
  text: "Run several work apps from one plan.",
};

const FLEET: TileData = {
  id: "fleet",
  src: "/images/sale/7.png",
  alt: "Commercial truck on a mountain highway",
  title: "Dispatch and small fleets",
  text: "Keep drivers and dispatch on the same page. Fleet plans",
};

type TileProps = {
  tile: TileData;
  className?: string;
};

function Tile({ tile, className = "" }: TileProps) {
  return (
    <article
      className={`relative flex min-h-[280px] items-end overflow-hidden rounded-[14px] bg-[linear-gradient(135deg,#1a3149_0%,#1e5b55_100%)] lg:min-h-0 ${className}`}
    >
      <Image
        src={tile.src}
        alt={tile.alt}
        fill
        sizes="(min-width: 1024px) 440px, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,26,43,0.92),rgba(12,26,43,0.15)_62%)]"
      />
      <div className="relative flex w-full flex-col gap-[3.165px] p-5">
        <h3
          className={`${FONT_DISPLAY} text-[20px] font-extrabold leading-[31px] text-[#edf2f5]`}
        >
          {tile.title}
        </h3>
        <p className="max-w-[317px] text-[14.4px] leading-[22.32px] text-[#d2dce3]">
          {tile.text}
        </p>
      </div>
    </article>
  );
}

export function Audience() {
  return (
    <section aria-labelledby="drivers-title" className="py-14 lg:py-[72px]">
      <Container>
        <SectionHead
          id="drivers-title"
          className="pb-[30.6px]"
          title={
            <>
              For people whose <br className="hidden sm:block" />
              phone is a work tool
            </>
          }
          description="When your phone runs the job, downtime matters. DriverX Mobile is built for drivers, couriers and the teams that dispatch them."
        />

        <div
          id="mosaic"
          className="grid gap-[14px] sm:grid-cols-2 lg:h-[548.09px] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1.1fr)]"
        >
          <Tile tile={RIDESHARE} />

          <div className="flex flex-col gap-[14px]">
            <Tile tile={COURIER} className="lg:flex-1" />
            <Tile tile={GIG} className="lg:flex-1" />
          </div>

          <Tile tile={FLEET} />
        </div>
      </Container>
    </section>
  );
}
