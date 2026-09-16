import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { limited, namespace, readBody, readSession, redis, sameOrigin, SESSION_COOKIE } from "@/lib/campaign";

export const dynamic = "force-dynamic";
const error = (message: string, status: number) => NextResponse.json({ error: message }, { status });

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return error("Please submit your offer from this website.", 403);
  const session = readSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return error("Please enter your invitation code again to submit an offer.", 401);
  let body;
  try { body = await readBody(request); } catch { return error("The offer could not be read. Please check the form.", 400); }
  const contact = typeof body.contact === "string" ? body.contact.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const amount = typeof body.amount === "string" ? body.amount.trim() : "";
  const currency = body.currency;
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const requestId = typeof body.requestId === "string" ? body.requestId : "";
  if (!contact || contact.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
    !/^\d{1,9}(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0 ||
    !["USD", "EUR", "INR"].includes(String(currency)) || note.length > 3000 || !/^[\da-f-]{36}$/i.test(requestId)) {
    return error("Enter your name, a valid email, currency and a positive offer amount (up to two decimals).", 400);
  }
  try {
    if (await limited(request, "offers", 10, session.id)) return error("Too many submissions. Please try again in 15 minutes.", 429);
    const id = createHash("sha256").update(`${session.id}:${requestId}`).digest("hex").slice(0, 20);
    const key = `${namespace()}:offer:${id}`;
    const entry = { id, contact, email, amount, currency, note, createdAt: new Date().toISOString() };
    // Atomic NX makes a retry safe if a successful response was lost in transit.
    const saved = await redis<string | null>(["SET", key, JSON.stringify(entry), "NX"]);
    if (saved) {
      const recipient = process.env.OFFER_EMAIL, apiKey = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM_EMAIL;
      if (recipient && apiKey && from) {
        try {
          const result = await fetch("https://api.resend.com/emails", {
            method: "POST", signal: AbortSignal.timeout(6000),
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": id },
            body: JSON.stringify({ from, to: [recipient], reply_to: email, subject: "Postiz × Deepak — Private partnership offer",
              text: [`Offer reference: ${id}`, `Contact: ${contact}`, `Email: ${email}`, `12-month offer: ${currency} ${amount}`, "", note || "No additional notes."].join("\n") }),
          });
          await redis(["SET", `${key}:notification`, result.ok ? "sent" : "failed"]);
        } catch { /* The original offer is already safely stored. */ }
      }
    }
    return NextResponse.json({ saved: true, reference: id }, { headers: { "Cache-Control": "no-store" } });
  } catch { return error("Your offer could not be saved. Please try again; your form is still here.", 503); }
}
