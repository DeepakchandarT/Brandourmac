"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import { Eyebrow, Reveal } from "./Reveal";

export default function PrivateOffer() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [offerStatus, setOfferStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [offerError, setOfferError] = useState("");

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = (await response.json()) as {
        unlocked?: boolean;
        error?: string;
      };

      if (!response.ok || !result.unlocked) {
        setError(result.error ?? "Unable to verify this invitation.");
        return;
      }

      setUnlocked(true);
    } catch {
      setError("Unable to verify the invitation right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitOffer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOfferStatus("sending");
    setOfferError("");
    const form = new FormData(event.currentTarget);
    const contact = String(form.get("contact") ?? "");
    const email = String(form.get("email") ?? "");
    const amount = String(form.get("amount") ?? "");
    const note = String(form.get("note") ?? "");
    try {
      const response = await fetch("/api/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, contact, email, amount, note }),
      });
      const result = (await response.json()) as { sent?: boolean; error?: string };

      if (!response.ok || !result.sent) {
        setOfferError(result.error ?? "The offer could not be sent.");
        setOfferStatus("idle");
        return;
      }

      setOfferStatus("sent");
    } catch {
      setOfferError("The offer could not be sent. Please try again.");
      setOfferStatus("idle");
    }
  }

  return (
    <section
      id="private-offer"
      className="relative container-edge py-28 md:py-40 border-t border-line"
    >
      <Eyebrow>PRIVATE INVITATION</Eyebrow>
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <div>
            <h2 className="font-display font-light text-balance text-4xl md:text-6xl leading-[1.04] tracking-tightest2">
              No auction.
              <br />
              <span className="italic">No competition.</span>
            </h2>
            <p className="mt-7 max-w-md text-lg text-mute text-balance">
              This invitation is for one brand only. Name the price that makes
              sense for a twelve-month, category-exclusive partnership.
            </p>

            <div className="neo-inset mt-10 max-w-md rounded-2xl p-5">
              <p className="text-[10px] tracking-[0.18em] text-mute mb-2">
                A USEFUL REFERENCE POINT
              </p>
              <p className="font-display text-xl leading-snug">
                Postiz previously offered €1,200—approximately $1,404 at the
                time—for one lid placement on BrandMyMac.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-mute">
                This private proposal includes all 16 placements, apparel,
                accessories and monthly documentation.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="neo-panel rounded-[2rem] p-6 md:p-10 min-h-[470px]">
            <AnimatePresence mode="wait">
              {!unlocked ? (
                <motion.div
                  key="locked"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="flex min-h-[390px] flex-col justify-center"
                >
                  <div className="neo-inset mb-8 flex h-14 w-14 items-center justify-center rounded-2xl">
                    <LockKeyhole className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <p className="font-display text-3xl">Enter your invitation.</p>
                  <p className="mt-3 max-w-sm text-mute">
                    The private offer form is reserved for the invited Postiz team.
                  </p>
                  <form onSubmit={unlock} className="mt-9">
                    <label htmlFor="invite-code" className="text-[11px] tracking-[0.16em] text-mute">
                      INVITATION CODE
                    </label>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <input
                        id="invite-code"
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        autoComplete="off"
                        required
                        className="neo-inset min-w-0 flex-1 rounded-full px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-accent/40"
                        placeholder="Enter private code"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="neo-button rounded-full px-7 py-4 text-xs tracking-[0.14em] disabled:opacity-50"
                      >
                        {loading ? "CHECKING…" : "UNLOCK OFFER"}
                      </button>
                    </div>
                    {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="unlocked"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-7 flex items-center gap-3 text-xs tracking-[0.14em] text-accent">
                    <span className="neo-inset flex h-9 w-9 items-center justify-center rounded-full">
                      <Check className="h-4 w-4" />
                    </span>
                    PRIVATE OFFER UNLOCKED
                  </div>
                  <h3 className="font-display text-3xl">What is the partnership worth to you?</h3>
                  <form onSubmit={submitOffer} className="mt-8 grid gap-5 sm:grid-cols-2">
                    <label className="text-xs tracking-[0.12em] text-mute">
                      YOUR NAME
                      <input name="contact" required className="neo-inset mt-2 w-full rounded-xl px-4 py-3 text-sm normal-case tracking-normal outline-none focus:ring-2 focus:ring-accent/40" />
                    </label>
                    <label className="text-xs tracking-[0.12em] text-mute">
                      WORK EMAIL
                      <input name="email" type="email" required className="neo-inset mt-2 w-full rounded-xl px-4 py-3 text-sm normal-case tracking-normal outline-none focus:ring-2 focus:ring-accent/40" />
                    </label>
                    <label className="text-xs tracking-[0.12em] text-mute sm:col-span-2">
                      YOUR 12-MONTH OFFER
                      <input name="amount" required placeholder="€ / $" className="neo-inset mt-2 w-full rounded-xl px-4 py-3 text-sm normal-case tracking-normal outline-none focus:ring-2 focus:ring-accent/40" />
                    </label>
                    <label className="text-xs tracking-[0.12em] text-mute sm:col-span-2">
                      NOTES OR CONDITIONS
                      <textarea name="note" rows={4} className="neo-inset mt-2 w-full resize-none rounded-xl px-4 py-3 text-sm normal-case tracking-normal outline-none focus:ring-2 focus:ring-accent/40" />
                    </label>
                    <button disabled={offerStatus !== "idle"} type="submit" className="neo-button group mt-2 inline-flex w-fit items-center gap-3 rounded-full px-7 py-4 text-xs tracking-[0.14em] disabled:opacity-50 sm:col-span-2">
                      {offerStatus === "sending" ? "SENDING…" : offerStatus === "sent" ? "OFFER SENT" : "SEND PRIVATE OFFER"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    {offerStatus === "sent" && (
                      <p className="text-sm text-emerald-700 sm:col-span-2" role="status">
                        Your private offer has been delivered.
                      </p>
                    )}
                    {offerError && (
                      <p className="text-sm text-red-700 sm:col-span-2" role="alert">
                        {offerError}
                      </p>
                    )}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
