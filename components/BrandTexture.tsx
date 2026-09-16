"use client";
import { useTexture } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

export function useBrandTexture() {
  const source = useTexture("/postiz-logo-transparent.png");
  const texture = useMemo(() => {
    const copy = source.clone();
    copy.colorSpace = THREE.SRGBColorSpace;
    copy.needsUpdate = true;
    return copy;
  }, [source]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

export function Brand({ position, scale = 1, rotation = [0, 0, 0] }: {
  position: [number, number, number]; scale?: number; rotation?: [number, number, number];
}) {
  const texture = useBrandTexture();
  return <mesh position={position} rotation={rotation} scale={scale}
    onClick={e => { e.stopPropagation(); window.location.assign("https://postiz.com/"); }}
    onPointerOver={() => { document.body.style.cursor = "pointer"; }}
    onPointerOut={() => { document.body.style.cursor = ""; }}>
    <planeGeometry args={[1.22, .41]} />
    <meshBasicMaterial map={texture} transparent alphaTest={.03} toneMapped={false} polygonOffset polygonOffsetFactor={-2} />
  </mesh>;
}
