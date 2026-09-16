"use client";

import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

const BOOKS = [
  {
    label: "Business meetings",
    detail: "Across the table",
    className: "w-[82%] -rotate-[1.5deg] bg-[#ece9e0]",
    x: -8,
  },
  {
    label: "Startup events",
    detail: "Among builders",
    className: "ml-[7%] w-[88%] rotate-[1deg] bg-[#f9f7f1]",
    x: 12,
  },
  {
    label: "Client work",
    detail: "Where decisions happen",
    className: "ml-[2%] w-[78%] -rotate-[0.5deg] bg-[#e8e4da]",
    x: -10,
  },
  {
    label: "Tech conferences",
    detail: "In the room",
    className: "ml-[10%] w-[86%] rotate-[1.5deg] bg-[#fffdf8]",
    x: 8,
  },
];

function BookSpine({
  book,
  index,
  progress,
  reduceMotion,
}: {
  book: (typeof BOOKS)[number];
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const start = 0.35 + index * 0.09;
  const end = Math.min(start + 0.18, 0.95);
  const labelOpacity = useTransform(progress, [start, end], [0, 1]);
  const labelX = useTransform(progress, [start, end], [14, 0]);
  const bookX = useTransform(progress, [0, 0.72], [book.x, 0]);

  return (
    <motion.div
      className={`relative h-[68px] origin-center rounded-[8px_13px_13px_8px] shadow-[10px_13px_24px_rgba(184,178,166,0.42),-7px_-7px_18px_rgba(255,255,255,0.78)] sm:h-[82px] ${book.className}`}
      style={{ x: reduceMotion ? 0 : bookX }}
    >
      <div className="absolute inset-y-2 left-3 w-px bg-black/10" />
      <div className="absolute inset-y-[7px] right-2 w-[5px] rounded-full bg-black/[0.05]" />
      <motion.div
        className="flex h-full items-center justify-between gap-3 px-7 sm:px-9"
        style={{
          opacity: reduceMotion ? 1 : labelOpacity,
          x: reduceMotion ? 0 : labelX,
        }}
      >
        <span className="font-display text-base text-bone sm:text-xl">
          {book.label}
        </span>
        <span className="hidden text-[9px] uppercase tracking-[0.16em] text-mute sm:block">
          {book.detail}
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function PresenceBookStack() {
  const root = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start 88%", "center 46%"],
  });

  const uprightRotate = useTransform(scrollYProgress, [0, 0.72], [-5, 10]);
  const uprightX = useTransform(scrollYProgress, [0, 0.72], [-20, 8]);
  const uprightY = useTransform(scrollYProgress, [0, 0.72], [18, 0]);
  const stackX = useTransform(scrollYProgress, [0, 0.75], [24, 0]);
  const stackY = useTransform(scrollYProgress, [0, 0.75], [26, 0]);
  const stackRotate = useTransform(scrollYProgress, [0, 0.75], [2.5, 0]);
  const uprightLabelOpacity = useTransform(scrollYProgress, [0.34, 0.58], [0, 1]);
  const captionOpacity = useTransform(scrollYProgress, [0.68, 0.9], [0, 1]);

  return (
    <div
      ref={root}
      className="neo-inset relative min-h-[470px] overflow-hidden rounded-[2rem] px-5 pb-9 pt-16 sm:min-h-[540px] sm:px-10 sm:pb-12"
      aria-label="Where Postiz will be present"
    >
      <div className="pointer-events-none absolute left-[12%] top-[12%] h-52 w-52 rounded-full bg-accent/[0.08] blur-3xl" />

      <div className="relative mx-auto flex min-h-[380px] max-w-[620px] items-end justify-center sm:min-h-[440px]">
        <motion.div
          className="relative z-20 mb-2 mr-[-18px] h-[290px] w-[82px] origin-bottom-right rounded-[11px_11px_6px_6px] bg-accent shadow-[12px_18px_34px_rgba(83,72,193,0.22)] sm:h-[355px] sm:w-[104px]"
          style={
            reduceMotion
              ? { rotate: 10, x: 8, y: 0 }
              : { rotate: uprightRotate, x: uprightX, y: uprightY }
          }
        >
          <div className="absolute inset-y-0 left-2 w-px bg-white/25" />
          <div className="absolute inset-y-0 right-2 w-px bg-black/10" />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: reduceMotion ? 1 : uprightLabelOpacity }}
          >
            <span className="whitespace-nowrap font-display text-lg text-white [writing-mode:vertical-rl] sm:text-xl">
              Postiz in the room
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative z-10 flex w-[72%] flex-col-reverse items-center gap-1 pb-1 sm:w-[76%]"
          style={
            reduceMotion
              ? { x: 0, y: 0, rotate: 0 }
              : { x: stackX, y: stackY, rotate: stackRotate }
          }
        >
          {BOOKS.map((book, index) => (
            <BookSpine
              key={book.label}
              book={book}
              index={index}
              progress={scrollYProgress}
              reduceMotion={reduceMotion}
            />
          ))}
        </motion.div>
      </div>

      <motion.p
        className="relative z-30 mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-mute"
        style={{ opacity: reduceMotion ? 1 : captionOpacity }}
      >
        One brand, carried into every room where work and opportunity happen.
      </motion.p>
    </div>
  );
}
