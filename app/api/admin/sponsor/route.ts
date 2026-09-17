import { NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin-request";
import { readBody, sameOrigin } from "@/lib/campaign";
import { getDraftSponsor, saveSponsorDraft, validateSponsorDetails } from "@/lib/sponsor";
export const dynamic="force-dynamic";
export async function GET(request:Request){if(!adminFromRequest(request))return new NextResponse(null,{status:401});return NextResponse.json(await getDraftSponsor(),{headers:{"Cache-Control":"no-store"}});}
export async function PUT(request:Request){
  if(!adminFromRequest(request))return new NextResponse(null,{status:401});if(!sameOrigin(request))return new NextResponse(null,{status:403});
  try{const body=await readBody(request);return NextResponse.json(await saveSponsorDraft(validateSponsorDetails(body.name,body.website)),{headers:{"Cache-Control":"no-store"}});}
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to save sponsor."},{status:400});}
}
