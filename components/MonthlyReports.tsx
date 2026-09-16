"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play, ArrowUpRight } from "lucide-react";
import PostizLogo from "./PostizLogo";

const CHAPTERS = [
  {month:"01",title:"First appearance",copy:"Photos and activity notes.",x:85,y:397,w:126,tilt:-8},
  {month:"02",title:"Into the week",copy:"Meetings and everyday work.",x:245,y:376,w:144,tilt:-5},
  {month:"04",title:"More rooms",copy:"Events and professional settings.",x:425,y:350,w:162,tilt:-2},
  {month:"06",title:"Halfway",copy:"Six months brought together.",x:625,y:314,w:182,tilt:2},
  {month:"09",title:"Built to last",copy:"The record keeps growing.",x:845,y:264,w:200,tilt:5},
  {month:"12",title:"A year, documented",copy:"The complete partnership story.",x:1090,y:179,w:220,tilt:0},
].map((chapter,i)=>{
  const t=[.04,.2,.38,.57,.77,.94][i],u=1-t;
  return {...chapter,x:u*u*u*30+3*u*u*t*480+3*u*t*t*840+t*t*t*1180,y:u*u*u*404+3*u*u*t*350+3*u*t*t*319+t*t*t*138};
});

function Dial({ active, reduced }: { active:number;reduced:boolean }) {
  return <div className="report-dial" aria-label={`Previewing planned month ${CHAPTERS[active].month}; campaign not started`}>
    <svg viewBox="0 0 240 190" aria-hidden="true">
      <path className="dial-shadow" d="M 32 151 A 94 94 0 1 1 208 151"/>
      <path className="dial-highlight" d="M 32 149 A 94 94 0 1 1 208 149"/>
      {Array.from({length:25},(_,i)=>{
        const a=(-205+i*230/24)*Math.PI/180;
        return <line key={i} x1={120+Math.cos(a)*76} y1={116+Math.sin(a)*76} x2={120+Math.cos(a)*(i%4===0?65:70)} y2={116+Math.sin(a)*(i%4===0?65:70)} className="dial-tick"/>;
      })}
      <motion.g animate={{rotate:-115+active*46}} transition={{duration:reduced?0:.8,ease:[.16,1,.3,1]}} style={{originX:"120px",originY:"116px"}}>
        <path d="M 117 116 L 120 45 L 124 116 Z" className="dial-needle"/>
      </motion.g>
      <circle cx="120" cy="116" r="7" fill="#fafafa" stroke="#dedce7"/>
      <text x="120" y="166" textAnchor="middle">MONTH {CHAPTERS[active].month} / 12</text>
    </svg>
    <span>Planned journey</span>
  </div>;
}

export default function MonthlyReports() {
  const root=useRef<HTMLElement>(null);
  const track=useRef<HTMLDivElement>(null);
  const manual=useRef(false);
  const reduced=useReducedMotion();
  const visible=useInView(root,{amount:.25});
  const [active,setActive]=useState(0);
  const [playing,setPlaying]=useState(false);
  const {scrollYProgress}=useScroll({target:root,offset:["start 65%","end 75%"]});
  useMotionValueEvent(scrollYProgress,"change",v=>{if(!manual.current&&!reduced)setActive(Math.min(5,Math.floor(v*6)));});
  useEffect(()=>{
    if(!playing||!visible||reduced)return;
    const timer=window.setInterval(()=>{if(!document.hidden)setActive(i=>(i+1)%6);},4500);
    return()=>window.clearInterval(timer);
  },[playing,visible,reduced]);
  useEffect(()=>{
    if(!track.current)return;
    const viewport=track.current;
    const scale=viewport.scrollWidth/1200;
    viewport.scrollTo({left:CHAPTERS[active].x*scale-viewport.clientWidth*.5,behavior:reduced?"auto":"smooth"});
  },[active,reduced]);
  function select(i:number){manual.current=true;setPlaying(false);setActive((i+6)%6);}
  return <section id="reports" ref={root} className="timeline-section">
    <div className="timeline-heading">
      <p className="timeline-label">TWELVE<br/>MONTHS<br/>OF PROOF</p>
      <h2>Every appearance.<br/><em>Documented.</em></h2>
      <p className="timeline-intro">Twelve months. Twelve reports.<br/>One living record.</p>
    </div>
    <Dial active={active} reduced={!!reduced}/>
    <div ref={track} className="timeline-viewport" tabIndex={0} aria-label="Planned twelve-month reporting timeline. Scroll horizontally to explore.">
      <div className="timeline-canvas">
        <svg className="timeline-rail" viewBox="0 0 1200 700" aria-hidden="true">
          <path d="M 30 404 C 480 350 840 319 1180 138" fill="none" stroke="#c5c2d1" strokeWidth="1.5"/>
          <path d="M 30 414 C 480 360 840 329 1180 148" fill="none" stroke="#a8a3bb" strokeWidth="1" strokeDasharray="2 6"/>
        </svg>
        {CHAPTERS.map((chapter,i)=><div key={chapter.month} className={`timeline-milestone ${active===i?"is-current":""}`} style={{left:`${chapter.x/12}%`,top:`${chapter.y/7}%`}}>
          <button className="milestone-node" onClick={()=>select(i)} aria-pressed={active===i} aria-label={`Preview month ${chapter.month}: ${chapter.title}`}><span>Month {chapter.month}</span><i/></button>
          <motion.button onClick={()=>select(i)} className={`timeline-card ${i===5?"timeline-finale":""}`}
            aria-label={`Month ${chapter.month}: ${chapter.title}, planned report`}
            style={{width:chapter.w}}
            animate={{rotate:active===i?0:chapter.tilt,y:active===i?-8:0}}
            transition={{duration:reduced?0:.55,ease:[.16,1,.3,1]}}>
            <span className="report-paper-top">POSTIZ × DEEPAK<span>{chapter.month}</span></span>
            <span className="report-paper-title">{chapter.title}</span>
            <span className="report-paper-rule"/>
            <span className="report-paper-note">{i===5?"The complete story":"Photos & activity log"}</span>
            <span className="report-paper-status">Planned · not yet published</span>
          </motion.button>
        </div>)}
      </div>
    </div>
    <div className="timeline-bottom">
      <div className="timeline-detail" aria-live="polite"><span>Month {CHAPTERS[active].month}</span><h3>{CHAPTERS[active].title}</h3><p>{CHAPTERS[active].copy}</p></div>
      <div className="timeline-actions"><div className="tactile-controls" role="group" aria-label="Reporting timeline controls">
        <button onClick={()=>select(active-1)} aria-label="Previous chapter"><ArrowLeft size={18}/></button>
        {!reduced&&<button onClick={()=>{manual.current=true;setPlaying(p=>!p);}} aria-label={playing?"Pause timeline":"Play timeline"}>{playing?<Pause size={15}/>:<Play size={15}/>}</button>}
        <button onClick={()=>select(active+1)} aria-label="Next chapter"><ArrowRight size={18}/></button>
      </div><a href="#private-offer">Start our first chapter <ArrowUpRight size={16}/></a></div>
    </div>
    <p className="timeline-disclosure">Planned chapters. Real photographs and results begin with the partnership.</p>
    <div className="timeline-signature"><PostizLogo compact/><span>Postiz</span></div>
  </section>;
}
