"use client";
import { useTexture } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

export function useBrandTexture(variant: "wordmark" | "mark" = "wordmark") {
  const source = useTexture("/postiz-logo-transparent.png");
  const texture = useMemo(() => {
    const copy = source.clone();
    copy.colorSpace = THREE.SRGBColorSpace;
    copy.minFilter = THREE.LinearMipmapLinearFilter;
    copy.magFilter = THREE.LinearFilter;
    copy.generateMipmaps = true;
    copy.anisotropy = 8;
    // The supplied wordmark has a transparent left margin; crop UVs, not the artwork.
    copy.offset.x = .36;
    copy.repeat.x = variant === "mark" ? .205 : .64;
    copy.needsUpdate = true;
    return copy;
  }, [source, variant]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

export function Brand({ position, scale = 1, rotation = [0, 0, 0], variant = "wordmark" }: {
  position: [number, number, number]; scale?: number; rotation?: [number, number, number]; variant?: "wordmark" | "mark";
}) {
  const texture = useBrandTexture(variant);
  return <mesh position={position} rotation={rotation} scale={scale}
    onClick={e => { e.stopPropagation(); window.location.assign("https://postiz.com/"); }}
    onPointerOver={() => { document.body.style.cursor = "pointer"; }}
    onPointerOut={() => { document.body.style.cursor = ""; }}>
    <planeGeometry args={variant === "mark" ? [.42, .42] : [1.22, .43]} />
    <meshBasicMaterial map={texture} transparent depthWrite={false} alphaTest={.02} toneMapped={false} polygonOffset polygonOffsetFactor={-2} />
  </mesh>;
}
