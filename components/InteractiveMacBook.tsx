"use client";
import { Component, ReactNode, useEffect, useRef, useState } from "react";
import { useScroll, useMotionValue, useMotionValueEvent, animate, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import CSSMacBook from "./CSSMacBook";
const Scene = dynamic(()=>import("./MacBookScene"),{ssr:false,loading:()=> <div className="model-loading" role="status">Preparing the laptop…</div>});

class SceneBoundary extends Component<{fallback:ReactNode;children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?this.props.fallback:this.props.children;}
}

export default function InteractiveMacBook(){
  const ref=useRef<HTMLElement>(null);
  const reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:["start 65%","end 95%"]});
  const progress=useMotionValue(.12);
  const [phase,setPhase]=useState(0);
  const [webgl,setWebgl]=useState(false);
  const animation=useRef<ReturnType<typeof animate> | null>(null);
  useEffect(()=>{
    try {
      const canvas=document.createElement("canvas");
      const context=canvas.getContext("webgl2")||canvas.getContext("webgl");
      setWebgl(!!context);
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {setWebgl(false);}
  },[]);
  useEffect(()=>{if(reduced) progress.set(.55);return ()=>animation.current?.stop();},[reduced,progress]);
  useMotionValueEvent(scrollYProgress,"change",v=>{if(!reduced){animation.current?.stop();progress.set(v);}});
  useMotionValueEvent(progress,"change",v=>setPhase(v<.27?0:v<.72?1:2));
  function select(v:number){animation.current?.stop();animation.current=animate(progress,v,{duration:reduced?0:1.35,ease:[.22,1,.36,1]});}
  return <section ref={ref} id="idea" className="laptop-story">
    <div className="laptop-sticky">
      <div className="laptop-canvas" role="img" aria-label="Interactive silver laptop with detailed keyboard, trackpad and sixteen Postiz lid placements">
        <SceneBoundary fallback={<CSSMacBook progress={progress}/>}>
          {webgl?<Scene progress={progress} reduced={!!reduced}/>:<CSSMacBook progress={progress}/>}
        </SceneBoundary>
      </div>
      <div className="laptop-controls" role="group" aria-label="Laptop views">
        {["The lid","Open it","All yours"].map((label,i)=><button key={label} className="focus-ring" aria-pressed={phase===i} onClick={()=>select([0,.55,1][i])}>{label}</button>)}
      </div>
      <p className="laptop-caption">One brand. Every surface.</p>
      <span className="scroll-hint">Scroll to explore, or choose a view</span>
    </div>
  </section>;
}
