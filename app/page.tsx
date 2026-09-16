import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import InteractiveMacBook from "@/components/InteractiveMacBook";
import Differentiator from "@/components/Differentiator";
import WhereItTravels from "@/components/WhereItTravels";
import PostizPresence from "@/components/PostizPresence";
import MonthlyReports from "@/components/MonthlyReports";
import PrivateOffer from "@/components/PrivateOffer";
import Footer from "@/components/Footer";
import LaunchGate from "@/components/LaunchGate";
import OfferDock from "@/components/OfferDock";
import { cookies } from "next/headers";
import { configured, isPublished, readSession, SESSION_COOKIE } from "@/lib/campaign";

export const dynamic = "force-dynamic";

export default async function Home() {
  let published=false;
  let available=configured();
  try {published=await isPublished();} catch {available=false;}
  if(!published) return <LaunchGate available={available}/>;
  const sponsor=!!readSession(cookies().get(SESSION_COOKIE)?.value);
  return (
    <main className="relative bg-ink text-bone">
      <Nav />
      <Hero />
      <InteractiveMacBook />
      <Differentiator />
      <WhereItTravels />
      <PostizPresence />
      <MonthlyReports />
      <PrivateOffer initialUnlocked={sponsor}/>
      <Footer />
      <OfferDock/>
    </main>
  );
}
