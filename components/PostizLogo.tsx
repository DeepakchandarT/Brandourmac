import Image from "next/image";

export default function PostizLogo({ className = "" }: { className?: string }) {
  return <a href="https://postiz.com/" className={`postiz-logo ${className}`} aria-label="Visit Postiz website">
    <Image src="/postiz-logo.png" alt="Postiz" width={1536} height={318} priority />
  </a>;
}
