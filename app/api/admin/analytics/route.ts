import { NextResponse } from "next/server";
import { analyticsDashboard } from "@/lib/analytics";
import { adminFromRequest } from "@/lib/admin-request";
export const dynamic="force-dynamic";
export async function GET(request:Request){if(!adminFromRequest(request))return new NextResponse(null,{status:401});try{return NextResponse.json(await analyticsDashboard(),{headers:{"Cache-Control":"no-store"}});}catch{return NextResponse.json({error:"Analytics are temporarily unavailable."},{status:503});}}
