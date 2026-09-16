import { Reveal } from "./Reveal";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section
      id="final-cta"
      className="relative min-h-[90svh] flex flex-col items-center justify-center container-edge text-center border-t border-line overflow-hidden"
    >
      <div className="pointer-events-none absolute h-[34rem] w-[34rem] rounded-full bg-accent/[0.09] blur-3xl" />
      <div className="neo-panel relative rounded-[2.5rem] px-7 py-16 md:px-20 md:py-24 w-full max-w-5xl">
      <Reveal>
        <p className="text-[13px] tracking-[0.22em] text-mute mb-10">
          POSTIZ × DEEPAK
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 className="font-display font-light text-balance text-[11vw] leading-[0.98] md:text-7xl tracking-tightest2 max-w-4xl">
          Let&rsquo;s make it impossible
          <br />
          <span className="italic">to miss.</span>
        </h2>
      </Reveal>

      <Reveal delay={0.25}>
        <a
          href="#private-offer"
          className="neo-button accent-glow group mt-14 inline-flex items-center gap-3 rounded-full text-sm tracking-[0.14em] px-8 py-4 focus-ring"
        >
          OPEN PRIVATE INVITATION
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
