import { NextResponse } from "next/server";
import { configured, createSession, limited, publishCampaign, readBody, sameOrigin, SESSION_COOKIE, SESSION_SECONDS, validCode } from "@/lib/campaign";

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Please open the invitation on this website." }, { status: 403 });
  if (!configured()) return NextResponse.json({ error: "The invitation is not ready yet. Please contact Deepak." }, { status: 503 });
  try {
    if (await limited(request, "invitation", 10)) return NextResponse.json({ error: "Too many attempts. Please try again in 15 minutes." }, { status: 429, headers: { "Retry-After": "900" } });
    let body;
    try { body = await readBody(request); } catch { return NextResponse.json({ error: "Please enter a valid invitation code." }, { status: 400 }); }
    if (!validCode(body.code)) return NextResponse.json({ error: "That invitation code is not recognised." }, { status: 401 });
    const token = createSession();
    await publishCampaign();
    const response = NextResponse.json({ unlocked: true, published: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_SECONDS });
    return response;
  } catch {
    return NextResponse.json({ error: "The invitation service is temporarily unavailable. Please try again." }, { status: 503 });
  }
}
