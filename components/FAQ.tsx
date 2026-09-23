"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "./Reveal";

const ITEMS = [
  {
    q: "Where will the laptop be used?",
    a: "Freelance work, professional meetings, conferences, community events, startup activities and other relevant professional environments.",
  },
  {
    q: "How will exposure be documented?",
    a: "Monthly photographs and an accompanying activity summary.",
  },
  {
    q: "How long is the partnership?",
    a: "Proposed initial term: 12 months.",
  },
  {
    q: "Will there be more than one sponsor?",
    a: "No. Any suitable company can submit a private proposal, and one confirmed sponsor receives all 16 available branding spaces.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-7 text-left focus-ring"
        aria-expanded={open}
        aria-controls={id}
      >
        <span className="text-lg md:text-xl text-bone pr-8">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0"
        >
          <Plus className="w-5 h-5 text-mute" strokeWidth={1.25} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-mute pb-7 max-w-xl text-balance">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="relative container-edge py-28 md:py-40 border-t border-line">
      <Reveal>
        <h2 className="section-title mb-8">
          A few things worth clarifying.
        </h2>
      </Reveal>

      <div className="max-w-3xl flex flex-col">
        {ITEMS.map((item) => (
          <FAQItem key={item.q} {...item} />
        ))}
      </div>
    </section>
  );
}
