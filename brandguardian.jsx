import { useState, useRef, useEffect } from "react";

const HN = "-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif";

const Mark = ({ size=20, color="#1d1d1f" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="16" y="2" width="20" height="20" rx="2" transform="rotate(45 16 2)" fill={color} opacity="0.15"/>
    <rect x="16" y="6" width="13" height="13" rx="1.5" transform="rotate(45 16 6)" fill={color}/>
  </svg>
);

const Logo = ({ h=17, color="#1d1d1f", onClick }) => (
  <div onClick={onClick} style={{display:"flex",alignItems:"center",gap:7,flexShrink:0,cursor:onClick?"pointer":"default"}}>
    <Mark size={h} color={color}/>
    <span style={{fontFamily:HN,fontSize:h*.8,fontWeight:600,color,letterSpacing:"-.02em",lineHeight:1}}>marque</span>
  </div>
);

// Storage
const SK="mq13";
const save=d=>{try{localStorage.setItem(SK,JSON.stringify(d));}catch{}};
const load=()=>{try{const r=localStorage.getItem(SK);return r?JSON.parse(r):null;}catch{return null;}};
const nuke=()=>{try{localStorage.removeItem(SK);}catch{}};

// --- Brand DNA Schema ---
const EMPTY_DNA={
  summary:"",audience:"",category:"",positioning:"",
  emotionalTerritory:"",competitivePosture:"",
  voicePrinciples:"",toneSliders:"",approvedVocabulary:"",bannedPhrases:"",
  visualPrinciples:"",typography:"",colorBehavior:"",compositionBehavior:"",
  imageDirection:"",motionPersonality:"",brandBehaviors:"",examples:""
};

const DNA_META=[
  ["summary","Brand Summary","One-paragraph essence"],
  ["audience","Audience","Who they are, fears, desires"],
  ["category","Category","Industry and market context"],
  ["positioning","Positioning","How the brand stands apart"],
  ["emotionalTerritory","Emotional Territory","The feeling the brand owns"],
  ["competitivePosture","Competitive Posture","Distinct from alternatives"],
  ["voicePrinciples","Voice Principles","Tone, sentence style, energy"],
  ["toneSliders","Tone Sliders","e.g. Formal 30% / Casual 70%"],
  ["approvedVocabulary","Approved Vocabulary","Words and phrases to use"],
  ["bannedPhrases","Banned Phrases","Clichés and words to avoid"],
  ["visualPrinciples","Visual Principles","Design philosophy"],
  ["typography","Typography","Typefaces, weights, hierarchy"],
  ["colorBehavior","Color Behavior","Palette, ratios, rules"],
  ["compositionBehavior","Composition","Grid, white space, density"],
  ["imageDirection","Image Direction","Photo and illustration style"],
  ["motionPersonality","Motion Personality","Animation feel, easing"],
  ["brandBehaviors","Brand Behaviors","How the brand acts across touchpoints"],
  ["examples","Reference Examples","Benchmarks, aspirational brands"],
];

const DNA_GROUPS=[
  {label:"Strategy",keys:["summary","audience","category","positioning","emotionalTerritory","competitivePosture"]},
  {label:"Voice",keys:["voicePrinciples","toneSliders","approvedVocabulary","bannedPhrases"]},
  {label:"Visual",keys:["visualPrinciples","typography","colorBehavior","compositionBehavior","imageDirection","motionPersonality"]},
  {label:"Behavior",keys:["brandBehaviors","examples"]},
];

const conf=v=>(!v||v.trim().length<10)?"missing":v.trim().length<60?"review":"strong";
const CC={strong:"#34c759",review:"#ff9f0a",missing:"#ff3b30"};

// --- PDF Utilities ---
async function pdfToText(buf) {
  return new Promise(res=>{
    const run=async()=>{
      try{
        const lib=window["pdfjs-dist/build/pdf"];
        lib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const pdf=await lib.getDocument({data:buf}).promise;
        let out="";
        for(let i=1;i<=Math.min(pdf.numPages,40);i++){
          const pg=await pdf.getPage(i);
          const ct=await pg.getTextContent();
          out+=ct.items.map(x=>x.str).join(" ")+"\n";
        }
        res(out.replace(/\s+/g," ").trim()||"");
      }catch{res("");}
    };
    if(window["pdfjs-dist/build/pdf"]){run();return;}
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload=run;s.onerror=()=>res("");
    document.head.appendChild(s);
  });
}

async function pdfToPages(buf,max=60) {
  return new Promise(res=>{
    const run=async()=>{
      try{
        const lib=window["pdfjs-dist/build/pdf"];
        lib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const pdf=await lib.getDocument({data:buf}).promise;
        const pages=[];
        for(let i=1;i<=Math.min(pdf.numPages,max);i++){
          const pg=await pdf.getPage(i);
          const vp=pg.getViewport({scale:1.5});
          const cv=document.createElement("canvas");
          cv.width=vp.width;cv.height=vp.height;
          await pg.render({canvasContext:cv.getContext("2d"),viewport:vp}).promise;
          pages.push({url:cv.toDataURL("image/jpeg",.82),num:i,total:pdf.numPages});
        }
        res(pages);
      }catch{res([]);}
    };
    if(window["pdfjs-dist/build/pdf"]){run();return;}
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload=run;s.onerror=()=>res([]);
    document.head.appendChild(s);
  });
}

async function generateImage(prompt) {
  const seed=Math.floor(Math.random()*9999999);
  const url=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=896&height=504&nologo=true&seed=${seed}&model=turbo`;
  await new Promise((res,rej)=>{
    const img=new Image();
    img.onload=res;
    img.onerror=()=>rej(new Error("Image generation failed — try again"));
    img.src=url;
  });
  return url;
}

// Plans
const PLANS={
  seed:  {name:"Seed",  price:0,  team:1,  msgs:50,  imgs:3,   concepts:3,   sharable:false},
  series:{name:"Series",price:29, team:5,  msgs:1e9, imgs:30,  concepts:1e9, sharable:true},
  scale: {name:"Scale", price:79, team:20, msgs:1e9, imgs:100, concepts:1e9, sharable:true},
};

// --- Primitive UI ---
function Pulse({on}) {
  if(!on)return null;
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      {[0,.12,.24].map((d,i)=>(
        <div key={i} style={{position:"absolute",width:48,height:48,borderRadius:"50%",border:`1px solid rgba(29,29,31,${.18-i*.04})`,animation:`radPulse .9s cubic-bezier(0,0,.15,1) ${d}s forwards`}}/>
      ))}
    </div>
  );
}

function Toast({msg,on}) {
  return <div style={{position:"fixed",bottom:28,left:"50%",transform:on?"translateX(-50%) translateY(0)":"translateX(-50%) translateY(10px)",background:"#1d1d1f",color:"#fff",fontFamily:HN,fontSize:13,fontWeight:500,padding:"10px 18px",borderRadius:12,boxShadow:"0 8px 28px rgba(0,0,0,.25)",zIndex:9000,pointerEvents:"none",opacity:on?1:0,transition:"all .3s cubic-bezier(.34,1.56,.64,1)"}}>{msg}</div>;
}

function Sheet({children,onClose}) {
  useEffect(()=>{
    const h=e=>{if(e.key==="Escape")onClose();};
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[onClose]);
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.5)",backdropFilter:"blur(10px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",maxWidth:540,width:"100%",maxHeight:"88dvh",overflowY:"auto",animation:"sUp .28s cubic-bezier(.34,1.56,.64,1)"}}>
        <div style={{width:36,height:4,borderRadius:2,background:"#e5e5ea",margin:"10px auto 0"}}/>
        <div style={{padding:"16px 20px 32px"}}>{children}</div>
      </div>
    </div>
  );
}

function Paywall({reason,onClose,onUp}) {
  return(
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
            <div style={{fontFamily:HN,fontSize:11,color:"#6e6e73",lineHeight:1.7}}>{p.team} teammates<br/>Unlimited messages<br/>{p.imgs>0?`${p.imgs} AI images/mo`:"No AI images"}</div>
          </div>
        ))}
      </div>
      <button onClick={onClose} style={{width:"100%",background:"none",border:"none",fontFamily:HN,fontSize:14,color:"#aeaeb2",cursor:"pointer",padding:"6px 0"}}>Not now</button>
    </Sheet>
  );
}

function EmailSheet({onDone,onSkip}) {
  const [email,setEmail]=useState("");const [sent,setSent]=useState(false);
  const sub=async()=>{
    if(!email.includes("@"))return;
    try{await fetch("https://formsubmit.co/ajax/hello@marque.ai",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({email})});}catch{}
    setSent(true);setTimeout(()=>onDone(email),1200);
  };
  return(
    <Sheet onClose={onSkip}>
      <div style={{textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><Mark size={36} color="#1d1d1f"/></div>
        {sent?(<><h2 style={{fontFamily:HN,fontSize:19,fontWeight:700,color:"#1d1d1f",marginBottom:6}}>You're in ✓</h2><p style={{fontFamily:HN,fontSize:14,color:"#6e6e73"}}>Loading workspace...</p></>):(
          <>
            <h2 style={{fontFamily:HN,fontSize:19,fontWeight:700,color:"#1d1d1f",marginBottom:6}}>Start with Marque</h2>
            <p style={{fontFamily:HN,fontSize:13,color:"#6e6e73",lineHeight:1.6,marginBottom:20}}>Save your brand and get early access updates.</p>
            <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sub();}} placeholder="you@startup.com" type="email" inputMode="email" style={{width:"100%",border:"1px solid #e5e5ea",borderRadius:12,fontFamily:HN,fontSize:16,color:"#1d1d1f",padding:"13px",outline:"none",marginBottom:10,background:"#fafafa"}}/>
            <button onClick={sub} disabled={!email.includes("@")} style={{width:"100%",background:email.includes("@")?"#1d1d1f":"#e5e5ea",border:"none",borderRadius:12,fontFamily:HN,fontSize:15,fontWeight:500,color:email.includes("@")?"#fff":"#aeaeb2",padding:"14px",cursor:email.includes("@")?"pointer":"not-allowed",marginBottom:10}}>Get started free →</button>
            <button onClick={onSkip} style={{background:"none",border:"none",fontFamily:HN,fontSize:13,color:"#aeaeb2",cursor:"pointer"}}>Skip for now</button>
          </>
        )}
      </div>
    </Sheet>
  );
}

function ShareSheet({brandName,pages,onClose,onPreview}) {
  const slug=brandName.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const url=`marque.ai/${slug}`;
  const [copied,setCopied]=useState(false);
  const copy=()=>{navigator.clipboard?.writeText(`https://${url}`).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2000);};
  return(
    <Sheet onClose={onClose}>
      <h2 style={{fontFamily:HN,fontSize:17,fontWeight:700,color:"#1d1d1f",marginBottom:4}}>Share Brand Guide</h2>
      <p style={{fontFamily:HN,fontSize:13,color:"#6e6e73",lineHeight:1.6,marginBottom:20}}>Anyone with this link can view your brand guide — no account required.</p>
      <div style={{display:"flex",alignItems:"center",gap:8,background:"#f5f5f7",borderRadius:12,padding:"12px 14px",marginBottom:10}}>
        <span style={{fontFamily:HN,fontSize:13,color:"#1d1d1f",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</span>
        <button onClick={copy} style={{background:copied?"#34c759":"#1d1d1f",border:"none",borderRadius:8,fontFamily:HN,fontSize:12,fontWeight:500,color:"#fff",padding:"7px 13px",cursor:"pointer",flexShrink:0,transition:"background .2s",whiteSpace:"nowrap"}}>{copied?"Copied ✓":"Copy link"}</button>
      </div>
      <p style={{fontFamily:HN,fontSize:11,color:"#aeaeb2",marginBottom:20,lineHeight:1.6}}>Read-only · No login · Vertical scroll layout</p>
      {pages.length>0&&<button onClick={onPreview} style={{width:"100%",background:"none",border:"1px solid #e5e5ea",borderRadius:12,fontFamily:HN,fontSize:14,color:"#1d1d1f",padding:"13px",cursor:"pointer"}}>Preview share view →</button>}
    </Sheet>
  );
}

function SharedGuideView({brandName,pages,dna,logoUrl,fontName,onBack}) {
  const slug=brandName.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const hasDna=DNA_META.some(([k])=>dna?.[k]?.trim());
  return(
    <div style={{position:"fixed",inset:0,zIndex:3000,background:"#f5f5f7",overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>
        {/* Sticky header */}
        <div style={{position:"sticky",top:0,background:"rgba(245,245,247,.97)",backdropFilter:"blur(20px)",borderBottom:".5px solid rgba(0,0,0,.1)",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:1}}>
          <div>
            <p style={{fontFamily:HN,fontSize:10,color:"#aeaeb2",letterSpacing:".04em",textTransform:"uppercase",marginBottom:2}}>marque.ai/{slug}</p>
            <p style={{fontFamily:HN,fontSize:15,fontWeight:600,color:"#1d1d1f"}}>{brandName} Brand Guide</p>
          </div>
          <button onClick={onBack} style={{background:"#fff",border:".5px solid rgba(0,0,0,.12)",borderRadius:8,fontFamily:HN,fontSize:12,color:"#6e6e73",padding:"7px 13px",cursor:"pointer"}}>← Back</button>
        </div>

        <div style={{padding:"24px 20px 60px"}}>
          {/* Brand identity header */}
          <div style={{background:"#1d1d1f",borderRadius:16,padding:"24px",marginBottom:16,display:"flex",alignItems:"center",gap:16}}>
            {logoUrl&&<div style={{width:56,height:56,borderRadius:12,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}><img src={logoUrl} alt="" style={{width:"100%",height:"100%",objectFit:"contain",padding:6}}/></div>}
            <div>
              <h1 style={{fontFamily:HN,fontSize:22,fontWeight:700,color:"#fff",letterSpacing:"-.03em",marginBottom:4}}>{brandName}</h1>
              {fontName&&<p style={{fontFamily:HN,fontSize:12,color:"rgba(255,255,255,.4)"}}>Brand font: {fontName}</p>}
              {dna?.summary&&<p style={{fontFamily:HN,fontSize:13,color:"rgba(255,255,255,.6)",lineHeight:1.6,marginTop:6,maxWidth:420}}>{dna.summary}</p>}
            </div>
          </div>

          {/* DNA sections */}
          {hasDna&&(
            <div style={{marginBottom:16}}>
              {[
                {heading:"Strategy",keys:["audience","category","positioning","emotionalTerritory","competitivePosture"]},
                {heading:"Voice & Language",keys:["voicePrinciples","toneSliders","approvedVocabulary","bannedPhrases"]},
                {heading:"Visual Identity",keys:["visualPrinciples","typography","colorBehavior","compositionBehavior","imageDirection","motionPersonality"]},
                {heading:"Brand Behavior",keys:["brandBehaviors","examples"]},
              ].map(({heading,keys})=>{
                const fields=DNA_META.filter(([k])=>keys.includes(k)&&dna?.[k]?.trim());
                if(!fields.length)return null;
                return(
                  <div key={heading} style={{background:"#fff",borderRadius:14,padding:"18px",marginBottom:10,boxShadow:"0 1px 8px rgba(0,0,0,.05),0 0 0 .5px rgba(0,0,0,.05)"}}>
                    <p style={{fontFamily:HN,fontSize:10,fontWeight:600,color:"#aeaeb2",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>{heading}</p>
                    {fields.map(([k,label])=>(
                      <div key={k} style={{marginBottom:12,paddingBottom:12,borderBottom:".5px solid #f5f5f7"}}>
                        <p style={{fontFamily:HN,fontSize:10,fontWeight:600,color:"#6e6e73",textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>{label}</p>
                        <p style={{fontFamily:HN,fontSize:13,color:"#1d1d1f",lineHeight:1.7}}>{dna[k]}</p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* PDF pages */}
          {pages.length>0&&(
            <div style={{marginBottom:16}}>
              <p style={{fontFamily:HN,fontSize:10,fontWeight:600,color:"#aeaeb2",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Source Document</p>
              {pages.map((p,i)=>(
                <div key={i} style={{marginBottom:8,borderRadius:12,overflow:"hidden",boxShadow:"0 2px 16px rgba(0,0,0,.09)"}}>
                  <img src={p.url} alt={`Page ${p.num}`} style={{width:"100%",display:"block"}}/>
                </div>
              ))}
            </div>
          )}

          <div style={{textAlign:"center",paddingTop:16}}><Logo h={13} color="#d1d1d6"/></div>
        </div>
      </div>
    </div>
  );
}

// --- DNA Components ---
function ConfDot({val}) {
  const c=conf(val);
  const labels={strong:"Strong",review:"Needs review",missing:"Missing"};
  return <div title={labels[c]} style={{width:7,height:7,borderRadius:"50%",background:CC[c],flexShrink:0,transition:"background .3s"}}/>;
}

function DNAField({k,label,hint,value,onChange}) {
  return(
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
        <ConfDot val={value}/>
        <span style={{fontFamily:HN,fontSize:12,fontWeight:600,color:"#1d1d1f"}}>{label}</span>
        <span style={{fontFamily:HN,fontSize:10,color:"#d1d1d6",marginLeft:4}}>{hint}</span>
      </div>
      <textarea
        value={value}
        onChange={e=>onChange(k,e.target.value)}
        rows={2}
        placeholder={hint}
        style={{width:"100%",border:".5px solid rgba(0,0,0,.1)",borderRadius:8,fontFamily:HN,fontSize:13,color:"#1d1d1f",padding:"8px 10px",outline:"none",resize:"vertical",lineHeight:1.6,background:"#fafafa",transition:"border-color .15s,background .15s"}}
        onFocus={e=>{e.target.style.borderColor="rgba(0,0,0,.28)";e.target.style.background="#fff";}}
        onBlur={e=>{e.target.style.borderColor="rgba(0,0,0,.1)";e.target.style.background="#fafafa";}}
      />
    </div>
  );
}

function DNAEditor({dna,onChange,brandName,logoUrl,fontName,extracting,onReExtract}) {
  const [activeGroup,setActiveGroup]=useState("Strategy");
  const strong=DNA_META.filter(([k])=>conf(dna[k])==="strong").length;
  const review=DNA_META.filter(([k])=>conf(dna[k])==="review").length;
  const pct=Math.round(((strong+review*.5)/DNA_META.length)*100);
  const curKeys=DNA_GROUPS.find(g=>g.label===activeGroup)?.keys||[];
  const curMeta=DNA_META.filter(([k])=>curKeys.includes(k));

  return(
    <div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        {logoUrl&&(
          <div style={{width:40,height:40,borderRadius:9,background:"#f5f5f7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
            <img src={logoUrl} alt="" style={{width:"100%",height:"100%",objectFit:"contain",padding:4}}/>
          </div>
        )}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
            <span style={{fontFamily:HN,fontSize:14,fontWeight:700,color:"#1d1d1f",letterSpacing:"-.02em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{brandName} DNA</span>
            {fontName&&<span style={{fontFamily:HN,fontSize:10,color:"#aeaeb2",background:"#f5f5f7",borderRadius:5,padding:"2px 6px",flexShrink:0}}>{fontName}</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{height:3,width:80,background:"#f0f0f0",borderRadius:2}}>
              <div style={{height:"100%",width:`${pct}%`,background:pct>66?"#34c759":pct>33?"#ff9f0a":"#ff3b30",borderRadius:2,transition:"width .4s"}}/>
            </div>
            <span style={{fontFamily:HN,fontSize:10,color:"#aeaeb2"}}>{pct}% complete</span>
          </div>
        </div>
        {extracting?(
          <div style={{width:16,height:16,border:"2px solid #e5e5ea",borderTopColor:"#1d1d1f",borderRadius:"50%",animation:"spin .7s linear infinite",flexShrink:0}}/>
        ):(
          <button onClick={onReExtract} style={{background:"none",border:".5px solid rgba(0,0,0,.14)",borderRadius:7,fontFamily:HN,fontSize:10,color:"#6e6e73",padding:"4px 8px",cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>Re-extract</button>
        )}
      </div>

      {/* Legend */}
      <div style={{display:"flex",gap:12,marginBottom:12}}>
        {[["strong","Strong"],["review","Needs review"],["missing","Missing"]].map(([c,l])=>(
          <div key={c} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:CC[c]}}/>
            <span style={{fontFamily:HN,fontSize:10,color:"#6e6e73"}}>{l}</span>
          </div>
        ))}
      </div>

      {/* Group tabs */}
      <div style={{display:"flex",gap:2,background:"#f5f5f7",borderRadius:10,padding:3,marginBottom:16}}>
        {DNA_GROUPS.map(g=>{
          const gMeta=DNA_META.filter(([k])=>g.keys.includes(k));
          const gStrong=gMeta.filter(([k])=>conf(dna[k])==="strong").length;
          const gPct=Math.round((gStrong/gMeta.length)*100);
          return(
            <button key={g.label} onClick={()=>setActiveGroup(g.label)} style={{flex:1,padding:"5px 2px",borderRadius:8,border:"none",background:activeGroup===g.label?"#fff":"transparent",fontFamily:HN,fontSize:11,color:activeGroup===g.label?"#1d1d1f":"#6e6e73",fontWeight:activeGroup===g.label?500:400,boxShadow:activeGroup===g.label?"0 1px 4px rgba(0,0,0,.08)":"none",cursor:"pointer",transition:"all .15s"}}>
              <div>{g.label}</div>
              <div style={{fontFamily:HN,fontSize:9,color:gPct===100?"#34c759":gPct>50?"#ff9f0a":"#ff3b30",marginTop:1}}>{gPct}%</div>
            </button>
          );
        })}
      </div>

      {/* Fields */}
      {curMeta.map(([k,label,hint])=>(
        <DNAField key={k} k={k} label={label} hint={hint} value={dna[k]} onChange={onChange}/>
      ))}
    </div>
  );
}

// --- Chat UI ---
function Bubble({m,onLoad}) {
  const text=(m.content||"").replace(/\[IMG:[^\]]*\]/g,"").trim();
  return(
    <div style={{display:"flex",flexDirection:m.role==="user"?"row-reverse":"row",gap:8,marginBottom:12,animation:"sUp .2s ease both"}}>
      {m.role==="assistant"&&<div style={{width:26,height:26,borderRadius:8,background:"#1d1d1f",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><Mark size={12} color="#fff"/></div>}
      <div style={{maxWidth:"82%",display:"flex",flexDirection:"column",gap:7,alignItems:m.role==="user"?"flex-end":"flex-start"}}>
        {text&&(
          <div style={{padding:"10px 14px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"4px 16px 16px 16px",background:m.role==="user"?"#1d1d1f":"#fff",boxShadow:m.role==="assistant"?"0 1px 6px rgba(0,0,0,.07),0 0 0 .5px rgba(0,0,0,.05)":"none",fontFamily:HN,fontSize:14,lineHeight:1.7,color:m.role==="user"?"#fff":"#1d1d1f"}}>
            {text.split("\n").filter(Boolean).map((l,j,a)=><p key={j} style={{marginBottom:j<a.length-1?5:0}}>{l}</p>)}
          </div>
        )}
        {m.genImg&&(
          <div style={{borderRadius:12,background:"#f0f0f5",width:"min(280px,75vw)",height:140,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
            <div style={{width:18,height:18,border:"2.5px solid #e5e5ea",borderTopColor:"#1d1d1f",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
            <span style={{fontFamily:HN,fontSize:12,color:"#aeaeb2"}}>Generating image...</span>
          </div>
        )}
        {m.imageUrl&&(
          <div style={{borderRadius:12,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,.15)",maxWidth:"min(360px,82vw)"}}>
            <img src={m.imageUrl} alt="" style={{width:"100%",display:"block"}} onLoad={onLoad}/>
            <div style={{padding:"7px 12px",background:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:HN,fontSize:10,color:"#aeaeb2"}}>FLUX · Pollinations</span>
              <a href={m.imageUrl} download="marque.jpg" target="_blank" rel="noreferrer" style={{fontFamily:HN,fontSize:11,color:"#007aff",textDecoration:"none"}}>Download</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBar({label,used,total,locked}) {
  const inf=total>=1e9;
  const pct=inf||locked?0:Math.min((used/total)*100,100);
  const warn=!inf&&!locked&&pct>=80;
  const rem=locked?"—":inf?"∞":Math.max(0,total-used);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:2,minWidth:40}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6}}>
        <span style={{fontFamily:HN,fontSize:9,color:"#aeaeb2",textTransform:"uppercase",letterSpacing:".05em",whiteSpace:"nowrap"}}>{label}</span>
        <span style={{fontFamily:HN,fontSize:9,color:warn?"#ff3b30":"#aeaeb2",fontWeight:warn?600:400,minWidth:14,textAlign:"right"}}>{rem}</span>
      </div>
      <div style={{height:2,background:"#f0f0f0",borderRadius:2}}>
        {!inf&&!locked&&<div style={{height:"100%",width:`${pct}%`,background:warn?"#ff3b30":"#1d1d1f",borderRadius:2,transition:"width .4s"}}/>}
        {(inf||locked)&&<div style={{height:"100%",width:"100%",background:inf?"#34c759":"#e5e5ea",borderRadius:2}}/>}
      </div>
    </div>
  );
}

function PDFPreview({pages,rendering}) {
  if(rendering)return(
    <div style={{background:"#1d1d1f",borderRadius:14,height:160,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
      <div style={{width:18,height:18,border:"2.5px solid rgba(255,255,255,.2)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
      <span style={{fontFamily:HN,fontSize:12,color:"rgba(255,255,255,.5)"}}>Rendering pages...</span>
    </div>
  );
  if(!pages.length)return null;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {pages.map((p,i)=>(
        <div key={i} style={{borderRadius:10,overflow:"hidden",boxShadow:"0 2px 14px rgba(0,0,0,.1)"}}>
          <img src={p.url} alt={`Page ${p.num}`} style={{width:"100%",display:"block"}}/>
        </div>
      ))}
    </div>
  );
}

function ConceptCard({c,idx,isPaid,imgLoading,onGen,onUpgrade}) {
  const [cp,setCp]=useState(false);
  return(
    <div style={{borderRadius:14,overflow:"hidden",background:"#fff",boxShadow:"0 2px 14px rgba(0,0,0,.08),0 0 0 .5px rgba(0,0,0,.05)",marginBottom:14,animation:`sUp .35s cubic-bezier(.34,1.56,.64,1) ${idx*.05}s both`}}>
      {c.imageUrl?(
        <div style={{position:"relative"}}>
          <img src={c.imageUrl} alt="" style={{width:"100%",display:"block",maxHeight:220,objectFit:"cover"}}/>
          <a href={c.imageUrl} download="marque.jpg" target="_blank" rel="noreferrer" style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,.5)",backdropFilter:"blur(8px)",borderRadius:8,fontFamily:HN,fontSize:11,color:"#fff",padding:"5px 10px",textDecoration:"none"}}>Download</a>
          <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,.7))",padding:"20px 16px 12px"}}><p style={{fontFamily:HN,fontSize:"clamp(14px,3vw,20px)",fontWeight:700,color:"#fff",lineHeight:1.1,letterSpacing:"-.02em"}}>{c.headline}</p></div>
        </div>
      ):c.generating?(
        <div style={{background:c.background||"#1d1d1f",height:160,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
          <div style={{width:18,height:18,border:"2.5px solid rgba(255,255,255,.2)",borderTopColor:"rgba(255,255,255,.8)",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
          <span style={{fontFamily:HN,fontSize:12,color:"rgba(255,255,255,.6)"}}>Generating...</span>
        </div>
      ):(
        <div style={{background:c.background||"#1d1d1f",minHeight:160,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"28px 20px",position:"relative"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:c.accentColor||"#000"}}/>
          <p style={{fontFamily:HN,fontSize:"clamp(14px,4vw,24px)",fontWeight:700,color:c.textColor||"#fff",textAlign:"center",lineHeight:1.1,letterSpacing:"-.02em",marginBottom:6,maxWidth:300}}>{c.headline}</p>
          {c.subtext&&<p style={{fontFamily:HN,fontSize:10,color:c.textColor||"#fff",opacity:.5,letterSpacing:".1em",textTransform:"uppercase",textAlign:"center"}}>{c.subtext}</p>}
          <div style={{position:"absolute",bottom:10,right:10}}>
            <button onClick={()=>onGen(idx)} disabled={imgLoading===idx} style={{background:"rgba(255,255,255,.15)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.3)",borderRadius:8,fontFamily:HN,fontSize:11,fontWeight:500,color:"#fff",padding:"6px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,opacity:imgLoading===idx?.4:1}}>
              {imgLoading===idx?<><div style={{width:9,height:9,border:"1.5px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Generating...</>:"Generate image"}
            </button>
          </div>
        </div>
      )}
      <div style={{padding:"10px 14px",display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:".5px solid #f5f5f7",gap:10}}>
        <div><div style={{fontFamily:HN,fontSize:9,color:"#aeaeb2",letterSpacing:".06em",textTransform:"uppercase",marginBottom:2}}>Format</div><div style={{fontFamily:HN,fontSize:11,color:"#1d1d1f"}}>{c.format}</div></div>
        <div><div style={{fontFamily:HN,fontSize:9,color:"#aeaeb2",letterSpacing:".06em",textTransform:"uppercase",marginBottom:2}}>Mood</div><div style={{fontFamily:HN,fontSize:11,color:"#1d1d1f"}}>{c.mood}</div></div>
      </div>
      <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
        <p style={{fontFamily:HN,fontSize:12,color:"#6e6e73",lineHeight:1.65,flex:1,margin:0}}><span style={{color:"#aeaeb2",marginRight:4}}>Direction —</span>{c.artDirectionNotes}</p>
        <button onClick={()=>{navigator.clipboard?.writeText(`${c.format}\n"${c.headline}"\nBG:${c.background} Accent:${c.accentColor}\n${c.artDirectionNotes}`);setCp(true);setTimeout(()=>setCp(false),2000);}} style={{background:cp?"#34c759":"#f5f5f7",border:"none",borderRadius:8,fontFamily:HN,fontSize:11,color:cp?"#fff":"#6e6e73",padding:"5px 10px",cursor:"pointer",flexShrink:0,transition:"all .2s",whiteSpace:"nowrap"}}>{cp?"Copied ✓":"Copy"}</button>
      </div>
    </div>
  );
}

// Studio chat actions
const ACTIONS=[
  {id:"critique",label:"Critique",hint:"Paste copy or describe a visual",sys:"Critique this against the brand DNA. Structure your response:\n1. VERDICT (on-brand / off-brand / mixed)\n2. What works — cite specific DNA fields\n3. What fails — cite specific DNA fields and explain WHY\n4. Improved version\nBe specific, not generic."},
  {id:"generate",label:"Generate",hint:"Describe what you need",sys:"Generate on-brand content as requested. Ground every choice in the DNA:\n- Voice and tone must match voicePrinciples\n- Use approved vocabulary, avoid banned phrases\n- Include visual direction aligned to visualPrinciples\nEnd with: 'DNA grounding: [list DNA fields that informed this]'"},
  {id:"drift",label:"Detect Drift",hint:"Paste content to check for drift",sys:"Detect brand drift in this content. Structure:\n1. ALIGNMENT SCORE (0–100%)\n2. Drifts detected — for each: what drifted, which DNA field it violates, why it matters\n3. On-brand alternative\nBe rigorous and precise."},
  {id:"improve",label:"Improve",hint:"Paste content to improve",sys:"Improve this to better align with brand DNA. Structure:\n1. ORIGINAL (quote problematic parts)\n2. IMPROVED VERSION\n3. CHANGES MADE — for each change, cite the DNA field that guided it\nMake every edit defensible."},
];

// --- Main ---
export default function Marque() {
  const [view,setView]=useState("brand");
  const [mode,setMode]=useState("text");
  const [brandText,setBrandText]=useState("");
  const [brandName,setBrandName]=useState("");
  const [brandDna,setBrandDna]=useState(EMPTY_DNA);
  const [logoUrl,setLogoUrl]=useState(null);
  const [fontName,setFontName]=useState("");
  const [goodEx,setGoodEx]=useState([]);
  const [badEx,setBadEx]=useState([]);
  const [action,setAction]=useState("critique");
  const [extracting,setExtracting]=useState(false);
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
  const [showShare,setShowShare]=useState(false);
  const [sharePreview,setSharePreview]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const [pulse,setPulse]=useState(false);
  const [toast,setToast]=useState({msg:"",on:false});
  const [dragging,setDragging]=useState(false);
  const [hasEmail,setHasEmail]=useState(false);
  const [isDesktop,setIsDesktop]=useState(()=>typeof window!=="undefined"?window.innerWidth>=1024:false);
  const [showExamples,setShowExamples]=useState(false);
  const [exInput,setExInput]=useState("");
  const [exType,setExType]=useState("good");
  const [dnaError,setDnaError]=useState("");

  const bottomRef=useRef();const inputRef=useRef();const fileRef=useRef();const logoRef=useRef();
  const cur=PLANS[plan];
  const isReady=status==="ready";
  const isPaid=plan==="series"||plan==="scale";

  useEffect(()=>{
    const h=()=>setIsDesktop(window.innerWidth>=1024);
    window.addEventListener("resize",h,{passive:true});
    return()=>window.removeEventListener("resize",h);
  },[]);
  useEffect(()=>{if(isDesktop)setMenuOpen(false);},[isDesktop]);

  useEffect(()=>{
    const s=load();
    if(s?.brandText&&s?.brandName){
      setBrandText(s.brandText);setBrandName(s.brandName);setStatus("ready");
      if(s.brandDna)setBrandDna({...EMPTY_DNA,...s.brandDna});
      if(s.fontName)setFontName(s.fontName);
      if(s.logoUrl)setLogoUrl(s.logoUrl);
      if(s.goodEx)setGoodEx(s.goodEx);
      if(s.badEx)setBadEx(s.badEx);
      if(s.messages?.length)setMessages(s.messages.map(m=>({...m,genImg:false})));
      if(s.teamNote)setTeamNote(s.teamNote);
      if(s.hasEmail)setHasEmail(true);
      toast_(`${s.brandName} restored`);
    }
  },[]);

  useEffect(()=>{
    if(brandText&&brandName){
      save({brandText,brandName,brandDna,fontName,logoUrl,goodEx,badEx,messages:messages.slice(-20),teamNote,hasEmail});
    }
  },[brandText,brandName,brandDna,fontName,logoUrl,goodEx,badEx,messages,teamNote,hasEmail]);

  const toast_=msg=>{setToast({msg,on:true});setTimeout(()=>setToast(t=>({...t,on:false})),2400);};
  const pop=()=>{setPulse(true);setTimeout(()=>setPulse(false),1400);};
  const scrollB=()=>setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),80);

  const callAPI=async(userContent,maxTokens=2000)=>{
    const resp=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
      body:JSON.stringify({model:"claude-haiku-4-5",max_tokens:maxTokens,messages:[{role:"user",content:userContent}]}),
    });
    if(!resp.ok){const t=await resp.text();throw new Error(`API ${resp.status}: ${t.slice(0,200)}`);}
    const data=await resp.json();
    if(data.error)throw new Error(data.error.message||JSON.stringify(data.error));
    const text=(data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
    if(!text)throw new Error("Empty response");
    return text;
  };

  const callAPIChat=async(msgs,system)=>{
    const body={model:"claude-haiku-4-5",max_tokens:1400,messages:msgs};
    if(system)body.system=system;
    const resp=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
      body:JSON.stringify(body),
    });
    if(!resp.ok){const t=await resp.text();throw new Error(`API ${resp.status}: ${t.slice(0,200)}`);}
    const data=await resp.json();
    if(data.error)throw new Error(data.error.message||JSON.stringify(data.error));
    const text=(data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
    if(!text)throw new Error("Empty response");
    return text;
  };

  const extractDNA=async(text,name)=>{
    setExtracting(true);
    setDnaError("");
    // Split into two calls so neither response is truncated at 2000 tokens.
    // Pass A: strategy + voice fields
    // Pass B: visual + behavior fields
    const src=text.substring(0,16000);
    const makePrompt=(fields)=>`You are a brand strategist. Extract brand information from these guidelines.

Brand: ${name}
Guidelines:
${src}

Return ONLY a JSON object with EXACTLY these keys (no others, no markdown):
${JSON.stringify(fields)}

Rules:
- Values must be plain strings, no nested objects or arrays
- Keep each value under 200 characters
- Use "" for any field not found in the guidelines
- Do not wrap in code fences`;

    const parseJSON=(raw,fields)=>{
      const clean=raw.replace(/^```(?:json)?\s*/i,"").replace(/```[\s\S]*$/i,"").trim();
      const s=clean.indexOf("{"),e=clean.lastIndexOf("}");
      if(s===-1||e===-1)throw new Error("No JSON object in response");
      const parsed=JSON.parse(clean.slice(s,e+1));
      const out={};
      for(const k of fields){
        if(typeof parsed[k]==="string")out[k]=parsed[k];
      }
      return out;
    };

    const passA=["summary","audience","category","positioning","emotionalTerritory","competitivePosture","voicePrinciples","toneSliders","approvedVocabulary","bannedPhrases"];
    const passB=["visualPrinciples","typography","colorBehavior","compositionBehavior","imageDirection","motionPersonality","brandBehaviors","examples"];

    let merged={...EMPTY_DNA};
    let errMsg="";

    try{
      const rawA=await callAPI(makePrompt(passA),2000);
      const outA=parseJSON(rawA,passA);
      merged={...merged,...outA};
    }catch(e){
      errMsg=`Strategy/Voice pass: ${e.message}`;
    }

    try{
      const rawB=await callAPI(makePrompt(passB),2000);
      const outB=parseJSON(rawB,passB);
      merged={...merged,...outB};
    }catch(e){
      errMsg=errMsg?`${errMsg} | Visual/Behavior pass: ${e.message}`:`Visual/Behavior pass: ${e.message}`;
    }

    const populated=Object.values(merged).filter(v=>v?.trim()).length;
    if(populated>0){
      setBrandDna(merged);
      if(errMsg){
        setDnaError(`Partial extraction (${populated}/18 fields). ${errMsg}`);
        toast_(`${populated} fields extracted — fill in the rest`);
      }else{
        setDnaError("");
        toast_(`DNA extracted — ${populated} fields populated`);
      }
    }else{
      setDnaError(errMsg||"Extraction returned no data. Check that your PDF contains readable text.");
      toast_("Extraction failed — see error below");
    }
    setExtracting(false);
  };

  const buildSystem=()=>{
    const dnaStr=DNA_META
      .filter(([k])=>brandDna[k]?.trim())
      .map(([k,label])=>`${label}: ${brandDna[k]}`)
      .join("\n");
    const exLines=[
      goodEx.length?`GOOD EXAMPLES (on-brand):\n${goodEx.join("\n")}`:"",
      badEx.length?`BAD EXAMPLES (avoid):\n${badEx.join("\n")}`:"",
    ].filter(Boolean).join("\n\n");
    const actionSys=ACTIONS.find(a=>a.id===action)?.sys||"";
    return `You are Marque, an AI brand steward for ${brandName}.

BRAND DNA:
${dnaStr||"No DNA extracted yet."}${fontName?`\n\nBrand font: ${fontName}`:""}${teamNote?`\n\nTeam notes: ${teamNote}`:""}${exLines?`\n\n${exLines}`:""}

YOUR ROLE:
${actionSys}

Always ground your response in specific DNA fields. Be precise and actionable.`;
  };

  const processFile=async file=>{
    setStatus("reading");
    const name=file.name.replace(/\.[^.]+$/,"").replace(/[-_]/g," ");
    let text="";
    try{
      if(file.type==="application/pdf"||file.name.endsWith(".pdf")){
        const buf=await file.arrayBuffer();
        text=await pdfToText(buf);
        setPdfRendering(true);setPdfPages([]);
        pdfToPages(buf,60).then(p=>{setPdfPages(p);setPdfRendering(false);});
      }else{
        text=await file.text();
      }
    }catch{}
    if(!text||text.length<50)text=`Brand guidelines from "${name}" loaded.`;
    setBrandText(text);setBrandName(name);setStatus("ready");pop();
    setView("brand");setMenuOpen(false);setMessages([]);
    if(!hasEmail)setTimeout(()=>setShowEmail(true),900);
    await extractDNA(text,name);
  };

  const processLogo=file=>{
    const reader=new FileReader();
    reader.onload=e=>{setLogoUrl(e.target.result);toast_("Logo uploaded ✓");};
    reader.readAsDataURL(file);
  };

  const loadDemo=()=>{
    const demo=`BRAND: Meridian
TAGLINE: Clarity at scale.
VOICE: Confident, precise, human. Short active sentences. No jargon. First person plural.
TONE: Warm but authoritative. Approachable, never cold. Serious, never stiff.
AUDIENCE: Startup founders who value craft and precision. Series A/B stage. Technically literate but not engineers. Frustrated by generic tools.
POSITIONING: The only brand intelligence platform built for design-led companies.
EMOTIONAL TERRITORY: The quiet confidence of those who know exactly who they are.
COMPETITIVE POSTURE: Premium vs Canva (too casual). Faster vs agencies (too slow). Opinionated vs generic tools.
PILLARS: Clarity cuts through noise. Built for the ambitious. Design is a competitive advantage.
COLORS: Black #0D0D0D, White #FFFFFF, Blue #0057FF, Cream #F5F2EE. Black dominates at 70%. Blue sparingly for emphasis only.
TYPOGRAPHY: Helvetica Neue. Bold headlines -0.03em. Body 1.7 leading. Never italic.
LOGO: Wordmark only. Black or white. Never on busy backgrounds. Minimum clear space = cap height on all sides.
IMAGERY: Architectural. High contrast. Real textures. No stock photography. No people unless candid.
APPROVED VOCABULARY: clarity, precision, craft, intentional, considered, built, earned, clean, direct
BANNED PHRASES: revolutionary, disruptive, game-changing, synergy, leverage, seamless, robust, scalable, best-in-class, unlock your potential
AVOID: Clutter, buzzwords, gradients, pastels, stock photography, exclamation points, passive voice.`;
    setBrandText(demo);setBrandName("Meridian");setStatus("ready");pop();setView("brand");setMessages([]);
    if(!hasEmail)setTimeout(()=>setShowEmail(true),900);
    extractDNA(demo,"Meridian");
  };

  const send=async content=>{
    if(!content.trim()||chatBusy)return;
    if(msgCount>=cur.msgs){setPaywall({reason:"Message limit reached on Seed plan."});return;}
    const userMsg={role:"user",content};
    setMessages(p=>[...p,userMsg]);setInput("");setChatBusy(true);setMsgCount(c=>c+1);
    if(inputRef.current)inputRef.current.style.height="auto";
    const system=isReady?buildSystem():"You are Marque, an AI brand steward. No brand loaded — ask the user to upload their brand guide in the Brand tab.";
    const allMsgs=[...messages,userMsg];
    const firstUser=allMsgs.findIndex(m=>m.role==="user");
    const apiMsgs=(firstUser>0?allMsgs.slice(firstUser):allMsgs).map(m=>({role:m.role,content:m.content||""}));
    let reply="";
    try{reply=await callAPIChat(apiMsgs,system);}
    catch(e){setMessages(p=>[...p,{role:"assistant",content:`Something went wrong: ${e.message}`}]);setChatBusy(false);scrollB();return;}
    const imgTag=reply.match(/\[IMG:([^\]]+)\]/);
    if(imgTag&&isPaid&&imgCount<cur.imgs){
      const gm={role:"assistant",content:reply,genImg:true};
      setMessages(p=>[...p,gm]);setChatBusy(false);scrollB();
      try{
        const url=await generateImage(`${imgTag[1].trim()}. Brand: ${brandName}. Editorial, architectural, high contrast.`);
        setImgCount(x=>x+1);setMessages(p=>p.map(m=>m===gm?{...m,imageUrl:url,genImg:false}:m));toast_("Image generated ✓");scrollB();
      }catch(e){setMessages(p=>p.map(m=>m===gm?{...m,genImg:false,content:m.content.replace(/\[IMG:[^\]]*\]/g,"").trim()+`\n(Image failed: ${e.message})`}:m));}
    }else if(imgTag&&!isPaid){
      setMessages(p=>[...p,{role:"assistant",content:reply.replace(/\[IMG:[^\]]*\]/g,"").trim()+"\n\n↑ Upgrade to Series or Scale to generate images."}]);setChatBusy(false);scrollB();
    }else{
      setMessages(p=>[...p,{role:"assistant",content:reply}]);setChatBusy(false);scrollB();
    }
  };

  const genConcept=async()=>{
    if(!cPrompt.trim()||cBusy)return;
    if(cCount>=cur.concepts){setPaywall({reason:"Concept limit reached on Seed plan."});return;}
    setCBusy(true);
    const dnaCtx=DNA_META.filter(([k])=>brandDna[k]?.trim()).map(([k,label])=>`${label}: ${brandDna[k]}`).join("\n");
    const prompt=`You are a startup brand art director. Generate a visual concept brief grounded in the brand DNA.

Brand: ${brandName||"this brand"}
${dnaCtx?`Brand DNA:\n${dnaCtx}`:(brandText?`Brand text:\n${brandText.substring(0,8000)}`:"No guidelines.")}

Generate a concept for: ${cPrompt}

Return ONLY a JSON object (no markdown):
{"title":"","format":"e.g. Twitter/X Banner","background":"#hex","accentColor":"#hex","textColor":"#hex","headline":"headline text","subtext":"optional tagline","visualElements":["el1","el2"],"mood":"one word","artDirectionNotes":"2-3 sentences grounded in DNA"}`;
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
    if(imgCount>=cur.imgs){setPaywall({reason:plan==="seed"?"3 free images used — upgrade for more.":"Image limit reached this month."});return;}
    setImgLoading(i);setConcepts(p=>p.map((c,j)=>j===i?{...c,generating:true}:c));
    try{
      const c=concepts[i];
      const url=await generateImage(`${c.mood} brand visual for "${brandName}". ${c.format}. BG:${c.background}. Headline:"${c.headline}". ${(c.visualElements||[]).join(", ")}. ${c.artDirectionNotes}. Editorial, architectural, high contrast.`);
      setImgCount(x=>x+1);setConcepts(p=>p.map((c,j)=>j===i?{...c,imageUrl:url,generating:false}:c));toast_("Image generated ✓");
    }catch(e){setConcepts(p=>p.map((c,j)=>j===i?{...c,generating:false}:c));toast_(`Image error: ${e.message}`);}
    setImgLoading(null);
  };

  const addMember=()=>{
    if(!newM.name.trim())return;
    if(team.length>=cur.team){setPaywall({reason:`${cur.name} supports ${cur.team} teammate${cur.team>1?"s":""}. Upgrade for more.`});return;}
    setTeam(p=>[...p,{...newM,id:Date.now()}]);setNewM({name:"",role:"",access:"Editor"});toast_(`${newM.name} added ✓`);
  };

  const addExample=()=>{
    if(!exInput.trim())return;
    if(exType==="good")setGoodEx(p=>[...p,exInput.trim()]);
    else setBadEx(p=>[...p,exInput.trim()]);
    setExInput("");toast_(`${exType==="good"?"Good":"Bad"} example added`);
  };

  const go=id=>{setView(id);setMenuOpen(false);};
  const TABS=[{id:"brand",label:"Brand"},{id:"studio",label:"Studio"},{id:"team",label:"Team"}];
  const FMTS=["Twitter/X banner","Product Hunt","LinkedIn post","Email header","App screenshot"];
  const IB={border:".5px solid rgba(0,0,0,.12)",borderRadius:10,fontFamily:HN,fontSize:16,color:"#1d1d1f",padding:"10px 12px",outline:"none",background:"#fafafa",width:"100%"};

  if(sharePreview)return <SharedGuideView brandName={brandName} pages={pdfPages} dna={brandDna} logoUrl={logoUrl} fontName={fontName} onBack={()=>setSharePreview(false)}/>;

  return(
    <>
      <style>{`
        @keyframes sUp{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes radPulse{0%{transform:scale(0);opacity:1}100%{transform:scale(12);opacity:0}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes blink{0%,80%,100%{opacity:.2}40%{opacity:1}}
        *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
        html,body{height:100%;background:#f5f5f7;overscroll-behavior:none}
        ::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-thumb{background:#d1d1d6;border-radius:3px}
        input,textarea,select{font-family:-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px!important}
        input::placeholder,textarea::placeholder{color:#aeaeb2}
        button{cursor:pointer}button:active:not(:disabled){opacity:.65}
      `}</style>

      <Pulse on={pulse}/>
      <Toast msg={toast.msg} on={toast.on}/>
      {showEmail&&<EmailSheet onDone={()=>{setHasEmail(true);setShowEmail(false);pop();toast_("Welcome ✓");}} onSkip={()=>{setHasEmail(true);setShowEmail(false);}}/>}
      {paywall&&<Paywall reason={paywall.reason} onClose={()=>setPaywall(null)} onUp={p=>{setPlan(p.name.toLowerCase());setPaywall(null);pop();toast_(`Upgraded to ${p.name} ✓`);}}/>}
      {showShare&&<ShareSheet brandName={brandName} pages={pdfPages} onClose={()=>setShowShare(false)} onPreview={()=>{setShowShare(false);setSharePreview(true);}}/>}

      {/* Mobile menu */}
      {menuOpen&&!isDesktop&&(
        <div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:400}}>
          <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:52,left:0,right:0,background:"rgba(245,245,247,.98)",backdropFilter:"blur(20px)",borderBottom:".5px solid rgba(0,0,0,.1)",paddingBottom:16,animation:"sUp .2s ease"}}>
            {TABS.map(t=><button key={t.id} onClick={()=>go(t.id)} style={{display:"flex",width:"100%",padding:"14px 20px",background:view===t.id?"rgba(0,0,0,.04)":"none",border:"none",fontFamily:HN,fontSize:16,color:view===t.id?"#1d1d1f":"#6e6e73",fontWeight:view===t.id?500:400,textAlign:"left"}}>{t.label}</button>)}
            {plan==="seed"&&<div style={{padding:"12px 20px 4px"}}><button onClick={()=>{setMenuOpen(false);setPaywall({reason:"Unlock unlimited access and AI image generation."});}} style={{width:"100%",background:"#1d1d1f",border:"none",borderRadius:12,fontFamily:HN,fontSize:15,fontWeight:500,color:"#fff",padding:"13px"}}>Upgrade →</button></div>}
            {isReady&&<div style={{padding:"14px 20px 0",display:"flex",alignItems:"center",gap:7}}><div style={{width:6,height:6,borderRadius:"50%",background:"#34c759"}}/><span style={{fontFamily:HN,fontSize:13,color:"#6e6e73"}}>{brandName} · Active</span></div>}
          </div>
        </div>
      )}

      <div style={{height:"100dvh",display:"flex",flexDirection:"column",overflow:"hidden",background:"#f5f5f7"}}>

        {/* Nav */}
        <nav style={{height:52,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",background:"rgba(245,245,247,.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:".5px solid rgba(0,0,0,.12)",zIndex:300}}>
          <Logo h={17} color="#1d1d1f" onClick={()=>go("brand")}/>
          {isDesktop?(
            <div style={{display:"flex",alignItems:"center",gap:2}}>
              {TABS.map(t=>(
                <button key={t.id} onClick={()=>go(t.id)} style={{padding:"6px 14px",borderRadius:8,border:"none",background:view===t.id?"rgba(0,0,0,.06)":"transparent",fontFamily:HN,fontSize:13,color:view===t.id?"#1d1d1f":"#6e6e73",fontWeight:view===t.id?500:400,cursor:"pointer",transition:"all .15s"}}>{t.label}</button>
              ))}
              {plan==="seed"&&<button onClick={()=>setPaywall({reason:"Unlock unlimited access and AI image generation."})} style={{marginLeft:8,background:"#1d1d1f",border:"none",borderRadius:8,fontFamily:HN,fontSize:13,fontWeight:500,color:"#fff",padding:"6px 16px",cursor:"pointer"}}>Upgrade →</button>}
            </div>
          ):(
            <button onClick={()=>setMenuOpen(o=>!o)} aria-label="Menu" style={{background:"none",border:"none",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",flexShrink:0}}>
              <span style={{position:"absolute",display:"block",width:18,height:1.5,background:"#1d1d1f",borderRadius:2,transition:"transform .22s",transform:menuOpen?"rotate(45deg)":"translateY(-4px)"}}/>
              <span style={{position:"absolute",display:"block",width:18,height:1.5,background:"#1d1d1f",borderRadius:2,transition:"transform .22s",transform:menuOpen?"rotate(-45deg)":"translateY(4px)"}}/>
            </button>
          )}
        </nav>

        <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column",minHeight:0}}>

          {/* ── BRAND ── */}
          {view==="brand"&&(
            <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
              <div style={{maxWidth:560,margin:"0 auto",padding:"clamp(20px,5vw,48px) 16px 60px"}}>

                {isReady?(
                  <>
                    {/* Status + actions */}
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,flexWrap:"wrap"}}>
                      <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"#fff",borderRadius:20,padding:"4px 12px 4px 7px",boxShadow:"0 1px 6px rgba(0,0,0,.08)"}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:"#34c759"}}/>
                        <span style={{fontFamily:HN,fontSize:12,color:"#1d1d1f"}}>{brandName} · Active</span>
                      </div>
                      <button onClick={()=>{nuke();setBrandText("");setBrandName("");setBrandDna(EMPTY_DNA);setLogoUrl(null);setFontName("");setGoodEx([]);setBadEx([]);setStatus("idle");setMessages([]);setPdfPages([]);}} style={{background:"none",border:"none",fontFamily:HN,fontSize:12,color:"#aeaeb2",cursor:"pointer",marginLeft:"auto"}}>Replace brand</button>
                    </div>

                    <div style={{display:"flex",gap:8,marginBottom:16}}>
                      <button onClick={()=>go("studio")} style={{flex:1,background:"#1d1d1f",border:"none",borderRadius:11,fontFamily:HN,fontSize:14,fontWeight:500,color:"#fff",padding:"13px",cursor:"pointer"}}>Open Studio →</button>
                      {isPaid&&pdfPages.length>0
                        ?<button onClick={()=>setShowShare(true)} style={{background:"#fff",border:".5px solid rgba(0,0,0,.12)",borderRadius:11,fontFamily:HN,fontSize:14,fontWeight:500,color:"#1d1d1f",padding:"13px 18px",cursor:"pointer",flexShrink:0}}>Share</button>
                        :<button onClick={()=>setPaywall({reason:"Shareable guide links on Series ($29/mo) and Scale ($79/mo)."})} style={{background:"#fff",border:".5px solid rgba(0,0,0,.08)",borderRadius:11,fontFamily:HN,fontSize:13,color:"#aeaeb2",padding:"13px 14px",cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>Share ↑</button>
                      }
                    </div>

                    {/* Logo + font + examples row */}
                    <div style={{display:"flex",gap:8,marginBottom:16}}>
                      <div onClick={()=>logoRef.current?.click()} style={{width:72,height:72,flexShrink:0,borderRadius:12,background:"#fff",border:".5px solid rgba(0,0,0,.12)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,.05)"}}>
                        <input ref={logoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])processLogo(e.target.files[0]);}}/>
                        {logoUrl
                          ?<img src={logoUrl} alt="" style={{width:"100%",height:"100%",objectFit:"contain",padding:6}}/>
                          :<><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d1d1d6" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span style={{fontFamily:HN,fontSize:9,color:"#aeaeb2",marginTop:3}}>Logo</span></>
                        }
                      </div>
                      <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
                        <div>
                          <label style={{fontFamily:HN,fontSize:9,color:"#aeaeb2",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:3}}>Brand Font</label>
                          <input value={fontName} onChange={e=>setFontName(e.target.value)} placeholder="e.g. Helvetica Neue" style={{width:"100%",border:".5px solid rgba(0,0,0,.12)",borderRadius:8,fontFamily:HN,fontSize:13,color:"#1d1d1f",padding:"7px 10px",outline:"none",background:"#fff"}}/>
                        </div>
                        <button onClick={()=>setShowExamples(o=>!o)} style={{background:"#f5f5f7",border:"none",borderRadius:8,fontFamily:HN,fontSize:11,color:"#6e6e73",padding:"7px 10px",cursor:"pointer",textAlign:"left"}}>
                          {goodEx.length+badEx.length>0?`${goodEx.length} good · ${badEx.length} bad examples saved`:"+ Add training examples"}
                        </button>
                      </div>
                    </div>

                    {/* Examples panel */}
                    {showExamples&&(
                      <div style={{background:"#fff",borderRadius:12,boxShadow:"0 2px 10px rgba(0,0,0,.06),0 0 0 .5px rgba(0,0,0,.05)",padding:"14px",marginBottom:16,animation:"sUp .2s ease"}}>
                        <p style={{fontFamily:HN,fontSize:13,fontWeight:600,color:"#1d1d1f",marginBottom:2}}>Training Examples</p>
                        <p style={{fontFamily:HN,fontSize:11,color:"#aeaeb2",lineHeight:1.6,marginBottom:10}}>Paste on-brand references (good) or off-brand patterns to avoid (bad). Both are included in AI context.</p>
                        <div style={{display:"flex",gap:6,marginBottom:8}}>
                          {["good","bad"].map(t=>(
                            <button key={t} onClick={()=>setExType(t)} style={{flex:1,padding:"7px",borderRadius:8,border:".5px solid rgba(0,0,0,.1)",background:exType===t?"#1d1d1f":"#f5f5f7",fontFamily:HN,fontSize:12,color:exType===t?"#fff":"#6e6e73",cursor:"pointer"}}>{t==="good"?"✓ Good":"✕ Bad"}</button>
                          ))}
                        </div>
                        <div style={{display:"flex",gap:8,marginBottom:10}}>
                          <input value={exInput} onChange={e=>setExInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addExample();}} placeholder="Paste text or describe..." style={{flex:1,border:".5px solid rgba(0,0,0,.12)",borderRadius:8,fontFamily:HN,fontSize:13,color:"#1d1d1f",padding:"8px 10px",outline:"none",background:"#fafafa"}}/>
                          <button onClick={addExample} disabled={!exInput.trim()} style={{background:"#1d1d1f",border:"none",borderRadius:8,fontFamily:HN,fontSize:12,color:"#fff",padding:"8px 12px",cursor:"pointer",opacity:exInput.trim()?1:.4}}>Add</button>
                        </div>
                        {[...goodEx.map((t,i)=>({t,i,type:"good"})),...badEx.map((t,i)=>({t,i,type:"bad"}))].map(({t,i,type})=>(
                          <div key={`${type}-${i}`} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"6px 0",borderTop:".5px solid #f5f5f7"}}>
                            <span style={{fontFamily:HN,fontSize:10,color:type==="good"?"#34c759":"#ff3b30",flexShrink:0,marginTop:2}}>{type==="good"?"✓":"✕"}</span>
                            <span style={{fontFamily:HN,fontSize:12,color:"#1d1d1f",flex:1,lineHeight:1.5,wordBreak:"break-all"}}>{t}</span>
                            <button onClick={()=>type==="good"?setGoodEx(p=>p.filter((_,j)=>j!==i)):setBadEx(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",fontFamily:HN,fontSize:12,color:"#aeaeb2",padding:"0 2px",cursor:"pointer",flexShrink:0}}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* DNA extraction error */}
                    {dnaError&&(
                      <div style={{background:"#fff5f5",border:".5px solid rgba(255,59,48,.2)",borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"flex-start",gap:8}}>
                        <span style={{fontFamily:HN,fontSize:11,color:"#ff3b30",flexShrink:0,marginTop:1}}>!</span>
                        <p style={{fontFamily:HN,fontSize:12,color:"#ff3b30",lineHeight:1.5,margin:0}}>{dnaError}</p>
                        <button onClick={()=>setDnaError("")} style={{background:"none",border:"none",fontFamily:HN,fontSize:12,color:"#ff3b30",opacity:.5,cursor:"pointer",flexShrink:0,padding:0}}>✕</button>
                      </div>
                    )}

                    {/* DNA editor */}
                    <div style={{background:"#fff",borderRadius:14,boxShadow:"0 2px 10px rgba(0,0,0,.06),0 0 0 .5px rgba(0,0,0,.05)",padding:"18px",marginBottom:14}}>
                      <DNAEditor
                        dna={brandDna}
                        onChange={(k,v)=>setBrandDna(p=>({...p,[k]:v}))}
                        brandName={brandName}
                        logoUrl={logoUrl}
                        fontName={fontName}
                        extracting={extracting}
                        onReExtract={()=>extractDNA(brandText,brandName)}
                      />
                    </div>

                    {/* PDF preview */}
                    {(pdfPages.length>0||pdfRendering)&&(
                      <div style={{marginBottom:14}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                          <p style={{fontFamily:HN,fontSize:12,fontWeight:600,color:"#1d1d1f"}}>Source Guide</p>
                          {pdfPages.length>0&&<span style={{fontFamily:HN,fontSize:11,color:"#aeaeb2"}}>{pdfPages.length} pages</span>}
                        </div>
                        <PDFPreview pages={pdfPages} rendering={pdfRendering}/>
                      </div>
                    )}

                    <div style={{background:"#1d1d1f",borderRadius:14,padding:"16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                      <div><p style={{fontFamily:HN,fontSize:13,fontWeight:600,color:"#fff",marginBottom:3}}>Need a brand system first?</p><p style={{fontFamily:HN,fontSize:11,color:"rgba(255,255,255,.45)",lineHeight:1.5}}>Form builds brand systems for startups.</p></div>
                      <a href="https://designbyform.com/contact" target="_blank" rel="noreferrer" style={{background:"#fff",border:"none",borderRadius:9,fontFamily:HN,fontSize:12,fontWeight:600,color:"#1d1d1f",padding:"9px 12px",textDecoration:"none",whiteSpace:"nowrap",flexShrink:0}}>Work with Form →</a>
                    </div>
                  </>
                ):(
                  <>
                    <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"#fff",borderRadius:20,padding:"4px 12px 4px 7px",boxShadow:"0 1px 6px rgba(0,0,0,.08)",marginBottom:18}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:"#aeaeb2"}}/>
                      <span style={{fontFamily:HN,fontSize:12,color:"#6e6e73"}}>Built for startup teams</span>
                    </div>
                    <h1 style={{fontFamily:HN,fontSize:"clamp(28px,8vw,52px)",fontWeight:700,letterSpacing:"-.04em",lineHeight:1.0,color:"#1d1d1f",marginBottom:10}}>Brand DNA</h1>
                    <p style={{fontFamily:HN,fontSize:"clamp(13px,2.5vw,16px)",color:"#6e6e73",lineHeight:1.65,marginBottom:26,maxWidth:360}}>Upload your brand guide. Marque extracts editable Brand DNA — then helps you generate, critique, and protect it.</p>

                    <div
                      onDragOver={e=>{e.preventDefault();setDragging(true);}}
                      onDragLeave={()=>setDragging(false)}
                      onDrop={e=>{e.preventDefault();setDragging(false);const f=e.dataTransfer.files[0];if(f)processFile(f);}}
                      onClick={()=>fileRef.current?.click()}
                      style={{border:`2px dashed ${dragging?"#1d1d1f":"#e5e5ea"}`,borderRadius:18,padding:"32px 20px",cursor:"pointer",textAlign:"center",background:dragging?"#f0f0f5":"#fafafa",marginBottom:12,transition:"all .2s"}}
                    >
                      <input ref={fileRef} type="file" accept=".pdf,.txt" style={{display:"none"}} onChange={e=>{if(e.target.files[0])processFile(e.target.files[0]);}}/>
                      {status==="reading"?(
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                          <div style={{width:30,height:30,border:"3px solid #e5e5ea",borderTopColor:"#1d1d1f",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
                          <p style={{fontFamily:HN,fontSize:14,color:"#6e6e73"}}>Reading guidelines...</p>
                        </div>
                      ):(
                        <>
                          <div style={{width:46,height:46,borderRadius:13,background:"#fff",boxShadow:"0 2px 10px rgba(0,0,0,.08)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px"}}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aeaeb2" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                          </div>
                          <p style={{fontFamily:HN,fontSize:15,fontWeight:600,color:"#1d1d1f",marginBottom:4}}>Drop your brand guide</p>
                          <p style={{fontFamily:HN,fontSize:13,color:"#aeaeb2"}}>PDF or TXT · Tap or drag</p>
                        </>
                      )}
                    </div>

                    <div style={{background:"#1d1d1f",borderRadius:14,padding:"16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginBottom:12}}>
                      <div><p style={{fontFamily:HN,fontSize:13,fontWeight:600,color:"#fff",marginBottom:3}}>Need a brand guide first?</p><p style={{fontFamily:HN,fontSize:11,color:"rgba(255,255,255,.45)",lineHeight:1.5}}>Form builds brand systems for startups.</p></div>
                      <a href="https://designbyform.com/contact" target="_blank" rel="noreferrer" style={{background:"#fff",border:"none",borderRadius:9,fontFamily:HN,fontSize:12,fontWeight:600,color:"#1d1d1f",padding:"9px 12px",textDecoration:"none",whiteSpace:"nowrap",flexShrink:0}}>Work with Form →</a>
                    </div>
                    <div style={{textAlign:"center"}}><button onClick={loadDemo} style={{background:"none",border:"none",fontFamily:HN,fontSize:13,color:"#aeaeb2",padding:"8px 0"}}>Try Meridian demo →</button></div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── STUDIO ── */}
          {view==="studio"&&(
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
              {/* Studio header */}
              <div style={{flexShrink:0,background:"#fff",borderBottom:".5px solid rgba(0,0,0,.08)",padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                <div style={{display:"flex",background:"#f5f5f7",borderRadius:10,padding:3,gap:2,flexShrink:0}}>
                  {[{id:"text",label:"Chat"},{id:"image",label:"Image"}].map(m=>(
                    <button key={m.id} onClick={()=>setMode(m.id)} style={{padding:"7px 16px",borderRadius:8,border:"none",background:mode===m.id?"#fff":"transparent",fontFamily:HN,fontSize:13,color:mode===m.id?"#1d1d1f":"#6e6e73",fontWeight:mode===m.id?500:400,boxShadow:mode===m.id?"0 1px 4px rgba(0,0,0,.08)":"none",transition:"all .15s",cursor:"pointer"}}>{m.label}</button>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
                  {plan==="seed"
                    ?<><StatBar label="Msgs" used={msgCount} total={PLANS.seed.msgs}/><StatBar label="Ideas" used={cCount} total={PLANS.seed.concepts}/></>
                    :<><StatBar label="Msgs" used={0} total={1e9}/><StatBar label="Images" used={imgCount} total={cur.imgs}/></>
                  }
                  {plan==="seed"&&<button onClick={()=>setPaywall({reason:"Unlock unlimited messages and AI images."})} style={{background:"#1d1d1f",border:"none",borderRadius:7,fontFamily:HN,fontSize:11,fontWeight:500,color:"#fff",padding:"5px 10px",cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>Upgrade</button>}
                </div>
              </div>

              {mode==="text"&&(
                <>
                  {/* Action pills */}
                  <div style={{flexShrink:0,background:"#fff",borderBottom:".5px solid rgba(0,0,0,.06)",padding:"8px 14px",display:"flex",gap:6,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
                    {ACTIONS.map(a=>(
                      <button key={a.id} onClick={()=>{if(action!==a.id){setAction(a.id);setMessages([]);}}} style={{padding:"7px 14px",borderRadius:20,border:".5px solid rgba(0,0,0,.1)",background:action===a.id?"#1d1d1f":"#f5f5f7",fontFamily:HN,fontSize:12,fontWeight:action===a.id?500:400,color:action===a.id?"#fff":"#6e6e73",whiteSpace:"nowrap",cursor:"pointer",flexShrink:0,transition:"all .15s"}}>{a.label}</button>
                    ))}
                  </div>

                  {/* Messages */}
                  <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"14px"}}>
                    <div style={{maxWidth:600,margin:"0 auto"}}>
                      {messages.length===0&&(
                        <div style={{paddingTop:16,animation:"sUp .25s ease"}}>
                          <p style={{fontFamily:HN,fontSize:13,fontWeight:500,color:"#1d1d1f",marginBottom:3}}>{ACTIONS.find(a=>a.id===action)?.label}</p>
                          <p style={{fontFamily:HN,fontSize:13,color:"#aeaeb2",marginBottom:0,lineHeight:1.6}}>{ACTIONS.find(a=>a.id===action)?.hint}</p>
                          {!isReady&&<p style={{fontFamily:HN,fontSize:13,color:"#ff9f0a",marginTop:12}}>Upload a brand guide in the Brand tab first.</p>}
                        </div>
                      )}
                      {messages.map((m,i)=><Bubble key={i} m={m} onLoad={scrollB}/>)}
                      {chatBusy&&(
                        <div style={{display:"flex",gap:8,marginBottom:12}}>
                          <div style={{width:26,height:26,borderRadius:8,background:"#1d1d1f",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Mark size={12} color="#fff"/></div>
                          <div style={{padding:"12px 14px",background:"#fff",borderRadius:"4px 16px 16px 16px",boxShadow:"0 1px 6px rgba(0,0,0,.07)",display:"flex",gap:4,alignItems:"center"}}>
                            {[0,.2,.4].map((d,i)=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:"#aeaeb2",animation:`blink 1.2s ${d}s infinite`}}/>)}
                          </div>
                        </div>
                      )}
                      <div ref={bottomRef}/>
                    </div>
                  </div>

                  {/* Input */}
                  <div style={{flexShrink:0,padding:"8px 14px 12px",borderTop:".5px solid rgba(0,0,0,.08)",background:"rgba(245,245,247,.95)",backdropFilter:"blur(20px)"}}>
                    <div style={{maxWidth:600,margin:"0 auto",display:"flex",alignItems:"flex-end",gap:8,background:"#fff",borderRadius:16,boxShadow:"0 2px 14px rgba(0,0,0,.1),0 0 0 .5px rgba(0,0,0,.08)",padding:"6px 6px 6px 14px"}}>
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e=>{setInput(e.target.value);e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}}
                        onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send(input);}}}
                        disabled={!isReady}
                        rows={1}
                        placeholder={isReady?ACTIONS.find(a=>a.id===action)?.hint:"Upload guidelines in Brand tab first"}
                        style={{flex:1,border:"none",outline:"none",fontFamily:HN,fontSize:14,color:"#1d1d1f",resize:"none",background:"transparent",lineHeight:1.5,padding:"5px 0",maxHeight:120,overflowY:"auto"}}
                      />
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
                      {concepts.length===0&&!cBusy&&<div style={{textAlign:"center",paddingTop:40}}><p style={{fontFamily:HN,fontSize:14,color:"#aeaeb2",marginBottom:6}}>No concepts yet.</p><p style={{fontFamily:HN,fontSize:13,color:"#d1d1d6"}}>Describe a format above to generate an on-brand visual brief.</p></div>}
                      {cBusy&&<div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center",paddingTop:40}}><div style={{width:16,height:16,border:"2px solid #e5e5ea",borderTopColor:"#1d1d1f",borderRadius:"50%",animation:"spin .7s linear infinite"}}/><span style={{fontFamily:HN,fontSize:14,color:"#aeaeb2"}}>Generating concept...</span></div>}
                      {concepts.map((c,i)=><ConceptCard key={i} c={c} idx={i} isPaid={isPaid} imgLoading={imgLoading} onGen={genConceptImg} onUpgrade={()=>setPaywall({reason:"AI image generation on Series ($29/mo) and Scale ($79/mo)."})}/>)}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── TEAM ── */}
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
                  {plan==="seed"&&team.length>=PLANS.seed.team
                    ?<div style={{textAlign:"center",padding:"4px 0"}}><p style={{fontFamily:HN,fontSize:13,color:"#6e6e73",marginBottom:12}}>Team collaboration requires a paid plan.</p><button onClick={()=>setPaywall({reason:"Series ($29/mo) = 5 teammates. Scale ($79/mo) = 20."})} style={{background:"#1d1d1f",border:"none",borderRadius:10,fontFamily:HN,fontSize:13,fontWeight:500,color:"#fff",padding:"10px 20px"}}>Upgrade</button></div>
                    :<div style={{display:"flex",flexWrap:"wrap",gap:8}}><input value={newM.name} onChange={e=>setNewM(p=>({...p,name:e.target.value}))} placeholder="Name" onKeyDown={e=>{if(e.key==="Enter")addMember();}} style={{...IB,flex:"1 1 90px"}}/><input value={newM.role} onChange={e=>setNewM(p=>({...p,role:e.target.value}))} placeholder="Role" style={{...IB,flex:"1 1 90px"}}/><select value={newM.access} onChange={e=>setNewM(p=>({...p,access:e.target.value}))} style={{...IB,flex:"0 0 auto",width:"auto"}}><option>Editor</option><option>Viewer</option><option>Admin</option></select><button onClick={addMember} style={{background:"#1d1d1f",border:"none",borderRadius:10,fontFamily:HN,fontSize:13,fontWeight:500,color:"#fff",padding:"10px 14px",whiteSpace:"nowrap"}}>Add</button></div>
                  }
                </div>
                <div style={{background:"#fff",borderRadius:14,boxShadow:"0 2px 10px rgba(0,0,0,.06),0 0 0 .5px rgba(0,0,0,.05)",padding:"14px"}}>
                  <p style={{fontFamily:HN,fontSize:13,fontWeight:600,color:"#1d1d1f",marginBottom:3}}>Team Brand Notes</p>
                  <p style={{fontFamily:HN,fontSize:12,color:"#aeaeb2",marginBottom:10,lineHeight:1.6}}>Shared context included in every brand steward session.</p>
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
