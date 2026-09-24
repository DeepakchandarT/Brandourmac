"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { Tee, Pen, Notebook, Bottle, Laptop } from "./ProductModels";
import { useSponsor } from "./SponsorProvider";

const PRODUCTS = ["T-shirt", "MacBook", "Pen", "Notebook", "Water bottle"];
const OBJECTS = [Tee, Laptop, Pen, Notebook, Bottle];
const STEP = Math.PI * 2 / PRODUCTS.length;
const ORBIT_RADIUS = 3.1;
const ORBIT_DEPTH = 3.2;

class CanvasBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?this.props.fallback:this.props.children;}
}

function Orbit({ angle, running, reduced, mobile, onActive }: {
  angle: React.MutableRefObject<number>; running:boolean; reduced:boolean; mobile:boolean; onActive:(index:number)=>void;
}) {
  const groups=useRef<Array<THREE.Group|null>>([]);
  const active=useRef(-1);
  const {camera,size,gl}=useThree();
  const featured=useRef(((Math.round(-angle.current/STEP)%PRODUCTS.length)+PRODUCTS.length)%PRODUCTS.length);
  const hold=useRef(0);
  const motionTime=useRef(0);
  const transition=useRef<{to:number;elapsed:number}|null>(null);
  useEffect(()=>()=>{gl.domElement.style.opacity="1";},[gl]);
  useEffect(()=>{
    const c=camera as THREE.PerspectiveCamera;
    if (!size.width || !size.height) return;
    const tanV=Math.tan(THREE.MathUtils.degToRad(c.fov/2));
    const tanH=tanV*size.width/size.height;
    let distance=7.5;
    // Fit the entire rotating envelope, including the widest model and
    // its front edge. Keep the camera fixed during rotation to avoid pumping.
    for(let step=0;step<180;step++){
      const a=step*Math.PI*2/180, depth=Math.cos(a);
      const scale=.72+.28*(depth+1)/2;
      const x=Math.abs(Math.sin(a)*ORBIT_RADIUS);
      const front=(depth-1)*ORBIT_DEPTH+1.5*scale;
      distance=Math.max(distance,
        front+(x+2*scale)*1.08/tanH,
        front+(1.9*scale+.1)*1.08/tanV);
    }
    if(mobile) distance=Math.max(6.6,1.3+1.8/(tanH*.9));
    c.position.set(0,.1,distance);c.lookAt(0,.1,0);c.updateProjectionMatrix();
  },[camera,size,mobile]);
  useFrame((_,dt)=>{
    const delta=Math.min(dt,.05);
    if(running&&!reduced) motionTime.current+=delta;
    if(mobile){
      if(running&&!reduced&&!transition.current){
        hold.current+=delta;
        if(hold.current>=4.8){angle.current-=STEP;hold.current=0;}
      }
      const target=((Math.round(-angle.current/STEP)%PRODUCTS.length)+PRODUCTS.length)%PRODUCTS.length;
      if(reduced){featured.current=target;transition.current=null;}
      else if(!transition.current&&target!==featured.current){
        transition.current={to:target,elapsed:0};hold.current=0;
      }
      let opacity=1;
      const change=transition.current;
      if(change){
        change.elapsed+=delta;
        const p=Math.min(1,change.elapsed/.7);
        // Swap only while fully faded: no clipped edges or overlapping products.
        if(p>=.5) featured.current=change.to;
        const t=p<.5?1-p*2:(p-.5)*2;
        opacity=t*t*(3-2*t);
        if(p===1) transition.current=null;
      }
      gl.domElement.style.opacity=String(opacity);
      groups.current.forEach((g,i)=>{
        if(!g)return;
        g.visible=i===featured.current;
        g.position.set(0,0,0);
        g.rotation.y=reduced?0:Math.sin(motionTime.current*.65)*.12;
        g.scale.setScalar(1);
      });
      if(featured.current!==active.current){active.current=featured.current;onActive(featured.current);}
    }else{
      gl.domElement.style.opacity="1";
      if(running&&!reduced) angle.current-=delta*STEP/7;
      const index=((Math.round(-angle.current/STEP)%PRODUCTS.length)+PRODUCTS.length)%PRODUCTS.length;
      if(index!==active.current){active.current=index;onActive(index);}
      groups.current.forEach((g,i)=>{
        if(!g)return;
        const a=angle.current+i*STEP,depth=Math.cos(a);
        g.position.set(Math.sin(a)*ORBIT_RADIUS,0,(depth-1)*ORBIT_DEPTH);
        g.rotation.y=Math.sin(a)*.28;
        g.scale.setScalar(.72+.28*(depth+1)/2);
        g.visible=true;
      });
    }
  });
  return <>
    <hemisphereLight args={["#ffffff","#b5b2c3",1.4]}/>
    <directionalLight position={[-4,6,5]} intensity={2.4}/>
    <directionalLight position={[5,2,-4]} intensity={1.2}/>
    {OBJECTS.map((Product,i)=><group key={PRODUCTS[i]} ref={node=>{groups.current[i]=node;}}><group position={[0,i===1?-.52:0,0]}><Product/></group></group>)}
  </>;
}

export default function MerchCarousel(){
  const sponsor=useSponsor();
  const root=useRef<HTMLDivElement>(null);
  const inView=useInView(root,{amount:.15});
  const reduced=useReducedMotion();
  const angle=useRef(0);
  const [visible,setVisible]=useState(true);
  const [mobile,setMobile]=useState(false);
  useEffect(()=>{
    const query=window.matchMedia("(max-width: 767px)");
    const update=()=>setMobile(query.matches);update();
    query.addEventListener("change",update);
    return()=>query.removeEventListener("change",update);
  },[]);
  const [paused,setPaused]=useState(false);
  const [hovered,setHovered]=useState(false);
  const [active,setActive]=useState(0);
  const [webglReady,setWebglReady]=useState<boolean|null>(null);
  const drag=useRef<{x:number;y:number;angle:number;moved:boolean}|null>(null);
  useEffect(()=>{
    const update=()=>setVisible(!document.hidden);
    document.addEventListener("visibilitychange",update);
    return()=>document.removeEventListener("visibilitychange",update);
  },[]);
  useEffect(()=>{
    const canvas=document.createElement("canvas");
    let context:WebGLRenderingContext|null=null;
    try { context=canvas.getContext("webgl2")||canvas.getContext("webgl"); } catch { context=null; }
    setWebglReady(!!context);
  },[]);
  const fallback=<p className="model-loading">{sponsor.name} collection: T-shirt, MacBook, pen, notebook and bottle.</p>;
  return <div ref={root} className="orbit-showcase">
    <div className="orbit-stage" role="button" tabIndex={0}
      aria-label={paused?"Resume automatic merchandise rotation":"Pause automatic merchandise rotation"}
      aria-pressed={paused}
      onMouseEnter={()=>{if(!mobile)setHovered(true);}} onMouseLeave={()=>setHovered(false)}
      onKeyDown={e=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();setPaused(p=>!p);}}}
      onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY,angle:angle.current,moved:false};}}
      onPointerMove={e=>{
        const d=drag.current;if(!d)return;
        const dx=e.clientX-d.x,dy=e.clientY-d.y;
        if(!d.moved&&Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){drag.current=null;return;}
        if(Math.abs(dx)>8){d.moved=true;e.currentTarget.setPointerCapture(e.pointerId);angle.current=mobile?d.angle-Math.sign(-dx)*STEP:d.angle+dx/e.currentTarget.clientWidth*Math.PI;}
      }}
      onPointerUp={()=>{if(drag.current&&!drag.current.moved)setPaused(p=>!p);drag.current=null;}}
      onPointerCancel={()=>{drag.current=null;}}>
      {webglReady===true ? <CanvasBoundary fallback={fallback}>
        <Canvas frameloop={inView&&visible?"always":"never"} camera={{position:[0,.15,8],fov:36}} dpr={[1,2]} gl={{antialias:true,alpha:true}} fallback={fallback}>
          <Suspense fallback={null}><Orbit key={mobile?"featured":"orbit"} angle={angle} mobile={mobile} running={!paused&&(mobile||!hovered)} reduced={!!reduced} onActive={setActive}/></Suspense>
        </Canvas>
      </CanvasBoundary> : fallback}
    </div>
    <p className="orbit-product-name">{PRODUCTS[active]}</p>
    <p className="orbit-playback-note">{reduced?"Collection preview":paused?"Paused · tap to resume":"Automatically rotating · tap to pause"}</p>
    <p className="sr-only">Collection: {PRODUCTS.join(", ")}. Drag to explore. Press Enter or Space to pause.</p>
  </div>;
}
