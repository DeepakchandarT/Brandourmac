"use client";

import { motion } from "framer-motion";
import { Reveal, Eyebrow } from "./Reveal";

const CATEGORIES = [
  "Client meetings",
  "Startup events",
  "Tech conferences",
  "Community meetings",
  "Investor gatherings",
  "Freelance projects",
];

// Abstract, non-literal marker positions — not tied to real cities or data.
const MARKERS = [
  { x: "18%", y: "38%" },
  { x: "32%", y: "62%" },
  { x: "48%", y: "28%" },
  { x: "61%", y: "55%" },
  { x: "74%", y: "35%" },
  { x: "85%", y: "60%" },
];

export default function WhereItTravels() {
  return (
    <section id="journey" className="relative container-edge py-28 md:py-40 border-t border-line">
      <Eyebrow>THE JOURNEY</Eyebrow>
      <Reveal>
        <h2 className="font-display font-light text-balance text-4xl md:text-6xl leading-[1.05] tracking-tightest2 max-w-2xl">
          Your brand doesn&rsquo;t stay on a desk.
          <br />
          <span className="italic">It travels with me.</span>
        </h2>
      </Reveal>

      <div className="mt-20 grid md:grid-cols-[1.4fr_1fr] gap-16 items-center">
        <Reveal delay={0.1}>
          <div className="relative aspect-[16/10] border border-line overflow-hidden">
            {/* faint world grid instead of a literal map with fabricated data */}
            <div
              className="absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage:
                  "linear-gradient(to right , #131313 1px, transparent 1px), linear-gradient(to bottom, #131313 1px, transparent 1px)",
                backgroundSize: "5% 10%",
              }}
            />
            {MARKERS.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2"
                style={{ left: m.x, top: m.y }}
              >
                <span className="absolute inset-0 rounded-full bg-accent" />
                <motion.span
                  className="absolute inset-0 rounded-full bg-accent"
                  animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <ul className="flex flex-col gap-5">
            {CATEGORIES.map((c) => (
              <li
                key={c}
                className="flex items-center gap-4 pb-5 border-b border-line last:border-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span className="text-lg text-bone">{c}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
