import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

/* ══════════════════════════════════════════
   ICON PRIMITIVES
══════════════════════════════════════════ */
const I = ({ d, s=22, w=1.6 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);
const IcoNet    = () => <I d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>;
const IcoShield = () => <I d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const IcoCloud  = () => <I d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>;
const IcoArr    = () => <I d="M5 12h14M12 5l7 7-7 7"/>;
const IcoChk    = () => <I d="M20 6L9 17l-5-5" s={15}/>;
const IcoGlobe  = () => <I d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 0a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10zm-10 10h20"/>;
const IcoLayer  = () => <I d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>;
const IcoZap    = () => <I d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>;
const IcoTgt    = () => <I d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-6a4 4 0 100-8 4 4 0 000 8z"/>;
const IcoSrv    = () => <I d="M5 2h14a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1zm0 12h14a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6a1 1 0 011-1zM8 6h.01M8 18h.01"/>;
const IcoUsr    = () => <I d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>;
const IcoCode   = () => <I d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>;
const IcoWifi   = () => <I d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/>;
const IcoAct    = () => <I d="M22 12h-4l-3 9L9 3l-3 9H2"/>;
const IcoEye    = () => <I d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z"/>;
const IcoCog    = () => <I d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>;
const IcoLink   = () => <I d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>;
const IcoLI     = () => <I d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/>;
const IcoTw     = () => <I d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>;
const IcoMail   = () => <I d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2l-8 5-8-5"/>;

/* size-accepting icon factory for megamenu + command panel */
const mkIcon = d => function SzIcon({ size=22 }) { return <I d={d} s={size}/>; };

const Building2   = mkIcon("M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18H6zM2 22h4m12 0h4M10 6h4M10 10h4M10 14h4");
const Radar       = mkIcon("M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10zM8 12a4 4 0 108 0 4 4 0 00-8 0zm4 0h.01");
const Globe2      = mkIcon("M12 2a10 10 0 100 20A10 10 0 0012 2zm0 0a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10zm-10 10h20");
const Workflow    = mkIcon("M22 12h-4l-3 9L9 3l-3 9H2");
const Users       = mkIcon("M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75");
const ShieldCheck = mkIcon("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4");
const Cpu         = mkIcon("M9 3h6v3H9zM9 18h6v3H9zM3 9v6h3V9zM18 9v6h3V9zM6 6h12v12H6z");
const LockKeyhole = mkIcon("M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4M12 16v2");
const Layers3     = mkIcon("M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5");
const RadioTower  = mkIcon("M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01");
const BarChart3   = mkIcon("M18 20V10M12 20V4M6 20v-6");
const Headphones  = mkIcon("M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5z");
const Code2       = mkIcon("M16 18l6-6-6-6M8 6l-6 6 6 6");
const Network     = mkIcon("M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18");
const Cloud       = mkIcon("M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z");
const FileText    = mkIcon("M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M16 13H8M16 17H8M10 9H8");
const HelpCircle  = mkIcon("M12 22a10 10 0 100-20 10 10 0 000 20zM9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01");
const ArrowRight  = mkIcon("M5 12h14M12 5l7 7-7 7");
/* For command panel pills */
const Server      = mkIcon("M5 2h14a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1zm0 12h14a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6a1 1 0 011-1zM8 6h.01M8 18h.01");
const Target      = mkIcon("M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-6a4 4 0 100-8 4 4 0 000 8z");

/* ══════════════════════════════════════════
   LOGO
══════════════════════════════════════════ */
const Logo = ({ h=38, onDark=true }) => {
  const tc = onDark ? "#fff" : "#050d1f";
  const sc = onDark ? "rgba(255,255,255,.14)" : "rgba(5,13,31,.1)";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <svg width={h} height={h} viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="20" stroke={sc} strokeWidth="1"/>
        <circle cx="22" cy="22" r="13" stroke={sc} strokeWidth="1" opacity=".7"/>
        <ellipse cx="22" cy="22" rx="22" ry="8"  stroke={sc} strokeWidth="1"/>
        <ellipse cx="22" cy="22" rx="8"  ry="22" stroke={sc} strokeWidth="1"/>
        <path d="M4 19 Q22 30 40 19" stroke={onDark?"#93b8e4":"#1d3d72"} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M4 25 Q22 14 40 25" stroke={onDark?"#93b8e4":"#1d3d72"} strokeWidth="1" fill="none" strokeLinecap="round" opacity=".45"/>
        <circle cx="22" cy="22" r="2.8" fill={onDark?"#c2d3ec":"#1d3d72"}/>
      </svg>
      <div>
        <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:h*0.54, color:tc, letterSpacing:"-0.025em", lineHeight:1.05 }}>WeRoute</div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:h*0.23, color:onDark?"rgba(255,255,255,.38)":"rgba(5,13,31,.38)", letterSpacing:"0.05em", lineHeight:1, marginTop:2 }}>Beyond Boundaries, Bridging Connectivity</div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   NETWORK GLOBE
══════════════════════════════════════════ */
const globeMarkers = [
  { lat:  32, lng: -118, label: "Cloud Infra"   },
  { lat:  18, lng:  -34, label: "AI Automation" },
  { lat:  42, lng:   42, label: "Cybersecurity" },
  { lat: -10, lng:   78, label: "DevOps"        },
  { lat: -34, lng:   -8, label: "Observability" },
  { lat:   8, lng:  132, label: "Data Centers"  },
  { lat: -24, lng: -128, label: "Managed Ops"   },
];
const globeConnections = [
  { from:[ 32,-118], to:[ 18, -34] },
  { from:[ 18, -34], to:[ 42,  42] },
  { from:[ 42,  42], to:[-10,  78] },
  { from:[-10,  78], to:[  8, 132] },
  { from:[-34,  -8], to:[ 18, -34] },
  { from:[-24,-128], to:[ 32,-118] },
  { from:[-34,  -8], to:[ 42,  42] },
];
function latLngToXYZ(lat,lng,radius){
  const phi=((90-lat)*Math.PI)/180, theta=((lng+180)*Math.PI)/180;
  return[-(radius*Math.sin(phi)*Math.cos(theta)),radius*Math.cos(phi),radius*Math.sin(phi)*Math.sin(theta)];
}
function rotateY(x,y,z,a){const c=Math.cos(a),s=Math.sin(a);return[x*c+z*s,y,-x*s+z*c];}
function rotateX(x,y,z,a){const c=Math.cos(a),s=Math.sin(a);return[x,y*c-z*s,y*s+z*c];}
function projectPoint(x,y,z,cx,cy,fov){const sc=fov/(fov+z);return[x*sc+cx,y*sc+cy,z];}

const NetworkGlobe = ({ size=430 }) => {
  const canvasRef=useRef(null),rotYRef=useRef(0.4),rotXRef=useRef(0.25),
        timeRef=useRef(0),dotsRef=useRef([]),animRef=useRef(null),
        dragRef=useRef({active:false,startX:0,startY:0,startRotY:0,startRotX:0});
  useEffect(()=>{
    const dots=[],n=1050,gr=(1+Math.sqrt(5))/2;
    for(let i=0;i<n;i++){const th=(2*Math.PI*i)/gr,ph=Math.acos(1-(2*(i+0.5))/n);dots.push([Math.cos(th)*Math.sin(ph),Math.cos(ph),Math.sin(th)*Math.sin(ph)]);}
    dotsRef.current=dots;
  },[]);
  const draw=useCallback(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d"); if(!ctx) return;
    const dpr=window.devicePixelRatio||1,w=canvas.clientWidth,h=canvas.clientHeight;
    canvas.width=w*dpr; canvas.height=h*dpr; ctx.scale(dpr,dpr);
    const cx=w/2,cy=h/2,radius=Math.min(w,h)*0.36,fov=600;
    if(!dragRef.current.active) rotYRef.current+=0.002;
    timeRef.current+=0.015; ctx.clearRect(0,0,w,h);
    const glow=ctx.createRadialGradient(cx,cy,radius*0.6,cx,cy,radius*1.55);
    glow.addColorStop(0,"rgba(49,87,246,0.08)"); glow.addColorStop(1,"rgba(49,87,246,0)");
    ctx.fillStyle=glow; ctx.fillRect(0,0,w,h);
    ctx.beginPath(); ctx.arc(cx,cy,radius,0,Math.PI*2);
    ctx.strokeStyle="rgba(7,8,95,0.12)"; ctx.lineWidth=1; ctx.stroke();
    const ry=rotYRef.current,rx=rotXRef.current;
    dotsRef.current.forEach(([dx,dy,dz])=>{
      let x=dx*radius,y=dy*radius,z=dz*radius;
      [x,y,z]=rotateX(x,y,z,rx);[x,y,z]=rotateY(x,y,z,ry);
      if(z>0) return;
      const[sx,sy]=projectPoint(x,y,z,cx,cy,fov),alpha=Math.max(0.12,1-(z+radius)/(2*radius));
      ctx.beginPath();ctx.arc(sx,sy,1+alpha*0.7,0,Math.PI*2);
      ctx.fillStyle=`rgba(49,87,246,${Math.min(0.72,alpha*0.82)})`;ctx.fill();
    });
    globeConnections.forEach(conn=>{
      let[x1,y1,z1]=latLngToXYZ(conn.from[0],conn.from[1],radius);
      let[x2,y2,z2]=latLngToXYZ(conn.to[0],conn.to[1],radius);
      [x1,y1,z1]=rotateX(x1,y1,z1,rx);[x1,y1,z1]=rotateY(x1,y1,z1,ry);
      [x2,y2,z2]=rotateX(x2,y2,z2,rx);[x2,y2,z2]=rotateY(x2,y2,z2,ry);
      if(z1>radius*0.3&&z2>radius*0.3) return;
      const[sx1,sy1]=projectPoint(x1,y1,z1,cx,cy,fov),[sx2,sy2]=projectPoint(x2,y2,z2,cx,cy,fov);
      const mX=(x1+x2)/2,mY=(y1+y2)/2,mZ=(z1+z2)/2,mL=Math.sqrt(mX*mX+mY*mY+mZ*mZ),ah=radius*1.24;
      const[scx,scy]=projectPoint((mX/mL)*ah,(mY/mL)*ah,(mZ/mL)*ah,cx,cy,fov);
      ctx.beginPath();ctx.moveTo(sx1,sy1);ctx.quadraticCurveTo(scx,scy,sx2,sy2);
      ctx.strokeStyle="rgba(49,87,246,0.42)";ctx.lineWidth=1.2;ctx.stroke();
      const t=(Math.sin(timeRef.current*1.2+conn.from[0]*0.1)+1)/2;
      const tx=(1-t)*(1-t)*sx1+2*(1-t)*t*scx+t*t*sx2,ty=(1-t)*(1-t)*sy1+2*(1-t)*t*scy+t*t*sy2;
      ctx.beginPath();ctx.arc(tx,ty,2.4,0,Math.PI*2);ctx.fillStyle="rgba(7,8,95,0.9)";ctx.fill();
    });
    globeMarkers.forEach(m=>{
      let[x,y,z]=latLngToXYZ(m.lat,m.lng,radius);
      [x,y,z]=rotateX(x,y,z,rx);[x,y,z]=rotateY(x,y,z,ry);
      if(z>radius*0.1) return;
      const[sx,sy]=projectPoint(x,y,z,cx,cy,fov),pulse=Math.sin(timeRef.current*2+m.lat)*0.5+0.5;
      ctx.beginPath();ctx.arc(sx,sy,4+pulse*5,0,Math.PI*2);
      ctx.strokeStyle=`rgba(49,87,246,${0.2+pulse*0.22})`;ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(sx,sy,2.6,0,Math.PI*2);ctx.fillStyle="rgba(49,87,246,1)";ctx.fill();
      ctx.font="700 10px Plus Jakarta Sans,sans-serif";ctx.fillStyle="rgba(7,8,95,0.7)";
      ctx.fillText(m.label,sx+9,sy+3);
    });
    animRef.current=requestAnimationFrame(draw);
  },[]);
  useEffect(()=>{animRef.current=requestAnimationFrame(draw);return()=>cancelAnimationFrame(animRef.current);},[draw]);
  const onPointerDown=e=>{dragRef.current={active:true,startX:e.clientX,startY:e.clientY,startRotY:rotYRef.current,startRotX:rotXRef.current};e.currentTarget.setPointerCapture(e.pointerId);};
  const onPointerMove=e=>{if(!dragRef.current.active)return;const dx=e.clientX-dragRef.current.startX,dy=e.clientY-dragRef.current.startY;rotYRef.current=dragRef.current.startRotY+dx*0.005;rotXRef.current=Math.max(-1,Math.min(1,dragRef.current.startRotX+dy*0.005));};
  const onPointerUp=()=>{dragRef.current.active=false;};
  return <canvas ref={canvasRef} className="network-globe" style={{width:size,height:size}} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}/>;
};

/* ══════════════════════════════════════════
   HERO COMMAND PANEL  — floating cards (image 1 style)
══════════════════════════════════════════ */
const FLOAT_CARDS = [
  { title:"Cloud",         sub:"Hybrid platforms",      Icon:Cloud,       cls:"float-tr" },
  { title:"Cybersecurity", sub:"Zero-trust posture",    Icon:ShieldCheck, cls:"float-ml" },
  { title:"AI Ops",        sub:"Intelligent automation",Icon:Cpu,         cls:"float-br" },
  { title:"Networks",      sub:"Always-on visibility",  Icon:Network,     cls:"float-bl" },
];

function HeroCommandPanel() {
  return (
    <motion.div className="hero-command-panel"
      initial={{ opacity:0, y:34, filter:"blur(14px)", scale:0.98 }}
      animate={{ opacity:1, y:0, filter:"blur(0px)", scale:1 }}
      transition={{ delay:0.4, duration:0.95, ease:[0.22,1,0.36,1] }}>

      {/* ── Globe panel with floating cards ── */}
      <div className="command-orbit-shell">

        {/* Top label bar */}
        <div className="command-shell-topline">
          <span>Enterprise Command Layer</span>
          <strong>Live architecture view</strong>
        </div>

        {/* Globe centered */}
        <div className="globe-center-wrap">
          <div className="globe-glow"/>
          <div className="globe-ring ring-one"/>
          <div className="globe-ring ring-two"/>
          <div className="globe-ring ring-three"/>
          <NetworkGlobe size={390}/>
        </div>

        {/* Absolutely-positioned floating cards — one per quadrant */}
        {FLOAT_CARDS.map(({ title, sub, Icon, cls }, i) => (
          <motion.div key={title} className={`float-card ${cls}`}
            initial={{ opacity:0, scale:0.82, y:10 }}
            animate={{ opacity:1, scale:1, y:0 }}
            transition={{ delay:0.85+i*0.11, duration:0.55, ease:[0.22,1,0.36,1] }}>
            <div className="float-card-icon"><Icon size={15}/></div>
            <div>
              <strong>{title}</strong>
              <span>{sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Metric card below ── */}
      <motion.div className="hero-metric-card"
        initial={{ opacity:0, y:22 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:1.1, duration:0.65 }}>
        <div className="metric-top">
          <div className="metric-icon"><Target size={22}/></div>
          <div>
            <strong>Enterprise Visibility</strong>
            <span>Operational intelligence across networks, cloud, security, and automation</span>
          </div>
        </div>
        <div className="metric-progress">
          <div><span>Readiness Index</span><strong>98%</strong></div>
          <div className="progress-track"><div className="progress-fill"/></div>
        </div>
        <div className="metric-pills">
          <span><Server size={12}/> Cloud Ready</span>
          <span><ShieldCheck size={12}/> Secure</span>
          <span><RadioTower size={12}/> Observable</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   HOOKS
══════════════════════════════════════════ */
const useReveal = () => {
  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold:.08, rootMargin:"0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-reveal],[data-stagger]").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
};

const useCounter = (end, active) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let cur=0; const step=end/(2000/16);
    const t=setInterval(()=>{ cur=Math.min(cur+step,end); setV(Math.floor(cur)); if(cur>=end) clearInterval(t); },16);
    return ()=>clearInterval(t);
  },[active,end]);
  return v;
};

/* ══════════════════════════════════════════
   HORIZONTAL SCROLL SECTION
══════════════════════════════════════════ */
const HScroll = ({ children, className="" }) => {
  const trackRef = useRef(null);
  const [canL,setCanL] = useState(false);
  const [canR,setCanR] = useState(true);

  const scroll = dir => trackRef.current?.scrollBy({ left:dir*420, behavior:"smooth" });
  const onScroll = () => {
    const el = trackRef.current; if(!el) return;
    setCanL(el.scrollLeft > 10);
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };
  useEffect(()=>{ onScroll(); },[]);

  return (
    <div className={`hscroll-wrap ${className}`}>
      {canL && (
        <button className="hscroll-btn hscroll-left" onClick={()=>scroll(-1)} aria-label="scroll left">
          <I d="M19 12H5M12 5l-7 7 7 7" s={18} w={2}/>
        </button>
      )}
      <div ref={trackRef} className="hscroll-track" onScroll={onScroll}>
        {children}
      </div>
      {canR && (
        <button className="hscroll-btn hscroll-right" onClick={()=>scroll(1)} aria-label="scroll right">
          <I d="M5 12h14M12 5l7 7-7 7" s={18} w={2}/>
        </button>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   PRIMITIVES
══════════════════════════════════════════ */
const Tag = ({ children, light=false }) => (
  <span className="tag" style={light ? { color:"var(--n-100)", background:"rgba(255,255,255,.08)", borderColor:"rgba(255,255,255,.15)" } : {}}>
    {children}
  </span>
);

const SH = ({ eyebrow, title, sub, light=false }) => (
  <div className="section-header" data-reveal="up">
    <Tag light={light}>{eyebrow}</Tag>
    <h2 className={light ? "sh-gradient-light" : "sh-gradient-dark"}>{title}</h2>
    {sub && <p style={light?{color:"rgba(255,255,255,.52)"}:{}}>{sub}</p>}
  </div>
);

const Mag = ({ href="#", cls, children, style={} }) => {
  const r = useRef(null);
  const mv = e => { const b=r.current.getBoundingClientRect(); r.current.style.transform=`translate(${(e.clientX-b.left-b.width/2)*.2}px,${(e.clientY-b.top-b.height/2)*.2}px)`; };
  const ml = () => { r.current.style.transform="translate(0,0)"; };
  return <a ref={r} href={href} className={cls} onMouseMove={mv} onMouseLeave={ml} style={{ transition:"transform .35s cubic-bezier(.16,1,.3,1)",...style }}>{children}</a>;
};

const Counter = ({ end, suffix, label }) => {
  const r=useRef(null); const [go,setGo]=useState(false); const v=useCounter(end,go);
  useEffect(()=>{ const io=new IntersectionObserver(([e])=>{ if(e.isIntersecting) setGo(true); },{threshold:.5}); if(r.current) io.observe(r.current); return()=>io.disconnect(); },[]);
  return <div className="stat-item" ref={r}><div className="stat-number">{v}<span className="stat-suffix">{suffix}</span></div><div className="stat-label">{label}</div></div>;
};

const CursorGlow = () => {
  const r=useRef(null);
  useEffect(()=>{ const f=e=>{ if(r.current){r.current.style.left=e.clientX+"px";r.current.style.top=e.clientY+"px";} }; window.addEventListener("mousemove",f); return()=>window.removeEventListener("mousemove",f); },[]);
  return <div ref={r} className="cursor-glow"/>;
};

/* ══════════════════════════════════════════
   INTRO LOADER
══════════════════════════════════════════ */
const IntroLoader = ({ onDone }) => {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOut(true), 2400);
    return () => clearTimeout(t);
  }, []);

  const words = ["Beyond","Boundaries,","Bridging","Connectivity"];

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!out && (
        <motion.div className="intro-overlay"
          exit={{ y:"-100%", transition:{ duration:.85, ease:[0.22,1,0.36,1] } }}>

          {/* Background shimmer lines */}
          <div className="intro-grid"/>

          <div className="intro-content">
            {/* Logo */}
            <motion.div
              initial={{ opacity:0, y:40, filter:"blur(18px)" }}
              animate={{ opacity:1, y:0, filter:"blur(0px)" }}
              transition={{ delay:.25, duration:.9, ease:[0.22,1,0.36,1] }}>
              <Logo h={56} onDark/>
            </motion.div>

            {/* Animated tagline words */}
            <motion.div className="intro-words">
              {words.map((w,i) => (
                <motion.span key={w+i}
                  initial={{ opacity:0, y:28, filter:"blur(8px)" }}
                  animate={{ opacity:1, y:0, filter:"blur(0px)" }}
                  transition={{ delay:.65+i*.1, duration:.55, ease:[0.22,1,0.36,1] }}>
                  {w}
                </motion.span>
              ))}
            </motion.div>

            {/* Progress bar */}
            <motion.div className="intro-bar-wrap"
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ delay:.6, duration:.3 }}>
              <motion.div className="intro-bar"
                initial={{ scaleX:0 }}
                animate={{ scaleX:1 }}
                transition={{ delay:.65, duration:1.65, ease:"linear" }}/>
            </motion.div>

            {/* Tagline caption */}
            <motion.p className="intro-caption"
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ delay:1.2, duration:.5 }}>
              Enterprise Technology · Reimagined
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
const navItems = [
  ["Who We Are",   "#who"],
  ["Why WeRoute",  "#why"],
  ["Services",     "#services"],
  ["Solutions",    "#solutions"],
  ["Capabilities", "#capabilities"],
];

const megaMenus = {
  "Who We Are": {
    layout: "cards", tag: "Company",
    title: "Technology consulting built for complex enterprise environments.",
    text: "Explore WeRoute's identity, mission, delivery style, and consulting-first approach.",
    items: [
      ["Company Overview","Enterprise technology consulting and implementation partner.",Building2],
      ["Our Mission","Reliable, secure, and future-ready IT solutions.",Radar],
      ["Our Vision","Simplifying complex IT environments worldwide.",Globe2],
      ["Consulting Approach","Assessment-first strategy before execution.",Workflow],
      ["Partnerships","Long-term collaboration and continuous improvement.",Users],
      ["Governance","Scalability, structure, and measurable outcomes.",ShieldCheck],
    ],
  },
  "Why WeRoute": {
    layout: "cards", tag: "Why Choose Us",
    title: "Architecture, execution, and security working together.",
    text: "WeRoute combines consulting, implementation, and managed operations into one accountable delivery model.",
    items: [
      ["Enterprise Delivery","Structured governance and SLA-driven execution.",Workflow],
      ["Vendor-Agnostic","Technology chosen for outcomes, not lock-in.",Cpu],
      ["Secure by Design","Security and compliance embedded from day one.",LockKeyhole],
      ["Scalable Systems","Built for growth, performance, and resilience.",Layers3],
      ["Operational Clarity","Visibility, monitoring, and optimization.",RadioTower],
      ["Analytics","Performance insights for smarter decisions.",BarChart3],
    ],
  },
  Services: {
    layout: "enterprise", tag: "Services",
    title: "Consulting-led services to design, build, and operate enterprise technology.",
    text: "Explore WeRoute's service portfolio.",
    groups: [
      { title:"Managed Services", icon:Headphones, description:"Run, monitor, secure, and optimize critical IT environments.", items:["Managed Data Center Services","Managed Cloud and Hybrid Environments","Network and Infrastructure Observability","Managed Cybersecurity","SOC Operations"] },
      { title:"Consulting & Advisory Services", icon:Workflow, description:"Strategic guidance for architecture and modernization.", items:["IT Strategy and Optimization","Cloud Readiness","Technology Roadmaps","AI and Automation Advisory"] },
      { title:"Software & AI Development", icon:Code2, description:"Custom applications, AI services, and deployment pipelines.", items:["AI and ML Development Services","Custom Software Development","Mobile Application Development","Model Deployment and MLOps"] },
    ],
  },
  Solutions: {
    layout: "enterprise", tag: "Solutions",
    title: "Enterprise solutions designed around real business challenges.",
    text: "Navigate WeRoute's solution areas.",
    groups: [
      { title:"Network & Connectivity", icon:Network, description:"Secure and scalable enterprise connectivity.", items:["AI Network Solution","Network Observability","SD-WAN / SD-LAN / SDN","Network as a Service"] },
      { title:"Cybersecurity Solutions", icon:ShieldCheck, description:"Security controls, operations, and risk management.", items:["Endpoint and Cloud Security","SOC / SIEM / SOAR","Zero Trust Architecture","Identity and Access"] },
    ],
  },
  Capabilities: {
    layout: "cards", tag: "Capabilities",
    title: "Interconnected capabilities for enterprise transformation.",
    text: "A capability model across networks, cloud, cybersecurity, software, and AI.",
    items: [
      ["Network Observability","Real-time visibility and root-cause analysis.",RadioTower],
      ["Infrastructure as Code","Repeatable infrastructure using automation.",Code2],
      ["Security Operations","SIEM, SOAR, detection, and response workflows.",ShieldCheck],
      ["Cloud Optimization","Cost, governance, uptime, and compliance.",Cloud],
      ["Documentation","Clear architecture and operational knowledge.",FileText],
      ["Help Center","Support workflows and operational enablement.",HelpCircle],
    ],
  },
};

function MegaMenuContent({ data, activeLabel }) {
  const [activeGroup, setActiveGroup] = useState(0);
  useEffect(() => { setActiveGroup(0); }, [activeLabel]);
  if (data.layout === "enterprise") {
    const selected = data.groups[activeGroup] || data.groups[0];
    const SelectedIcon = selected.icon;
    return (
      <div className="mega-menu mega-menu-enterprise">
        <div className="mega-enterprise-left">
          <div className="mega-kicker-line"><span />{data.tag}</div>
          <div className="mega-category-list">
            {data.groups.map((group, index) => {
              const Icon = group.icon;
              return (
                <button type="button" key={group.title}
                  className={`mega-category-btn ${activeGroup===index?"mega-category-active":""}`}
                  onMouseEnter={()=>setActiveGroup(index)}>
                  <Icon size={18}/><span>{group.title}</span><ArrowRight size={15}/>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mega-enterprise-right">
          <AnimatePresence mode="wait">
            <motion.div key={selected.title} className="mega-detail-panel"
              initial={{ opacity:0, x:18 }} animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-18 }} transition={{ duration:0.24 }}>
              <div className="mega-detail-head">
                <div className="mega-detail-icon"><SelectedIcon size={22}/></div>
                <div><span>{data.tag}</span><h3>{selected.title}</h3><p>{selected.description}</p></div>
              </div>
              <div className="mega-subgrid">
                {selected.items.map((item, index) => (
                  <motion.a href={activeLabel==="Services"?"#services":"#solutions"} key={item} className="mega-subitem"
                    initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:index*0.035, duration:0.22 }}>
                    <span>{String(index+1).padStart(2,"0")}</span><strong>{item}</strong>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }
  return (
    <div className="mega-menu mega-menu-cards">
      <div className="mega-list">
        {data.items.map(([title, text, Icon], index) => (
          <motion.a href="#" key={title} className="mega-item"
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:index*0.045, duration:0.38 }}>
            <Icon size={22}/>
            <div><strong>{title}</strong><span>{text}</span></div>
          </motion.a>
        ))}
      </div>
      <div className="mega-preview">
        <span>{data.tag}</span><h3>{data.title}</h3><p>{data.text}</p>
      </div>
    </div>
  );
}

const Navbar = () => {
  const [sc,setSc]=useState(false), [op,setOp]=useState(false), [activeMenu,setActiveMenu]=useState(null);
  const activeData = activeMenu ? megaMenus[activeMenu] : null;
  useEffect(()=>{ const f=()=>setSc(window.scrollY>40); window.addEventListener("scroll",f); return()=>window.removeEventListener("scroll",f); },[]);
  return (
    <>
      <motion.header id="navbar" className={sc?"scrolled":""}
        onMouseLeave={()=>setActiveMenu(null)}
        initial={{ y:-80, opacity:0 }} animate={{ y:0, opacity:1 }}
        transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}>
        <div className="navbar-top-bar"/>
        <div className="container">
          <div className="nav-inner">
            <a href="#hero" className="nav-logo"><Logo h={36} onDark={!sc}/></a>
            <nav className="desktop-nav">
              {navItems.map(([label, link]) => (
                <div className="nav-item-wrap" key={label}>
                  <a href={link} className={activeMenu===label?"nav-active":""} onMouseEnter={()=>setActiveMenu(label)}>{label}</a>
                </div>
              ))}
            </nav>
            <div className="navbar-actions">
              <a className="nav-link-lite" href="#contact">Contact</a>
              <Mag href="#cta" cls="btn-nav-cta premium-button" style={{padding:"10px 22px",fontSize:"13px"}}>
                Get Started <span className="btn-arrow">→</span>
              </Mag>
            </div>
            <button className="mobile-menu-btn" onClick={()=>setOp(x=>!x)} aria-label="Menu">
              {op ? <I d="M18 6L6 18M6 6l12 12" s={22} w={2}/> : <I d="M3 12h18M3 6h18M3 18h18" s={22} w={2}/>}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {activeData && (
            <motion.div className="navbar-mega-shell"
              initial={{ opacity:0, y:12, scale:0.985 }} animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, y:12, scale:0.985 }} transition={{ duration:0.24 }}>
              <MegaMenuContent data={activeData} activeLabel={activeMenu}/>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      <AnimatePresence>
        {op && (
          <motion.div className="mobile-menu"
            initial={{ opacity:0, x:"100%" }} animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x:"100%" }} transition={{ duration:0.38, ease:[0.22,1,0.36,1] }}>
            {navItems.map(([label, link]) => (
              <a key={label} href={link} onClick={()=>setOp(false)}>{label}</a>
            ))}
            <Mag href="#cta" cls="btn-primary" style={{marginTop:24,width:"fit-content"}}>Request a Consultation →</Mag>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ══════════════════════════════════════════
   HERO  (right side = HeroCommandPanel)
══════════════════════════════════════════ */
const WORDS=["Secure","Scalable","Resilient","Intelligent"];

const Hero = () => {
  const [wi,setWi]=useState(0), [fade,setFade]=useState(false);
  useEffect(()=>{
    const t=setInterval(()=>{ setFade(true); setTimeout(()=>{ setWi(i=>(i+1)%WORDS.length); setFade(false); },280); },2800);
    return()=>clearInterval(t);
  },[]);
  return (
    <section id="hero">
      <div className="hero-bg">
        <div className="hero-orb-1"/><div className="hero-orb-2"/><div className="hero-grid-lines"/>
      </div>
      <div className="container">
        <div className="hero-layout">
          {/* LEFT */}
          <div className="hero-content">
            <div className="hero-eyebrow" data-reveal="up">
              <div className="hero-line"/>
              <span className="hero-eyebrow-text">Enterprise IT Solutions</span>
            </div>
            <h1 className="hero-headline" data-reveal="up" style={{transitionDelay:"0.06s"}}>
              AI-Driven Optimization<br/>
              for{" "}
              <span className="highlight" style={{opacity:fade?0:1,transition:"opacity .28s"}}>{WORDS[wi]}</span>
              <br/>Enterprise IT
            </h1>
            <p className="hero-sub" data-reveal="up" style={{transitionDelay:"0.11s"}}>
              WeRoute designs, secures, and optimizes enterprise networks, cloud platforms, and cybersecurity environments — helping organizations operate faster, safer, and smarter in a digital-first world.
            </p>
            <p className="hero-micro" data-reveal="up" style={{transitionDelay:"0.16s"}}>
              From network observability and cloud automation to managed security operations — end-to-end IT solutions built for scale and resilience.
            </p>
            <div className="hero-cta-row" data-reveal="up" style={{transitionDelay:"0.21s"}}>
              <Mag href="#cta" cls="btn-primary">Request a Consultation <span className="btn-arrow">→</span></Mag>
              <Mag href="#solutions" cls="btn-ghost-w">Explore Solutions</Mag>
            </div>
          </div>
          {/* RIGHT — Command Panel */}
          <HeroCommandPanel/>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════
   TRUST — premium logo badges
══════════════════════════════════════════ */
const PARTNERS = [
  { name:"Cisco",              abbr:"CI", color:"#049fd9" },
  { name:"AWS",                abbr:"AW", color:"#ff9900" },
  { name:"Microsoft Azure",    abbr:"AZ", color:"#0078d4" },
  { name:"Palo Alto Networks", abbr:"PA", color:"#fa582d" },
  { name:"CrowdStrike",        abbr:"CS", color:"#e01a22" },
  { name:"Fortinet",           abbr:"FT", color:"#ee3124" },
  { name:"VMware",             abbr:"VM", color:"#607078" },
  { name:"Google Cloud",       abbr:"GC", color:"#4285f4" },
  { name:"HashiCorp",          abbr:"HC", color:"#7b42bc" },
  { name:"Splunk",             abbr:"SP", color:"#65a637" },
  { name:"Juniper Networks",   abbr:"JN", color:"#0f6ab7" },
  { name:"Aruba",              abbr:"AR", color:"#ff8300" },
];

const PartnerBadge = ({ name, abbr, color }) => (
  <div className="partner-badge">
    <span className="partner-mark" style={{ background:`${color}18`, color, border:`1px solid ${color}30` }}>{abbr}</span>
    <span className="partner-name">{name}</span>
  </div>
);

const Trust = () => (
  <section id="trust">
    <div className="container">
      <p className="trust-label">Trusted technology partners &amp; alliances</p>
    </div>
    <div className="logos-track">
      <div className="logos-inner">
        {[...PARTNERS,...PARTNERS].map((p,i)=>(
          <PartnerBadge key={i} {...p}/>
        ))}
      </div>
    </div>
    <div className="container">
      <div className="trust-signals">
        {["Vendor-Agnostic Delivery","Enterprise-Grade Security Frameworks","Proven Consulting & Managed Services"].map(s=>(
          <div key={s} className="trust-signal"><div className="trust-signal-dot"/>{s}</div>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════
   WHO WE ARE
══════════════════════════════════════════ */
const WhoWeAre = () => (
  <section id="who">
    <div className="container">
      <div className="who-layout">
        <div className="who-left">
          <span className="section-label" data-reveal="up">About Us</span>
          <Tag>Who We Are</Tag>
          <h2 className="sh-gradient-dark" data-reveal="up" style={{marginTop:12}}>Technology built around your business goals</h2>
          <p data-reveal="up" style={{transitionDelay:"0.06s"}}>WeRoute is a technology consulting and solutions company helping enterprises design, build, and operate secure, scalable, and future-ready digital infrastructure. We work at the intersection of enterprise networking, cybersecurity, software engineering, and cloud technologies.</p>
          <p data-reveal="up" style={{transitionDelay:"0.12s"}}>Our approach is consulting-first and outcome-driven. We partner with businesses to understand their challenges, architect the right solutions, and deliver them with precision — across connectivity, security, digital engineering, and infrastructure transformation.</p>
        </div>
        <div className="who-right">
          <div className="differentiators" data-stagger>
            {[
              {n:"01",t:"Consulting-Led, Outcome-Driven",      d:"We begin by understanding business goals before recommending any technology."},
              {n:"02",t:"Vendor-Agnostic Technology Decisions", d:"Architecture that serves the business — not the vendor. Best-fit, always."},
              {n:"03",t:"Single Accountability, End-to-End",    d:"From design to deployment to ongoing operations — one partner, zero handoffs."},
            ].map(d=>(
              <div key={d.n} className="diff-item">
                <span className="diff-num">{d.n}</span>
                <div className="diff-text"><h4>{d.t}</h4><p>{d.d}</p></div>
              </div>
            ))}
          </div>
          <div className="stats-row">
            <Counter end={150} suffix="+" label="Enterprise Clients"/>
            <Counter end={99}  suffix="%" label="SLA Uptime"/>
            <Counter end={12}  suffix="+" label="Years Delivering"/>
            <Counter end={40}  suffix="+" label="Tech Experts"/>
          </div>
        </div>
      </div>

      {/* Vision / Mission / Values */}
      <div className="vm-section" data-stagger>
        <div className="vm-card vm-vision">
          <div className="vm-card-glow"/><div className="vm-card-num">01</div>
          <div className="vm-card-icon"><IcoGlobe/></div>
          <div className="vm-card-badge">Vision</div>
          <h5>Our Vision</h5>
          <p>To be a trusted global technology partner that simplifies complexity, strengthens security, and accelerates digital transformation for enterprises across industries.</p>
          <div className="vm-pillars">{["Global Reach","Trusted Partner","Digital Acceleration"].map(p=><span key={p} className="vm-pill">{p}</span>)}</div>
          <span className="vm-read-more">Learn More <IcoArr/></span>
        </div>
        <div className="vm-card vm-mission">
          <div className="vm-card-glow"/><div className="vm-card-num">02</div>
          <div className="vm-card-icon"><IcoTgt/></div>
          <div className="vm-card-badge">Mission</div>
          <h5>Our Mission</h5>
          <p>To help organisations design intelligent, secure, and scalable technology ecosystems through expert consulting, vendor-agnostic architectures, and reliable end-to-end delivery.</p>
          <div className="vm-pillars">{["Expert Consulting","Vendor-Agnostic","End-to-End Delivery"].map(p=><span key={p} className="vm-pill">{p}</span>)}</div>
          <span className="vm-read-more">Learn More <IcoArr/></span>
        </div>
        <div className="vm-card vm-values">
          <div className="vm-card-glow"/><div className="vm-card-num">03</div>
          <div className="vm-card-icon"><IcoShield/></div>
          <div className="vm-card-badge">Values</div>
          <h5>Our Values</h5>
          <p>Integrity, precision, and partnership. We operate with full transparency, hold ourselves accountable to measurable outcomes, and build lasting relationships with every client.</p>
          <div className="vm-pillars">{["Integrity","Precision","Partnership"].map(p=><span key={p} className="vm-pill">{p}</span>)}</div>
          <span className="vm-read-more">Learn More <IcoArr/></span>
        </div>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════
   WHY WEROUTE — horizontal scroll + motion text
══════════════════════════════════════════ */
const WHY=[
  {icon:<IcoLayer/>,  n:"01", t:"Enterprise-Grade Delivery",               b:"Structured governance, SLA-driven execution, and predictable outcomes designed for large-scale environments — ensuring measurable performance and minimal risk.", accent:"#1d3d72"},
  {icon:<IcoLink/>,   n:"02", t:"Vendor-Agnostic Architecture",            b:"We select technologies based on performance, security, and scalability — not vendor lock-ins, ensuring flexibility, cost efficiency, and future readiness.",    accent:"#142a52"},
  {icon:<IcoTgt/>,    n:"03", t:"Consulting + Implementation Under One Roof",b:"From advisory and solution design to deployment and managed services — WeRoute is a single accountable partner, eliminating handoffs and reducing complexity.", accent:"#0e1e3a"},
  {icon:<IcoShield/>, n:"04", t:"Security & Scalability by Design",        b:"Security is embedded at every layer — from network architecture and cloud environments to applications and workflows. Secure by default, compliant by design.",   accent:"#091428"},
  {icon:<IcoAct/>,    n:"05", t:"Long-Term Partnership Mindset",           b:"We don't operate as project vendors — we work as long-term technology partners, with proactive optimisation, continuous improvement, and trusted advisory.",      accent:"#050d1f"},
];

const WhyWeRoute = () => (
  <section id="why">
    <div className="container">
      <SH light eyebrow="Why WeRoute" title="Why Enterprises Choose WeRoute"
        sub="Modern IT challenges require more than tools — they require the right architecture, execution, and long-term strategy."/>
    </div>
    <HScroll className="why-hscroll">
      {WHY.map((c,i)=>(
        <motion.div key={c.n} className={`why-card-h why-card-${i%5}`}
          initial={{ opacity:0, x:40 }}
          whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true, margin:"-60px" }}
          transition={{ delay:i*0.08, duration:0.6, ease:[0.22,1,0.36,1] }}
          onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty("--mx",((e.clientX-r.left)/r.width*100)+"%");e.currentTarget.style.setProperty("--my",((e.clientY-r.top)/r.height*100)+"%");}}>
          <div className="whyh-num">{c.n}</div>
          <div className="whyh-icon">{c.icon}</div>
          <motion.h3
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ delay:i*0.08+0.15, duration:0.5 }}>
            {c.t}
          </motion.h3>
          <motion.p
            initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ delay:i*0.08+0.25, duration:0.5 }}>
            {c.b}
          </motion.p>
          <div className="whyh-bar"/>
        </motion.div>
      ))}
    </HScroll>
  </section>
);

/* ══════════════════════════════════════════
   SERVICES — horizontal scroll, varied cards
══════════════════════════════════════════ */
const SVCS=[
  {icon:<IcoSrv/>,   n:"01", t:"Managed Services",         line:"Proactive, enterprise-grade IT operations",    b:"Ensure continuous performance with proactive monitoring, SLA-driven support, and end-to-end system management.",    tags:["24/7 Monitoring","SLA-Driven","End-to-End Ops"],    accent:"#1d3d72"},
  {icon:<IcoTgt/>,   n:"02", t:"Consulting & Advisory",     line:"Consulting-led decisions for long-term value", b:"Align technology decisions with business goals through strategy, assessments, and architecture-led planning.",       tags:["Strategy","Architecture","Risk Reduction"],         accent:"#142a52"},
  {icon:<IcoUsr/>,   n:"03", t:"Manpower & Staffing",       line:"Skilled talent deployed on demand",            b:"Deploy skilled talent across network, cloud, cybersecurity, and software domains on demand.",                      tags:["On-Demand","Fast Onboarding","Flexible Models"],    accent:"#2a558f"},
  {icon:<IcoLayer/>, n:"04", t:"Professional Services",     line:"From design to deployment — done right",       b:"Deliver enterprise solutions with precision across network, cloud, and DevOps transformations.",                    tags:["Project Delivery","Low-Risk","Precision Execution"],accent:"#0e1e3a"},
  {icon:<IcoZap/>,   n:"05", t:"Software & AI Development", line:"Intelligent systems, measurable outcomes",     b:"Build scalable software and AI-driven systems tailored to your business needs.",                                   tags:["AI-Driven","Custom Software","Automation"],         accent:"#091428"},
  {icon:<IcoWifi/>,  n:"06", t:"Network as a Service",      line:"Connectivity delivered as a managed service",  b:"Scalable, enterprise-grade network services delivered on demand — from SD-WAN and load balancing to cloud connectivity.", tags:["SD-WAN","Load Balancing","Cloud Connect"],        accent:"#142a52"},
];

const PHIL=[
  {n:"1",t:"Consulting Before Technology",b:"Assess before architecting — and architect before implementing."},
  {n:"2",t:"Design for Scale & Security", b:"Secure, scalable, and resilient by design at every layer."},
  {n:"3",t:"Single Accountability",       b:"One partner from advisory and implementation to managed services."},
  {n:"4",t:"Continuous Optimisation",     b:"Ongoing improvement and risk reduction across the lifecycle."},
];

const ENGAGE=[
  {s:"Phase 01",t:"Advisory & Consulting",      d:"Understand goals, assess state, define roadmap"},
  {s:"Phase 02",t:"Architecture & Design",      d:"Blueprint solutions tailored to your environment"},
  {s:"Phase 03",t:"Implementation & Migration", d:"Structured, low-risk delivery"},
  {s:"Phase 04",t:"Managed Services & Support", d:"Ongoing operations and evolution"},
];

const Services = () => (
  <section id="services">
    <div className="container">
      <SH eyebrow="Our Services" title="Services We Offer"
        sub="End-to-end technology services covering the full lifecycle — from strategy and implementation to managed operations."/>
      <p className="sub-label" data-reveal="up">Our Philosophy</p>
      <div className="philosophy-grid" data-stagger>
        {PHIL.map(p=>(
          <div key={p.n} className={`phil-card phil-card-${p.n}`}>
            <div className="phil-num">{p.n}</div>
            <div className="phil-content"><h4>{p.t}</h4><p>{p.b}</p></div>
          </div>
        ))}
      </div>
    </div>

    <HScroll className="svc-hscroll">
      {SVCS.map((s,i)=>(
        <motion.div key={s.t} className={`svc-card-h svc-card-${i%6}`}
          initial={{ opacity:0, y:32 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, margin:"-60px" }}
          transition={{ delay:i*0.07, duration:0.6, ease:[0.22,1,0.36,1] }}>
          {/* Top accent stripe */}
          <div className="svc-card-stripe" style={{ background:`linear-gradient(90deg,${s.accent},transparent)` }}/>
          <div className="svc-card-num">{s.n}</div>
          <div className="svc-icon-wrap">{s.icon}</div>
          <div className="svc-tagline">{s.line}</div>
          <motion.h3
            initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ delay:i*0.07+0.14, duration:0.5 }}>
            {s.t}
          </motion.h3>
          <motion.p
            initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ delay:i*0.07+0.22, duration:0.5 }}>
            {s.b}
          </motion.p>
          <div className="svc-tags">
            {s.tags.map(tg=><span key={tg} className="svc-tag">{tg}</span>)}
          </div>
          <div className="svc-card-footer">
            <span>Learn more</span>
            <IcoArr/>
          </div>
        </motion.div>
      ))}
    </HScroll>

    <div className="container">
      <p className="sub-label" data-reveal="up" style={{marginTop:52}}>How We Engage</p>
      <div className="engage-strip" data-stagger>
        {ENGAGE.map(e=>(
          <div key={e.s} className="engage-item">
            <div className="engage-step">{e.s}</div>
            <h4>{e.t}</h4>
            <p>{e.d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════
   SOLUTIONS — editorial card style + motion
══════════════════════════════════════════ */
const SOLS=[
  {icon:<IcoNet/>,    n:"01", t:"Network & Connectivity",        b:"Solve fragmented, unreliable enterprise networks with scalable, high-performance connectivity across campuses, branches, data centres, and cloud.",   bar:"#1d3d72"},
  {icon:<IcoCloud/>,  n:"02", t:"Cloud & DevOps Solutions",      b:"Enable agility and control with secure cloud platforms, DevOps automation, and hybrid IT operations that balance flexibility and governance.",         bar:"#2a558f"},
  {icon:<IcoShield/>, n:"03", t:"Cybersecurity Solutions",       b:"Reduce cyber risk with integrated security across endpoints, cloud, data, and identities — improving visibility and ensuring regulatory readiness.",    bar:"#0e1e3a"},
  {icon:<IcoZap/>,    n:"04", t:"AI & Intelligent Automation",   b:"Leverage AI-driven insights and automation to optimise IT operations and decision-making — from network intelligence to software workflows.",           bar:"#142a52"},
  {icon:<IcoCode/>,   n:"05", t:"Software & Digital Engineering", b:"Modernise applications and build scalable digital platforms that support business growth through secure, scalable digital solutions.",                 bar:"#091428"},
  {icon:<IcoSrv/>,    n:"06", t:"Data Centre & Infrastructure",  b:"Eliminate performance bottlenecks and infrastructure limitations with robust environments supporting mission-critical workloads.",                    bar:"#1d3d72"},
];

const Solutions = () => (
  <section id="solutions">
    <div className="container">
      <SH eyebrow="Solutions" title="Solutions Built Around Business Challenges"
        sub="We focus on outcomes. Our solutions are designed to solve specific infrastructure and operational hurdles."/>
      <div className="solutions-editorial" data-stagger>
        {SOLS.map((s,i)=>(
          <motion.div key={s.t} className={`sol-ed-card sol-ed-${i%6}`}
            initial={{ opacity:0, y: 10 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, margin:"-30px" }}
            transition={{ delay:i*0.035, duration:0.42, ease:[0.22,1,0.36,1] }}>
            <div className="sol-ed-left">
              <div className="sol-ed-num">{s.n}</div>
              <div className="sol-ed-bar" style={{ background:s.bar }}/>
            </div>
            <div className="sol-ed-icon-col">
              <div className="sol-ed-icon">{s.icon}</div>
            </div>
            <div className="sol-ed-body">
              <h3>{s.t}</h3>
              <p>{s.b}</p>
            </div>
            <div className="sol-ed-cta">
              <span>Explore</span><IcoArr/>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════
   CAPABILITIES
══════════════════════════════════════════ */
const CAPS=[
  {icon:<IcoEye/>,    n:"01", t:"Network Observability & Assurance",b:"Gain deep visibility into enterprise networks with automated validation, real-time insights, and faster root-cause analysis.",tags:["Network Validation","Real-time Visibility","Automated RCA"]},
  {icon:<IcoCog/>,    n:"02", t:"Infrastructure as Code (IaC)",    b:"Accelerate delivery with Ansible and Terraform. We automate infrastructure provisioning to ensure repeatable deployments.",tags:["Ansible & Terraform","Repeatable Deployments","Consistent Environments"]},
  {icon:<IcoShield/>, n:"03", t:"Security Operations & Automation",b:"Modernise security operations with SIEM/SOAR integration. We automate detection and response to reduce manual work.",tags:["SIEM/SOAR Integration","Faster Detection","Reduced Manual Work"]},
  {icon:<IcoCloud/>,  n:"04", t:"Cloud Operations & Optimisation", b:"Optimise performance, cost, and governance across multi-cloud and hybrid environments. Built-in security and compliance.",tags:["Multi-Cloud & Hybrid","Performance Assurance","Security & Compliance"]},
];

const AI_CARDS=[
  {icon:<IcoNet/>,  t:"AI Network Solutions",  pts:["AI-driven network topology optimisation","Predictive fault detection and self-healing networks","Intelligent traffic management and load balancing","Automated network security policy enforcement","Real-time anomaly detection with ML models"]},
  {icon:<IcoCode/>, t:"AI Software Services",  pts:["Custom AI/ML model development and deployment","Intelligent process automation (IPA) frameworks","Natural language interfaces for IT operations","Predictive analytics for infrastructure planning","AI-powered observability and AIOps platforms"]},
];

const Capabilities = () => (
  <section id="capabilities">
    <div className="container">
      <SH eyebrow="Featured Capabilities" title="Advanced Engineering & Automation"
        sub="Engineering and automation workflows that drive measurable business agility."/>
      <div className="cap-grid" data-stagger>
        {CAPS.map((c,i)=>(
          <motion.div key={c.t} className="cap-card"
            initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, margin:"-40px" }}
            transition={{ delay:i*0.09, duration:0.6, ease:[0.22,1,0.36,1] }}>
            <div className="cap-card-num">{c.n}</div>
            <div className="cap-card-header">
              <div className="cap-icon">{c.icon}</div>
              <motion.h3 initial={{ opacity:0, x:-12 }} whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.09+0.15, duration:0.45 }}>
                {c.t}
              </motion.h3>
            </div>
            <p>{c.b}</p>
            <div className="cap-tags">{c.tags.map(tg=><span key={tg} className="cap-tag">{tg}</span>)}</div>
          </motion.div>
        ))}
      </div>
      <div className="ai-block" data-reveal="up" style={{marginTop:36}}>
        <div className="ai-block-head">
          <Tag light>AI Solutions</Tag>
          <h2>AI Solutions</h2>
          <p>Harnessing artificial intelligence to transform enterprise network and software operations.</p>
        </div>
        <div className="ai-sub-grid">
          {AI_CARDS.map(ai=>(
            <div key={ai.t} className="ai-sub-card">
              <div className="ai-sub-card-head">
                <div className="cap-icon" style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",color:"var(--n-100)"}}>{ai.icon}</div>
                <h3>{ai.t}</h3>
              </div>
              <ul>{ai.pts.map(pt=><li key={pt}><span><IcoChk/></span>{pt}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════
   FINAL CTA
══════════════════════════════════════════ */
const FinalCTA = () => (
  <section id="cta">
    <div className="cta-bg"/>
    <div className="container">
      <div className="cta-card" data-reveal="scale">
        <Tag light>Get Started</Tag>
        <h2>Design, Secure, and Scale<br/>Your Enterprise Systems</h2>
        <p>From strategy to operations, we help enterprises design and manage technology environments that deliver performance, resilience, and long-term scalability.</p>
        <div className="cta-btns">
          <Mag href="#" cls="btn-primary" style={{fontSize:15,padding:"14px 32px"}}>Talk to an Expert <span className="btn-arrow">→</span></Mag>
          <Mag href="#services" cls="btn-ghost-w" style={{fontSize:15,padding:"13px 28px"}}>Explore Services</Mag>
        </div>
        <div className="cta-stats">
          {[["150+","Enterprise Clients"],["99%","SLA Uptime"],["12+","Years Expertise"],["40+","Certified Experts"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div className="cta-stat-num"><span className="cta-stat-accent">{n}</span></div>
              <div className="cta-stat-lbl">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════
   FOOTER — animated
══════════════════════════════════════════ */
const footerLinks = [
  ["Company",  "Who We Are","Why WeRoute","Careers","Contact Us"],
  ["Services", "Managed Services","Consulting & Advisory","Professional Services","Software & AI Dev"],
  ["Solutions","Network & Connectivity","Cybersecurity","Cloud & DevOps","AI Solutions"],
  ["Connect",  "Contact","Request Consultation","Partner With Us","Privacy Policy"],
];

function FooterWord({ word, delay }) {
  return (
    <motion.span initial={{ opacity:0, y:80, filter:"blur(14px)" }}
      whileInView={{ opacity:1, y:0, filter:"blur(0px)" }}
      viewport={{ once:true, amount:0.7 }}
      transition={{ delay, duration:0.85, ease:[0.22,1,0.36,1] }}>
      {word}
    </motion.span>
  );
}

function FooterRevealLine({ chunks, delay=0 }) {
  return (
    <motion.p className="footer-copy"
      initial="hidden" whileInView="show"
      viewport={{ once:true, amount:0.7 }}
      variants={{ hidden:{}, show:{ transition:{ delayChildren:delay, staggerChildren:0.08 } } }}>
      {chunks.map((chunk,i) => (
        <motion.span key={`${chunk}-${i}`}
          variants={{ hidden:{ opacity:0, y:18, filter:"blur(8px)" }, show:{ opacity:1, y:0, filter:"blur(0px)" } }}
          transition={{ duration:0.44, ease:[0.22,1,0.36,1] }}>
          {chunk}
        </motion.span>
      ))}
    </motion.p>
  );
}

const Footer = () => {
  const bigWords = ["Beyond","Boundaries,","Bridging","Connectivity"];
  return (
    <footer id="footer">
      <div className="footer-beam"/>
      <div className="container">
        <motion.div className="footer-tagline"
          initial={{ opacity:0, y:90, filter:"blur(14px)" }}
          whileInView={{ opacity:1, y:0, filter:"blur(0px)" }}
          viewport={{ once:true, amount:0.55 }}
          transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}>
          Building Intelligent Enterprises
        </motion.div>
        <div className="footer-top">
          <motion.div className="footer-logo-wrap"
            initial={{ opacity:0, y:55, filter:"blur(10px)" }}
            whileInView={{ opacity:1, y:0, filter:"blur(0px)" }}
            viewport={{ once:true, amount:0.6 }}
            transition={{ delay:0.2, duration:0.75 }}>
            <Logo h={32} onDark/>
            <p className="footer-brand-desc">Enterprise technology consulting specialising in networking, cybersecurity, cloud, and digital engineering.</p>
            <div className="footer-social">
              {[<IcoLI/>,<IcoTw/>,<IcoMail/>].map((ic,i)=>(
                <a key={i} href="#" className="social-btn">{ic}</a>
              ))}
            </div>
          </motion.div>
          <div className="footer-big-text">
            {bigWords.map((word,i) => <FooterWord key={word} word={word} delay={0.35+i*0.22}/>)}
          </div>
        </div>
        <motion.div className="footer-grid"
          initial="hidden" whileInView="show"
          viewport={{ once:true, amount:0.35 }}
          variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.14, delayChildren:0.3 } } }}>
          {footerLinks.map(([head,...links]) => (
            <motion.div key={head}
              variants={{ hidden:{ opacity:0, y:45, filter:"blur(10px)" }, show:{ opacity:1, y:0, filter:"blur(0px)" } }}
              transition={{ duration:0.65 }}>
              <h4>{head}</h4>
              {links.map(link => <a key={link} href="#">{link}</a>)}
            </motion.div>
          ))}
        </motion.div>
        <div className="footer-bottom">
          <FooterRevealLine chunks={["©","2026","WeRoute.","All","rights","reserved."]} delay={0.2}/>
          <FooterRevealLine chunks={["Secure,","scalable,","future-ready","enterprise","technology."]} delay={0.5}/>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ══════════════════════════════════════════
   ROOT
══════════════════════════════════════════ */
export default function App() {
  useReveal();
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <IntroLoader onDone={() => setLoaded(true)}/>
      <CursorGlow/>
      <Navbar/>
      <main>
        <Hero/>
        <Trust/>
        <WhoWeAre/>
        <WhyWeRoute/>
        <Services/>
        <Solutions/>
        <Capabilities/>
        <FinalCTA/>
      </main>
      <Footer/>
    </>
  );
}