import { useState } from "react";

const F = "-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif";
const TODAY = new Date("2026-05-30");
const d = n => { const x = new Date("2026-05-30"); x.setDate(x.getDate()+n); return x.toISOString().split("T")[0]; };
const fmt = s => { if(!s) return "—"; const x=new Date(s+"T12:00:00"); return x.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}); };
const fmtShort = s => { if(!s) return "—"; const x=new Date(s+"T12:00:00"); return x.toLocaleDateString("en-US",{month:"short",day:"numeric"}); };
const daysBetween = s => Math.round((new Date(s) - TODAY) / 86400000);

// ── INITIAL DATA ──────────────────────────────────────────────────────────────

const INIT_BIZS = [
  { id:"b1", name:"Light Sleeper Wine Bar",  type:"Wine Bar",      city:"Washington", state:"DC", contact:"Sarah Chen",   email:"sarah@lightsleeper.com" },
  { id:"b2", name:"Kily Import",              type:"Wine Importer", city:"Washington", state:"DC", contact:"Marcus Wright", email:"marcus@kilyimport.com" },
  { id:"b3", name:"Capitol Hill Food Truck",  type:"Food Truck",    city:"Washington", state:"DC", contact:"Priya Patel",   email:"priya@capitolhilltruck.com" },
];

const INIT_ITEMS = [
  { id:"1",  biz:"b1", title:"City Business License Renewal",       cat:"Business License",      status:"In Progress", pri:"Critical", due:d(-15), reqDoc:true,  docStatus:"missing",   freq:"Annual" },
  { id:"2",  biz:"b1", title:"ABRA Retailer Liquor License",        cat:"Alcohol License",       status:"In Progress", pri:"Critical", due:d(11),  reqDoc:true,  docStatus:"uploaded",  freq:"Annual" },
  { id:"3",  biz:"b1", title:"Liquor Liability Insurance Cert",     cat:"Insurance",             status:"In Progress", pri:"Critical", due:d(16),  reqDoc:true,  docStatus:"missing",   freq:"Annual" },
  { id:"4",  biz:"b1", title:"Food Handler Cards — Staff Renewal",  cat:"Food Handler / Safety", status:"Not Started", pri:"Medium",   due:d(6),   reqDoc:false, docStatus:"n/a",       freq:"Annual" },
  { id:"5",  biz:"b1", title:"Health Dept Food Service Permit",     cat:"Health Permit",         status:"Not Started", pri:"High",     due:d(32),  reqDoc:true,  docStatus:"missing",   freq:"Annual" },
  { id:"6",  biz:"b1", title:"Required Labor Law Postings",         cat:"Required Posting",      status:"Completed",   pri:"Low",      due:d(-60), reqDoc:false, docStatus:"n/a",       freq:"Annual" },
  { id:"7",  biz:"b1", title:"Q2 Payroll Tax Filing (941)",         cat:"Tax / Excise",          status:"Not Started", pri:"High",     due:d(31),  reqDoc:false, docStatus:"n/a",       freq:"Quarterly" },
  { id:"8",  biz:"b2", title:"TTB Basic Importer Permit Review",    cat:"TTB / Alcohol Federal", status:"In Progress", pri:"Critical", due:d(-29), reqDoc:true,  docStatus:"missing",   freq:"Annual" },
  { id:"9",  biz:"b2", title:"Workers' Compensation Insurance",     cat:"Insurance",             status:"Not Started", pri:"Critical", due:d(-31), reqDoc:true,  docStatus:"expired",   freq:"Annual" },
  { id:"10", biz:"b2", title:"Federal Excise Tax Return (Q2)",      cat:"Tax / Excise",          status:"Not Started", pri:"Critical", due:d(-10), reqDoc:false, docStatus:"n/a",       freq:"Quarterly" },
  { id:"11", biz:"b2", title:"FDA Food Facility Registration",      cat:"FDA / Federal",         status:"Not Started", pri:"High",     due:d(9),   reqDoc:false, docStatus:"n/a",       freq:"Biennial" },
  { id:"12", biz:"b2", title:"MD Warehouse Liability Insurance",    cat:"Insurance",             status:"Not Started", pri:"High",     due:d(13),  reqDoc:true,  docStatus:"expired",   freq:"Annual" },
  { id:"13", biz:"b2", title:"General Liability Insurance",         cat:"Insurance",             status:"In Progress", pri:"Critical", due:d(31),  reqDoc:true,  docStatus:"missing",   freq:"Annual" },
  { id:"14", biz:"b2", title:"Product Label Documentation",         cat:"Other",                 status:"Completed",   pri:"Low",      due:d(-60), reqDoc:true,  docStatus:"uploaded",  freq:"As Needed" },
  { id:"15", biz:"b3", title:"Mobile Food Unit Permit — Annual",    cat:"Health Permit",         status:"In Progress", pri:"Critical", due:d(4),   reqDoc:true,  docStatus:"missing",   freq:"Annual" },
  { id:"16", biz:"b3", title:"City Vending Permit (Public Space)",  cat:"Business License",      status:"Not Started", pri:"Critical", due:d(-31), reqDoc:true,  docStatus:"expired",   freq:"Annual" },
  { id:"17", biz:"b3", title:"General Liability Insurance Cert",    cat:"Insurance",             status:"Not Started", pri:"Critical", due:d(-15), reqDoc:true,  docStatus:"expired",   freq:"Annual" },
  { id:"18", biz:"b3", title:"Health Department Inspection",        cat:"Health Permit",         status:"Not Started", pri:"High",     due:d(-20), reqDoc:false, docStatus:"n/a",       freq:"Annual" },
  { id:"19", biz:"b3", title:"Fire Suppression System Inspection",  cat:"Fire / Safety",         status:"Not Started", pri:"High",     due:d(26),  reqDoc:true,  docStatus:"missing",   freq:"Annual" },
  { id:"20", biz:"b3", title:"Food Handler Cards — 3 Staff",        cat:"Food Handler / Safety", status:"In Progress", pri:"Medium",   due:d(16),  reqDoc:false, docStatus:"n/a",       freq:"Annual" },
  { id:"21", biz:"b3", title:"Commissary Agreement — Union Kitchen",cat:"Lease / Real Estate",  status:"Completed",   pri:"Medium",   due:d(-45), reqDoc:true,  docStatus:"uploaded",  freq:"Annual" },
  { id:"22", biz:"b3", title:"Q2 Sales Tax Filing",                 cat:"Tax / Excise",          status:"Not Started", pri:"Medium",   due:d(31),  reqDoc:false, docStatus:"n/a",       freq:"Quarterly" },
];

const TMPLS = [
  {id:"restaurant",  name:"Restaurant",      icon:"🍽️", items:["City Business License Renewal","Health Dept Food Service Permit","Food Handler Cards — All Staff","General Liability Insurance","Workers' Compensation Insurance","Fire Suppression Inspection","Required Labor Law Postings","Quarterly Payroll Tax (941)","Annual Corporate Report","Grease Trap Service Record"]},
  {id:"winebar",     name:"Wine Bar",         icon:"🍷",  items:["ABRA Retailer Liquor License Renewal","City Business License","Liquor Liability Insurance","Health Dept Food Service Permit","Food Handler Cards","BMI / ASCAP Music License","Required Labor Law Postings","Workers' Compensation","Quarterly Payroll Tax","Annual Corporate Report"]},
  {id:"wineimporter",name:"Wine Importer",    icon:"📦",  items:["TTB Basic Importer Permit","FDA Food Facility Registration","Federal Excise Tax Return (Q2)","Federal Excise Tax Return (Q4)","State Importer License","General Liability Insurance","Workers' Compensation","Product Label (COLA) Tracking","Annual Corporate Report"]},
  {id:"foodtruck",   name:"Food Truck",       icon:"🚚",  items:["Mobile Food Unit Permit — Annual","City Vending Permit (Public Space)","Health Dept Mobile Inspection","Commissary Agreement","General Liability Insurance","Vehicle / Commercial Auto Insurance","Fire Suppression System","Food Handler Cards","Quarterly Sales Tax Filing"]},
  {id:"salon",       name:"Salon",            icon:"✂️",  items:["Cosmetology Establishment License","Practitioner License Renewals","General Liability Insurance","Workers' Compensation","Health Dept Inspection","Required Labor Law Postings","Annual Corporate Report"]},
  {id:"contractor",  name:"Contractor",       icon:"🔨",  items:["Contractor License Renewal","Contractor Bond Renewal","Workers' Compensation Insurance","General Liability / E&O Insurance","Commercial Vehicle Registration","Required Labor Law Postings","Annual Corporate Report"]},
  {id:"winedist",    name:"Wine Distributor", icon:"🏭",  items:["State Wholesale Distributor License","Federal Excise Tax Return (Q2)","Federal Excise Tax Return (Q4)","General Liability Insurance","Workers' Compensation","Annual Corporate Report"]},
];

const BIZ_TYPES = ["Restaurant","Wine Bar","Wine Importer","Wine Distributor","Food Truck","Salon","Contractor"];
const BIZ_TYPE_TMPL = {
  "Restaurant":"restaurant","Wine Bar":"winebar","Wine Importer":"wineimporter",
  "Wine Distributor":"winedist","Food Truck":"foodtruck","Salon":"salon","Contractor":"contractor",
};

// ── HELPERS ───────────────────────────────────────────────────────────────────

const isOverdue  = i => i.status!=="Completed" && i.status!=="Not Applicable" && new Date(i.due) < TODAY;
const isDueSoon  = (i,n=30) => { if(i.status==="Completed") return false; const due=new Date(i.due),th=new Date(TODAY); th.setDate(th.getDate()+n); return due>=TODAY && due<=th; };
const effSt      = i => { if(i.status==="Completed") return "Completed"; if(isOverdue(i)) return "Overdue"; if(isDueSoon(i,7)) return "Due Soon"; return i.status; };

const healthScore = items => {
  const ov  = items.filter(isOverdue).length;
  const exp = items.filter(i=>i.reqDoc&&i.docStatus==="expired").length;
  const mis = items.filter(i=>i.reqDoc&&i.docStatus==="missing").length;
  const d7  = items.filter(i=>isDueSoon(i,7)).length;
  return Math.max(0, Math.min(100, 100 - ov*8 - exp*5 - mis*4 - d7*2));
};

const taskVerb = item => {
  const t = item.title.toLowerCase();
  if (t.includes("renewal") || t.includes("renew")) return "Renew";
  if (t.includes("tax") || t.includes("excise") || t.includes("filing")) return "File";
  if (t.includes("inspection")) return "Schedule";
  if (t.includes("review")) return "Review";
  if (item.reqDoc && (item.docStatus==="missing" || item.docStatus==="expired")) return "Upload";
  if (item.status==="In Progress") return "Review";
  return "Complete";
};

const actionBtnLabel = item => {
  if (item.reqDoc && (item.docStatus==="missing" || item.docStatus==="expired")) return "Upload";
  if (item.status==="Waiting on Client") return "Send Reminder";
  if (item.status==="In Progress") return "Review";
  return "Mark Complete";
};

const deriveItem = (title, bizId, idx) => {
  const t = title.toLowerCase();
  const reqDoc = /insurance|license|permit|certificate|card|registration|agreement|bond/.test(t);
  const cat = t.includes("insurance") ? "Insurance"
    : t.includes("abra")||t.includes("liquor") ? "Alcohol License"
    : t.includes("ttb") ? "TTB / Alcohol Federal"
    : t.includes("fda") ? "FDA / Federal"
    : t.includes("license")||t.includes("corporate") ? "Business License"
    : t.includes("permit")||t.includes("inspection") ? "Health Permit"
    : t.includes("tax")||t.includes("excise")||t.includes("payroll") ? "Tax / Excise"
    : t.includes("posting") ? "Required Posting"
    : t.includes("fire") ? "Fire / Safety"
    : t.includes("vehicle") ? "Other"
    : "Other";
  const pri = t.includes("license")||t.includes("insurance")||t.includes("permit") ? "High" : "Medium";
  return {
    id: `n${Date.now()}-${bizId}-${idx}`,
    biz: bizId,
    title,
    cat,
    status: "Not Started",
    pri,
    due: d(90),
    reqDoc,
    docStatus: reqDoc ? "missing" : "n/a",
    freq: "Annual",
  };
};

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────

const ST = {
  "Overdue":           {bg:"#fef2f2",  tx:"#b91c1c", bd:"#fecaca"},
  "Due Soon":          {bg:"#fffbeb",  tx:"#b45309", bd:"#fde68a"},
  "In Progress":       {bg:"#eff6ff",  tx:"#1d4ed8", bd:"#bfdbfe"},
  "Not Started":       {bg:"#f8fafc",  tx:"#475569", bd:"#e2e8f0"},
  "Waiting on Client": {bg:"#fff7ed",  tx:"#c2410c", bd:"#fed7aa"},
  "Waiting on Agency": {bg:"#faf5ff",  tx:"#7c3aed", bd:"#ddd6fe"},
  "Completed":         {bg:"#f0fdf4",  tx:"#15803d", bd:"#bbf7d0"},
  "Not Applicable":    {bg:"#f8fafc",  tx:"#94a3b8", bd:"#e2e8f0"},
};
const DS = {
  "uploaded":{bg:"#f0fdf4",tx:"#15803d",label:"On File"},
  "expired": {bg:"#fffbeb",tx:"#b45309",label:"Expired"},
  "missing": {bg:"#fef2f2",tx:"#b91c1c",label:"Missing"},
  "n/a":     {bg:"#f8fafc",tx:"#94a3b8",label:"Not Required"},
};
const PRI_BAR = {Critical:"#ef4444", High:"#f97316", Medium:"#eab308", Low:"#e2e8f0"};

// ── ATOMS ─────────────────────────────────────────────────────────────────────

const Pill   = ({st}) => { const s=ST[st]??ST["Not Started"]; return <span style={{fontFamily:F,background:s.bg,color:s.tx,border:`1px solid ${s.bd}`,padding:"2px 8px",borderRadius:999,fontSize:11,fontWeight:600,display:"inline-flex",alignItems:"center",whiteSpace:"nowrap"}}>{st}</span>; };
const Lbl    = ({children,style}) => <span style={{fontFamily:F,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#94a3b8",...style}}>{children}</span>;
const Card   = ({children,style}) => <div style={{background:"#fff",border:"1px solid #e8ecf0",borderRadius:14,overflow:"hidden",...style}}>{children}</div>;
const CardHd = ({children,right}) => <div style={{padding:"11px 16px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontFamily:F,fontSize:13,fontWeight:700,color:"#1a2332"}}>{children}</span>{right}</div>;
const Btn    = ({children,onClick,primary,danger,small,style={}}) => <button onClick={onClick} style={{fontFamily:F,background:primary?"#2563eb":danger?"#dc2626":"#fff",color:primary||danger?"#fff":"#374151",border:primary||danger?"none":"1px solid #d1d5db",borderRadius:8,padding:small?"5px 11px":"8px 14px",fontSize:small?11:13,fontWeight:600,cursor:"pointer",...style}}>{children}</button>;
const Input  = ({value,onChange,placeholder,style={}}) => <input value={value} onChange={onChange} placeholder={placeholder} style={{fontFamily:F,border:"1px solid #e2e8f0",borderRadius:8,padding:"7px 11px",fontSize:13,outline:"none",background:"#fff",...style}}/>;
const Select = ({value,onChange,children,style={}}) => <select value={value} onChange={onChange} style={{fontFamily:F,border:"1px solid #e2e8f0",borderRadius:8,padding:"7px 11px",fontSize:13,background:"#fff",...style}}>{children}</select>;

// ── SIDEBAR ───────────────────────────────────────────────────────────────────

const NAV = [
  {id:"dashboard",  label:"Dashboard",  icon:"◉"},
  {id:"businesses", label:"Businesses", icon:"⊞"},
  {id:"documents",  label:"Documents",  icon:"⊟"},
  {id:"calendar",   label:"Calendar",   icon:"◫"},
  {id:"settings",   label:"Settings",   icon:"⚙"},
];

function Sidebar({view, setView}) {
  return (
    <div style={{width:212,flexShrink:0,background:"#fff",borderRight:"1px solid #e8ecf0",display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"16px 14px 14px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"center",gap:9}}>
        <div style={{width:30,height:30,background:"linear-gradient(135deg,#2563eb,#1d4ed8)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{color:"#fff",fontSize:14,fontWeight:800}}>✦</span>
        </div>
        <div>
          <div style={{fontFamily:F,fontWeight:800,fontSize:13,color:"#1a2332",lineHeight:1.2}}>BackStOPS</div>
          <div style={{fontFamily:F,fontSize:9,fontWeight:600,color:"#94a3b8",letterSpacing:".1em",textTransform:"uppercase"}}>Compliance</div>
        </div>
      </div>
      <nav style={{flex:1,padding:"8px 8px",overflowY:"auto"}}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setView(n.id)} style={{
            display:"flex",alignItems:"center",gap:8,width:"100%",padding:"7px 10px",borderRadius:8,border:"none",cursor:"pointer",
            background:view===n.id?"#eff6ff":"transparent",color:view===n.id?"#2563eb":"#64748b",
            fontFamily:F,fontWeight:view===n.id?600:400,fontSize:13,textAlign:"left",marginBottom:1,
          }}>
            <span style={{fontSize:13,opacity:.7}}>{n.icon}</span>{n.label}
          </button>
        ))}
      </nav>
      <div style={{padding:"10px 14px",borderTop:"1px solid #f1f5f9",display:"flex",alignItems:"center",gap:9}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:"#dbeafe",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F,fontSize:11,fontWeight:800,color:"#2563eb",flexShrink:0}}>A</div>
        <div>
          <div style={{fontFamily:F,fontSize:12,fontWeight:600,color:"#1a2332"}}>Alice Morgan</div>
          <div style={{fontFamily:F,fontSize:10,color:"#94a3b8"}}>Owner · Pro Plan</div>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD / ACTION CENTER ─────────────────────────────────────────────────

function Dashboard({bizs, items, setView, setItem}) {
  const [toast, setToast] = useState(null);

  if (bizs.length === 0) {
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:16,textAlign:"center"}}>
        <div style={{width:64,height:64,background:"#eff6ff",borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>⊞</div>
        <div style={{fontFamily:F,fontSize:20,fontWeight:800,color:"#1a2332"}}>No businesses yet</div>
        <div style={{fontFamily:F,fontSize:14,color:"#64748b",maxWidth:340,lineHeight:1.6}}>Add your first business to generate a compliance system and start tracking permits, licenses, and deadlines.</div>
        <Btn primary onClick={()=>setView("addBusiness")} style={{marginTop:8,padding:"10px 22px",fontSize:14}}>+ Add your first business</Btn>
      </div>
    );
  }

  const score      = healthScore(items);
  const scoreLabel = score>=90 ? "Healthy" : score>=70 ? "Needs Attention" : "At Risk";
  const scoreColor = score>=90 ? "#15803d" : score>=70 ? "#b45309" : "#b91c1c";
  const scoreBg    = score>=90 ? "#f0fdf4" : score>=70 ? "#fffbeb" : "#fef2f2";
  const scoreBd    = score>=90 ? "#bbf7d0" : score>=70 ? "#fde68a" : "#fecaca";

  const overdue = items.filter(isOverdue);
  const due7    = items.filter(i=>isDueSoon(i,7));
  const badDocs = items.filter(i=>i.reqDoc&&(i.docStatus==="missing"||i.docStatus==="expired"));

  const actionItems = [...items]
    .filter(i => i.status!=="Completed" && i.status!=="Not Applicable")
    .filter(i => isOverdue(i) || isDueSoon(i,7) || (i.reqDoc && i.docStatus!=="uploaded" && i.docStatus!=="n/a"))
    .sort((a,b) => {
      const ao=isOverdue(a)?0:1, bo=isOverdue(b)?0:1;
      if(ao!==bo) return ao-bo;
      const pO={Critical:0,High:1,Medium:2,Low:3};
      return pO[a.pri]-pO[b.pri];
    })
    .slice(0, 12);

  const bizOverview = bizs.map(biz => {
    const its      = items.filter(i=>i.biz===biz.id&&i.status!=="Completed");
    const ovCount  = its.filter(isOverdue).length;
    const docCount = its.filter(i=>i.reqDoc&&(i.docStatus==="missing"||i.docStatus==="expired")).length;
    const next     = [...its].sort((a,b)=>new Date(a.due)-new Date(b.due))[0];
    return {...biz, ovCount, docCount, next};
  });

  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      {toast&&<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:"#1a2332",color:"#fff",fontFamily:F,fontSize:13,fontWeight:600,padding:"10px 20px",borderRadius:10,zIndex:999,boxShadow:"0 4px 20px rgba(0,0,0,.2)"}}>{toast}</div>}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontFamily:F,fontSize:22,fontWeight:900,color:"#1a2332"}}>Action Center</div>
          <div style={{fontFamily:F,fontSize:12,color:"#94a3b8",marginTop:2}}>May 30, 2026 · {bizs.length} {bizs.length===1?"business":"businesses"}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn small onClick={()=>setView("addBusiness")}>+ Add Business</Btn>
          <Btn small>+ Add Item</Btn>
        </div>
      </div>

      <div style={{display:"flex",gap:12,alignItems:"stretch"}}>
        <div style={{background:scoreBg,border:`1px solid ${scoreBd}`,borderRadius:14,padding:"16px 22px",minWidth:200,flexShrink:0}}>
          <Lbl>Compliance Health</Lbl>
          <div style={{display:"flex",alignItems:"baseline",gap:10,margin:"8px 0 10px"}}>
            <span style={{fontFamily:F,fontSize:44,fontWeight:900,color:scoreColor,lineHeight:1}}>{score}</span>
            <span style={{fontFamily:F,fontSize:13,fontWeight:700,color:scoreColor}}>{scoreLabel}</span>
          </div>
          <div style={{height:4,background:"rgba(0,0,0,.08)",borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${score}%`,background:scoreColor,borderRadius:99}}/>
          </div>
        </div>
        {[
          {label:"Overdue",           val:overdue.length,  note:overdue.length>0?"Requires action":"All clear",      alert:overdue.length>0},
          {label:"Due in 7 Days",     val:due7.length,     note:due7.length>0?"This week":"Nothing urgent",          warn:due7.length>0},
          {label:"Missing / Expired", val:badDocs.length,  note:badDocs.length>0?"Documents needed":"Docs in order", warn:badDocs.length>0},
        ].map(s=>(
          <div key={s.label} style={{flex:1,background:"#fff",border:"1px solid #e8ecf0",borderRadius:14,padding:"16px 20px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
            <Lbl>{s.label}</Lbl>
            <div style={{fontFamily:F,fontSize:36,fontWeight:900,color:s.alert&&s.val>0?"#b91c1c":s.warn&&s.val>0?"#b45309":"#94a3b8",lineHeight:1,margin:"8px 0 4px"}}>{s.val}</div>
            <div style={{fontFamily:F,fontSize:11,color:"#94a3b8"}}>{s.note}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:"#1a2332",marginBottom:10}}>
          Action Queue
          <span style={{fontFamily:F,fontSize:12,fontWeight:400,color:"#94a3b8",marginLeft:8}}>{actionItems.length} items</span>
        </div>
        <Card>
          {actionItems.length===0&&(
            <div style={{padding:"36px 20px",textAlign:"center",fontFamily:F,fontSize:13,color:"#94a3b8"}}>✓ No actions required right now.</div>
          )}
          {actionItems.map((item,idx)=>{
            const ov      = isOverdue(item);
            const days    = daysBetween(item.due);
            const verb    = taskVerb(item);
            const btn     = actionBtnLabel(item);
            const biz     = bizs.find(b=>b.id===item.biz);
            const isLast  = idx===actionItems.length-1;
            const notable = ov || item.status==="Waiting on Client" || item.status==="In Progress";
            return (
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 18px",borderBottom:isLast?"none":"1px solid #f1f5f9",background:ov?"#fffafa":"#fff"}}>
                <div style={{width:3,height:32,borderRadius:99,flexShrink:0,background:PRI_BAR[item.pri]||"#e2e8f0"}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:"#1a2332",marginBottom:2}}>{verb} {item.title}</div>
                  <div style={{fontFamily:F,fontSize:11,color:"#94a3b8"}}>
                    {biz?.name}
                    <span style={{margin:"0 5px"}}>·</span>
                    <span style={{color:ov?"#dc2626":days<=7?"#b45309":"#94a3b8",fontWeight:ov||days<=7?600:400}}>
                      {ov?`${Math.abs(days)}d overdue`:days===0?"Due today":days===1?"Due tomorrow":`Due ${fmtShort(item.due)}`}
                    </span>
                  </div>
                </div>
                {notable&&<Pill st={ov?"Overdue":item.status==="Waiting on Client"?"Waiting on Client":"In Progress"}/>}
                <button onClick={()=>{setItem(item);setView("detail");}} style={{fontFamily:F,fontSize:12,fontWeight:600,cursor:"pointer",padding:"6px 13px",borderRadius:8,whiteSpace:"nowrap",flexShrink:0,background:btn==="Upload"?"#2563eb":btn==="Send Reminder"?"#f59e0b":"#f8fafc",color:btn==="Upload"||btn==="Send Reminder"?"#fff":"#374151",border:btn==="Upload"||btn==="Send Reminder"?"none":"1px solid #e2e8f0"}}>{btn}</button>
              </div>
            );
          })}
        </Card>
      </div>

      <div>
        <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:"#1a2332",marginBottom:10}}>Businesses</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {bizOverview.map(biz=>(
            <div key={biz.id} onClick={()=>setView("businesses")} style={{background:"#fff",border:"1px solid #e8ecf0",borderRadius:14,padding:"16px 18px",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor="#cbd5e1"} onMouseLeave={e=>e.currentTarget.style.borderColor="#e8ecf0"}>
              <div style={{fontFamily:F,fontSize:14,fontWeight:700,color:"#1a2332",marginBottom:2}}>{biz.name}</div>
              <div style={{fontFamily:F,fontSize:11,color:"#94a3b8",marginBottom:14}}>{biz.type}</div>
              <div style={{display:"flex",gap:20,alignItems:"flex-end"}}>
                <div>
                  <div style={{fontFamily:F,fontSize:22,fontWeight:900,color:biz.ovCount>0?"#dc2626":"#94a3b8",lineHeight:1}}>{biz.ovCount}</div>
                  <div style={{fontFamily:F,fontSize:10,color:"#94a3b8",marginTop:2}}>Overdue</div>
                </div>
                <div>
                  <div style={{fontFamily:F,fontSize:22,fontWeight:900,color:biz.docCount>0?"#d97706":"#94a3b8",lineHeight:1}}>{biz.docCount}</div>
                  <div style={{fontFamily:F,fontSize:10,color:"#94a3b8",marginTop:2}}>Missing Docs</div>
                </div>
                {biz.next&&(
                  <div style={{marginLeft:"auto",textAlign:"right"}}>
                    <div style={{fontFamily:F,fontSize:12,color:"#475569",fontWeight:500}}>{fmtShort(biz.next.due)}</div>
                    <div style={{fontFamily:F,fontSize:10,color:"#94a3b8"}}>Next deadline</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── COMPLIANCE LIST ────────────────────────────────────────────────────────────

function ComplianceList({bizs, items, setItem, setView, bizFilter}) {
  const [search, setSearch] = useState("");
  const [st,     setSt]     = useState("all");
  const [pri,    setPri]    = useState("all");
  const [biz,    setBiz]    = useState(bizFilter||"all");

  const rows = items.filter(i=>{
    if(biz!=="all"&&i.biz!==biz) return false;
    if(st!=="all"&&effSt(i)!==st) return false;
    if(pri!=="all"&&i.pri!==pri) return false;
    if(search&&!i.title.toLowerCase().includes(search.toLowerCase())&&!i.cat.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a,b)=>{
    const ao=isOverdue(a)?1:0,bo=isOverdue(b)?1:0;
    if(ao!==bo) return bo-ao;
    const pO={Critical:0,High:1,Medium:2,Low:3};
    return pO[a.pri]-pO[b.pri];
  });

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <button onClick={()=>setView("businesses")} style={{fontFamily:F,background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:13,padding:0,marginBottom:6,display:"flex",alignItems:"center",gap:4}}>← Businesses</button>
          <div style={{fontFamily:F,fontSize:22,fontWeight:900,color:"#1a2332"}}>Compliance Items</div>
          <div style={{fontFamily:F,fontSize:13,color:"#94a3b8"}}>{rows.length} of {items.length} items</div>
        </div>
        <Btn primary small>+ Add Item</Btn>
      </div>
      <Card>
        <div style={{padding:"10px 14px",display:"flex",gap:8,flexWrap:"wrap"}}>
          <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{flex:"2 1 140px"}}/>
          <Select value={biz} onChange={e=>setBiz(e.target.value)} style={{flex:"1 1 120px"}}>
            <option value="all">All Businesses</option>
            {bizs.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
          </Select>
          <Select value={st} onChange={e=>setSt(e.target.value)} style={{flex:"1 1 110px"}}>
            <option value="all">All Statuses</option>
            {["Overdue","Due Soon","In Progress","Not Started","Completed","Waiting on Client"].map(s=><option key={s}>{s}</option>)}
          </Select>
          <Select value={pri} onChange={e=>setPri(e.target.value)} style={{flex:"1 1 100px"}}>
            <option value="all">All Priorities</option>
            {["Critical","High","Medium","Low"].map(p=><option key={p}>{p}</option>)}
          </Select>
        </div>
      </Card>
      <Card>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:"#f8fafc",borderBottom:"1px solid #e8ecf0"}}>
              {["Item","Business","Category","Due Date","Status"].map(h=>(
                <th key={h} style={{padding:"8px 14px",textAlign:"left",fontFamily:F,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#64748b"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(item=>{
              const ov=isOverdue(item);
              return (
                <tr key={item.id} onClick={()=>{setItem(item);setView("detail");}} style={{borderBottom:"1px solid #f8fafc",cursor:"pointer",background:ov?"#fffafa":"#fff"}} onMouseEnter={e=>e.currentTarget.style.background=ov?"#fef2f2":"#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background=ov?"#fffafa":"#fff"}>
                  <td style={{padding:"10px 14px"}}>
                    <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:"#1a2332"}}>{item.title}</div>
                    {item.reqDoc&&item.docStatus==="missing"&&<div style={{fontFamily:F,fontSize:10,color:"#f97316",marginTop:1}}>⚠ Missing document</div>}
                  </td>
                  <td style={{padding:"10px 14px",fontFamily:F,fontSize:12,color:"#475569"}}>{bizs.find(b=>b.id===item.biz)?.name}</td>
                  <td style={{padding:"10px 14px",fontFamily:F,fontSize:11,color:"#64748b"}}>{item.cat}</td>
                  <td style={{padding:"10px 14px",fontFamily:F,fontSize:12,fontWeight:ov?700:400,color:ov?"#dc2626":"#475569"}}>{fmt(item.due)}</td>
                  <td style={{padding:"10px 14px"}}><Pill st={effSt(item)}/></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length===0&&<div style={{padding:"32px 14px",textAlign:"center",fontFamily:F,fontSize:13,color:"#94a3b8"}}>No items match these filters.</div>}
      </Card>
    </div>
  );
}

// ── DETAIL ────────────────────────────────────────────────────────────────────

function Detail({bizs, item, setView, backView="dashboard"}) {
  const [done, setDone] = useState(item.status==="Completed");
  const biz  = bizs.find(b=>b.id===item.biz);
  const days = daysBetween(item.due);
  const ov   = isOverdue(item);
  const docS = DS[item.docStatus]??DS["n/a"];
  const logs = [
    {date:d(-2),  actor:"Alice Morgan",  action:"Changed status to In Progress"},
    {date:d(-5),  actor:"Jordan Rivera", action:"Sent renewal reminder to client"},
    {date:d(-12), actor:"System",        action:"Compliance item created"},
  ];
  return (
    <div style={{maxWidth:760,display:"flex",flexDirection:"column",gap:16}}>
      <button onClick={()=>setView(backView)} style={{fontFamily:F,background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:13,textAlign:"left",display:"flex",alignItems:"center",gap:4,padding:0}}>← Back</button>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div>
          <div style={{fontFamily:F,fontSize:20,fontWeight:900,color:"#1a2332",marginBottom:8}}>{item.title}</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <Pill st={done?"Completed":effSt(item)}/>
            <span style={{fontFamily:F,background:"#f1f5f9",color:"#475569",borderRadius:999,padding:"2px 8px",fontSize:11,fontWeight:600}}>{item.cat}</span>
            <span style={{fontFamily:F,background:"#f1f5f9",color:"#475569",borderRadius:999,padding:"2px 8px",fontSize:11,fontWeight:600}}>{item.freq}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexShrink:0}}>
          {!done&&<Btn primary small onClick={()=>setDone(true)}>✓ Mark Complete</Btn>}
          <Btn small>Edit</Btn>
        </div>
      </div>
      {ov&&!done&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"10px 14px",fontFamily:F,fontSize:13,fontWeight:600,color:"#b91c1c"}}>⚠ This item is {Math.abs(days)} days overdue.</div>}
      {done&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"10px 14px",fontFamily:F,fontSize:13,fontWeight:600,color:"#15803d"}}>✓ Marked as complete.</div>}

      <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:16}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card>
            <CardHd>Item Details</CardHd>
            {[
              ["Business",     biz?.name],
              ["Contact",      biz?.contact],
              ["Category",     item.cat],
              ["Jurisdiction", biz?.state],
              ["Agency",       item.cat.includes("TTB")?"Alcohol and Tobacco Tax and Trade Bureau":item.cat.includes("FDA")?"U.S. Food and Drug Administration":"Relevant Agency"],
              ["Frequency",    item.freq],
              ["Reminder",     "30 days before due date"],
            ].map(([label,val])=>(
              <div key={label} style={{display:"flex",gap:16,padding:"8px 16px",borderBottom:"1px solid #f8fafc"}}>
                <dt style={{width:150,flexShrink:0,fontFamily:F,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",color:"#94a3b8",paddingTop:1}}>{label}</dt>
                <dd style={{fontFamily:F,fontSize:13,color:"#1a2332",margin:0}}>{val||"—"}</dd>
              </div>
            ))}
          </Card>
          <Card>
            <CardHd>Dates</CardHd>
            {[
              ["Due Date",       item.due,  ov&&!done],
              ["Renewal Date",   d(350),    false],
              ["Last Completed", d(-365),   false],
            ].map(([label,val,highlight])=>(
              <div key={label} style={{display:"flex",gap:16,padding:"8px 16px",borderBottom:"1px solid #f8fafc"}}>
                <dt style={{width:150,flexShrink:0,fontFamily:F,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",color:"#94a3b8"}}>{label}</dt>
                <dd style={{fontFamily:F,fontSize:13,color:highlight?"#dc2626":"#1a2332",fontWeight:highlight?700:400,margin:0}}>{fmt(val)}</dd>
              </div>
            ))}
          </Card>
          {item.reqDoc&&(
            <Card>
              <CardHd>Document</CardHd>
              <div style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:14}}>
                <span style={{fontFamily:F,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",color:"#94a3b8",width:150,flexShrink:0}}>Status</span>
                <span style={{fontFamily:F,background:docS.bg,color:docS.tx,borderRadius:999,padding:"3px 10px",fontSize:11,fontWeight:600}}>{docS.label}</span>
                {item.docStatus==="uploaded"
                  ? <span style={{fontFamily:F,fontSize:11,color:"#64748b"}}>license_2026.pdf</span>
                  : <button style={{fontFamily:F,fontSize:12,fontWeight:600,color:"#fff",background:"#2563eb",border:"none",borderRadius:7,padding:"5px 12px",cursor:"pointer"}}>Upload Document</button>
                }
              </div>
            </Card>
          )}
          <Card>
            <CardHd>Activity</CardHd>
            {logs.map((log,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"9px 16px",borderBottom:"1px solid #f8fafc",alignItems:"flex-start"}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F,fontSize:10,fontWeight:700,color:"#475569",flexShrink:0}}>{log.actor[0]}</div>
                <div>
                  <div style={{fontFamily:F,fontSize:12,color:"#1a2332"}}><strong>{log.actor}</strong> — {log.action}</div>
                  <div style={{fontFamily:F,fontSize:10,color:"#94a3b8",marginTop:2}}>{fmt(log.date)}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card>
            <CardHd>Actions</CardHd>
            <div style={{padding:"10px 12px",display:"flex",flexDirection:"column",gap:5}}>
              {[
                {label:"✓ Mark Complete",    c:"#15803d",bg:"#f0fdf4",bd:"#bbf7d0",action:()=>setDone(true)},
                {label:"↻ Set Renewal Date", c:"#374151",bg:"#f8fafc",bd:"#e2e8f0"},
                {label:"+ Add Note",         c:"#374151",bg:"#f8fafc",bd:"#e2e8f0"},
                {label:"Edit Item",          c:"#374151",bg:"#f8fafc",bd:"#e2e8f0"},
                {label:"Delete",             c:"#dc2626",bg:"#fef2f2",bd:"#fecaca"},
              ].map(a=>(
                <button key={a.label} onClick={a.action} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 11px",borderRadius:8,border:`1px solid ${a.bd}`,background:a.bg,color:a.c,fontFamily:F,fontSize:12,fontWeight:600,cursor:"pointer",textAlign:"left"}}>{a.label}</button>
              ))}
            </div>
          </Card>
          <div style={{background:"#f8fafc",border:"1px solid #e8ecf0",borderRadius:12,padding:14}}>
            <div style={{fontFamily:F,fontSize:11,color:"#94a3b8",lineHeight:1.6}}>Always verify current requirements directly with the issuing agency before filing or renewing.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── BUSINESSES ────────────────────────────────────────────────────────────────

function Businesses({bizs, items, setView, setBizFilter}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontFamily:F,fontSize:22,fontWeight:900,color:"#1a2332"}}>Businesses</div>
          <div style={{fontFamily:F,fontSize:13,color:"#94a3b8"}}>{bizs.length} {bizs.length===1?"business":"businesses"} under management</div>
        </div>
        <Btn primary small onClick={()=>setView("addBusiness")}>+ Add Business</Btn>
      </div>
      {bizs.length===0&&(
        <div style={{textAlign:"center",padding:"48px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <div style={{fontSize:36}}>⊞</div>
          <div style={{fontFamily:F,fontSize:15,fontWeight:700,color:"#1a2332"}}>No businesses yet</div>
          <div style={{fontFamily:F,fontSize:13,color:"#64748b",maxWidth:320}}>Add your first business to generate a compliance system.</div>
          <Btn primary onClick={()=>setView("addBusiness")} style={{marginTop:4}}>+ Add your first business</Btn>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {bizs.map(biz=>{
          const its  = items.filter(i=>i.biz===biz.id);
          const ov   = its.filter(isOverdue).length;
          const d30  = its.filter(i=>isDueSoon(i,30)).length;
          const docs = its.filter(i=>i.reqDoc&&(i.docStatus==="missing"||i.docStatus==="expired")).length;
          const next = [...its].filter(i=>i.status!=="Completed").sort((a,b)=>new Date(a.due)-new Date(b.due))[0];
          return (
            <div key={biz.id} style={{background:"#fff",border:"1px solid #e8ecf0",borderRadius:14,padding:18,display:"flex",flexDirection:"column",gap:0}} onMouseEnter={e=>e.currentTarget.style.borderColor="#cbd5e1"} onMouseLeave={e=>e.currentTarget.style.borderColor="#e8ecf0"}>
              <div style={{marginBottom:10}}>
                <div style={{fontFamily:F,fontSize:15,fontWeight:800,color:"#1a2332"}}>{biz.name}</div>
                <div style={{fontFamily:F,fontSize:11,color:"#94a3b8",marginTop:2}}>{biz.type} · {biz.city}, {biz.state}</div>
              </div>
              <div style={{fontFamily:F,fontSize:11,color:"#94a3b8",marginBottom:14}}>Contact: {biz.contact}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,background:"#f8fafc",borderRadius:10,padding:"10px 8px",marginBottom:14}}>
                {[
                  {l:"Overdue",  v:ov,   c:ov>0?"#dc2626":"#94a3b8"},
                  {l:"Due 30d",  v:d30,  c:d30>0?"#d97706":"#94a3b8"},
                  {l:"Docs",     v:docs, c:docs>0?"#ea580c":"#94a3b8"},
                ].map(s=>(
                  <div key={s.l} style={{textAlign:"center"}}>
                    <div style={{fontFamily:F,fontSize:20,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
                    <div style={{fontFamily:F,fontSize:9,color:"#94a3b8",marginTop:2}}>{s.l}</div>
                  </div>
                ))}
              </div>
              {next&&<div style={{fontFamily:F,fontSize:11,color:"#94a3b8",marginBottom:12}}>Next: <span style={{color:"#475569",fontWeight:500}}>{next.title}</span> · {fmtShort(next.due)}</div>}
              <button onClick={()=>{setBizFilter(biz.id);setView("compliance");}} style={{fontFamily:F,fontSize:12,fontWeight:600,color:"#2563eb",background:"none",border:"1px solid #bfdbfe",borderRadius:8,padding:"7px 0",cursor:"pointer",marginTop:"auto"}}>View compliance items →</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── CALENDAR ──────────────────────────────────────────────────────────────────

function Calendar({bizs, items}) {
  const [mode, setMode] = useState("month");
  const [biz,  setBiz]  = useState("all");
  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const cells = [null];
  for(let i=1;i<=30;i++) cells.push(i);
  while(cells.length%7!==0) cells.push(null);
  const filtered = items.filter(i=>(biz==="all"||i.biz===biz)&&i.status!=="Completed");
  const getDay   = day => { if(!day) return []; const iso=`2026-06-${String(day).padStart(2,"0")}`; return filtered.filter(i=>i.due===iso); };
  const upcoming = [...filtered].sort((a,b)=>new Date(a.due)-new Date(b.due)).slice(0,14);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontFamily:F,fontSize:22,fontWeight:900,color:"#1a2332"}}>Calendar</div>
          <div style={{fontFamily:F,fontSize:13,color:"#94a3b8"}}>Compliance deadlines and renewal dates</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <Select value={biz} onChange={e=>setBiz(e.target.value)}>
            <option value="all">All Businesses</option>
            {bizs.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
          </Select>
          <div style={{display:"flex",background:"#f1f5f9",borderRadius:8,padding:2,gap:2}}>
            {["month","list"].map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{fontFamily:F,background:mode===m?"#fff":"transparent",color:mode===m?"#1a2332":"#64748b",border:mode===m?"1px solid #e2e8f0":"1px solid transparent",borderRadius:7,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer"}}>{m==="month"?"Monthly":"List"}</button>
            ))}
          </div>
        </div>
      </div>
      {mode==="month"&&(
        <Card>
          <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #e8ecf0"}}>
            <button style={{fontFamily:F,background:"none",border:"1px solid #e2e8f0",borderRadius:7,padding:"4px 10px",cursor:"pointer",fontSize:13,color:"#475569"}}>‹ May</button>
            <span style={{fontFamily:F,fontSize:14,fontWeight:700,color:"#1a2332"}}>June 2026</span>
            <button style={{fontFamily:F,background:"none",border:"1px solid #e2e8f0",borderRadius:7,padding:"4px 10px",cursor:"pointer",fontSize:13,color:"#475569"}}>Jul ›</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
            {DAYS.map(day=><div key={day} style={{padding:"7px 0",textAlign:"center",fontFamily:F,fontSize:10,fontWeight:700,color:"#94a3b8",borderBottom:"1px solid #f1f5f9",letterSpacing:".04em"}}>{day}</div>)}
            {cells.map((day,i)=>{
              const its=getDay(day);
              return (
                <div key={i} style={{minHeight:68,padding:"5px 5px",borderRight:i%7!==6?"1px solid #f8fafc":"none",borderBottom:"1px solid #f8fafc",background:!day?"#fafafa":"#fff"}}>
                  {day&&<>
                    <div style={{fontFamily:F,fontSize:11,color:"#475569",marginBottom:3}}>{day}</div>
                    {its.slice(0,2).map(it=>{const ov=isOverdue(it);return <div key={it.id} style={{fontFamily:F,fontSize:9,fontWeight:600,padding:"2px 4px",borderRadius:3,marginBottom:2,background:ov?"#fef2f2":isDueSoon(it,7)?"#fffbeb":"#eff6ff",color:ov?"#b91c1c":isDueSoon(it,7)?"#b45309":"#1d4ed8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.title}</div>;})}
                    {its.length>2&&<div style={{fontFamily:F,fontSize:9,color:"#94a3b8"}}>+{its.length-2}</div>}
                  </>}
                </div>
              );
            })}
          </div>
        </Card>
      )}
      {mode==="list"&&(
        <Card>
          <CardHd>Upcoming Deadlines</CardHd>
          {upcoming.map(item=>{
            const days=daysBetween(item.due);const ov=isOverdue(item);
            return (
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderBottom:"1px solid #f8fafc"}}>
                <div style={{width:40,height:40,background:ov?"#fef2f2":days<=7?"#fffbeb":"#f8fafc",borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <div style={{fontFamily:F,fontSize:14,fontWeight:900,color:ov?"#b91c1c":days<=7?"#b45309":"#475569",lineHeight:1}}>{new Date(item.due+"T12:00:00").getDate()}</div>
                  <div style={{fontFamily:F,fontSize:8,color:"#94a3b8",textTransform:"uppercase"}}>{new Date(item.due+"T12:00:00").toLocaleString("en-US",{month:"short"})}</div>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:"#1a2332",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.title}</div>
                  <div style={{fontFamily:F,fontSize:11,color:"#94a3b8",marginTop:1}}>{bizs.find(b=>b.id===item.biz)?.name}</div>
                </div>
                <Pill st={effSt(item)}/>
                <div style={{fontFamily:F,fontSize:11,fontWeight:600,color:ov?"#dc2626":days<=7?"#d97706":"#94a3b8",minWidth:70,textAlign:"right"}}>
                  {ov?`${Math.abs(days)}d overdue`:days===0?"Today":days===1?"Tomorrow":`${days}d away`}
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

// ── DOCUMENTS ─────────────────────────────────────────────────────────────────

function Documents({bizs, items}) {
  const [filter, setFilter] = useState("all");
  const [biz,    setBiz]    = useState("all");
  const docItems = items.filter(i=>i.reqDoc);
  const counts = {
    all:     docItems.length,
    missing: docItems.filter(i=>i.docStatus==="missing").length,
    expired: docItems.filter(i=>i.docStatus==="expired").length,
    uploaded:docItems.filter(i=>i.docStatus==="uploaded").length,
  };
  const filtered = docItems.filter(i=>(biz==="all"||i.biz===biz)&&(filter==="all"||i.docStatus===filter));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontFamily:F,fontSize:22,fontWeight:900,color:"#1a2332"}}>Documents</div>
          <div style={{fontFamily:F,fontSize:13,color:"#94a3b8"}}>Required compliance documents across all businesses</div>
        </div>
        <Select value={biz} onChange={e=>setBiz(e.target.value)}>
          <option value="all">All Businesses</option>
          {bizs.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
        </Select>
      </div>
      <div style={{display:"flex",gap:10}}>
        {[
          {key:"all",     label:"Total",   val:counts.all,     bg:"#f8fafc",tx:"#475569",bd:"#e8ecf0"},
          {key:"missing", label:"Missing", val:counts.missing, bg:"#fef2f2",tx:"#b91c1c",bd:"#fecaca"},
          {key:"expired", label:"Expired", val:counts.expired, bg:"#fffbeb",tx:"#b45309",bd:"#fde68a"},
          {key:"uploaded",label:"On File", val:counts.uploaded,bg:"#f0fdf4",tx:"#15803d",bd:"#bbf7d0"},
        ].map(s=>(
          <div key={s.key} onClick={()=>setFilter(s.key)} style={{flex:1,background:s.bg,border:`1px solid ${filter===s.key?s.tx:s.bd}`,borderRadius:12,padding:"14px 16px",cursor:"pointer"}}>
            <Lbl style={{color:s.tx}}>{s.label}</Lbl>
            <div style={{fontFamily:F,fontSize:30,fontWeight:900,color:s.tx,lineHeight:1.1,margin:"4px 0 2px"}}>{s.val}</div>
            <div style={{fontFamily:F,fontSize:10,color:s.tx,opacity:.6}}>{filter===s.key?"Showing now":"Click to filter"}</div>
          </div>
        ))}
      </div>
      <Card>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:"#f8fafc",borderBottom:"1px solid #e8ecf0"}}>
              {["Document","Business","Due Date","Status",""].map(h=>(
                <th key={h} style={{padding:"8px 14px",textAlign:"left",fontFamily:F,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#64748b"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item=>{
              const docS=DS[item.docStatus]??DS["n/a"];const ov=isOverdue(item);
              return (
                <tr key={item.id} style={{borderBottom:"1px solid #f8fafc"}}>
                  <td style={{padding:"10px 14px"}}>
                    <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:"#1a2332"}}>{item.title}</div>
                    {ov&&<div style={{fontFamily:F,fontSize:10,color:"#dc2626",marginTop:1}}>⚠ Overdue</div>}
                  </td>
                  <td style={{padding:"10px 14px",fontFamily:F,fontSize:12,color:"#475569"}}>{bizs.find(b=>b.id===item.biz)?.name}</td>
                  <td style={{padding:"10px 14px",fontFamily:F,fontSize:12,fontWeight:ov?700:400,color:ov?"#dc2626":"#475569"}}>{fmt(item.due)}</td>
                  <td style={{padding:"10px 14px"}}><span style={{fontFamily:F,background:docS.bg,color:docS.tx,borderRadius:999,padding:"2px 8px",fontSize:11,fontWeight:600}}>{docS.label}</span></td>
                  <td style={{padding:"10px 14px"}}>
                    {item.docStatus==="uploaded"
                      ?<button style={{fontFamily:F,fontSize:11,fontWeight:600,color:"#2563eb",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:6,padding:"3px 9px",cursor:"pointer"}}>View</button>
                      :<button style={{fontFamily:F,fontSize:11,fontWeight:600,color:"#fff",background:"#2563eb",border:"none",borderRadius:6,padding:"3px 9px",cursor:"pointer"}}>Upload</button>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0&&<div style={{padding:"32px 14px",textAlign:"center",fontFamily:F,fontSize:13,color:"#94a3b8"}}>No documents match this filter.</div>}
      </Card>
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────

function Settings() {
  const [tab,     setTab]     = useState("profile");
  const [profile, setProfile] = useState({name:"Alice Morgan",email:"alice@designbyform.com",phone:"(202) 555-0142",role:"Owner"});
  const [saved,   setSaved]   = useState(false);
  const [notifs,  setNotifs]  = useState({emailReminders:true,overdueAlerts:true,weeklyDigest:true,documentExpiry:true,reminderDays:30});
  const [plan,    setPlan]    = useState("pro");

  const TABS  = [{id:"profile",label:"Profile"},{id:"notifications",label:"Notifications"},{id:"subscription",label:"Subscription"},{id:"team",label:"Team"}];
  const TEAM  = [
    {name:"Alice Morgan",  email:"alice@designbyform.com",  role:"Owner",     status:"Active"},
    {name:"Jordan Rivera", email:"jordan@designbyform.com", role:"Concierge", status:"Active"},
    {name:"Sam Torres",    email:"sam@designbyform.com",    role:"Viewer",    status:"Invited"},
  ];
  const PLANS = [
    {id:"basic",   name:"Basic Tracking",    price:"$199", features:["Up to 3 businesses","Unlimited items","Email reminders","Templates"]},
    {id:"pro",     name:"Managed Compliance",price:"$399", features:["Everything in Basic","Concierge review","Document collection","Priority alerts"],popular:true},
    {id:"premium", name:"Premium Ops",       price:"$799", features:["Multi-location","Dedicated manager","Custom calendar","API access"]},
  ];
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:700}}>
      <div>
        <div style={{fontFamily:F,fontSize:22,fontWeight:900,color:"#1a2332"}}>Settings</div>
        <div style={{fontFamily:F,fontSize:13,color:"#94a3b8"}}>Manage your account, notifications, and team</div>
      </div>
      <div style={{display:"flex",gap:2,background:"#f1f5f9",borderRadius:10,padding:3}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{fontFamily:F,flex:1,background:tab===t.id?"#fff":"transparent",color:tab===t.id?"#1a2332":"#64748b",border:tab===t.id?"1px solid #e2e8f0":"1px solid transparent",borderRadius:8,padding:"7px 0",fontSize:13,fontWeight:tab===t.id?600:400,cursor:"pointer"}}>{t.label}</button>
        ))}
      </div>
      {tab==="profile"&&(
        <Card>
          <CardHd>Profile Information</CardHd>
          <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[{label:"Full Name",key:"name"},{label:"Email Address",key:"email"},{label:"Phone",key:"phone"},{label:"Role",key:"role"}].map(({label,key})=>(
                <div key={key}>
                  <Lbl style={{display:"block",marginBottom:5}}>{label}</Lbl>
                  <Input value={profile[key]} onChange={e=>setProfile(p=>({...p,[key]:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center",paddingTop:6,borderTop:"1px solid #f1f5f9"}}>
              <Btn primary small onClick={save}>Save Changes</Btn>
              {saved&&<span style={{fontFamily:F,fontSize:12,color:"#15803d",fontWeight:600}}>✓ Saved</span>}
            </div>
          </div>
        </Card>
      )}
      {tab==="notifications"&&(
        <Card>
          <CardHd>Notification Preferences</CardHd>
          <div style={{padding:"4px 0"}}>
            {[
              {key:"emailReminders",label:"Email Reminders",       desc:"Send email reminders for upcoming due dates"},
              {key:"overdueAlerts", label:"Overdue Alerts",         desc:"Immediate alert when an item becomes overdue"},
              {key:"weeklyDigest",  label:"Weekly Digest",          desc:"Weekly summary of compliance status"},
              {key:"documentExpiry",label:"Document Expiry Alerts", desc:"Alert when documents are about to expire"},
            ].map(({key,label,desc})=>(
              <div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 20px",borderBottom:"1px solid #f8fafc"}}>
                <div>
                  <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:"#1a2332"}}>{label}</div>
                  <div style={{fontFamily:F,fontSize:11,color:"#94a3b8",marginTop:2}}>{desc}</div>
                </div>
                <div onClick={()=>setNotifs(p=>({...p,[key]:!p[key]}))} style={{width:38,height:22,background:notifs[key]?"#2563eb":"#d1d5db",borderRadius:99,position:"relative",cursor:"pointer",flexShrink:0}}>
                  <div style={{position:"absolute",top:2,left:notifs[key]?18:2,width:18,height:18,background:"#fff",borderRadius:"50%",transition:"left .15s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
                </div>
              </div>
            ))}
            <div style={{padding:"13px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:"#1a2332"}}>Default Reminder</div>
                <div style={{fontFamily:F,fontSize:11,color:"#94a3b8",marginTop:2}}>Days before due date to send first reminder</div>
              </div>
              <Select value={notifs.reminderDays} onChange={e=>setNotifs(p=>({...p,reminderDays:Number(e.target.value)}))}>
                {[7,14,21,30,45,60].map(n=><option key={n} value={n}>{n} days</option>)}
              </Select>
            </div>
          </div>
        </Card>
      )}
      {tab==="subscription"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{fontFamily:F,fontSize:13,color:"#64748b"}}>Current plan: <strong style={{color:"#2563eb"}}>Managed Compliance ($399/mo)</strong></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {PLANS.map(p=>(
              <div key={p.id} onClick={()=>setPlan(p.id)} style={{background:plan===p.id?"#eff6ff":"#fff",border:`${plan===p.id?"2px solid #2563eb":"1px solid #e8ecf0"}`,borderRadius:14,padding:"18px 16px",cursor:"pointer",position:"relative"}}>
                {p.popular&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",fontFamily:F,fontSize:10,fontWeight:700,background:"#2563eb",color:"#fff",padding:"2px 10px",borderRadius:99,whiteSpace:"nowrap"}}>Most Popular</div>}
                <div style={{fontFamily:F,fontSize:14,fontWeight:800,color:"#1a2332",marginBottom:3}}>{p.name}</div>
                <div style={{fontFamily:F,fontSize:26,fontWeight:900,color:plan===p.id?"#2563eb":"#1a2332",marginBottom:12}}>{p.price}<span style={{fontSize:12,fontWeight:400,color:"#94a3b8"}}>/mo</span></div>
                <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:5}}>
                  {p.features.map(f=><li key={f} style={{fontFamily:F,fontSize:11,color:"#475569",display:"flex",alignItems:"center",gap:5}}><span style={{color:"#22c55e"}}>✓</span>{f}</li>)}
                </ul>
                {plan===p.id&&<div style={{fontFamily:F,marginTop:10,fontSize:11,fontWeight:700,color:"#2563eb"}}>✓ Current Plan</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="team"&&(
        <Card>
          <CardHd right={<Btn primary small>+ Invite</Btn>}>Team Members</CardHd>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{borderBottom:"1px solid #f1f5f9",background:"#f8fafc"}}>
                {["Name","Email","Role","Status",""].map(h=><th key={h} style={{padding:"8px 14px",textAlign:"left",fontFamily:F,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#64748b"}}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {TEAM.map((m,i)=>(
                <tr key={i} style={{borderBottom:"1px solid #f8fafc"}}>
                  <td style={{padding:"11px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:"#dbeafe",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F,fontSize:11,fontWeight:800,color:"#2563eb",flexShrink:0}}>{m.name[0]}</div>
                      <span style={{fontFamily:F,fontSize:13,fontWeight:600,color:"#1a2332"}}>{m.name}</span>
                    </div>
                  </td>
                  <td style={{padding:"11px 14px",fontFamily:F,fontSize:12,color:"#64748b"}}>{m.email}</td>
                  <td style={{padding:"11px 14px"}}><span style={{fontFamily:F,background:"#f1f5f9",color:"#475569",borderRadius:999,padding:"2px 8px",fontSize:11,fontWeight:600}}>{m.role}</span></td>
                  <td style={{padding:"11px 14px"}}><span style={{fontFamily:F,background:m.status==="Active"?"#f0fdf4":"#f8fafc",color:m.status==="Active"?"#15803d":"#94a3b8",borderRadius:999,padding:"2px 8px",fontSize:11,fontWeight:600}}>{m.status}</span></td>
                  <td style={{padding:"11px 14px",textAlign:"right"}}>{m.role!=="Owner"&&<button style={{fontFamily:F,fontSize:11,color:"#94a3b8",background:"none",border:"none",cursor:"pointer"}}>Remove</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ── CONCIERGE VIEW ────────────────────────────────────────────────────────────

function Admin({bizs, items, setItem, setView}) {
  const overdue     = items.filter(isOverdue);
  const due7        = items.filter(i=>isDueSoon(i,7));
  const waitClient  = items.filter(i=>i.status==="Waiting on Client");
  const missingDocs = items.filter(i=>i.reqDoc&&i.docStatus==="missing");
  const [toast, setToast] = useState(null);
  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null),2200); };
  const ActionRow = ({item}) => {
    const biz=bizs.find(b=>b.id===item.biz);const ov=isOverdue(item);const days=daysBetween(item.due);
    return (
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderBottom:"1px solid #f8fafc"}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:F,fontSize:12,fontWeight:600,color:"#1a2332",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.title}</div>
          <div style={{fontFamily:F,fontSize:10,color:"#94a3b8",marginTop:1}}>{biz?.name} · {ov?`${Math.abs(days)}d overdue`:fmt(item.due)}</div>
        </div>
        <div style={{display:"flex",gap:5,flexShrink:0}}>
          <button onClick={()=>showToast(`Reminder sent to ${biz?.contact}`)} style={{fontFamily:F,fontSize:10,fontWeight:600,color:"#1d4ed8",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:6,padding:"3px 8px",cursor:"pointer"}}>Remind</button>
          <button onClick={()=>showToast("Document request sent")} style={{fontFamily:F,fontSize:10,fontWeight:600,color:"#c2410c",background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:6,padding:"3px 8px",cursor:"pointer"}}>Request</button>
          <button onClick={()=>showToast("Marked as reviewed")} style={{fontFamily:F,fontSize:10,fontWeight:600,color:"#15803d",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:6,padding:"3px 8px",cursor:"pointer"}}>Review</button>
        </div>
      </div>
    );
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {toast&&<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:"#1a2332",color:"#fff",fontFamily:F,fontSize:13,fontWeight:600,padding:"10px 20px",borderRadius:10,zIndex:999,boxShadow:"0 4px 20px rgba(0,0,0,.2)"}}>{toast}</div>}
      <div>
        <div style={{fontFamily:F,fontSize:22,fontWeight:900,color:"#1a2332"}}>Concierge View</div>
        <div style={{fontFamily:F,fontSize:13,color:"#94a3b8"}}>Internal dashboard for the compliance concierge team</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[
          {title:"Overdue",          items:overdue,     bg:"#fef2f2",bd:"#fecaca",tx:"#b91c1c"},
          {title:"Due in 7 Days",    items:due7,        bg:"#fffbeb",bd:"#fde68a",tx:"#b45309"},
          {title:"Waiting on Client",items:waitClient,  bg:"#fff7ed",bd:"#fed7aa",tx:"#c2410c"},
          {title:"Missing Documents",items:missingDocs, bg:"#fff7ed",bd:"#fed7aa",tx:"#c2410c"},
        ].map(s=>(
          <Card key={s.title}>
            <div style={{padding:"9px 14px",background:s.bg,borderBottom:`1px solid ${s.bd}`}}>
              <span style={{fontFamily:F,fontSize:13,fontWeight:700,color:s.tx}}>{s.title} ({s.items.length})</span>
            </div>
            {s.items.length===0
              ?<div style={{padding:"16px 14px",fontFamily:F,fontSize:12,color:"#94a3b8",textAlign:"center"}}>All clear ✓</div>
              :s.items.slice(0,5).map(i=><ActionRow key={i.id} item={i}/>)
            }
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── ADD BUSINESS WIZARD ───────────────────────────────────────────────────────

function AddBusinessWizard({setBizs, setItems, setView}) {
  const [step,    setStep]    = useState(1);
  const [form,    setForm]    = useState({name:"",type:"Restaurant",city:"",state:"",contact:"",email:""});
  const [list,    setList]    = useState([]);
  const [custom,  setCustom]  = useState("");
  const [created, setCreated] = useState(false);

  const tmpl = TMPLS.find(t => t.id === BIZ_TYPE_TMPL[form.type]);

  const goStep2 = () => {
    setList(tmpl ? tmpl.items.map(title => ({title, kept:true})) : []);
    setStep(2);
  };

  const addCustom = () => {
    const v = custom.trim();
    if (!v) return;
    setList(prev => [...prev, {title:v, kept:true, custom:true}]);
    setCustom("");
  };

  const create = () => {
    const bizId = `b${Date.now()}`;
    const newBiz = {...form, id: bizId};
    const newItems = list.filter(c=>c.kept).map((c,idx) => deriveItem(c.title, bizId, idx));
    setBizs(prev => [...prev, newBiz]);
    setItems(prev => [...prev, ...newItems]);
    setCreated(true);
    setTimeout(() => setView("businesses"), 900);
  };

  const step1Valid = form.name.trim() && form.city.trim() && form.state.trim() && form.contact.trim();
  const keptCount  = list.filter(c=>c.kept).length;
  const docCount   = list.filter(c=>c.kept && /insurance|license|permit|certificate|card|registration|agreement|bond/.test(c.title.toLowerCase())).length;

  const StepBar = () => (
    <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:24}}>
      {[1,2,3].map((n,i)=>(
        <div key={n} style={{display:"flex",alignItems:"center",flex:i<2?1:"auto"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:step>=n?"#2563eb":"#e2e8f0",color:step>=n?"#fff":"#94a3b8",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F,fontSize:12,fontWeight:700,flexShrink:0}}>{step>n?"✓":n}</div>
            <div style={{fontFamily:F,fontSize:10,fontWeight:600,color:step>=n?"#2563eb":"#94a3b8",whiteSpace:"nowrap"}}>{n===1?"Business Basics":n===2?"Compliance Checklist":"Review & Create"}</div>
          </div>
          {i<2&&<div style={{flex:1,height:2,background:step>n?"#2563eb":"#e2e8f0",margin:"0 8px",marginBottom:16}}/>}
        </div>
      ))}
    </div>
  );

  if (created) {
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:14,textAlign:"center"}}>
        <div style={{width:60,height:60,background:"#f0fdf4",border:"2px solid #bbf7d0",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>✓</div>
        <div style={{fontFamily:F,fontSize:18,fontWeight:800,color:"#1a2332"}}>Compliance system created!</div>
        <div style={{fontFamily:F,fontSize:13,color:"#64748b"}}>{form.name} · {keptCount} items generated</div>
      </div>
    );
  }

  return (
    <div style={{maxWidth:620,margin:"0 auto"}}>
      <div style={{marginBottom:20}}>
        <button onClick={()=>step===1?setView("businesses"):setStep(s=>s-1)} style={{fontFamily:F,background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:13,padding:0,display:"flex",alignItems:"center",gap:4}}>← {step===1?"Businesses":"Back"}</button>
        <div style={{fontFamily:F,fontSize:22,fontWeight:900,color:"#1a2332",marginTop:8}}>Add Business</div>
      </div>

      <StepBar/>

      {step===1&&(
        <Card>
          <CardHd>Business Basics</CardHd>
          <div style={{padding:"20px 20px",display:"flex",flexDirection:"column",gap:16}}>
            <div>
              <Lbl style={{display:"block",marginBottom:6}}>Business Name</Lbl>
              <Input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Light Sleeper Wine Bar" style={{width:"100%",boxSizing:"border-box"}}/>
            </div>
            <div>
              <Lbl style={{display:"block",marginBottom:6}}>Business Type</Lbl>
              <Select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={{width:"100%"}}>
                {BIZ_TYPES.map(t=><option key={t}>{t}</option>)}
              </Select>
              {tmpl&&<div style={{fontFamily:F,fontSize:11,color:"#64748b",marginTop:6}}>We'll suggest {tmpl.items.length} compliance items for a {form.type}.</div>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <Lbl style={{display:"block",marginBottom:6}}>City</Lbl>
                <Input value={form.city} onChange={e=>setForm(p=>({...p,city:e.target.value}))} placeholder="Washington" style={{width:"100%",boxSizing:"border-box"}}/>
              </div>
              <div>
                <Lbl style={{display:"block",marginBottom:6}}>State</Lbl>
                <Input value={form.state} onChange={e=>setForm(p=>({...p,state:e.target.value}))} placeholder="DC" style={{width:"100%",boxSizing:"border-box"}}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <Lbl style={{display:"block",marginBottom:6}}>Contact Name</Lbl>
                <Input value={form.contact} onChange={e=>setForm(p=>({...p,contact:e.target.value}))} placeholder="Sarah Chen" style={{width:"100%",boxSizing:"border-box"}}/>
              </div>
              <div>
                <Lbl style={{display:"block",marginBottom:6}}>Email</Lbl>
                <Input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="sarah@example.com" style={{width:"100%",boxSizing:"border-box"}}/>
              </div>
            </div>
            <div style={{paddingTop:8,borderTop:"1px solid #f1f5f9",display:"flex",justifyContent:"flex-end"}}>
              <Btn primary onClick={goStep2} style={{opacity:step1Valid?1:.5,cursor:step1Valid?"pointer":"default"}}>Continue →</Btn>
            </div>
          </div>
        </Card>
      )}

      {step===2&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card>
            <div style={{padding:"16px 20px 12px"}}>
              <div style={{fontFamily:F,fontSize:14,fontWeight:700,color:"#1a2332",marginBottom:4}}>
                {tmpl?.icon} Suggested items for {form.type}
              </div>
              <div style={{fontFamily:F,fontSize:12,color:"#64748b"}}>Keep what applies, remove what doesn't. You can always add or remove items later.</div>
            </div>
            <div style={{borderTop:"1px solid #f1f5f9"}}>
              {list.map((row,idx)=>(
                <div key={idx} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 20px",borderBottom:"1px solid #f8fafc",background:row.kept?"#fff":"#f8fafc",opacity:row.kept?1:.5}}>
                  <div style={{width:3,height:28,borderRadius:99,background:row.kept?"#2563eb":"#d1d5db",flexShrink:0}}/>
                  <div style={{flex:1,fontFamily:F,fontSize:13,fontWeight:500,color:row.kept?"#1a2332":"#94a3b8"}}>{row.title}</div>
                  {row.custom&&<span style={{fontFamily:F,fontSize:10,fontWeight:600,color:"#7c3aed",background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:999,padding:"1px 7px"}}>Custom</span>}
                  <button onClick={()=>setList(prev=>prev.map((r,i)=>i===idx?{...r,kept:!r.kept}:r))} style={{fontFamily:F,fontSize:11,fontWeight:600,cursor:"pointer",padding:"4px 10px",borderRadius:6,background:row.kept?"#fef2f2":"#f0fdf4",color:row.kept?"#b91c1c":"#15803d",border:row.kept?"1px solid #fecaca":"1px solid #bbf7d0",flexShrink:0}}>
                    {row.kept?"Remove":"Keep"}
                  </button>
                </div>
              ))}
            </div>
            <div style={{padding:"12px 20px",borderTop:"1px solid #f1f5f9",display:"flex",gap:8}}>
              <Input value={custom} onChange={e=>setCustom(e.target.value)} placeholder="Add a custom item…" onKeyDown={e=>e.key==="Enter"&&addCustom()} style={{flex:1}}/>
              <Btn small onClick={addCustom}>+ Add</Btn>
            </div>
          </Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 2px"}}>
            <div style={{fontFamily:F,fontSize:12,color:"#64748b"}}>{keptCount} of {list.length} items selected</div>
            <Btn primary onClick={()=>setStep(3)}>Review & Create →</Btn>
          </div>
        </div>
      )}

      {step===3&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card>
            <CardHd>Business Summary</CardHd>
            <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:8}}>
              {[
                ["Business Name", form.name],
                ["Type",          form.type],
                ["Location",      `${form.city}, ${form.state}`],
                ["Contact",       `${form.contact}${form.email?" · "+form.email:""}`],
              ].map(([label,val])=>(
                <div key={label} style={{display:"flex",gap:16}}>
                  <dt style={{width:130,flexShrink:0,fontFamily:F,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",color:"#94a3b8"}}>{label}</dt>
                  <dd style={{fontFamily:F,fontSize:13,color:"#1a2332",margin:0}}>{val||"—"}</dd>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHd>Compliance System</CardHd>
            <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"flex",gap:20}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontFamily:F,fontSize:32,fontWeight:900,color:"#2563eb",lineHeight:1}}>{keptCount}</div>
                  <div style={{fontFamily:F,fontSize:11,color:"#94a3b8",marginTop:2}}>Compliance items</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontFamily:F,fontSize:32,fontWeight:900,color:"#ea580c",lineHeight:1}}>{docCount}</div>
                  <div style={{fontFamily:F,fontSize:11,color:"#94a3b8",marginTop:2}}>Require documents</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontFamily:F,fontSize:32,fontWeight:900,color:"#64748b",lineHeight:1}}>{fmt(d(90))}</div>
                  <div style={{fontFamily:F,fontSize:11,color:"#94a3b8",marginTop:2}}>First deadlines set</div>
                </div>
              </div>
              <div style={{background:"#f8fafc",border:"1px solid #e8ecf0",borderRadius:8,padding:"10px 14px",fontFamily:F,fontSize:12,color:"#64748b",lineHeight:1.6}}>
                Initial deadlines are set to 90 days from today. You can adjust individual deadlines after setup.
              </div>
            </div>
          </Card>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",padding:"4px 2px"}}>
            <Btn onClick={()=>setStep(2)}>← Back</Btn>
            <button onClick={create} style={{fontFamily:F,background:"#2563eb",color:"#fff",border:"none",borderRadius:8,padding:"10px 24px",fontSize:14,fontWeight:700,cursor:"pointer"}}>Create Compliance System</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── LANDING ───────────────────────────────────────────────────────────────────

function Landing({setView}) {
  return (
    <div style={{fontFamily:F,minHeight:"100%",background:"#fff",display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 48px",borderBottom:"1px solid #e8ecf0",position:"sticky",top:0,background:"#fff",zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:30,height:30,background:"linear-gradient(135deg,#2563eb,#1d4ed8)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"#fff",fontSize:14,fontWeight:800}}>✦</span>
          </div>
          <span style={{fontWeight:900,fontSize:15,color:"#1a2332"}}>BackStOPS <span style={{color:"#94a3b8",fontWeight:400}}>Compliance</span></span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>setView("dashboard")}>Sign in</Btn>
          <Btn primary onClick={()=>setView("dashboard")}>Start Free Trial →</Btn>
        </div>
      </div>
      <div style={{textAlign:"center",padding:"72px 48px 60px",background:"#f8fafc"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#eff6ff",color:"#2563eb",border:"1px solid #bfdbfe",borderRadius:999,padding:"4px 14px",fontSize:11,fontWeight:700,marginBottom:22}}>⚡ Built for regulated small businesses</div>
        <h1 style={{fontSize:44,fontWeight:900,color:"#1a2332",lineHeight:1.12,margin:"0 0 18px"}}>Compliance tracking for<br/><span style={{color:"#2563eb"}}>small regulated businesses.</span></h1>
        <p style={{fontSize:16,color:"#64748b",maxWidth:540,margin:"0 auto 36px",lineHeight:1.65}}>Track permits, renewals, insurance certs, licenses, tax deadlines, and required filings — all in one dashboard built for restaurants, bars, importers, food trucks, and more.</p>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <button onClick={()=>setView("dashboard")} style={{fontFamily:F,background:"#2563eb",color:"#fff",border:"none",borderRadius:10,padding:"13px 28px",fontSize:15,fontWeight:700,cursor:"pointer"}}>✦ Open Action Center</button>
          <button onClick={()=>setView("admin")} style={{fontFamily:F,background:"#fff",color:"#374151",border:"1px solid #d1d5db",borderRadius:10,padding:"13px 24px",fontSize:15,fontWeight:600,cursor:"pointer"}}>Concierge View →</button>
        </div>
        <p style={{fontSize:11,color:"#94a3b8",marginTop:16}}>No credit card required · Cancel anytime · ABRA, TTB, FDA, city permits covered</p>
      </div>
      <div style={{padding:"56px 48px"}}>
        <h2 style={{textAlign:"center",fontSize:26,fontWeight:900,color:"#1a2332",marginBottom:8}}>The cost of missed compliance is real.</h2>
        <p style={{textAlign:"center",color:"#64748b",fontSize:14,marginBottom:36}}>Every small business operator has a story about a surprise fine or lapsed permit.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,maxWidth:880,margin:"0 auto"}}>
          {[
            ["⚠","Missed renewals mean fines and shutdowns.","One lapsed liquor license can shut down a wine bar for weeks. One expired contractor bond can void every open job."],
            ["⏱","Compliance is a second full-time job.","Between state agencies, city permits, insurance renewals, and federal filings — spreadsheets aren't working."],
            ["📂","Your documents are nowhere.","Where's your Certificate of Insurance? Your health permit? Your current ABRA license? If you're not sure, you're exposed."],
          ].map(([icon,title,desc])=>(
            <div key={title} style={{background:"#f8fafc",border:"1px solid #e8ecf0",borderRadius:14,padding:22}}>
              <div style={{fontSize:24,marginBottom:10}}>{icon}</div>
              <div style={{fontFamily:F,fontSize:14,fontWeight:700,color:"#1a2332",marginBottom:7}}>{title}</div>
              <div style={{fontFamily:F,fontSize:12,color:"#64748b",lineHeight:1.65}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"48px 48px 64px",background:"#f8fafc"}}>
        <h2 style={{textAlign:"center",fontSize:26,fontWeight:900,color:"#1a2332",marginBottom:8}}>Simple, transparent pricing.</h2>
        <p style={{textAlign:"center",color:"#64748b",fontSize:14,marginBottom:36}}>The right level of support for your operation.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,maxWidth:840,margin:"0 auto"}}>
          {[
            {name:"Basic Tracking",    price:"$199",desc:"Self-service tracking",       features:["Unlimited compliance items","Overdue & renewal alerts","7 business templates","Document tracking"],hl:false},
            {name:"Managed Compliance",price:"$399",desc:"Tracking + concierge support",features:["Everything in Basic","Monthly compliance review","Document collection","Priority alerts & escalation"],hl:true},
            {name:"Premium Regulated", price:"$799",desc:"Multi-location operations",   features:["Multi-location dashboard","Dedicated account manager","Custom compliance calendar","Direct agency liaison"],hl:false},
          ].map(p=>(
            <div key={p.name} style={{background:p.hl?"#2563eb":"#fff",border:p.hl?"2px solid #1d4ed8":"1px solid #e8ecf0",borderRadius:16,padding:24,transform:p.hl?"scale(1.03)":"none"}}>
              <div style={{fontFamily:F,fontSize:15,fontWeight:800,color:p.hl?"#fff":"#1a2332",marginBottom:3}}>{p.name}</div>
              <div style={{fontFamily:F,fontSize:11,color:p.hl?"#bfdbfe":"#64748b",marginBottom:14}}>{p.desc}</div>
              <div style={{fontFamily:F,fontSize:32,fontWeight:900,color:p.hl?"#fff":"#1a2332",marginBottom:18}}>{p.price}<span style={{fontSize:13,fontWeight:400,color:p.hl?"#93c5fd":"#94a3b8"}}>/mo</span></div>
              <ul style={{listStyle:"none",padding:0,margin:"0 0 20px",display:"flex",flexDirection:"column",gap:7}}>
                {p.features.map(f=><li key={f} style={{fontFamily:F,fontSize:12,color:p.hl?"#dbeafe":"#475569",display:"flex",alignItems:"center",gap:7}}><span style={{color:p.hl?"#93c5fd":"#22c55e"}}>✓</span>{f}</li>)}
              </ul>
              <button onClick={()=>setView("dashboard")} style={{fontFamily:F,width:"100%",background:p.hl?"#fff":"#1a2332",color:p.hl?"#2563eb":"#fff",border:"none",borderRadius:9,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>Get Started</button>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"18px 48px",borderTop:"1px solid #e8ecf0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:F,fontWeight:800,fontSize:13,color:"#1a2332"}}>BackStOPS Compliance</span>
        <p style={{fontFamily:F,fontSize:10,color:"#94a3b8",maxWidth:500,textAlign:"right",margin:0}}><strong>Disclaimer:</strong> BackStOPS helps organize compliance tasks and reminders. It does not provide legal, tax, or regulatory advice. Always verify requirements with the relevant agency or a qualified professional.</p>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────

export default function BackStOPSApp() {
  const [view,      setView]      = useState("landing");
  const [item,      setItem]      = useState(null);
  const [bizFilter, setBizFilter] = useState("all");
  const [bizs,      setBizs]      = useState(INIT_BIZS);
  const [items,     setItems]     = useState(INIT_ITEMS);

  const nav = v => { setView(v); if(v!=="detail"&&v!=="compliance") setItem(null); };

  if(view==="landing") {
    return <div style={{fontFamily:F,minHeight:"100vh",background:"#fff"}}><Landing setView={nav}/></div>;
  }

  return (
    <div style={{fontFamily:F,display:"flex",height:"100vh",overflow:"hidden",background:"#f1f5f9"}}>
      <Sidebar view={view} setView={nav}/>
      <main style={{flex:1,overflowY:"auto",padding:"28px 32px"}}>
        {view==="dashboard"   && <Dashboard   bizs={bizs} items={items} setView={nav} setItem={setItem}/>}
        {view==="businesses"  && <Businesses  bizs={bizs} items={items} setView={nav} setBizFilter={setBizFilter}/>}
        {view==="compliance"  && <ComplianceList bizs={bizs} items={items} setItem={setItem} setView={nav} bizFilter={bizFilter}/>}
        {view==="detail"      && item && <Detail bizs={bizs} item={item} setView={nav} backView="dashboard"/>}
        {view==="calendar"    && <Calendar    bizs={bizs} items={items}/>}
        {view==="documents"   && <Documents   bizs={bizs} items={items}/>}
        {view==="settings"    && <Settings/>}
        {view==="admin"       && <Admin       bizs={bizs} items={items} setItem={setItem} setView={nav}/>}
        {view==="addBusiness" && <AddBusinessWizard setBizs={setBizs} setItems={setItems} setView={nav}/>}
      </main>
    </div>
  );
}
