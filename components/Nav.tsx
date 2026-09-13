"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

const LINKS = [
  { label: "The Idea", href: "#idea" },
  { label: "The Journey", href: "#journey" },
  { label: "Partner", href: "#proposal" },
];

export default function Nav() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 120],["rgba(246,244,239,0)", "rgba(246,244,239,0.82)"] );
  const borderOpacity = useTransform(scrollY, [0, 120], [0, 0.08]);
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      style={{ backgroundColor: bg }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
    >
      <motion.div
        style={{ opacity: borderOpacity }}
        className="absolute bottom-0 left-0 right-0 h-px bg-white"
      />
      <nav className="container-edge flex items-center justify-between h-20">
        <a
          href="#top"
          className="text-sm tracking-[0.25em] font-medium text-bone focus-ring"
        >
          DEEPAK
        </a>

        <ul className="hidden md:flex items-center gap-10">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-[13px] tracking-[0.12em] text-mute hover:text-bone transition-colors duration-300 focus-ring"
              >
                {l.label.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="md:hidden flex flex-col gap-1.5 w-6 focus-ring"
        >
          <span
            className={`h-px bg-bone transition-transform duration-300 ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px bg-bone transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
        </button>
      </nav>

      {open && (
        <div className="md:hidden container-edge pb-8 flex flex-col gap-5 border-t border-line pt-6">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm tracking-[0.12em] text-mute"
            >
              {l.label.toUpperCase()}
            </a>
          ))}
        </div>
      )}
    </motion.header>
  );
}
