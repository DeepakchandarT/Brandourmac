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
import { getPublishedSponsor } from "@/lib/sponsor";
import { publicSponsor } from "@/lib/sponsor-types";
import { SponsorProvider } from "@/components/SponsorProvider";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const dynamic = "force-dynamic";

export default async function Home() {
  let published=false;
  let available=configured();
  const sponsorConfig=await getPublishedSponsor();
  try {published=await isPublished();} catch {available=false;}
  if(!published) return <SponsorProvider sponsor={publicSponsor(sponsorConfig)}><LaunchGate available={available}/></SponsorProvider>;
  // A homepage must never fail because the request cookie store is unavailable.
  // The offer API still performs the authoritative session check before saving.
  let sponsor=false;
  try { sponsor=!!readSession(cookies().get(SESSION_COOKIE)?.value); }
  catch { sponsor=false; }
  return (
    <SponsorProvider sponsor={publicSponsor(sponsorConfig)}><main className="relative bg-ink text-bone">
      <AnalyticsTracker/>
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
    </main></SponsorProvider>
  );
}
