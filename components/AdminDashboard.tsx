"use client";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { ArrowUpRight, Eye, LogOut, RefreshCw, Save, Upload, Users, Radio, MousePointerClick } from "lucide-react";
import Image from "next/image";
import type { SponsorConfig } from "@/lib/sponsor-types";

type Row={label:string;count:number};
type Analytics={visitorsToday:number;uniqueVisitors:number;onlineVisitors:number;totalPageViews:number;history:Row[];pages:Row[];referrals:Row[];proposalViews:number;sponsorClicks:number;onlineWindowMinutes:number};
const metric=(value:number)=>new Intl.NumberFormat("en-US").format(value);
export default function AdminDashboard({initialAnalytics,initialDraft,initialPublished}:{initialAnalytics:Analytics;initialDraft:SponsorConfig;initialPublished:SponsorConfig}){
  const [analytics,setAnalytics]=useState(initialAnalytics),[draft,setDraft]=useState(initialDraft),[published,setPublished]=useState(initialPublished);
  const [name,setName]=useState(draft.name),[website,setWebsite]=useState(draft.website),[logoPreview,setLogoPreview]=useState(draft.logoDataUrl),[busy,setBusy]=useState(""),[message,setMessage]=useState("");
  const max=useMemo(()=>Math.max(1,...analytics.history.map(v=>v.count)),[analytics]);
  const previewWebsite=useMemo(()=>{try{const url=new URL(website);return ["http:","https:"].includes(url.protocol)&&!url.username&&!url.password?url.toString():null;}catch{return null;}},[website]);
  async function refresh(){setBusy("refresh");const response=await fetch("/api/admin/analytics",{cache:"no-store"});if(response.ok)setAnalytics(await response.json());setBusy("");}
  async function save(event:FormEvent){event.preventDefault();setBusy("save");setMessage("");const response=await fetch("/api/admin/sponsor",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,website})});const result=await response.json();if(response.ok){setDraft(result);setMessage("Draft saved. Review the preview, then publish.");}else setMessage(result.error);setBusy("");}
  async function upload(event:ChangeEvent<HTMLInputElement>){const file=event.target.files?.[0];if(!file)return;setLogoPreview(URL.createObjectURL(file));setBusy("upload");setMessage("");const form=new FormData();form.set("logo",file);const response=await fetch("/api/admin/sponsor/logo",{method:"POST",body:form});const result=await response.json();if(response.ok){setDraft(result);setLogoPreview(result.logoDataUrl);setMessage("Logo added to the draft.");}else setMessage(result.error);setBusy("");}
  async function publish(){setBusy("publish");setMessage("");const response=await fetch("/api/admin/sponsor/publish",{method:"POST"});const result=await response.json();if(response.ok){setPublished(result);setDraft(result);setMessage("Sponsor published to the website.");}else setMessage(result.error);setBusy("");}
  async function logout(){await fetch("/api/admin/logout",{method:"POST"});location.assign("/admin/login");}
  return <main className="admin-shell">
    <aside className="admin-sidebar"><a href="/" className="admin-wordmark">DEEPAK</a><nav><a href="#overview">Overview</a><a href="#traffic">Traffic</a><a href="#sponsor">Sponsor manager</a></nav><button onClick={logout}><LogOut size={15}/> Sign out</button></aside>
    <div className="admin-content">
      <header className="admin-header"><div><h1>Campaign dashboard</h1><p>Live proposal performance and sponsor control.</p></div><button className="admin-secondary" onClick={refresh} disabled={busy==="refresh"}><RefreshCw size={15} className={busy==="refresh"?"is-spinning":""}/> Refresh</button></header>
      <section id="overview" className="admin-metrics" aria-label="Analytics overview">
        {[{label:"Visitors today",value:analytics.visitorsToday,icon:Users},{label:"Unique visitors",value:analytics.uniqueVisitors,icon:Users},{label:"Online now",value:analytics.onlineVisitors,icon:Radio,note:`Active in ${analytics.onlineWindowMinutes} min`},{label:"Total page views",value:analytics.totalPageViews,icon:Eye},{label:"Proposal views",value:analytics.proposalViews,icon:Eye},{label:"Sponsor-link clicks",value:analytics.sponsorClicks,icon:MousePointerClick}].map(item=><article key={item.label}><div><span>{item.label}</span><item.icon size={16}/></div><strong>{metric(item.value)}</strong>{item.note&&<small>{item.note}</small>}</article>)}
      </section>
      <section id="traffic" className="admin-panel admin-chart"><div className="admin-section-heading"><div><h2>Traffic history</h2><p>Page views over the last 14 days.</p></div></div><div className="chart-bars" role="img" aria-label="Fourteen day page-view chart">{analytics.history.map(point=><div key={point.label} className="chart-column"><span style={{height:`${Math.max(3,point.count/max*100)}%`}} title={`${point.count} views`}/><small>{point.label}</small></div>)}</div></section>
      <div className="admin-split"><List title="Most visited pages" rows={analytics.pages}/><List title="Referral sources" rows={analytics.referrals}/></div>
      <section id="sponsor" className="admin-panel sponsor-manager"><div className="admin-section-heading"><div><h2>Sponsor manager</h2><p>Save a private draft, preview it, then publish.</p></div><span className="published-state">Live: {published.name}</span></div>
        <div className="sponsor-grid"><form onSubmit={save} className="sponsor-form">
          <label>Company name<input value={name} onChange={e=>setName(e.target.value)} required maxLength={80}/></label>
          <label>Website URL<input value={website} onChange={e=>setWebsite(e.target.value)} required type="url" inputMode="url"/></label>
          <label className="upload-field"><span>Logo · PNG, WebP or SVG · 350 KB max</span><input type="file" accept=".png,.webp,.svg,image/png,image/webp,image/svg+xml" onChange={upload}/><span className="upload-button"><Upload size={15}/>{busy==="upload"?"Uploading…":"Choose logo"}</span></label>
          <button className="admin-primary" type="submit" disabled={!!busy}><Save size={15}/>{busy==="save"?"Saving…":"Save draft"}</button>
        </form><div className="sponsor-preview"><span>PREVIEW</span><div className="preview-canvas">{logoPreview?<Image src={logoPreview} width={210} height={90} unoptimized alt={`${name} logo preview`}/>:<div className="your-brand">YOUR BRAND</div>}<h3>{name||"Sponsor name"}</h3><p>{website||"Sponsor website"}</p></div>{previewWebsite?<a href={previewWebsite} target="_blank" rel="noreferrer">Preview website <ArrowUpRight size={14}/></a>:<span className="preview-link-disabled">Enter a valid website URL</span>}</div></div>
        <div className="publish-row"><p role="status">{message||"Draft changes are private until you publish."}</p><button className="admin-primary" onClick={publish} disabled={!!busy}>{busy==="publish"?"Publishing…":"Publish sponsor"}<ArrowUpRight size={15}/></button></div>
      </section>
    </div>
  </main>;
}
function List({title,rows}:{title:string;rows:Row[]}){return <section className="admin-panel admin-list"><h2>{title}</h2>{rows.length?<ol>{rows.map(row=><li key={row.label}><span>{row.label}</span><strong>{metric(row.count)}</strong></li>)}</ol>:<p className="empty-state">No data yet. Visits will appear here automatically.</p>}</section>;}
