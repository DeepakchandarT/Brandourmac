import { Reveal } from "./Reveal";

const PILLARS = [
  {
    n: "01",
    title: "Laptop",
    copy: "Every one of the 16 available MacBook surfaces belongs to Postiz.",
  },
  {
    n: "02",
    title: "What I wear",
    copy: "A Postiz T-shirt and cap at relevant meetings, events and conferences.",
  },
  {
    n: "03",
    title: "What I carry",
    copy: "A branded notebook, pen and water bottle in day-to-day professional settings.",
  },
  {
    n: "04",
    title: "Proof",
    copy: "A monthly photo log and activity summary documenting every meaningful appearance.",
  },
];

export default function PostizPresence() {
  return (
    <section className="relative container-edge py-28 md:py-40 border-t border-line">
      <Reveal>
        <h2 className="font-display font-light text-balance text-4xl md:text-6xl leading-[1.05] tracking-tightest2 max-w-2xl">
          Not an ad.
          <br />
          <span className="italic">A presence.</span>
        </h2>
      </Reveal>

      <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PILLARS.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.1}>
            <div className="neo-card rounded-[1.75rem] p-8 h-full min-h-[250px] flex flex-col gap-6">
              <span className="text-[13px] tracking-[0.18em] text-mute">
                {p.n}
              </span>
              <div className="mt-auto">
              <h3 className="font-display text-2xl mb-3">{p.title}</h3>
              <p className="text-mute text-balance">{p.copy}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
