"use client";
import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function InvitationForm({ launch = false, onSuccess }: { launch?: boolean; onSuccess: () => void }) {
  const [code,setCode]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(busy)return;setBusy(true);setError("");
    try {
      const response=await fetch("/api/invite",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code})});
      const result=await response.json();
      if(!response.ok||!result.unlocked){setError(result.error||"Unable to open the invitation. Please try again.");return;}
      setCode("");onSuccess();
    } catch {setError("Unable to connect. Please check your connection and try again.");}
    finally {setBusy(false);}
  }
  return <form className="invitation-form" onSubmit={submit}>
    <label htmlFor={launch?"launch-code":"offer-code"}>Your invitation code</label>
    <input id={launch?"launch-code":"offer-code"} type="password" autoComplete="off" autoCapitalize="none" spellCheck={false} required maxLength={256} value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter your private code" aria-describedby={error?"invite-error":undefined}/>
    <button className="primary-action" type="submit" disabled={busy}>{busy?"Opening…":launch?"Open the invitation":"Unlock private offer"}<ArrowRight size={17}/></button>
    {error&&<p id="invite-error" className="form-error" role="alert">{error}</p>}
  </form>;
}
