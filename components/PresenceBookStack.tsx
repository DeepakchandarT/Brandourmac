"use client";

import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

const BOOKS = [
  {
    label: "Business meetings",
    detail: "Across the table",
    className: "w-[94%]",
    tone: "#e4e1ee",
    x: -8,
  },
  {
    label: "Client presentations",
    detail: "Where work is won",
    className: "ml-[4%] w-[96%]",
    tone: "#f7f6fa",
    x: 12,
  },
  {
    label: "Startup events",
    detail: "Among builders",
    className: "ml-[1%] w-[93%]",
    tone: "#dedbea",
    x: -10,
  },
  {
    label: "College events",
    detail: "Across campus",
    className: "ml-[6%] w-[92%]",
    tone: "#faf9fc",
    x: 8,
  },
  {
    label: "Campus communities",
    detail: "Student networks",
    className: "ml-[2%] w-[95%]",
    tone: "#e9e6f2",
    x: -6,
  },
  {
    label: "Workshops & hackathons",
    detail: "Where ideas ship",
    className: "ml-[5%] w-[94%]",
    tone: "#f5f3f8",
    x: 10,
  },
  {
    label: "Conferences",
    detail: "Beyond campus",
    className: "w-[96%]",
    tone: "#dedbea",
    x: -4,
  },
  {
    label: "Travel days",
    detail: "Everywhere between",
    className: "ml-[3%] w-[92%]",
    tone: "#faf9fc",
    x: 7,
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
  const start = 0.05 + index * 0.055;
  const impact = start + 0.17;
  const rebound = impact + 0.055;
  const settle = impact + 0.13;
  const labelOpacity = useTransform(progress, [impact, settle + 0.09], [0, 1]);
  const labelX = useTransform(progress, [impact, settle + 0.09], [18, 0]);
  const initialY = -260 - index * 34;
  const initialX = book.x + (index % 2 ? 34 : -28);
  const finalRotate = index % 2 ? 0.8 : -0.9;
  const bookX = useTransform(progress, [0, start, impact, rebound, settle, 1], [initialX, initialX, book.x, book.x + (index % 2 ? 5 : -5), book.x, book.x]);
  const bookY = useTransform(progress, [0, start, impact, rebound, settle, 1], [initialY, initialY, 9, -6, 0, 0]);
  const bookRotate = useTransform(progress, [0, start, impact, rebound, settle, 1], [index % 2 ? 8 : -10, index % 2 ? 8 : -10, finalRotate * 1.8, finalRotate * -.5, finalRotate, finalRotate]);

  return (
    <motion.div
      className={`book-spine ${book.className}`}
      style={{ background: book.tone, x: reduceMotion ? book.x : bookX, y:reduceMotion?0:bookY,rotate:reduceMotion?finalRotate:bookRotate }}
    >
      <span className="book-cover-edge" aria-hidden="true" />
      <span className="book-page-block" aria-hidden="true" />
      <span className="book-spine-band" aria-hidden="true" />
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

  const progress=useSpring(scrollYProgress,{stiffness:90,damping:25,mass:.7});
  const uprightRotate = useTransform(progress, [0,.4,.57,.68,1], [-8,-8,16,11,11]);
  const uprightX = useTransform(progress, [0,.52,.7,1], [-8,-8,2,2]);
  const uprightY = useTransform(progress, [0,.45,1], [0,0,0]);
  const stackX = useTransform(progress, [0,.58,.72,1], [0,0,8,8]);
  const stackY = useTransform(progress, [0,.58,.64,.76,1], [0,0,-5,0,0]);
  const stackRotate = useTransform(progress, [0,.58,.64,.76,1], [0,0,.9,0,0]);
  const uprightLabelOpacity = useTransform(progress, [.48,.68], [.15,1]);
  const captionOpacity = useTransform(progress, [.62,.82], [.3,1]);
  const routeLength = useTransform(progress, [.05,.8], [0,1]);
  const routeOpacity = useTransform(progress, [.03,.12,.86,1], [0,.45,.45,0]);

  return (
    <div
      ref={root}
      className="book-stage"
      aria-label="Where Postiz will be present"
    >
      <motion.svg className="book-route" viewBox="0 0 620 430" aria-hidden="true" style={{opacity:reduceMotion?0:routeOpacity}}>
        <defs><marker id="route-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5148e5"/></marker></defs>
        <motion.path d="M 560 36 C 430 12 384 104 440 155 C 500 210 464 278 355 300" fill="none" stroke="#5148e5" strokeWidth="1.5" strokeDasharray="3 8" markerEnd="url(#route-arrow)" style={{pathLength:reduceMotion?1:routeLength}}/>
      </motion.svg>
      <div className="book-assembly">
        <motion.div
          className="book-upright"
          style={
            reduceMotion
              ? { rotate: 11, x: 0, y: 0 }
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
              Postiz goes with me
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
              progress={progress}
              reduceMotion={reduceMotion}
            />
          ))}
        </motion.div>
      </div>

      <motion.p
        className="relative z-30 mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-mute"
        style={{ opacity: reduceMotion ? 1 : captionOpacity }}
      >
        From campus to client rooms—Postiz travels with me.
      </motion.p>
    </div>
  );
}
