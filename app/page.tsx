import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import InteractiveMacBook from "@/components/InteractiveMacBook";
import Differentiator from "@/components/Differentiator";
import WhereItTravels from "@/components/WhereItTravels";
import About from "@/components/About";
import PostizPresence from "@/components/PostizPresence";
import MonthlyReports from "@/components/MonthlyReports";
import LongTerm from "@/components/LongTerm";
import Proposal from "@/components/Proposal";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import PrivateOffer from "@/components/PrivateOffer";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-ink text-bone">
      <Nav />
      <Hero />
      <InteractiveMacBook />
      <Differentiator />
      <WhereItTravels />
      <About />
      <PostizPresence />
      <MonthlyReports />
      <LongTerm />
      <Proposal />
      <FAQ />
      <FinalCTA />
      <PrivateOffer />
      <Footer />
    </main>
  );
}
