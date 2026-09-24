"use client";
import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValue, useMotionValueEvent, animate, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useSponsor } from "./SponsorProvider";
import CSSMacBook from "./CSSMacBook";
const Scene = dynamic(()=>import("./MacBookScene"),{ssr:false,loading:()=> <div className="model-loading" role="status">Preparing the laptop…</div>});

export default function InteractiveMacBook(){
  const sponsor=useSponsor();
  const ref=useRef<HTMLElement>(null);
  const reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:["start 65%","end 95%"]});
  const progress=useMotionValue(.12);
  const [phase,setPhase]=useState(0);
  const animation=useRef<ReturnType<typeof animate> | null>(null);
  const [webglReady,setWebglReady]=useState<boolean|null>(null);
  useEffect(()=>{
    const canvas=document.createElement("canvas");
    canvas.width=canvas.height=1;
    let context:WebGLRenderingContext|null=null;
    try { context=canvas.getContext("webgl2")||canvas.getContext("webgl"); } catch { context=null; }
    const supported=!!context;
    // Release the one-pixel capability probe before the 3D scene creates its renderer.
    try { context?.getExtension("WEBGL_lose_context")?.loseContext(); } catch {}
    setWebglReady(supported);
  },[]);
  useEffect(()=>{if(reduced) progress.set(.55);return ()=>animation.current?.stop();},[reduced,progress]);
  useMotionValueEvent(scrollYProgress,"change",v=>{if(!reduced){animation.current?.stop();progress.set(v);}});
  useMotionValueEvent(progress,"change",v=>setPhase(v<.27?0:v<.72?1:2));
  function select(v:number){animation.current?.stop();animation.current=animate(progress,v,{duration:reduced?0:1.35,ease:[.22,1,.36,1]});}
  return <section ref={ref} id="idea" className="laptop-story">
    <div className="laptop-sticky">
      <div className="laptop-canvas" role="img" aria-label={`Interactive silver laptop with detailed keyboard, trackpad and sixteen ${sponsor.name} lid placements`}>
        {webglReady === true ? <Scene progress={progress} reduced={!!reduced}/> : webglReady === false ? <CSSMacBook progress={progress} brandedWhenOpen/> : <div className="model-loading" role="status">Preparing the laptop…</div>}
      </div>
      <div className="laptop-controls" role="group" aria-label="Laptop views">
        {["The lid","Open it","All yours"].map((label,i)=><button key={label} className="focus-ring" aria-pressed={phase===i} onClick={()=>select([0,.55,1][i])}>{label}</button>)}
      </div>
      <p className="laptop-caption">{["16 placements. One exclusive sponsor.","Built for the work. Branded for the room.","Not a shared space. Your entire canvas."][phase]}</p>
      <span className="scroll-hint">Scroll to explore, or choose a view</span>
    </div>
  </section>;
}
