"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, ContactShadows } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

function useArtwork(kind: "screen" | "lid" | "keys") {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1536; c.height = 1024;
    const x = c.getContext("2d")!;
    if (kind === "screen") {
      const g = x.createLinearGradient(0, 0, 1536, 1024);
      g.addColorStop(0, "#161234"); g.addColorStop(.5, "#5546b5"); g.addColorStop(1, "#c3bcf3");
      x.fillStyle = g; x.fillRect(0,0,1536,1024);
      x.strokeStyle = "#ffffff22"; x.lineWidth = 100;
      for(let i=0;i<4;i++){x.beginPath();x.ellipse(1200,650,480+i*160,700, -.6,0,Math.PI*2);x.stroke();}
      x.textAlign="center"; x.fillStyle="#fff"; x.font="600 104px Arial";
      x.fillText("Postiz",768,470); x.font="32px Arial"; x.fillText("One brand. Every possibility.",768,540);
      x.fillStyle="#ffffffaa";x.font="22px Arial";x.fillText("A PRIVATE PARTNERSHIP WITH DEEPAK",768,920);
    } else if(kind === "lid") {
      x.fillStyle="#d7d8dc"; x.fillRect(0,0,1536,1024);
      for(let row=0;row<4;row++)for(let col=0;col<4;col++){
        const left=90+col*350,top=64+row*230;
        x.fillStyle="#faf9fd"; x.beginPath(); x.roundRect(left,top,305,183,20); x.fill();
        x.fillStyle="#5148e5";x.font="600 45px Arial";x.textAlign="center";x.fillText("Postiz",left+152,top+102);
        x.fillStyle="#6c6a77";x.font="17px Arial";x.fillText(String(row*4+col+1).padStart(2,"0")+" / 16",left+152,top+140);
      }
    } else {
      x.clearRect(0,0,1536,1024);
      const rows=["esc F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12","~ 1 2 3 4 5 6 7 8 9 0 − =","tab Q W E R T Y U I O P [ ]","caps A S D F G H J K L ; ' ↵","shift Z X C V B N M , . / shift"];
      x.fillStyle="#f3f3f5";x.font="28px Arial";x.textAlign="center";
      rows.forEach((r,ri)=>r.split(" ").forEach((key,ci)=>x.fillText(key,60+ci*118,85+ri*178)));
    }
    const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;
  },[kind]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return texture;
}

function Hardware({progress, reduced}: {progress:MotionValue<number>;reduced:boolean}) {
  const root=useRef<THREE.Group>(null);
  const hinge=useRef<THREE.Group>(null);
  const screen=useArtwork("screen"), lid=useArtwork("lid"), keys=useArtwork("keys");
  const {camera,size}=useThree();
  useEffect(()=>{
    const cam=camera as THREE.PerspectiveCamera;
    // Fit width as well as height: the old fixed camera cropped the mobile model.
    const distance=Math.max(8.7, 5.0/(Math.tan(THREE.MathUtils.degToRad(cam.fov/2))* (size.width/size.height)*2));
    cam.position.set(0,distance*.43,distance);cam.lookAt(0,.55,0);cam.updateProjectionMatrix();
  },[camera,size]);
  useFrame((_,delta)=>{
    const p=reduced?.52:progress.get();
    const open=THREE.MathUtils.smoothstep(p,.04,.52);
    const orbit=THREE.MathUtils.smoothstep(p,.65,.98);
    if(hinge.current)hinge.current.rotation.x=THREE.MathUtils.damp(hinge.current.rotation.x,-1.9*open,8,Math.min(delta,.05));
    if(root.current){
      root.current.rotation.y=THREE.MathUtils.damp(root.current.rotation.y,-.18+orbit*3.1,6,Math.min(delta,.05));
      root.current.position.y=-.25;
    }
  });
  const silver={color:"#c9ccd1",metalness:.65,roughness:.3};
  return <group ref={root} rotation={[0,-.18,0]}>
    <RoundedBox args={[4.2,.12,2.85]} radius={.055} smoothness={4}><meshStandardMaterial {...silver}/></RoundedBox>
    <RoundedBox position={[0,.068,-.42]} args={[3.36,.025,1.58]} radius={.04}><meshStandardMaterial color="#111216" roughness={.7}/></RoundedBox>
    {Array.from({length:5},(_,r)=>Array.from({length:13},(_,c)=>
      <RoundedBox key={r+"-"+c} args={[.226,.033,r===0?.17:.235]} radius={.018} smoothness={2} position={[(c-6)*.25,.097,-1.06+r*.275]}>
        <meshStandardMaterial color="#25262a" roughness={.55}/>
      </RoundedBox>
    ))}
    <mesh position={[0,.116,-.51]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[3.27,1.39]}/><meshBasicMaterial map={keys} transparent polygonOffset polygonOffsetFactor={-1}/></mesh>
    {[-1.39,-1.11,-.83,.83,1.11,1.39].map(v=><RoundedBox key={v} args={[.23,.032,.21]} position={[v,.097,.35]} radius={.018}><meshStandardMaterial color="#25262a"/></RoundedBox>)}
    <RoundedBox args={[1.29,.033,.21]} position={[0,.097,.35]} radius={.018}><meshStandardMaterial color="#25262a"/></RoundedBox>
    <RoundedBox args={[1.55,.012,.67]} position={[0,.067,.9]} radius={.04}><meshStandardMaterial color="#a9adb4" metalness={.4} roughness={.35}/></RoundedBox>
    <RoundedBox args={[1.52,.014,.64]} position={[0,.071,.9]} radius={.035}><meshStandardMaterial {...silver}/></RoundedBox>
    {[-1.85,1.85].map(side=><group key={side}>
      {Array.from({length:22},(_,i)=><mesh key={i} position={[side,.065,-1.05+i*.058]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.17,.009]}/><meshBasicMaterial color="#70737a"/></mesh>)}
    </group>)}
    <mesh position={[0,.076,-1.34]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.06,.06,3.25,24]}/><meshStandardMaterial color="#292a2e" metalness={.5}/></mesh>
    <mesh position={[0,-.001,1.428]}><planeGeometry args={[.72,.055]}/><meshStandardMaterial color="#8b8f96"/></mesh>
    <group ref={hinge} position={[0,.16,-1.36]}>
      <group position={[0,0,1.37]}>
        <RoundedBox args={[4.2,.07,2.79]} radius={.034} smoothness={4}><meshStandardMaterial {...silver}/></RoundedBox>
        <mesh position={[0,.037,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[4.02,2.64]}/><meshStandardMaterial map={lid} roughness={.48} metalness={.15}/></mesh>
        <RoundedBox args={[4.07,.018,2.66]} radius={.04} position={[0,-.039,0]}><meshStandardMaterial color="#101114" roughness={.24}/></RoundedBox>
        <mesh position={[0,-.05,-.025]} rotation={[Math.PI/2,0,0]}><planeGeometry args={[3.91,2.46]}/><meshBasicMaterial map={screen} toneMapped={false}/></mesh>
        <mesh position={[0,-.054,1.175]} rotation={[Math.PI/2,0,0]}><planeGeometry args={[.34,.075]}/><meshBasicMaterial color="#111216"/></mesh>
        <mesh position={[0,-.057,1.19]} rotation={[Math.PI/2,0,0]}><circleGeometry args={[.012,16]}/><meshBasicMaterial color="#283343"/></mesh>
      </group>
    </group>
  </group>;
}

export default function MacBookScene({progress, reduced=false}: {progress:MotionValue<number>;interactive?:boolean;reduced?:boolean}) {
  return <Canvas dpr={[1,1.5]} camera={{position:[0,4,9],fov:35}} gl={{antialias:true,alpha:true}}>
    <hemisphereLight args={["#ffffff","#a8aab5",2]}/>
    <directionalLight position={[-3,7,5]} intensity={3}/>
    <directionalLight position={[5,3,-4]} intensity={2}/>
    <Hardware progress={progress} reduced={reduced}/>
    <ContactShadows position={[0,-.38,0]} opacity={.22} scale={10} blur={2.8} far={4} frames={1}/>
  </Canvas>;
}
