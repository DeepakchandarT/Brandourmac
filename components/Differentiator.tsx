import { Reveal } from "./Reveal";
import MerchCarousel from "./MerchCarousel";

export default function Differentiator() {
  return (
    <section className="relative container-edge collection-section border-t border-line">
      <div className="collection-layout">
        <div className="collection-copy">
          <Reveal>
            <h2 className="collection-heading font-display font-light">
              You bid for one space.
              <br />
              <span className="italic">I&rsquo;m offering you the whole stage.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="collection-description text-mute">
              All 16 placements. The full everyday kit. One exclusive partnership.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.25} className="collection-visual">
          <MerchCarousel />
        </Reveal>
      </div>
    </section>
  );
}
