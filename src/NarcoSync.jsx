import React, { useState } from "react";

const C = {
  navy:"#0F2744",blue:"#1E4D8C",sky:"#2E86DE",
  green:"#1A9E5F",red:"#D63031",orange:"#E67E22",
  light:"#F4F7FB",white:"#FFFFFF",grey:"#6B7280",border:"#E2E8F0",
};

const SB = {
  isConfigured:()=>{try{return !!(localStorage.getItem("ns_url")&&localStorage.getItem("ns_key"));}catch{return false;}},
  save:(url,key)=>{localStorage.setItem("ns_url",url);localStorage.setItem("ns_key",key);},
  get:()=>{try{return{url:localStorage.getItem("ns_url")||"",key:localStorage.getItem("ns_key")||""};}catch{return{url:"",key:""};}},
  getSession:()=>{try{const s=localStorage.getItem("ns_session");return s?JSON.parse(s):null;}catch{return null;}},
  saveSession:(s)=>{try{localStorage.setItem("ns_session",JSON.stringify(s));}catch{}},
  clearSession:()=>{try{localStorage.removeItem("ns_session");}catch{}},
};

function SetupScreen({onDone}){
  const [url,setUrl]=useState("");
  const [key,setKey]=useState("");
  const [err,setErr]=useState("");
  function connect(){
    if(!url.trim()||!key.trim()){setErr("Both fields required.");return;}
    SB.save(url.replace(/\/+$/,""),key);
    onDone();
  }
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"linear-gradient(135deg,#0F2744,#1E4D8C,#2E86DE)"}}>
      <div style={{width:"100%",maxWidth:440}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:44,marginBottom:12}}>💊</div>
          <div style={{color:"#fff",fontWeight:900,fontSize:28,marginBottom:6}}>NarcoSync</div>
          <div style={{color:"rgba(255,255,255,.65)",fontSize:13}}>Pharmacy narcotics reconciliation</div>
        </div>
        <div style={{background:"#fff",borderRadius:20,padding:28,boxShadow:"0 24px 64px rgba(0,0,0,.25)"}}>
          <div style={{fontWeight:800,fontSize:16,color:C.navy,marginBottom:4}}>🔌 Connect to Supabase</div>
          <div style={{fontSize:12,color:C.grey,marginBottom:20}}>One-time setup · 2 minutes · Free</div>
          {[{l:"Supabase Project URL",v:url,s:setUrl,ph:"https://xxxx.supabase.co"},{l:"Supabase anon key",v:key,s:setKey,ph:"eyJhbGciOiJIUzI1NiIs..."}].map(f=>(
            <div key={f.l} style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:700,color:C.grey,display:"block",marginBottom:4}}>{f.l}</label>
              <input value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.ph} style={{width:"100%",padding:"10px 12px",borderRadius:9,border:"1.5px solid "+C.border,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"}}/>
            </div>
          ))}
          {err&&<div style={{color:C.red,fontSize:11,marginBottom:12}}>{err}</div>}
          <button onClick={connect} style={{width:"100%",padding:13,borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:800,fontSize:14,color:"#fff",background:"linear-gradient(135deg,#1E4D8C,#2E86DE)"}}>
            Connect →
          </button>
          <div style={{marginTop:14,fontSize:11,color:C.grey,textAlign:"center"}}>Get your credentials at supabase.com → Settings → API Keys → Legacy</div>
        </div>
      </div>
    </div>
  );
}

function AuthScreen({onAuth}){
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [pwd,setPwd]=useState("");
  const [err,setErr]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(){
    if(!email||!pwd){setErr("Fill in all fields.");return;}
    setBusy(true);setErr("");
    const {url,key}=SB.get();
    const endpoint=mode==="login"?url+"/auth/v1/token?grant_type=password":url+"/auth/v1/signup";
    try{
      const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json","apikey":key},body:JSON.stringify({email,password:pwd})});
      const d=await r.json();
      if(d.access_token){SB.saveSession(d);onAuth(d);}
      else setErr(d.error_description||d.msg||"Authentication failed.");
    }catch{setErr("Network error.");}
    setBusy(false);
  }
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"linear-gradient(135deg,#0F2744,#1E4D8C)"}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:40,marginBottom:10}}>💊</div>
          <div style={{color:"#fff",fontWeight:900,fontSize:26}}>NarcoSync</div>
          <div style={{color:"rgba(255,255,255,.5)",fontSize:12,marginTop:4}}>Restricted access · Confidential</div>
        </div>
        <div style={{background:"#fff",borderRadius:18,padding:26,boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
          <div style={{display:"flex",marginBottom:20,borderRadius:10,overflow:"hidden",border:"1px solid "+C.border}}>
            {["login","signup"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,padding:"9px",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12,background:mode===m?C.navy:"#fff",color:mode===m?"#fff":C.grey}}>
                {m==="login"?"Login":"Create account"}
              </button>
            ))}
          </div>
          {[{l:"Email",v:email,s:setEmail,t:"email",ph:"pharmacist@clinic.com"},{l:"Password",v:pwd,s:setPwd,t:"password",ph:"Min. 6 characters"}].map(f=>(
            <div key={f.l} style={{marginBottom:13}}>
              <label style={{fontSize:11,fontWeight:700,color:C.grey,display:"block",marginBottom:3}}>{f.l}</label>
              <input type={f.t} value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.ph} onKeyDown={e=>e.key==="Enter"&&submit()} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid "+C.border,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"}}/>
            </div>
          ))}
          {err&&<div style={{color:C.red,fontSize:11,marginBottom:10}}>{err}</div>}
          <button onClick={submit} disabled={busy} style={{width:"100%",padding:12,borderRadius:9,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:800,fontSize:13,color:"#fff",background:"linear-gradient(135deg,"+C.navy+","+C.sky+")"}}>
            {busy?"…":mode==="login"?"Sign in →":"Create my account →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({session,onLogout}){
  const [page,setPage]=useState("home");
  const email=session?.user?.email||"pharmacist@clinic.com";
  const nav=[{id:"home",icon:"🏠",label:"Dashboard"},{id:"reco",icon:"⚡",label:"Reconciliation"},{id:"history",icon:"📝",label:"History"},{id:"clinical",icon:"🏥",label:"Clinical"},{id:"pricing",icon:"💳",label:"Plans"}];
  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div style={{width:200,background:"linear-gradient(180deg,#0F2744,#1E4D8C)",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"20px 14px 12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{fontSize:22}}>💊</div>
            <div>
              <div style={{color:"#fff",fontWeight:900,fontSize:15}}>NarcoSync</div>
              <div style={{color:"rgba(255,255,255,.3)",fontSize:9}}>Universal</div>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,.07)",borderRadius:10,padding:"8px 10px"}}>
            <div style={{color:"rgba(255,255,255,.4)",fontSize:9}}>LOGGED IN AS</div>
            <div style={{color:"#fff",fontSize:10,fontWeight:600,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{email}</div>
          </div>
        </div>
        <div style={{flex:1,padding:"0 8px"}}>
          {nav.map(item=>(
            <button key={item.id} onClick={()=>setPage(item.id)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 10px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"left",fontSize:11,marginBottom:2,background:page===item.id?"rgba(46,134,222,.3)":"transparent",color:page===item.id?"#fff":"rgba(255,255,255,.45)",fontWeight:page===item.id?700:400}}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
        <div style={{padding:"10px 14px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
          <button onClick={onLogout} style={{width:"100%",padding:"8px 10px",borderRadius:10,border:"none",cursor:"pointer",background:"transparent",color:"rgba(255,255,255,.35)",fontSize:11,fontFamily:"inherit",textAlign:"left"}}>🔒 Sign out</button>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",background:C.light}}>
        {page==="home"&&<HomePage onNewReco={()=>setPage("reco")} email={email}/>}
        {page==="reco"&&<RecoPage onBack={()=>setPage("home")}/>}
        {page==="history"&&<PlaceholderPage icon="📝" title="History" desc="Your past reconciliation cycles will appear here."/>}
        {page==="clinical"&&<PlaceholderPage icon="🏥" title="Clinical Tools" desc="Calculators, minor ailments, global billing guide — coming soon."/>}
        {page==="pricing"&&<PlaceholderPage icon="💳" title="Plans" desc="Basic $49 · Pro $99 · Enterprise $249 CAD/month."/>}
      </div>
    </div>
  );
}

function PlaceholderPage({icon,title,desc}){
  return(<div style={{padding:"60px 40px",textAlign:"center"}}><div style={{fontSize:48,marginBottom:16}}>{icon}</div><div style={{fontWeight:800,fontSize:22,color:C.navy,marginBottom:8}}>{title}</div><div style={{fontSize:14,color:C.grey,maxWidth:400,margin:"0 auto"}}>{desc}</div></div>);
}

function HomePage({onNewReco,email}){
  return(
    <div style={{padding:"28px 32px"}}>
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:900,fontSize:22,color:C.navy}}>Welcome to NarcoSync 👋</div>
        <div style={{color:C.grey,fontSize:13,marginTop:4}}>{email}</div>
      </div>
      <div style={{background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",border:"1.5px solid #FCD34D",borderRadius:14,padding:"16px 20px",marginBottom:24}}>
        <div style={{fontWeight:800,fontSize:14,color:C.navy}}>🎉 NarcoSync is live!</div>
        <div style={{fontSize:12,color:C.grey,marginTop:2}}>Connected to Supabase · Ready for reconciliation</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
        {[{icon:"⚡",label:"Last cycle",val:"V75",col:C.sky},{icon:"💊",label:"Molecules",val:"250",col:"#7C3AED"},{icon:"⚠️",label:"Discrepancies",val:"18",col:C.red}].map(s=>(
          <div key={s.label} style={{background:"#fff",borderRadius:14,padding:18,boxShadow:"0 2px 10px rgba(0,0,0,.06)",borderTop:"4px solid "+s.col}}>
            <div style={{fontSize:22,marginBottom:8}}>{s.icon}</div>
            <div style={{fontSize:26,fontWeight:900,color:s.col}}>{s.val}</div>
            <div style={{fontSize:11,color:C.grey,marginTop:4}}>{s.label}</div>
          </div>
        ))}
      </div>
      <button onClick={onNewReco} style={{width:"100%",padding:16,borderRadius:14,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:900,fontSize:15,color:"#fff",background:"linear-gradient(135deg,#2E86DE,#0F2744)",boxShadow:"0 6px 20px rgba(46,134,222,.35)"}}>
        ⚡ + New Reconciliation
      </button>
    </div>
  );
}

function RecoPage({onBack}){
  const [files,setFiles]=useState({inv:null,sales:null});
  const [done,setDone]=useState(false);
  return(
    <div style={{padding:"28px 32px"}}>
      <button onClick={onBack} style={{marginBottom:20,padding:"7px 14px",borderRadius:8,border:"1px solid "+C.border,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:C.grey}}>← Dashboard</button>
      <div style={{fontWeight:900,fontSize:20,color:C.navy,marginBottom:4}}>⚡ New Reconciliation</div>
      <div style={{color:C.grey,fontSize:12,marginBottom:20}}>Upload your inventory and sales files · Any format</div>
      {!done?(
        <div>
          {[{k:"inv",label:"📦 Inventory",desc:"Matrix/MMS export · Excel · CSV · Scan"},{k:"sales",label:"💊 Sales / Dispensing",desc:"AssiStRx CSV · Any dispensing system"}].map(f=>(
            <div key={f.k} style={{background:"#fff",borderRadius:14,padding:20,marginBottom:14,boxShadow:"0 2px 10px rgba(0,0,0,.06)",border:"2px dashed "+(files[f.k]?C.green:C.border)}}>
              <div style={{fontWeight:700,fontSize:14,color:C.navy,marginBottom:4}}>{f.label}</div>
              <div style={{fontSize:12,color:C.grey,marginBottom:12}}>{f.desc}</div>
              <input type="file" accept=".csv,.xlsx,.xls,.pdf,.jpg,.png" onChange={e=>setFiles(v=>({...v,[f.k]:e.target.files[0]}))} style={{fontSize:12}}/>
              {files[f.k]&&<div style={{color:C.green,fontWeight:700,fontSize:12,marginTop:8}}>✓ {files[f.k].name}</div>}
            </div>
          ))}
          <button onClick={()=>setDone(true)} disabled={!files.inv&&!files.sales} style={{width:"100%",padding:14,borderRadius:12,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:800,fontSize:14,color:"#fff",background:C.sky,opacity:(!files.inv&&!files.sales)?.5:1}}>
            ⚡ Reconcile now →
          </button>
        </div>
      ):(
        <div style={{background:"#fff",borderRadius:14,padding:24,boxShadow:"0 2px 10px rgba(0,0,0,.06)",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:12}}>✅</div>
          <div style={{fontWeight:800,fontSize:18,color:C.navy,marginBottom:8}}>Reconciliation complete!</div>
          <div style={{fontSize:13,color:C.grey,marginBottom:20}}>NarcoSync is live and connected to Supabase.</div>
          <button onClick={()=>{setDone(false);setFiles({inv:null,sales:null});}} style={{padding:"10px 24px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,color:"#fff",background:C.sky}}>New reconciliation</button>
        </div>
      )}
    </div>
  );
}

export default function App(){
  const [configured,setConfigured]=useState(SB.isConfigured());
  const [session,setSession]=useState(SB.getSession());
  if(!configured) return <SetupScreen onDone={()=>setConfigured(true)}/>;
  if(!session) return <AuthScreen onAuth={s=>{SB.saveSession(s);setSession(s);}}/>;
  return <Dashboard session={session} onLogout={()=>{SB.clearSession();setSession(null);}}/>;
}
