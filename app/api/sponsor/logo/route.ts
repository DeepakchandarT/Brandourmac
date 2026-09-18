import { NextResponse } from "next/server";
import { getPublishedSponsor } from "@/lib/sponsor";
export const dynamic="force-dynamic";
const plate=(logo?: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 90"><rect x="3" y="3" width="254" height="84" rx="22" fill="white" stroke="#766ce8" stroke-width="3" stroke-dasharray="8 8"/>${logo ? `<image href="${logo}" x="24" y="15" width="212" height="60" preserveAspectRatio="xMidYMid meet"/>` : `<text x="130" y="50" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" letter-spacing="3" fill="#5148e5">YOUR BRAND</text>`}</svg>`;
export async function GET(){
  const sponsor=await getPublishedSponsor();
  if(!sponsor.logoDataUrl)return new NextResponse(plate(),{headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
  const match=sponsor.logoDataUrl.match(/^data:(image\/(?:png|webp)|image\/svg\+xml);base64,([A-Za-z0-9+/=]+)$/);
  if(!match)return new NextResponse(plate(),{headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
  return new NextResponse(plate(`data:${match[1]};base64,${match[2]}`),{headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"public, max-age=300","X-Content-Type-Options":"nosniff","Content-Security-Policy":"default-src 'none'; img-src data:; style-src 'unsafe-inline'; sandbox"}});
}
