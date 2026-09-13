"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, RoundedBox, Text, ContactShadows, Environment } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import { Suspense, useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";

// Procedural canvas texture standing in for a keyboard deck — a faint grid
// of key outlines is enough to read as "keyboard" without modeling ~80
// individual keycaps (expensive, and unnecessary at this camera distance).
function useKeyboardTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#9a9ba1";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cols = 15;
    const rows = 5;
    const padX = 18;
    const padY = 18;
    const keyW = (canvas.width - padX * 2) / cols;
    const keyH = (canvas.height - padY * 2 - 46) / rows;
    ctx.fillStyle = "#7d7e84";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = padX + c * keyW + 2;
        const y = padY + r * keyH + 2;
        const w = keyW - 4;
        const h = keyH - 4;
        const rad = 4;
        ctx.beginPath();
        ctx.moveTo(x + rad, y);
        ctx.arcTo(x + w, y, x + w, y + h, rad);
        ctx.arcTo(x + w, y + h, x, y + h, rad);
        ctx.arcTo(x, y + h, x, y, rad);
        ctx.arcTo(x, y, x + w, y, rad);
        ctx.closePath();
        ctx.fill();
      }
    }
    // spacebar row hint
    ctx.fillStyle = "#767781";
    ctx.fillRect(padX + keyW * 3, padY + rows * keyH, keyW * 8, 26);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }, []);
}

function Laptop({
  progress,
  interactive,
}: {
  progress: MotionValue<number>;
  interactive: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<number | null>(null);
  const keyboardTexture = useKeyboardTexture();

  const spots = useMemo(() => {
    const arr: { x: number; y: number; id: number }[] = [];
    let id = 1;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        arr.push({
          x: (col - 1.5) * 0.34,
          y: (row - 1.5) * 0.2,
          id: id++,
        });
      }
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const p = progress.get(); // 0 -> closed, 1 -> fully open & documented

    const targetLid = THREE.MathUtils.lerp(-0.02, -1.92, Math.min(p / 0.55, 1));
    if (lid.current) {
      lid.current.rotation.x = THREE.MathUtils.damp(
        lid.current.rotation.x,
        targetLid,
        6,
        delta
      );
    }

    const zoom = THREE.MathUtils.smoothstep(p, 0.55, 0.85);
    const pullback = THREE.MathUtils.smoothstep(p, 0.85, 1);

    if (group.current) {
      const t = state.clock.getElapsedTime();
      const floatY = interactive ? Math.sin(t * 0.6) * 0.05 : 0;

      const baseZ = THREE.MathUtils.lerp(0, 1.1, zoom) - pullback * 0.6;
      const baseY = -0.2 + floatY - zoom * 0.15;

      group.current.position.z = THREE.MathUtils.damp(
        group.current.position.z,
        baseZ,
        4,
        delta
      );
      group.current.position.y = THREE.MathUtils.damp(
        group.current.position.y,
        baseY,
        4,
        delta
      );

      const targetRotY = interactive
        ? mouse.current.x * 0.22
        : THREE.MathUtils.lerp(0.35, 0, Math.min(p / 0.4, 1));
      const targetRotX = interactive ? mouse.current.y * -0.08 : 0.05;

      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        targetRotY,
        5,
        delta
      );
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        targetRotX,
        5,
        delta
      );
    }
  });

  const [brandingVisible, setBrandingVisible] = useState(false);
  useFrame(() => {
    const next = progress.get() > 0.5;
    setBrandingVisible((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    if (!interactive) return;
    function handleWindowPointerMove(e: PointerEvent) {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.current = { x, y };
    }
    window.addEventListener("pointermove", handleWindowPointerMove);
    return () => window.removeEventListener("pointermove", handleWindowPointerMove);
  }, [interactive]);

  const aluminum = {
    color: "#d3d4d8",
    metalness: 0.9,
    roughness: 0.22,
  };

  return (
    <group ref={group} rotation={[0.05, 0.35, 0]}>
      {/* Base — slim wedge deck */}
      <group position={[0, -0.05, 0]}>
        <RoundedBox args={[2.4, 0.05, 1.7]} radius={0.05} smoothness={5}>
          <meshPhysicalMaterial {...aluminum} clearcoat={0.4} clearcoatRoughness={0.4} />
        </RoundedBox>

        {/* Keyboard deck recess */}
        <mesh position={[0, 0.026, -0.14]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.86, 0.72]} />
          {keyboardTexture ? (
            <meshStandardMaterial map={keyboardTexture} roughness={0.6} metalness={0.15} />
          ) : (
            <meshStandardMaterial color="#8b8c92" roughness={0.6} />
          )}
        </mesh>

        {/* Trackpad */}
        <mesh position={[0, 0.027, 0.42]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.82, 0.56]} />
          <meshPhysicalMaterial
            color="#c7c8cd"
            metalness={0.5}
            roughness={0.25}
            clearcoat={0.6}
          />
        </mesh>

        {/* 16 spot markers, spread across the deck */}
        {spots.map((s) => (
          <mesh
            key={s.id}
            position={[s.x, 0.03, -0.35 + s.y]}
            rotation={[-Math.PI / 2, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(s.id);
            }}
            onPointerOut={() => setHovered((h) => (h === s.id ? null : h))}
          >
            <circleGeometry args={[0.04, 24]} />
            <meshStandardMaterial
              color={hovered === s.id ? "#4640de" : "#9a9ba1"}
              emissive={hovered === s.id ? "#4640de" : "#000000"}
              emissiveIntensity={hovered === s.id ? 0.6 : 0}
              transparent
              opacity={hovered === s.id ? 1 : 0.55}
            />
            {hovered === s.id && (
              <Html center distanceFactor={6} style={{ pointerEvents: "none" }}>
                <div className="px-2 py-1 rounded-none bg-black/80 border border-white/20 text-[10px] tracking-[0.15em] text-white whitespace-nowrap">
                  SPOT {String(s.id).padStart(2, "0")}
                </div>
              </Html>
            )}
          </mesh>
        ))}
      </group>

      {/* Lid, hinged at the back edge */}
      <group position={[0, -0.02, -0.85]}>
        <group ref={lid}>
          <RoundedBox
            args={[2.4, 1.55, 0.045]}
            radius={0.06}
            smoothness={5}
            position={[0, 0.775, 0]}
          >
            <meshPhysicalMaterial {...aluminum} clearcoat={0.4} clearcoatRoughness={0.4} />
          </RoundedBox>

          {/* Screen bezel */}
          <RoundedBox
            args={[2.28, 1.46, 0.01]}
            radius={0.03}
            smoothness={4}
            position={[0, 0.775, 0.026]}
          >
            <meshStandardMaterial color="#020203" roughness={0.9} />
          </RoundedBox>

          {/* Screen face (slightly inset from the bezel) */}
          <mesh position={[0, 0.775, 0.032]}>
            <planeGeometry args={[2.18, 1.36]} />
            <meshStandardMaterial
              color="#050506"
              emissive={brandingVisible ? "#0a0a12" : "#000000"}
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* Camera notch */}
          <mesh position={[0, 1.47, 0.033]}>
            <circleGeometry args={[0.012, 16]} />
            <meshStandardMaterial color="#111216" roughness={0.4} metalness={0.3} />
          </mesh>

          {brandingVisible && (
            <Text
              position={[0, 0.775, 0.04]}
              fontSize={0.135}
              maxWidth={1.9}
              lineHeight={1.25}
              textAlign="center"
              color="#f5f4f1"
              letterSpacing={0.01}
              anchorX="center"
              anchorY="middle"
            >
              You&rsquo;re the hero,{"\n"}not a sidekick.
            </Text>
         
          )}
        </group>
      </group>
    </group>
  );
}

export default function MacBookScene({
  progress,
  interactive = true,
}: {
  progress: MotionValue<number>;
  interactive?: boolean;
}) {
  return (
    <div className="w-full h-full">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.6, 3.6], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[2, 3, 2]} intensity={1.2} />
          <directionalLight position={[-2, 1.2, -1.5]} intensity={0.4} />
          <directionalLight position={[0, 0.4, -2.5]} intensity={0.35} color="#eef0ff" />
          <Laptop progress={progress} interactive={interactive} />
          <ContactShadows
            position={[0, -0.42, 0]}
            opacity={0.4}
            scale={6}
            blur={2.8}
            far={2}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}