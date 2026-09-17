import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { recordActivity } from "@/lib/analytics";
import { readBody, sameOrigin } from "@/lib/campaign";

export const dynamic="force-dynamic";
const VISITOR_COOKIE="brand_visitor";
export async function POST(request:Request){
  if(!sameOrigin(request))return new NextResponse(null,{status:403});
  try{
    const body=await readBody(request),type=body.type;
    if(!["pageview","heartbeat","proposal-view","sponsor-click"].includes(String(type)))return new NextResponse(null,{status:400});
    const cookie=request.headers.get("cookie")?.match(/(?:^|;\s*)brand_visitor=([\w-]{20,80})/)?.[1];
    const visitor=cookie||randomUUID();
    await recordActivity(visitor,body,new URL(request.url).origin);
    const response=new NextResponse(null,{status:204,headers:{"Cache-Control":"no-store"}});
    if(!cookie)response.cookies.set(VISITOR_COOKIE,visitor,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:365*24*60*60});
    return response;
  }catch{return new NextResponse(null,{status:204});}
}
