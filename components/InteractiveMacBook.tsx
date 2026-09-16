"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import CSSMacBook from "./CSSMacBook";

const MacBookScene = dynamic(() => import("./MacBookScene"), { ssr: false });

export default function InteractiveMacBook() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const labelOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);
  const labelY = useTransform(scrollYProgress, [0.75, 0.9], [16, 0]);

  return (
    <section id="idea" ref={ref} className="relative h-[320vh] bg-ink">
      <div className="sticky top-0 h-[100svh] flex flex-col items-center justify-center overflow-hidden">
        <div className="neo-inset rounded-[2.25rem] w-[92vw] max-w-[900px] h-[56vh] p-3 md:p-6">
          <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-ink">
          {reduceMotion ? (
            <CSSMacBook progress={scrollYProgress} />
          ) : (
            <MacBookScene progress={scrollYProgress} interactive={false} />
          )}
          <div className="pointer-events-none absolute left-5 top-5 rounded-full bg-ink/80 px-4 py-2 text-[10px] tracking-[0.18em] text-mute backdrop-blur">
            SCROLL TO REVEAL
          </div>
          </div>
        </div>

        <motion.div
          style={{ opacity: labelOpacity, y: labelY }}
          className="absolute bottom-16 md:bottom-24 text-center container-edge"
        >
          <p className="font-display italic text-2xl md:text-4xl mb-2">
            16 spots. One brand.
          </p>
          <p className="text-4xl md:text-6xl font-display font-light tracking-tightest2 mb-3">
            16 / 16
          </p>
          <p className="text-[13px] tracking-[0.18em] text-mute">
            DEDICATED TO POSTIZ
          </p>
        </motion.div>

        <div className="pointer-events-none absolute left-1/2 top-24 hidden w-[min(86vw,880px)] -translate-x-1/2 items-center justify-between md:flex">
          {["01  CLAIM THE LID", "02  OPEN THE STORY", "03  CARRY THE BRAND"].map((label) => (
            <span key={label} className="text-[10px] tracking-[0.18em] text-mute">
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
