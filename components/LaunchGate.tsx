"use client";
import { LockKeyhole } from "lucide-react";
import Image from "next/image";
import InvitationForm from "./InvitationForm";

export default function LaunchGate({ available }: { available:boolean }) {
  return <main className="launch-gate">
    <header className="gate-header"><a href="/" aria-label="BrandMyReach home"><Image src="/brand/brandmyreach-wordmark.png" alt="BrandMyReach" width={225} height={54} priority/></a></header>
    <div className="gate-content">
      <LockKeyhole size={23} strokeWidth={1.3} className="gate-lock"/>
      <h1>Don&rsquo;t rent a corner.<br/>Own the canvas.</h1>
      <p>An exclusive sponsorship opportunity. One brand receives the complete BrandMyReach presence.</p>
      <InvitationForm launch onSuccess={()=>window.location.assign("/")}/>
      <p className="gate-disclosure">Open once. View publicly. Quote privately.</p>
      {!available&&<p className="gate-status" role="status">The invitation is being prepared. Please check back shortly.</p>}
    </div>
    <footer><span>One brand. Every spot. One exclusive partnership.</span><span className="gate-footer-lock"><LockKeyhole size={13} aria-hidden="true"/> Private invitation</span></footer>
  </main>;
}
