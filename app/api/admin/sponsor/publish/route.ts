import { NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin-request";
import { sameOrigin } from "@/lib/campaign";
import { publishSponsor } from "@/lib/sponsor";
export const dynamic="force-dynamic";
export async function POST(request:Request){if(!adminFromRequest(request))return new NextResponse(null,{status:401});if(!sameOrigin(request))return new NextResponse(null,{status:403});try{return NextResponse.json(await publishSponsor(),{headers:{"Cache-Control":"no-store"}});}catch{return NextResponse.json({error:"Unable to publish sponsor right now."},{status:503});}}
