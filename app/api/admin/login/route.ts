import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, adminConfigured, createAdminSession, validAdmin } from "@/lib/admin-auth";
import { limited, readBody, sameOrigin } from "@/lib/campaign";
export const dynamic="force-dynamic";
export async function POST(request:Request){
  if(!sameOrigin(request))return NextResponse.json({error:"Open the admin sign-in on this website."},{status:403});
  if(!adminConfigured())return NextResponse.json({error:"Admin access is not configured yet."},{status:503});
  try{
    if(await limited(request,"admin-login",8))return NextResponse.json({error:"Too many attempts. Try again in 15 minutes."},{status:429});
    const body=await readBody(request);
    if(!validAdmin(body.email,body.password))return NextResponse.json({error:"Email or password is incorrect."},{status:401});
    const response=NextResponse.json({authenticated:true},{headers:{"Cache-Control":"no-store"}});
    response.cookies.set(ADMIN_COOKIE,createAdminSession(),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:ADMIN_SESSION_SECONDS});
    return response;
  }catch{return NextResponse.json({error:"Sign-in is temporarily unavailable."},{status:503});}
}
