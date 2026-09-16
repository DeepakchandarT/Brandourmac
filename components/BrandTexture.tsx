"use client";
import { useTexture } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

export function useBrandTexture(variant: "wordmark" | "mark" = "wordmark") {
  const source = useTexture(variant === "mark" ? "/postiz-mark.svg" : "/postiz-logo-transparent.png");
  const texture = useMemo(() => {
    const copy = source.clone();
    copy.colorSpace = THREE.SRGBColorSpace;
    copy.minFilter = THREE.LinearMipmapLinearFilter;
    copy.magFilter = THREE.LinearFilter;
    copy.generateMipmaps = true;
    copy.anisotropy = 8;
    copy.premultiplyAlpha = true;
    copy.needsUpdate = true;
    return copy;
  }, [source]);
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
    <planeGeometry args={variant === "mark" ? [.42, .42] : [1.22, .275]} />
    <meshBasicMaterial map={texture} transparent alphaTest={.1} toneMapped={false} polygonOffset polygonOffsetFactor={-2} />
  </mesh>;
}
