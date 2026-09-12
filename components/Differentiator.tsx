"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Reveal } from "./Reveal";

const CELLS = Array.from({ length: 16 }, (_, i) => i + 1);

function GridCell({
  n,
  scrollYProgress,
  start,
  end,
}: {
  n: number;
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const progress = useTransform(scrollYProgress, [start, end], [0, 1]);
  const rotateX = useTransform(progress, [0, 0.5, 1], [0, 90, 0]);
  const numberOpacity = useTransform(progress, [0.45, 0.55], [1, 0]);
  const brandOpacity = useTransform(progress, [0.45, 0.55], [0, 1]);

  return (
    <div
      className="aspect-square border border-line flex items-center justify-center relative overflow-hidden"
      style={{ perspective: 400 }}
    >
      <motion.span
        style={{ rotateX, opacity: numberOpacity }}
        className="font-display text-sm md:text-lg text-mute"
      >
        {String(n).padStart(2, "0")}
      </motion.span>
      <motion.span
        style={{ opacity: brandOpacity }}
        className="absolute inset-0 flex items-center justify-center text-[9px] md:text-[11px] tracking-[0.14em] text-bone font-medium"
      >
        POSTIZ
      </motion.span>
    </div>
  );
}

export default function Differentiator() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.3"],
  });

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
              receive the complete branding surface of my MacBook.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="grid grid-cols-4 gap-2 md:gap-3">
          {CELLS.map((n, i) => {
            const start = 0.1 + (i / CELLS.length) * 0.7;
            const end = start + 0.12;
            return (
              <GridCell
                key={n}
                n={n}
                scrollYProgress={scrollYProgress}
                start={start}
                end={end}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
