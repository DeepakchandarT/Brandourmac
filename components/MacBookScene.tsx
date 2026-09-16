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
 * Hinge convention:
 *   rotation.x = 0      -> lid lies FLAT, folded forward over the keyboard (CLOSED)
 *   rotation.x = -1.72  -> lid stands upright, reclined slightly (OPEN)
 */
const LID_CLOSED = 0;
const LID_OPEN = -1.72;

function useSponsorTexture(id: number) {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 384;
    canvas.height = 224;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#6b63f1");
    gradient.addColorStop(1, "#3730b7");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,.34)";
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
    ctx.fillStyle = "rgba(255,255,255,.62)";
    ctx.font = "500 22px Arial";
    ctx.fillText(String(id).padStart(2, "0"), 26, 42);
    ctx.fillStyle = "#fff";
    ctx.font = "700 42px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("POSTIZ", canvas.width / 2, canvas.height / 2 + 10);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, [id]);
}

function SponsorSlot({
  id,
  x,
  z,
  progress,
  interactive,
}: {
  id: number;
  x: number;
  z: number;
  progress: MotionValue<number>;
  interactive: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const texture = useSponsorTexture(id);

  useEffect(() => () => texture?.dispose(), [texture]);

  useFrame((state, delta) => {
    const sequence = interactive
      ? Math.min(1, Math.max(0, state.clock.getElapsedTime() * 0.55 - id * 0.055))
      : Math.min(1, Math.max(0, (progress.get() - 0.04 - id * 0.009) / 0.18));
    const eased = 1 - Math.pow(1 - sequence, 3);
    if (mesh.current) {
      const next = THREE.MathUtils.lerp(0.72, 1, eased);
      mesh.current.scale.x = THREE.MathUtils.damp(mesh.current.scale.x, next, 9, delta);
      mesh.current.scale.y = THREE.MathUtils.damp(mesh.current.scale.y, next, 9, delta);
    }
    if (material.current) {
      material.current.opacity = THREE.MathUtils.damp(material.current.opacity, eased, 10, delta);
      material.current.emissiveIntensity = 0.08 + Math.sin(state.clock.elapsedTime * 1.2 + id) * 0.025;
    }
  });

  return (
    <mesh ref={mesh} position={[x, 0.032, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.49, 0.3]} />
      <meshStandardMaterial
        ref={material}
        map={texture ?? undefined}
        color={texture ? "#ffffff" : "#5148e5"}
        emissive="#5148e5"
        transparent
        opacity={0}
        roughness={0.48}
        metalness={0.08}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

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
          x: (col - 1.5) * 0.54,
          z: -0.53 + row * 0.35,
          id: id++,
        });
      }
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const p = progress.get();

    const openAmount = Math.min(Math.max((p - 0.28) / 0.42, 0), 1);
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

      const targetZ = interactive ? 0 : THREE.MathUtils.lerp(0.18, 0, openAmount);
      const targetY = -0.12 + floatY - openAmount * 0.08;

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

      const targetRotY = interactive
        ? -0.16 + mouse.current.x * 0.2
        : THREE.MathUtils.lerp(-0.2, 0.14, openAmount);
      const targetRotX = interactive
        ? -0.12 + mouse.current.y * -0.08
        : THREE.MathUtils.lerp(-0.12, 0.15, openAmount);

      const targetScale = interactive ? 1.04 : THREE.MathUtils.lerp(0.9, 1.02, openAmount);
      const currentScale = THREE.MathUtils.damp(group.current.scale.x, targetScale, 5, delta);
      group.current.scale.setScalar(currentScale);

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
    const next = progress.get() > 0.58;
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

  const aluminum = { color: "#d3d4d8", metalness: 0.55, roughness: 0.42 };

  return (
    <group ref={group} scale={0.9}>
      <group position={[0, -0.025, 0]}>
        <RoundedBox args={[2.4, 0.05, 1.7]} radius={0.05} smoothness={5}>
          <meshPhysicalMaterial {...aluminum} clearcoat={0.12} clearcoatRoughness={0.7} />
        </RoundedBox>

        <mesh position={[0, 0.026, -0.32]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.86, 0.72]} />
          {keyboardTexture ? (
            <meshStandardMaterial map={keyboardTexture} roughness={0.6} metalness={0.15} />
          ) : (
            <meshStandardMaterial color="#8b8c92" roughness={0.6} />
          )}
        </mesh>

        <mesh position={[0, 0.027, 0.42]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.82, 0.56]} />
          <meshPhysicalMaterial color="#c7c8cd" metalness={0.4} roughness={0.35} clearcoat={0.15} />
        </mesh>

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

      <group ref={hinge} position={[0, 0, -0.85]}>
        <group position={[0, 0, 0.85]}>
          <RoundedBox args={[2.4, 0.045, 1.7]} radius={0.06} smoothness={5}>
            <meshPhysicalMaterial {...aluminum} clearcoat={0.12} clearcoatRoughness={0.7} />
          </RoundedBox>

          {spots.map((spot) => (
            <SponsorSlot
              key={`lid-${spot.id}`}
              {...spot}
              progress={progress}
              interactive={interactive}
            />
          ))}

          <mesh position={[0, -0.026, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.28, 1.46]} />
            <meshBasicMaterial color="#020203" />
          </mesh>
          <mesh position={[0, -0.032, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.18, 1.36]} />
            <meshBasicMaterial color={brandingVisible ? "#0d0d14" : "#050506"} />
          </mesh>

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
        camera={{ position: [0, 1.15, 4.45], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.62} />
          <directionalLight position={[2.5, 3.5, 3]} intensity={1.1} />
          <directionalLight position={[-2, 1.2, -1.5]} intensity={0.45} color="#b9b5ff" />
          <pointLight position={[0, 0.8, 2.2]} intensity={0.55} color="#5148e5" />
          <Laptop progress={progress} interactive={interactive} />
          <ContactShadows position={[0, -0.42, 0]} opacity={0.4} scale={6} blur={2.8} far={2} />
          <Environment preset="city" background={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
