import Image from "next/image";

export default function PostizLogo({ className = "" }: { className?: string }) {
  return <a href="https://postiz.com/" className={`postiz-logo ${className}`} aria-label="Visit Postiz website">
    <Image src="/postiz-logo-transparent.png" alt="Postiz" width={2172} height={724} priority />
  </a>;
}
