import Passport from "@/components/Passport";
import Nav from "@/components/Nav";
import OfferDock from "@/components/OfferDock";
import { isPublished } from "@/lib/campaign";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function Check({searchParams}:{searchParams:{frame?:string}}){
  let published=false;
  try{published=await isPublished();}catch{}
  if(!published)notFound();
  if(searchParams.frame)return <main style={{paddingTop:80}}><Nav/><Passport/><OfferDock/></main>;
  return <main>{[360,768,1440].map(width=><div key={width}><h1>{width}px layout check</h1><iframe title={`${width}px preview`} src="/passport-check?frame=1" style={{width,height:2300,border:0}}/></div>)}</main>;
}
