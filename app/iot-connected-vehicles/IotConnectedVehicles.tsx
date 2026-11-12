"use client";

import { useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { Barlow, Barlow_Condensed } from "next/font/google";
import {
  tabs, images, solutions, deviceTypes, deviceScales, locations, dataUse,
  proposalCovers, deployment, rollout, faqs,
} from "./data";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-barlow-condensed",
});

const Icon = ({ name, size = 24 }: { name: string; size?: number }) => {
  const C = (Icons as any)[name] ?? Icons.Circle;
  return <C size={size} />;
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="flex items-center gap-2 text-xs font-semibold text-[#f5c518]">
    <Icons.SignalHigh size={14} /> {children}
  </p>
);

const NS = "Not selected";

const Select = ({ label, icon, value, onChange, options, placeholder, hint }: any) => (
  <div className="rounded-lg border border-gray-200 p-3">
    <div className="flex gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#e3efec] text-[#1d5c52]">
        <Icon name={icon} size={18} />
      </span>
      <div className="flex-1">
        <label className="block text-xs font-bold text-[#0f2133]">{label}</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700"
        >
          <option value="">{placeholder}</option>
          {options.map((o: string) => <option key={o}>{o}</option>)}
        </select>
        {hint && <p className="mt-2 text-[10px] text-gray-500">{hint}</p>}
      </div>
    </div>
  </div>
);

export default function IotConnectedVehicles() {
  const [step, setStep] = useState(1);
  const [useCase, setUseCase] = useState("");
  const [device, setDevice] = useState("");
  const [scale, setScale] = useState("");
  const [loc, setLoc] = useState("");
  const [data, setData] = useState("");
  const [advanced, setAdvanced] = useState(false);
  const [notes, setNotes] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", company: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const selections = [
    ["Use case", useCase], ["Device", device], ["Scale", scale], ["Locations", loc], ["Data", data],
  ];

  const pickUseCase = (v: string) => {
    setUseCase(v);
    document.getElementById("proposal")?.scrollIntoView({ behavior: "smooth" });
  };

  const canContinue = !!(device && scale);

  const submit = async () => {
    if (!contact.email || !contact.name) {
      setError("Please enter your name and email.");
      return;
    }
    setError("");
    setStatus("sending");
    const [firstName, ...rest] = contact.name.trim().split(" ");
    try {
      const res = await fetch("/api/request-a-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName: rest.join(" "),
          email: contact.email,
          company: contact.company,
          orgType: `${useCase || "Custom IoT"} / ${device}`,
          deploymentSize: `${scale} | ${loc || NS} | ${data || NS}${notes ? ` | ${notes}` : ""}`,
          request_type: "custom-iot",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Request failed");
      setStatus("done");
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const goProposal = () => document.getElementById("proposal")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className={`${barlow.variable} ${barlowCondensed.variable} font-figma bg-[#0f2133] text-white`}>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0f2133] to-[#12433f]">
        <div className="absolute inset-y-0 right-0 hidden w-3/5 md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images.hero} alt="DriverX delivery van at a depot" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f2133] via-[#0f2133]/40 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
          <p className="text-xs font-bold tracking-wide text-[#f5c518]">CUSTOM IOT &amp; CONNECTED VEHICLES</p>
          <h1 className="mt-3 max-w-md text-4xl md:text-5xl font-extrabold leading-tight">
            Connectivity built around your devices.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/80">
            Custom SIM, eSIM and data solutions for fleets, connected equipment and growing operations.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={goProposal} className="inline-flex items-center gap-2 rounded-full bg-[#f5c518] px-6 py-3 text-sm font-bold text-[#0f2133]">
              Request a custom quote <Icons.ArrowRight size={16} />
            </button>
            <button onClick={() => document.getElementById("solutions")?.scrollIntoView({ behavior: "smooth" })} className="rounded-full border border-white/70 px-6 py-3 text-sm font-bold">
              Explore solutions
            </button>
          </div>
        </div>
      </section>

      {/* ── CATEGORY TABS ───────────────────────────────────────────── */}
      <nav className="bg-white dark:bg-gray-800 border-b border-[#b2d8d1]">
        <ul className="mx-auto flex justify-center items-center overflow-x-auto scrollbar-hide px-4">
          {tabs.map((t, i) => (
            <li key={t.label} className="flex items-center shrink-0">
              {i > 0 && <span className="h-4 w-px bg-[#aac8d3] self-center shrink-0" />}
              <Link
                href={t.href}
                className={`relative block px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold whitespace-nowrap flex items-center transition-colors ${
                  t.active
                    ? "text-[#1d6c5c] font-bold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[3px] after:bg-[#1d6c5c] after:rounded-t-[2px]"
                    : "text-[#0f2133] dark:text-gray-200 hover:text-[#1d6c5c]"
                }`}
              >
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* SOLUTIONS */}
      <section id="solutions" className="mx-auto max-w-6xl px-4 md:px-8 py-16">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>IoT solutions</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight">Connect the assets that keep business moving.</h2>
          </div>
          <p className="text-sm text-white/60 md:max-w-md">
            Flexible connectivity for the devices, teams and operations that keep your business on the road. Choose a use case to start your quote.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => (
            <button
              key={s.title}
              onClick={() => pickUseCase(s.value)}
              className={`flex items-center gap-4 rounded-lg bg-white p-4 text-left text-[#0f2133] transition hover:shadow-lg ${useCase === s.value ? "ring-2 ring-[#f5c518]" : ""}`}
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#e3efec] text-[#1d5c52]">
                <Icon name={s.icon} size={26} />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-bold">{s.title}</span>
                <span className="mt-1 block text-[11px] text-gray-500">{s.desc}</span>
              </span>
              <Icons.ArrowRight size={16} className="text-[#1d5c52]" />
            </button>
          ))}
        </div>
      </section>

      {/* PROPOSAL */}
      <section id="proposal" className="bg-[#10253a] py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:px-8 lg:grid-cols-[1fr_340px]">
          <div>
            <Eyebrow>Custom proposal</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold">Shape your custom IoT solution.</h2>
            <p className="mt-2 text-sm text-white/60">Tell us what you need. We&apos;ll help assess the right connectivity model.</p>

            <ol className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {["Deployment needs", "Contact details", "Review & send"].map((l, i) => (
                <li key={l} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${step === i + 1 ? "border-white/40 bg-white/10" : "border-white/10"}`}>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${step >= i + 1 ? "bg-[#f5c518] text-[#0f2133]" : "bg-white/10"}`}>{i + 1}</span>
                  {l}
                </li>
              ))}
            </ol>

            <div className="mt-4 rounded-lg border-t-4 border-[#f5c518] bg-white p-5 text-[#0f2133]">
              {step === 1 && (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Select label="Device type" icon="Layers" value={device} onChange={setDevice} options={deviceTypes} placeholder="Select device type" />
                    <Select label="Deployment scale" icon="Users" value={scale} onChange={setScale} options={deviceScales} placeholder="Select number of devices" />
                    <Select label="Coverage locations" icon="MapPin" value={loc} onChange={setLoc} options={locations} placeholder="Select locations" hint="Where your devices will operate. Coverage is confirmed during solution design." />
                    <Select label="Estimated data use" icon="LineChart" value={data} onChange={setData} options={dataUse} placeholder="Select data use" hint="Per device, per month. Choose “Shared data pool” to discuss pooled usage." />
                  </div>
                  <button onClick={() => setAdvanced(!advanced)} className="mt-3 flex w-full items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-left text-xs font-bold">
                    {advanced ? <Icons.Minus size={14} /> : <Icons.Plus size={14} />} Advanced needs <span className="font-normal text-gray-500">(optional)</span>
                  </button>
                  {advanced && (
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="API integration, pooled data, eSIM provisioning, compliance…" className="mt-3 w-full rounded-md border border-gray-300 p-3 text-xs" />
                  )}
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <button disabled={!canContinue} onClick={() => setStep(2)} className="inline-flex items-center gap-2 rounded-full bg-[#f5c518] py-2 pl-5 pr-2 text-xs font-bold disabled:opacity-50">
                      Continue to contact details
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0f2133] text-white"><Icons.ArrowRight size={14} /></span>
                    </button>
                    <span className="text-[10px] text-gray-500">Nothing is sent until you review and submit your request.</span>
                  </div>
                </>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  {(["name", "email", "company"] as const).map((k) => (
                    <input
                      key={k}
                      type={k === "email" ? "email" : "text"}
                      placeholder={k === "name" ? "Full name" : k === "email" ? "Work email" : "Company (optional)"}
                      value={contact[k]}
                      onChange={(e) => setContact({ ...contact, [k]: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  ))}
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep(1)} className="rounded-full border border-gray-300 px-5 py-2 text-xs font-bold">Back</button>
                    <button
                      onClick={() => (contact.name && contact.email ? (setError(""), setStep(3)) : setError("Please enter your name and email."))}
                      className="rounded-full bg-[#f5c518] px-5 py-2 text-xs font-bold"
                    >
                      Review request
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  {status === "done" ? (
                    <p className="py-6 text-center text-sm font-semibold text-[#1d5c52]">
                      Thanks! Your request has been sent. Our IoT team will be in touch.
                    </p>
                  ) : (
                    <>
                      <dl className="space-y-2 text-xs">
                        {[...selections, ["Name", contact.name], ["Email", contact.email], ["Company", contact.company]].map(([k, v]) => (
                          <div key={k} className="flex justify-between border-b border-gray-100 pb-1">
                            <dt className="text-gray-500">{k}</dt><dd className="font-semibold">{v || NS}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="mt-4 flex gap-3">
                        <button onClick={() => setStep(2)} className="rounded-full border border-gray-300 px-5 py-2 text-xs font-bold">Back</button>
                        <button onClick={submit} disabled={status === "sending"} className="rounded-full bg-[#f5c518] px-5 py-2 text-xs font-bold disabled:opacity-60">
                          {status === "sending" ? "Sending…" : "Send request"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
              {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
            </div>
          </div>

          {/* SUMMARY */}
          <aside className="h-fit rounded-lg bg-[#e8f1ef] p-5 text-[#0f2133]">
            <h3 className="flex items-center gap-2 text-sm font-extrabold"><Icons.ClipboardList size={16} /> What your proposal can cover</h3>
            <ul className="mt-3 space-y-2 text-[11px]">
              {proposalCovers.map((c) => (
                <li key={c} className="flex gap-2"><Icons.Check size={13} className="mt-0.5 shrink-0 text-[#1d5c52]" />{c}</li>
              ))}
            </ul>
            <p className="mt-3 text-[10px] italic text-gray-500">Subject to compatibility, feasibility and commercial confirmation.</p>
            <h4 className="mt-4 text-xs font-bold">Your selections</h4>
            <dl className="mt-2 space-y-1.5 text-[11px]">
              {selections.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-gray-500">{k}</dt>
                  <dd className={`text-right ${v ? "font-semibold" : "text-gray-500"}`}>{v || NS}</dd>
                </div>
              ))}
            </dl>
            <button onClick={() => (canContinue ? setStep(2) : goProposal())} className="mt-4 flex w-full items-center justify-between rounded-full bg-[#f5c518] py-2 pl-5 pr-2 text-xs font-bold">
              Request tailored proposal
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0f2133] text-white"><Icons.ArrowRight size={14} /></span>
            </button>
          </aside>
        </div>
      </section>

      {/* DEPLOYMENT */}
      <section className="mx-auto max-w-6xl px-4 md:px-8 py-16">
        <Eyebrow>Deployment</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold">Designed for practical deployment.</h2>
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_340px]">
          <div className="grid gap-3 sm:grid-cols-2">
            {deployment.map((d) => (
              <div key={d.title} className="flex gap-3 rounded-lg bg-white/5 border border-white/10 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/10 text-[#f5c518]"><Icon name={d.icon} size={18} /></span>
                <div>
                  <p className="text-sm font-bold">{d.title}</p>
                  <p className="mt-1 text-[11px] text-white/60">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative mx-auto w-full max-w-xs">
            <div className="absolute -bottom-3 -left-3 h-3/4 w-3/4 rounded-lg bg-[#f5c518]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images.deployment} alt="Fleet operations manager with a tablet" className="relative w-full rounded-lg object-cover" />
          </div>
        </div>
      </section>

      {/* ROLLOUT */}
      <section className="bg-gradient-to-r from-[#10343a] to-[#1f6b61] py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <h2 className="text-3xl font-extrabold">From requirements to rollout.</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-4">
            {rollout.map((r, i) => (
              <li key={r.title} className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#f5c518] bg-[#0f2133] text-sm font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-bold">{r.title}</p>
                  <p className="mt-1 text-[11px] text-white/70">{r.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[10px] text-white/60">Indicative stages. A pilot and device certification may be required depending on scope.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 md:px-8 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#10343a] to-[#1f6b61]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images.cta} alt="" className="absolute inset-y-0 right-0 hidden h-full w-3/5 object-cover md:block" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-[#10343a] via-[#10343a]/60 to-transparent md:block" />
          <div className="relative p-8 md:p-10">
            <h2 className="max-w-xs text-3xl font-extrabold leading-tight">Ready to connect your fleet or devices?</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact-enterprise-sales" className="inline-flex items-center gap-2 rounded-full bg-[#f5c518] px-6 py-3 text-sm font-bold text-[#0f2133]">
                Talk to an IoT specialist <Icons.ArrowRight size={16} />
              </Link>
              <button onClick={goProposal} className="rounded-full border border-white/70 px-6 py-3 text-sm font-bold">Request custom quote</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 md:px-8 pb-20">
        <Eyebrow>Questions</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold">Frequently asked questions</h2>
        <div className="mt-6 max-w-3xl space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="rounded-lg border border-white/10 bg-[#16314a]">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="flex w-full items-center justify-between px-5 py-4 text-left text-xs font-bold">
                {f.q}
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f5c518] text-[#0f2133]">
                  {openFaq === i ? <Icons.Minus size={12} /> : <Icons.Plus size={12} />}
                </span>
              </button>
              {openFaq === i && <p className="px-5 pb-4 text-xs text-white/70">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
