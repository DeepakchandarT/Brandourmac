"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const PRODUCTS = ["T-Shirt", "Pen", "Notebook", "Water bottle", "Cap"];
const CYCLE_SECONDS = 4.2;

function PostizMark({ position = [0, 0, 0.2], scale = [1.25, 0.42, 1] }: {
  position?: [number, number, number];
  scale?: [number, number, number];
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 160;
    const context = canvas.getContext("2d")!;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#5148e5";
    context.font = "900 92px Arial";
    context.fillText("P", 32, 112);
    context.fillStyle = "#171717";
    context.font = "700 64px Arial";
    context.fillText("Postiz", 116, 108);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, []);

  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 0.3125]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

function Tee() {
  return (
    <group rotation={[-0.06, 0, 0]}>
      <RoundedBox args={[2.05, 2.35, 0.25]} radius={0.2} smoothness={5} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#fffdf8" roughness={0.82} />
      </RoundedBox>
      <RoundedBox args={[0.82, 1.05, 0.23]} radius={0.16} smoothness={5} position={[-1.19, 0.46, 0]} rotation={[0, 0, -0.58]}>
        <meshStandardMaterial color="#fffdf8" roughness={0.82} />
      </RoundedBox>
      <RoundedBox args={[0.82, 1.05, 0.23]} radius={0.16} smoothness={5} position={[1.19, 0.46, 0]} rotation={[0, 0, 0.58]}>
        <meshStandardMaterial color="#fffdf8" roughness={0.82} />
      </RoundedBox>
      <mesh position={[0, 1.08, 0.08]}>
        <torusGeometry args={[0.34, 0.09, 20, 48, Math.PI]} />
        <meshStandardMaterial color="#dedbd3" roughness={0.75} />
      </mesh>
      <PostizMark position={[0, 0.25, 0.14]} scale={[1.2, 1.2, 1]} />
    </group>
  );
}

function Pen() {
  return (
    <group rotation={[0, 0, -0.38]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 3.45, 32]} />
        <meshStandardMaterial color="#fefcf6" metalness={0.12} roughness={0.32} />
      </mesh>
      <mesh position={[-1.82, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.16, 0.42, 32]} />
        <meshStandardMaterial color="#262626" metalness={0.75} roughness={0.22} />
      </mesh>
      <PostizMark position={[0, 0, 0.165]} scale={[1.35, 0.92, 1]} />
    </group>
  );
}

function Notebook() {
  return (
    <group rotation={[-0.12, -0.08, -0.08]}>
      <RoundedBox args={[2.35, 3.05, 0.34]} radius={0.16} smoothness={5}>
        <meshStandardMaterial color="#f8f6ef" roughness={0.72} />
      </RoundedBox>
      <mesh position={[-1.13, 0, 0.2]}>
        <boxGeometry args={[0.12, 2.75, 0.1]} />
        <meshStandardMaterial color="#5148e5" roughness={0.45} />
      </mesh>
      <PostizMark position={[0.08, 0.12, 0.18]} scale={[1.45, 1.45, 1]} />
    </group>
  );
}

function Bottle() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.7, 0.78, 2.65, 48]} />
        <meshStandardMaterial color="#fbfaf5" metalness={0.38} roughness={0.24} />
      </mesh>
      <mesh position={[0, 1.48, 0]}>
        <cylinderGeometry args={[0.46, 0.52, 0.34, 48]} />
        <meshStandardMaterial color="#5148e5" roughness={0.38} />
      </mesh>
      <PostizMark position={[0, -0.05, 0.755]} scale={[1.25, 1.25, 1]} />
    </group>
  );
}

function Cap() {
  return (
    <group rotation={[-0.08, 0.08, 0]}>
      <mesh scale={[1.38, 0.9, 1]}>
        <sphereGeometry args={[1, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#fffdf8" roughness={0.68} side={THREE.DoubleSide} />
      </mesh>
      <RoundedBox args={[1.9, 0.18, 1.05]} radius={0.35} smoothness={6} position={[0, -0.03, 0.72]} rotation={[0.16, 0, 0]}>
        <meshStandardMaterial color="#f8f6ef" roughness={0.65} />
      </RoundedBox>
      <PostizMark position={[0, 0.44, 0.91]} scale={[1.1, 1.1, 1]} />
    </group>
  );
}

const OBJECTS = [Tee, Pen, Notebook, Bottle, Cap];

function ProductStage({ onChange }: { onChange: (index: number) => void }) {
  const refs = useRef<Array<THREE.Group | null>>([]);
  const lastIndex = useRef(-1);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const active = Math.floor(elapsed / CYCLE_SECONDS) % PRODUCTS.length;
    const local = elapsed % CYCLE_SECONDS;

    if (active !== lastIndex.current) {
      lastIndex.current = active;
      onChange(active);
    }

    refs.current.forEach((group, index) => {
      if (!group) return;
      group.visible = index === active;
      if (index !== active) return;
      const entering = Math.min(local / 1.05, 1);
      const leaving = Math.max((local - 3.35) / 0.85, 0);
      const smoothIn = 1 - Math.pow(1 - entering, 4);
      const smoothOut = leaving * leaving;
      group.position.x = THREE.MathUtils.lerp(3.8, 0, smoothIn) - 3.8 * smoothOut;
      group.position.y = Math.sin(local * 1.55) * 0.06;
      group.rotation.y = (1 - smoothIn) * -Math.PI * 1.35 + local * 0.22 + smoothOut * Math.PI;
      group.rotation.x = Math.sin(local * 0.8) * 0.04;
      group.scale.setScalar(0.82 + smoothIn * 0.18 - smoothOut * 0.12);
    });
  });

  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[-4, 6, 5]} intensity={3.2} color="#ffffff" />
      <directionalLight position={[5, 1, 4]} intensity={1.4} color="#817aff" />
      {OBJECTS.map((Product, index) => (
        <group key={PRODUCTS[index]} ref={(node) => { refs.current[index] = node; }}>
          <Product />
        </group>
      ))}
      <ContactShadows position={[0, -1.85, 0]} opacity={0.24} scale={7} blur={2.6} far={4} color="#77716a" />
    </>
  );
}

export default function MerchCarousel() {
  const [active, setActive] = useState(0);
  return (
    <div className="relative mx-auto h-[390px] w-full max-w-xl overflow-hidden rounded-[2.5rem] neo-inset">
      <div className="pointer-events-none absolute inset-x-8 top-7 z-10 flex items-center justify-between md:inset-x-12 md:top-8">
        <span className="text-[10px] tracking-[0.2em] text-mute">ROTATING BRAND KIT</span>
        <span className="font-display text-lg text-bone">{PRODUCTS[active]}</span>
      </div>
      <Canvas camera={{ position: [0, 0.1, 6.5], fov: 38 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ProductStage onChange={setActive} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center gap-2">
        {PRODUCTS.map((product, index) => (
          <span key={product} className={`h-1.5 rounded-full transition-all duration-500 ${index === active ? "w-8 bg-accent" : "w-1.5 bg-bone/15"}`} />
        ))}
      </div>
    </div>
  );
}
