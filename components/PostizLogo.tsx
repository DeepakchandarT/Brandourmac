"use client";
import Image from "next/image";
import { trackSponsorClick, useSponsor } from "./SponsorProvider";

export default function PostizLogo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const sponsor=useSponsor();
  return <a href={sponsor.website} onClick={trackSponsorClick} target="_blank" rel="noopener noreferrer" className={`postiz-logo ${compact ? "postiz-logo--mark" : ""} ${className}`} style={compact?{width:62,aspectRatio:"auto"}:undefined} aria-label={`Visit ${sponsor.name} website`}>
    <Image
      src={`/api/sponsor/logo?v=${sponsor.version}`}
      alt={sponsor.hasLogo ? `${sponsor.name} logo` : "Your brand"}
      width={260}
      height={90}
      sizes={compact ? "40px" : "(max-width: 640px) 88px, 120px"}
      priority
      unoptimized
      style={{height:"auto",objectFit:"contain"}}
    />
  </a>;
}
