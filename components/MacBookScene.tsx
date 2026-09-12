"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, RoundedBox, Text, ContactShadows, Environment } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import { Suspense, useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";

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

  const spots = useMemo(() => {
    const arr: { x: number; y: number; id: number }[] = [];
    let id = 1;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        arr.push({
          x: (col - 1.5) * 0.34,
          y: (row - 1.5) * 0.22,
          id: id++,
        });
      }
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const p = progress.get(); // 0 -> closed, 1 -> fully open & documented

    // Lid hinge: closed ~ -0.02 rad, open ~ -1.92 rad
    const targetLid = THREE.MathUtils.lerp(-0.02, -1.92, Math.min(p / 0.55, 1));
    if (lid.current) {
      lid.current.rotation.x = THREE.MathUtils.damp(
        lid.current.rotation.x,
        targetLid,
        6,
        delta
      );
    }

    // Camera-esque push via group scale/position as p advances past the open point
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

  return (
    <group ref={group} rotation={[0.05, 0.35, 0]}>
      {/* Base */}
      <group position={[0, -0.06, 0]}>
        <RoundedBox args={[2.4, 0.07, 1.7]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color="#c9cace" metalness={0.85} roughness={0.28} />
        </RoundedBox>
        {/* Trackpad */}
        <mesh position={[0, 0.036, 0.28]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.9, 0.62]} />
          <meshStandardMaterial color="#b7b8bc" metalness={0.6} roughness={0.35} />
        </mesh>

        {/* 16 spot markers */}
        {spots.map((s) => (
          <mesh
            key={s.id}
            position={[s.x, 0.038, -0.35 + s.y]}
            rotation={[-Math.PI / 2, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(s.id);
            }}
            onPointerOut={() => setHovered((h) => (h === s.id ? null : h))}
          >
            <circleGeometry args={[0.045, 24]} />
            <meshStandardMaterial
              color={hovered === s.id ? "#5b5bff" : "#8f9096"}
              emissive={hovered === s.id ? "#5b5bff" : "#000000"}
              emissiveIntensity={hovered === s.id ? 0.6 : 0}
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
            args={[2.4, 1.55, 0.06]}
            radius={0.04}
            smoothness={4}
            position={[0, 0.775, 0]}
          >
            <meshStandardMaterial color="#c9cace" metalness={0.85} roughness={0.28} />
          </RoundedBox>
          {/* Screen face */}
          <mesh position={[0, 0.775, 0.034]}>
            <planeGeometry args={[2.2, 1.38]} />
            <meshStandardMaterial
              color="#050506"
              emissive={brandingVisible ? "#0a0a12" : "#000000"}
              emissiveIntensity={0.4}
            />
          </mesh>
          {brandingVisible && (
            <Text
              position={[0, 0.775, 0.04]}
              fontSize={0.22}
              color="#f5f4f1"
              letterSpacing={0.12}
              anchorX="center"
              anchorY="middle"
            >
              POSTIZ
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
        camera={{ position: [0, 0.55, 3.4], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 3, 2]} intensity={1.1} />
          <directionalLight position={[-2, 1, -2]} intensity={0.3} />
          <Laptop progress={progress} interactive={interactive} />
          <ContactShadows
            position={[0, -0.42, 0]}
            opacity={0.45}
            scale={6}
            blur={2.6}
            far={2}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
