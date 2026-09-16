const PILLARS = [
  { title: "Laptop", copy: "Every one of the 16 available MacBook surfaces belongs to Postiz." },
  { title: "What I wear", copy: "A Postiz T-shirt and cap at relevant meetings, events and conferences." },
  { title: "What I carry", copy: "A branded notebook, pen and water bottle in day-to-day professional settings." },
  { title: "Proof", copy: "A monthly photo log and activity summary documenting every meaningful appearance." },
];

export default function PostizPresence() {
  return <section className="container-edge border-t border-line presence-section">
    <h2 className="section-title">Not an ad.<br /><span className="text-accent">A presence.</span></h2>
    <dl className="presence-list">{PILLARS.map(p => <div key={p.title}><dt>{p.title}</dt><dd>{p.copy}</dd></div>)}</dl>
  </section>;
}
