import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  return <section id="top" className="hero-copy container-edge">
    <h1>Don&rsquo;t rent a corner.<br/><span>Own the canvas.</span></h1>
    <p>All 16 MacBook spaces. One brand. Twelve months.</p>
    <a className="primary-action focus-ring" href="#private-offer">Claim all 16 <ArrowUpRight size={17} aria-hidden="true"/></a>
  </section>;
}
