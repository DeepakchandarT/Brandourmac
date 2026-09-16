import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const configuredCode = process.env.SPONSOR_INVITE_CODE;

  if (!configuredCode) {
    return NextResponse.json(
      { error: "Invitation access has not been configured yet." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { code?: unknown }
    | null;
  const submittedCode =
    typeof body?.code === "string" ? body.code.trim() : "";

  if (!submittedCode || submittedCode !== configuredCode) {
    return NextResponse.json(
      { error: "That invitation code is not recognised." },
      { status: 401 }
    );
  }

  return NextResponse.json({ unlocked: true });
}
