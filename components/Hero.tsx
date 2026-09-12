"use client";

import { motion, useMotionValue } from "framer-motion";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/useMediaQuery";
import StaticMacBook from "./StaticMacBook";

const MacBookScene = dynamic(() => import("./MacBookScene"), { ssr: false });

export default function Hero() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const staticProgress = useMotionValue(0);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden"
    >
      {/* MacBook visual layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[92vw] max-w-[900px] h-[60vh] opacity-90 translate-y-8 md:translate-y-16">
          {isMobile ? (
            <div className="pointer-events-none">
              <StaticMacBook />
            </div>
          ) : (
            <div className="pointer-events-auto w-full h-full">
              <MacBookScene progress={staticProgress} interactive />
            </div>
          )}
        </div>
      </div>

      {/* gradient wash for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink pointer-events-none" />

      <div className="relative container-edge pt-40 md:pt-48 flex-1 flex flex-col items-center text-center">
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
          Premium doesn&rsquo;t compete.
          <br />
          <span className="italic">It just wins.</span>
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="relative container-edge pb-12 flex justify-center"
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
