import { Reveal } from "./Reveal";
import PresenceBookStack from "./PresenceBookStack";

export default function WhereItTravels() {
  return (
    <section id="journey" className="relative container-edge py-28 md:py-40 border-t border-line">
      <Reveal>
        <h2 className="font-display font-light text-balance text-4xl md:text-6xl leading-[1.05] tracking-tightest2 max-w-2xl">
          Your brand doesn&rsquo;t stay on a desk.
          <br />
          <span className="italic">It travels with me.</span>
        </h2>
      </Reveal>

      <div className="mt-9 grid items-center gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
        <Reveal delay={0.1}>
          <div className="max-w-lg">
            <p className="text-lg leading-relaxed text-mute text-balance">
              Postiz becomes part of the objects I carry and the rooms I enter.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-mute text-balance">
              From client work to startup events, the partnership travels with
              me. Monthly documentation records the actual appearances.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <PresenceBookStack />
        </Reveal>
      </div>
    </section>
  );
}
