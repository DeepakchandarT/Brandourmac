"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Globe2, Compass, ArrowUpRight, Pause, Play, Linkedin } from "lucide-react";
import s from "./Passport.module.css";
import { useSponsor } from "./SponsorProvider";
const destinations = ["College events", "Business meetings", "Client presentations", "Startup events", "Workshops & hackathons", "New cities"];
const flightPath = "M68 175C48 125 85 55 142 62S220 135 269 85S393 78 370 159S280 180 238 211S95 243 68 175Z";
export default function Passport(){
  const sponsor=useSponsor();
  const [activePlace,setActivePlace]=useState(0);
  const routePage=useRef<HTMLElement>(null);
  const [routeVisible,setRouteVisible]=useState(false);
  const [flightPaused,setFlightPaused]=useState(false);
  const root=useRef<HTMLElement>(null);
  const [visible,setVisible]=useState(false);
  const [phase,setPhase]=useState("static");
  const [photoFailed,setPhotoFailed]=useState(false);
  useEffect(()=>{
    const element=root.current;if(!element)return;
    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealGroups=Array.from(element.querySelectorAll("[data-reveal-group]"));
    const groupObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting)entry.target.setAttribute("data-seen","true");});
    },{threshold:.08,rootMargin:"-80px 0px -80px 0px"});
    revealGroups.forEach(group=>groupObserver.observe(group));
    const observer=new IntersectionObserver(([entry])=>{
      setVisible(entry.isIntersecting);
      if(reduce.matches){setPhase("static");return;}
      if(entry.isIntersecting)setPhase("reveal");
      // Re-arm outside the viewport, including a return from below on scroll-up.
      else {setPhase("waiting");revealGroups.forEach(group=>group.setAttribute("data-seen","false"));}
    },{threshold:0,rootMargin:"-90px 0px -90px 0px"});
    observer.observe(element);return()=>{observer.disconnect();groupObserver.disconnect();};
  },[]);
  useEffect(()=>{
    const page=routePage.current;if(!page)return;
    let inView=false;
    const sync=()=>setRouteVisible(inView&&!document.hidden);
    const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;sync();},{threshold:.15,rootMargin:"-72px 0px -80px 0px"});
    observer.observe(page);document.addEventListener("visibilitychange",sync);
    return()=>{observer.disconnect();document.removeEventListener("visibilitychange",sync);};
  },[]);
  return <section ref={root} id="journey" aria-labelledby="passport-title" className={s.section} data-phase={phase}>
    <div className={s.inner}>
      <header className={s.header}>
        <div className={s.eyebrow}><span>02 / 04</span><span aria-hidden="true"/></div>
        <h2 id="passport-title">The person behind<br/><em>the presence.</em></h2>
        <p>Different places. Same purpose. {sponsor.name} comes with me.</p>
        <div className={s.notes} aria-hidden="true"><span>More Creators, Brighter Places</span><span>Good Work Travels Further</span></div>
      </header>
      <div className={s.spread}>
        <article data-reveal-group data-seen="false" className={`${s.page} ${s.identity}`} aria-label={`Deepakchandar’s ${sponsor.name} passport of work`}>
          <div className={s.pageLabel}><Globe2 size={18} aria-hidden="true"/><span>{sponsor.name.toUpperCase()} · PASSPORT OF WORK</span></div>
          <div className={s.identityBody}>
            <figure className={s.photo}>{photoFailed?<div className={s.photoPlaceholder} aria-label="Deepakchandar portrait awaiting upload"><span>D</span><small>DC</small></div>:<Image src="/deepak-passport.webp" width={600} height={800} unoptimized alt="Deepakchandar wearing a dark suit and tie in an office" loading="lazy" onError={()=>setPhotoFailed(true)}/>}</figure>
            <div className={s.identityText}><span className={s.micro}>NAME / NOM</span><h3>Deepakchandar</h3><div className={s.roles}><span>STUDENT</span><span>FOUNDER</span><span>CTO</span></div><a className={s.linkedin} href="https://www.linkedin.com/in/deepakchandart/" target="_blank" rel="noopener noreferrer" aria-label="View Deepakchandar on LinkedIn (opens in a new tab)"><Linkedin size={15} aria-hidden="true"/><span>Let’s connect</span><ArrowUpRight size={15} aria-hidden="true"/></a><p className={s.handwriting}>Same human.<br/>Bigger horizons.</p></div>
          </div>
          <div className={s.signatureRow}><span className={s.micro}>THE JOURNEY IS PERSONAL.</span><span className={s.signature} aria-label="Signed by Deepakchandar">Deepakchandar</span></div>
          <div className={s.machine} aria-label={`${sponsor.name}, Deepakchandar. Work, people, places, possibilities.`}><span aria-hidden="true">{sponsor.name.toUpperCase()}&lt;DEEPAKCHANDAR&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span><span aria-hidden="true">WORK&gt;PEOPLE&gt;PLACES&gt;POSSIBILITIES&lt;&lt;</span></div>
          <span className={s.pageNumber}>01 — THE PERSON</span>
        </article>
        <article ref={routePage} className={`${s.page} ${s.visas}`} aria-label="Where I will take my laptop" data-flight={routeVisible&&!flightPaused?"playing":"paused"}>
          <div className={s.pageLabel}>WHERE MY LAPTOP GOES</div><h3 className={s.visaHeading}>More places.<br/><em>One presence.</em></h3>
          <div className={s.route}>
            <div className={s.mapCanvas}>
            <svg className={s.map} viewBox="0 0 440 280" role="img" aria-label="Illustrative city map connecting college events, business meetings, client presentations, startup events, workshops and new cities">
              <defs><pattern id="passport-map-grid" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".65" fill="#d4d4de"/></pattern></defs>
              <rect width="440" height="280" fill="url(#passport-map-grid)"/>
              <g className={s.cityBlocks}>
                <path d="M27 30h60v42H27zM103 20h70v25h-70zM35 91h42v43H35zM96 84h60v37H96zM177 22h66v53h-66zM173 96h40v39h-40zM267 20h58v42h-58zM347 22h65v50h-65zM295 100h40v40h-40zM365 94h50v36h-50zM21 157h27v70H21zM92 148h58v44H92zM172 158h39v33h-39zM280 165h50v42h-50zM355 193h59v57h-59zM59 233h78v26H59zM160 218h39v42h-39zM239 236h76v24h-76z"/>
              </g>
              <path className={s.river} d="M242-15C213 38 253 92 239 137S199 193 219 295"/>
              <path className={s.street} d="M12 143L428 143M87 7L87 274M340 8L340 268M14 211L421 211"/>
              <path className={s.inkRoute} d={flightPath}/>
              {[[68,175],[142,62],[269,85],[370,159],[238,211],[115,222]].map(([cx,cy],i)=><g key={i} className={activePlace===i?s.activePin:s.mapPin}><circle cx={cx} cy={cy} r="13" className={s.pinHalo}/><circle cx={cx} cy={cy} r="9" className={s.pinCore}/><text x={cx} y={cy+3} className={s.pinNumber} textAnchor="middle">{i+1}</text></g>)}
              <g className={s.plane}><path d="M12 0L-10-8-5 0-10 8Z"/></g>
              <g transform="translate(400 235)" className={s.north}><path d="M0 12V-10M-4-4L0-11 4-4"/><text x="0" y="-17" textAnchor="middle">N</text></g>
            </svg>
            <div className={s.mapCaption}><span>ON THE MOVE</span><strong>{destinations[activePlace]}</strong></div>
            </div>
            <ol className={s.routeList}>{destinations.map((place,i)=><li key={place}><button type="button" className={s.destination} aria-pressed={activePlace===i} onClick={()=>setActivePlace(i)}><span>0{i+1}</span><span>{place}</span><ArrowUpRight size={14} aria-hidden="true"/></button></li>)}</ol>
            <div className={s.routeFooter}><div className={s.compass}><Compass size={23} strokeWidth={1} aria-hidden="true"/><span>Same purpose, more places.</span></div><button type="button" className={s.flightControl} aria-label={flightPaused?"Resume flight animation":"Pause flight animation"} onClick={()=>setFlightPaused(value=>!value)}>{flightPaused?<Play size={13}/>:<Pause size={13}/>}</button></div>
          </div>
          <p className={s.quote}>“My work keeps moving.<br/>{sponsor.name} moves with it.”</p><span className={s.pageNumber}>02 — THE POSSIBILITIES</span>
        </article>
      </div>
      <div data-reveal-group data-seen="false" className={s.props} aria-label="Travel essentials">
        <div className={s.badge}><div className={s.lanyard} aria-hidden="true"/><span className={s.micro}>ALL ACCESS / EVERYDAY</span><strong>Build. People.<br/>Places. Possibilities.</strong><ArrowUpRight size={22} aria-hidden="true"/></div>
        <div className={s.penArea} aria-label="Pen engraved Good Ideas Travel Well"><div className={s.pen}><span>Good Ideas Travel Well.</span></div></div>
        <div className={s.boarding}><span className={s.micro}>NEXT STOP</span><strong>New cities.</strong><span>Same purpose, more places.</span><div className={s.barcode} aria-hidden="true"/></div>
      </div>
    </div>
    {visible&&<nav className={s.rail} aria-label="Story chapters">{[["idea","The idea"],["journey","The person"],["reports","The journey"],["private-offer","The invitation"]].map(([id,label],i)=><a key={id} href={`#${id}`} aria-label={`${i+1} of 4: ${label}`} aria-current={i===1?"step":undefined}><span/></a>)}</nav>}
  </section>;
}
