import { NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin-request";
import { readBody, sameOrigin } from "@/lib/campaign";
import { setLiveVisitorVisibility } from "@/lib/sponsor";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  if (!adminFromRequest(request)) return new NextResponse(null, { status: 401 });
  if (!sameOrigin(request)) return new NextResponse(null, { status: 403 });
  try {
    const body = await readBody(request);
    if (typeof body?.visible !== "boolean") return NextResponse.json({ error: "Choose whether the live visitor count should be visible." }, { status: 400 });
    return NextResponse.json(await setLiveVisitorVisibility(body.visible), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to update visitor visibility right now." }, { status: 503 });
  }
}
