"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const ITEMS = [
  "MacBook",
  "T-Shirt",
  "Water Bottle",
  "Cap",
  "Pen",
];

const CARD_WIDTH = 168;
const CARD_HEIGHT = 224;

export default function MerchCarousel() {
  const reduceMotion = useReducedMotion();
  const angleStep = 360 / ITEMS.length;
  const radius = useMemo(
    () => Math.round(CARD_WIDTH / 2 / Math.tan(Math.PI / ITEMS.length)),
    []
  );

  return (
    <div
      className="relative mx-auto"
      style={{ perspective: "1400px", height: CARD_HEIGHT + 60 }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          marginLeft: -CARD_WIDTH / 2,
          marginTop: -CARD_HEIGHT / 2,
          transformStyle: "preserve-3d",
        }}
        animate={reduceMotion ? undefined : { rotateY: -360 }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 26, repeat: Infinity, ease: "linear" }
        }
      >
        {ITEMS.map((item, i) => {
          const angle = angleStep * i;
          return (
            <div
              key={item}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 border border-linestrong bg-ink"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              <span className="text-[10px] tracking-[0.22em] text-mute">
                POSTIZ
              </span>
              <span className="font-display text-xl text-bone text-center px-4">
                {item}
              </span>
              <span className="text-[10px] tracking-[0.18em] text-mute">
                BRANDED SURFACE
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}