"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export default function OfferDock(){
  const [hidden,setHidden]=useState(false);
  useEffect(()=>{
    const offer=document.getElementById("private-offer");if(!offer)return;
    const observer=new IntersectionObserver(([entry])=>setHidden(entry.isIntersecting),{threshold:0});
    observer.observe(offer);return()=>observer.disconnect();
  },[]);
  return <aside className={`offer-dock ${hidden?"is-hidden":""}`} aria-label="Private partnership offer" aria-hidden={hidden}>
    <div><strong>All 16 spaces. One brand.</strong><span>Your price · 12 months · invitation only</span></div>
    <a href="#private-offer" tabIndex={hidden?-1:0}>Make an offer <ArrowUpRight size={17}/></a>
  </aside>;
}
