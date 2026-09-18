"use client";
import { useEffect } from "react";

function send(type:string){
  const body=JSON.stringify({type,path:location.pathname,referrer:type==="pageview"?document.referrer:undefined});
  void fetch("/api/analytics",{method:"POST",headers:{"Content-Type":"application/json"},body,keepalive:true,cache:"no-store"});
}
export default function AnalyticsTracker(){
  useEffect(()=>{
    send("pageview");
    const offer=document.getElementById("private-offer");let proposalSeen=false;
    let observer:IntersectionObserver|null=null;
    if(offer)observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting&&!proposalSeen){proposalSeen=true;send("proposal-view");observer?.disconnect();}},{threshold:.35});
    if(offer)observer?.observe(offer);
    const heartbeat=window.setInterval(()=>{if(!document.hidden)send("heartbeat");},60_000);
    const visibility=()=>{if(!document.hidden)send("heartbeat");};document.addEventListener("visibilitychange",visibility);
    return()=>{observer?.disconnect();window.clearInterval(heartbeat);document.removeEventListener("visibilitychange",visibility);};
  },[]);
  return null;
}
