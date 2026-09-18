"use client";
import { createContext, ReactNode, useContext } from "react";
import { DEFAULT_SPONSOR, publicSponsor, SponsorConfig } from "@/lib/sponsor-types";

type PublicSponsor=ReturnType<typeof publicSponsor>;
const SponsorContext=createContext<PublicSponsor>(publicSponsor(DEFAULT_SPONSOR));
export function SponsorProvider({sponsor,children}:{sponsor:PublicSponsor;children:ReactNode}){return <SponsorContext.Provider value={sponsor}>{children}</SponsorContext.Provider>;}
export function useSponsor(){return useContext(SponsorContext);}
export function SponsorName(){return <>{useSponsor().name}</>;}
export function trackSponsorClick(){
  const payload=JSON.stringify({type:"sponsor-click",path:location.pathname});
  if(navigator.sendBeacon)navigator.sendBeacon("/api/analytics",new Blob([payload],{type:"application/json"}));
  else void fetch("/api/analytics",{method:"POST",headers:{"Content-Type":"application/json"},body:payload,keepalive:true});
}
