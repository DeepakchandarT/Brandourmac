"use client";

import dynamic from "next/dynamic";
import { Reveal, Eyebrow } from "./Reveal";

const Globe = dynamic(() => import("./Globe"), { ssr: false });

const CATEGORIES = [
  "Client meetings",
  "Startup events",
  "Tech conferences",
  "Community meetings",
  "Investor gatherings",
  "Freelance projects",
];

// Editable placeholder — replace with the actual upcoming stop as it's confirmed.
const NEXT_STOP = "Next stop: to be confirmed";

export default function WhereItTravels() {
  return (
    <section id="journey" className="relative container-edge py-28 md:py-40 border-t border-line">
      <Eyebrow>THE JOURNEY</Eyebrow>
      <Reveal>
        <h2 className="font-display font-light text-balance text-4xl md:text-6xl leading-[1.05] tracking-tightest2 max-w-2xl">
          Your brand doesn&rsquo;t stay on a desk.
          <br />
          <span className="italic">It travels with me.</span>
        </h2>
      </Reveal>

      <div className="mt-20 grid md:grid-cols-[1.4fr_1fr] gap-16 items-center">
        <Reveal delay={0.1}>
          <div className="relative aspect-[16/10] border border-line overflow-hidden">
            <Globe />
            <div className="absolute bottom-4 left-4 text-[11px] tracking-[0.14em] text-mute">
              {NEXT_STOP.toUpperCase()}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-[12px] tracking-[0.18em] text-mute mb-5">
            WHERE THE BRAND SHOWS UP
          </p>
          <ul className="flex flex-col gap-5">
            {CATEGORIES.map((c) => (
              <li
                key={c}
                className="flex items-center gap-4 pb-5 border-b border-line last:border-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span className="text-lg text-bone">{c}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}