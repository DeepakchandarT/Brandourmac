"use client";
import { Line, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Brand } from "./BrandTexture";

export function Tee() {
  const geometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-.38, 1.25); s.quadraticCurveTo(0, .86, .38, 1.25);
    s.bezierCurveTo(.58, 1.22, .78, 1.15, .94, 1.04);
    s.lineTo(1.51, .55); s.quadraticCurveTo(1.4, .26, 1.2, .04);
    s.lineTo(.88, .27); s.bezierCurveTo(.8, -.15, .83, -.83, .91, -1.28);
    s.quadraticCurveTo(.3, -1.39, 0, -1.33); s.quadraticCurveTo(-.4, -1.4, -.91, -1.28);
    s.bezierCurveTo(-.83, -.8, -.8, -.15, -.88, .27);
    s.lineTo(-1.2, .04); s.quadraticCurveTo(-1.4, .26, -1.51, .55);
    s.lineTo(-.94, 1.04); s.bezierCurveTo(-.78, 1.15, -.58, 1.22, -.38, 1.25);
    const g = new THREE.ExtrudeGeometry(s, { depth: .045, bevelEnabled: true, bevelThickness: .028, bevelSize: .02, bevelSegments: 3, curveSegments: 24, steps: 1 });
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      const folds = Math.sin(x * 10 + y * 1.4) * .016 + Math.cos(y * 4 + x) * .012;
      p.setZ(i, p.getZ(i) + folds);
    }
    g.computeVertexNormals(); return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <group rotation={[0, 0, -.035]}>
    <mesh geometry={geometry}><meshStandardMaterial color="#ffffff" roughness={.98} side={THREE.DoubleSide} /></mesh>
    <Line points={[[-.37,1.24,.075],[-.22,1.1,.078],[0,1.04,.08],[.22,1.1,.078],[.37,1.24,.075]]} color="#d7d6de" lineWidth={3} />
    <Line points={[[-.83,-1.26,.072],[-.4,-1.3,.075],[0,-1.27,.075],[.4,-1.3,.072],[.83,-1.26,.073]]} color="#dddce3" lineWidth={1} />
    <Line points={[[-1.47,.52,.072],[-1.34,.29,.072],[-1.19,.09,.072]]} color="#dddce3" lineWidth={1} />
    <Line points={[[1.47,.52,.072],[1.34,.29,.072],[1.19,.09,.072]]} color="#dddce3" lineWidth={1} />
    <Brand position={[0, .36, .095]} scale={.85} />
    <mesh position={[.82,-1.13,.073]}><planeGeometry args={[.065,.11]} /><meshBasicMaterial color="#5148e5" /></mesh>
  </group>;
}

export function Pen() {
  return <group rotation={[0,0,-.43]}>
    <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.13,.13,2.85,40]} /><meshStandardMaterial color="#ffffff" roughness={.32} metalness={.18} /></mesh>
    <mesh position={[-1.57,0,0]} rotation={[0,0,Math.PI/2]}><coneGeometry args={[.13,.32,40]} /><meshStandardMaterial color="#9699a3" metalness={.85} roughness={.24} /></mesh>
    <mesh position={[1.44,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.13,.13,.14,32]} /><meshStandardMaterial color="#5148e5" /></mesh>
    <RoundedBox args={[.68,.03,.055]} radius={.012} position={[1.07,.16,0]}><meshStandardMaterial color="#9296a0" metalness={.8} roughness={.2} /></RoundedBox>
    <Brand position={[-.15,0,.132]} scale={.42} />
  </group>;
}

export function Notebook() {
  return <group rotation={[.02,-.1,-.06]}>
    <RoundedBox args={[2.05,2.85,.23]} radius={.06}><meshStandardMaterial color="#dedcd6" roughness={1} /></RoundedBox>
    {[-.145,.145].map(z=><RoundedBox key={z} args={[2.15,2.94,.04]} radius={.015} position={[0,0,z]}><meshStandardMaterial color="#ffffff" roughness={.85} /></RoundedBox>)}
    <RoundedBox args={[.13,2.93,.33]} radius={.045} position={[-1.04,0,0]}><meshStandardMaterial color="#5148e5" roughness={.8} /></RoundedBox>
    <mesh position={[.78,0,.176]}><boxGeometry args={[.065,2.95,.012]} /><meshStandardMaterial color="#b9b4e6" /></mesh>
    <Brand position={[-.05,.15,.171]} scale={.92} />
  </group>;
}

export function Bottle() {
  const profile = useMemo(()=>[new THREE.Vector2(0,-1.4),new THREE.Vector2(.5,-1.4),new THREE.Vector2(.61,-1.32),new THREE.Vector2(.61,.83),new THREE.Vector2(.57,1.02),new THREE.Vector2(.37,1.2),new THREE.Vector2(.36,1.4),new THREE.Vector2(0,1.4)],[]);
  return <group>
    <mesh><latheGeometry args={[profile,64]} /><meshStandardMaterial color="#ffffff" metalness={.2} roughness={.5} /></mesh>
    <mesh position={[0,1.43,0]}><cylinderGeometry args={[.39,.39,.22,48]} /><meshStandardMaterial color="#5148e5" roughness={.4} /></mesh>
    <mesh position={[0,1.18,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.367,.018,8,48]} /><meshStandardMaterial color="#999aa5" metalness={.8} /></mesh>
    <Brand position={[0,.05,.62]} scale={.65} />
  </group>;
}
