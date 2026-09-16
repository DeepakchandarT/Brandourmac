"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import * as THREE from "three";

const PRODUCTS = [
  { name: "T-shirt", detail: "Worn to meetings, events and conferences." },
  { name: "Pen", detail: "A small detail in every working day." },
  { name: "Notebook", detail: "From the first idea to the client meeting." },
  { name: "Water bottle", detail: "Part of the everyday carry." },
  { name: "Cap", detail: "Another way to carry the brand." },
];

function Brand({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 768; canvas.height = 192;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#5148e5"; ctx.font = "600 120px Arial";
    ctx.textAlign = "center"; ctx.fillText("Postiz", 384, 138);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={position} scale={scale}>
    <planeGeometry args={[1.35, .3375]} />
    <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
  </mesh>;
}

function Tee() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-.4, 1.3); s.quadraticCurveTo(0, .9, .4, 1.3);
    s.lineTo(.88, 1.18); s.lineTo(1.55, .68); s.lineTo(1.16, .05);
    s.lineTo(.86, .25); s.lineTo(.91, -1.27);
    s.quadraticCurveTo(0, -1.4, -.91, -1.27);
    s.lineTo(-.86, .25); s.lineTo(-1.16, .05); s.lineTo(-1.55, .68);
    s.lineTo(-.88, 1.18); s.closePath(); return s;
  }, []);
  return <group rotation={[0, 0, -.04]}>
    <mesh position={[0, 0, -.08]}>
      <extrudeGeometry args={[shape, { depth: .12, bevelEnabled: true, bevelThickness: .055, bevelSize: .035, bevelSegments: 4, steps: 1 }]} />
      <meshStandardMaterial color="#f9f9fc" roughness={.92} />
    </mesh>
    <mesh position={[0, 1.31, .095]} rotation={[0, 0, Math.PI]}><torusGeometry args={[.38, .025, 8, 36, Math.PI]} /><meshStandardMaterial color="#dedee6" roughness={1} /></mesh>
    <Brand position={[0, .35, .103]} scale={.83} />
    <mesh position={[0, -1.24, .1]}><boxGeometry args={[1.66, .014, .008]} /><meshStandardMaterial color="#e0e0e8" /></mesh>
  </group>;
}

function Pen() {
  return <group rotation={[0, 0, -.5]}>
    <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.115, .115, 2.85, 40]} /><meshStandardMaterial color="#f7f7fb" roughness={.3} metalness={.25} /></mesh>
    <mesh position={[-1.58, 0, 0]} rotation={[0, 0, Math.PI / 2]}><coneGeometry args={[.115, .32, 40]} /><meshStandardMaterial color="#8b8e98" metalness={.85} roughness={.22} /></mesh>
    <mesh position={[1.43, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.12, .12, .16, 32]} /><meshStandardMaterial color="#5148e5" metalness={.25} roughness={.32} /></mesh>
    <RoundedBox args={[.67, .035, .065]} radius={.015} position={[1.08, .16, 0]}><meshStandardMaterial color="#9296a0" metalness={.8} roughness={.22} /></RoundedBox>
    <Brand position={[-.1, 0, .12]} scale={.48} />
  </group>;
}

function Notebook() {
  return <group rotation={[.04, -.14, -.07]}>
    <RoundedBox args={[2.05, 2.85, .23]} radius={.06}><meshStandardMaterial color="#e5e2dc" roughness={1} /></RoundedBox>
    {[-.145, .145].map(z => <RoundedBox key={z} args={[2.15, 2.94, .04]} radius={.015} position={[0, 0, z]}><meshStandardMaterial color="#fafaff" roughness={.8} /></RoundedBox>)}
    <RoundedBox args={[.13, 2.93, .33]} radius={.045} position={[-1.04, 0, 0]}><meshStandardMaterial color="#5148e5" roughness={.75} /></RoundedBox>
    <mesh position={[.78, 0, .174]}><boxGeometry args={[.065, 2.95, .01]} /><meshStandardMaterial color="#b9b4e6" roughness={1} /></mesh>
    <Brand position={[-.05, .15, .171]} scale={.9} />
  </group>;
}

function Bottle() {
  const profile = useMemo(() => [new THREE.Vector2(0, -1.4), new THREE.Vector2(.5, -1.4), new THREE.Vector2(.61, -1.32), new THREE.Vector2(.61, .83), new THREE.Vector2(.57, 1.02), new THREE.Vector2(.37, 1.2), new THREE.Vector2(.36, 1.4), new THREE.Vector2(0, 1.4)], []);
  return <group>
    <mesh><latheGeometry args={[profile, 64]} /><meshStandardMaterial color="#f4f4fa" metalness={.35} roughness={.36} /></mesh>
    <mesh position={[0, 1.43, 0]}><cylinderGeometry args={[.39, .39, .22, 48]} /><meshStandardMaterial color="#5148e5" metalness={.15} roughness={.4} /></mesh>
    <mesh position={[0, 1.18, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.367, .018, 8, 48]} /><meshStandardMaterial color="#999aa5" metalness={.8} /></mesh>
    <Brand position={[0, .05, .617]} scale={.65} />
  </group>;
}

function Cap() {
  return <group rotation={[.18, 0, 0]} position={[0, -.4, 0]}>
    <mesh scale={[1.08, .95, 1]}><sphereGeometry args={[1, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#f4f4f9" roughness={.92} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, .02, .8]} scale={[1.04, .055, .85]}><sphereGeometry args={[1, 48, 16]} /><meshStandardMaterial color="#ebebf2" roughness={.85} /></mesh>
    <mesh position={[0, .96, 0]}><sphereGeometry args={[.055, 16, 8]} /><meshStandardMaterial color="#5148e5" roughness={.9} /></mesh>
    <Brand position={[0, .46, .91]} scale={.63} />
  </group>;
}

const OBJECTS = [Tee, Pen, Notebook, Bottle, Cap];

function Stage({ active, reduced, turn }: { active: number; reduced: boolean; turn: number }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef(0);
  const previous = useRef(-1);
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const distance = Math.max(6.2, 4.15 / (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * size.width / size.height));
    cam.position.set(0, .12, distance); cam.lookAt(0, 0, 0); cam.updateProjectionMatrix();
  }, [camera, size]);
  useEffect(() => {
    target.current = turn * Math.PI * 2 + .12;
    if (group.current) {
      if (reduced || previous.current !== active) {
        group.current.rotation.y = reduced ? target.current : target.current - 1.35;
        group.current.position.x = reduced ? 0 : .45;
      }
      previous.current = active;
    }
  }, [active, reduced, turn]);
  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target.current, 4.8, Math.min(dt, .05));
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, 0, 5, Math.min(dt, .05));
  });
  const Product = OBJECTS[active];
  return <>
    <hemisphereLight args={["#ffffff", "#afb0c6", 1.8]} />
    <directionalLight position={[-4, 5, 5]} intensity={2.4} />
    <directionalLight position={[4, 1, -3]} intensity={1.4} />
    <group ref={group}><Product /></group>
    <ContactShadows position={[0, -1.6, 0]} opacity={.17} scale={7} blur={2.6} far={4} resolution={128} />
  </>;
}

export default function MerchCarousel() {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root, { amount: .2 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [turn, setTurn] = useState(0);
  useEffect(() => {
    if (paused || reduced || !visible) return;
    const timer = window.setInterval(() => setActive(i => (i + 1) % PRODUCTS.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused, reduced, visible]);
  function select(index: number) { setPaused(true); setActive(index); }
  return <div ref={root} className="merch-showcase">
    <div className="merch-stage" role="img" aria-label={`Postiz ${PRODUCTS[active].name} branding concept in 3D`}>
      <Canvas frameloop={visible ? "always" : "never"} camera={{ position: [0, .1, 7], fov: 38 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} fallback={<p className="model-loading">3D preview unavailable. Explore the included products below.</p>}>
        <Stage active={active} reduced={!!reduced} turn={turn} />
      </Canvas>
    </div>
    <div className="merch-tools">
      <button onClick={() => { setTurn(t => t + 1); setPaused(true); }} aria-label="Rotate product"><RotateCcw size={17} /></button>
      {!reduced && <button onClick={() => setPaused(p => !p)} aria-label={paused ? "Play product slideshow" : "Pause product slideshow"}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>}
    </div>
    <div className="merch-selector" role="group" aria-label="Choose a branded product">
      {PRODUCTS.map((product, i) => <button key={product.name} onClick={() => select(i)} aria-pressed={active === i}>{product.name}</button>)}
    </div>
    <p className="merch-description">{PRODUCTS[active].detail}</p>
    <p className="concept-note">Branding concepts · final artwork to be agreed</p>
  </div>;
}
