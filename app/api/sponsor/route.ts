import { NextResponse } from "next/server";
import { getPublishedSponsor } from "@/lib/sponsor";
import { publicSponsor } from "@/lib/sponsor-types";
export const dynamic="force-dynamic";
export async function GET(){return NextResponse.json(publicSponsor(await getPublishedSponsor()),{headers:{"Cache-Control":"no-store"}});}
