import "server-only";
import { namespace, redis } from "./campaign";

const key=(name:string)=>`${namespace()}:analytics:${name}`;
export const ONLINE_WINDOW_MS=5*60*1000;
const day=(date=new Date())=>date.toISOString().slice(0,10);
const safePath=(value:unknown)=>typeof value==="string"&&value.startsWith("/")&&value.length<=180?value.split(/[?#]/)[0]:"/";
const safeSource=(value:unknown,origin:string)=>{
  if(typeof value!=="string"||!value)return "Direct";
  try{const url=new URL(value);return url.origin===origin?"Internal":url.hostname.replace(/^www\./,"").slice(0,100);}catch{return "Direct";}
};

export async function recordActivity(visitor:string,input:Record<string,unknown>,origin:string){
  const now=Date.now(),today=day(),type=input.type,path=safePath(input.path);
  const commands:Promise<unknown>[]=[redis(["ZADD",key("online"),now,visitor]),redis(["ZREMRANGEBYSCORE",key("online"),0,now-ONLINE_WINDOW_MS*4])];
  if(type==="pageview")commands.push(
    redis(["INCR",key("views:total")]),redis(["HINCRBY",key("history"),today,1]),redis(["HINCRBY",key("pages"),path,1]),
    redis(["PFADD",key("unique:total"),visitor]),redis(["PFADD",key(`unique:${today}`),visitor]),
    redis(["HINCRBY",key("referrals"),safeSource(input.referrer,origin),1])
  );
  if(type==="proposal-view")commands.push(redis(["HINCRBY",key("events"),"proposalViews",1]));
  if(type==="sponsor-click")commands.push(redis(["HINCRBY",key("events"),"sponsorClicks",1]));
  await Promise.all(commands);
}

const flatHash=(value:unknown)=>{const out:Record<string,number>={};if(Array.isArray(value))for(let i=0;i<value.length;i+=2)out[String(value[i])]=Number(value[i+1])||0;else if(value&&typeof value==="object")for(const [k,v] of Object.entries(value))out[k]=Number(v)||0;return out;};
export async function analyticsDashboard(){
  const today=day(),dates=Array.from({length:14},(_,i)=>{const d=new Date();d.setUTCDate(d.getUTCDate()-13+i);return day(d);});
  const [total,unique,todayUnique,history,pages,referrals,events,online]=await Promise.all([
    redis<string|null>(["GET",key("views:total")]),redis<number>(["PFCOUNT",key("unique:total")]),redis<number>(["PFCOUNT",key(`unique:${today}`)]),
    redis<unknown>(["HGETALL",key("history")]),redis<unknown>(["HGETALL",key("pages")]),redis<unknown>(["HGETALL",key("referrals")]),redis<unknown>(["HGETALL",key("events")]),redis<number>(["ZCOUNT",key("online"),Date.now()-ONLINE_WINDOW_MS,"+inf"]),
  ]);
  const h=flatHash(history),sort=(value:unknown)=>Object.entries(flatHash(value)).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([label,count])=>({label,count}));
  return {visitorsToday:Number(todayUnique)||0,uniqueVisitors:Number(unique)||0,onlineVisitors:Number(online)||0,totalPageViews:Number(total)||0,history:dates.map(label=>({label:label.slice(5),count:h[label]||0})),pages:sort(pages),referrals:sort(referrals),proposalViews:flatHash(events).proposalViews||0,sponsorClicks:flatHash(events).sponsorClicks||0,onlineWindowMinutes:ONLINE_WINDOW_MS/60000};
}
