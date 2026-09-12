import { Reveal, Eyebrow } from "./Reveal";

export default function About() {
  return (
    <section className="relative container-edge py-28 md:py-40 border-t border-line">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div className="aspect-[4/5] w-full max-w-md mx-auto md:mx-0 border border-line relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-surface">
              <span className="text-[12px] tracking-[0.18em] text-mute">
                PHOTOGRAPH PLACEHOLDER
              </span>
            </div>
          </div>
        </Reveal>

        <div>
          <Eyebrow>WHO IS CARRYING THE BRAND?</Eyebrow>
          <Reveal>
            <p className="font-display font-light text-balance text-3xl md:text-4xl leading-[1.2] tracking-tightest2 mb-8">
              I&rsquo;m an India-based marketer working across freelance
              projects while building my own business.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg text-mute max-w-md text-balance">
              My MacBook is not simply a computer. It&rsquo;s where I work,
              meet clients, build products, attend events and develop the
              next stage of my career.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
