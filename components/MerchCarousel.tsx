"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play, MoveHorizontal } from "lucide-react";
import * as THREE from "three";
import { Tee, Pen, Notebook, Bottle } from "./ProductModels";
import PostizLogo from "./PostizLogo";

const PRODUCTS = ["T-shirt", "Pen", "Notebook", "Water bottle"];
const OBJECTS = [Tee, Pen, Notebook, Bottle];
const STEP = Math.PI / 2;
const modulo = (n: number) => ((n % 4) + 4) % 4;

function Orbit({ target, reduced }: { target: React.MutableRefObject<number>; reduced: boolean }) {
  const groups = useRef<Array<THREE.Group | null>>([]);
  const angle = useRef(0);
  const { camera, size } = useThree();
  useEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    const distance = Math.max(7.8, 4.7 / (2 * Math.tan(THREE.MathUtils.degToRad(c.fov / 2)) * size.width / size.height));
    c.position.set(0,.2,distance); c.lookAt(0,0,-.5); c.updateProjectionMatrix();
  }, [camera,size]);
  useFrame((_,dt) => {
    angle.current = reduced ? target.current : THREE.MathUtils.damp(angle.current,target.current,5,Math.min(dt,.05));
    groups.current.forEach((g,i)=>{
      if(!g) return;
      const a = angle.current + i * STEP;
      const depth = Math.cos(a);
      g.position.set(Math.sin(a)*3.5, -.08*(1-depth), depth*2.7-2.7);
      g.rotation.y = a;
      g.scale.setScalar(.84 + .16*(depth+1)/2);
      g.visible = !reduced || depth > .9;
    });
  });
  return <>
    <hemisphereLight args={["#ffffff","#b5b2c3",1.5]} />
    <directionalLight position={[-4,6,5]} intensity={2.5} />
    <directionalLight position={[5,2,-4]} intensity={1.8} />
    {OBJECTS.map((Product,i)=><group key={PRODUCTS[i]} ref={node=>{groups.current[i]=node;}}><Product /></group>)}
    <ContactShadows position={[0,-1.55,-1.5]} scale={12} far={6} opacity={.16} blur={3} resolution={128} />
  </>;
}

export default function MerchCarousel() {
  const root=useRef<HTMLDivElement>(null);
  const inView=useInView(root,{amount:.2});
  const reduced=useReducedMotion();
  const [pageVisible,setPageVisible]=useState(true);
  const [step,setStep]=useState(0);
  const [paused,setPaused]=useState(false);
  const target=useRef(0);
  const drag=useRef<{x:number;y:number;angle:number;horizontal:boolean}|null>(null);
  useEffect(()=>{target.current=-step*STEP;},[step]);
  useEffect(()=>{const update=()=>setPageVisible(!document.hidden);document.addEventListener("visibilitychange",update);return()=>document.removeEventListener("visibilitychange",update);},[]);
  useEffect(()=>{
    if(paused||reduced||!inView||!pageVisible) return;
    const timer=window.setInterval(()=>setStep(s=>s+1),5200);
    return()=>window.clearInterval(timer);
  },[paused,reduced,inView,pageVisible]);
  function finishDrag(){
    if(!drag.current)return;
    if(drag.current.horizontal){const next=Math.round(-target.current/STEP);target.current=-next*STEP;setStep(next);}
    drag.current=null;
  }
  return <div ref={root} className="orbit-showcase">
    <div className="orbit-stage" aria-label="Drag horizontally to rotate the branded merchandise"
      onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY,angle:target.current,horizontal:false};}}
      onPointerMove={e=>{
        const d=drag.current;if(!d)return;
        const dx=e.clientX-d.x,dy=e.clientY-d.y;
        if(!d.horizontal && Math.abs(dy)>12 && Math.abs(dy)>Math.abs(dx)){drag.current=null;return;}
        if(Math.abs(dx)>8){d.horizontal=true;setPaused(true);e.currentTarget.setPointerCapture(e.pointerId);target.current=d.angle+dx/e.currentTarget.clientWidth*Math.PI;}
      }}
      onPointerUp={finishDrag} onPointerCancel={finishDrag}>
      <Canvas frameloop={inView&&pageVisible?"always":"never"} camera={{position:[0,.2,8],fov:36}} dpr={[1,1.5]} gl={{antialias:true,alpha:true}}
        fallback={<p className="model-loading">The kit includes a Postiz T-shirt, pen, notebook and water bottle.</p>}>
        <Suspense fallback={null}><Orbit target={target} reduced={!!reduced} /></Suspense>
      </Canvas>
    </div>
    <div className="orbit-footer">
      <div className="orbit-caption"><span className="concept-note">The everyday collection</span><h3>{PRODUCTS[modulo(step)]}</h3></div>
      <div className="tactile-controls" role="group" aria-label="Merchandise rotation controls">
        <button aria-label="Previous product" onClick={()=>{setPaused(true);setStep(s=>s-1);}}><ArrowLeft size={17}/></button>
        {!reduced&&<button aria-label={paused?"Resume rotation":"Pause rotation"} onClick={()=>setPaused(p=>!p)}>{paused?<Play size={15}/>:<Pause size={15}/>}</button>}
        <button aria-label="Next product" onClick={()=>{setPaused(true);setStep(s=>s+1);}}><ArrowRight size={17}/></button>
      </div>
    </div>
    <p className="orbit-hint"><MoveHorizontal size={15}/> Drag to explore · {modulo(step)+1} / 4</p>
    <div className="orbit-credit"><span>Branding concepts for</span><PostizLogo/></div>
  </div>;
}
