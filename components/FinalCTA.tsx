import { Reveal } from "./Reveal";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section
      id="final-cta"
      className="relative min-h-[90svh] flex flex-col items-center justify-center container-edge text-center border-t border-line"
    >
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
          href="mailto:hello@example.com?subject=Postiz%20%C3%97%20Deepak%20—%20Partnership"
          className="group mt-14 inline-flex items-center gap-3 text-sm tracking-[0.14em] bg-bone text-ink px-8 py-4 hover:bg-bone/85 transition-colors duration-500 focus-ring"
        >
          PARTNER WITH ME
          <ArrowRight
            className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </a>
      </Reveal>
    </section>
  );
}
