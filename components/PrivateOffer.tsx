"use client";
import { FormEvent, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, LockKeyhole } from "lucide-react";
import InvitationForm from "./InvitationForm";
import PostizLogo from "./PostizLogo";

export default function PrivateOffer({ initialUnlocked=false }: { initialUnlocked?:boolean }) {
  const [unlocked,setUnlocked]=useState(initialUnlocked);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [reference,setReference]=useState("");
  const [values,setValues]=useState({contact:"",email:"",amount:"",currency:"USD",note:""});
  const attempt=useRef({payload:"",id:""});
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(busy||reference)return;setBusy(true);setError("");
    const payload=JSON.stringify(values);
    if(attempt.current.payload!==payload) attempt.current={payload,id:crypto.randomUUID()};
    try {
      const response=await fetch("/api/offer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...values,requestId:attempt.current.id})});
      const result=await response.json();
      if(response.status===401){setUnlocked(false);setError("Your session expired. Enter your invitation again; your offer details are preserved.");return;}
      if(!response.ok||!result.saved){setError(result.error||"Your offer could not be saved. Please try again.");return;}
      setReference(result.reference);
    } catch {setError("Unable to connect. Please try again; your offer details are preserved.");}
    finally {setBusy(false);}
  }
  return <section id="private-offer" className="private-offer-section container-edge">
    <div className="offer-introduction">
      <PostizLogo/>
      <h2>Quote<br/><em>your price.</em></h2>
      <p>One brand. Twelve months. No competition.</p>
      <div className="previous-bid" aria-label="Postiz previously bid 1,404 US dollars for one of fourteen lid placements">
        <span>YOUR PREVIOUS BID</span>
        <strong>$1,404</strong>
        <p>for 1 of 14 MacBook lid spaces</p>
        <ArrowDownRight className="bid-direction-arrow" aria-hidden="true" />
      </div>
      <p className="offer-scope"><strong>This time:</strong> all 16 placements, the full everyday kit and twelve monthly reports.</p>
    </div>
    <div className="offer-form-panel">
      {reference?<div className="offer-success" role="status"><Check size={30}/><h3>Your offer is in.</h3><p>Your proposal has been saved privately. Thank you for taking the first step.</p><span>Reference: {reference}</span></div>:<>
        <div className="offer-form-heading"><span><LockKeyhole size={15}/>{unlocked?"Invitation verified":"Reserved for Postiz"}</span><h3>Your number.</h3><p>Quote privately. Once agreed, the final partnership price will be displayed here.</p></div>
        {!unlocked?<InvitationForm onSuccess={()=>{setUnlocked(true);setError("");}}/>:<form className="bid-form" onSubmit={submit}>
          <div className="bid-amount-row"><label>Currency<select value={values.currency} onChange={e=>setValues(v=>({...v,currency:e.target.value}))}><option>USD</option><option>EUR</option><option>INR</option></select></label>
          <label>Your offer for 12 months<input aria-label="Your offer amount for twelve months" type="number" inputMode="decimal" min="0.01" max="999999999.99" step="0.01" required placeholder="Your amount" value={values.amount} onChange={e=>setValues(v=>({...v,amount:e.target.value}))}/></label></div>
          <label>Your name<input autoComplete="name" required maxLength={120} value={values.contact} onChange={e=>setValues(v=>({...v,contact:e.target.value}))}/></label>
          <label>Work email<input type="email" autoComplete="email" required maxLength={254} value={values.email} onChange={e=>setValues(v=>({...v,email:e.target.value}))}/></label>
          <label>Note <span>(optional)</span><textarea rows={3} maxLength={3000} value={values.note} onChange={e=>setValues(v=>({...v,note:e.target.value}))}/></label>
          <button className="primary-action" disabled={busy} type="submit">{busy?"Saving your offer…":"Submit private offer"}<ArrowUpRight size={18}/></button>
          <p className="bid-privacy">Your quote stays private until we agree.</p>
        </form>}
        {error&&<p className="form-error" role="alert">{error}</p>}
      </>}
    </div>
  </section>;
}
