"use client";

import { motion, useTransform, MotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { APPLE_PATH } from "@/lib/brand-artwork";

const AppleMark = () => <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[28%] w-[28%] fill-[#34353a] drop-shadow-[0_1px_0_rgba(255,255,255,.28)]">
  <path d={APPLE_PATH}/>
</svg>;

/**
 * A pure CSS/3D-transform MacBook. No WebGL, so it's cheap enough for any
 * phone, but it still folds open exactly in sync with scroll (or stays
 * gently idle when `progress` is a static 0, as in the hero).
 */
export default function CSSMacBook({
  progress,
  idleFloat = false,
  brandedWhenOpen = true,
}: {
  progress: MotionValue<number>;
  idleFloat?: boolean;
  brandedWhenOpen?: boolean;
}) {
  const smooth = useSpring(progress, { stiffness: 120, damping: 22, mass: 0.6 });

  // Lid closed ≈ 100deg (folded flat over the base), open ≈ 8deg.
  const lidRotate = useTransform(smooth, [0, 0.55], [100, 8], { clamp: true });
  const screenOpacity = useTransform(smooth, [0.45, 0.6], [0, 1]);
  const wordmarkY = useTransform(smooth, [0.45, 0.6], [6, 0]);
  const liftY = useTransform(smooth, [0, 0.55, 1], [0, -6, -10]);
  const scale = useTransform(smooth, [0, 0.55, 1], [0.94, 1, 1.03]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{ perspective: "1400px" }}
    >
      <motion.div
        style={{ y: liftY, scale }}
        className={idleFloat ? "animate-[macfloat_6s_ease-in-out_infinite]" : ""}
      >
        <div
          className="relative"
          style={{ transformStyle: "preserve-3d", width: "min(72vw, 340px)" }}
        >
          {/* Base / keyboard deck */}
          <div
            className="relative mx-auto"
            style={{
              width: "100%",
              aspectRatio: "16 / 2.2",
              background:
                "linear-gradient(180deg, #dcdde1 0%, #c3c4c9 45%, #a4a5ab 100%)",
              borderRadius: "3px 3px 6px 6px",
              boxShadow: "0 20px 44px -16px rgba(0,0,0,0.6)",
            }}
          >
            {/* keyboard recess */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-[8%] rounded-[2px]"
              style={{
                width: "82%",
                height: "60%",
                background:
                  "repeating-linear-gradient(90deg, #8f9096 0px, #8f9096 5.5%, #7c7d83 5.5%, #7c7d83 6.2%)",
                opacity: 0.85,
              }}
            />
            {/* trackpad */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[10%] rounded-[3px]"
              style={{
                width: "26%",
                height: "22%",
                background: "linear-gradient(180deg, #cfd0d4, #b5b6bb)",
              }}
            />
            {/* front edge lip for a sense of thickness */}
            <div
              className="absolute left-0 right-0 bottom-0 rounded-b-[6px]"
              style={{
                height: "14%",
                background: "linear-gradient(180deg, #999aa0, #7a7b81)",
              }}
            />
          </div>

          {/* Lid, hinged at the back edge of the base */}
          <motion.div
            style={{
              rotateX: lidRotate,
              transformOrigin: "50% 100%",
              transformStyle: "preserve-3d",
            }}
            className="absolute left-0 right-0 bottom-full mx-auto"
          >
            <div
              className="relative mx-auto rounded-t-[10px] rounded-b-[2px]"
              style={{
                width: "100%",
                aspectRatio: "16 / 10.2",
                background:
                  "linear-gradient(160deg, #e2e3e6 0%, #b7b8bd 45%, #8d8e94 100%)",
                boxShadow:
                  "0 10px 30px -12px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.25)",
                padding: "3.2%",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="absolute inset-[3.2%] rounded-[6px] bg-[#050506] flex items-center justify-center overflow-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* camera notch */}
                <div className="absolute top-[6%] left-1/2 -translate-x-1/2 w-[5%] aspect-square rounded-full bg-black ring-1 ring-white/10" />

                {brandedWhenOpen && (
                  <motion.div
                    style={{ opacity: screenOpacity, y: wordmarkY }}
                    className="flex w-full flex-col items-center px-[8%] text-center"
                  >
                    <Image src="/postiz-mark.svg" alt="Postiz" width={112} height={112} className="h-auto w-[24%] max-w-[66px]" />
                    <span className="mt-[7%] text-[clamp(0.85rem,3.2vw,1.2rem)] font-medium leading-snug tracking-[0.02em] text-[#f5f4f1]">
                      Own the canvas.
                    </span>
                  </motion.div>
                )}
              </div>

              <div
                className="absolute inset-[3.2%] rounded-[6px] grid grid-cols-4 gap-[2.3%] p-[2.3%] bg-[#c6c7cb]"
                style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
              >
                {Array.from({ length: 16 }).map((_, index) => {
                  const row=Math.floor(index/4), col=index%4;
                  const center=(row===1||row===2)&&(col===1||col===2);
                  return center ? <div key={index} className="flex items-center justify-center">
                    {index===5&&<div className="absolute inset-0 flex items-center justify-center"><AppleMark/></div>}
                  </div> : (
                  <div
                    key={index}
                    className="flex rotate-180 items-center justify-center rounded-[3px] bg-white shadow-[0_2px_5px_rgba(34,28,64,.12)]"
                  >
                    <span className="relative block w-[86%] overflow-hidden" style={{aspectRatio:"2.84"}}>
                      <Image src="/postiz-logo-transparent.png" alt="Postiz" width={900} height={203} unoptimized style={{position:"absolute",width:"156.25%",maxWidth:"none",height:"100%",left:"-56.25%",top:0}} />
                    </span>
                  </div>
                )})}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
