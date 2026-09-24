import { NextResponse } from "next/server";
import { isPublished } from "@/lib/campaign";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ open: await isPublished() }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } });
  } catch {
    // Access checks fail closed without exposing storage details.
    return NextResponse.json({ open: false }, { headers: { "Cache-Control": "no-store" } });
  }
}
