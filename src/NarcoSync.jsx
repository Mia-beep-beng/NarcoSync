import React, { useState, useRef, useEffect } from "react";

const NS_URL="https://lqykpjgqbhaprbtafimi.supabase.co";
const NS_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeWtwamdxYmhhcHJidGFmaW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MzMzNjMsImV4cCI6MjA5OTMwOTM2M30.N2C5u-FmEqVyemYyqVlw64RQErQe7O-uGVzYulV8nOI";
try{localStorage.setItem("ns_url",NS_URL);localStorage.setItem("ns_key",NS_KEY);}catch(e){}

const IDLE_MS=5*60*1000;

/* ===== DESIGN TOKENS ===== */
const C={
  ink:"#12161C",        // structure
  ink2:"#1C222B",
  ink3:"#2A323E",
  line:"#DFE3E8",
  line2:"#EEF1F4",
  paper:"#FFFFFF",
  bg:"#F7F8FA",
  text:"#12161C",
  text2:"#5B646F",
  text3:"#8A929C",
  accent:"#0B5FFF",     // interaction only
  flag:"#C81E1E",       // variance only
  flagBg:"#FEF2F2",
  ok:"#0F7B45",
  okBg:"#F1F8F3",
  warn:"#A15C00",
  warnBg:"#FFFBEB",
};
const F="'Inter','SF Pro Text',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const NUM="'SF Mono','Roboto Mono',ui-monospace,monospace";

const ADMIN_EMAIL="mtrofin@icloud.com";

const ROLES={
  owner:{fr:"Pharmacien-propriétaire",en:"Pharmacist-owner"},
  pharmacist:{fr:"Pharmacien",en:"Pharmacist"},
  technician:{fr:"Chef technicien",en:"Chief technician"},
};
function can(role,action){
  if(role==="owner") return true;
  if(role==="pharmacist") return action!=="manage_team";
  if(role==="technician") return action==="view"||action==="count"||action==="print";
  return false;
}

function unitsPerPack(format){
  const s=String(format||"").toUpperCase().replace(/,/g,"");
  const m=s.match(/(\d+(?:\.\d+)?)/);
  if(!m) return 1;
  const n=parseFloat(m[1]);
  return (isFinite(n)&&n>0)?n:1;
}
function packLabel(format,fr){
  const s=String(format||"").toUpperCase();
  if(s.indexOf("ML")>=0) return "mL";
  if(s.indexOf("CAP")>=0) return "caps";
  if(s.indexOf("PATCH")>=0||s.indexOf("TIMBRE")>=0) return fr?"timbres":"patches";
  return fr?"co":"tabs";
}

const T={
  en:{login:"Sign in",createAccount:"Create account",signIn:"Sign in",createMyAccount:"Create account",
    restrictedAccess:"Controlled substance records",fillAllFields:"Fill in all fields.",
    authFailed:"Those credentials didn't work.",networkError:"Connection failed.",
    language:"Language",searchLanguage:"Working language",langSubtitle:"You can change this later",
    langPlaceholder:"Start typing…",next:"Continue",back:"Back",
    launch:"Open NarcoSync",saving:"Saving",location:"Location",locationSubtitle:"Where is the pharmacy?",
    country:"Country",province:"Province",state:"State",regionCity:"Region or city",
    selectProvince:"Choose a province",selectState:"Choose a state",enterRegion:"Region or city",
    yourPharmacy:"Pharmacy details",pharmacyInfoSection:"Pharmacy",teamSection:"Responsible pharmacist",
    planSection:"Plan",softwareSection:"Software in use",
    pharmacyName:"Banner or chain",permitNumber:"Permit number",
    pharmacyAddress:"Address",pharmacyPhone:"Phone",pharmacyEmail:"Pharmacy email",
    dispensingSystem:"Dispensing software",dispensingSystemPlaceholder:"Start typing…",
    inventorySystem:"Ordering system",inventorySystemPlaceholder:"Start typing…",
    pharmacistOwner:"Pharmacist-owner",pharmacistEmail:"Their email",
    managerName:"Team lead",pharmacyPlaceholder:"Start typing…",
    permitPlaceholder:"OPQ-12345",addressPlaceholder:"Street number and name",
    addressHint:"Pick from the list to fill the rest",emailPlaceholder:"info@pharmacy.com",
    ownerPlaceholder:"Full name",ownerEmailPlaceholder:"owner@pharmacy.com",managerPlaceholder:"Your name",
    requiredNote:"Required",welcomeToNarco:"Set up your pharmacy",stepOf:"Step",ofTotal:"of",
    dashboard:"Overview",reconciliation:"Reconcile",history:"Records",inventory:"Inventory",
    team:"Team",clinical:"Clinical",plans:"Plan",signOut:"Sign out",loggedInAs:"Signed in",
    welcomeMsg:"Overview",liveMsg:"Nothing counted yet",
    liveSubMsg:"Add your products, then run your first count.",
    newReco:"Start a reconciliation",recoComplete:"Cycle saved",newRecoBtn:"Start another",
    clinicalDesc:"Dose calculators and billing guides are next on the roadmap.",
    plansDesc:"Basic $49 · Pro $99 · Enterprise $249 CAD per month.",
    basicLabel:"Basic",basicDesc:"One pharmacy",basicPrice:"$49",
    proLabel:"Pro",proDesc:"Up to three pharmacies",proPrice:"$99",
    enterpriseLabel:"Enterprise",enterpriseDesc:"Unlimited, with API",enterprisePrice:"$249",
  },
  fr:{login:"Connexion",createAccount:"Créer un compte",signIn:"Se connecter",createMyAccount:"Créer le compte",
    restrictedAccess:"Registre des substances contrôlées",fillAllFields:"Remplissez tous les champs.",
    authFailed:"Ces identifiants ne fonctionnent pas.",networkError:"Connexion échouée.",
    language:"Langue",searchLanguage:"Langue de travail",langSubtitle:"Vous pourrez la changer plus tard",
    langPlaceholder:"Commencez à taper…",next:"Continuer",back:"Retour",
    launch:"Ouvrir NarcoSync",saving:"Enregistrement",location:"Localisation",locationSubtitle:"Où est la pharmacie?",
    country:"Pays",province:"Province",state:"État",regionCity:"Région ou ville",
    selectProvince:"Choisir une province",selectState:"Choisir un état",enterRegion:"Région ou ville",
    yourPharmacy:"Détails de la pharmacie",pharmacyInfoSection:"Pharmacie",teamSection:"Pharmacien responsable",
    planSection:"Forfait",softwareSection:"Logiciels utilisés",
    pharmacyName:"Bannière ou chaîne",permitNumber:"Numéro de permis",
    pharmacyAddress:"Adresse",pharmacyPhone:"Téléphone",pharmacyEmail:"Courriel de la pharmacie",
    dispensingSystem:"Logiciel de dispensation",dispensingSystemPlaceholder:"Commencez à taper…",
    inventorySystem:"Système de commande",inventorySystemPlaceholder:"Commencez à taper…",
    pharmacistOwner:"Pharmacien-propriétaire",pharmacistEmail:"Son courriel",
    managerName:"Chef d'équipe",pharmacyPlaceholder:"Commencez à taper…",
    permitPlaceholder:"OPQ-12345",addressPlaceholder:"Numéro et rue",
    addressHint:"Choisissez dans la liste pour remplir le reste",emailPlaceholder:"info@pharmacie.com",
    ownerPlaceholder:"Nom complet",ownerEmailPlaceholder:"proprio@pharmacie.com",managerPlaceholder:"Votre nom",
    requiredNote:"Obligatoire",welcomeToNarco:"Configurez votre pharmacie",stepOf:"Étape",ofTotal:"sur",
    dashboard:"Vue d'ensemble",reconciliation:"Réconcilier",history:"Registres",inventory:"Inventaire",
    team:"Équipe",clinical:"Clinique",plans:"Forfait",signOut:"Se déconnecter",loggedInAs:"Connecté",
    welcomeMsg:"Vue d'ensemble",liveMsg:"Aucun décompte encore",
    liveSubMsg:"Ajoutez vos produits, puis lancez votre premier décompte.",
    newReco:"Lancer une réconciliation",recoComplete:"Cycle enregistré",newRecoBtn:"En lancer un autre",
    clinicalDesc:"Calculateurs de doses et guides de facturation à venir.",
    plansDesc:"Basique 49$ · Pro 99$ · Entreprise 249$ CAD par mois.",
    basicLabel:"Basique",basicDesc:"Une pharmacie",basicPrice:"49$",
    proLabel:"Pro",proDesc:"Jusqu'à trois pharmacies",proPrice:"99$",
    enterpriseLabel:"Entreprise",enterpriseDesc:"Illimité, avec API",enterprisePrice:"249$",
  }
};

function getLang(l){
  try{const o=localStorage.getItem("ns_lang");if(o==="fr"||o==="en")return o;}catch(e){}
  if(!l) return "en";
  if(l.startsWith("Français")||l.includes("Bilingual")||l.includes("Bilingue")) return "fr";
  return "en";
}

const DISPENSING_SYSTEMS={
  "Canada":["AssiStRx","RxPro","Gespar","Ubik","Reflex","Kroll","Datascan","Logibec","Purkinje","WinRx","Fillware","Nexxsys","Prodigy RX","Propel Rx","Pharmaserv","Other"],
  "United States":["QS/1 (NRx)","PioneerRx","Liberty Software","Rx30","ScriptPro","PDX","Computer-Rx","BestRx","McKesson EnterpriseRx","Epic Willow","Other"],
  "France":["Winpharma","Lgpi (Pharmagest)","Isipharm","Pharmonet","Caducée","Other"],
  "United Kingdom":["Rx Web (Cegedim)","Pharmacy Manager (EMIS)","SystmOne","Titan","Other"],
  "Australia":["Fred Dispense","Minfos","Corum Clear Dispense","Toniq","Other"],
};
const DEFAULT_DISPENSING=["Other"];
const INVENTORY_SYSTEMS={
  "Canada":["Matrix (Pharmaprix / Shoppers)","PharmaClik (McKesson / Proxim / IDA)","Gespar","MMS","Logibec","Kroll Inventory","McKesson Connect","Cardinal Health","SAP","Other"],
  "United States":["McKesson Connect","Cardinal Health","AmerisourceBergen","PioneerRx Inventory","SAP","Other"],
  "France":["Pharmagest Inventory","Winpharma Stock","CERP","OCP","Alliance Healthcare","Other"],
  "United Kingdom":["AAH Pharmaceuticals","Phoenix Medical","EMIS Inventory","Other"],
  "Australia":["Fred Office","Minfos Inventory","LOTS","API","Other"],
};
const DEFAULT_INVENTORY=["Other"];
const COUNTRY_ISO={"Canada":"ca","United States":"us","France":"fr","Australia":"au","Belgium":"be","Germany":"de","Switzerland":"ch","United Kingdom":"gb"};
const COUNTRY_CODES={"Canada":"+1","United States":"+1","France":"+33","United Kingdom":"+44","Australia":"+61","Belgium":"+32","Germany":"+49","Switzerland":"+41","Other":"+"};
const PROVINCE_COORDS={"Québec":{lat:46.8,lon:-71.2},"Ontario":{lat:51.2,lon:-85.3},"British Columbia":{lat:53.7,lon:-127.6},"Alberta":{lat:53.9,lon:-116.6},"Manitoba":{lat:56.4,lon:-98.7},"Saskatchewan":{lat:55.0,lon:-106.0},"Nova Scotia":{lat:44.7,lon:-63.7},"New Brunswick":{lat:46.5,lon:-66.5}};

const SB={
  get:()=>{try{return{url:localStorage.getItem("ns_url")||NS_URL,key:localStorage.getItem("ns_key")||NS_KEY};}catch{return{url:NS_URL,key:NS_KEY};}},
  getSession:()=>{try{const s=localStorage.getItem("ns_session");return s?JSON.parse(s):null;}catch{return null;}},
  saveSession:(s)=>{try{localStorage.setItem("ns_session",JSON.stringify(s));}catch{}},
  clearSession:()=>{try{localStorage.removeItem("ns_session");}catch{}},
  getProfile:()=>{try{const p=localStorage.getItem("ns_profile");return p?JSON.parse(p):null;}catch{return null;}},
  saveProfile:(p)=>{try{localStorage.setItem("ns_profile",JSON.stringify(p));}catch{}},
  clearProfile:()=>{try{localStorage.removeItem("ns_profile");}catch{}},
  getMember:()=>{try{const m=localStorage.getItem("ns_member");return m?JSON.parse(m):null;}catch{return null;}},
  saveMember:(m)=>{try{localStorage.setItem("ns_member",JSON.stringify(m));}catch{}},
  clearMember:()=>{try{localStorage.removeItem("ns_member");}catch{}},
  getAIKey:()=>{try{return localStorage.getItem("ns_ai_key")||"";}catch{return "";}},
  saveAIKey:(k)=>{try{localStorage.setItem("ns_ai_key",k);}catch{}},
  setLang:(l)=>{try{localStorage.setItem("ns_lang",l);}catch{}},
};

const ALL_LANGUAGES=["Français","English","Bilingue / Bilingual","Arabic","Spanish","Portuguese","Italian","German","Russian","Ukrainian","Vietnamese","Other"];
const PHARMACY_CHAINS_BY_COUNTRY={
  "Canada":["Pharmaprix","Jean Coutu","Uniprix","Familiprix","Brunet","Proxim","IDA","Pharmasave","Rexall","Guardian","Shoppers Drug Mart","Walmart Pharmacy","Costco Pharmacy","London Drugs","PharmaChoice","Independent"],
  "United States":["CVS Pharmacy","Walgreens","Rite Aid","Walmart Pharmacy","Costco Pharmacy","Kroger Pharmacy","Health Mart","Independent"],
  "France":["Pharmacie Lafayette","Pharmavie","Giropharm","Independent"],
  "United Kingdom":["Boots","Lloyds Pharmacy","Well Pharmacy","Independent"],
  "Australia":["Chemist Warehouse","Priceline Pharmacy","Terry White Chemmart","Independent"],
};
const DEFAULT_CHAINS=["Independent"];
const COUNTRIES=["Canada","United States","France","Australia","Belgium","Germany","Switzerland","United Kingdom","Other"];
const CA_PROVINCES=["Québec","Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland & Labrador","Nova Scotia","Ontario","Prince Edward Island","Saskatchewan","Northwest Territories","Nunavut","Yukon"];
const US_STATES=["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

const PLAN_PRICE={basic:49,pro:99,enterprise:249};

const GLOBAL_CSS=`
*{box-sizing:border-box;}
body{margin:0;font-family:${F};color:${C.text};background:${C.bg};
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
input,select,button,textarea{font-family:${F};}
input:focus-visible,select:focus-visible,button:focus-visible{
  outline:2px solid ${C.accent};outline-offset:1px;}
.ns-num{font-family:${NUM};font-variant-numeric:tabular-nums;letter-spacing:-.01em;}
.ns-nav{display:flex;align-items:center;width:100%;padding:8px 12px;border:none;
  border-radius:7px;cursor:pointer;font-size:13.5px;text-align:left;margin-bottom:1px;
  background:transparent;color:rgba(255,255,255,.62);transition:background .12s,color .12s;}
.ns-nav:hover{background:rgba(255,255,255,.06);color:rgba(255,255,255,.9);}
.ns-nav[data-on="1"]{background:rgba(255,255,255,.11);color:#fff;font-weight:600;}
.ns-btn{border:none;border-radius:7px;cursor:pointer;font-size:13.5px;font-weight:600;
  padding:10px 16px;transition:opacity .12s,background .12s;}
.ns-btn:hover{opacity:.88;}
.ns-btn:disabled{opacity:.42;cursor:not-allowed;}
.ns-btn-primary{background:${C.ink};color:#fff;}
.ns-btn-quiet{background:${C.paper};color:${C.text};border:1px solid ${C.line};}
.ns-btn-quiet:hover{background:${C.bg};opacity:1;}
.ns-in{width:100%;padding:9px 11px;border-radius:6px;border:1px solid ${C.line};
  font-size:13.5px;background:${C.paper};color:${C.text};transition:border-color .12s;}
.ns-in:focus{border-color:${C.accent};}
.ns-in::placeholder{color:${C.text3};}
.ns-cell{padding:5px 6px;border-radius:5px;border:1px solid ${C.line};font-size:12.5px;
  background:${C.paper};color:${C.text};}
.ns-cell:focus{border-color:${C.accent};}
.ns-panel{background:${C.paper};border:1px solid ${C.line};border-radius:10px;}
table{border-collapse:separate;border-spacing:0;}
th{font-size:11px;font-weight:600;color:${C.text2};text-align:left;
  padding:9px 10px;background:${C.bg};border-bottom:1px solid ${C.line};white-space:nowrap;}
td{padding:6px 10px;border-bottom:1px solid ${C.line2};font-size:13px;}
tbody tr:last-child td{border-bottom:none;}
.ns-x{border:none;background:none;cursor:pointer;color:${C.text3};font-size:16px;
  line-height:1;padding:2px 6px;border-radius:4px;}
.ns-x:hover{color:${C.flag};background:${C.flagBg};}
@media print{
  @page{size:landscape;margin:11mm;}
  body{-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#fff;}
  .ns-noprint,.ns-sidebar{display:none !important;}
  .ns-main{overflow:visible !important;background:#fff !important;}
  .ns-print-only{display:block !important;}
  input,select{border:none !important;background:transparent !important;padding:0 !important;
    font-size:10pt !important;color:#000 !important;-webkit-appearance:none;appearance:none;width:auto !important;}
  table{width:100% !important;font-size:9pt !important;}
  tr{page-break-inside:avoid;} thead{display:table-header-group;}
  th{background:#fff !important;border-bottom:1.5px solid #000 !important;}
  .ns-writebox{border:1px solid #444 !important;height:20px !important;width:58px !important;display:block !important;}
  .ns-panel{border:none !important;}
}
.ns-print-only{display:none;}
`;

function Tag({children,tone}){
  const m={ok:[C.okBg,C.ok],flag:[C.flagBg,C.flag],warn:[C.warnBg,C.warn],quiet:[C.bg,C.text2]};
  const [bg,fg]=m[tone||"quiet"];
  return <span style={{background:bg,color:fg,fontSize:11.5,fontWeight:600,padding:"3px 9px",borderRadius:5,whiteSpace:"nowrap"}}>{children}</span>;
}
function RoleTag({role,fr}){
  const r=ROLES[role]||ROLES.pharmacist;
  return <Tag tone="quiet">{fr?r.fr:r.en}</Tag>;
}
function H1({children,sub}){
  return(
    <div style={{marginBottom:22}}>
      <div style={{fontSize:24,fontWeight:650,letterSpacing:"-.021em",lineHeight:1.15}}>{children}</div>
      {sub&&<div style={{fontSize:13.5,color:C.text2,marginTop:5,lineHeight:1.5}}>{sub}</div>}
    </div>
  );
}
function Note({tone,children}){
  const m={flag:[C.flagBg,C.flag,"#F5C2C2"],ok:[C.okBg,C.ok,"#BFE0CB"],warn:[C.warnBg,C.warn,"#F0DFA8"]};
  const [bg,fg,bd]=m[tone||"warn"];
  return <div style={{background:bg,border:"1px solid "+bd,borderRadius:8,padding:"11px 14px",fontSize:13,color:fg,marginBottom:14,lineHeight:1.5}}>{children}</div>;
}

async function sbFetch(path,opts){
  const g=SB.get();const s=SB.getSession();
  const tok=(s&&s.access_token)?s.access_token:g.key;
  const o=opts||{};
  const h={"apikey":g.key,"Authorization":"Bearer "+tok,"Content-Type":"application/json"};
  if(o.prefer) h["Prefer"]=o.prefer;
  const r=await fetch(g.url+"/rest/v1/"+path,{method:o.method||"GET",headers:h,body:o.body?JSON.stringify(o.body):undefined});
  if(!r.ok){const t=await r.text();throw new Error("Supabase "+r.status+" — "+t.slice(0,180));}
  const txt=await r.text();
  return txt?JSON.parse(txt):[];
}
function isDiscontinued(v){const s=String(v||"").toLowerCase();return s.indexOf("disc")>=0||s.indexOf("cesse")>=0||s.indexOf("retir")>=0;}
function cleanDin(d){return String(d||"").replace(/\D/g,"").trim();}
function cleanCup(v){return String(v||"").replace(/\s/g,"").trim();}

const MEM={
  async byEmail(e){const r=await sbFetch("pharmacy_members?select=*&email=eq."+encodeURIComponent(e.toLowerCase().trim())+"&active=eq.true&limit=1");return r&&r.length?r[0]:null;},
  async list(pid){return await sbFetch("pharmacy_members?select=*&pharmacy_id=eq."+pid+"&order=created_at.asc");},
  async add(row){return await sbFetch("pharmacy_members",{method:"POST",body:[row],prefer:"return=representation"});},
  async update(id,p){await sbFetch("pharmacy_members?id=eq."+id,{method:"PATCH",body:p});},
  async remove(id){await sbFetch("pharmacy_members?id=eq."+id,{method:"DELETE"});},
  async linkUser(id,uid){await sbFetch("pharmacy_members?id=eq."+id,{method:"PATCH",body:{user_id:uid}});}
};
const AUDIT={
  async log(member,action,entity,entityId,details){
    if(!member) return;
    try{await sbFetch("audit_log",{method:"POST",body:[{user_id:member.user_id,action,entity,
      entity_id:entityId?String(entityId):null,details:details||null,
      pharmacist_licence:member.licence||"—",pharmacist_name:member.full_name||member.email}],prefer:"return=minimal"});}catch(e){}
  },
  async list(ids){if(!ids||!ids.length)return[];return await sbFetch("audit_log?select=*&user_id=in.("+ids.join(",")+")&order=created_at.desc&limit=500");}
};
const CAT={
  async list(search){
    let q="drug_catalog?select=*&order=molecule.asc&limit=5000";
    if(search&&search.trim()){const s=encodeURIComponent("*"+search.trim()+"*");
      q+="&or=(molecule.ilike."+s+",din.ilike."+s+",cup.ilike."+s+")";}
    return await sbFetch(q);
  },
  async byDins(d){if(!d.length)return[];const out=[];
    for(let i=0;i<d.length;i+=100){const c=d.slice(i,i+100).filter(Boolean);if(!c.length)continue;
      (await sbFetch("drug_catalog?select=*&din=in.("+c.join(",")+")")).forEach(x=>out.push(x));}
    return out;},
  async byCups(cu){if(!cu.length)return[];const out=[];
    for(let i=0;i<cu.length;i+=100){const c=cu.slice(i,i+100).filter(Boolean);if(!c.length)continue;
      (await sbFetch("drug_catalog?select=*&cup=in.("+c.join(",")+")")).forEach(x=>out.push(x));}
    return out;},
  async upsertMany(rows){
    const clean=rows.filter(r=>r&&(r.description||r.molecule)).filter(r=>!isDiscontinued(r.status))
      .map(r=>({cup:cleanCup(r.cup)||null,molecule:String(r.description||r.molecule||"").trim(),
        strength:String(r.strength||"").trim()||null,format:String(r.format||"").trim()||null,
        din:cleanDin(r.din)||null,category:r.category||"narco",is_narcotic:true}));
    const seen={};const wd=[];const nd=[];
    clean.forEach(r=>{if(r.din){if(!seen[r.din]){seen[r.din]=1;wd.push(r);}}else nd.push(r);});
    let n=0;const B=200;
    for(let i=0;i<wd.length;i+=B){const d=await sbFetch("drug_catalog?on_conflict=din",{method:"POST",body:wd.slice(i,i+B),prefer:"resolution=merge-duplicates,return=representation"});n+=(d||[]).length;}
    for(let i=0;i<nd.length;i+=B){const d=await sbFetch("drug_catalog",{method:"POST",body:nd.slice(i,i+B),prefer:"return=representation"});n+=(d||[]).length;}
    return n;
  },
  async remove(id){await sbFetch("drug_catalog?id=eq."+id,{method:"DELETE"});}
};
const INV={
  async list(pid,search){
    let q="pharmacy_drugs?select=*&user_id=eq."+pid+"&order=molecule.asc&limit=5000";
    if(search&&search.trim()){const s=encodeURIComponent("*"+search.trim()+"*");
      q+="&or=(molecule.ilike."+s+",din.ilike."+s+",cup.ilike."+s+")";}
    return await sbFetch(q);
  },
  async addMany(pid,rows){
    const ex=await sbFetch("pharmacy_drugs?select=id,din,cup,qty&user_id=eq."+pid+"&limit=5000");
    const bd={};const bc={};
    ex.forEach(e=>{if(e.din)bd[e.din]=e;if(e.cup)bc[e.cup]=e;});
    const body=[];let merged=0;
    for(const r of rows){
      const din=cleanDin(r.din);const cup=cleanCup(r.cup);
      const hit=(din&&bd[din])||(!din&&cup&&bc[cup]);
      const q=Number(r.qty)||0;
      if(hit){
        if(q>0){try{await sbFetch("pharmacy_drugs?id=eq."+hit.id,{method:"PATCH",body:{qty:(Number(hit.qty)||0)+q,last_count_at:new Date().toISOString()}});merged++;}catch(e){}}
        continue;
      }
      const row={user_id:pid,pharmacy_id:pid,drug_id:r.drug_id||null,din:din||null,cup:cup||null,
        molecule:String(r.molecule||r.description||"").trim(),
        strength:String(r.strength||"").trim()||null,format:String(r.format||"").trim()||null,qty:q,active:true};
      if(din)bd[din]=row; if(cup)bc[cup]=row;
      body.push(row);
    }
    let n=0;const B=200;
    for(let i=0;i<body.length;i+=B){const d=await sbFetch("pharmacy_drugs",{method:"POST",body:body.slice(i,i+B),prefer:"return=representation"});n+=(d||[]).length;}
    return {added:n,merged};
  },
  async update(id,p){await sbFetch("pharmacy_drugs?id=eq."+id,{method:"PATCH",body:p});},
  async remove(id){await sbFetch("pharmacy_drugs?id=eq."+id,{method:"DELETE"});}
};

function loadPdfLib(){
  return new Promise((res,rej)=>{
    if(window.PDFLib) return res(window.PDFLib);
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
    s.onload=()=>{if(window.PDFLib)res(window.PDFLib);else rej(new Error("pdf-lib introuvable"));};
    s.onerror=()=>rej(new Error("Chargement pdf-lib echoue"));
    document.head.appendChild(s);
  });
}
function b64FromBytes(b){let s="";const c=8192;for(let i=0;i<b.length;i+=c)s+=String.fromCharCode.apply(null,b.subarray(i,i+c));return btoa(s);}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function shrinkImage(file,maxW){
  return new Promise((res)=>{
    const rd=new FileReader();
    rd.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        try{
          const sc=Math.min(1,maxW/img.width);
          if(sc>=1){res({data:rd.result.split(",")[1],type:file.type||"image/jpeg"});return;}
          const cv=document.createElement("canvas");
          cv.width=Math.round(img.width*sc);cv.height=Math.round(img.height*sc);
          const ctx=cv.getContext("2d");
          ctx.fillStyle="#fff";ctx.fillRect(0,0,cv.width,cv.height);
          ctx.drawImage(img,0,0,cv.width,cv.height);
          res({data:cv.toDataURL("image/jpeg",0.9).split(",")[1],type:"image/jpeg"});
        }catch(e){res({data:rd.result.split(",")[1],type:file.type||"image/jpeg"});}
      };
      img.onerror=()=>res({data:rd.result.split(",")[1],type:file.type||"image/jpeg"});
      img.src=rd.result;
    };
    rd.onerror=()=>res(null);
    rd.readAsDataURL(file);
  });
}

const PROMPT_CATALOG="Ce document est une liste de produits d'une pharmacie canadienne. Colonnes: CUP, description, format, commande (statut), DIN. "
  +"Pour CHAQUE ligne extrais ces valeurs. N'inclus PAS les lignes dont la commande indique discontinue, DISC, cesse ou retire. "
  +"Retourne UNIQUEMENT un tableau JSON valide, sans markdown ni backticks. "
  +"Format: [{\"cup\":\"\",\"description\":\"\",\"strength\":\"\",\"format\":\"\",\"status\":\"\",\"din\":\"\"}]";
const PROMPT_ORDER="Ce document est un bon de commande ou une liste d'inventaire d'une pharmacie canadienne. "
  +"Pour CHAQUE ligne de produit extrais: cup, description, strength (force ex 5mg), format (ex 100 TAB), din (8 chiffres si present sinon vide), qty (un nombre). "
  +"Si une valeur est absente mets une chaine vide, et qty a 0 si aucune quantite. "
  +"Retourne UNIQUEMENT un tableau JSON valide, sans markdown ni backticks. "
  +"Format: [{\"cup\":\"\",\"description\":\"\",\"strength\":\"\",\"format\":\"\",\"din\":\"\",\"qty\":0}]";

async function callClaude(block,aiKey,prompt){
  const r=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":aiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:16000,messages:[{role:"user",content:[block,{type:"text",text:prompt}]}]})
  });
  if(!r.ok){const t=await r.text();throw new Error("API "+r.status+" — "+t.slice(0,140));}
  const d=await r.json();
  const text=(d.content||[]).map(i=>i.text||"").join("");
  const clean=text.replace(/```json|```/g,"").trim();
  const a=clean.indexOf("[");const b=clean.lastIndexOf("]");
  if(a===-1||b===-1) throw new Error("Reponse illisible");
  return JSON.parse(clean.slice(a,b+1));
}
async function callClaudeRetry(block,aiKey,prompt){
  for(let a=0;a<4;a++){
    try{return await callClaude(block,aiKey,prompt);}
    catch(e){
      const m=String(e.message||"");
      const rt=m.indexOf("429")>=0||m.indexOf("529")>=0||m.indexOf("500")>=0||m.indexOf("503")>=0||m.indexOf("illisible")>=0;
      if(rt&&a<3){await sleep(1500*Math.pow(2,a));continue;}
      throw e;
    }
  }
}
async function refreshToken(){
  const s=SB.getSession();
  if(!s||!s.refresh_token) return null;
  const g=SB.get();
  try{
    const r=await fetch(g.url+"/auth/v1/token?grant_type=refresh_token",{method:"POST",
      headers:{"Content-Type":"application/json","apikey":g.key},body:JSON.stringify({refresh_token:s.refresh_token})});
    const d=await r.json();
    if(d.access_token){SB.saveSession(d);return d;}
  }catch(e){}
  return null;
}
async function scanFiles(files,aiKey,prompt,onProgress,ctrl){
  const tasks=[];
  for(const f of files){
    const isPDF=f.type==="application/pdf"||/\.pdf$/i.test(f.name);
    if(!isPDF){tasks.push({kind:"img",file:f,label:f.name});continue;}
    const PDFLib=await loadPdfLib();
    const buf=await f.arrayBuffer();
    const src=await PDFLib.PDFDocument.load(buf,{ignoreEncryption:true});
    const total=src.getPageCount();
    for(let s=0;s<total;s+=4) tasks.push({kind:"pdf",src,PDFLib,start:s,end:Math.min(s+4,total),label:f.name+" p."+(s+1)});
  }
  let all=[];const failed=[];let done=0;let cur=0;const t0=Date.now();
  function report(){
    if(!onProgress) return;
    const pct=Math.round(done/tasks.length*100);
    const el=(Date.now()-t0)/1000;const rate=done>0?done/el:0;
    const left=rate>0?Math.round((tasks.length-done)/rate):0;
    const m=Math.floor(left/60),s2=left%60;
    onProgress(pct+"% · "+done+"/"+tasks.length+(left>0?" · ~"+(m?m+"m ":"")+s2+"s":"")+(failed.length?" · "+failed.length+" non lu(s)":""));
  }
  async function worker(){
    while(true){
      if(ctrl&&ctrl.cancelled) return;
      while(ctrl&&ctrl.paused){await sleep(400);if(ctrl.cancelled)return;}
      const i=cur++;
      if(i>=tasks.length) return;
      const t=tasks[i];
      try{
        let block;
        if(t.kind==="img"){
          const s=await shrinkImage(t.file,1600);
          if(!s) throw new Error("lecture");
          block={type:"image",source:{type:"base64",media_type:s.type,data:s.data}};
        }else{
          const out=await t.PDFLib.PDFDocument.create();
          const idx=[];for(let p=t.start;p<t.end;p++) idx.push(p);
          const cp=await out.copyPages(t.src,idx);
          cp.forEach(pg=>out.addPage(pg));
          block={type:"document",source:{type:"base64",media_type:"application/pdf",data:b64FromBytes(await out.save())}};
        }
        const rows=await callClaudeRetry(block,aiKey,prompt);
        if(Array.isArray(rows)) all=all.concat(rows);
      }catch(e){failed.push(t.label);}
      done++;report();
    }
  }
  report();
  const ws=[];
  for(let w=0;w<Math.min(3,tasks.length);w++) ws.push(worker());
  await Promise.all(ws);
  if(failed.length===tasks.length) throw new Error("Aucune page n'a pu etre lue");
  const res=all.filter(x=>!isDiscontinued(x.status));
  res.failedLabels=failed.join(", ");
  return res;
}

function AIKeyModal({onClose,onSaved,fr}){
  const [k,setK]=useState("");
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(18,22,28,.55)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div className="ns-panel" style={{padding:26,maxWidth:430,width:"100%",boxShadow:"0 24px 60px rgba(18,22,28,.24)"}}>
        <div style={{fontSize:16,fontWeight:650,marginBottom:6}}>{fr?"Clé API Claude":"Claude API key"}</div>
        <div style={{fontSize:13,color:C.text2,marginBottom:16,lineHeight:1.5}}>
          {fr?"Elle reste dans ce navigateur et ne quitte jamais votre appareil.":"It stays in this browser and never leaves your device."}
        </div>
        <input value={k} onChange={e=>setK(e.target.value)} placeholder="sk-ant-…" className="ns-in ns-num" style={{marginBottom:14,fontSize:12}}/>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} className="ns-btn ns-btn-quiet" style={{flex:1}}>{fr?"Annuler":"Cancel"}</button>
          <button onClick={()=>{SB.saveAIKey(k);onSaved();}} disabled={!k.startsWith("sk-")} className="ns-btn ns-btn-primary" style={{flex:2}}>{fr?"Enregistrer":"Save"}</button>
        </div>
      </div>
    </div>
  );
}

function ValidationTable({rows,setRows,showQty,onConfirm,onCancel,busy,fr,member,unitMode,setUnitMode}){
  function up(i,f,v){setRows(rows.map((r,j)=>j===i?{...r,[f]:v}:r));}
  function del(i){setRows(rows.filter((r,j)=>j!==i));}
  const bad=rows.filter(r=>cleanDin(r.din).length!==8).length;
  return(
    <div className="ns-noprint" style={{background:C.warnBg,border:"1px solid #F0DFA8",borderRadius:10,padding:18,marginBottom:22}}>
      <div style={{fontSize:15,fontWeight:650,color:C.warn,marginBottom:5}}>
        {fr?"À valider par le pharmacien":"Pharmacist validation needed"}
      </div>
      <div style={{fontSize:13,color:C.warn,marginBottom:12,lineHeight:1.5}}>
        {rows.length} {fr?"lignes lues. Corrigez ce qui a été mal lu avant d'enregistrer.":"rows read. Fix anything misread before saving."}
        {bad>0&&<span style={{fontWeight:600}}> {bad} DIN {fr?"n'ont pas 8 chiffres.":"aren't 8 digits."}</span>}
      </div>

      {showQty&&(
        <div className="ns-panel" style={{padding:14,marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:9}}>
            {fr?"Ces quantités sont en":"These quantities are in"}
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[{v:"pack",l:fr?"Bouteilles ou contenants":"Bottles or packs",d:fr?"converties en unités":"converted to units"},
              {v:"unit",l:fr?"Unités":"Units",d:fr?"gardées telles quelles":"kept as-is"}].map(o=>(
              <button key={o.v} onClick={()=>setUnitMode(o.v)} style={{flex:"1 1 200px",padding:"11px 14px",borderRadius:7,
                border:"1px solid "+(unitMode===o.v?C.ink:C.line),background:unitMode===o.v?C.ink:C.paper,cursor:"pointer",textAlign:"left"}}>
                <div style={{fontSize:13,fontWeight:600,color:unitMode===o.v?"#fff":C.text}}>{o.l}</div>
                <div style={{fontSize:11.5,color:unitMode===o.v?"rgba(255,255,255,.65)":C.text3,marginTop:2}}>{o.d}</div>
              </button>
            ))}
          </div>
          {unitMode==="pack"&&rows.length>0&&(
            <div style={{fontSize:12.5,color:C.ok,marginTop:11,background:C.okBg,padding:"8px 11px",borderRadius:6}}>
              <span className="ns-num">{rows[0].qty||0}</span> × {rows[0].format||"?"} = <b className="ns-num">{(Number(rows[0].qty)||0)*unitsPerPack(rows[0].format)}</b> {packLabel(rows[0].format,fr)}
            </div>
          )}
        </div>
      )}

      {member&&<div style={{fontSize:12.5,color:C.warn,marginBottom:13}}>
        {fr?"Signé par":"Signed by"} {member.full_name||member.email}
        {member.licence&&<span className="ns-num"> · {member.licence}</span>}
      </div>}

      <div className="ns-panel" style={{maxHeight:400,overflowY:"auto",marginBottom:14}}>
        <table style={{width:"100%",minWidth:860}}>
          <thead><tr>
            <th>CUP</th><th>Description</th><th>{fr?"Force":"Strength"}</th><th>Format</th><th>DIN</th>
            {showQty&&<th>{fr?"Qté lue":"Read qty"}</th>}
            {showQty&&unitMode==="pack"&&<th style={{color:C.ok}}>{fr?"Unités":"Units"}</th>}
            <th></th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>{
              const ok=cleanDin(r.din).length===8;
              return(
                <tr key={i}>
                  <td><input value={r.cup||""} onChange={e=>up(i,"cup",e.target.value)} className="ns-cell ns-num" style={{width:106}}/></td>
                  <td><input value={r.description||r.molecule||""} onChange={e=>up(i,"description",e.target.value)} className="ns-cell" style={{width:190}}/></td>
                  <td><input value={r.strength||""} onChange={e=>up(i,"strength",e.target.value)} className="ns-cell" style={{width:62}}/></td>
                  <td><input value={r.format||""} onChange={e=>up(i,"format",e.target.value)} className="ns-cell" style={{width:82}}/></td>
                  <td><input value={r.din||""} onChange={e=>up(i,"din",e.target.value)} className="ns-cell ns-num"
                    style={{width:86,borderColor:ok?C.line:"#E9A3A3",background:ok?C.paper:C.flagBg}}/></td>
                  {showQty&&<td><input type="number" value={r.qty||0} onChange={e=>up(i,"qty",e.target.value)} className="ns-cell ns-num" style={{width:60,textAlign:"center"}}/></td>}
                  {showQty&&unitMode==="pack"&&<td className="ns-num" style={{textAlign:"center",fontWeight:600,color:C.ok}}>{(Number(r.qty)||0)*unitsPerPack(r.format)}</td>}
                  <td><button onClick={()=>del(i)} className="ns-x">×</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={onConfirm} disabled={busy||rows.length===0} className="ns-btn ns-btn-primary">
          {fr?"Valider et enregistrer":"Validate and save"}
        </button>
        <button onClick={onCancel} className="ns-btn ns-btn-quiet">{fr?"Annuler":"Cancel"}</button>
      </div>
    </div>
  );
}

function TeamPage({session,member,fr}){
  const pid=member?member.pharmacy_id:session.user.id;
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [err,setErr]=useState("");
  const [info,setInfo]=useState("");
  const [busy,setBusy]=useState(false);
  const [editId,setEditId]=useState(null);
  const [edit,setEdit]=useState({full_name:"",licence:"",role:""});
  const [nw,setNw]=useState({email:"",full_name:"",licence:"",role:"pharmacist"});
  const isOwner=member&&member.role==="owner";

  async function load(){
    setLoading(true);setErr("");
    try{setRows(await MEM.list(pid));}catch(e){setErr(e.message);}
    setLoading(false);
  }
  useEffect(()=>{load();},[]);

  async function invite(){
    const email=nw.email.toLowerCase().trim();
    if(!email||!nw.full_name.trim()){setErr(fr?"Le courriel et le nom sont requis.":"Email and name are required.");return;}
    if(nw.role!=="technician"&&!nw.licence.trim()){setErr(fr?"Un pharmacien doit avoir un numéro de licence.":"A pharmacist needs a licence number.");return;}
    setBusy(true);setErr("");setInfo("");
    try{
      await MEM.add({pharmacy_id:pid,user_id:null,email,full_name:nw.full_name.trim(),licence:nw.licence.trim()||null,role:nw.role,active:true});
      const g=SB.get();
      try{await fetch(g.url+"/auth/v1/signup",{method:"POST",headers:{"Content-Type":"application/json","apikey":g.key},body:JSON.stringify({email,password:"Tmp-"+Math.random().toString(36).slice(2,10)+"!A9"})});}catch(e){}
      try{await fetch(g.url+"/auth/v1/recover",{method:"POST",headers:{"Content-Type":"application/json","apikey":g.key},body:JSON.stringify({email,redirect_to:window.location.origin})});}catch(e){}
      await AUDIT.log(member,"invite_member","pharmacy_members",null,nw.role+" · "+email);
      setNw({email:"",full_name:"",licence:"",role:"pharmacist"});
      setInfo((fr?"Invitation envoyée à ":"Invitation sent to ")+email);
      await load();
    }catch(e){setErr(e.message);}
    setBusy(false);
  }
  function startEdit(r){setEditId(r.id);setEdit({full_name:r.full_name||"",licence:r.licence||"",role:r.role});}
  async function saveEdit(r){
    try{
      await MEM.update(r.id,{full_name:edit.full_name.trim()||null,licence:edit.licence.trim()||null,role:edit.role});
      await AUDIT.log(member,"update_member","pharmacy_members",r.id,r.email+" · "+edit.role+" · "+(edit.licence||"—"));
      if(member&&member.id===r.id) SB.saveMember({...member,full_name:edit.full_name.trim(),licence:edit.licence.trim(),role:edit.role});
      setEditId(null);setInfo(fr?"Membre mis à jour.":"Member updated.");
      await load();
    }catch(e){setErr(e.message);}
  }
  async function toggle(r){
    try{await MEM.update(r.id,{active:!r.active});await AUDIT.log(member,r.active?"deactivate_member":"activate_member","pharmacy_members",r.id,r.email);await load();}catch(e){setErr(e.message);}
  }
  async function del(r){
    if(r.role==="owner"){setErr(fr?"Le propriétaire ne peut pas être retiré.":"The owner can't be removed.");return;}
    if(!window.confirm(fr?("Retirer "+(r.full_name||r.email)+"?"):("Remove "+(r.full_name||r.email)+"?"))) return;
    try{await MEM.remove(r.id);await AUDIT.log(member,"remove_member","pharmacy_members",r.id,r.email);await load();}catch(e){setErr(e.message);}
  }

  return(
    <div style={{padding:"30px 34px",maxWidth:1180}}>
      <H1 sub={fr?"Chaque action posée dans NarcoSync porte le nom et la licence de la personne connectée.":"Every action carries the name and licence of the person signed in."}>
        {rows.length} {fr?(rows.length===1?"membre":"membres"):(rows.length===1?"member":"members")}
      </H1>

      {!isOwner&&<Note tone="warn">{fr?"Seul le pharmacien-propriétaire peut ajouter ou retirer des membres.":"Only the pharmacist-owner can add or remove members."}</Note>}

      {isOwner&&(
        <div className="ns-panel" style={{padding:20,marginBottom:22}}>
          <div style={{fontSize:14.5,fontWeight:650,marginBottom:14}}>{fr?"Inviter un membre":"Invite someone"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1.4fr 1.2fr 1fr 1fr",gap:11,marginBottom:14}}>
            {[["email",fr?"Courriel":"Email","prenom@pharmacie.com"],["full_name",fr?"Nom complet":"Full name",fr?"Prénom Nom":"First Last"]].map(([k,l,p])=>(
              <div key={k}>
                <label style={{fontSize:12,fontWeight:600,color:C.text2,display:"block",marginBottom:5}}>{l}</label>
                <input value={nw[k]} onChange={e=>setNw({...nw,[k]:e.target.value})} placeholder={p} className="ns-in"/>
              </div>
            ))}
            <div>
              <label style={{fontSize:12,fontWeight:600,color:C.text2,display:"block",marginBottom:5}}>{fr?"Rôle":"Role"}</label>
              <select value={nw.role} onChange={e=>setNw({...nw,role:e.target.value})} className="ns-in" style={{cursor:"pointer"}}>
                <option value="pharmacist">{fr?ROLES.pharmacist.fr:ROLES.pharmacist.en}</option>
                <option value="technician">{fr?ROLES.technician.fr:ROLES.technician.en}</option>
                <option value="owner">{fr?ROLES.owner.fr:ROLES.owner.en}</option>
              </select>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:C.text2,display:"block",marginBottom:5}}>
                {fr?"Licence":"Licence"}{nw.role==="technician"&&<span style={{color:C.text3,fontWeight:400}}> {fr?"(optionnel)":"(optional)"}</span>}
              </label>
              <input value={nw.licence} onChange={e=>setNw({...nw,licence:e.target.value})} placeholder="OPQ-12345" className="ns-in ns-num"/>
            </div>
          </div>
          <button onClick={invite} disabled={busy} className="ns-btn ns-btn-primary">
            {busy?(fr?"Envoi":"Sending"):(fr?"Envoyer l'invitation":"Send invitation")}
          </button>
          <div style={{fontSize:12.5,color:C.text2,marginTop:10,lineHeight:1.5}}>
            {fr?"La personne reçoit un courriel pour choisir son mot de passe.":"They get an email to set their own password."}
          </div>
        </div>
      )}

      {err&&<Note tone="flag">{err}</Note>}
      {info&&<Note tone="ok">{info}</Note>}

      <div className="ns-panel" style={{overflowX:"auto"}}>
        <table style={{width:"100%",minWidth:840}}>
          <thead><tr>
            <th>{fr?"Nom":"Name"}</th><th>{fr?"Courriel":"Email"}</th><th>{fr?"Licence":"Licence"}</th>
            <th>{fr?"Rôle":"Role"}</th><th>{fr?"Compte":"Account"}</th><th></th>
          </tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={6} style={{color:C.text3}}>{fr?"Chargement":"Loading"}</td></tr>}
            {!loading&&rows.length===0&&<tr><td colSpan={6} style={{color:C.text3}}>{fr?"Personne encore.":"No one yet."}</td></tr>}
            {rows.map(r=>{
              const ed=editId===r.id;
              return(
                <tr key={r.id} style={{opacity:r.active?1:.42,background:ed?C.bg:"transparent"}}>
                  <td>{ed?<input value={edit.full_name} onChange={e=>setEdit({...edit,full_name:e.target.value})} className="ns-cell" style={{width:150}}/>:<span style={{fontWeight:600}}>{r.full_name||"—"}</span>}</td>
                  <td style={{color:C.text2}}>{r.email}</td>
                  <td>{ed?<input value={edit.licence} onChange={e=>setEdit({...edit,licence:e.target.value})} placeholder="OPQ-12345" className="ns-cell ns-num" style={{width:106}}/>
                    :(r.licence?<span className="ns-num">{r.licence}</span>:<Tag tone="flag">{fr?"à ajouter":"missing"}</Tag>)}</td>
                  <td>{ed?(
                      <select value={edit.role} onChange={e=>setEdit({...edit,role:e.target.value})} className="ns-cell" style={{cursor:"pointer"}}>
                        <option value="owner">{fr?ROLES.owner.fr:ROLES.owner.en}</option>
                        <option value="pharmacist">{fr?ROLES.pharmacist.fr:ROLES.pharmacist.en}</option>
                        <option value="technician">{fr?ROLES.technician.fr:ROLES.technician.en}</option>
                      </select>):<RoleTag role={r.role} fr={fr}/>}</td>
                  <td>{r.user_id?<Tag tone="ok">{fr?"Actif":"Active"}</Tag>:<Tag tone="warn">{fr?"Invité":"Invited"}</Tag>}</td>
                  <td>
                    {isOwner&&(
                      <span style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {ed?(
                          <>
                            <button onClick={()=>saveEdit(r)} className="ns-btn ns-btn-primary" style={{padding:"5px 12px",fontSize:12}}>{fr?"Enregistrer":"Save"}</button>
                            <button onClick={()=>setEditId(null)} className="ns-btn ns-btn-quiet" style={{padding:"5px 11px",fontSize:12}}>{fr?"Annuler":"Cancel"}</button>
                          </>
                        ):(
                          <>
                            <button onClick={()=>startEdit(r)} className="ns-btn ns-btn-quiet" style={{padding:"5px 12px",fontSize:12}}>{fr?"Modifier":"Edit"}</button>
                            {r.role!=="owner"&&<button onClick={()=>toggle(r)} className="ns-btn ns-btn-quiet" style={{padding:"5px 11px",fontSize:12}}>{r.active?(fr?"Désactiver":"Disable"):(fr?"Activer":"Enable")}</button>}
                            {r.role!=="owner"&&<button onClick={()=>del(r)} className="ns-x">×</button>}
                          </>
                        )}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{marginTop:26,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
        {[
          {r:"owner",items:fr?["Accès complet","Gère l'équipe","Supprime et ajuste","Valide les écarts"]:["Full access","Manages the team","Deletes and adjusts","Approves variances"]},
          {r:"pharmacist",items:fr?["Inventaire et réconciliation","Valide les imports","Valide les écarts","Ne gère pas l'équipe"]:["Inventory and reconciliation","Validates imports","Approves variances","Can't manage the team"]},
          {r:"technician",items:fr?["Consulte l'inventaire","Saisit le décompte","Imprime les rapports","Ne supprime rien"]:["Views inventory","Enters counts","Prints reports","Deletes nothing"]},
        ].map(x=>(
          <div key={x.r} className="ns-panel" style={{padding:17}}>
            <div style={{marginBottom:11}}><RoleTag role={x.r} fr={fr}/></div>
            {x.items.map((it,i)=><div key={i} style={{fontSize:12.5,color:C.text2,marginBottom:6,lineHeight:1.45}}>{it}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditPage({session,member,fr}){
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [err,setErr]=useState("");
  useEffect(()=>{
    (async()=>{
      try{
        const mems=await MEM.list(member?member.pharmacy_id:session.user.id);
        const ids=mems.map(m=>m.user_id).filter(Boolean);
        if(!ids.length){setRows([]);setLoading(false);return;}
        setRows(await AUDIT.list(ids));
      }catch(e){setErr(e.message);}
      setLoading(false);
    })();
  },[]);
  function fd(d){if(!d)return "—";return new Date(d).toLocaleDateString(fr?"fr-CA":"en-CA",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});}
  const L={invite_member:fr?"Membre invité":"Member invited",remove_member:fr?"Membre retiré":"Member removed",
    update_member:fr?"Membre modifié":"Member updated",activate_member:fr?"Membre activé":"Member activated",
    deactivate_member:fr?"Membre désactivé":"Member disabled",delete_drug:fr?"Produit supprimé":"Product deleted",
    adjust_qty:fr?"Quantité ajustée":"Quantity adjusted",import_inventory:fr?"Import validé":"Import validated",
    save_cycle:fr?"Cycle enregistré":"Cycle saved",delete_cycle:fr?"Cycle supprimé":"Cycle deleted",
    add_drug:fr?"Produit ajouté":"Product added"};
  return(
    <div style={{padding:"30px 34px",maxWidth:1180}}>
      <div className="ns-print-only" style={{marginBottom:14}}>
        <div style={{fontSize:15,fontWeight:650}}>{fr?"Journal d'audit":"Audit log"}</div>
      </div>
      <div className="ns-noprint" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:14,flexWrap:"wrap"}}>
        <H1 sub={fr?"Nom, licence, date et heure pour chaque action. Le journal ne peut être ni modifié ni effacé.":"Name, licence, date and time for every action. This log can't be edited or erased."}>
          {fr?"Journal d'audit":"Audit log"}
        </H1>
        <button onClick={()=>window.print()} className="ns-btn ns-btn-quiet">{fr?"Imprimer":"Print"}</button>
      </div>
      {err&&<Note tone="flag">{err}</Note>}
      <div className="ns-panel" style={{overflowX:"auto"}}>
        <table style={{width:"100%",minWidth:820}}>
          <thead><tr>
            <th>{fr?"Quand":"When"}</th><th>{fr?"Action":"Action"}</th><th>{fr?"Détail":"Detail"}</th>
            <th>{fr?"Par":"By"}</th><th>{fr?"Licence":"Licence"}</th>
          </tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={5} style={{color:C.text3}}>{fr?"Chargement":"Loading"}</td></tr>}
            {!loading&&rows.length===0&&<tr><td colSpan={5} style={{color:C.text3}}>{fr?"Rien encore. Les actions apparaîtront ici.":"Nothing yet. Actions will show up here."}</td></tr>}
            {rows.map(r=>(
              <tr key={r.id}>
                <td className="ns-num" style={{whiteSpace:"nowrap",color:C.text2,fontSize:12}}>{fd(r.created_at)}</td>
                <td style={{fontWeight:600}}>{L[r.action]||r.action}</td>
                <td style={{color:C.text2}}>{r.details||"—"}</td>
                <td>{r.pharmacist_name||"—"}</td>
                <td className="ns-num" style={{fontSize:12}}>{r.pharmacist_licence||"—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryPage({session,member,fr,profile}){
  const pid=member?member.pharmacy_id:session.user.id;
  const role=member?member.role:"owner";
  const canEdit=can(role,"edit");
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [err,setErr]=useState("");
  const [info,setInfo]=useState("");
  const [busy,setBusy]=useState("");
  const [paused,setPaused]=useState(false);
  const [pending,setPending]=useState(null);
  const [unitMode,setUnitMode]=useState("pack");
  const [showKey,setShowKey]=useState(false);
  const [showAdd,setShowAdd]=useState(false);
  const [nw,setNw]=useState({cup:"",molecule:"",strength:"",format:"",din:"",qty:"",mode:"pack"});
  const [catQuery,setCatQuery]=useState("");
  const [catRes,setCatRes]=useState([]);
  const fileRef=useRef();
  const ctrlRef=useRef({paused:false,cancelled:false});

  async function load(s){
    setLoading(true);setErr("");
    try{setRows(await INV.list(pid,s));}catch(e){setErr(e.message);}
    setLoading(false);
  }
  useEffect(()=>{load("");},[]);

  async function searchCatalog(q){
    setCatQuery(q);
    if(!q||q.length<2){setCatRes([]);return;}
    try{setCatRes((await CAT.list(q)).slice(0,20));}catch(e){}
  }
  async function addFromCatalog(d){
    try{
      await INV.addMany(pid,[{drug_id:d.id,din:d.din,cup:d.cup,molecule:d.molecule,strength:d.strength,format:d.format,qty:0}]);
      await AUDIT.log(member,"add_drug","pharmacy_drugs",null,d.molecule+" · DIN "+(d.din||"—"));
      setCatQuery("");setCatRes([]);setInfo((fr?"Ajouté : ":"Added: ")+d.molecule);
      await load(search);
    }catch(e){setErr(e.message);}
  }
  async function addManual(){
    if(!nw.molecule.trim()){setErr(fr?"La description est requise.":"Description is required.");return;}
    try{
      const din=cleanDin(nw.din);
      if(din){const hit=await CAT.byDins([din]);if(!hit.length) await CAT.upsertMany([{din,description:nw.molecule,strength:nw.strength,format:nw.format,cup:nw.cup}]);}
      const q=Number(nw.qty)||0;
      const fq=nw.mode==="pack"?q*unitsPerPack(nw.format):q;
      await INV.addMany(pid,[{din,cup:nw.cup,molecule:nw.molecule,strength:nw.strength,format:nw.format,qty:fq}]);
      await AUDIT.log(member,"add_drug","pharmacy_drugs",null,nw.molecule+" · "+fq+" "+packLabel(nw.format,fr));
      setNw({cup:"",molecule:"",strength:"",format:"",din:"",qty:"",mode:"pack"});setShowAdd(false);
      setInfo((fr?"Ajouté : ":"Added: ")+nw.molecule+" · "+fq+" "+packLabel(nw.format,fr));
      await load(search);
    }catch(e){setErr(e.message);}
  }
  async function handleFiles(e){
    const files=Array.from(e.target.files||[]);
    if(!files.length) return;
    const key=SB.getAIKey();
    if(!key){setShowKey(true);e.target.value="";return;}
    setErr("");setInfo("");setPaused(false);
    ctrlRef.current={paused:false,cancelled:false};
    let all=[];
    try{all=await scanFiles(files,key,PROMPT_ORDER,(p)=>setBusy(p),ctrlRef.current);}
    catch(e2){setBusy("");e.target.value="";setErr(e2.message);return;}
    e.target.value="";
    if(all&&all.length){
      setBusy(fr?"Recherche des DIN par CUP":"Matching DIN by CUP");
      let filled=0;
      try{
        const need=all.filter(r=>cleanDin(r.din).length!==8&&cleanCup(r.cup)).map(r=>cleanCup(r.cup));
        if(need.length){
          const hits=await CAT.byCups([...new Set(need)]);
          const map={};hits.forEach(h=>{if(h.cup)map[cleanCup(h.cup)]=h;});
          all=all.map(r=>{
            if(cleanDin(r.din).length===8) return r;
            const h=map[cleanCup(r.cup)];
            if(h&&h.din){filled++;return{...r,din:h.din,strength:r.strength||h.strength||"",format:r.format||h.format||""};}
            return r;
          });
        }
      }catch(e3){}
      setBusy("");
      let msg="";
      if(filled) msg=filled+(fr?" DIN retrouvés dans le catalogue":" DIN found in the catalog");
      if(all.failedLabels) msg+=(msg?". ":"")+(fr?"Non lus : ":"Couldn't read: ")+all.failedLabels;
      if(msg) setInfo(msg);
      setPending(all.map(r=>({...r,din:cleanDin(r.din)})));
    } else {setBusy("");setErr(fr?"Aucun produit trouvé dans ce document.":"No products found in that document.");}
  }
  async function confirmPending(){
    setBusy(fr?"Enregistrement":"Saving");
    try{
      const dins=pending.map(r=>cleanDin(r.din)).filter(d=>d.length===8);
      const known=await CAT.byDins(dins);
      const map={};known.forEach(k=>{if(k.din)map[k.din]=k;});
      const newOnes=pending.filter(r=>{const d=cleanDin(r.din);return d.length===8&&!map[d];});
      if(newOnes.length){try{await CAT.upsertMany(newOnes);}catch(e){}}
      const payload=pending.map(r=>{
        const d=cleanDin(r.din);const hit=map[d];
        const fmt=r.format||(hit?hit.format:"");
        const q=Number(r.qty)||0;
        return {drug_id:hit?hit.id:null,din:d,cup:r.cup||(hit?hit.cup:""),
          molecule:r.description||r.molecule||(hit?hit.molecule:""),
          strength:r.strength||(hit?hit.strength:""),format:fmt,
          qty:unitMode==="pack"?q*unitsPerPack(fmt):q};
      });
      const res=await INV.addMany(pid,payload);
      await AUDIT.log(member,"import_inventory","pharmacy_drugs",null,
        pending.length+(fr?" lignes, ":" lines, ")+res.added+(fr?" ajoutées, ":" added, ")+res.merged+(fr?" fusionnées":" merged"));
      setPending(null);setBusy("");
      setInfo(res.added+(fr?" produits ajoutés":" products added")+(res.merged?(fr?", ":", ")+res.merged+(fr?" quantités mises à jour":" quantities updated"):"")+(newOnes.length?(fr?", ":", ")+newOnes.length+(fr?" nouveaux au catalogue":" new to the catalog"):""));
      await load(search);
    }catch(e){setBusy("");setErr(e.message);}
  }
  async function saveQty(r,v){
    const val=Number(v)||0;
    if(val===(Number(r.qty)||0)) return;
    try{
      await INV.update(r.id,{qty:val,last_count_at:new Date().toISOString()});
      await AUDIT.log(member,"adjust_qty","pharmacy_drugs",r.id,(r.molecule||"")+" : "+(r.qty||0)+" → "+val);
      setInfo((r.molecule||"")+" · "+(r.qty||0)+" → "+val);
    }catch(e){setErr(e.message);}
  }
  async function del(r){
    if(!window.confirm(fr?("Retirer "+(r.molecule||"")+" de l'inventaire?"):("Remove "+(r.molecule||"")+"?"))) return;
    try{
      await INV.remove(r.id);
      await AUDIT.log(member,"delete_drug","pharmacy_drugs",r.id,(r.molecule||"")+" · DIN "+(r.din||"—"));
      setRows(rows.filter(x=>x.id!==r.id));
    }catch(e){setErr(e.message);}
  }

  return(
    <div style={{padding:"30px 34px",maxWidth:1320}}>
      {showKey&&<AIKeyModal fr={fr} onClose={()=>setShowKey(false)} onSaved={()=>{setShowKey(false);fileRef.current?.click();}}/>}

      <div className="ns-print-only" style={{marginBottom:14}}>
        <div style={{fontSize:15,fontWeight:650}}>{profile?.pharmacy_name||""} — {fr?"Inventaire des narcotiques":"Narcotics inventory"}</div>
        <div style={{fontSize:11,marginTop:3}}>{new Date().toLocaleDateString(fr?"fr-CA":"en-CA")} · {rows.length} {fr?"produits":"products"}</div>
      </div>

      <div className="ns-noprint" style={{display:"flex",flexWrap:"wrap",gap:14,alignItems:"flex-start",justifyContent:"space-between"}}>
        <H1 sub={fr?"Toutes les quantités sont en unités : comprimés, capsules ou millilitres.":"All quantities are in units: tablets, capsules or millilitres."}>
          {rows.length} {fr?(rows.length===1?"produit":"produits"):(rows.length===1?"product":"products")}
        </H1>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button onClick={()=>window.print()} className="ns-btn ns-btn-quiet">{fr?"Imprimer":"Print"}</button>
          {canEdit&&(
            <>
              <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFiles} style={{display:"none"}}/>
              <button onClick={()=>setShowAdd(!showAdd)} className="ns-btn ns-btn-quiet">{fr?"Ajouter un produit":"Add a product"}</button>
              <button onClick={()=>{if(!SB.getAIKey()){setShowKey(true);}else{fileRef.current?.click();}}} disabled={!!busy} className="ns-btn ns-btn-primary">
                {busy?(fr?"Lecture en cours":"Reading"):(fr?"Lire un document":"Read a document")}
              </button>
            </>
          )}
        </div>
      </div>

      {!canEdit&&<Note tone="warn">{fr?"Vous pouvez consulter, imprimer et saisir un décompte. Les modifications d'inventaire sont réservées aux pharmaciens.":"You can view, print and enter counts. Inventory changes are reserved for pharmacists."}</Note>}

      {showAdd&&canEdit&&(
        <div className="ns-noprint ns-panel" style={{padding:20,marginBottom:20}}>
          <div style={{fontSize:14.5,fontWeight:650,marginBottom:12}}>{fr?"Chercher dans le catalogue":"Search the catalog"}</div>
          <input value={catQuery} onChange={e=>searchCatalog(e.target.value)} placeholder={fr?"Nom, DIN ou CUP":"Name, DIN or CUP"} className="ns-in" style={{marginBottom:11,maxWidth:460}}/>
          {catRes.length>0&&(
            <div className="ns-panel" style={{maxHeight:210,overflowY:"auto",marginBottom:16}}>
              {catRes.map(d=>(
                <div key={d.id} onClick={()=>addFromCatalog(d)} style={{padding:"10px 13px",borderBottom:"1px solid "+C.line2,cursor:"pointer",fontSize:13,display:"flex",justifyContent:"space-between",gap:12}}>
                  <span style={{fontWeight:600}}>{d.molecule}</span>
                  <span className="ns-num" style={{color:C.text2,fontSize:12}}>{d.format||""} {d.din||""}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{fontSize:14.5,fontWeight:650,marginBottom:12,marginTop:20}}>{fr?"Ou saisir un produit qui n'y est pas":"Or enter one that isn't there"}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:13}}>
            {[["cup","CUP"],["molecule",fr?"Description":"Description"],["strength",fr?"Force":"Strength"],["format","Format"],["din","DIN"],["qty",fr?"Quantité":"Quantity"]].map(([k,l])=>(
              <div key={k}>
                <label style={{fontSize:12,fontWeight:600,color:C.text2,display:"block",marginBottom:5}}>{l}</label>
                <input value={nw[k]} onChange={e=>setNw({...nw,[k]:e.target.value})} placeholder={k==="format"?"100 TAB":""}
                  className={"ns-in"+(k==="cup"||k==="din"||k==="qty"?" ns-num":"")} style={k==="qty"?{textAlign:"center"}:{}}/>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
            <span style={{fontSize:12.5,color:C.text2}}>{fr?"Cette quantité est en":"This quantity is in"}</span>
            {[{v:"pack",l:fr?"bouteilles":"bottles"},{v:"unit",l:fr?"unités":"units"}].map(o=>(
              <button key={o.v} onClick={()=>setNw({...nw,mode:o.v})} style={{padding:"6px 14px",borderRadius:6,
                border:"1px solid "+(nw.mode===o.v?C.ink:C.line),background:nw.mode===o.v?C.ink:C.paper,
                color:nw.mode===o.v?"#fff":C.text2,cursor:"pointer",fontSize:12.5,fontWeight:600}}>{o.l}</button>
            ))}
            {nw.qty&&nw.format&&nw.mode==="pack"&&(
              <Tag tone="ok"><span className="ns-num">{(Number(nw.qty)||0)*unitsPerPack(nw.format)}</span> {packLabel(nw.format,fr)}</Tag>
            )}
          </div>
          <button onClick={addManual} className="ns-btn ns-btn-primary">{fr?"Ajouter":"Add"}</button>
        </div>
      )}

      <input className="ns-noprint ns-in" value={search} placeholder={fr?"Chercher dans l'inventaire":"Search the inventory"}
        onChange={e=>setSearch(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")load(search);}} style={{maxWidth:400,marginBottom:18}}/>

      {busy&&(
        <div className="ns-noprint ns-panel" style={{padding:"13px 16px",marginBottom:15,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <span className="ns-num" style={{fontSize:13,fontWeight:600}}>{busy}</span>
          <span style={{display:"flex",gap:8}}>
            <button onClick={()=>{ctrlRef.current.paused=!ctrlRef.current.paused;setPaused(ctrlRef.current.paused);}} className="ns-btn ns-btn-quiet" style={{padding:"5px 13px",fontSize:12}}>{paused?(fr?"Reprendre":"Resume"):(fr?"Pause":"Pause")}</button>
            <button onClick={()=>{ctrlRef.current.cancelled=true;}} className="ns-btn ns-btn-quiet" style={{padding:"5px 13px",fontSize:12,color:C.flag}}>{fr?"Arrêter":"Stop"}</button>
          </span>
        </div>
      )}
      {err&&<div className="ns-noprint"><Note tone="flag">{err}</Note></div>}
      {info&&<div className="ns-noprint"><Note tone="ok">{info}</Note></div>}

      {pending&&<ValidationTable rows={pending} setRows={setPending} showQty={true} onConfirm={confirmPending}
        onCancel={()=>setPending(null)} busy={!!busy} fr={fr} member={member} unitMode={unitMode} setUnitMode={setUnitMode}/>}

      <div className="ns-panel" style={{overflowX:"auto"}}>
        <table style={{width:"100%",minWidth:880}}>
          <thead><tr>
            <th>CUP</th><th>Description</th><th>{fr?"Force":"Strength"}</th><th>Format</th><th>DIN</th>
            <th style={{textAlign:"right"}}>{fr?"Quantité":"Quantity"}</th>
            {canEdit&&<th className="ns-noprint"></th>}
          </tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={7} style={{color:C.text3}}>{fr?"Chargement":"Loading"}</td></tr>}
            {!loading&&rows.length===0&&<tr><td colSpan={7} style={{color:C.text3,padding:"22px 10px"}}>
              {fr?"Aucun produit. Lisez un bon d'achat ou ajoutez un produit à la main.":"No products yet. Read a purchase order or add one by hand."}
            </td></tr>}
            {rows.map(r=>(
              <tr key={r.id}>
                <td className="ns-num" style={{fontSize:12,color:C.text2}}>{r.cup||"—"}</td>
                <td style={{fontWeight:600}}>{r.molecule||"—"}</td>
                <td style={{color:C.text2}}>{r.strength||"—"}</td>
                <td style={{color:C.text2}}>{r.format||"—"}</td>
                <td className="ns-num" style={{fontSize:12}}>{r.din||"—"}</td>
                <td style={{textAlign:"right"}}>
                  {canEdit
                    ?<input type="number" defaultValue={r.qty||0} onBlur={e=>saveQty(r,e.target.value)}
                      className="ns-cell ns-num" style={{width:78,textAlign:"right",fontWeight:600}}/>
                    :<span className="ns-num" style={{fontWeight:600}}>{r.qty||0}</span>}
                </td>
                {canEdit&&<td className="ns-noprint"><button onClick={()=>del(r)} className="ns-x">×</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length>0&&canEdit&&<div className="ns-noprint" style={{fontSize:12.5,color:C.text2,marginTop:10}}>
        {fr?"Modifiez une quantité et cliquez ailleurs. L'ajustement est inscrit au journal avec votre licence.":"Change a quantity and click away. The adjustment is logged with your licence."}
      </div>}
    </div>
  );
}

function AdminCatalogPage(){
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [err,setErr]=useState("");
  const [busy,setBusy]=useState("");
  const [paused,setPaused]=useState(false);
  const [pending,setPending]=useState(null);
  const [showKey,setShowKey]=useState(false);
  const fileRef=useRef();
  const ctrlRef=useRef({paused:false,cancelled:false});

  async function load(s){
    setLoading(true);setErr("");
    try{setRows(await CAT.list(s));}catch(e){setErr(e.message);}
    setLoading(false);
  }
  useEffect(()=>{load("");},[]);
  async function handleFiles(e){
    const files=Array.from(e.target.files||[]);
    if(!files.length) return;
    const key=SB.getAIKey();
    if(!key){setShowKey(true);e.target.value="";return;}
    setErr("");setPaused(false);
    ctrlRef.current={paused:false,cancelled:false};
    try{
      const all=await scanFiles(files,key,PROMPT_CATALOG,(p)=>setBusy(p),ctrlRef.current);
      setBusy("");e.target.value="";
      if(all&&all.length) setPending(all.map(r=>({...r,din:cleanDin(r.din)})));
      else setErr("No products found.");
    }catch(e2){setBusy("");e.target.value="";setErr(e2.message);}
  }
  async function confirmImport(){
    setBusy("Saving");
    try{const n=await CAT.upsertMany(pending);setPending(null);setBusy("");await load(search);alert("Imported: "+n);}
    catch(e){setBusy("");setErr(e.message);}
  }
  async function del(id){
    if(!window.confirm("Delete this row?")) return;
    try{await CAT.remove(id);setRows(rows.filter(r=>r.id!==id));}catch(e){setErr(e.message);}
  }

  return(
    <div style={{padding:"30px 34px",maxWidth:1180}}>
      {showKey&&<AIKeyModal fr={false} onClose={()=>setShowKey(false)} onSaved={()=>{setShowKey(false);fileRef.current?.click();}}/>}
      <div style={{display:"flex",flexWrap:"wrap",gap:14,alignItems:"flex-start",justifyContent:"space-between"}}>
        <H1 sub="Shared across every pharmacy. Discontinued lines are excluded on import.">
          {rows.length} products
        </H1>
        <div>
          <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFiles} style={{display:"none"}}/>
          <button onClick={()=>{if(!SB.getAIKey()){setShowKey(true);}else{fileRef.current?.click();}}} disabled={!!busy} className="ns-btn ns-btn-primary">
            {busy?"Reading":"Read a document"}
          </button>
        </div>
      </div>
      <input value={search} placeholder="Search description, DIN or CUP" onChange={e=>setSearch(e.target.value)}
        onKeyDown={e=>{if(e.key==="Enter")load(search);}} className="ns-in" style={{maxWidth:400,marginBottom:18}}/>
      {busy&&(
        <div className="ns-panel" style={{padding:"13px 16px",marginBottom:15,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <span className="ns-num" style={{fontSize:13,fontWeight:600}}>{busy}</span>
          <span style={{display:"flex",gap:8}}>
            <button onClick={()=>{ctrlRef.current.paused=!ctrlRef.current.paused;setPaused(ctrlRef.current.paused);}} className="ns-btn ns-btn-quiet" style={{padding:"5px 13px",fontSize:12}}>{paused?"Resume":"Pause"}</button>
            <button onClick={()=>{ctrlRef.current.cancelled=true;}} className="ns-btn ns-btn-quiet" style={{padding:"5px 13px",fontSize:12,color:C.flag}}>Stop</button>
          </span>
        </div>
      )}
      {err&&<Note tone="flag">{err}</Note>}
      {pending&&<ValidationTable rows={pending} setRows={setPending} showQty={false} onConfirm={confirmImport}
        onCancel={()=>setPending(null)} busy={!!busy} fr={false} unitMode="unit" setUnitMode={()=>{}}/>}
      <div className="ns-panel" style={{overflowX:"auto"}}>
        <table style={{width:"100%",minWidth:820}}>
          <thead><tr><th>CUP</th><th>Description</th><th>Strength</th><th>Format</th><th>DIN</th><th></th></tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={6} style={{color:C.text3}}>Loading</td></tr>}
            {!loading&&rows.length===0&&<tr><td colSpan={6} style={{color:C.text3}}>Catalog is empty.</td></tr>}
            {rows.map(r=>(
              <tr key={r.id}>
                <td className="ns-num" style={{fontSize:12,color:C.text2}}>{r.cup||"—"}</td>
                <td style={{fontWeight:600}}>{r.molecule}</td>
                <td style={{color:C.text2}}>{r.strength||"—"}</td>
                <td style={{color:C.text2}}>{r.format||"—"}</td>
                <td className="ns-num" style={{fontSize:12}}>{r.din||"—"}</td>
                <td><button onClick={()=>del(r.id)} className="ns-x">×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Shell({items,page,setPage,tag,name,sub,lang,setLang,onLogout,children,signOutLabel}){
  return(
    <div style={{display:"flex",height:"100vh"}}>
      <div className="ns-sidebar" style={{width:216,background:C.ink,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"22px 16px 16px"}}>
          <div style={{color:"#fff",fontSize:16,fontWeight:650,letterSpacing:"-.02em"}}>NarcoSync</div>
          {tag&&<div style={{marginTop:9}}>{tag}</div>}
        </div>
        <div style={{padding:"0 12px 14px",margin:"0 4px 6px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div style={{color:"rgba(255,255,255,.85)",fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name}</div>
          {sub&&<div style={{color:"rgba(255,255,255,.42)",fontSize:11.5,marginTop:3}}>{sub}</div>}
        </div>
        <div style={{flex:1,padding:"6px 8px",overflowY:"auto"}}>
          {items.map(i=>(
            <button key={i.id} className="ns-nav" data-on={page===i.id?"1":"0"} onClick={()=>setPage(i.id)}>{i.label}</button>
          ))}
        </div>
        <div style={{padding:"12px 14px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
          {setLang&&(
            <div style={{display:"flex",gap:5,marginBottom:11}}>
              {[["fr","Français"],["en","English"]].map(([v,l])=>(
                <button key={v} onClick={()=>{SB.setLang(v);setLang(v);}} style={{flex:1,padding:"6px 0",borderRadius:6,border:"none",cursor:"pointer",
                  fontSize:11.5,fontWeight:600,background:lang===v?"rgba(255,255,255,.14)":"transparent",
                  color:lang===v?"#fff":"rgba(255,255,255,.4)"}}>{l}</button>
              ))}
            </div>
          )}
          <button onClick={onLogout} style={{width:"100%",padding:"7px 0",borderRadius:6,border:"none",cursor:"pointer",
            background:"transparent",color:"rgba(255,255,255,.42)",fontSize:12.5,textAlign:"left"}}>{signOutLabel}</button>
        </div>
      </div>
      <div className="ns-main" style={{flex:1,overflowY:"auto",background:C.bg}}>{children}</div>
    </div>
  );
}

function AdminDashboard({session,onLogout}){
  const [page,setPage]=useState("overview");
  const [profiles,setProfiles]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    const {url,key}=SB.get();
    fetch(url+"/rest/v1/profiles?select=*&order=created_at.desc",{headers:{"apikey":key,"Authorization":"Bearer "+session.access_token}})
      .then(r=>r.json()).then(d=>{if(Array.isArray(d))setProfiles(d);setLoading(false);}).catch(()=>setLoading(false));
  },[]);
  const mrr=profiles.reduce((s,p)=>s+(PLAN_PRICE[p.plan]||0),0);
  const items=[{id:"overview",label:"Overview"},{id:"pharmacies",label:"Pharmacies"},{id:"catalog",label:"Drug catalog"}];
  return(
    <Shell items={items} page={page} setPage={setPage} name={session.user.email} signOutLabel="Sign out"
      tag={<span style={{background:"rgba(255,255,255,.12)",color:"rgba(255,255,255,.8)",fontSize:10.5,fontWeight:600,padding:"3px 8px",borderRadius:4}}>Admin</span>}
      onLogout={onLogout}>
      {page==="overview"&&(
        <div style={{padding:"30px 34px",maxWidth:1000}}>
          <H1 sub="Every pharmacy on NarcoSync.">Overview</H1>
          {loading?<div style={{color:C.text3}}>Loading</div>:(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14}}>
              {[["Pharmacies",profiles.length],["Monthly revenue","$"+mrr],["Countries",[...new Set(profiles.map(p=>p.country).filter(Boolean))].length]].map(([l,v])=>(
                <div key={l} className="ns-panel" style={{padding:20}}>
                  <div className="ns-num" style={{fontSize:32,fontWeight:650,letterSpacing:"-.03em"}}>{v}</div>
                  <div style={{fontSize:12.5,color:C.text2,marginTop:5}}>{l}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {page==="pharmacies"&&(
        <div style={{padding:"30px 34px",maxWidth:1000}}>
          <H1>{profiles.length} {profiles.length===1?"pharmacy":"pharmacies"}</H1>
          {profiles.length===0&&<div className="ns-panel" style={{padding:26,color:C.text3,fontSize:13}}>No pharmacies yet.</div>}
          {profiles.map((p,i)=>(
            <div key={i} className="ns-panel" style={{padding:19,marginBottom:11}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:12,marginBottom:7,flexWrap:"wrap"}}>
                <div>
                  <div style={{fontSize:15,fontWeight:650}}>{p.pharmacy_name||"—"}</div>
                  <div style={{fontSize:12.5,color:C.text2,marginTop:2}}>{p.email}</div>
                </div>
                {p.plan&&<Tag>{p.plan}</Tag>}
              </div>
              <div style={{fontSize:12.5,color:C.text2}}>
                {[p.pharmacy_address,p.province,p.country].filter(Boolean).join(", ")||"—"}
                {p.pharmacist_owner&&" — "+p.pharmacist_owner}
              </div>
            </div>
          ))}
        </div>
      )}
      {page==="catalog"&&<AdminCatalogPage/>}
    </Shell>
  );
}

function FieldLabel({children,required}){
  return <label style={{fontSize:12,fontWeight:600,color:C.text2,display:"block",marginBottom:5}}>{children}{required&&<span style={{color:C.flag}}> *</span>}</label>;
}
function Field({label,value,onChange,placeholder,type="text",hint,required,num}){
  return(
    <div style={{marginBottom:14}}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className={"ns-in"+(num?" ns-num":"")} style={{borderColor:required&&!value.trim()?"#E9A3A3":C.line}}/>
      {hint&&<div style={{fontSize:11.5,color:C.text3,marginTop:4}}>{hint}</div>}
    </div>
  );
}
function SectionLabel({children}){
  return <div style={{fontSize:13,fontWeight:650,marginTop:24,marginBottom:12,paddingBottom:7,borderBottom:"1px solid "+C.line2}}>{children}</div>;
}
function fmtPhone(d){
  if(!d) return "";
  if(d.length<=3) return d;
  if(d.length<=6) return d.slice(0,3)+"-"+d.slice(3);
  return d.slice(0,3)+"-"+d.slice(3,6)+"-"+d.slice(6,10);
}
function PhoneField({label,value,onChange,countryCode,required}){
  return(
    <div style={{marginBottom:14}}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div style={{display:"flex",gap:8}}>
        <div className="ns-num" style={{padding:"9px 12px",borderRadius:6,border:"1px solid "+C.line,fontSize:13.5,background:C.bg,color:C.text2,flexShrink:0}}>{countryCode||"+1"}</div>
        <input type="tel" value={value} onChange={e=>onChange(fmtPhone(e.target.value.replace(/\D/g,"").slice(0,10)))}
          placeholder="514-000-0000" className="ns-in ns-num" style={{flex:1,borderColor:required&&!value.trim()?"#E9A3A3":C.line}}/>
      </div>
    </div>
  );
}
function AddressAutocomplete({value,onChange,placeholder,hint,countryIso,province,required}){
  const [q,setQ]=useState(value||"");
  const [res,setRes]=useState([]);
  const [open,setOpen]=useState(false);
  const [pos,setPos]=useState({top:0,left:0,width:300});
  const iRef=useRef();const dRef=useRef();const tRef=useRef();
  useEffect(()=>{
    function out(e){const i=iRef.current&&iRef.current.contains(e.target);const d=dRef.current&&dRef.current.contains(e.target);if(!i&&!d)setOpen(false);}
    document.addEventListener("mousedown",out);return()=>document.removeEventListener("mousedown",out);
  },[]);
  function upd(){if(iRef.current){const r=iRef.current.getBoundingClientRect();setPos({top:r.bottom+4,left:r.left,width:r.width});}}
  function handle(v){
    setQ(v);onChange(v);clearTimeout(tRef.current);
    if(v.length<3){setRes([]);setOpen(false);return;}
    upd();
    tRef.current=setTimeout(async()=>{
      try{
        const p=new URLSearchParams({q:v,limit:7,lang:"fr"});
        if(countryIso) p.set("countrycode",countryIso);
        const co=PROVINCE_COORDS[province];
        if(co){p.set("lat",co.lat);p.set("lon",co.lon);}
        const r=await fetch("https://photon.komoot.io/api/?"+p);
        const d=await r.json();
        const f=(d.features||[]).filter(x=>x.properties&&(x.properties.street||x.properties.name));
        setRes(f);if(f.length){upd();setOpen(true);}
      }catch{}
    },400);
  }
  function sel(f){
    const p=f.properties;const parts=[];
    if(p.housenumber) parts.push(p.housenumber);
    if(p.street||p.name) parts.push(p.street||p.name);
    if(p.city||p.locality) parts.push(p.city||p.locality);
    if(p.state) parts.push(p.state);if(p.postcode) parts.push(p.postcode);
    const a=parts.join(", ")||p.name||"";setQ(a);onChange(a);setOpen(false);setRes([]);
  }
  return(
    <div style={{marginBottom:14}}>
      <FieldLabel required={required}>{placeholder}</FieldLabel>
      <input ref={iRef} value={q} onChange={e=>handle(e.target.value)} onFocus={()=>{if(res.length){upd();setOpen(true);}}}
        placeholder={placeholder} className="ns-in" style={{borderColor:required&&!value.trim()?"#E9A3A3":C.line}} autoComplete="off"/>
      {open&&res.length>0&&(
        <div ref={dRef} className="ns-panel" style={{position:"fixed",top:pos.top,left:pos.left,width:pos.width,zIndex:9999,maxHeight:240,overflowY:"auto",boxShadow:"0 12px 32px rgba(18,22,28,.14)"}}>
          {res.map((f,i)=>{const p=f.properties;const main=(p.housenumber?p.housenumber+" ":"")+(p.street||p.name||"");const sub=[p.city||p.locality,p.state,p.postcode].filter(Boolean).join(", ");
            return(<div key={i} onClick={()=>sel(f)} style={{padding:"10px 13px",cursor:"pointer",borderBottom:"1px solid "+C.line2}}>
              <div style={{fontSize:13,fontWeight:600}}>{main}</div>
              <div style={{fontSize:12,color:C.text2,marginTop:1}}>{sub}</div>
            </div>);})}
        </div>
      )}
      {hint&&<div style={{fontSize:11.5,color:C.text3,marginTop:4}}>{hint}</div>}
    </div>
  );
}
function SearchableSelect({options,value,onChange,placeholder,required}){
  const [q,setQ]=useState(value||"");
  const [open,setOpen]=useState(false);
  const [pos,setPos]=useState({top:0,left:0,width:300});
  const iRef=useRef();const dRef=useRef();
  useEffect(()=>{
    function out(e){const i=iRef.current&&iRef.current.contains(e.target);const d=dRef.current&&dRef.current.contains(e.target);if(!i&&!d)setOpen(false);}
    document.addEventListener("mousedown",out);return()=>document.removeEventListener("mousedown",out);
  },[]);
  function upd(){if(iRef.current){const r=iRef.current.getBoundingClientRect();setPos({top:r.bottom+4,left:r.left,width:r.width});}}
  const f=options.filter(o=>!q||o.toLowerCase().includes(q.toLowerCase())).slice(0,20);
  return(
    <div>
      <input ref={iRef} value={q} onChange={e=>{setQ(e.target.value);onChange(e.target.value);upd();setOpen(true);}}
        onFocus={()=>{upd();setOpen(true);}} placeholder={placeholder} className="ns-in"
        style={{borderColor:required&&!value.trim()?"#E9A3A3":C.line}} autoComplete="off"/>
      {open&&f.length>0&&(
        <div ref={dRef} className="ns-panel" style={{position:"fixed",top:pos.top,left:pos.left,width:pos.width,zIndex:9999,maxHeight:230,overflowY:"auto",boxShadow:"0 12px 32px rgba(18,22,28,.14)"}}>
          {f.map(o=>(
            <div key={o} onClick={()=>{onChange(o);setQ(o);setOpen(false);}}
              style={{padding:"10px 13px",cursor:"pointer",fontSize:13,borderBottom:"1px solid "+C.line2,background:value===o?C.bg:C.paper}}>{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function AuthScreen({onAuth}){
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [pwd,setPwd]=useState("");
  const [err,setErr]=useState("");
  const [msg,setMsg]=useState("");
  const [busy,setBusy]=useState(false);
  const [tok,setTok]=useState(null);
  const [np1,setNp1]=useState("");
  const [np2,setNp2]=useState("");

  useEffect(()=>{
    const h=window.location.hash||"";
    if(h.indexOf("access_token")>=0&&h.indexOf("type=recovery")>=0){
      const p=new URLSearchParams(h.replace(/^#/,""));
      const t=p.get("access_token");
      if(t){setTok(t);setMode("reset");}
    }
  },[]);

  async function submit(){
    if(!email||!pwd){setErr("Entrez votre courriel et votre mot de passe.");return;}
    setBusy(true);setErr("");setMsg("");
    const {url,key}=SB.get();
    const ep=mode==="login"?url+"/auth/v1/token?grant_type=password":url+"/auth/v1/signup";
    try{
      const r=await fetch(ep,{method:"POST",headers:{"Content-Type":"application/json","apikey":key},body:JSON.stringify({email,password:pwd})});
      const d=await r.json();
      if(d.access_token){SB.saveSession(d);onAuth(d);}
      else setErr(d.error_description||d.msg||d.message||"Ces identifiants ne fonctionnent pas.");
    }catch(e){setErr("Connexion échouée.");}
    setBusy(false);
  }
  async function sendRecovery(){
    if(!email){setErr("Entrez votre courriel.");return;}
    setBusy(true);setErr("");setMsg("");
    const {url,key}=SB.get();
    try{
      const r=await fetch(url+"/auth/v1/recover",{method:"POST",headers:{"Content-Type":"application/json","apikey":key},body:JSON.stringify({email,redirect_to:window.location.origin})});
      if(r.ok) setMsg("Un lien vient d'être envoyé à "+email+".");
      else{const d=await r.json();setErr(d.msg||d.message||"Envoi impossible.");}
    }catch(e){setErr("Connexion échouée.");}
    setBusy(false);
  }
  async function applyNew(){
    if(np1.length<6){setErr("Choisissez au moins 6 caractères.");return;}
    if(np1!==np2){setErr("Les deux mots de passe diffèrent.");return;}
    setBusy(true);setErr("");
    const {url,key}=SB.get();
    try{
      const r=await fetch(url+"/auth/v1/user",{method:"PUT",headers:{"Content-Type":"application/json","apikey":key,"Authorization":"Bearer "+tok},body:JSON.stringify({password:np1})});
      const d=await r.json();
      if(r.ok){setMsg("Mot de passe enregistré. Connectez-vous.");setTok(null);setMode("login");setNp1("");setNp2("");setPwd("");
        try{window.history.replaceState({},"",window.location.pathname);}catch(e){}}
      else setErr(d.msg||d.message||"Enregistrement impossible.");
    }catch(e){setErr("Connexion échouée.");}
    setBusy(false);
  }

  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:C.ink}}>
      <div style={{width:"100%",maxWidth:378}}>
        <div style={{marginBottom:26}}>
          <div style={{color:"#fff",fontSize:26,fontWeight:650,letterSpacing:"-.025em"}}>NarcoSync</div>
          <div style={{color:"rgba(255,255,255,.44)",fontSize:13,marginTop:5}}>Registre des substances contrôlées</div>
        </div>
        <div className="ns-panel" style={{padding:26,border:"none"}}>
          {mode==="reset"?(
            <div>
              <div style={{fontSize:16,fontWeight:650,marginBottom:16}}>Choisissez votre mot de passe</div>
              <FieldLabel>Nouveau mot de passe</FieldLabel>
              <input type="password" value={np1} onChange={e=>setNp1(e.target.value)} placeholder="6 caractères minimum" className="ns-in" style={{marginBottom:12}}/>
              <FieldLabel>Répétez-le</FieldLabel>
              <input type="password" value={np2} onChange={e=>setNp2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&applyNew()} className="ns-in" style={{marginBottom:14}}/>
              {err&&<div style={{color:C.flag,fontSize:12.5,marginBottom:12}}>{err}</div>}
              {msg&&<div style={{color:C.ok,fontSize:12.5,marginBottom:12}}>{msg}</div>}
              <button onClick={applyNew} disabled={busy} className="ns-btn ns-btn-primary" style={{width:"100%"}}>{busy?"Enregistrement":"Enregistrer"}</button>
            </div>
          ):mode==="forgot"?(
            <div>
              <div style={{fontSize:16,fontWeight:650,marginBottom:6}}>Mot de passe oublié</div>
              <div style={{fontSize:13,color:C.text2,marginBottom:16,lineHeight:1.5}}>Nous enverrons un lien pour en choisir un nouveau.</div>
              <FieldLabel>Courriel</FieldLabel>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendRecovery()} className="ns-in" style={{marginBottom:14}}/>
              {err&&<div style={{color:C.flag,fontSize:12.5,marginBottom:12}}>{err}</div>}
              {msg&&<div style={{color:C.ok,fontSize:12.5,marginBottom:12}}>{msg}</div>}
              <button onClick={sendRecovery} disabled={busy} className="ns-btn ns-btn-primary" style={{width:"100%",marginBottom:9}}>{busy?"Envoi":"Envoyer le lien"}</button>
              <button onClick={()=>{setMode("login");setErr("");setMsg("");}} className="ns-btn ns-btn-quiet" style={{width:"100%"}}>Retour</button>
            </div>
          ):(
            <div>
              <div style={{display:"flex",gap:16,marginBottom:22,borderBottom:"1px solid "+C.line}}>
                {[["login","Connexion"],["signup","Créer un compte"]].map(([m,l])=>(
                  <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{border:"none",background:"none",cursor:"pointer",
                    padding:"0 0 11px",fontSize:13.5,fontWeight:mode===m?650:500,color:mode===m?C.text:C.text3,
                    borderBottom:"2px solid "+(mode===m?C.ink:"transparent"),marginBottom:-1}}>{l}</button>
                ))}
              </div>
              <FieldLabel>Courriel</FieldLabel>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="ns-in" style={{marginBottom:13}} autoComplete="off"/>
              <FieldLabel>Mot de passe</FieldLabel>
              <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} className="ns-in" style={{marginBottom:15}} autoComplete="off"/>
              {err&&<div style={{color:C.flag,fontSize:12.5,marginBottom:12}}>{err}</div>}
              {msg&&<div style={{color:C.ok,fontSize:12.5,marginBottom:12}}>{msg}</div>}
              <button onClick={submit} disabled={busy} className="ns-btn ns-btn-primary" style={{width:"100%"}}>
                {busy?"…":mode==="login"?"Se connecter":"Créer le compte"}
              </button>
              {mode==="login"&&<button onClick={()=>{setMode("forgot");setErr("");}} style={{width:"100%",marginTop:14,border:"none",background:"none",cursor:"pointer",fontSize:12.5,color:C.text2}}>Mot de passe oublié?</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OnboardingWizard({userEmail,onComplete,session}){
  const [step,setStep]=useState(1);
  const [language,setLanguage]=useState("");const [country,setCountry]=useState("Canada");const [province,setProvince]=useState("");
  const [pharmacyName,setPharmacyName]=useState("");const [dispensingSystem,setDispensingSystem]=useState("");const [inventorySystem,setInventorySystem]=useState("");
  const [pharmacyPhone,setPharmacyPhone]=useState("");const [pharmacyEmail,setPharmacyEmail]=useState("");
  const [pharmacyAddress,setPharmacyAddress]=useState("");const [permitNumber,setPermitNumber]=useState("");
  const [pharmacistOwner,setPharmacistOwner]=useState("");const [pharmacistEmail,setPharmacistEmail]=useState("");
  const [managerName,setManagerName]=useState("");const [plan,setPlan]=useState("");const [saving,setSaving]=useState(false);
  const lang=getLang(language);
  const t=(k)=>T[lang][k]||T.en[k]||k;
  const cc=COUNTRY_CODES[country]||"+1";
  useEffect(()=>{setPharmacyName("");setPharmacyAddress("");setDispensingSystem("");setInventorySystem("");},[country]);
  const ok=pharmacyName.trim()&&pharmacyAddress.trim()&&pharmacyPhone.trim()&&pharmacistOwner.trim()&&dispensingSystem.trim()&&inventorySystem.trim()&&plan;
  async function finish(){
    if(!ok) return;
    setSaving(true);
    const profile={id:session.user.id,email:userEmail,language,country,province,pharmacy_name:pharmacyName,
      dispensing_system:dispensingSystem,inventory_system:inventorySystem,pharmacy_phone:cc+" "+pharmacyPhone,
      pharmacy_email:pharmacyEmail,pharmacy_address:pharmacyAddress,permit_number:permitNumber,
      pharmacist_owner:pharmacistOwner,pharmacist_email:pharmacistEmail,owner_name:managerName,plan};
    const {url,key}=SB.get();
    try{await fetch(url+"/rest/v1/profiles",{method:"POST",headers:{"apikey":key,"Authorization":"Bearer "+session.access_token,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates"},body:JSON.stringify(profile)});}catch{}
    try{await MEM.add({pharmacy_id:session.user.id,user_id:session.user.id,email:userEmail,full_name:pharmacistOwner,licence:permitNumber||null,role:"owner",active:true});}catch{}
    onComplete(profile);setSaving(false);
  }
  const sel={cursor:"pointer"};
  return(
    <div style={{minHeight:"100vh",background:C.bg,padding:"40px 20px"}}>
      <div style={{maxWidth:520,margin:"0 auto"}}>
        <div style={{marginBottom:8,fontSize:13,color:C.text2}}>{t("stepOf")} {step} {t("ofTotal")} 3</div>
        <div style={{height:3,background:C.line,borderRadius:3,marginBottom:26,overflow:"hidden"}}>
          <div style={{height:"100%",width:(step/3)*100+"%",background:C.ink,borderRadius:3,transition:"width .25s"}}/>
        </div>
        <div className="ns-panel" style={{padding:28,marginBottom:30}}>
          {step===1&&(<div>
            <div style={{fontSize:20,fontWeight:650,marginBottom:5,letterSpacing:"-.02em"}}>{t("language")}</div>
            <div style={{fontSize:13.5,color:C.text2,marginBottom:20}}>{t("langSubtitle")}</div>
            <div style={{marginBottom:20}}><FieldLabel>{t("searchLanguage")}</FieldLabel>
              <SearchableSelect options={ALL_LANGUAGES} value={language} onChange={setLanguage} placeholder={t("langPlaceholder")}/></div>
            <button onClick={()=>setStep(2)} disabled={!language.trim()} className="ns-btn ns-btn-primary" style={{width:"100%"}}>{t("next")}</button>
          </div>)}
          {step===2&&(<div>
            <div style={{fontSize:20,fontWeight:650,marginBottom:5,letterSpacing:"-.02em"}}>{t("location")}</div>
            <div style={{fontSize:13.5,color:C.text2,marginBottom:20}}>{t("locationSubtitle")}</div>
            <div style={{marginBottom:14}}><FieldLabel>{t("country")}</FieldLabel>
              <select value={country} onChange={e=>{setCountry(e.target.value);setProvince("");}} className="ns-in" style={sel}>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</select></div>
            <div style={{marginBottom:22}}>
              <FieldLabel>{country==="Canada"?t("province"):country==="United States"?t("state"):t("regionCity")}</FieldLabel>
              {country==="Canada"?(<select value={province} onChange={e=>setProvince(e.target.value)} className="ns-in" style={sel}><option value="">{t("selectProvince")}</option>{CA_PROVINCES.map(p=><option key={p}>{p}</option>)}</select>)
                :country==="United States"?(<select value={province} onChange={e=>setProvince(e.target.value)} className="ns-in" style={sel}><option value="">{t("selectState")}</option>{US_STATES.map(p=><option key={p}>{p}</option>)}</select>)
                :(<input value={province} onChange={e=>setProvince(e.target.value)} placeholder={t("enterRegion")} className="ns-in"/>)}
            </div>
            <div style={{display:"flex",gap:9}}>
              <button onClick={()=>setStep(1)} className="ns-btn ns-btn-quiet" style={{flex:1}}>{t("back")}</button>
              <button onClick={()=>setStep(3)} disabled={!province} className="ns-btn ns-btn-primary" style={{flex:2}}>{t("next")}</button>
            </div>
          </div>)}
          {step===3&&(<div>
            <div style={{fontSize:20,fontWeight:650,marginBottom:5,letterSpacing:"-.02em"}}>{t("yourPharmacy")}</div>
            <div style={{fontSize:13.5,color:C.text2,marginBottom:6}}>{t("requiredNote")} <span style={{color:C.flag}}>*</span></div>
            <SectionLabel>{t("pharmacyInfoSection")}</SectionLabel>
            <div style={{marginBottom:14}}>
              <FieldLabel required>{t("pharmacyName")}</FieldLabel>
              <SearchableSelect key={"c-"+country} options={PHARMACY_CHAINS_BY_COUNTRY[country]||DEFAULT_CHAINS} value={pharmacyName} onChange={setPharmacyName} placeholder={t("pharmacyPlaceholder")} required/>
            </div>
            <Field label={t("permitNumber")} value={permitNumber} onChange={setPermitNumber} placeholder={t("permitPlaceholder")} num/>
            <AddressAutocomplete key={"a-"+country} value={pharmacyAddress} onChange={setPharmacyAddress} placeholder={t("pharmacyAddress")} hint={t("addressHint")} countryIso={COUNTRY_ISO[country]||""} province={province} required/>
            <PhoneField label={t("pharmacyPhone")} value={pharmacyPhone} onChange={setPharmacyPhone} countryCode={cc} required/>
            <Field label={t("pharmacyEmail")} value={pharmacyEmail} onChange={setPharmacyEmail} placeholder={t("emailPlaceholder")} type="email"/>
            <SectionLabel>{t("softwareSection")}</SectionLabel>
            <div style={{marginBottom:14}}>
              <FieldLabel required>{t("dispensingSystem")}</FieldLabel>
              <SearchableSelect key={"d-"+country} options={DISPENSING_SYSTEMS[country]||DEFAULT_DISPENSING} value={dispensingSystem} onChange={setDispensingSystem} placeholder={t("dispensingSystemPlaceholder")} required/>
            </div>
            <div style={{marginBottom:14}}>
              <FieldLabel required>{t("inventorySystem")}</FieldLabel>
              <SearchableSelect key={"i-"+country} options={INVENTORY_SYSTEMS[country]||DEFAULT_INVENTORY} value={inventorySystem} onChange={setInventorySystem} placeholder={t("inventorySystemPlaceholder")} required/>
            </div>
            <SectionLabel>{t("teamSection")}</SectionLabel>
            <Field label={t("pharmacistOwner")} value={pharmacistOwner} onChange={setPharmacistOwner} placeholder={t("ownerPlaceholder")} required/>
            <Field label={t("pharmacistEmail")} value={pharmacistEmail} onChange={setPharmacistEmail} placeholder={t("ownerEmailPlaceholder")} type="email"/>
            <Field label={t("managerName")} value={managerName} onChange={setManagerName} placeholder={t("managerPlaceholder")}/>
            <SectionLabel>{t("planSection")}</SectionLabel>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {[{v:"basic",lk:"basicLabel",dk:"basicDesc",pk:"basicPrice"},{v:"pro",lk:"proLabel",dk:"proDesc",pk:"proPrice"},{v:"enterprise",lk:"enterpriseLabel",dk:"enterpriseDesc",pk:"enterprisePrice"}].map(p=>(
                <button key={p.v} onClick={()=>setPlan(p.v)} style={{padding:"14px 16px",borderRadius:8,
                  border:"1px solid "+(plan===p.v?C.ink:C.line),background:plan===p.v?C.ink:C.paper,cursor:"pointer",textAlign:"left"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:12}}>
                    <div>
                      <div style={{fontSize:13.5,fontWeight:650,color:plan===p.v?"#fff":C.text}}>{t(p.lk)}</div>
                      <div style={{fontSize:12,color:plan===p.v?"rgba(255,255,255,.6)":C.text2,marginTop:2}}>{t(p.dk)}</div>
                    </div>
                    <span className="ns-num" style={{fontSize:15,fontWeight:650,color:plan===p.v?"#fff":C.text}}>{t(p.pk)}</span>
                  </div>
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:9}}>
              <button onClick={()=>setStep(2)} className="ns-btn ns-btn-quiet" style={{flex:1}}>{t("back")}</button>
              <button onClick={finish} disabled={!ok||saving} className="ns-btn ns-btn-primary" style={{flex:2}}>{saving?t("saving"):t("launch")}</button>
            </div>
          </div>)}
        </div>
      </div>
    </div>
  );
}

function Dashboard({session,profile,member,onLogout,lang,setLang}){
  const [page,setPage]=useState("home");
  const email=session?.user?.email||"";
  const fr=lang==="fr";
  const t=(k)=>T[lang][k]||T.en[k]||k;
  const role=member?member.role:"owner";
  const items=[
    {id:"home",label:t("dashboard")},{id:"inv",label:t("inventory")},{id:"reco",label:t("reconciliation")},
    {id:"history",label:t("history")},{id:"team",label:t("team")},{id:"audit",label:fr?"Journal":"Audit log"},
    {id:"clinical",label:t("clinical")},{id:"pricing",label:t("plans")}
  ];
  const r=ROLES[role]||ROLES.pharmacist;
  return(
    <Shell items={items} page={page} setPage={setPage} lang={lang} setLang={setLang} onLogout={onLogout}
      signOutLabel={t("signOut")} name={member?.full_name||email}
      sub={(fr?r.fr:r.en)+(member?.licence?" · "+member.licence:"")}>
      {page==="home"&&<HomePage onNewReco={()=>setPage("reco")} email={email} t={t} profile={profile} session={session} member={member} fr={fr}/>}
      {page==="inv"&&<InventoryPage session={session} member={member} fr={fr} profile={profile}/>}
      {page==="reco"&&<RecoPage onBack={()=>setPage("home")} t={t} profile={profile} session={session} member={member} onGoInv={()=>setPage("inv")} fr={fr}/>}
      {page==="history"&&<HistoryPage session={session} member={member} fr={fr} profile={profile}/>}
      {page==="team"&&<TeamPage session={session} member={member} fr={fr}/>}
      {page==="audit"&&<AuditPage session={session} member={member} fr={fr}/>}
      {page==="clinical"&&<Empty title={t("clinical")} desc={t("clinicalDesc")}/>}
      {page==="pricing"&&<Empty title={t("plans")} desc={t("plansDesc")}/>}
    </Shell>
  );
}
function Empty({title,desc}){
  return(
    <div style={{padding:"30px 34px",maxWidth:640}}>
      <H1 sub={desc}>{title}</H1>
    </div>
  );
}

function HistoryPage({session,member,fr,profile}){
  const pid=member?member.pharmacy_id:session.user.id;
  const role=member?member.role:"owner";
  const [cycles,setCycles]=useState([]);
  const [loading,setLoading]=useState(true);
  const [sel,setSel]=useState(null);
  useEffect(()=>{
    const {url,key}=SB.get();
    fetch(url+"/rest/v1/reconciliations?pharmacy_id=eq."+pid+"&order=completed_at.desc",{headers:{"apikey":key,"Authorization":"Bearer "+session.access_token}})
      .then(r=>r.json()).then(d=>{if(Array.isArray(d))setCycles(d);setLoading(false);}).catch(()=>setLoading(false));
  },[]);
  function fd(d){if(!d)return "—";return new Date(d).toLocaleDateString(fr?"fr-CA":"en-CA",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"});}
  async function delCycle(c){
    if(!window.confirm(fr?"Supprimer ce cycle du registre?":"Delete this cycle from the record?")) return;
    try{await sbFetch("reconciliations?id=eq."+c.id,{method:"DELETE"});
      await AUDIT.log(member,"delete_cycle","reconciliations",c.id,fd(c.completed_at));
      setCycles(cycles.filter(x=>x.id!==c.id));}catch(e){alert(e.message);}
  }

  if(sel){
    const mols=typeof sel.molecules==="string"?JSON.parse(sel.molecules||"[]"):sel.molecules||[];
    return(
      <div style={{padding:"30px 34px",maxWidth:1320}}>
        <button className="ns-noprint ns-btn ns-btn-quiet" onClick={()=>setSel(null)} style={{marginBottom:20,padding:"6px 13px",fontSize:12.5}}>{fr?"Retour":"Back"}</button>
        <div className="ns-print-only" style={{marginBottom:13}}>
          <div style={{fontSize:15,fontWeight:650}}>{profile?.pharmacy_name||""} — {fr?"Rapport de réconciliation":"Reconciliation report"}</div>
          <div style={{fontSize:11,marginTop:3}}>{fd(sel.completed_at)}</div>
        </div>
        <div className="ns-noprint" style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12,alignItems:"flex-start"}}>
          <H1 sub={sel.total_molecules+(fr?" produits":" products")}>{fd(sel.completed_at)}</H1>
          <button onClick={()=>window.print()} className="ns-btn ns-btn-quiet">{fr?"Imprimer":"Print"}</button>
        </div>
        <div className="ns-panel" style={{overflowX:"auto"}}>
          <table style={{width:"100%",minWidth:940}}>
            <thead><tr>
              <th>Description</th><th>Format</th><th>DIN</th>
              <th style={{textAlign:"right"}}>{fr?"Ouverture":"Opening"}</th>
              <th style={{textAlign:"right"}}>{fr?"Reçu":"Received"}</th>
              <th style={{textAlign:"right"}}>{fr?"Dispensé":"Dispensed"}</th>
              <th style={{textAlign:"right"}}>{fr?"Théorique":"Expected"}</th>
              <th style={{textAlign:"right"}}>{fr?"Compté":"Counted"}</th>
              <th style={{textAlign:"right"}}>{fr?"Écart":"Variance"}</th>
              <th>{fr?"Note":"Note"}</th>
            </tr></thead>
            <tbody>
              {mols.map((m,i)=>{
                const theo=(Number(m.opening)||0)+(Number(m.received)||0)-(Number(m.dispensed)||0);
                const d=m.physical!==""?theo-(Number(m.physical)||0):null;
                return(<tr key={i} style={{background:d!==null&&d!==0?C.flagBg:"transparent"}}>
                  <td style={{fontWeight:600}}>{m.name||"—"}</td>
                  <td style={{color:C.text2}}>{m.format||"—"}</td>
                  <td className="ns-num" style={{fontSize:12}}>{m.din||"—"}</td>
                  {[m.opening,m.received,m.dispensed,theo].map((v,j)=>(
                    <td key={j} className="ns-num" style={{textAlign:"right"}}>{v||0}</td>
                  ))}
                  <td className="ns-num" style={{textAlign:"right",fontWeight:600}}>{m.physical!==""?m.physical:"—"}</td>
                  <td className="ns-num" style={{textAlign:"right",fontWeight:650,color:d===null?C.text3:d===0?C.ok:C.flag}}>
                    {d===null?"—":d===0?"0":(d>0?"+":"")+d}
                  </td>
                  <td style={{color:C.text2,fontSize:12}}>{m.notes||""}</td>
                </tr>);
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return(
    <div style={{padding:"30px 34px",maxWidth:900}}>
      <H1 sub={fr?"Chaque cycle sauvegardé reste au dossier.":"Every saved cycle stays on file."}>
        {cycles.length} {fr?(cycles.length===1?"cycle":"cycles"):(cycles.length===1?"cycle":"cycles")}
      </H1>
      {loading?<div style={{color:C.text3}}>{fr?"Chargement":"Loading"}</div>:
       cycles.length===0?(
        <div className="ns-panel" style={{padding:30,fontSize:13.5,color:C.text2,lineHeight:1.6}}>
          {fr?"Aucun cycle encore. Lancez une réconciliation pour créer le premier.":"No cycles yet. Run a reconciliation to create the first one."}
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {cycles.map((c,i)=>(
            <div key={i} className="ns-panel" style={{padding:"16px 19px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:14}}>
              <div onClick={()=>setSel(c)} style={{cursor:"pointer",flex:1}}>
                <div style={{fontSize:14.5,fontWeight:650}}>{fd(c.completed_at)}</div>
                <div style={{fontSize:12.5,color:C.text2,marginTop:2}}>{c.total_molecules} {fr?"produits":"products"}</div>
              </div>
              <span style={{display:"flex",alignItems:"center",gap:10}}>
                {c.total_discrepancies>0
                  ?<Tag tone="flag">{c.total_discrepancies} {fr?(c.total_discrepancies===1?"écart":"écarts"):(c.total_discrepancies===1?"variance":"variances")}</Tag>
                  :<Tag tone="ok">{fr?"Tout balance":"Balanced"}</Tag>}
                {can(role,"edit")&&<button onClick={()=>delCycle(c)} className="ns-x">×</button>}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HomePage({onNewReco,email,t,profile,session,member,fr}){
  const pid=member?member.pharmacy_id:session.user.id;
  const [cycles,setCycles]=useState([]);
  const [invCount,setInvCount]=useState(null);
  useEffect(()=>{
    const {url,key}=SB.get();
    fetch(url+"/rest/v1/reconciliations?pharmacy_id=eq."+pid+"&order=completed_at.desc&limit=5",{headers:{"apikey":key,"Authorization":"Bearer "+session.access_token}})
      .then(r=>r.json()).then(d=>{if(Array.isArray(d))setCycles(d);}).catch(()=>{});
    INV.list(pid,"").then(r=>setInvCount(r.length)).catch(()=>setInvCount(0));
  },[]);
  const total=cycles.length;
  const last=cycles[0];
  return(
    <div style={{padding:"30px 34px",maxWidth:900}}>
      <H1 sub={profile?.pharmacy_name||""}>{t("welcomeMsg")}</H1>

      {total>0?(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(168px,1fr))",gap:13,marginBottom:24}}>
          {[[invCount===null?"—":invCount,fr?"produits en inventaire":"products on hand",null],
            [total,fr?(total===1?"cycle complété":"cycles complétés"):(total===1?"cycle completed":"cycles completed"),null],
            [last?.total_discrepancies||0,fr?"écarts au dernier cycle":"variances last cycle",(last?.total_discrepancies>0)?C.flag:C.ok]].map(([v,l,col],i)=>(
            <div key={i} className="ns-panel" style={{padding:20}}>
              <div className="ns-num" style={{fontSize:32,fontWeight:650,letterSpacing:"-.03em",color:col||C.text}}>{v}</div>
              <div style={{fontSize:12.5,color:C.text2,marginTop:5,lineHeight:1.4}}>{l}</div>
            </div>
          ))}
        </div>
      ):(
        <div className="ns-panel" style={{padding:24,marginBottom:22}}>
          <div style={{fontSize:15,fontWeight:650,marginBottom:5}}>{t("liveMsg")}</div>
          <div style={{fontSize:13.5,color:C.text2,lineHeight:1.55}}>{t("liveSubMsg")}</div>
        </div>
      )}

      <button onClick={onNewReco} className="ns-btn ns-btn-primary" style={{padding:"13px 24px",fontSize:14}}>{t("newReco")}</button>
    </div>
  );
}

function RecoTable({session,profile,member,onComplete,onGoInv,fr}){
  const pid=member?member.pharmacy_id:session.user.id;
  const role=member?member.role:"owner";
  const [mols,setMols]=useState([]);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [nextId,setNextId]=useState(1);
  const [err,setErr]=useState("");
  const [printMode,setPrintMode]=useState("all");

  useEffect(()=>{
    (async()=>{
      try{
        const inv=await INV.list(pid,"");
        let id=1;
        setMols(inv.map(r=>({id:id++,inv_id:r.id,name:r.molecule||"",strength:r.strength||"",cup:r.cup||"",format:r.format||"",din:r.din||"",opening:Number(r.qty)||0,received:0,dispensed:0,physical:"",notes:""})));
        setNextId(id);
      }catch(e){setErr(e.message);}
      setLoading(false);
    })();
  },[]);

  function upd(id,f,v){setMols(p=>p.map(m=>m.id===id?{...m,[f]:v}:m));}
  function addRow(){setMols(p=>[...p,{id:nextId,name:"",strength:"",cup:"",format:"",din:"",opening:0,received:0,dispensed:0,physical:"",notes:""}]);setNextId(n=>n+1);}
  function delRow(id){setMols(p=>p.filter(m=>m.id!==id));}
  function theo(m){return(Number(m.opening)||0)+(Number(m.received)||0)-(Number(m.dispensed)||0);}
  function diff(m){if(m.physical==="")return null;return theo(m)-(Number(m.physical)||0);}
  const totalDisc=mols.filter(m=>diff(m)!==null&&diff(m)!==0).length;
  const filled=mols.filter(m=>m.physical!=="").length;
  const gaps=mols.filter(m=>diff(m)!==null&&diff(m)!==0);
  const shown=printMode==="gaps"?gaps:mols;

  function doPrint(mode){
    setPrintMode(mode);
    setTimeout(()=>{window.print();setTimeout(()=>setPrintMode("all"),500);},120);
  }
  async function save(){
    setSaving(true);
    const {url,key}=SB.get();
    const cycle={pharmacy_id:pid,pharmacy_name:profile?.pharmacy_name,dispensing_system:profile?.dispensing_system,
      inventory_system:profile?.inventory_system,molecules:JSON.stringify(mols),
      total_molecules:mols.length,total_discrepancies:totalDisc,completed_at:new Date().toISOString()};
    try{await fetch(url+"/rest/v1/reconciliations",{method:"POST",headers:{"apikey":key,"Authorization":"Bearer "+session.access_token,"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify(cycle)});}catch{}
    for(const m of mols){
      if(m.inv_id&&m.physical!==""){try{await INV.update(m.inv_id,{qty:Number(m.physical)||0,last_count_at:new Date().toISOString()});}catch(e){}}
    }
    await AUDIT.log(member,"save_cycle","reconciliations",null,mols.length+(fr?" produits, ":" products, ")+totalDisc+(fr?" écarts":" variances"));
    setSaving(false);onComplete({totalDisc,totalMolecules:mols.length});
  }

  if(loading) return <div style={{padding:40,color:C.text3}}>{fr?"Chargement":"Loading"}</div>;

  if(mols.length===0){
    return(
      <div className="ns-panel" style={{padding:30,maxWidth:520}}>
        <div style={{fontSize:15,fontWeight:650,marginBottom:6}}>{fr?"L'inventaire est vide":"The inventory is empty"}</div>
        <div style={{fontSize:13.5,color:C.text2,marginBottom:18,lineHeight:1.55}}>
          {fr?"La réconciliation part de votre inventaire. Ajoutez vos produits d'abord.":"Reconciliation starts from your inventory. Add your products first."}
        </div>
        <button onClick={onGoInv} className="ns-btn ns-btn-primary">{fr?"Aller à l'inventaire":"Go to inventory"}</button>
      </div>
    );
  }

  return(
    <div>
      <div className="ns-print-only" style={{marginBottom:13}}>
        <div style={{fontSize:15,fontWeight:650}}>{profile?.pharmacy_name||""} — {printMode==="gaps"?(fr?"Écarts à recompter":"Variances to recount"):(fr?"Feuille de décompte":"Count sheet")}</div>
        <div style={{fontSize:11,marginTop:3}}>{new Date().toLocaleDateString(fr?"fr-CA":"en-CA")} · {shown.length} {fr?"produits":"products"} · {fr?"Compté par":"Counted by"} ____________________</div>
      </div>

      <div className="ns-noprint" style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:24,fontWeight:650,letterSpacing:"-.021em"}}>{mols.length} {fr?"produits à compter":"products to count"}</div>
          <div style={{fontSize:13.5,color:C.text2,marginTop:5}}>
            {filled>0?(filled+"/"+mols.length+(fr?" comptés":" counted")):(fr?"L'ouverture vient de votre inventaire.":"Opening comes from your inventory.")}
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <button onClick={()=>doPrint("all")} className="ns-btn ns-btn-quiet">{fr?"Feuille de décompte":"Count sheet"}</button>
          {gaps.length>0&&(
            <button onClick={()=>doPrint("gaps")} className="ns-btn ns-btn-quiet" style={{color:C.flag,borderColor:"#E9A3A3"}}>
              {fr?"Écarts à recompter":"Variances to recount"} ({gaps.length})
            </button>
          )}
          {totalDisc>0&&<Tag tone="flag">{totalDisc} {fr?(totalDisc===1?"écart":"écarts"):(totalDisc===1?"variance":"variances")}</Tag>}
          {totalDisc===0&&filled===mols.length&&<Tag tone="ok">{fr?"Tout balance":"All balanced"}</Tag>}
        </div>
      </div>
      {err&&<div className="ns-noprint"><Note tone="flag">{err}</Note></div>}

      <div className="ns-panel" style={{overflowX:"auto",marginBottom:15}}>
        <table style={{width:"100%",minWidth:1180}}>
          <thead><tr>
            <th>CUP</th><th>Description</th><th>{fr?"Force":"Strength"}</th><th>Format</th><th>DIN</th>
            <th className="ns-noprint" style={{textAlign:"right"}}>{fr?"Ouverture":"Opening"}</th>
            <th className="ns-noprint" style={{textAlign:"right"}}>{fr?"Reçu":"Received"}</th>
            <th className="ns-noprint" style={{textAlign:"right"}}>{fr?"Dispensé":"Dispensed"}</th>
            <th className="ns-noprint" style={{textAlign:"right"}}>{fr?"Théorique":"Expected"}</th>
            {printMode==="gaps"&&<th className="ns-print-only" style={{textAlign:"right"}}>{fr?"Écart":"Variance"}</th>}
            <th style={{textAlign:"right",background:"#EEF3FF",color:C.accent}}>{fr?"Compté":"Counted"}</th>
            <th className="ns-noprint" style={{textAlign:"right"}}>{fr?"Écart":"Variance"}</th>
            <th>{fr?"Note":"Note"}</th>
            <th className="ns-noprint"></th>
          </tr></thead>
          <tbody>
            {shown.map((m)=>{
              const t2=theo(m);const d=diff(m);
              return(
                <tr key={m.id} style={{background:d!==null&&d!==0?C.flagBg:"transparent"}}>
                  <td><input value={m.cup} onChange={e=>upd(m.id,"cup",e.target.value)} className="ns-cell ns-num" style={{width:86,fontSize:12}}/></td>
                  <td><input value={m.name} onChange={e=>upd(m.id,"name",e.target.value)} className="ns-cell" style={{width:168,fontWeight:600}}/></td>
                  <td><input value={m.strength} onChange={e=>upd(m.id,"strength",e.target.value)} className="ns-cell" style={{width:56}}/></td>
                  <td><input value={m.format} onChange={e=>upd(m.id,"format",e.target.value)} className="ns-cell" style={{width:70}}/></td>
                  <td><input value={m.din} onChange={e=>upd(m.id,"din",e.target.value)} className="ns-cell ns-num" style={{width:72,fontSize:12}}/></td>
                  <td className="ns-noprint" style={{textAlign:"right"}}><input type="number" value={m.opening} onChange={e=>upd(m.id,"opening",e.target.value)} className="ns-cell ns-num" style={{width:58,textAlign:"right"}} min="0"/></td>
                  <td className="ns-noprint" style={{textAlign:"right"}}><input type="number" value={m.received} onChange={e=>upd(m.id,"received",e.target.value)} className="ns-cell ns-num" style={{width:54,textAlign:"right"}} min="0"/></td>
                  <td className="ns-noprint" style={{textAlign:"right"}}><input type="number" value={m.dispensed} onChange={e=>upd(m.id,"dispensed",e.target.value)} className="ns-cell ns-num" style={{width:54,textAlign:"right"}} min="0"/></td>
                  <td className="ns-noprint ns-num" style={{textAlign:"right",fontWeight:650}}>{t2}</td>
                  {printMode==="gaps"&&<td className="ns-print-only ns-num" style={{textAlign:"right",fontWeight:650,color:C.flag}}>{d>0?"+":""}{d}</td>}
                  <td style={{textAlign:"right",background:"#F7F9FF"}}>
                    <input type="number" value={m.physical} onChange={e=>upd(m.id,"physical",e.target.value)}
                      className="ns-cell ns-num ns-noprint" placeholder="—" min="0"
                      style={{width:66,textAlign:"right",fontWeight:650,borderColor:C.accent}}/>
                    <span className="ns-print-only ns-writebox"></span>
                  </td>
                  <td className="ns-noprint ns-num" style={{textAlign:"right",fontWeight:650,color:d===null?C.text3:d===0?C.ok:C.flag}}>
                    {d===null?"—":d===0?"0":(d>0?"+":"")+d}
                  </td>
                  <td>
                    <input value={m.notes} onChange={e=>upd(m.id,"notes",e.target.value)} className="ns-cell ns-noprint"
                      placeholder={d!==null&&d!==0?(fr?"Justification":"Reason"):""}
                      style={{width:118,borderColor:(d!==null&&d!==0&&!m.notes)?"#E9A3A3":C.line}}/>
                    <span className="ns-print-only ns-writebox" style={{width:"130px"}}></span>
                  </td>
                  <td className="ns-noprint"><button onClick={()=>delRow(m.id)} className="ns-x">×</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button className="ns-noprint ns-btn ns-btn-quiet" onClick={addRow} style={{marginBottom:20,fontSize:12.5,padding:"8px 14px"}}>
        {fr?"Ajouter une ligne":"Add a row"}
      </button>

      {totalDisc>0&&(
        <div className="ns-noprint"><Note tone="flag">
          {fr?"Imprimez la liste des écarts, recomptez, puis inscrivez une justification. Les écarts qui persistent après recomptage doivent être approuvés par un pharmacien.":"Print the variance list, recount, then write a reason. Variances that persist after a recount need pharmacist approval."}
        </Note></div>
      )}

      {can(role,"edit")?(
        <button className="ns-noprint ns-btn ns-btn-primary" onClick={save} disabled={saving} style={{padding:"13px 26px",fontSize:14}}>
          {saving?(fr?"Enregistrement":"Saving"):(fr?"Valider et enregistrer ce cycle":"Validate and save this cycle")}
        </button>
      ):(
        <div className="ns-noprint"><Note tone="warn">{fr?"Un pharmacien doit valider et enregistrer ce cycle.":"A pharmacist must validate and save this cycle."}</Note></div>
      )}
      {member&&can(role,"edit")&&<div className="ns-noprint" style={{fontSize:12.5,color:C.text2,marginTop:10}}>
        {fr?"Sera signé par":"Will be signed by"} {member.full_name||member.email}
        {member.licence&&<span className="ns-num"> · {member.licence}</span>}
      </div>}
    </div>
  );
}

function RecoPage({onBack,t,profile,session,member,onGoInv,fr}){
  const [step,setStep]=useState("table");
  const [result,setResult]=useState(null);
  if(step==="done"){
    return(
      <div style={{padding:"30px 34px",maxWidth:560}}>
        <div className="ns-panel" style={{padding:28}}>
          <div style={{fontSize:20,fontWeight:650,marginBottom:6,letterSpacing:"-.02em"}}>{t("recoComplete")}</div>
          <div style={{fontSize:13.5,color:C.text2,marginBottom:16}}>{result?.totalMolecules} {fr?"produits":"products"}</div>
          <div style={{marginBottom:22}}>
            {result?.totalDisc>0
              ?<Tag tone="flag">{result.totalDisc} {fr?(result.totalDisc===1?"écart":"écarts"):(result.totalDisc===1?"variance":"variances")}</Tag>
              :<Tag tone="ok">{fr?"Tout balance":"All balanced"}</Tag>}
          </div>
          <button onClick={()=>{setStep("table");setResult(null);}} className="ns-btn ns-btn-primary">{t("newRecoBtn")}</button>
        </div>
      </div>
    );
  }
  return(
    <div style={{padding:"30px 34px",maxWidth:1400}}>
      <button className="ns-noprint ns-btn ns-btn-quiet" onClick={onBack} style={{marginBottom:20,padding:"6px 13px",fontSize:12.5}}>{t("back")}</button>
      <RecoTable session={session} profile={profile} member={member} onGoInv={onGoInv} fr={fr} onComplete={r=>{setResult(r);setStep("done");}}/>
    </div>
  );
}

export default function App(){
  const [session,setSession]=useState(()=>{
    const h=window.location.hash||"";
    if(h.indexOf("type=recovery")>=0) return null;
    return SB.getSession();
  });
  const [profile,setProfile]=useState(SB.getProfile());
  const [member,setMember]=useState(SB.getMember());
  const [loading,setLoading]=useState(()=>!!(SB.getSession()&&!SB.getProfile()));
  const [lang,setLang]=useState(()=>getLang(SB.getProfile()?.language));

  useEffect(()=>{
    const st=document.createElement("style");
    st.textContent=GLOBAL_CSS;
    document.head.appendChild(st);
    return()=>{try{document.head.removeChild(st);}catch(e){}};
  },[]);

  useEffect(()=>{
    if(!session||session.user.email===ADMIN_EMAIL) return;
    (async()=>{
      setLoading(true);
      let mem=member;
      try{
        mem=await MEM.byEmail(session.user.email);
        if(mem&&!mem.user_id){try{await MEM.linkUser(mem.id,session.user.id);mem.user_id=session.user.id;}catch(e){}}
        if(mem){SB.saveMember(mem);setMember(mem);}
      }catch(e){}
      const pid=mem?mem.pharmacy_id:session.user.id;
      try{
        const {url,key}=SB.get();
        const r=await fetch(url+"/rest/v1/profiles?id=eq."+pid,{headers:{"apikey":key,"Authorization":"Bearer "+session.access_token}});
        const d=await r.json();
        if(Array.isArray(d)&&d.length>0){SB.saveProfile(d[0]);setProfile(d[0]);setLang(getLang(d[0].language));}
      }catch(e){}
      setLoading(false);
    })();
  },[session]);

  const logout=()=>{SB.clearSession();SB.clearProfile();SB.clearMember();setSession(null);setProfile(null);setMember(null);};

  useEffect(()=>{
    if(!session) return;
    let timer=null;
    function reset(){
      if(timer) clearTimeout(timer);
      timer=setTimeout(()=>{alert("Session fermée après 5 minutes sans activité.");logout();},IDLE_MS);
    }
    const evts=["mousemove","mousedown","keydown","scroll","touchstart","click"];
    evts.forEach(e=>window.addEventListener(e,reset,{passive:true}));
    reset();
    const rf=setInterval(()=>{refreshToken();},45*60*1000);
    return()=>{if(timer)clearTimeout(timer);clearInterval(rf);evts.forEach(e=>window.removeEventListener(e,reset));};
  },[session]);

  if(!session) return <AuthScreen onAuth={s=>{SB.saveSession(s);setSession(s);if(s.user.email!==ADMIN_EMAIL)setLoading(true);}}/>;
  if(session.user.email===ADMIN_EMAIL) return <AdminDashboard session={session} onLogout={logout}/>;
  if(loading) return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg}}>
      <div style={{fontSize:13.5,color:C.text2}}>Chargement…</div>
    </div>
  );
  if(!profile&&!member) return <OnboardingWizard userEmail={session.user.email} onComplete={p=>{SB.saveProfile(p);setProfile(p);setLang(getLang(p.language));}} session={session}/>;
  return <Dashboard session={session} profile={profile} member={member} onLogout={logout} lang={lang} setLang={setLang}/>;
}
