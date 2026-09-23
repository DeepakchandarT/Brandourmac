import Image from "next/image";

export default function Footer() {
  return (
    <footer className="container-edge py-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-line">
      <div className="flex flex-col items-center gap-1 md:items-start">
        <p className="text-[12px] tracking-[0.14em] text-mute">
          BUILT IN INDIA · DESIGNED FOR THE WORLD
        </p>
        <p className="text-[11px] text-mute">Inspired by <a className="underline underline-offset-2" href="https://brandmymac.com/" target="_blank" rel="noreferrer">Vincent’s BrandMyMac</a>. Built as BrandMyReach.</p>
      </div>
      <Image src="/brand/brandmyreach-wordmark.png" alt="BrandMyReach" width={150} height={32} className="footer-brandmark" />
      <p className="text-[12px] tracking-[0.14em] text-mute">© {new Date().getFullYear()}</p>
    </footer>
  );
}
