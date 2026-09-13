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
        <div className="w-[92vw] max-w-[820px] h-[52vh]">
          {reduceMotion ? (
            <CSSMacBook progress={scrollYProgress} />
          ) : (
            <MacBookScene progress={scrollYProgress} interactive={false} />
          )}
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
      </div>
    </section>
  );
}