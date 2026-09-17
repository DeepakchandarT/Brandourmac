"use client";
import { useTexture } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { trackSponsorClick, useSponsor } from "./SponsorProvider";

export function useBrandTexture(variant: "wordmark" | "mark" = "wordmark") {
  const source = useTexture("/api/sponsor/logo");
  const texture = useMemo(() => {
    const copy = source.clone();
    copy.colorSpace = THREE.SRGBColorSpace;
    copy.minFilter = THREE.LinearMipmapLinearFilter;
    copy.magFilter = THREE.LinearFilter;
    copy.generateMipmaps = true;
    copy.anisotropy = 8;
    copy.offset.x = 0;
    copy.repeat.x = 1;
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
  const sponsor=useSponsor();
  return <mesh position={position} rotation={rotation} scale={scale}
    onClick={e => { e.stopPropagation(); trackSponsorClick(); window.open(sponsor.website,"_blank","noopener,noreferrer"); }}
    onPointerOver={() => { document.body.style.cursor = "pointer"; }}
    onPointerOut={() => { document.body.style.cursor = ""; }}>
    <planeGeometry args={variant === "mark" ? [.72, .25] : [1.22, .43]} />
    <meshBasicMaterial map={texture} transparent depthWrite={false} alphaTest={.02} toneMapped={false} polygonOffset polygonOffsetFactor={-2} />
  </mesh>;
}
