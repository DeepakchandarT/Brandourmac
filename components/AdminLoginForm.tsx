"use client";
import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
export default function AdminLoginForm({configured}:{configured:boolean}){
  const [busy,setBusy]=useState(false),[error,setError]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(busy)return;setBusy(true);setError("");const data=new FormData(event.currentTarget);
    try{const response=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:data.get("email"),password:data.get("password")})});const result=await response.json();if(!response.ok){setError(result.error||"Unable to sign in.");return;}location.assign("/admin");}catch{setError("Unable to connect. Try again.");}finally{setBusy(false);}}
  return <form className="admin-login-form" onSubmit={submit}>
    <div className="admin-login-mark"><LockKeyhole size={20}/></div>
    <h1>Campaign control</h1><p>Private analytics and sponsor publishing.</p>
    <label>Email<input type="email" name="email" required autoComplete="username" disabled={!configured}/></label>
    <label>Password<input type="password" name="password" required autoComplete="current-password" disabled={!configured}/></label>
    <button type="submit" disabled={!configured||busy}>{busy?"Signing in…":"Sign in"}<ArrowRight size={16}/></button>
    {!configured&&<p className="admin-error" role="status">Add the admin environment variables in Vercel, then redeploy.</p>}
    {error&&<p className="admin-error" role="alert">{error}</p>}
  </form>;
}
