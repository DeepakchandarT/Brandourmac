import { ArrowUpRight } from "lucide-react";
import LiveActivity from "./LiveActivity";

export default function Hero({ fundsRaised = 0, fundingCurrency = "USD" }: { fundsRaised?: number; fundingCurrency?: "USD" | "EUR" | "INR" }) {
  const amountLabel = fundsRaised === 0 ? "$0" : new Intl.NumberFormat(fundingCurrency === "INR" ? "en-IN" : "en-US", {
    style: "currency", currency: fundingCurrency, minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(fundsRaised);
  return <section id="top" className="hero-copy container-edge">
    <LiveActivity />
    <h1>Don&rsquo;t rent a corner.<br/><span>Own the canvas.</span></h1>
    <p>All 16 MacBook spaces. One brand. Twelve months.</p>
    <div className="hero-funding" aria-label="Sponsorship funding status">
      <strong>{amountLabel} raised</strong>
      <span>One exclusive partnership · 16/16 available</span>
    </div>
    <a className="primary-action focus-ring" href="#private-offer">Submit a proposal <ArrowUpRight size={17} aria-hidden="true"/></a>
  </section>;
}
