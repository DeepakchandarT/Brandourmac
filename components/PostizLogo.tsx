import Image from "next/image";

export default function PostizLogo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return <a href="https://postiz.com/" className={`postiz-logo ${compact ? "postiz-logo--mark" : ""} ${className}`} aria-label="Visit Postiz website">
    <Image
      src={compact ? "/postiz-mark.svg" : "/postiz-logo-transparent.png"}
      alt="Postiz"
      width={compact ? 112 : 900}
      height={compact ? 112 : 203}
      sizes={compact ? "40px" : "(max-width: 640px) 88px, 120px"}
      priority
      unoptimized
    />
  </a>;
}
