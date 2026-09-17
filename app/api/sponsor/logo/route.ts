import { NextResponse } from "next/server";
import { getPublishedSponsor } from "@/lib/sponsor";
export const dynamic="force-dynamic";
const placeholder=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 90"><rect x="3" y="3" width="254" height="84" rx="22" fill="white" stroke="#766ce8" stroke-width="3" stroke-dasharray="8 8"/><text x="130" y="50" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" letter-spacing="3" fill="#5148e5">YOUR BRAND</text></svg>`;
export async function GET(){
  const sponsor=await getPublishedSponsor();
  if(!sponsor.logoDataUrl)return new NextResponse(placeholder,{headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
  const match=sponsor.logoDataUrl.match(/^data:(image\/(?:png|webp)|image\/svg\+xml);base64,([A-Za-z0-9+/=]+)$/);
  if(!match)return new NextResponse(placeholder,{headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"no-store"}});
  return new NextResponse(Buffer.from(match[2],"base64"),{headers:{"Content-Type":match[1],"Cache-Control":"public, max-age=300","X-Content-Type-Options":"nosniff","Content-Security-Policy":"default-src 'none'; style-src 'unsafe-inline'; sandbox"}});
}
