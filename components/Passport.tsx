"use client";
import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Globe2, Compass, ArrowUpRight } from "lucide-react";
import s from "./Passport.module.css";
const stamps = [
  {name:"CAMPUS",line:"Ideas to impact",date:"12 Jan 2024",iso:"2024-01-12"},
  {name:"CLIENT ROOMS",line:"Conversations to opportunities",date:"23 May 2024",iso:"2024-05-23"},
  {name:"EVENTS",line:"People to possibilities",date:"14 Sep 2024",iso:"2024-09-14"},
];
export default function Passport(){
  const routeMask=useId().replace(/:/g,"");
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
  return <section ref={root} id="journey" aria-labelledby="passport-title" className={s.section} data-phase={phase}>
    <div className={s.inner}>
      <header className={s.header}>
        <div className={s.eyebrow}><span>02 / 04</span><span aria-hidden="true"/></div>
        <h2 id="passport-title">The person behind<br/><em>the presence.</em></h2>
        <p>Different places. Same purpose. Building Postiz, one stamp at a time.</p>
        <div className={s.notes} aria-hidden="true"><span>More Creators, Brighter Places</span><span>Good Work Travels Further</span></div>
      </header>
      <div className={s.spread}>
        <article data-reveal-group data-seen="false" className={`${s.page} ${s.identity}`} aria-label="Deepak’s Postiz passport of work">
          <div className={s.pageLabel}><Globe2 size={18} aria-hidden="true"/><span>POSTIZ · PASSPORT OF WORK</span></div>
          <div className={s.identityBody}>
            <figure className={s.photo}>{photoFailed?<div className={s.photoPlaceholder} aria-label="Deepak portrait awaiting upload"><span>D</span><small>DEEPAK</small></div>:<Image src="/deepak-passport.webp" width={600} height={800} unoptimized alt="Deepak wearing a dark suit and tie in an office" loading="lazy" onError={()=>setPhotoFailed(true)}/>}</figure>
            <div className={s.identityText}><span className={s.micro}>NAME / NOM</span><h3>DEEPAK</h3><div className={s.roles}><span>STUDENT</span><span>FOUNDER</span><span>CTO</span></div><p className={s.handwriting}>Same human.<br/>Bigger horizons.</p></div>
          </div>
          <div className={s.signatureRow}><span className={s.micro}>THE JOURNEY IS PERSONAL.</span><svg className={s.signature} viewBox="0 0 220 65" aria-hidden="true"><path pathLength="1" d="M16 48C34 14 48 7 41 31L26 55M19 27C66-8 83 45 35 47M58 43C76 23 84 42 64 44C58 49 78 52 86 39C99 23 111 39 90 44C90 53 106 45 116 35C107 57 127 38 129 33C139 24 142 48 130 48L122 61M147 37C157 23 168 40 151 46C141 50 152 29 164 33L160 47L175 37C179 19 193 7 187 24L175 48L192 35L183 44L201 48M45 59C91 52 157 56 204 52"/></svg></div>
          <div className={s.machine} aria-label="Postiz, Deepak. Work, people, places, possibilities."><span aria-hidden="true">POSTIZ&lt;DEEPAK&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span><span aria-hidden="true">WORK&gt;PEOPLE&gt;PLACES&gt;POSSIBILITIES&lt;&lt;</span></div>
          <span className={s.pageNumber}>01 — THE PERSON</span>
        </article>
        <article data-reveal-group data-seen="false" className={`${s.page} ${s.visas}`} aria-label="Visas for projects">
          <div className={s.pageLabel}>VISAS FOR PROJECTS</div><h3 className={s.visaHeading}>Ideas travel further.</h3>
          <div className={s.stamps}>{stamps.map((stamp,i)=><div key={stamp.name} className={`${s.stamp} ${s[`stamp${i}`]}`} aria-label={`${stamp.name}: ${stamp.line}. Illustrative date ${stamp.date}.`}><strong>{stamp.name}</strong><span>{stamp.line}</span><time dateTime={stamp.iso}>{stamp.date}</time></div>)}</div>
          <p className={s.concept}>Illustrative stamps · dates shown for the concept</p>
          <div className={s.route}>
            <svg className={s.map} viewBox="0 0 440 125" role="img" aria-label="Travel route: Campus to Client Rooms to Events to New Cities">
              <path className={s.land} d="M32 29l29-18 30 5 17 18-17 14-8 20-19-4-10-19-20 2zm49 44 21 7 10 22-16 18-9-26zm98-43 28-15 35 6 11 13 31-9 37 6 36-11 43 24-20 17-35-3-13 21-21-8-18-25-29 3-17-8-18 15-11-11-17 5zm22 30 31 0 17 27-17 30-13-6-5-26zm141 32 29-8 24 18-9 13-34-3z"/>
              <path className={s.track} d="M28 100C95 110 104 54 168 68S277 82 305 47S378 42 412 20"/>
              <defs><mask id={routeMask}><path className={s.flightLine} pathLength="1" d="M28 100C95 110 104 54 168 68S277 82 305 47S378 42 412 20"/></mask></defs>
              <path className={s.inkRoute} mask={`url(#${routeMask})`} d="M28 100C95 110 104 54 168 68S277 82 305 47S378 42 412 20"/>
              <g className={s.plane}><path d="M-10 0l20-5-8 7-1 8-4-6-7 0z"/></g>
              {[[28,100],[168,68],[305,47],[412,20]].map(([cx,cy])=><circle key={cx} cx={cx} cy={cy} r="3" className={s.dot}/>)}
            </svg>
            <ol className={s.routeList}>{["Campus","Client Rooms","Events","New Cities"].map((place,i)=><li key={place}><span>0{i+1}</span>{place}</li>)}</ol>
            <div className={s.compass}><Compass size={27} strokeWidth={1} aria-hidden="true"/><span>Same purpose, more places.</span></div>
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
