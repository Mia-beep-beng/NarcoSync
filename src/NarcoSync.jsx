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
 const [busy,setBusy]=useState(false);
 async function connect(){
   if(!url.trim()||!key.trim()){setErr("Both fields required.");return;}
   setBusy(true);setErr("");
   try{
     const r=await fetch(url.replace(/\/+$/,"")+"/rest/v1/",{headers:{"apikey":key,"Authorization":"Bearer "+key}});
     if(r.status!==0){SB.save(url.replace(/\/+$/,""),key);onDone();}
     else{setErr("Could not connect. Check your URL and key.");}
   }catch(e){setErr("Connection failed. Check URL format.");}
   setBusy(false);
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
         <button onClick={connect} disabled={busy} style={{width:"100%",padding:13,borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:800,fontSize:14,color:"#fff",background:"linear-gradient(135deg,#1E4D8C,#2E86DE)"}}>
           {busy?"Connecting…":"Connect →"}
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

