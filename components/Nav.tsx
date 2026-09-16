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
  const bg = useTransform(scrollY, [0, 120],["rgba(250,250,250,0.97)", "rgba(250,250,250,1)"] );
  const borderOpacity = useTransform(scrollY, [0, 120], [0, 0.08]);
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      style={{ backgroundColor: bg }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-white/95"
    >
      <motion.div
        style={{ opacity: borderOpacity }}
        className="absolute bottom-0 left-0 right-0 h-px bg-white"
      />
      <nav className="px-5 md:px-8 flex items-center justify-between h-16 md:h-[4.5rem]">
        <a
          href="#top"
          className="text-sm tracking-[0.25em] font-medium text-bone focus-ring"
        >
          DEEPAK × POSTIZ
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
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="md:hidden flex flex-col justify-center gap-1.5 w-11 h-11 px-2 focus-ring"
          aria-controls="mobile-navigation"
        >
          <span
            className={`h-px bg-bone transition-transform duration-300 ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px bg-bone transition-opacity duration-300 ${
              open ? "-translate-y-[4px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {open && (
        <div id="mobile-navigation" className="md:hidden container-edge pb-8 flex flex-col gap-5 border-t border-line pt-6">
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
