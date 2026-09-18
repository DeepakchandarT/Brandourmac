"use client";
import { useSponsor } from "./SponsorProvider";

const PILLARS = [
  { title: "Owned", copy: "All 16 MacBook spaces" },
  { title: "Worn", copy: "The Postiz T-shirt" },
  { title: "Carried", copy: "Pen, notebook and bottle" },
  { title: "Proved", copy: "A monthly photo record" },
];

export default function PostizPresence() {
  const sponsor=useSponsor();
  const pillars=PILLARS.map(p=>p.title==="Worn"?{...p,copy:`The ${sponsor.name} T-shirt`}:p);
  return <section className="container-edge border-t border-line presence-section">
    <h2 className="section-title">Worn. Carried.<br /><span className="text-accent">Remembered.</span></h2>
    <dl className="presence-list">{pillars.map(p => <div key={p.title}><dt>{p.title}</dt><dd>{p.copy}</dd></div>)}</dl>
  </section>;
}
