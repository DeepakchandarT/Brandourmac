import { NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin-request";
import { sameOrigin } from "@/lib/campaign";
import { logoData, setSponsorLogo } from "@/lib/sponsor";
export const dynamic="force-dynamic";
export async function POST(request:Request){
  if(!adminFromRequest(request))return new NextResponse(null,{status:401});if(!sameOrigin(request))return new NextResponse(null,{status:403});
  try{const form=await request.formData(),file=form.get("logo");if(!(file instanceof File))throw new Error("Choose a logo file.");const data=await logoData(file);return NextResponse.json(await setSponsorLogo(data,file.type as "image/png"|"image/webp"|"image/svg+xml"),{headers:{"Cache-Control":"no-store"}});}
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to upload logo."},{status:400});}
}
