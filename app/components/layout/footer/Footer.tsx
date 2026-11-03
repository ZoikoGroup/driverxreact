import FooterBottom from "./FooterBottom";
import FooterColumns from "./FooterColumns";
import FooterContact from "./FooterContact";
import FooterCta from "./FooterCta";
import FooterQuickLinks from "./FooterQuickLinks";
import FooterStripe from "./FooterStripe";

export default function Footer() {
  return (
    <footer className="w-full bg-[#091822] font-sans text-white">
      {" "}
      <footer className="w-full bg-[#091822] font-sans text-white">
        <div className="mx-auto max-w-[1440px] px-6 pt-10 sm:px-10 lg:px-[60px]">
          <FooterCta /> <FooterCta />
          <FooterContact /> <FooterContact />
          <FooterColumns /> <FooterColumns />
          <FooterQuickLinks /> <FooterQuickLinks />
        </div>
        <FooterStripe /> <FooterStripe />
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-[60px]">
          <FooterBottom /> <FooterBottom />
        </div>
      </footer>{" "}
    </footer>
  );
}
