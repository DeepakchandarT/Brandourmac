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
    let checking=false;
    const checkAccess=async()=>{if(document.hidden||checking)return;checking=true;try{const response=await fetch("/api/campaign",{cache:"no-store"});if(response.ok){const result=await response.json();if(result.open===false)location.reload();}}finally{checking=false;}};
    const heartbeat=window.setInterval(()=>{if(!document.hidden)send("heartbeat");},60_000);
    const accessCheck=window.setInterval(checkAccess,15_000);
    const visibility=()=>{if(!document.hidden){send("heartbeat");void checkAccess();}};document.addEventListener("visibilitychange",visibility);window.addEventListener("focus",checkAccess);
    return()=>{observer?.disconnect();window.clearInterval(heartbeat);window.clearInterval(accessCheck);document.removeEventListener("visibilitychange",visibility);window.removeEventListener("focus",checkAccess);};
  },[]);
  return null;
}
