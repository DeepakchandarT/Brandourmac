import { Reveal } from "./Reveal";
import MerchCarousel from "./MerchCarousel";

export default function Differentiator() {
  return (
    <section className="relative container-edge py-28 md:py-40 border-t border-line">
      <div className="grid md:grid-cols-2 gap-16 md:gap-8 items-center">
        <div>
          <Reveal>
            <h2 className="font-display font-light text-balance text-4xl md:text-6xl leading-[1.05] tracking-tightest2">
              You tried to win one spot.
              <br />
              <span className="italic">I&rsquo;m offering you all of them.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 text-lg text-mute max-w-md text-balance">
              Instead of occupying a single advertising position, Postiz would
              receive the complete branding surface of my MacBook — and every
              piece of branded merch that goes with it.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <MerchCarousel />
        </Reveal>
      </div>
    </section>
  );
}