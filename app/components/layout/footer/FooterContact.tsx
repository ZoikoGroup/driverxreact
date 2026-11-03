import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACTS } from "./data";

const ICON_BOX =
  "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#FFD3151F] text-[#FFD315]";

export default function FooterContact() {
  return (
    <div className="grid grid-cols-1 items-center gap-6 border-b border-white/10 py-6 md:grid-cols-[auto_1fr_1fr_1fr] md:gap-0">
      <Link href="/" aria-label="DriverX Mobile home" className="md:pr-8">
        <Image
          src="/logo.png"
          alt="DriverX Mobile"
          width={140}
          height={48}
          className="h-auto w-[140px]"
        />
      </Link>

      <div className="flex items-center gap-3 md:border-l md:border-white/10 md:px-6">
        <span className={ICON_BOX}>
          <MapPin className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-bold text-[#FFD315]">
            {CONTACTS.location.label}
          </p>
          <Link
            href={CONTACTS.location.href}
            className="mt-1 block text-sm leading-snug text-white/90 hover:text-white"
          >
            {CONTACTS.location.lines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3 md:border-l md:border-white/10 md:px-6">
        <span className={ICON_BOX}>
          <Mail className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-bold text-[#FFD315]">
            {CONTACTS.email.label}
          </p>
          <Link
            href={CONTACTS.email.href}
            className="mt-1 block text-sm text-white/90 hover:text-white"
          >
            {CONTACTS.email.value}
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3 md:border-l md:border-white/10 md:px-6">
        <span className={ICON_BOX}>
          <Phone className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-bold text-[#FFD315]">
            {CONTACTS.phone.label}
          </p>
          <Link
            href={CONTACTS.phone.href}
            className="mt-1 block text-sm text-white/90 hover:text-white"
          >
            {CONTACTS.phone.value}
          </Link>
        </div>
      </div>
    </div>
  );
}
