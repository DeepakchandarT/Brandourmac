"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, RoundedBox, ContactShadows, Environment } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import { Suspense, useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";

// Procedural canvas texture standing in for a keyboard deck — a faint grid
// of key outlines is enough to read as "keyboard" without modeling ~80
// individual keycaps.
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
    ctx.fillStyle = "#767781";
    ctx.fillRect(padX + keyW * 3, padY + rows * keyH, keyW * 8, 26);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }, []);
}

/**
 * Hinge convention (this is the part that was previously buggy):
 *   rotation.x = 0      -> lid lies FLAT, folded forward over the keyboard (CLOSED)
 *   rotation.x = -1.72  -> lid stands upright, reclined slightly (OPEN)
 * The lid panel's own geometry extends along +Z (toward the viewer) when
 * unrotated, so "closed" naturally lies flat on top of the base.
 */
const LID_CLOSED = 0;
const LID_OPEN = -1.72;

function Laptop({
  progress,
  interactive,
}: {
  progress: MotionValue<number>;
  interactive: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const hinge = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<number | null>(null);
  const keyboardTexture = useKeyboardTexture();

  const spots = useMemo(() => {
    const arr: { x: number; z: number; id: number }[] = [];
    let id = 1;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        arr.push({
          x: (col - 1.5) * 0.34,
          z: -0.55 + row * 0.22,
          id: id++,
        });
      }
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const p = progress.get(); // 0 -> closed, 1 -> fully open & documented

    const openAmount = Math.min(p / 0.6, 1);
    const targetHinge = THREE.MathUtils.lerp(LID_CLOSED, LID_OPEN, openAmount);
    if (hinge.current) {
      hinge.current.rotation.x = THREE.MathUtils.damp(
        hinge.current.rotation.x,
        targetHinge,
        6,
        delta
      );
    }

    if (group.current) {
      const t = state.clock.getElapsedTime();
      const floatY = interactive ? Math.sin(t * 0.6) * 0.04 : 0;

      // No aggressive push-in here — the earlier version zoomed the camera
      // so close during the open transition that it filled the frame with
      // a blurry close-up instead of a composed shot. Keep depth nearly
      // constant; the hinge + spin/tilt alone carry the reveal.
      const targetZ = 0;
      const targetY = -0.15 + floatY - openAmount * 0.03;

      group.current.position.z = THREE.MathUtils.damp(
        group.current.position.z,
        targetZ,
        4,
        delta
      );
      group.current.position.y = THREE.MathUtils.damp(
        group.current.position.y,
        targetY,
        4,
        delta
      );

      // "Spin out" reveal: sweeps from a side-on angle to near-front as it
      // opens, and tilts downward (modestly) to bring the keyboard into
      // view without the geometry ballooning to fill the frame.
      const targetRotY = interactive
        ? 0.3 + mouse.current.x * 0.22
        : THREE.MathUtils.lerp(0.75, 0.08, openAmount);
      const targetRotX = interactive
        ? 0.08 + mouse.current.y * -0.08
        : THREE.MathUtils.lerp(0.05, 0.24, openAmount);

      

      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        targetRotY,
        4.5,
        delta
      );
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        targetRotX,
        4.5,
        delta
      );
    }
  });

  const [brandingVisible, setBrandingVisible] = useState(false);
  useFrame(() => {
    const next = progress.get() > 0.55;
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

  const aluminum = { color: "#d3d4d8", metalness: 0.9, roughness: 0.22 };

  return (
    <group ref={group}>
      {/* Base — top surface sits exactly at local y = 0 */}
      <group position={[0, -0.025, 0]}>
        <RoundedBox args={[2.4, 0.05, 1.7]} radius={0.05} smoothness={5}>
          <meshPhysicalMaterial {...aluminum} clearcoat={0.4} clearcoatRoughness={0.4} />
        </RoundedBox>

        {/* Keyboard deck */}
        <mesh position={[0, 0.026, -0.32]} rotation={[-Math.PI / 2, 0, 0]}>
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
          <meshPhysicalMaterial color="#c7c8cd" metalness={0.5} roughness={0.25} clearcoat={0.6} />
        </mesh>

        {/* 16 spot markers */}
        {spots.map((s) => (
          <mesh
            key={s.id}
            position={[s.x, 0.03, s.z]}
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

      {/* Hinge, at the back edge of the base (y matches base top surface) */}
      <group ref={hinge} position={[0, 0, -0.85]}>
        {/* Panel — centered so it extends from the hinge (z=0) to z=+1.7 when flat,
            matching the base's depth so it covers it fully when closed. */}
        <group position={[0, 0, 0.85]}>
          <RoundedBox args={[2.4, 0.045, 1.7]} radius={0.06} smoothness={5}>
            <meshPhysicalMaterial {...aluminum} clearcoat={0.4} clearcoatRoughness={0.4} />
          </RoundedBox>

          {/* Inner face (bezel + screen) — faces -Y in this local frame, which
              becomes "toward the viewer" once the hinge opens. */}
          <mesh position={[0, -0.026, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.28, 1.46]} />
            <meshStandardMaterial color="#020203" roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.032, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.18, 1.36]} />
            <meshStandardMaterial
              color="#050506"
              emissive={brandingVisible ? "#0a0a12" : "#000000"}
              emissiveIntensity={0.4}
            />
          </mesh>
          {/* Camera notch, near the far edge (top of screen once open) */}
          <mesh position={[0, -0.033, 0.78]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.012, 16]} />
            <meshStandardMaterial color="#111216" roughness={0.4} metalness={0.3} />
          </mesh>

          {brandingVisible && (
            <Html
              position={[0, -0.05, 0]}
              center
              distanceFactor={2.6}
              style={{ pointerEvents: "none" }}
            >
              <div className="text-[#f5f4f1] font-sans font-medium text-[13px] leading-snug text-center tracking-[0.01em] whitespace-nowrap">
                You&rsquo;re the hero,
                <br />
                not a sidekick.
              </div>
            </Html>
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
        camera={{ position: [0, 0.85, 3.5], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[2, 3, 2]} intensity={1.2} />
          <directionalLight position={[-2, 1.2, -1.5]} intensity={0.4} />
          <directionalLight position={[0, 0.4, -2.5]} intensity={0.35} color="#eef0ff" />
          <Laptop progress={progress} interactive={interactive} />
          <ContactShadows position={[0, -0.42, 0]} opacity={0.4} scale={6} blur={2.8} far={2} />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}