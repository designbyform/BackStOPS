import { useState, useRef, useCallback, useEffect } from "react";

const HN = "-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif";

const Mark = ({ size = 20, color = "#1d1d1f" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="16" y="2" width="20" height="20" rx="2" transform="rotate(45 16 2)" fill={color} opacity="0.15"/>
    <rect x="16" y="6" width="13" height="13" rx="1.5" transform="rotate(45 16 6)" fill={color}/>
  </svg>
);
const Logo = ({ h = 17, color = "#1d1d1f" }) => (
  <div style={{ display:"flex",alignItems:"center",gap:7,flexShrink:0 }}>
    <Mark size={h} color={color}/>
    <span style={{ fontFamily:HN,fontSize:h*0.8,fontWeight:600,color,letterSpacing:"-0.02em",lineHeight:1 }}>marque</span>
  </div>
);

// Storage
const SK = "mq10";
const save = d => { try { localStorage.setItem(SK,JSON.stringify(d)); } catch {} };
const load = () => { try { const r=localStorage.getItem(SK); return r?JSON.parse(r):null; } catch { return null; } };
const nuke = () => { try { localStorage.removeItem(SK); } catch {} };

// PDF text
async function pdfToText(buf) {
  return new Promise(res => {
    const run = async () => {
      try {
        const lib = window["pdfjs-dist/build/pdf"];
        lib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const pdf = await lib.getDocument({ data: buf }).promise;
        let out = "";
        for (let i=1;i<=Math.min(pdf.numPages,40);i++){
          const pg = await pdf.getPage(i);
          const ct = await pg.getTextContent();
          out += ct.items.map(x=>x.str).join(" ") + "\n";
        }
        res(out.replace(/\s+/g," ").trim() || "");
      } catch { res(""); }
    };
    if (window["pdfjs-dist/build/pdf"]) { run(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = run; s.onerror = () => res("");
    document.head.appendChild(s);
  });
}

// PDF pages for preview
async function pdfToPages(buf, max=8) {
  return new Promise(res => {
    const run = async () => {
      try {
        const lib = window["pdfjs-dist/build/pdf"];
        lib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const pdf = await lib.getDocument({ data: buf }).promise;
        const pages = [];
        for (let i=1;i<=Math.min(pdf.numPages,max);i++){
          const pg = await pdf.getPage(i);
          const vp = pg.getViewport({ scale:1.5 });
          const cv = document.createElement("canvas");
          cv.width=vp.width; cv.height=vp.height;
          await pg.render({ canvasContext:cv.getContext("2d"),viewport:vp }).promise;
          pages.push({ url:cv.toDataURL("image/jpeg",.82), num:i, total:pdf.numPages });
        }
        res(pages);
      } catch { res([]); }
    };
    if (window["pdfjs-dist/build/pdf"]) { run(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = run; s.onerror = () => res([]);
    document.head.appendChild(s);
  });
}

// fal.ai
async function falImg(prompt, key) {
  if (!key) throw new Error("No fal.ai key — add it in Settings");
  const r = await fetch("https://fal.run/fal-ai/flux/dev", {
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":`Key ${key}`},
    body:JSON.stringify({ prompt, image_size:"landscape_16_9", num_inference_steps:28, num_images:1 }),
  });
  if (!r.ok) throw new Error(`fal.ai ${r.status}`);
  const d = await r.json();
  const url = d.images?.[0]?.url;
  if (!url) throw new Error("No image URL");
  return url;
}

// Plans
const PLANS = {
  seed:   {name:"Seed",   price:0,  team:1,  msgs:50, imgs:0,  concepts:3},
  series: {name:"Series", price:29, team:5,  msgs:1e9,imgs:30, concepts:1e9},
  scale:  {name:"Scale",  price:79, team:20, msgs:1e9,imgs:100,concepts:1e9},
};

// Tiny helpers
function Burst({on}) {
  if(!on) return null;
  const c=["#1d1d1f","#007aff","#34c759","#ff9500","#ff2d55"];
  return <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>{Array.from({length:24}).map((_,i)=><div key={i} style={{position:"absolute",left:`${15+Math.random()*70}%`,top:-10,width:4+Math.random()*4,height:8+Math.random()*8,background:c[i%5],borderRadius:Math.random()>.5?"50%":"2px",animation:`cf ${.9+Math.random()}s ease ${Math.random()*.4}s forwards`,transform:`rotate(${Math.random()*360}deg)`,opacity:0}}/>)}</div>;
}
function Toast({msg,on}) {
  return <div style={{position:"fixed",bottom:28,left:"50%",transform:on?"translateX(-50%) translateY(0)":"translateX(-50%) translateY(10px)",background:"#1d1d1f",color:"#fff",fontFamily:HN,fontSize:13,fontWeight:500,padding:"10px 18px",borderRadius:12,boxShadow:"0 8px 28px rgba(0,0,0,.25)",zIndex:9000,pointerEvents:"none",opacity:on?1:0,transition:"all .3s cubic-bezier(.34,1.56,.64,1)"}}>{msg}</div>;
}
function Sheet({children,onClose}) {
  useEffect(()=>{const h=e=>{if(e.key==="Escape")onClose();};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[onClose]);
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.5)",backdropFilter:"blur(10px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",maxWidth:540,width:"100%",maxHeight:"88dvh",overflowY:"auto",animation:"sUp .28s cubic-bezier(.34,1.56,.64,1)"}}>
        <div style={{width:36,height:4,borderRadius:2,background:"#e5e5ea",margin:"10px auto 0"}}/>
        <div style={{padding:"16px 20px 32px"}}>{children}</div>
      </div>
    </div>
  );
}

function Paywall({reason,onClose,onUp}) {
  return (
    <Sheet onClose={onClose}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <h2 style={{fontFamily:HN,fontSize:19,fontWeight:700,color:"#1d1d1f",marginBottom:6}}>Unlock full access</h2>
        <p style={{fontFamily:HN,fontSize:13,color:"#6e6e73",lineHeight:1.6}}>{reason}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {[PLANS.series,PLANS.scale].map(p=>(
          <div key={p.name} onClick={()=>onUp(p)} style={{border:"1.5px solid #e5e5ea",borderRadius:14,padding:"16px",cursor:"pointer"}}>
            <div style={{fontFamily:HN,fontSize:12,fontWeight:600,color:"#1d1d1f",marginBottom:2}}>{p.name}</div>
            <div style={{fontFamily:HN,fontSize:22,fontWeight:700,color:"#1d1d1f",letterSpacing:"-.03em",marginBottom:6}}>${p.price}<span style={{fontSize:11,fontWeight:400,color:"#6e6e73"}}>/mo</span></div>
            <div style={{fontFamily:HN,fontSize:11,color:"#6e6e73",lineHeight:1.7}}>{p.team} teammates<br/>Unlimited messages<br/>{p.imgs} AI images/mo</div>
          </div>
        ))}
      </div>
      <button onClick={onClose} style={{width:"100%",background:"none",border:"none",fontFamily:HN,fontSize:14,color:"#aeaeb2",cursor:"pointer",padding:"6px 0"}}>Not now</button>
    </Sheet>
  );
}

function SettingsSheet({falKey,onSave,onClose}) {
  const [k,setK]=useState(falKey||"");
  return (
    <Sheet onClose={onClose}>
      <h2 style={{fontFamily:HN,fontSize:17,fontWeight:700,color:"#1d1d1f",marginBottom:16}}>Image Generation · fal.ai</h2>
      <label style={{fontFamily:HN,fontSize:13,fontWeight:600,color:"#1d1d1f",display:"block",marginBottom:6}}>API key</label>
      <input value={k} onChange={e=>setK(e.target.value)} placeholder="fal_key_..." type="password"
        style={{width:"100%",border:"1px solid #e5e5ea",borderRadius:10,fontFamily:HN,fontSize:16,color:"#1d1d1f",padding:"12px",outline:"none",background:"#fafafa",marginBottom:6}}/>
      <p style={{fontFamily:HN,fontSize:11,color:"#aeaeb2",marginBottom:18,lineHeight:1.6}}>Get key at <a href="https://fal.ai/dashboard/keys" target="_blank" rel="noreferrer" style={{color:"#007aff"}}>fal.ai/dashboard/keys</a>. Stored in session only. FLUX.1-dev · ~$0.025/image.</p>
      <button onClick={()=>{onSave(k);onClose();}} style={{width:"100%",background:"#1d1d1f",border:"none",borderRadius:12,fontFamily:HN,fontSize:15,fontWeight:500,color:"#fff",padding:"14px",cursor:"pointer"}}>Save</button>
    </Sheet>
  );
}

function EmailSheet({onDone,onSkip}) {
  const [email,setEmail]=useState(""); const [sent,setSent]=useState(false);
  const sub=async()=>{
    if(!email.includes("@"))return;
    try{await fetch("https://formsubmit.co/ajax/hello@marque.ai",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({email})});}catch{}
    setSent(true);setTimeout(()=>onDone(email),1200);
  };
  return (
    <Sheet onClose={onSkip}>
      <div style={{textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><Mark size={36} color="#1d1d1f"/></div>
        {sent?(<><h2 style={{fontFamily:HN,fontSize:19,fontWeight:700,color:"#1d1d1f",marginBottom:6}}>You're in ✓</h2><p style={{fontFamily:HN,fontSize:14,color:"#6e6e73"}}>Loading workspace...</p></>):(
          <>
            <h2 style={{fontFamily:HN,fontSize:19,fontWeight:700,color:"#1d1d1f",marginBottom:6}}>Start with Marque</h2>
            <p style={{fontFamily:HN,fontSize:13,color:"#6e6e73",lineHeight:1.6,marginBottom:20}}>Save your brand and get early access updates.</p>
            <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sub();}} placeholder="you@startup.com" type="email" inputMode="email"
              style={{width:"100%",border:"1px solid #e5e5ea",borderRadius:12,fontFamily:HN,fontSize:16,color:"#1d1d1f",padding:"13px",outline:"none",marginBottom:10,background:"#fafafa"}}/>
            <button onClick={sub} disabled={!email.includes("@")} style={{width:"100%",background:email.includes("@")?"#1d1d1f":"#e5e5ea",border:"none",borderRadius:12,fontFamily:HN,fontSize:15,fontWeight:500,color:email.includes("@")?"#fff":"#aeaeb2",padding:"14px",cursor:email.includes("@")?"pointer":"not-allowed",marginBottom:10}}>Get started free →</button>
            <button onClick={onSkip} style={{background:"none",border:"none",fontFamily:HN,fontSize:13,color:"#aeaeb2",cursor:"pointer"}}>Skip for now</button>
          </>
        )}
      </div>
    </Sheet>
  );
}

function PDFPreview({pages,rendering}) {
  const [pg,setPg]=useState(0);
  if(rendering) return <div style={{background:"#1d1d1f",borderRadius:14,height:160,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}><div style={{width:18,height:18,border:"2.5px solid rgba(255,255,255,.2)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/><span style={{fontFamily:HN,fontSize:12,color:"rgba(255,255,255,.5)"}}>Rendering preview...</span></div>;
  if(!pages.length) return null;
  const cur=pages[pg];
  return (
    <div style={{borderRadius:14,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,.15)"}}>
      <img src={cur.url} alt={`Page ${cur.num}`} style={{width:"100%",display:"block"}}/>
      {pages.length>1&&<div style={{background:"#1d1d1f",padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>setPg(p=>Math.max(0,p-1))} disabled={pg===0} style={{background:"none",border:"none",fontFamily:HN,fontSize:12,color:pg===0?"rgba(255,255,255,.25)":"#fff",cursor:pg===0?"default":"pointer",padding:"4px 8px"}}>← Prev</button>
        <span style={{fontFamily:HN,fontSize:11,color:"rgba(255,255,255,.5)"}}>Page {cur.num} of {cur.total}</span>
        <button onClick={()=>setPg(p=>Math.min(pages.length-1,p+1))} disabled={pg===pages.length-1} style={{background:"none",border:"none",fontFamily:HN,fontSize:12,color:pg===pages.length-1?"rgba(255,255,255,.25)":"#fff",cursor:pg===pages.length-1?"default":"pointer",padding:"4px 8px"}}>Next →</button>
      </div>}
    </div>
  );
}

function Bubble({m,onLoad}) {
  const text=(m.content||"").replace(/\[IMG:[^\]]*\]/g,"").trim();
  return (
    <div style={{display:"flex",flexDirection:m.role==="user"?"row-reverse":"row",gap:8,marginBottom:12,animation:"sUp .2s ease both"}}>
      {m.role==="assistant"&&<div style={{width:26,height:26,borderRadius:8,background:"#1d1d1f",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><Mark size={12} color="#fff"/></div>}
      <div style={{maxWidth:"82%",display:"flex",flexDirection:"column",gap:7,alignItems:m.role==="user"?"flex-end":"flex-start"}}>
        {text&&<div style={{padding:"10px 14px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"4px 16px 16px 16px",background:m.role==="user"?"#1d1d1f":"#fff",boxShadow:m.role==="assistant"?"0 1px 6px rgba(0,0,0,.07),0 0 0 .5px rgba(0,0,0,.05)":"none",fontFamily:HN,fontSize:14,lineHeight:1.7,color:m.role==="user"?"#fff":"#1d1d1f"}}>
          {text.split("\n").filter(Boolean).map((l,j,a)=><p key={j} style={{marginBottom:j<a.length-1?5:0}}>{l}</p>)}
        </div>}
        {m.genImg&&<div style={{borderRadius:12,background:"#f0f0f5",width:"min(280px,75vw)",height:140,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
          <div style={{width:18,height:18,border:"2.5px solid #e5e5ea",borderTopColor:"#1d1d1f",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
          <span style={{fontFamily:HN,fontSize:12,color:"#aeaeb2"}}>Generating image...</span>
        </div>}
        {m.imageUrl&&<div style={{borderRadius:12,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,.15)",maxWidth:"min(360px,82vw)"}}>
          <img src={m.imageUrl} alt="" style={{width:"100%",display:"block"}} onLoad={onLoad}/>
          <div style={{padding:"7px 12px",background:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:HN,fontSize:10,color:"#aeaeb2"}}>FLUX.1-dev · fal.ai</span>
            <a href={m.imageUrl} download="marque.jpg" target="_blank" rel="noreferrer" style={{fontFamily:HN,fontSize:11,color:"#007aff",textDecoration:"none"}}>Download</a>
          </div>
        </div>}
      </div>
    </div>
  );
}

function ConceptCard({c,idx,isPaid,hasFalKey,imgLoading,onGen,onUpgrade,onKey}) {
  const [cp,setCp]=useState(false);
  return (
    <div style={{borderRadius:14,overflow:"hidden",background:"#fff",boxShadow:"0 2px 14px rgba(0,0,0,.08),0 0 0 .5px rgba(0,0,0,.05)",marginBottom:14,animation:`sUp .35s cubic-bezier(.34,1.56,.64,1) ${idx*.05}s both`}}>
      {c.imageUrl?(<div style={{position:"relative"}}>
        <img src={c.imageUrl} alt="" style={{width:"100%",display:"block",maxHeight:220,objectFit:"cover"}}/>
        <a href={c.imageUrl} download="marque.jpg" target="_blank" rel="noreferrer" style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,.5)",backdropFilter:"blur(8px)",borderRadius:8,fontFamily:HN,fontSize:11,color:"#fff",padding:"5px 10px",textDecoration:"none"}}>Download</a>
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,.7))",padding:"20px 16px 12px"}}><p style={{fontFamily:HN,fontSize:"clamp(14px,3vw,20px)",fontWeight:700,color:"#fff",lineHeight:1.1,letterSpacing:"-.02em"}}>{c.headline}</p></div>
      </div>):c.generating?(<div style={{background:c.background||"#1d1d1f",height:160,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
        <div style={{width:18,height:18,border:"2.5px solid rgba(255,255,255,.2)",borderTopColor:"rgba(255,255,255,.8)",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
        <span style={{fontFamily:HN,fontSize:12,color:"rgba(255,255,255,.6)"}}>Generating...</span>
      </div>):(<div style={{background:c.background||"#1d1d1f",minHeight:160,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"28px 20px",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:c.accentColor||"#000"}}/>
        <p style={{fontFamily:HN,fontSize:"clamp(14px,4vw,24px)",fontWeight:700,color:c.textColor||"#fff",textAlign:"center",lineHeight:1.1,letterSpacing:"-.02em",marginBottom:6,maxWidth:300}}>{c.headline}</p>
        {c.subtext&&<p style={{fontFamily:HN,fontSize:10,color:c.textColor||"#fff",opacity:.5,letterSpacing:".1em",textTransform:"uppercase",textAlign:"center"}}>{c.subtext}</p>}
        <div style={{position:"absolute",bottom:10,right:10}}>
          {!isPaid?<button onClick={onUpgrade} style={{background:"rgba(0,0,0,.45)",backdropFilter:"blur(8px)",border:"none",borderRadius:8,fontFamily:HN,fontSize:10,color:"rgba(255,255,255,.7)",padding:"5px 9px",cursor:"pointer"}}>Series+ for image</button>
          :!hasFalKey?<button onClick={onKey} style={{background:"rgba(0,0,0,.45)",backdropFilter:"blur(8px)",border:"none",borderRadius:8,fontFamily:HN,fontSize:10,color:"rgba(255,255,255,.75)",padding:"5px 9px",cursor:"pointer"}}>Add fal.ai key</button>
          :<button onClick={()=>onGen(idx)} disabled={imgLoading===idx} style={{background:"rgba(255,255,255,.15)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.3)",borderRadius:8,fontFamily:HN,fontSize:11,fontWeight:500,color:"#fff",padding:"6px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,opacity:imgLoading===idx?.4:1}}>
            {imgLoading===idx?<><div style={{width:9,height:9,border:"1.5px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Generating...</>:"Generate image"}
          </button>}
        </div>
      </div>)}
      <div style={{padding:"10px 14px",display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:".5px solid #f5f5f7",gap:10}}>
        <div><div style={{fontFamily:HN,fontSize:9,color:"#aeaeb2",letterSpacing:".06em",textTransform:"uppercase",marginBottom:2}}>Format</div><div style={{fontFamily:HN,fontSize:11,color:"#1d1d1f"}}>{c.format}</div></div>
        <div><div style={{fontFamily:HN,fontSize:9,color:"#aeaeb2",letterSpacing:".06em",textTransform:"uppercase",marginBottom:2}}>Mood</div><div style={{fontFamily:HN,fontSize:11,color:"#1d1d1f"}}>{c.mood}</div></div>
      </div>
      <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
        <p style={{fontFamily:HN,fontSize:12,color:"#6e6e73",lineHeight:1.65,flex:1,margin:0}}><span style={{color:"#aeaeb2",marginRight:4}}>Direction —</span>{c.artDirectionNotes}</p>
        <button onClick={()=>{navigator.clipboard?.writeText(`${c.title}\n${c.format}\n"${c.headline}"\nBG:${c.background} Accent:${c.accentColor}\n${c.artDirectionNotes}`);setCp(true);setTimeout(()=>setCp(false),2000);}} style={{background:cp?"#34c759":"#f5f5f7",border:"none",borderRadius:8,fontFamily:HN,fontSize:11,color:cp?"#fff":"#6e6e73",padding:"5px 10px",cursor:"pointer",flexShrink:0,transition:"all .2s",whiteSpace:"nowrap"}}>{cp?"Copied ✓":"Copy"}</button>
      </div>
    </div>
  );
}

const TIPS=[
  {icon:"◎",label:"Voice & tone",desc:"Personality, energy, what to avoid"},
  {icon:"◑",label:"Color palette",desc:"Primary, secondary, accent hex values"},
  {icon:"Aa",label:"Typography",desc:"Fonts, weights, sizing hierarchy"},
  {icon:"◈",label:"Logo rules",desc:"Usage, clear space, dos and don'ts"},
  {icon:"◇",label:"Messaging",desc:"Positioning, tagline, audience"},
];

export default function Marque() {
  const [view,setView]=useState("brand");
  const [mode,setMode]=useState("text");
  const [brandText,setBrandText]=useState("");
  const [brandName,setBrandName]=useState("");
  const [status,setStatus]=useState("idle");
  const [pdfPages,setPdfPages]=useState([]);
  const [pdfRendering,setPdfRendering]=useState(false);
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState("");
  const [chatBusy,setChatBusy]=useState(false);
  const [concepts,setConcepts]=useState([]);
  const [cPrompt,setCPrompt]=useState("");
  const [cBusy,setCBusy]=useState(false);
  const [imgLoading,setImgLoading]=useState(null);
  const [team,setTeam]=useState([{id:1,name:"Alex Chen",role:"Co-founder",access:"Admin"}]);
  const [newM,setNewM]=useState({name:"",role:"",access:"Editor"});
  const [teamNote,setTeamNote]=useState("");
  const [plan,setPlan]=useState("seed");
  const [msgCount,setMsgCount]=useState(0);
  const [cCount,setCCount]=useState(0);
  const [imgCount,setImgCount]=useState(0);
  const [paywall,setPaywall]=useState(null);
  const [showEmail,setShowEmail]=useState(false);
  const [showSettings,setShowSettings]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const [confetti,setConfetti]=useState(false);
  const [toast,setToast]=useState({msg:"",on:false});
  const [dragging,setDragging]=useState(false);
  const [hasEmail,setHasEmail]=useState(false);
  const [falKey,setFalKey]=useState(()=>sessionStorage.getItem("mq_fal")||"");
  const bottomRef=useRef(); const inputRef=useRef(); const fileRef=useRef();
  const cur=PLANS[plan];
  const isReady=status==="ready";
  const isPaid=plan==="series"||plan==="scale";

  useEffect(()=>{
    const s=load();
    if(s?.brandText&&s?.brandName){
      setBrandText(s.brandText);setBrandName(s.brandName);setStatus("ready");
      if(s.messages?.length)setMessages(s.messages.map(m=>({...m,genImg:false})));
      if(s.teamNote)setTeamNote(s.teamNote);
      if(s.hasEmail)setHasEmail(true);
      toast_(`${s.brandName} restored`);
    }
  },[]);

  useEffect(()=>{
    if(brandText&&brandName)save({brandText,brandName,messages:messages.slice(-20),teamNote,hasEmail});
  },[brandText,brandName,messages,teamNote,hasEmail]);

  const toast_=msg=>{setToast({msg,on:true});setTimeout(()=>setToast(t=>({...t,on:false})),2400);};
  const pop=()=>{setConfetti(true);setTimeout(()=>setConfetti(false),1400);};
  const scrollB=()=>setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),80);

  const processFile=useCallback(async file=>{
    setStatus("reading");
    const name=file.name.replace(/\.[^.]+$/,"").replace(/[-_]/g," ");
    const isPDF=file.type==="application/pdf"||file.name.endsWith(".pdf");
    let text="";
    try {
      if(isPDF){
        const buf=await file.arrayBuffer();
        text=await pdfToText(buf);
        setPdfRendering(true);setPdfPages([]);
        pdfToPages(buf,8).then(p=>{setPdfPages(p);setPdfRendering(false);});
      } else { text=await file.text(); }
    } catch {}
    if(!text||text.length<50)text=`Brand guidelines from "${name}" loaded. Note: text extraction was limited — a text-based PDF works best.`;
    setBrandText(text);setBrandName(name);setStatus("ready");pop();
    setView("studio");setMenuOpen(false);
    setMessages([{role:"assistant",content:`${name} is loaded.\n\nI'm your brand steward — your guidelines are absorbed. Paste any copy for a check, describe a visual, ask for campaign ideas, or switch to Image mode to generate on-brand visuals.`}]);
    if(!hasEmail)setTimeout(()=>setShowEmail(true),900);
  },[hasEmail]);

  const loadDemo=()=>{
    const demo=`BRAND: Meridian\nTAGLINE: Clarity at scale.\nVOICE: Confident, precise, human. Short active sentences. No jargon.\nTONE: Warm but authoritative. Approachable, never cold.\nPILLARS: Clarity cuts through noise. Built for the ambitious. Design is a competitive advantage.\nCOLORS: Black #0D0D0D, White #FFFFFF, Blue #0057FF, Cream #F5F2EE.\nTYPOGRAPHY: Helvetica Neue. Bold headlines -0.03em. Regular body 1.7 leading.\nLOGO: Wordmark only. Black or white. Never on busy backgrounds.\nIMAGERY: Architectural. High contrast. Real textures. No stock photography.\nAUDIENCE: Startup founders who value craft and precision.\nAVOID: Clutter, buzzwords, gradients, pastels, stock photography, exclamation points.`;
    setBrandText(demo);setBrandName("Meridian");setStatus("ready");pop();setView("studio");
    setMessages([{role:"assistant",content:"Meridian is loaded.\n\nVoice, colors, typography, and guardrails are set. Paste some copy, or switch to Image mode."}]);
    if(!hasEmail)setTimeout(()=>setShowEmail(true),900);
  };

  // Single-turn call for concept generation
  const callAPI=async(userContent)=>{
    const response=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "anthropic-version":"2023-06-01",
      },
      body:JSON.stringify({
        model:"claude-haiku-4-5",
        max_tokens:1000,
        messages:[{role:"user",content:userContent}],
      }),
    });
    if(!response.ok){
      const t=await response.text();
      throw new Error(`API ${response.status}: ${t.slice(0,200)}`);
    }
    const data=await response.json();
    if(data.error)throw new Error(data.error.message||JSON.stringify(data.error));
    const text=(data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
    if(!text)throw new Error("Empty response");
    return text;
  };

  // Multi-turn chat: brand context passed as system prompt
  const callAPIChat=async(msgs,system)=>{
    const body={
      model:"claude-haiku-4-5",
      max_tokens:1000,
      messages:msgs,
    };
    if(system)body.system=system;
    const response=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "anthropic-version":"2023-06-01",
      },
      body:JSON.stringify(body),
    });
    if(!response.ok){
      const t=await response.text();
      throw new Error(`API ${response.status}: ${t.slice(0,200)}`);
    }
    const data=await response.json();
    if(data.error)throw new Error(data.error.message||JSON.stringify(data.error));
    const text=(data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
    if(!text)throw new Error("Empty response");
    return text;
  };

  const send=async content=>{
    if(!content.trim()||chatBusy)return;
    if(msgCount>=cur.msgs){setPaywall({reason:"Message limit reached on Seed plan."});return;}
    const userMsg={role:"user",content};
    setMessages(p=>[...p,userMsg]);setInput("");setChatBusy(true);setMsgCount(c=>c+1);
    if(inputRef.current)inputRef.current.style.height="auto";

    const system=brandText
      ? `You are Marque, an AI brand steward. Brand guidelines for ${brandName}:\n\n${brandText.substring(0,18000)}\n${teamNote?`\nTeam notes: ${teamNote}`:""}\n\nHelp the team stay on brand. For copy: verdict + cite guideline + improved version. For visuals: evaluate vs brand rules. For campaigns: ground in this brand's positioning. For image requests: end with [IMG: visual prompt].`
      : "You are Marque, an AI brand steward. No guidelines loaded — tell the user to upload their PDF.";

    const apiMsgs=[...messages,userMsg].map(m=>({role:m.role,content:m.content||""}));

    let reply="";
    try { reply=await callAPIChat(apiMsgs,system); }
    catch(e){setMessages(p=>[...p,{role:"assistant",content:`Something went wrong: ${e.message}`}]);setChatBusy(false);scrollB();return;}

    const imgTag=reply.match(/\[IMG:([^\]]+)\]/);
    if(imgTag&&isPaid&&falKey&&imgCount<cur.imgs){
      const gm={role:"assistant",content:reply,genImg:true};
      setMessages(p=>[...p,gm]);setChatBusy(false);scrollB();
      try{
        const url=await falImg(`${imgTag[1].trim()}. Brand: ${brandName}. Editorial, architectural, high contrast.`,falKey);
        setImgCount(x=>x+1);setMessages(p=>p.map(m=>m===gm?{...m,imageUrl:url,genImg:false}:m));toast_("Image generated ✓");scrollB();
      }catch(e){setMessages(p=>p.map(m=>m===gm?{...m,genImg:false,content:m.content.replace(/\[IMG:[^\]]*\]/g,"").trim()+`\n(Image failed: ${e.message})`}:m));}
    } else if(imgTag&&!isPaid){
      setMessages(p=>[...p,{role:"assistant",content:reply.replace(/\[IMG:[^\]]*\]/g,"").trim()+"\n\n↑ Upgrade to Series or Scale to generate images in chat."}]);setChatBusy(false);scrollB();
    } else {
      setMessages(p=>[...p,{role:"assistant",content:reply}]);setChatBusy(false);scrollB();
    }
  };

  const genConcept=async()=>{
    if(!cPrompt.trim()||cBusy)return;
    if(cCount>=cur.concepts){setPaywall({reason:"Concept limit reached on Seed plan."});return;}
    setCBusy(true);
    const prompt=`You are a startup brand art director. Generate a visual concept brief.

Brand guidelines for ${brandName||"this brand"}:
${brandText?brandText.substring(0,16000):"None provided — use professional brand principles."}

Generate a concept for: ${cPrompt}

Return ONLY a JSON object, no markdown, no explanation:
{"title":"","format":"e.g. Twitter/X Banner","background":"#hex","accentColor":"#hex","textColor":"#hex","headline":"headline text","subtext":"tagline","visualElements":["el1","el2"],"mood":"word","artDirectionNotes":"2-3 sentences"}`;
    try{
      const raw=await callAPI(prompt);
      const clean=raw.replace(/^```(?:json)?\s*/i,"").replace(/```\s*$/i,"").trim();
      const s=clean.indexOf("{"),e=clean.lastIndexOf("}");
      if(s===-1||e===-1)throw new Error("No JSON");
      const c=JSON.parse(clean.slice(s,e+1));
      setConcepts(p=>[c,...p]);setCCount(x=>x+1);setCPrompt("");toast_("Concept generated ✓");
    }catch(e){toast_(`Error: ${e.message}`);}
    setCBusy(false);
  };

  const genConceptImg=async i=>{
    if(!isPaid){setPaywall({reason:"AI image generation on Series and Scale plans."});return;}
    if(imgCount>=cur.imgs){setPaywall({reason:"Image limit reached this month."});return;}
    if(!falKey){setShowSettings(true);return;}
    setImgLoading(i);setConcepts(p=>p.map((c,j)=>j===i?{...c,generating:true}:c));
    try{
      const c=concepts[i];
      const url=await falImg(`${c.mood} brand visual for "${brandName}". ${c.format}. BG:${c.background}. Headline:"${c.headline}". ${(c.visualElements||[]).join(", ")}. ${c.artDirectionNotes}. Editorial, architectural, high contrast.`,falKey);
      setImgCount(x=>x+1);setConcepts(p=>p.map((c,j)=>j===i?{...c,imageUrl:url,generating:false}:c));toast_("Image generated ✓");
    }catch(e){setConcepts(p=>p.map((c,j)=>j===i?{...c,generating:false}:c));toast_(`Image error: ${e.message}`);}
    setImgLoading(null);
  };

  const addMember=()=>{
    if(!newM.name.trim())return;
    if(team.length>=cur.team){setPaywall({reason:`${cur.name} supports ${cur.team} teammate${cur.team>1?"s":""}. Upgrade for more.`});return;}
    setTeam(p=>[...p,{...newM,id:Date.now()}]);setNewM({name:"",role:"",access:"Editor"});toast_(`${newM.name} added ✓`);
  };
  const go=id=>{setView(id);setMenuOpen(false);};
  const TABS=[{id:"brand",label:"Brand"},{id:"studio",label:"Studio"},{id:"team",label:"Team"}];
  const QUICK=["Check this copy:","Write a launch post","3 campaign concepts","What does this brand avoid?"];
  const FMTS=["Twitter/X banner","Product Hunt","LinkedIn post","Email header","App screenshot"];
  const IB={border:".5px solid rgba(0,0,0,.12)",borderRadius:10,fontFamily:HN,fontSize:16,color:"#1d1d1f",padding:"10px 12px",outline:"none",background:"#fafafa",width:"100%"};

  return (
    <>
      <style>{`
        @keyframes sUp{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes cf{0%{opacity:1;transform:translateY(0) rotate(0)}100%{opacity:0;transform:translateY(100vh) rotate(720deg)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes blink{0%,80%,100%{opacity:.2}40%{opacity:1}}
        *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
        html,body{height:100%;background:#f5f5f7;overscroll-behavior:none}
        ::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-thumb{background:#d1d1d6;border-radius:3px}
        input,textarea,select{font-family:-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px!important}
        input::placeholder,textarea::placeholder{color:#aeaeb2}
        button{cursor:pointer}button:active:not(:disabled){opacity:.65}
      `}</style>
      <Burst on={confetti}/>
      <Toast msg={toast.msg} on={toast.on}/>
      {showEmail&&<EmailSheet onDone={e=>{setHasEmail(true);setShowEmail(false);pop();toast_("Welcome ✓");}} onSkip={()=>{setHasEmail(true);setShowEmail(false);}}/>}
      {paywall&&<Paywall reason={paywall.reason} onClose={()=>setPaywall(null)} onUp={p=>{setPlan(p.name.toLowerCase());setPaywall(null);pop();toast_(`Upgraded to ${p.name} ✓`);}}/>}
      {showSettings&&<SettingsSheet falKey={falKey} onSave={k=>{setFalKey(k);sessionStorage.setItem("mq_fal",k);toast_("Key saved ✓");}} onClose={()=>setShowSettings(false)}/>}

      {menuOpen&&(
        <div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:400}}>
          <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:52,left:0,right:0,background:"rgba(245,245,247,.98)",backdropFilter:"blur(20px)",borderBottom:".5px solid rgba(0,0,0,.1)",paddingBottom:16,animation:"sUp .2s ease"}}>
            {TABS.map(t=><button key={t.id} onClick={()=>go(t.id)} style={{display:"flex",width:"100%",padding:"14px 20px",background:view===t.id?"rgba(0,0,0,.04)":"none",border:"none",fontFamily:HN,fontSize:16,color:view===t.id?"#1d1d1f":"#6e6e73",fontWeight:view===t.id?500:400,textAlign:"left",alignItems:"center"}}>{t.label}</button>)}
            <div style={{height:".5px",background:"rgba(0,0,0,.08)",margin:"6px 20px"}}/>
            <button onClick={()=>{setMenuOpen(false);setShowSettings(true);}} style={{display:"block",width:"100%",padding:"14px 20px",background:"none",border:"none",fontFamily:HN,fontSize:16,color:"#6e6e73",textAlign:"left"}}>Settings</button>
            {plan==="seed"&&<div style={{padding:"12px 20px 4px"}}><button onClick={()=>{setMenuOpen(false);setPaywall({reason:"Unlock unlimited access and AI image generation."});}} style={{width:"100%",background:"#1d1d1f",border:"none",borderRadius:12,fontFamily:HN,fontSize:15,fontWeight:500,color:"#fff",padding:"13px",cursor:"pointer"}}>Upgrade →</button></div>}
            {plan==="seed"&&<div style={{padding:"14px 20px 0"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontFamily:HN,fontSize:12,color:"#6e6e73"}}>Messages</span><span style={{fontFamily:HN,fontSize:12,color:"#aeaeb2"}}>{PLANS.seed.msgs-msgCount}/{PLANS.seed.msgs}</span></div>
              <div style={{height:4,background:"#f0f0f0",borderRadius:2,marginBottom:10}}><div style={{height:"100%",width:`${Math.min((msgCount/PLANS.seed.msgs)*100,100)}%`,background:msgCount>=PLANS.seed.msgs-5?"#ff3b30":"#1d1d1f",borderRadius:2}}/></div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontFamily:HN,fontSize:12,color:"#6e6e73"}}>Concepts</span><span style={{fontFamily:HN,fontSize:12,color:"#aeaeb2"}}>{PLANS.seed.concepts-cCount}/{PLANS.seed.concepts}</span></div>
              <div style={{height:4,background:"#f0f0f0",borderRadius:2}}><div style={{height:"100%",width:`${Math.min((cCount/PLANS.seed.concepts)*100,100)}%`,background:"#1d1d1f",borderRadius:2}}/></div>
            </div>}
            {isReady&&<div style={{padding:"12px 20px 0",display:"flex",alignItems:"center",gap:7}}><div style={{width:6,height:6,borderRadius:"50%",background:"#34c759"}}/><span style={{fontFamily:HN,fontSize:13,color:"#6e6e73"}}>{brandName} · Active</span></div>}
          </div>
        </div>
      )}

      <div style={{height:"100dvh",display:"flex",flexDirection:"column",overflow:"hidden",background:"#f5f5f7"}}>
        <nav style={{height:52,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",background:"rgba(245,245,247,.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:".5px solid rgba(0,0,0,.12)",zIndex:300}}>
          <Logo h={17} color="#1d1d1f"/>
          <button onClick={()=>setMenuOpen(o=>!o)} aria-label="Menu" style={{background:"none",border:"none",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",flexShrink:0}}>
            <span style={{position:"absolute",display:"block",width:18,height:1.5,background:"#1d1d1f",borderRadius:2,transition:"transform .22s",transform:menuOpen?"rotate(45deg)":"translateY(-4px)"}}/>
            <span style={{position:"absolute",display:"block",width:18,height:1.5,background:"#1d1d1f",borderRadius:2,transition:"transform .22s",transform:menuOpen?"rotate(-45deg)":"translateY(4px)"}}/>
          </button>
        </nav>

        <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column",minHeight:0}}>

          {view==="brand"&&(
            <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
              <div style={{maxWidth:520,margin:"0 auto",padding:"clamp(20px,5vw,56px) 16px 60px"}}>
                <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"#fff",borderRadius:20,padding:"4px 12px 4px 7px",boxShadow:"0 1px 6px rgba(0,0,0,.08)",marginBottom:18}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:isReady?"#34c759":"#aeaeb2"}}/>
                  <span style={{fontFamily:HN,fontSize:12,color:isReady?"#1d1d1f":"#6e6e73"}}>{isReady?`${brandName} · Active`:"Built for startup teams"}</span>
                </div>
                <h1 style={{fontFamily:HN,fontSize:"clamp(28px,8vw,56px)",fontWeight:700,letterSpacing:"-.04em",lineHeight:1.0,color:"#1d1d1f",marginBottom:10}}>Brand Guardian</h1>
                <p style={{fontFamily:HN,fontSize:"clamp(13px,2.5vw,16px)",color:"#6e6e73",lineHeight:1.65,marginBottom:26,maxWidth:360}}>Your brand steward, always on. Stay consistent across copy, visuals, and campaigns.</p>

                {isReady?(
                  <>
                    <div style={{background:"#fff",borderRadius:18,boxShadow:"0 4px 24px rgba(0,0,0,.08),0 0 0 .5px rgba(0,0,0,.05)",padding:"18px",marginBottom:14}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                        <div style={{width:38,height:38,borderRadius:10,background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{fontFamily:HN,fontSize:14,fontWeight:600,color:"#1d1d1f",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{brandName}</p>
                          <p style={{fontFamily:HN,fontSize:12,color:"#6e6e73"}}>{pdfPages.length?`${pdfPages.length} pages · PDF ready`:pdfRendering?"Rendering preview...":"Guidelines active"}</p>
                        </div>
                        <button onClick={()=>{nuke();setBrandText("");setBrandName("");setStatus("idle");setMessages([]);setPdfPages([]);}} style={{background:"#f5f5f7",border:"none",borderRadius:8,fontFamily:HN,fontSize:12,color:"#6e6e73",padding:"6px 11px",flexShrink:0}}>Replace</button>
                      </div>
                      <button onClick={()=>setView("studio")} style={{width:"100%",background:"#1d1d1f",border:"none",borderRadius:11,fontFamily:HN,fontSize:14,fontWeight:500,color:"#fff",padding:"13px",cursor:"pointer"}}>Open Studio →</button>
                    </div>
                    {(pdfPages.length>0||pdfRendering)&&<div style={{marginBottom:14}}><p style={{fontFamily:HN,fontSize:12,fontWeight:600,color:"#1d1d1f",marginBottom:8}}>Brand Guide Preview</p><PDFPreview pages={pdfPages} rendering={pdfRendering}/></div>}
                    <div style={{background:"#1d1d1f",borderRadius:14,padding:"16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                      <div><p style={{fontFamily:HN,fontSize:13,fontWeight:600,color:"#fff",marginBottom:3}}>Need a brand guide first?</p><p style={{fontFamily:HN,fontSize:11,color:"rgba(255,255,255,.45)",lineHeight:1.5}}>Form builds brand systems for startups — then hands you the keys to Marque.</p></div>
                      <a href="https://designbyform.com/contact" target="_blank" rel="noreferrer" style={{background:"#fff",border:"none",borderRadius:9,fontFamily:HN,fontSize:12,fontWeight:600,color:"#1d1d1f",padding:"9px 12px",textDecoration:"none",whiteSpace:"nowrap",flexShrink:0}}>Work with Form →</a>
                    </div>
                  </>
                ):(
                  <>
                    <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);const f=e.dataTransfer.files[0];if(f)processFile(f);}} onClick={()=>fileRef.current?.click()}
                      style={{border:`2px dashed ${dragging?"#1d1d1f":"#e5e5ea"}`,borderRadius:18,padding:"32px 20px",cursor:"pointer",textAlign:"center",background:dragging?"#f0f0f5":"#fafafa",marginBottom:12,transition:"all .2s"}}>
                      <input ref={fileRef} type="file" accept=".pdf,.txt" style={{display:"none"}} onChange={e=>{if(e.target.files[0])processFile(e.target.files[0]);}}/>
                      {status==="reading"?(
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><div style={{width:30,height:30,border:"3px solid #e5e5ea",borderTopColor:"#1d1d1f",borderRadius:"50%",animation:"spin .7s linear infinite"}}/><p style={{fontFamily:HN,fontSize:14,color:"#6e6e73"}}>Absorbing your brand...</p></div>
                      ):(
                        <><div style={{width:46,height:46,borderRadius:13,background:"#fff",boxShadow:"0 2px 10px rgba(0,0,0,.08)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aeaeb2" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg></div><p style={{fontFamily:HN,fontSize:15,fontWeight:600,color:"#1d1d1f",marginBottom:4}}>Drop your brand guidelines</p><p style={{fontFamily:HN,fontSize:13,color:"#aeaeb2"}}>PDF or TXT · Tap or drag</p></>
                      )}
                    </div>
                    <div style={{background:"#fff",borderRadius:14,padding:"14px 16px",boxShadow:"0 1px 6px rgba(0,0,0,.06),0 0 0 .5px rgba(0,0,0,.05)",marginBottom:10}}>
                      <p style={{fontFamily:HN,fontSize:12,fontWeight:600,color:"#1d1d1f",marginBottom:2}}>Brand guides work best when they include:</p>
                      <p style={{fontFamily:HN,fontSize:11,color:"#aeaeb2",marginBottom:10}}>The more context, the more helpful your steward gets.</p>
                      {TIPS.map((t,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:i<TIPS.length-1?8:0}}><span style={{width:18,height:18,borderRadius:5,background:"#f5f5f7",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:HN,fontSize:9,color:"#6e6e73",fontWeight:700,flexShrink:0}}>{t.icon}</span><span><span style={{fontFamily:HN,fontSize:12,fontWeight:500,color:"#1d1d1f"}}>{t.label}</span><span style={{fontFamily:HN,fontSize:12,color:"#aeaeb2"}}> — {t.desc}</span></span></div>)}
                    </div>
                    <div style={{background:"#1d1d1f",borderRadius:14,padding:"16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginBottom:12}}>
                      <div><p style={{fontFamily:HN,fontSize:13,fontWeight:600,color:"#fff",marginBottom:3}}>Need a brand guide first?</p><p style={{fontFamily:HN,fontSize:11,color:"rgba(255,255,255,.45)",lineHeight:1.5}}>Form builds brand systems for startups — then hands you the keys to Marque.</p></div>
                      <a href="https://designbyform.com/contact" target="_blank" rel="noreferrer" style={{background:"#fff",border:"none",borderRadius:9,fontFamily:HN,fontSize:12,fontWeight:600,color:"#1d1d1f",padding:"9px 12px",textDecoration:"none",whiteSpace:"nowrap",flexShrink:0}}>Work with Form →</a>
                    </div>
                    <div style={{textAlign:"center"}}><button onClick={loadDemo} style={{background:"none",border:"none",fontFamily:HN,fontSize:13,color:"#aeaeb2",padding:"8px 0"}}>Try a demo brand →</button></div>
                  </>
                )}
              </div>
            </div>
          )}

          {view==="studio"&&(
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
              <div style={{flexShrink:0,background:"#fff",borderBottom:".5px solid rgba(0,0,0,.08)",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                <div style={{display:"flex",background:"#f5f5f7",borderRadius:10,padding:3,gap:2}}>
                  {[{id:"text",label:"Text"},{id:"image",label:"Image"}].map(m=>(
                    <button key={m.id} onClick={()=>setMode(m.id)} style={{padding:"7px 20px",borderRadius:8,border:"none",background:mode===m.id?"#fff":"transparent",fontFamily:HN,fontSize:13,color:mode===m.id?"#1d1d1f":"#6e6e73",fontWeight:mode===m.id?500:400,boxShadow:mode===m.id?"0 1px 4px rgba(0,0,0,.08)":"none",transition:"all .15s",cursor:"pointer"}}>{m.label}</button>
                  ))}
                </div>
                {mode==="text"&&plan==="seed"&&<div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}><div style={{width:52,height:3,background:"#f5f5f7",borderRadius:2}}><div style={{height:"100%",width:`${Math.min((msgCount/PLANS.seed.msgs)*100,100)}%`,background:msgCount>=PLANS.seed.msgs-5?"#ff3b30":"#1d1d1f",borderRadius:2,transition:"width .4s"}}/></div><span style={{fontFamily:HN,fontSize:11,color:"#aeaeb2",whiteSpace:"nowrap"}}>{PLANS.seed.msgs-msgCount} left</span></div>}
                {mode==="image"&&<div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}><div style={{width:5,height:5,borderRadius:"50%",background:isPaid&&falKey?"#34c759":isPaid?"#ff9500":"#aeaeb2"}}/><span style={{fontFamily:HN,fontSize:11,color:"#6e6e73",whiteSpace:"nowrap"}}>{!isPaid?"Series+ for images":!falKey?"Add key in Settings":`${imgCount}/${cur.imgs} images`}</span></div>}
              </div>

              {mode==="text"&&(
                <>
                  <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"14px"}}>
                    <div style={{maxWidth:600,margin:"0 auto"}}>
                      {messages.length===0&&<div style={{paddingTop:10}}><p style={{fontFamily:HN,fontSize:13,color:"#aeaeb2",marginBottom:14}}>{isReady?"Your brand is loaded. Start a check below.":"Upload a brand PDF in the Brand tab first."}</p>{isReady&&<div style={{display:"flex",flexWrap:"wrap",gap:8}}>{QUICK.map((q,i)=><button key={i} onClick={()=>q.endsWith(":")?( setInput(q+" "),inputRef.current?.focus()):send(q)} style={{background:"#fff",border:".5px solid rgba(0,0,0,.1)",borderRadius:20,fontFamily:HN,fontSize:13,color:"#6e6e73",padding:"8px 14px",boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}>{q}</button>)}</div>}</div>}
                      {messages.map((m,i)=><Bubble key={i} m={m} onLoad={scrollB}/>)}
                      {chatBusy&&<div style={{display:"flex",gap:8,marginBottom:12}}><div style={{width:26,height:26,borderRadius:8,background:"#1d1d1f",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Mark size={12} color="#fff"/></div><div style={{padding:"12px 14px",background:"#fff",borderRadius:"4px 16px 16px 16px",boxShadow:"0 1px 6px rgba(0,0,0,.07)",display:"flex",gap:4,alignItems:"center"}}>{[0,.2,.4].map((d,i)=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:"#aeaeb2",animation:`blink 1.2s ${d}s infinite`}}/>)}</div></div>}
                      {messages.length>0&&!chatBusy&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:6}}>{QUICK.slice(0,3).map((q,i)=><button key={i} onClick={()=>q.endsWith(":")?( setInput(q+" "),inputRef.current?.focus()):send(q)} style={{background:"#fff",border:".5px solid rgba(0,0,0,.1)",borderRadius:20,fontFamily:HN,fontSize:12,color:"#6e6e73",padding:"5px 12px"}}>{q}</button>)}</div>}
                      <div ref={bottomRef}/>
                    </div>
                  </div>
                  <div style={{flexShrink:0,padding:"8px 14px 12px",borderTop:".5px solid rgba(0,0,0,.08)",background:"rgba(245,245,247,.95)",backdropFilter:"blur(20px)"}}>
                    <div style={{maxWidth:600,margin:"0 auto",display:"flex",alignItems:"flex-end",gap:8,background:"#fff",borderRadius:16,boxShadow:"0 2px 14px rgba(0,0,0,.1),0 0 0 .5px rgba(0,0,0,.08)",padding:"6px 6px 6px 14px"}}>
                      <textarea ref={inputRef} value={input} onChange={e=>{setInput(e.target.value);e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send(input);}}} disabled={!isReady} rows={1} placeholder={isReady?"Paste copy, ask anything, or request an image...":"Upload guidelines first"} style={{flex:1,border:"none",outline:"none",fontFamily:HN,fontSize:14,color:"#1d1d1f",resize:"none",background:"transparent",lineHeight:1.5,padding:"5px 0",maxHeight:120,overflowY:"auto"}}/>
                      <button onClick={()=>send(input)} disabled={!input.trim()||chatBusy||!isReady} style={{width:32,height:32,borderRadius:9,background:input.trim()&&!chatBusy&&isReady?"#1d1d1f":"#e5e5ea",border:"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .15s"}}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={input.trim()&&!chatBusy&&isReady?"#fff":"#aeaeb2"} strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {mode==="image"&&(
                <>
                  <div style={{flexShrink:0,background:"#fff",borderBottom:".5px solid rgba(0,0,0,.08)",padding:"10px 14px",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                    <input value={cPrompt} onChange={e=>setCPrompt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")genConcept();}} placeholder={isReady?"Describe a format — Twitter banner, Product Hunt...":"Upload guidelines first"} style={{flex:1,minWidth:150,border:".5px solid rgba(0,0,0,.1)",borderRadius:10,fontFamily:HN,fontSize:14,color:"#1d1d1f",padding:"10px 13px",outline:"none",background:"#fafafa"}}/>
                    <button onClick={genConcept} disabled={!cPrompt.trim()||cBusy} style={{background:cPrompt.trim()&&!cBusy?"#1d1d1f":"#f5f5f7",border:"none",borderRadius:10,fontFamily:HN,fontSize:13,fontWeight:500,color:cPrompt.trim()&&!cBusy?"#fff":"#aeaeb2",padding:"10px 18px",whiteSpace:"nowrap",transition:"all .15s",minWidth:90}}>{cBusy?"Generating...":"Generate"}</button>
                  </div>
                  <div style={{flexShrink:0,display:"flex",overflowX:"auto",padding:"8px 14px",gap:7,borderBottom:".5px solid rgba(0,0,0,.06)",background:"#fff",WebkitOverflowScrolling:"touch"}}>
                    {FMTS.map((s,i)=><button key={i} onClick={()=>setCPrompt(s)} style={{background:cPrompt===s?"#1d1d1f":"#f5f5f7",border:"none",borderRadius:20,fontFamily:HN,fontSize:12,color:cPrompt===s?"#fff":"#6e6e73",padding:"6px 13px",whiteSpace:"nowrap",flexShrink:0,transition:"all .15s"}}>{s}</button>)}
                  </div>
                  <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"14px"}}>
                    <div style={{maxWidth:560,margin:"0 auto"}}>
                      {concepts.length===0&&!cBusy&&<div style={{textAlign:"center",paddingTop:40}}><p style={{fontFamily:HN,fontSize:14,color:"#aeaeb2",marginBottom:6}}>No concepts yet.</p><p style={{fontFamily:HN,fontSize:13,color:"#d1d1d6"}}>Describe a format above to generate an on-brand brief.</p></div>}
                      {cBusy&&<div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center",paddingTop:40}}><div style={{width:16,height:16,border:"2px solid #e5e5ea",borderTopColor:"#1d1d1f",borderRadius:"50%",animation:"spin .7s linear infinite"}}/><span style={{fontFamily:HN,fontSize:14,color:"#aeaeb2"}}>Generating concept...</span></div>}
                      {concepts.map((c,i)=><ConceptCard key={i} c={c} idx={i} isPaid={isPaid} hasFalKey={!!falKey} imgLoading={imgLoading} onGen={genConceptImg} onUpgrade={()=>setPaywall({reason:"AI image generation on Series ($29/mo) and Scale ($79/mo)."})} onKey={()=>setShowSettings(true)}/>)}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {view==="team"&&(
            <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"18px 14px"}}>
              <div style={{maxWidth:480,margin:"0 auto"}}>
                <div style={{background:"#fff",borderRadius:14,boxShadow:"0 2px 10px rgba(0,0,0,.06),0 0 0 .5px rgba(0,0,0,.05)",padding:"14px",marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><p style={{fontFamily:HN,fontSize:13,fontWeight:600,color:"#1d1d1f",marginBottom:2}}>{cur.name} Plan</p><p style={{fontFamily:HN,fontSize:12,color:"#6e6e73"}}>{team.length}/{cur.team} teammates · {plan==="seed"?`${PLANS.seed.msgs-msgCount} msgs left`:"Unlimited"}</p></div>
                    {plan==="seed"&&<button onClick={()=>setPaywall({reason:"Upgrade for unlimited team access."})} style={{background:"#1d1d1f",border:"none",borderRadius:9,fontFamily:HN,fontSize:12,fontWeight:500,color:"#fff",padding:"7px 12px"}}>Upgrade</button>}
                  </div>
                </div>
                <div style={{background:"#fff",borderRadius:14,boxShadow:"0 2px 10px rgba(0,0,0,.06),0 0 0 .5px rgba(0,0,0,.05)",overflow:"hidden",marginBottom:10}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 70px 32px",padding:"8px 14px",borderBottom:".5px solid #f5f5f7"}}>{["Name","Role","Access",""].map((h,i)=><span key={i} style={{fontFamily:HN,fontSize:10,color:"#aeaeb2",textTransform:"uppercase",letterSpacing:".06em"}}>{h}</span>)}</div>
                  {team.map((m,i)=><div key={m.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 70px 32px",padding:"11px 14px",borderBottom:i<team.length-1?".5px solid #f5f5f7":"none",alignItems:"center"}}><span style={{fontFamily:HN,fontSize:13,color:"#1d1d1f",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</span><span style={{fontFamily:HN,fontSize:13,color:"#6e6e73",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.role}</span><span style={{fontFamily:HN,fontSize:11,color:"#aeaeb2"}}>{m.access}</span>{m.access!=="Admin"?<button onClick={()=>{setTeam(p=>p.filter(t=>t.id!==m.id));toast_("Removed");}} style={{background:"none",border:"none",fontFamily:HN,fontSize:13,color:"#aeaeb2",textAlign:"right",padding:4}}>✕</button>:<span/>}</div>)}
                </div>
                <div style={{background:"#fff",borderRadius:14,boxShadow:"0 2px 10px rgba(0,0,0,.06),0 0 0 .5px rgba(0,0,0,.05)",padding:"14px",marginBottom:10}}>
                  <p style={{fontFamily:HN,fontSize:13,fontWeight:600,color:"#1d1d1f",marginBottom:12}}>Add Teammate</p>
                  {plan==="seed"&&team.length>=PLANS.seed.team?<div style={{textAlign:"center",padding:"4px 0"}}><p style={{fontFamily:HN,fontSize:13,color:"#6e6e73",marginBottom:12}}>Team collaboration requires a paid plan.</p><button onClick={()=>setPaywall({reason:"Series ($29/mo) = 5 teammates. Scale ($79/mo) = 20."})} style={{background:"#1d1d1f",border:"none",borderRadius:10,fontFamily:HN,fontSize:13,fontWeight:500,color:"#fff",padding:"10px 20px"}}>Upgrade</button></div>
                  :<div style={{display:"flex",flexWrap:"wrap",gap:8}}><input value={newM.name} onChange={e=>setNewM(p=>({...p,name:e.target.value}))} placeholder="Name" onKeyDown={e=>{if(e.key==="Enter")addMember();}} style={{...IB,flex:"1 1 90px"}}/><input value={newM.role} onChange={e=>setNewM(p=>({...p,role:e.target.value}))} placeholder="Role" style={{...IB,flex:"1 1 90px"}}/><select value={newM.access} onChange={e=>setNewM(p=>({...p,access:e.target.value}))} style={{...IB,flex:"0 0 auto",width:"auto"}}><option>Editor</option><option>Viewer</option><option>Admin</option></select><button onClick={addMember} style={{background:"#1d1d1f",border:"none",borderRadius:10,fontFamily:HN,fontSize:13,fontWeight:500,color:"#fff",padding:"10px 14px",whiteSpace:"nowrap"}}>Add</button></div>}
                </div>
                <div style={{background:"#fff",borderRadius:14,boxShadow:"0 2px 10px rgba(0,0,0,.06),0 0 0 .5px rgba(0,0,0,.05)",padding:"14px"}}>
                  <p style={{fontFamily:HN,fontSize:13,fontWeight:600,color:"#1d1d1f",marginBottom:3}}>Team Brand Notes</p>
                  <p style={{fontFamily:HN,fontSize:12,color:"#aeaeb2",marginBottom:10,lineHeight:1.6}}>Shared context passed to your brand steward across all sessions.</p>
                  <textarea value={teamNote} onChange={e=>setTeamNote(e.target.value)} rows={4} placeholder="e.g. Q3 launch in progress. Avoid old tagline." style={{...IB,resize:"vertical",lineHeight:1.65}}/>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{flexShrink:0,height:36,borderTop:".5px solid rgba(0,0,0,.08)",padding:"0 16px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(245,245,247,.9)"}}>
          <span style={{fontFamily:HN,fontSize:10,color:"#aeaeb2"}}>© Marque 2026 · hello@marque.ai</span>
          <Logo h={11} color="#aeaeb2"/>
        </div>
      </div>
    </>
  );
}
