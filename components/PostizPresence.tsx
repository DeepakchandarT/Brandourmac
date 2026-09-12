import { Reveal } from "./Reveal";

const PILLARS = [
  {
    n: "01",
    title: "Laptop",
    copy: "Postiz branding across all 16 available surfaces.",
  },
  {
    n: "02",
    title: "Apparel",
    copy: "Postiz-branded apparel at appropriate professional events.",
  },
  {
    n: "03",
    title: "Documentation",
    copy: "Monthly photographs documenting where the brand travels.",
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

      <div className="mt-20 grid md:grid-cols-3 gap-px bg-line">
        {PILLARS.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.1}>
            <div className="bg-ink p-10 h-full flex flex-col gap-6">
              <span className="text-[13px] tracking-[0.18em] text-mute">
                {p.n}
              </span>
              <h3 className="font-display text-2xl">{p.title}</h3>
              <p className="text-mute text-balance">{p.copy}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
