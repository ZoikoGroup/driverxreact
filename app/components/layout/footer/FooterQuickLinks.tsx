import Link from "next/link";
import { QUICK_LINKS } from "./data";

export default function FooterQuickLinks() {
  return (
    <ul className="flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 py-5">
      {QUICK_LINKS.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className={`text-[13px] font-semibold transition-colors hover:text-white ${
              link.active ? "text-[#FFD315]" : "text-white/85"
            }`}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
