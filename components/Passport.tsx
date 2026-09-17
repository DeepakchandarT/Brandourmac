"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Globe2, Compass, ArrowUpRight, Pause, Play } from "lucide-react";
import s from "./Passport.module.css";
const destinations = ["College events", "Business meetings", "Client presentations", "Startup events", "Workshops & hackathons", "New cities"];
const flightPath = "M40 90C40 25 130 20 220 35S400 25 400 90S310 160 220 145S40 155 40 90Z";
export default function Passport(){
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
        <p>Different places. Same purpose. Postiz comes with me.</p>
        <div className={s.notes} aria-hidden="true"><span>More Creators, Brighter Places</span><span>Good Work Travels Further</span></div>
      </header>
      <div className={s.spread}>
        <article data-reveal-group data-seen="false" className={`${s.page} ${s.identity}`} aria-label="Deepakchandar’s Postiz passport of work">
          <div className={s.pageLabel}><Globe2 size={18} aria-hidden="true"/><span>POSTIZ · PASSPORT OF WORK</span></div>
          <div className={s.identityBody}>
            <figure className={s.photo}>{photoFailed?<div className={s.photoPlaceholder} aria-label="Deepakchandar portrait awaiting upload"><span>D</span><small>DC</small></div>:<Image src="/deepak-passport.webp" width={600} height={800} unoptimized alt="Deepakchandar wearing a dark suit and tie in an office" loading="lazy" onError={()=>setPhotoFailed(true)}/>}</figure>
            <div className={s.identityText}><span className={s.micro}>NAME / NOM</span><h3>Deepakchandar</h3><div className={s.roles}><span>STUDENT</span><span>FOUNDER</span><span>CTO</span></div><p className={s.handwriting}>Same human.<br/>Bigger horizons.</p></div>
          </div>
          <div className={s.signatureRow}><span className={s.micro}>THE JOURNEY IS PERSONAL.</span><svg className={s.signature} viewBox="0 0 220 65" aria-hidden="true"><path pathLength="1" d="M16 48C34 14 48 7 41 31L26 55M19 27C66-8 83 45 35 47M58 43C76 23 84 42 64 44C58 49 78 52 86 39C99 23 111 39 90 44C90 53 106 45 116 35C107 57 127 38 129 33C139 24 142 48 130 48L122 61M147 37C157 23 168 40 151 46C141 50 152 29 164 33L160 47L175 37C179 19 193 7 187 24L175 48L192 35L183 44L201 48M45 59C91 52 157 56 204 52"/></svg></div>
          <div className={s.machine} aria-label="Postiz, Deepakchandar. Work, people, places, possibilities."><span aria-hidden="true">POSTIZ&lt;DEEPAKCHANDAR&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span><span aria-hidden="true">WORK&gt;PEOPLE&gt;PLACES&gt;POSSIBILITIES&lt;&lt;</span></div>
          <span className={s.pageNumber}>01 — THE PERSON</span>
        </article>
        <article ref={routePage} className={`${s.page} ${s.visas}`} aria-label="Where I will take my laptop" data-flight={routeVisible&&!flightPaused?"playing":"paused"}>
          <div className={s.pageLabel}>WHERE MY LAPTOP GOES</div><h3 className={s.visaHeading}>More places.<br/><em>One presence.</em></h3>
          <div className={s.route}>
            <svg className={s.map} viewBox="0 0 440 180" role="img" aria-label="A continuous flight connecting the places listed below">
              <ellipse cx="220" cy="90" rx="140" ry="63" className={s.globeRing}/><ellipse cx="220" cy="90" rx="65" ry="63" className={s.globeRing}/><path d="M80 90H360M96 60H344M96 120H344" className={s.globeRing}/>
              <path className={s.inkRoute} d={flightPath}/>
              {[[40,90],[100,36],[220,35],[400,90],[330,145],[220,145]].map(([cx,cy],i)=><g key={cx+cy}><circle cx={cx} cy={cy} r="4" className={s.dot}/><text x={cx} y={cy+(cy>90?22:-13)} className={s.routeNumber} textAnchor="middle">0{i+1}</text></g>)}
              <g className={s.plane}><path d="M11 0L-9-8-5 0-9 8Z"/></g>
            </svg>
            <ol className={s.routeList}>{destinations.map((place,i)=><li key={place}><span>0{i+1}</span>{place}</li>)}</ol>
            <div className={s.routeFooter}><div className={s.compass}><Compass size={23} strokeWidth={1} aria-hidden="true"/><span>Same purpose, more places.</span></div><button type="button" className={s.flightControl} aria-label={flightPaused?"Resume flight animation":"Pause flight animation"} onClick={()=>setFlightPaused(value=>!value)}>{flightPaused?<Play size={13}/>:<Pause size={13}/>}</button></div>
          </div>
          <p className={s.quote}>“My work keeps moving.<br/>Postiz moves with it.”</p><span className={s.pageNumber}>02 — THE POSSIBILITIES</span>
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
