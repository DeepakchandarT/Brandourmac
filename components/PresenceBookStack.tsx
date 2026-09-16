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
    className: "w-[95%] -rotate-[1.5deg] bg-[#e2e0eb]",
    x: -8,
  },
  {
    label: "Startup events",
    detail: "Among builders",
    className: "ml-[4%] w-[96%] rotate-[1deg] bg-[#f5f4f9]",
    x: 12,
  },
  {
    label: "Client work",
    detail: "Where decisions happen",
    className: "ml-[1%] w-[94%] -rotate-[0.5deg] bg-[#dbd9e7]",
    x: -10,
  },
  {
    label: "Tech conferences",
    detail: "In the room",
    className: "ml-[5%] w-[95%] rotate-[1.5deg] bg-[#fbfaff]",
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
      className={`book-spine ${book.className}`}
      style={{ x: reduceMotion ? 0 : bookX }}
    >
      <div className="absolute inset-y-2 left-3 w-px bg-black/10" />
      <div className="absolute inset-y-[7px] right-2 w-[5px] rounded-full bg-black/[0.05]" />
      <motion.div
        className="book-label"
        style={{
          opacity: reduceMotion ? 1 : labelOpacity,
          x: reduceMotion ? 0 : labelX,
        }}
      >
        <span>
          {book.label}
        </span>
        <span className="book-detail">
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

  const uprightRotate = useTransform(scrollYProgress, [0, 0.72], [-5, 7]);
  const uprightX = useTransform(scrollYProgress, [0, 0.72], [-8, 0]);
  const uprightY = useTransform(scrollYProgress, [0, 0.72], [18, 0]);
  const stackX = useTransform(scrollYProgress, [0, 0.75], [24, 0]);
  const stackY = useTransform(scrollYProgress, [0, 0.75], [26, 0]);
  const stackRotate = useTransform(scrollYProgress, [0, 0.75], [2.5, 0]);
  const uprightLabelOpacity = useTransform(scrollYProgress, [0.34, 0.58], [0, 1]);
  const captionOpacity = useTransform(scrollYProgress, [0.68, 0.9], [0, 1]);

  return (
    <div
      ref={root}
      className="book-stage"
      aria-label="Where Postiz will be present"
    >
      <div className="book-assembly">
        <motion.div
          className="book-upright"
          style={
            reduceMotion
              ? { rotate: 7, x: 0, y: 0 }
              : { rotate: uprightRotate, x: uprightX, y: uprightY }
          }
        >
          <div className="absolute inset-y-0 left-2 w-px bg-white/25" />
          <div className="absolute inset-y-0 right-2 w-px bg-black/10" />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: reduceMotion ? 1 : uprightLabelOpacity }}
          >
            <span className="whitespace-nowrap text-sm text-white [writing-mode:vertical-rl] sm:text-base">
              Postiz in the room
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="book-pile"
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
