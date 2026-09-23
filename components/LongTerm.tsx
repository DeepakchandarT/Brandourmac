import { Reveal } from "./Reveal";
import { ArrowDown } from "lucide-react";

const STEPS = [
  "1 MacBook",
  "1 professional presence",
  "1 business",
  "An entire team",
];

export default function LongTerm() {
  return (
    <section className="relative container-edge py-28 md:py-40 border-t border-line">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div>
          <Reveal>
            <h2 className="font-display font-light text-balance text-4xl md:text-5xl leading-[1.1] tracking-tightest2 mb-8">
              And this could go beyond one MacBook.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg text-mute max-w-md mb-4 text-balance">
              I&rsquo;m currently building a business alongside my freelance
              work.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="text-lg text-mute max-w-md text-balance">
              If the company grows successfully, our confirmed sponsor could become a
              preferred partner as the team expands.
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col items-start gap-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-col items-start gap-3 w-full">
              <Reveal delay={i * 0.12}>
                <span
                  className={`font-display text-2xl md:text-3xl tracking-tightest2 ${
                    i === STEPS.length - 1 ? "italic text-bone" : "text-mute"
                  }`}
                >
                  {s}
                </span>
              </Reveal>
              {i < STEPS.length - 1 && (
                <ArrowDown className="w-4 h-4 text-mute ml-1" strokeWidth={1.25} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
