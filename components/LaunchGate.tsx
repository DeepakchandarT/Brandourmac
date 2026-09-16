"use client";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import PostizLogo from "./PostizLogo";
import InvitationForm from "./InvitationForm";

export default function LaunchGate({ available }: { available:boolean }) {
  return <main className="launch-gate">
    <header className="gate-header"><span>DEEPAK ×</span><PostizLogo/></header>
    <div className="gate-content">
      <LockKeyhole size={23} strokeWidth={1.3} className="gate-lock"/>
      <h1>You launched<br/>to stand out.</h1>
      <p>Now own the whole canvas.<br/>A private proposal created for Postiz.</p>
      <InvitationForm launch onSuccess={()=>window.location.assign("/")}/>
      <p className="gate-disclosure">Opening this invitation unveils the proposal to everyone. Making an offer stays exclusive to the invited team.</p>
      {!available&&<p className="gate-status" role="status">The invitation is being prepared. Please check back shortly.</p>}
    </div>
    <footer><span>Made for Postiz. Carried by Deepak.</span><a href="https://postiz.com/">Discover Postiz <ArrowUpRight size={14}/></a></footer>
  </main>;
}
