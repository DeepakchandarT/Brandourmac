"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Component, ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { Tee, Pen, Notebook, Bottle, Hoodie, Laptop } from "./ProductModels";

const PRODUCTS = ["T-shirt", "Hoodie", "MacBook", "Pen", "Notebook", "Water bottle"];
const OBJECTS = [Tee, Hoodie, Laptop, Pen, Notebook, Bottle];
const STEP = Math.PI * 2 / PRODUCTS.length;

class CanvasBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?this.props.fallback:this.props.children;}
}

function Orbit({ angle, running, reduced, onActive }: {
  angle: React.MutableRefObject<number>; running:boolean; reduced:boolean; onActive:(index:number)=>void;
}) {
  const groups=useRef<Array<THREE.Group|null>>([]);
  const active=useRef(-1);
  const {camera,size}=useThree();
  useEffect(()=>{
    const c=camera as THREE.PerspectiveCamera;
    const distance=Math.max(8,4.5/(2*Math.tan(THREE.MathUtils.degToRad(c.fov/2))*size.width/size.height));
    c.position.set(0,.15,distance);c.lookAt(0,0,0);c.updateProjectionMatrix();
  },[camera,size]);
  useFrame((_,dt)=>{
    if(running&&!reduced) angle.current-=Math.min(dt,.05)*STEP/7;
    const index=((Math.round(-angle.current/STEP)%PRODUCTS.length)+PRODUCTS.length)%PRODUCTS.length;
    if(index!==active.current){active.current=index;onActive(index);}
    groups.current.forEach((g,i)=>{
      if(!g)return;
      const a=angle.current+i*STEP,depth=Math.cos(a);
      g.position.set(Math.sin(a)*4.9,0,(depth-1)*4.3);
      // Each item keeps its branded front directed towards the visitor.
      g.rotation.y=Math.sin(a)*.28;
      g.scale.setScalar(.72+.28*(depth+1)/2);
      g.visible=!reduced||i===0;
    });
  });
  return <>
    <hemisphereLight args={["#ffffff","#b5b2c3",1.4]}/>
    <directionalLight position={[-4,6,5]} intensity={2.4}/>
    <directionalLight position={[5,2,-4]} intensity={1.2}/>
    {OBJECTS.map((Product,i)=><group key={PRODUCTS[i]} ref={node=>{groups.current[i]=node;}}><Product/></group>)}
    <ContactShadows position={[0,-1.6,-1.5]} scale={14} far={6} opacity={.15} blur={3} resolution={128}/>
  </>;
}

export default function MerchCarousel(){
  const root=useRef<HTMLDivElement>(null);
  const inView=useInView(root,{amount:.15});
  const reduced=useReducedMotion();
  const angle=useRef(0);
  const [visible,setVisible]=useState(true);
  const [paused,setPaused]=useState(false);
  const [hovered,setHovered]=useState(false);
  const [active,setActive]=useState(0);
  const drag=useRef<{x:number;y:number;angle:number;moved:boolean}|null>(null);
  useEffect(()=>{
    const update=()=>setVisible(!document.hidden);
    document.addEventListener("visibilitychange",update);
    return()=>document.removeEventListener("visibilitychange",update);
  },[]);
  const fallback=<p className="model-loading">Postiz collection: T-shirt, hoodie, MacBook, pen, notebook and bottle.</p>;
  return <div ref={root} className="orbit-showcase">
    <div className="orbit-stage" role="button" tabIndex={0}
      aria-label={paused?"Resume automatic merchandise rotation":"Pause automatic merchandise rotation"}
      aria-pressed={paused}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      onKeyDown={e=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();setPaused(p=>!p);}}}
      onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY,angle:angle.current,moved:false};}}
      onPointerMove={e=>{
        const d=drag.current;if(!d)return;
        const dx=e.clientX-d.x,dy=e.clientY-d.y;
        if(!d.moved&&Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){drag.current=null;return;}
        if(Math.abs(dx)>8){d.moved=true;e.currentTarget.setPointerCapture(e.pointerId);angle.current=d.angle+dx/e.currentTarget.clientWidth*Math.PI;}
      }}
      onPointerUp={()=>{if(drag.current&&!drag.current.moved)setPaused(p=>!p);drag.current=null;}}
      onPointerCancel={()=>{drag.current=null;}}>
      <CanvasBoundary fallback={fallback}>
        <Canvas frameloop={inView&&visible?"always":"never"} camera={{position:[0,.15,8],fov:36}} dpr={[1,2]} gl={{antialias:true,alpha:true}} fallback={fallback}>
          <Suspense fallback={null}><Orbit angle={angle} running={!paused&&!hovered} reduced={!!reduced} onActive={setActive}/></Suspense>
        </Canvas>
      </CanvasBoundary>
    </div>
    <p style={{textAlign:"center",marginTop:8,fontSize:16,color:"#35313f"}}>{PRODUCTS[active]}</p>
    <p style={{textAlign:"center",marginTop:8,fontSize:11,color:"#6c6778"}}>{reduced?"Collection preview":paused?"Paused · tap to resume":"Automatically rotating · tap to pause"}</p>
    <p className="sr-only">Collection: {PRODUCTS.join(", ")}. Drag to explore. Press Enter or Space to pause.</p>
  </div>;
}
