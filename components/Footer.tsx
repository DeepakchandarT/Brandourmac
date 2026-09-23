import Image from "next/image";

export default function Footer() {
  return (
    <footer className="container-edge py-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-line">
      <p className="text-[12px] tracking-[0.14em] text-mute">
        BUILT IN INDIA · DESIGNED FOR THE WORLD
      </p>
      <Image src="/brand/brandmyreach-wordmark.png" alt="BrandMyReach" width={150} height={32} className="footer-brandmark" />
      <p className="text-[12px] tracking-[0.14em] text-mute">© {new Date().getFullYear()}</p>
    </footer>
  );
}
