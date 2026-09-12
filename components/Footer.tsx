export default function Footer() {
  return (
    <footer className="container-edge py-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-line">
      <p className="text-[12px] tracking-[0.14em] text-mute">
        BUILT IN INDIA · DESIGNED FOR THE WORLD
      </p>
      <p className="text-[12px] tracking-[0.14em] text-mute">
        DEEPAK © {new Date().getFullYear()}
      </p>
    </footer>
  );
}
