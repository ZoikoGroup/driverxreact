import Link from "next/link";
import { COPYRIGHT, DISCLAIMER, LEGAL_LINKS } from "./data";

export default function FooterBottom() {
  return (
    <div className="py-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-xs text-white/55">{COPYRIGHT}</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {LEGAL_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-xs text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-white/50">{DISCLAIMER}</p>
    </div>
  );
}