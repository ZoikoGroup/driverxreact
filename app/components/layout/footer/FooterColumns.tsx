import Link from "next/link";
import { COLUMNS } from "./data";

export default function FooterColumns() {
  return (
    <nav
      aria-label="Footer"
      className="grid grid-cols-2 gap-x-8 gap-y-10 py-10 sm:grid-cols-3 lg:grid-cols-6"
    >
      {COLUMNS.map((col) => (
        <div key={col.title}>
          <h3 className="text-sm font-bold text-white">{col.title}</h3>
          <div className="mt-3 flex items-center" aria-hidden="true">
            <span className="h-[2px] w-7 bg-[#FFD315]" />
            <span className="h-px flex-1 bg-white/15" />
          </div>
          <ul className="mt-5 flex flex-col gap-3.5">
            {col.links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[13px] text-white/65 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
