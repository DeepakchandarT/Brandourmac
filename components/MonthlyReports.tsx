import { Reveal, Eyebrow } from "./Reveal";

// This block is designed to be replaced monthly with real, reported figures.
// Nothing here is fabricated — every metric starts as "Coming soon" until data exists.
const REPORT_MONTH = "September 2026";

const METRICS = [
  { label: "Events attended", value: "Coming soon" },
  { label: "Meetings", value: "Coming soon" },
  { label: "Photos delivered", value: "Coming soon" },
  { label: "Cities", value: "Coming soon" },
];

export default function MonthlyReports() {
  return (
    <section className="relative container-edge py-28 md:py-40 border-t border-line">
      <Eyebrow>ACCOUNTABILITY</Eyebrow>
      <Reveal>
        <h2 className="font-display font-light text-balance text-4xl md:text-5xl leading-[1.1] tracking-tightest2 max-w-2xl mb-16">
          A living report, updated every month.
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="glass p-8 md:p-12">
          <div className="flex items-baseline justify-between mb-10 flex-wrap gap-4">
            <span className="font-display text-2xl tracking-tightest2">
              {REPORT_MONTH.toUpperCase()}
            </span>
            <span className="text-[12px] tracking-[0.18em] text-mute">
              REPORT 01 OF 12
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {METRICS.map((m) => (
              <div key={m.label}>
                <p className="text-mute text-sm mb-2">{m.label}</p>
                <p className="font-display text-xl md:text-2xl italic text-mute">
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square border border-line flex items-center justify-center"
              >
                <span className="text-[10px] tracking-[0.12em] text-mute">
                  PHOTO
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
