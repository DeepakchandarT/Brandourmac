"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function latLongToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Abstract marker positions — illustrative only, not tied to real attendance
// data. `current: true` is the one meant to be kept up to date by hand as
// Deepak's actual current city — swap CURRENT_LOCATION_LABEL below.
const CURRENT_LOCATION_LABEL = "CURRENTLY HERE";
const MARKERS = [
  { lat: 12.9, lon: 77.6, current: true },
  { lat: 28.6, lon: 77.2 },
  { lat: 19.1, lon: 72.9 },
  { lat: 13.1, lon: 80.3 },
  { lat: 22.6, lon: 88.4 },
];

function GlobeMesh() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.2;
  });

  const radius = 1.3;

  return (
    <group ref={group} rotation={[0.15, 0, 0]}>
      <mesh>
        <sphereGeometry args={[radius, 30, 22]} />
        <meshBasicMaterial color="#131313" wireframe transparent opacity={0.16} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius - 0.015, 32, 32]} />
        <meshStandardMaterial color="#efece3" roughness={1} />
      </mesh>

      {MARKERS.map((m, i) => {
        const pos = latLongToVector3(m.lat, m.lon, radius + 0.02);
        return (
          <group key={i} position={pos}>
            <mesh>
              <sphereGeometry args={[m.current ? 0.05 : 0.032, 12, 12]} />
              <meshBasicMaterial color={m.current ? "#4640de" : "#9695b0"} />
            </mesh>
            {m.current && (
              <Html center distanceFactor={5} style={{ pointerEvents: "none" }}>
                <div className="px-2 py-1 bg-[#131313] text-[#f5f4f1] text-[9px] tracking-[0.14em] whitespace-nowrap">
                  {CURRENT_LOCATION_LABEL}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default function Globe() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0.25, 3.6], fov: 36 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1} />
        <directionalLight position={[3, 2, 2]} intensity={0.5} />
        <GlobeMesh />
      </Canvas>
    </div>
  );
}