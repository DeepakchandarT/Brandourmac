"use client";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import PostizLogo from "./PostizLogo";
import InvitationForm from "./InvitationForm";
import { SponsorName, trackSponsorClick, useSponsor } from "./SponsorProvider";

export default function LaunchGate({ available }: { available:boolean }) {
  const sponsor=useSponsor();
  return <main className="launch-gate">
    <header className="gate-header"><span>DEEPAK ×</span><PostizLogo/></header>
    <div className="gate-content">
      <LockKeyhole size={23} strokeWidth={1.3} className="gate-lock"/>
      <h1>Don&rsquo;t rent a corner.<br/>Own the canvas.</h1>
      <p>A private proposal for <SponsorName/>.</p>
      <InvitationForm launch onSuccess={()=>window.location.assign("/")}/>
      <p className="gate-disclosure">Open once. View publicly. Quote privately.</p>
      {!available&&<p className="gate-status" role="status">The invitation is being prepared. Please check back shortly.</p>}
    </div>
    <footer><span>Made for <SponsorName/>. Carried by Deepak.</span><a href={sponsor.website} target="_blank" rel="noopener noreferrer" onClick={trackSponsorClick}>Discover <SponsorName/> <ArrowUpRight size={14}/></a></footer>
  </main>;
}
