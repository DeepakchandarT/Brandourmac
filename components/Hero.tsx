"use client";

import { motion, useMotionValue } from "framer-motion";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import CSSMacBook from "./CSSMacBook";

const MacBookScene = dynamic(() => import("./MacBookScene"), { ssr: false });

export default function Hero() {
  const reduceMotion = usePrefersReducedMotion();
  const staticProgress = useMotionValue(0);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden"
    >
      <div className="relative container-edge pt-40 md:pt-48 flex-1 flex flex-col items-center text-center z-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[13px] tracking-[0.22em] text-mute mb-8"
        >
          A BRAND PARTNERSHIP PROPOSAL
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-light text-balance text-[13vw] leading-[0.98] md:text-[6.4vw] tracking-tightest2"
        >
          <span className="text-bone/40">Premium doesn&rsquo;t compete.</span>
          <br />
          <span
            className="italic text-bone"
            style={{ textShadow: "0 6px 24px rgba(70,64,222,0.35), 0 2px 0 rgba(19,19,19,0.15)" }}
          >
            It just wins.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-lg md:text-xl text-mute max-w-md text-balance"
        >
          One MacBook. One brand. Everywhere I go.
        </motion.p>
      </div>

      {/* MacBook visual layer — sits below the copy, never overlapping it */}
      <div className="relative z-0 flex items-center justify-center h-[34vh] md:h-[38vh] mt-6">
        {reduceMotion ? (
          <div className="pointer-events-none w-full h-full opacity-95">
            <CSSMacBook progress={staticProgress} brandedWhenOpen={false} />
          </div>
        ) : (
          <div className="pointer-events-auto w-[80vw] max-w-[620px] h-full">
            <MacBookScene progress={staticProgress} interactive />
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="relative z-10 container-edge pb-12 flex justify-center"
      >
        <a
          href="#idea"
          className="text-[12px] tracking-[0.2em] text-mute hover:text-bone transition-colors duration-300 focus-ring"
        >
          EXPLORE THE IDEA ↓
        </a>
      </motion.div>
    </section>
  );
}