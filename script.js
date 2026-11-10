(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const ent=$('#entrance'),site=$('#site'),chain=$('#chain');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* ---------- ENTRANCE (light hunt + chain) ---------- */
function open(){ent.classList.add('leaving');document.body.classList.remove('intro-open');site.removeAttribute('inert');setTimeout(()=>{ent.hidden=true;kinetic.refresh()},750)}
function openIntro(){ent.hidden=false;ent.classList.remove('leaving');document.body.classList.add('intro-open');site.setAttribute('inert','');scrollTo(0,0)}
function move(x,y){ent.style.setProperty('--x',x+'px');ent.style.setProperty('--y',y+'px')}
ent.addEventListener('pointermove',e=>move(e.clientX,e.clientY));
ent.addEventListener('pointerdown',e=>{if(!e.target.closest('#chain,#skip'))move(e.clientX,e.clientY)});
let sy=null;
chain.addEventListener('pointerdown',e=>{sy=e.clientY;chain.setPointerCapture(e.pointerId)});
chain.addEventListener('pointermove',e=>{if(sy!==null)chain.style.setProperty('--pull',Math.max(0,Math.min(70,e.clientY-sy))+'px')});
chain.addEventListener('pointerup',e=>{const d=e.clientY-sy;sy=null;chain.style.setProperty('--pull','0px');open()});
chain.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')open()});
$('#skip').addEventListener('click',open);
$('#replay').addEventListener('click',openIntro);
document.body.classList.add('intro-open');

/* ---------- STORY TABS ---------- */
const chapters=[
{loc:'TRICHY, INDIA',no:'CHAPTER 01',art:'12<span>00</span><small>RUPEES. ONE FIRST STEP.</small>',t:'Small beginnings.<br>Anything-but-small dreams.',c:'Before the boardrooms, Sidd sold computer training courses door to door. His first salary was ₹1,200 a month. Curiosity and a willingness to learn opened the next door.',l:'https://www.siddahmed.com/blogs/skills-and-growth-mindset-matter-more-than-degrees/'},
{loc:'ATLANTA, USA',no:'CHAPTER 02',art:'ATL<span>.</span><small>A CITY. A CHAPTER. A CHANGE.</small>',t:'A bold leap.<br>A bigger table.',c:'Atlanta shaped how Sidd leads: with belonging, resilience and a belief that people grow when someone makes room for them.',l:'https://www.siddahmed.com/blogs/how-atlanta-built-sidd-ahmed-into-the-leader-he-is-today/'},
{loc:'EVERYWHERE',no:'CHAPTER 03',art:'PEOPLE<span>1st</span><small>THE WHOLE POINT.</small>',t:'Success, shared.<br>That’s the purpose.',c:'Today the focus is on transforming people’s trajectories through mentorship, the Positive Tribe and open doors for the next dreamer.',l:'https://www.siddahmed.com/blogs/transforming-peoples-trajectories/'}];
$$('[data-chapter]').forEach(b=>b.addEventListener('click',()=>{const c=chapters[b.dataset.chapter];$$('[data-chapter]').forEach(x=>{x.setAttribute('aria-selected',x===b);x.tabIndex=x===b?0:-1});
$('#chapter-location').textContent=c.loc;$('#chapter-no').textContent=c.no;$('#chapter-art').innerHTML=c.art;$('#chapter-title').innerHTML=c.t;$('#chapter-copy').textContent=c.c;$('#chapter-link').href=c.l;$('#chapter').setAttribute('aria-labelledby',b.id)}));
/* ---------- THOUGHTS ---------- */
const th=[['01 / KEEP LEARNING','What if “not yet”<br>is a beginning?','One skill. A little practice. A next step you can take today.'],['02 / BE BRAVE','What would you try<br>if you were allowed<br>to be a beginner?','Courage is mostly just starting before you feel ready.'],['03 / BACK PEOPLE','Who needs a door<br>held open today?','A small yes from you could be someone’s big start.']];
let ti=0;const card=$('#thought');
function shuffle(){ti=(ti+1)%th.length;card.classList.add('turn');setTimeout(()=>{$('#thought-label').textContent=th[ti][0];$('#thought-title').innerHTML=th[ti][1];$('#thought-copy').textContent=th[ti][2];card.classList.remove('turn')},180)}
card.addEventListener('click',shuffle);$('#shuffle').addEventListener('click',shuffle);
/* ---------- CAROUSEL ---------- */
const ar=$('#articles'),step=()=>ar.firstElementChild.getBoundingClientRect().width+24;
$('#prev').addEventListener('click',()=>ar.scrollBy({left:-step(),behavior:'smooth'}));
$('#next').addEventListener('click',()=>ar.scrollBy({left:step(),behavior:'smooth'}));
ar.addEventListener('scroll',()=>{const i=Math.round(ar.scrollLeft/step())+1;$('#article-count').textContent=String(i).padStart(2,'0')+' — 04';$('#prev').disabled=ar.scrollLeft<5;$('#next').disabled=ar.scrollLeft+ar.clientWidth>=ar.scrollWidth-5});
$('#prev').disabled=true;

/* ---------- KINETIC PORTRAIT BANDS ---------- */
const kinetic=(()=>{
 const bands=$$('.kband'),timers=new Map();
 function wall(b){const w=b.querySelector('.kb-wall');if(!b.dataset.wall||w.childElementCount)return;const rows=Math.ceil(b.clientHeight/62)+1;for(let i=0;i<rows;i++){const d=document.createElement('div');d.textContent=(b.dataset.wall+' ').repeat(30);d.style.animationDuration=(6+i%4*2)+'s';if(i%2)d.style.animationDirection='reverse';w.appendChild(d)}}
 const io=new IntersectionObserver(es=>es.forEach(e=>{const b=e.target;
  if(e.isIntersecting){wall(b);b.classList.add('on');if(!reduce&&!timers.has(b)){let p=0;b.dataset.ph=0;timers.set(b,setInterval(()=>{p=(p+1)%4;b.dataset.ph=p},1300))}}
  else{b.classList.remove('on');clearInterval(timers.get(b));timers.delete(b)}}),{threshold:.3});
 bands.forEach(b=>io.observe(b));
 return{refresh(){bands.forEach(b=>{io.unobserve(b);io.observe(b)})}};
})();
/* ---------- FINALE ---------- */
const fin=$('#finale');
if(fin){
 const fio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){fin.classList.add('go');fio.disconnect()}}),{threshold:.35});
 fio.observe(fin);
 $('#finale-replay').addEventListener('click',()=>{fin.classList.remove('go');void fin.offsetWidth;fin.classList.add('go')});
}
})();
