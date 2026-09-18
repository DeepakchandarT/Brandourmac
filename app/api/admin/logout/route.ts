import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { sameOrigin } from "@/lib/campaign";
export async function POST(request:Request){
  if(!sameOrigin(request))return new NextResponse(null,{status:403});
  const response=NextResponse.json({ok:true});response.cookies.set(ADMIN_COOKIE,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:0});return response;
}
