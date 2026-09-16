import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type OfferPayload = {
  code?: string;
  contact?: string;
  email?: string;
  amount?: string;
  note?: string;
};

export async function POST(request: Request) {
  const expectedCode = process.env.SPONSOR_INVITE_CODE;
  const recipient = process.env.OFFER_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!expectedCode || !recipient || !apiKey || !from) {
    return NextResponse.json(
      { error: "Offer delivery is not configured yet." },
      { status: 503 }
    );
  }

  let payload: OfferPayload;
  try {
    payload = (await request.json()) as OfferPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const code = payload.code?.trim();
  const contact = payload.contact?.trim();
  const email = payload.email?.trim();
  const amount = payload.amount?.trim();
  const note = payload.note?.trim();

  if (code !== expectedCode) {
    return NextResponse.json({ error: "Invitation expired. Unlock it again." }, { status: 403 });
  }

  if (!contact || !email || !amount) {
    return NextResponse.json({ error: "Name, email and offer are required." }, { status: 400 });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [recipient],
      reply_to: email,
      subject: "Postiz × Deepak — Private partnership offer",
      text: [
        "Private Postiz × Deepak partnership offer",
        "",
        `Contact: ${contact}`,
        `Email: ${email}`,
        `12-month offer: ${amount}`,
        "",
        "Notes:",
        note || "No additional notes.",
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "The offer could not be delivered. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ sent: true });
}
