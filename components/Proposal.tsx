import { Reveal } from "./Reveal";
import { ArrowRight } from "lucide-react";

const STATS = [
  { value: "16/16", label: "MacBook branding" },
  { value: "12 months", label: "Campaign period" },
  { value: "12", label: "Monthly documentation reports" },
  { value: "∞", label: "Professional exposure" },
];

export default function Proposal() {
  return (
    <section id="proposal" className="relative container-edge py-28 md:py-40 border-t border-line">
      <Reveal>
        <p className="text-[13px] tracking-[0.22em] text-mute mb-6">
          POSTIZ × DEEPAK
        </p>
      </Reveal>

      <div className="grid md:grid-cols-4 gap-10 md:gap-6 mb-24">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="neo-card rounded-2xl p-6 min-h-[170px]">
              <p className="font-display text-4xl md:text-5xl tracking-tightest2 mb-3">
                {s.value}
              </p>
              <p className="text-mute text-sm max-w-[16ch]">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <Reveal>
          <h2 className="font-display font-light text-balance text-4xl md:text-6xl leading-[1.05] tracking-tightest2 max-w-lg">
            Your brand.
            <br />
            <span className="italic">My workspace.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href="#private-offer"
            className="neo-button group inline-flex items-center gap-3 rounded-full text-sm tracking-[0.14em] px-7 py-4 focus-ring w-fit"
          >
            DISCUSS THE PARTNERSHIP
            <ArrowRight
              className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
