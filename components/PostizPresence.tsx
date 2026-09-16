const PILLARS = [
  { title: "Owned", copy: "All 16 MacBook spaces" },
  { title: "Worn", copy: "The Postiz T-shirt" },
  { title: "Carried", copy: "Pen, notebook and bottle" },
  { title: "Proved", copy: "A monthly photo record" },
];

export default function PostizPresence() {
  return <section className="container-edge border-t border-line presence-section">
    <h2 className="section-title">Worn. Carried.<br /><span className="text-accent">Remembered.</span></h2>
    <dl className="presence-list">{PILLARS.map(p => <div key={p.title}><dt>{p.title}</dt><dd>{p.copy}</dd></div>)}</dl>
  </section>;
}
