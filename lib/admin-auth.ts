import "server-only";
import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE="brand_admin";
export const ADMIN_SESSION_SECONDS=8*60*60;
const digest=(value:string)=>createHash("sha256").update(value).digest();

export function adminConfigured(){
  return !!((process.env.ADMIN_EMAIL||process.env.OFFER_EMAIL) && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length>=32);
}

export function validAdmin(email:unknown,password:unknown){
  if(!adminConfigured()||typeof email!=="string"||typeof password!=="string"||email.length>254||password.length>256)return false;
  return timingSafeEqual(digest(email.trim().toLowerCase()),digest((process.env.ADMIN_EMAIL||process.env.OFFER_EMAIL)!.trim().toLowerCase())) && timingSafeEqual(digest(password),digest(process.env.ADMIN_PASSWORD!));
}

function sign(payload:string){return createHmac("sha256",process.env.ADMIN_SESSION_SECRET!).update(payload).digest("base64url");}
export function createAdminSession(now=Date.now()){
  if(!adminConfigured())throw new Error("Admin is not configured");
  const payload=Buffer.from(JSON.stringify({role:"admin",id:randomUUID(),expires:now+ADMIN_SESSION_SECONDS*1000})).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
export function readAdminSession(token?:string,now=Date.now()){
  if(!adminConfigured()||!token||token.length>1024)return null;
  try{const [payload,signature,...extra]=token.split(".");if(extra.length||!payload||!signature||!timingSafeEqual(digest(signature),digest(sign(payload))))return null;
    const data=JSON.parse(Buffer.from(payload,"base64url").toString("utf8"));return data.role==="admin"&&typeof data.id==="string"&&data.expires>now?{id:data.id}:null;
  }catch{return null;}
}
