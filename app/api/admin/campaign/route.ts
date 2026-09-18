import { NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin-request";
import { isPublished, lockCampaign, sameOrigin, unlockCampaign } from "@/lib/campaign";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!adminFromRequest(request)) return new NextResponse(null, { status: 401 });
  try {
    return NextResponse.json({ open: await isPublished() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Campaign access status is temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!adminFromRequest(request)) return new NextResponse(null, { status: 401 });
  if (!sameOrigin(request)) return new NextResponse(null, { status: 403 });
  try {
    const body = await request.json().catch(() => null) as { action?: unknown } | null;
    if (body?.action === "lock") await lockCampaign();
    else if (body?.action === "unlock") await unlockCampaign();
    else return NextResponse.json({ error: "Choose lock or unlock." }, { status: 400 });
    return NextResponse.json({ open: await isPublished() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to update campaign access right now." }, { status: 503 });
  }
}
