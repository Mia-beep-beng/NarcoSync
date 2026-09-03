import React, { useState, useRef, useEffect } from "react";

const NS_URL="https://lqykpjgqbhaprbtafimi.supabase.co";
const NS_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeWtwamdxYmhhcHJidGFmaW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MzMzNjMsImV4cCI6MjA5OTMwOTM2M30.N2C5u-FmEqVyemYyqVlw64RQErQe7O-uGVzYulV8nOI";
try{localStorage.setItem("ns_url",NS_URL);localStorage.setItem("ns_key",NS_KEY);}catch(e){}

const IDLE_MS=5*60*1000;
const ADMIN_EMAIL="mtrofin@icloud.com";
const CLINICAL_PRICE=39;

const C={
  ink:"#0E1A1C",line:"#DDE3E3",line2:"#EDF1F1",
  teal:"#0C6B6B",teal2:"#0A5757",tealSoft:"#E6F2F1",tealLine:"#B4D9D6",
  paper:"#FFFFFF",bg:"#F6F8F8",
  text:"#0E1A1C",text2:"#566368",text3:"#8B979B",
  flag:"#C0392B",flagBg:"#FDF1EF",flagLine:"#EFC3BC",
  ok:"#0B6E3F",okBg:"#EEF6F0",okLine:"#B9DCC6",
  warn:"#8A5A00",warnBg:"#FDF7E8",warnLine:"#E8D49B",
};
const F="'Inter','SF Pro Text',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const NUM="'SF Mono','Roboto Mono',ui-monospace,monospace";

const LANGS=[
  {c:"fr",n:"Français"},{c:"en",n:"English"},{c:"es",n:"Español"},
  {c:"pt",n:"Português"},{c:"de",n:"Deutsch"},{c:"it",n:"Italiano"},
  {c:"nl",n:"Nederlands"},{c:"ar",n:"العربية"},
];
const READY=["fr","en"];
const COUNTRY_LANGS={
  "Canada":["fr","en"],"United States":["en","es"],"France":["fr"],"Spain":["es"],
  "Belgium":["fr","nl"],"Germany":["de"],"Switzerland":["fr","de","it"],
  "United Kingdom":["en"],"Australia":["en"],"Other":["en"],
};
const LICENCE_HINT={
  "Canada":{ph:"OPQ-12345",body:"OPQ",url:"https://www.opq.org/trouver-un-pharmacien/"},
  "United States":{ph:"RPH-123456",body:"State board",url:"https://nabp.pharmacy/"},
  "France":{ph:"RPPS 10001234567",body:"Ordre national des pharmaciens",url:"https://www.ordre.pharmacien.fr/"},
  "Spain":{ph:"COF-12345",body:"Consejo General",url:"https://www.portalfarma.com/"},
  "United Kingdom":{ph:"2012345",body:"GPhC",url:"https://www.pharmacyregulation.org/registers"},
  "Australia":{ph:"PHA0001234567",body:"AHPRA",url:"https://www.ahpra.gov.au/registration/registers-of-practitioners.aspx"},
};
function licenceInfo(country){return LICENCE_HINT[country]||{ph:"Licence number",body:"your regulator",url:""};}

const ROLES={
  owner:{fr:"Pharmacien-propriétaire",en:"Pharmacist-owner"},
  pharmacist:{fr:"Pharmacien",en:"Pharmacist"},
  technician:{fr:"Chef technicien",en:"Chief technician"},
};
function can(role,a){
  if(role==="owner") return true;
  if(role==="pharmacist") return a!=="manage_team";
  if(role==="technician") return a==="view"||a==="count"||a==="print";
  return false;
}
function unitsPerPack(f){
  const m=String(f||"").toUpperCase().replace(/,/g,"").match(/(\d+(?:\.\d+)?)/);
  if(!m) return 1;
  const n=parseFloat(m[1]);
  return (isFinite(n)&&n>0)?n:1;
}
function packLabel(f,fr){
  const s=String(f||"").toUpperCase();
  if(s.indexOf("ML")>=0) return "mL";
  if(s.indexOf("CAP")>=0) return "caps";
  if(s.indexOf("PATCH")>=0||s.indexOf("TIMBRE")>=0) return fr?"timbres":"patches";
  return fr?"co":"tabs";
}

const T={
  en:{signIn:"Sign in",createAccount:"Create an account",back:"Back",next:"Continue",saving:"Saving",
    dashboard:"Overview",inventory:"Inventory",reconciliation:"Reconcile",history:"Records",
    team:"Team",audit:"Audit log",clinical:"Clinical",plans:"Plan",signOut:"Sign out",
    language:"Language",langSubtitle:"You can change this any time",searchLanguage:"Working language",
    location:"Location",locationSubtitle:"Where is the pharmacy?",
    country:"Country",province:"Province",state:"State",regionCity:"Region or city",
    selectProvince:"Choose a province",selectState:"Choose a state",enterRegion:"Region or city",
    yourPharmacy:"Pharmacy details",pharmacyInfoSection:"Pharmacy",teamSection:"Responsible pharmacist",
    planSection:"Plan",softwareSection:"Software in use",requiredNote:"Required",
    pharmacyName:"Banner or chain",permitNumber:"Pharmacy permit number",pharmacyAddress:"Address",
    pharmacyPhone:"Phone",pharmacyEmail:"Pharmacy email",dispensingSystem:"Dispensing software",
    inventorySystem:"Ordering system",pharmacistOwner:"Pharmacist-owner",pharmacistEmail:"Their email",
    managerName:"Team lead",startTyping:"Start typing",emailPlaceholder:"info@pharmacy.com",
    ownerPlaceholder:"Full name",ownerEmailPlaceholder:"owner@pharmacy.com",managerPlaceholder:"Your name",
    addressHint:"Pick from the list to fill the rest",launch:"Open NarcoSync",stepOf:"Step",ofTotal:"of",
    welcomeMsg:"Overview",liveMsg:"Nothing counted yet",liveSubMsg:"Add your products, then run your first count.",
    newReco:"Start a reconciliation",recoComplete:"Cycle saved",newRecoBtn:"Start another",
    basicLabel:"Basic",basicDesc:"One pharmacy",basicPrice:"$49",
    proLabel:"Pro",proDesc:"Up to three pharmacies",proPrice:"$99",
    enterpriseLabel:"Enterprise",enterpriseDesc:"Unlimited, with API",enterprisePrice:"$249",
    tagline:"Controlled substance records",
    ownerOnly:"Accounts are created by the pharmacist-owner. Everyone else joins by invitation.",
    yourName:"Your full name",yourLicence:"Your licence number",checkRegister:"Check the register",
    licenceWhy:"Your licence signs every action you take in the system.",
    email:"Email",password:"Password",min6:"6 characters minimum",
    forgot:"Forgot your password?",newPassword:"New password",repeat:"Repeat it",
    chooseYourPwd:"Choose your password",forgotTitle:"Forgot your password",
    forgotSub:"We'll send a link to choose a new one.",sendLink:"Send the link",
    pwdSaved:"Password saved. Sign in now.",save:"Save",
  },
  fr:{signIn:"Se connecter",createAccount:"Créer un compte",back:"Retour",next:"Continuer",saving:"Enregistrement",
    dashboard:"Vue d'ensemble",inventory:"Inventaire",reconciliation:"Réconcilier",history:"Registres",
    team:"Équipe",audit:"Journal",clinical:"Clinique",plans:"Forfait",signOut:"Se déconnecter",
    language:"Langue",langSubtitle:"Vous pourrez la changer en tout temps",searchLanguage:"Langue de travail",
    location:"Localisation",locationSubtitle:"Où est la pharmacie?",
    country:"Pays",province:"Province",state:"État",regionCity:"Région ou ville",
    selectProvince:"Choisir une province",selectState:"Choisir un état",enterRegion:"Région ou ville",
    yourPharmacy:"Détails de la pharmacie",pharmacyInfoSection:"Pharmacie",teamSection:"Pharmacien responsable",
    planSection:"Forfait",softwareSection:"Logiciels utilisés",requiredNote:"Obligatoire",
    pharmacyName:"Bannière ou chaîne",permitNumber:"Numéro de permis de la pharmacie",pharmacyAddress:"Adresse",
    pharmacyPhone:"Téléphone",pharmacyEmail:"Courriel de la pharmacie",dispensingSystem:"Logiciel de dispensation",
    inventorySystem:"Système de commande",pharmacistOwner:"Pharmacien-propriétaire",pharmacistEmail:"Son courriel",
    managerName:"Chef d'équipe",startTyping:"Commencez à taper",emailPlaceholder:"info@pharmacie.com",
    ownerPlaceholder:"Nom complet",ownerEmailPlaceholder:"proprio@pharmacie.com",managerPlaceholder:"Votre nom",
    addressHint:"Choisissez dans la liste pour remplir le reste",launch:"Ouvrir NarcoSync",stepOf:"Étape",ofTotal:"sur",
    welcomeMsg:"Vue d'ensemble",liveMsg:"Aucun décompte encore",liveSubMsg:"Ajoutez vos produits, puis lancez votre premier décompte.",
    newReco:"Lancer une réconciliation",recoComplete:"Cycle enregistré",newRecoBtn:"En lancer un autre",
    basicLabel:"Basique",basicDesc:"Une pharmacie",basicPrice:"49$",
    proLabel:"Pro",proDesc:"Jusqu'à trois pharmacies",proPrice:"99$",
    enterpriseLabel:"Entreprise",enterpriseDesc:"Illimité, avec API",enterprisePrice:"249$",
    tagline:"Registre des substances contrôlées",
    ownerOnly:"Les comptes sont créés par le pharmacien-propriétaire. Les autres membres arrivent par invitation.",
    yourName:"Votre nom complet",yourLicence:"Votre numéro de licence",checkRegister:"Consulter le registre",
    licenceWhy:"Votre licence signe chaque action que vous posez dans le système.",
    email:"Courriel",password:"Mot de passe",min6:"6 caractères minimum",
    forgot:"Mot de passe oublié?",newPassword:"Nouveau mot de passe",repeat:"Répétez-le",
    chooseYourPwd:"Choisissez votre mot de passe",forgotTitle:"Mot de passe oublié",
    forgotSub:"Nous enverrons un lien pour en choisir un nouveau.",sendLink:"Envoyer le lien",
    pwdSaved:"Mot de passe enregistré. Connectez-vous.",save:"Enregistrer",
  }
};
function tr(lang,k){const L=READY.indexOf(lang)>=0?lang:"en";return (T[L]&&T[L][k])||T.en[k]||k;}
function getLang(pl){
  try{const o=localStorage.getItem("ns_lang");if(o)return o;}catch(e){}
  if(!pl) return "en";
  if(pl.startsWith("Français")||pl.includes("Bilingue")||pl.includes("Bilingual")) return "fr";
  const hit=LANGS.find(l=>pl.toLowerCase().indexOf(l.n.toLowerCase())>=0);
  return hit?hit.c:"en";
}

const DISPENSING_SYSTEMS={
  "Canada":["AssiStRx","RxPro","Gespar","Ubik","Reflex","Kroll","Datascan","Logibec","Purkinje","WinRx","Fillware","Nexxsys","Prodigy RX","Propel Rx","Pharmaserv","Other"],
  "United States":["QS/1 (NRx)","PioneerRx","Liberty Software","Rx30","ScriptPro","PDX","Computer-Rx","BestRx","McKesson EnterpriseRx","Epic Willow","Other"],
  "France":["Winpharma","Lgpi (Pharmagest)","Isipharm","Pharmonet","Caducée","Other"],
  "Spain":["Farmatic","Nixfarma","Unycop Win","Farmagestión","Other"],
  "United Kingdom":["Rx Web (Cegedim)","Pharmacy Manager (EMIS)","SystmOne","Titan","Other"],
  "Australia":["Fred Dispense","Minfos","Corum Clear Dispense","Toniq","Other"],
};
const INVENTORY_SYSTEMS={
  "Canada":["Matrix (Pharmaprix / Shoppers)","PharmaClik (McKesson / Proxim / IDA)","Gespar","MMS","Logibec","Kroll Inventory","McKesson Connect","Cardinal Health","SAP","Other"],
  "United States":["McKesson Connect","Cardinal Health","AmerisourceBergen","PioneerRx Inventory","SAP","Other"],
  "France":["Pharmagest Inventory","Winpharma Stock","CERP","OCP","Alliance Healthcare","Other"],
  "Spain":["Cofares","Bidafarma","Hefame","Other"],
  "United Kingdom":["AAH Pharmaceuticals","Phoenix Medical","EMIS Inventory","Other"],
  "Australia":["Fred Office","Minfos Inventory","LOTS","API","Other"],
};
const PHARMACY_CHAINS_BY_COUNTRY={
  "Canada":["Pharmaprix","Jean Coutu","Uniprix","Familiprix","Brunet","Proxim","IDA","Pharmasave","Rexall","Guardian","Shoppers Drug Mart","Walmart Pharmacy","Costco Pharmacy","London Drugs","PharmaChoice","Independent"],
  "United States":["CVS Pharmacy","Walgreens","Rite Aid","Walmart Pharmacy","Costco Pharmacy","Kroger Pharmacy","Health Mart","Independent"],
  "France":["Pharmacie Lafayette","Pharmavie","Giropharm","Independent"],
  "Spain":["Farmacias Trébol","Farmavizcaya","Independent"],
  "United Kingdom":["Boots","Lloyds Pharmacy","Well Pharmacy","Independent"],
  "Australia":["Chemist Warehouse","Priceline Pharmacy","Terry White Chemmart","Independent"],
};
const DEFAULT_LIST=["Other"];
const DEFAULT_CHAINS=["Independent"];
const COUNTRY_ISO={"Canada":"ca","United States":"us","France":"fr","Spain":"es","Australia":"au","Belgium":"be","Germany":"de","Switzerland":"ch","United Kingdom":"gb"};
const COUNTRY_CODES={"Canada":"+1","United States":"+1","France":"+33","Spain":"+34","United Kingdom":"+44","Australia":"+61","Belgium":"+32","Germany":"+49","Switzerland":"+41","Other":"+"};
const COUNTRIES=["Canada","United States","France","Spain","Australia","Belgium","Germany","Switzerland","United Kingdom","Other"];
const CA_PROVINCES=["Québec","Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland & Labrador","Nova Scotia","Ontario","Prince Edward Island","Saskatchewan","Northwest Territories","Nunavut","Yukon"];
const US_STATES=["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
const PROVINCE_COORDS={"Québec":{lat:46.8,lon:-71.2},"Ontario":{lat:51.2,lon:-85.3},"British Columbia":{lat:53.7,lon:-127.6},"Alberta":{lat:53.9,lon:-116.6},"Manitoba":{lat:56.4,lon:-98.7},"Saskatchewan":{lat:55.0,lon:-106.0},"Nova Scotia":{lat:44.7,lon:-63.7},"New Brunswick":{lat:46.5,lon:-66.5}};
const PLAN_PRICE={basic:49,pro:99,enterprise:249};
const CLIN_CATS=[
  {v:"minor",fr:"Affections mineures",en:"Minor ailments"},
  {v:"protocol",fr:"Protocoles",en:"Protocols"},
  {v:"billing",fr:"Facturation",en:"Billing"},
  {v:"calc",fr:"Calculateurs",en:"Calculators"},
  {v:"training",fr:"Formation",en:"Training"},
  {v:"other",fr:"Autre",en:"Other"},
];

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
  getSignup:()=>{try{const s=localStorage.getItem("ns_signup");return s?JSON.parse(s):null;}catch{return null;}},
  saveSignup:(s)=>{try{localStorage.setItem("ns_signup",JSON.stringify(s));}catch{}},
  clearSignup:()=>{try{localStorage.removeItem("ns_signup");}catch{}},
  getAIKey:()=>{try{return localStorage.getItem("ns_ai_key")||"";}catch{return "";}},
  saveAIKey:(k)=>{try{localStorage.setItem("ns_ai_key",k);}catch{}},
  setLang:(l)=>{try{localStorage.setItem("ns_lang",l);}catch{}},
};

const CSS=`
*{box-sizing:border-box;}
body{margin:0;font-family:${F};color:${C.text};background:${C.bg};-webkit-font-smoothing:antialiased;}
input,select,button,textarea{font-family:${F};}
input:focus-visible,select:focus-visible,button:focus-visible,textarea:focus-visible{outline:2px solid ${C.teal};outline-offset:1px;}
a{color:${C.teal};}
.ns-num{font-family:${NUM};font-variant-numeric:tabular-nums;letter-spacing:-.01em;}
.ns-nav{display:flex;align-items:center;width:100%;padding:8px 12px;border:none;border-radius:7px;
  cursor:pointer;font-size:13.5px;text-align:left;margin-bottom:1px;background:transparent;
  color:rgba(255,255,255,.6);transition:background .12s,color .12s;}
.ns-nav:hover{background:rgba(255,255,255,.06);color:rgba(255,255,255,.92);}
.ns-nav[data-on="1"]{background:${C.teal};color:#fff;font-weight:600;}
.ns-btn{border:none;border-radius:7px;cursor:pointer;font-size:13.5px;font-weight:600;padding:10px 17px;transition:opacity .12s;}
.ns-btn:hover{opacity:.88;} .ns-btn:disabled{opacity:.4;cursor:not-allowed;}
.ns-btn-primary{background:${C.teal};color:#fff;}
.ns-btn-quiet{background:${C.paper};color:${C.text};border:1px solid ${C.line};}
.ns-btn-quiet:hover{background:${C.bg};opacity:1;}
.ns-in{width:100%;padding:9px 11px;border-radius:6px;border:1px solid ${C.line};font-size:13.5px;
  background:${C.paper};color:${C.text};transition:border-color .12s;}
.ns-in:focus{border-color:${C.teal};}
.ns-in::placeholder{color:${C.text3};}
.ns-cell{padding:5px 6px;border-radius:5px;border:1px solid ${C.line};font-size:12.5px;background:${C.paper};color:${C.text};}
.ns-cell:focus{border-color:${C.teal};}
.ns-panel{background:${C.paper};border:1px solid ${C.line};border-radius:10px;}
table{border-collapse:separate;border-spacing:0;}
th{font-size:11px;font-weight:600;color:${C.text2};text-align:left;padding:9px 10px;
  background:${C.bg};border-bottom:1px solid ${C.line};white-space:nowrap;}
td{padding:6px 10px;border-bottom:1px solid ${C.line2};font-size:13px;}
tbody tr:last-child td{border-bottom:none;}
.ns-x{border:none;background:none;cursor:pointer;color:${C.text3};font-size:16px;line-height:1;padding:2px 6px;border-radius:4px;}
.ns-x:hover{color:${C.flag};background:${C.flagBg};}
@media print{
  @page{size:landscape;margin:11mm;}
  body{-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#fff;}
  .ns-noprint,.ns-sidebar{display:none !important;}
  .ns-main{overflow:visible !important;background:#fff !important;}
  .ns-print-only{display:block !important;}
  input,select,textarea{border:none !important;background:transparent !important;padding:0 !important;
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
  const m={ok:[C.okBg,C.ok],flag:[C.flagBg,C.flag],warn:[C.warnBg,C.warn],teal:[C.tealSoft,C.teal2],quiet:[C.bg,C.text2]};
  const [bg,fg]=m[tone||"quiet"];
  return <span style={{background:bg,color:fg,fontSize:11.5,fontWeight:600,padding:"3px 9px",borderRadius:5,whiteSpace:"nowrap"}}>{children}</span>;
}
function RoleTag({role,lang}){const r=ROLES[role]||ROLES.pharmacist;return <Tag>{lang==="fr"?r.fr:r.en}</Tag>;}
function H1({children,sub}){
  return(
    <div style={{marginBottom:22}}>
      <div style={{fontSize:24,fontWeight:650,letterSpacing:"-.021em",lineHeight:1.15}}>{children}</div>
      {sub&&<div style={{fontSize:13.5,color:C.text2,marginTop:5,lineHeight:1.5,maxWidth:640}}>{sub}</div>}
    </div>
  );
}
function Note({tone,children}){
  const m={flag:[C.flagBg,C.flag,C.flagLine],ok:[C.okBg,C.ok,C.okLine],warn:[C.warnBg,C.warn,C.warnLine],teal:[C.tealSoft,C.teal2,C.tealLine]};
  const [bg,fg,bd]=m[tone||"warn"];
  return <div style={{background:bg,border:"1px solid "+bd,borderRadius:8,padding:"11px 14px",fontSize:13,color:fg,marginBottom:14,lineHeight:1.5}}>{children}</div>;
}
function FieldLabel({children,required}){
  return <label style={{fontSize:12,fontWeight:600,color:C.text2,display:"block",marginBottom:5}}>{children}{required&&<span style={{color:C.flag}}> *</span>}</label>;
}
function Field({label,value,onChange,placeholder,type="text",hint,required,num}){
  return(
    <div style={{marginBottom:14}}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className={"ns-in"+(num?" ns-num":"")} style={{borderColor:required&&!value.trim()?C.flagLine:C.line}}/>
      {hint&&<div style={{fontSize:11.5,color:C.text3,marginTop:4}}>{hint}</div>}
    </div>
  );
}
function SectionLabel({children}){
  return <div style={{fontSize:13,fontWeight:650,marginTop:24,marginBottom:12,paddingBottom:7,borderBottom:"1px solid "+C.line2}}>{children}</div>;
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
  async log(m,action,entity,eid,details){
    if(!m||!m.user_id) return;
    try{await sbFetch("audit_log",{method:"POST",body:[{user_id:m.user_id,action,entity,
      entity_id:eid?String(eid):null,details:details||null,
      pharmacist_licence:m.licence||"—",pharmacist_name:m.full_name||m.email}],prefer:"return=minimal"});}catch(e){}
  },
  async list(ids){if(!ids||!ids.length)return[];return await sbFetch("audit_log?select=*&user_id=in.("+ids.join(",")+")&order=created_at.desc&limit=500");}
};
const CLIN={
  async listPublished(lang){
    let q="clinical_content?select=*&published=eq.true&order=created_at.desc&limit=300";
    if(lang) q+="&lang=eq."+lang;
    return await sbFetch(q);
  },
  async listAll(){return await sbFetch("clinical_content?select=*&order=created_at.desc&limit=300");},
  async add(row){return await sbFetch("clinical_content",{method:"POST",body:[row],prefer:"return=representation"});},
  async update(id,p){await sbFetch("clinical_content?id=eq."+id,{method:"PATCH",body:{...p,updated_at:new Date().toISOString()}});},
  async remove(id){await sbFetch("clinical_content?id=eq."+id,{method:"DELETE"});},
  async upload(file){
    const g=SB.get();const s=SB.getSession();
    const path=Date.now()+"_"+file.name.replace(/[^\w.\-]/g,"_");
    const r=await fetch(g.url+"/storage/v1/object/clinical/"+path,{method:"POST",
      headers:{"apikey":g.key,"Authorization":"Bearer "+(s?s.access_token:g.key),"Content-Type":file.type||"application/octet-stream"},
      body:file});
    if(!r.ok){const t=await r.text();throw new Error("Upload "+r.status+" — "+t.slice(0,160));}
    return {url:g.url+"/storage/v1/object/public/clinical/"+path,name:file.name};
  }
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
  +"Pour CHAQUE ligne de produit extrais: cup, description, strength, format (ex 100 TAB), din (8 chiffres si present sinon vide), qty (un nombre). "
  +"Si une valeur est absente mets une chaine vide, et qty a 0 si aucune quantite. "
  +"Retourne UNIQUEMENT un tableau JSON valide, sans markdown ni backticks. "
  +"Format: [{\"cup\":\"\",\"description\":\"\",\"strength\":\"\",\"format\":\"\",\"din\":\"\",\"qty\":0}]";

async function callClaude(block,aiKey,prompt){
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":aiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:16000,messages:[{role:"user",content:[block,{type:"text",text:prompt}]}]})});
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
    const src=await PDFLib.PDFDocument.load(await f.arrayBuffer(),{ignoreEncryption:true});
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
          (await out.copyPages(t.src,idx)).forEach(pg=>out.addPage(pg));
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

function LangPicker({lang,setLang,allowed}){
  const [open,setOpen]=useState(false);
  const ref=useRef();
  useEffect(()=>{
    function out(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false);}
    document.addEventListener("mousedown",out);return()=>document.removeEventListener("mousedown",out);
  },[]);
  const list=LANGS.filter(l=>!allowed||allowed.indexOf(l.c)>=0);
  if(list.length<2) return null;
  const cur=LANGS.find(l=>l.c===lang)||LANGS[1];
  return(
    <div ref={ref} style={{position:"relative",marginBottom:9}}>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"none",
        cursor:"pointer",background:"transparent",color:"rgba(255,255,255,.5)",fontSize:12.5,textAlign:"left",
        display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span>{cur.n}</span><span style={{fontSize:9,opacity:.6}}>▾</span>
      </button>
      {open&&(
        <div style={{position:"absolute",bottom:"100%",left:0,right:0,marginBottom:4,background:C.paper,
          border:"1px solid "+C.line,borderRadius:8,boxShadow:"0 10px 30px rgba(14,26,28,.25)",overflow:"hidden",zIndex:60}}>
          {list.map(l=>{
            const ready=READY.indexOf(l.c)>=0;
            return(
              <button key={l.c} onClick={()=>{if(ready){SB.setLang(l.c);setLang(l.c);}setOpen(false);}} disabled={!ready}
                style={{width:"100%",padding:"9px 12px",border:"none",borderBottom:"1px solid "+C.line2,
                  cursor:ready?"pointer":"not-allowed",background:l.c===lang?C.tealSoft:C.paper,
                  color:ready?(l.c===lang?C.teal2:C.text):C.text3,fontSize:13,textAlign:"left"}}>
                {l.n}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Shell({items,page,setPage,tag,name,sub,lang,setLang,allowedLangs,onLogout,children,signOutLabel}){
  return(
    <div style={{display:"flex",height:"100vh"}}>
      <div className="ns-sidebar" style={{width:218,background:C.ink,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"22px 16px 15px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:7,height:19,background:C.teal,borderRadius:2}}/>
            <div style={{color:"#fff",fontSize:16,fontWeight:650,letterSpacing:"-.02em"}}>NarcoSync</div>
          </div>
          {tag&&<div style={{marginTop:10}}>{tag}</div>}
        </div>
        <div style={{padding:"0 16px 14px",borderBottom:"1px solid rgba(255,255,255,.08)",marginBottom:6}}>
          <div style={{color:"rgba(255,255,255,.88)",fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name}</div>
          {sub&&<div style={{color:"rgba(255,255,255,.4)",fontSize:11.5,marginTop:3}}>{sub}</div>}
        </div>
        <div style={{flex:1,padding:"6px 8px",overflowY:"auto"}}>
          {items.map(i=>(<button key={i.id} className="ns-nav" data-on={page===i.id?"1":"0"} onClick={()=>setPage(i.id)}>{i.label}</button>))}
        </div>
        <div style={{padding:"12px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
          {setLang&&<LangPicker lang={lang} setLang={setLang} allowed={allowedLangs}/>}
          <button onClick={onLogout} style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"none",cursor:"pointer",
            background:"transparent",color:"rgba(255,255,255,.4)",fontSize:12.5,textAlign:"left"}}>{signOutLabel}</button>
        </div>
      </div>
      <div className="ns-main" style={{flex:1,overflowY:"auto",background:C.bg}}>{children}</div>
    </div>
  );
}

function AIKeyModal({onClose,onSaved,lang}){
  const [k,setK]=useState("");
  const fr=lang==="fr";
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(14,26,28,.55)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div className="ns-panel" style={{padding:26,maxWidth:430,width:"100%",boxShadow:"0 24px 60px rgba(14,26,28,.24)"}}>
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

function ValidationTable({rows,setRows,showQty,onConfirm,onCancel,busy,lang,member,unitMode,setUnitMode}){
  const fr=lang==="fr";
  function up(i,f,v){setRows(rows.map((r,j)=>j===i?{...r,[f]:v}:r));}
  function del(i){setRows(rows.filter((r,j)=>j!==i));}
  const bad=rows.filter(r=>cleanDin(r.din).length!==8).length;
  return(
    <div className="ns-noprint" style={{background:C.warnBg,border:"1px solid "+C.warnLine,borderRadius:10,padding:18,marginBottom:22}}>
      <div style={{fontSize:15,fontWeight:650,color:C.warn,marginBottom:5}}>{fr?"À valider par le pharmacien":"Pharmacist validation needed"}</div>
      <div style={{fontSize:13,color:C.warn,marginBottom:12,lineHeight:1.5}}>
        {rows.length} {fr?"lignes lues. Corrigez ce qui a été mal lu avant d'enregistrer.":"rows read. Fix anything misread before saving."}
        {bad>0&&<span style={{fontWeight:600}}> {bad} DIN {fr?"n'ont pas 8 chiffres.":"aren't 8 digits."}</span>}
      </div>
      {showQty&&(
        <div className="ns-panel" style={{padding:14,marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:9}}>{fr?"Ces quantités sont en":"These quantities are in"}</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[{v:"pack",l:fr?"Bouteilles ou contenants":"Bottles or packs",d:fr?"converties en unités":"converted to units"},
              {v:"unit",l:fr?"Unités":"Units",d:fr?"gardées telles quelles":"kept as-is"}].map(o=>(
              <button key={o.v} onClick={()=>setUnitMode(o.v)} style={{flex:"1 1 200px",padding:"11px 14px",borderRadius:7,
                border:"1px solid "+(unitMode===o.v?C.teal:C.line),background:unitMode===o.v?C.teal:C.paper,cursor:"pointer",textAlign:"left"}}>
                <div style={{fontSize:13,fontWeight:600,color:unitMode===o.v?"#fff":C.text}}>{o.l}</div>
                <div style={{fontSize:11.5,color:unitMode===o.v?"rgba(255,255,255,.7)":C.text3,marginTop:2}}>{o.d}</div>
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
        {fr?"Signé par":"Signed by"} {member.full_name||member.email}{member.licence&&<span className="ns-num"> · {member.licence}</span>}
      </div>}
      <div className="ns-panel" style={{maxHeight:400,overflowY:"auto",marginBottom:14}}>
        <table style={{width:"100%",minWidth:860}}>
          <thead><tr>
            <th>CUP</th><th>Description</th><th>{fr?"Force":"Strength"}</th><th>Format</th><th>DIN</th>
            {showQty&&<th>{fr?"Qté lue":"Read qty"}</th>}
            {showQty&&unitMode==="pack"&&<th style={{color:C.ok}}>{fr?"Unités":"Units"}</th>}<th></th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>{
              const ok=cleanDin(r.din).length===8;
              return(
                <tr key={i}>
                  <td><input value={r.cup||""} onChange={e=>up(i,"cup",e.target.value)} className="ns-cell ns-num" style={{width:104}}/></td>
                  <td><input value={r.description||r.molecule||""} onChange={e=>up(i,"description",e.target.value)} className="ns-cell" style={{width:186}}/></td>
                  <td><input value={r.strength||""} onChange={e=>up(i,"strength",e.target.value)} className="ns-cell" style={{width:60}}/></td>
                  <td><input value={r.format||""} onChange={e=>up(i,"format",e.target.value)} className="ns-cell" style={{width:80}}/></td>
                  <td><input value={r.din||""} onChange={e=>up(i,"din",e.target.value)} className="ns-cell ns-num"
                    style={{width:84,borderColor:ok?C.line:C.flagLine,background:ok?C.paper:C.flagBg}}/></td>
                  {showQty&&<td><input type="number" value={r.qty||0} onChange={e=>up(i,"qty",e.target.value)} className="ns-cell ns-num" style={{width:58,textAlign:"center"}}/></td>}
                  {showQty&&unitMode==="pack"&&<td className="ns-num" style={{textAlign:"center",fontWeight:600,color:C.ok}}>{(Number(r.qty)||0)*unitsPerPack(r.format)}</td>}
                  <td><button onClick={()=>del(i)} className="ns-x">×</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={onConfirm} disabled={busy||rows.length===0} className="ns-btn ns-btn-primary">{fr?"Valider et enregistrer":"Validate and save"}</button>
        <button onClick={onCancel} className="ns-btn ns-btn-quiet">{fr?"Annuler":"Cancel"}</button>
      </div>
    </div>
  );
}

function ClinicalPage({profile,member,lang,session}){
  const fr=lang==="fr";
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [cat,setCat]=useState("all");
  const [open,setOpen]=useState(null);
  const [err,setErr]=useState("");
  const [asking,setAsking]=useState(false);
  const has=!!(profile&&profile.clinical_addon);
  const pid=member?member.pharmacy_id:session.user.id;
  useEffect(()=>{
    if(!has){setLoading(false);return;}
    (async()=>{try{setRows(await CLIN.listPublished(lang));}catch(e){setErr(e.message);}setLoading(false);})();
  },[has,lang]);
  async function enable(){
    setAsking(true);
    try{
      await sbFetch("profiles?id=eq."+pid,{method:"PATCH",body:{clinical_addon:true}});
      await AUDIT.log(member,"clinical_addon","profiles",pid,fr?"Module clinique activé":"Clinical module enabled");
      SB.saveProfile({...profile,clinical_addon:true});
      window.location.reload();
    }catch(e){setErr(e.message);setAsking(false);}
  }
  if(!has){
    return(
      <div style={{padding:"30px 34px",maxWidth:680}}>
        <H1 sub={fr?"Protocoles, affections mineures, guides de facturation et formation, maintenus à jour et publiés dans NarcoSync.":"Protocols, minor ailments, billing guides and training, kept current and published inside NarcoSync."}>
          {fr?"Module clinique":"Clinical module"}
        </H1>
        <div className="ns-panel" style={{padding:26}}>
          <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:18}}>
            <span className="ns-num" style={{fontSize:38,fontWeight:650,letterSpacing:"-.03em",color:C.teal}}>{CLINICAL_PRICE}$</span>
            <span style={{fontSize:13.5,color:C.text2}}>{fr?"CAD par mois, en supplément de votre forfait":"CAD per month, on top of your plan"}</span>
          </div>
          <div style={{borderTop:"1px solid "+C.line2,paddingTop:18,marginBottom:20}}>
            {(fr?["Protocoles cliniques prêts à appliquer","Fiches d'affections mineures","Guides de facturation à jour","Matériel de formation pour l'équipe","Nouveau contenu ajouté en continu"]
                :["Ready-to-apply clinical protocols","Minor ailment reference sheets","Current billing guides","Training material for the team","New content added continuously"]).map((x,i)=>(
              <div key={i} style={{fontSize:13.5,color:C.text2,marginBottom:8,lineHeight:1.5}}>{x}</div>
            ))}
          </div>
          {err&&<Note tone="flag">{err}</Note>}
          {can(member?member.role:"owner","edit")
            ?<button onClick={enable} disabled={asking} className="ns-btn ns-btn-primary" style={{padding:"12px 24px",fontSize:14}}>
              {asking?(fr?"Activation":"Enabling"):(fr?"Activer le module clinique":"Enable the clinical module")}
            </button>
            :<Note tone="warn">{fr?"Un pharmacien doit activer ce module.":"A pharmacist must enable this module."}</Note>}
          <div style={{fontSize:12,color:C.text3,marginTop:12}}>{fr?"Facturé avec votre abonnement. Annulable en tout temps.":"Billed with your subscription. Cancel any time."}</div>
        </div>
      </div>
    );
  }
  const cats=[{v:"all",l:fr?"Tout":"All"}].concat(CLIN_CATS.map(c=>({v:c.v,l:fr?c.fr:c.en})));
  const shown=cat==="all"?rows:rows.filter(r=>r.category===cat);
  if(open){
    const c=CLIN_CATS.find(x=>x.v===open.category);
    return(
      <div style={{padding:"30px 34px",maxWidth:760}}>
        <button className="ns-btn ns-btn-quiet ns-noprint" onClick={()=>setOpen(null)} style={{marginBottom:20,padding:"6px 13px",fontSize:12.5}}>{tr(lang,"back")}</button>
        {c&&<div style={{marginBottom:8}}><Tag tone="teal">{fr?c.fr:c.en}</Tag></div>}
        <div style={{fontSize:26,fontWeight:650,letterSpacing:"-.022em",lineHeight:1.2,marginBottom:18}}>{open.title}</div>
        {open.file_url&&<a href={open.file_url} target="_blank" rel="noreferrer" className="ns-btn ns-btn-primary"
          style={{display:"inline-block",textDecoration:"none",marginBottom:20,color:"#fff"}}>
          {fr?"Ouvrir le document":"Open the document"}{open.file_name?" — "+open.file_name:""}</a>}
        {open.body&&<div className="ns-panel" style={{padding:26,fontSize:14.5,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{open.body}</div>}
        <button onClick={()=>window.print()} className="ns-btn ns-btn-quiet ns-noprint" style={{marginTop:18}}>{fr?"Imprimer":"Print"}</button>
      </div>
    );
  }
  return(
    <div style={{padding:"30px 34px",maxWidth:900}}>
      <H1 sub={fr?"Contenu maintenu par NarcoSync et mis à jour au fil des changements réglementaires.":"Maintained by NarcoSync and updated as regulations change."}>
        {rows.length} {rows.length===1?"document":"documents"}
      </H1>
      {err&&<Note tone="flag">{err}</Note>}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>
        {cats.map(c=>(
          <button key={c.v} onClick={()=>setCat(c.v)} style={{padding:"6px 13px",borderRadius:20,cursor:"pointer",
            border:"1px solid "+(cat===c.v?C.teal:C.line),background:cat===c.v?C.teal:C.paper,
            color:cat===c.v?"#fff":C.text2,fontSize:12.5,fontWeight:600}}>{c.l}</button>
        ))}
      </div>
      {loading?<div style={{color:C.text3}}>{fr?"Chargement":"Loading"}</div>:
       shown.length===0?<div className="ns-panel" style={{padding:30,fontSize:13.5,color:C.text2}}>{fr?"Aucun document dans cette catégorie pour l'instant.":"Nothing in this category yet."}</div>:(
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {shown.map(r=>{
            const c=CLIN_CATS.find(x=>x.v===r.category);
            return(
              <div key={r.id} onClick={()=>setOpen(r)} className="ns-panel" style={{padding:"17px 20px",cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontSize:14.5,fontWeight:650,marginBottom:4}}>{r.title}</div>
                    <div style={{fontSize:12.5,color:C.text2}}>
                      {r.file_url?(fr?"Document PDF":"PDF document"):(fr?"Texte":"Article")}
                      {" · "}{new Date(r.created_at).toLocaleDateString(fr?"fr-CA":"en-CA",{year:"numeric",month:"short",day:"numeric"})}
                    </div>
                  </div>
                  {c&&<Tag tone="teal">{fr?c.fr:c.en}</Tag>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminClinicalPage(){
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [err,setErr]=useState("");
  const [info,setInfo]=useState("");
  const [busy,setBusy]=useState(false);
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({title:"",category:"protocol",lang:"fr",body:"",file_url:"",file_name:"",published:false});
  const fileRef=useRef();
  async function load(){setLoading(true);setErr("");try{setRows(await CLIN.listAll());}catch(e){setErr(e.message);}setLoading(false);}
  useEffect(()=>{load();},[]);
  function reset(){setForm({title:"",category:"protocol",lang:"fr",body:"",file_url:"",file_name:"",published:false});setEditing(null);}
  function startEdit(r){
    setEditing(r.id);
    setForm({title:r.title||"",category:r.category||"protocol",lang:r.lang||"fr",body:r.body||"",file_url:r.file_url||"",file_name:r.file_name||"",published:!!r.published});
    window.scrollTo({top:0,behavior:"smooth"});
  }
  async function pickFile(e){
    const f=e.target.files&&e.target.files[0];e.target.value="";
    if(!f) return;
    setBusy(true);setErr("");
    try{const up=await CLIN.upload(f);setForm(p=>({...p,file_url:up.url,file_name:up.name}));setInfo("Uploaded: "+up.name);}
    catch(e2){setErr(e2.message);}
    setBusy(false);
  }
  async function save(){
    if(!form.title.trim()){setErr("A title is required.");return;}
    if(!form.body.trim()&&!form.file_url){setErr("Add text or attach a document.");return;}
    setBusy(true);setErr("");setInfo("");
    try{
      const row={title:form.title.trim(),category:form.category,lang:form.lang,
        body:form.body.trim()||null,file_url:form.file_url||null,file_name:form.file_name||null,published:form.published};
      if(editing) await CLIN.update(editing,row); else await CLIN.add(row);
      setInfo(editing?"Updated.":"Created.");reset();await load();
    }catch(e){setErr(e.message);}
    setBusy(false);
  }
  async function togglePub(r){try{await CLIN.update(r.id,{published:!r.published});await load();}catch(e){setErr(e.message);}}
  async function del(r){
    if(!window.confirm("Delete \""+r.title+"\"? Pharmacies will lose access to it.")) return;
    try{await CLIN.remove(r.id);setRows(rows.filter(x=>x.id!==r.id));}catch(e){setErr(e.message);}
  }
  const pub=rows.filter(r=>r.published).length;
  return(
    <div style={{padding:"30px 34px",maxWidth:1080}}>
      <H1 sub="Anything you publish here appears immediately for pharmacies subscribed to the clinical module.">
        {rows.length} {rows.length===1?"item":"items"}{pub>0?" · "+pub+" live":""}
      </H1>
      {err&&<Note tone="flag">{err}</Note>}
      {info&&<Note tone="ok">{info}</Note>}
      <div className="ns-panel" style={{padding:22,marginBottom:24}}>
        <div style={{fontSize:14.5,fontWeight:650,marginBottom:16}}>{editing?"Edit item":"New item"}</div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:11,marginBottom:14}}>
          <div><FieldLabel required>Title</FieldLabel>
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="ns-in" placeholder="Urinary tract infection — prescribing protocol"/></div>
          <div><FieldLabel>Category</FieldLabel>
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="ns-in" style={{cursor:"pointer"}}>
              {CLIN_CATS.map(c=><option key={c.v} value={c.v}>{c.en}</option>)}</select></div>
          <div><FieldLabel>Language</FieldLabel>
            <select value={form.lang} onChange={e=>setForm({...form,lang:e.target.value})} className="ns-in" style={{cursor:"pointer"}}>
              {LANGS.map(l=><option key={l.c} value={l.c}>{l.n}</option>)}</select></div>
        </div>
        <FieldLabel>Text</FieldLabel>
        <textarea value={form.body} onChange={e=>setForm({...form,body:e.target.value})} className="ns-in" rows={9}
          style={{resize:"vertical",lineHeight:1.6,marginBottom:14}} placeholder="Write the content here. Line breaks are kept as you type them."/>
        <FieldLabel>Attached document</FieldLabel>
        <div style={{display:"flex",gap:9,alignItems:"center",flexWrap:"wrap",marginBottom:16}}>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={pickFile} style={{display:"none"}}/>
          <button onClick={()=>fileRef.current?.click()} disabled={busy} className="ns-btn ns-btn-quiet">{busy?"Uploading":"Attach a file"}</button>
          {form.file_name&&<span style={{display:"flex",alignItems:"center",gap:8}}>
            <Tag tone="teal">{form.file_name}</Tag>
            <button onClick={()=>setForm({...form,file_url:"",file_name:""})} className="ns-x">×</button></span>}
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",paddingTop:16,borderTop:"1px solid "+C.line2}}>
          <button onClick={()=>setForm({...form,published:!form.published})} style={{padding:"8px 15px",borderRadius:7,cursor:"pointer",
            border:"1px solid "+(form.published?C.ok:C.line),background:form.published?C.okBg:C.paper,
            color:form.published?C.ok:C.text2,fontSize:12.5,fontWeight:600}}>
            {form.published?"Visible to pharmacies":"Draft — hidden"}</button>
          <button onClick={save} disabled={busy} className="ns-btn ns-btn-primary">{editing?"Save changes":"Create"}</button>
          {editing&&<button onClick={reset} className="ns-btn ns-btn-quiet">Cancel</button>}
        </div>
      </div>
      <div className="ns-panel" style={{overflowX:"auto"}}>
        <table style={{width:"100%",minWidth:820}}>
          <thead><tr><th>Title</th><th>Category</th><th>Lang</th><th>Type</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={6} style={{color:C.text3}}>Loading</td></tr>}
            {!loading&&rows.length===0&&<tr><td colSpan={6} style={{color:C.text3,padding:"20px 10px"}}>Nothing published yet. Create your first item above.</td></tr>}
            {rows.map(r=>{
              const c=CLIN_CATS.find(x=>x.v===r.category);
              return(
                <tr key={r.id}>
                  <td style={{fontWeight:600}}>{r.title}</td>
                  <td style={{color:C.text2}}>{c?c.en:r.category||"—"}</td>
                  <td className="ns-num" style={{fontSize:12,textTransform:"uppercase"}}>{r.lang||"fr"}</td>
                  <td style={{color:C.text2}}>{r.file_url?(r.body?"Text + file":"File"):"Text"}</td>
                  <td><button onClick={()=>togglePub(r)} style={{border:"none",background:"none",cursor:"pointer",padding:0}}>
                    {r.published?<Tag tone="ok">Live</Tag>:<Tag>Draft</Tag>}</button></td>
                  <td><span style={{display:"flex",gap:6}}>
                    <button onClick={()=>startEdit(r)} className="ns-btn ns-btn-quiet" style={{padding:"5px 12px",fontSize:12}}>Edit</button>
                    <button onClick={()=>del(r)} className="ns-x">×</button></span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeamPage({session,member,lang,profile}){
  const fr=lang==="fr";
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
  const li=licenceInfo(profile?.country);
  async function load(){setLoading(true);setErr("");try{setRows(await MEM.list(pid));}catch(e){setErr(e.message);}setLoading(false);}
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
      setEditId(null);setInfo(fr?"Membre mis à jour.":"Member updated.");await load();
    }catch(e){setErr(e.message);}
  }
  async function toggle(r){try{await MEM.update(r.id,{active:!r.active});await AUDIT.log(member,r.active?"deactivate_member":"activate_member","pharmacy_members",r.id,r.email);await load();}catch(e){setErr(e.message);}}
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
          <div style={{fontSize:14.5,fontWeight:650,marginBottom:14}}>{fr?"Inviter quelqu'un":"Invite someone"}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:11,marginBottom:14}}>
            {[["email",fr?"Courriel":"Email","prenom@pharmacie.com"],["full_name",fr?"Nom complet":"Full name",fr?"Prénom Nom":"First Last"]].map(([k,l,p])=>(
              <div key={k}><FieldLabel>{l}</FieldLabel>
                <input value={nw[k]} onChange={e=>setNw({...nw,[k]:e.target.value})} placeholder={p} className="ns-in"/></div>
            ))}
            <div><FieldLabel>{fr?"Rôle":"Role"}</FieldLabel>
              <select value={nw.role} onChange={e=>setNw({...nw,role:e.target.value})} className="ns-in" style={{cursor:"pointer"}}>
                <option value="pharmacist">{fr?ROLES.pharmacist.fr:ROLES.pharmacist.en}</option>
                <option value="technician">{fr?ROLES.technician.fr:ROLES.technician.en}</option>
                <option value="owner">{fr?ROLES.owner.fr:ROLES.owner.en}</option>
              </select></div>
            <div><FieldLabel>{fr?"Licence":"Licence"}{nw.role==="technician"&&<span style={{color:C.text3,fontWeight:400}}> {fr?"(optionnel)":"(optional)"}</span>}</FieldLabel>
              <input value={nw.licence} onChange={e=>setNw({...nw,licence:e.target.value})} placeholder={li.ph} className="ns-in ns-num"/></div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <button onClick={invite} disabled={busy} className="ns-btn ns-btn-primary">{busy?(fr?"Envoi":"Sending"):(fr?"Envoyer l'invitation":"Send invitation")}</button>
            {li.url&&<a href={li.url} target="_blank" rel="noreferrer" style={{fontSize:12.5,fontWeight:600}}>{tr(lang,"checkRegister")} — {li.body}</a>}
          </div>
          <div style={{fontSize:12.5,color:C.text2,marginTop:10}}>{fr?"La personne reçoit un courriel pour choisir son mot de passe.":"They get an email to set their own password."}</div>
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
                <tr key={r.id} style={{opacity:r.active?1:.42,background:ed?C.tealSoft:"transparent"}}>
                  <td>{ed?<input value={edit.full_name} onChange={e=>setEdit({...edit,full_name:e.target.value})} className="ns-cell" style={{width:148}}/>:<span style={{fontWeight:600}}>{r.full_name||"—"}</span>}</td>
                  <td style={{color:C.text2}}>{r.email}</td>
                  <td>{ed?<input value={edit.licence} onChange={e=>setEdit({...edit,licence:e.target.value})} placeholder={li.ph} className="ns-cell ns-num" style={{width:104}}/>
                    :(r.licence?<span className="ns-num">{r.licence}</span>:<Tag tone="flag">{fr?"à ajouter":"missing"}</Tag>)}</td>
                  <td>{ed?(<select value={edit.role} onChange={e=>setEdit({...edit,role:e.target.value})} className="ns-cell" style={{cursor:"pointer"}}>
                        <option value="owner">{fr?ROLES.owner.fr:ROLES.owner.en}</option>
                        <option value="pharmacist">{fr?ROLES.pharmacist.fr:ROLES.pharmacist.en}</option>
                        <option value="technician">{fr?ROLES.technician.fr:ROLES.technician.en}</option>
                      </select>):<RoleTag role={r.role} lang={lang}/>}</td>
                  <td>{r.user_id?<Tag tone="ok">{fr?"Actif":"Active"}</Tag>:<Tag tone="warn">{fr?"Invité":"Invited"}</Tag>}</td>
                  <td>{isOwner&&(
                      <span style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {ed?(<>
                            <button onClick={()=>saveEdit(r)} className="ns-btn ns-btn-primary" style={{padding:"5px 12px",fontSize:12}}>{tr(lang,"save")}</button>
                            <button onClick={()=>setEditId(null)} className="ns-btn ns-btn-quiet" style={{padding:"5px 11px",fontSize:12}}>{fr?"Annuler":"Cancel"}</button>
                          </>):(<>
                            <button onClick={()=>startEdit(r)} className="ns-btn ns-btn-quiet" style={{padding:"5px 12px",fontSize:12}}>{fr?"Modifier":"Edit"}</button>
                            {r.role!=="owner"&&<button onClick={()=>toggle(r)} className="ns-btn ns-btn-quiet" style={{padding:"5px 11px",fontSize:12}}>{r.active?(fr?"Désactiver":"Disable"):(fr?"Activer":"Enable")}</button>}
                            {r.role!=="owner"&&<button onClick={()=>del(r)} className="ns-x">×</button>}
                          </>)}
                      </span>)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{marginTop:26,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(236px,1fr))",gap:14}}>
        {[{r:"owner",items:fr?["Accès complet","Gère l'équipe","Supprime et ajuste","Valide les écarts"]:["Full access","Manages the team","Deletes and adjusts","Approves variances"]},
          {r:"pharmacist",items:fr?["Inventaire et réconciliation","Valide les imports","Valide les écarts","Ne gère pas l'équipe"]:["Inventory and reconciliation","Validates imports","Approves variances","Can't manage the team"]},
          {r:"technician",items:fr?["Consulte l'inventaire","Saisit le décompte","Imprime les rapports","Ne supprime rien"]:["Views inventory","Enters counts","Prints reports","Deletes nothing"]},
        ].map(x=>(
          <div key={x.r} className="ns-panel" style={{padding:17}}>
            <div style={{marginBottom:11}}><RoleTag role={x.r} lang={lang}/></div>
            {x.items.map((it,i)=><div key={i} style={{fontSize:12.5,color:C.text2,marginBottom:6,lineHeight:1.45}}>{it}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditPage({session,member,lang}){
  const fr=lang==="fr";
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
    add_drug:fr?"Produit ajouté":"Product added",clinical_addon:fr?"Module clinique activé":"Clinical module enabled"};
  return(
    <div style={{padding:"30px 34px",maxWidth:1180}}>
      <div className="ns-print-only" style={{marginBottom:14,fontSize:15,fontWeight:650}}>{fr?"Journal d'audit":"Audit log"}</div>
      <div className="ns-noprint" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:14,flexWrap:"wrap"}}>
        <H1 sub={fr?"Nom, licence, date et heure pour chaque action. Le journal ne peut être ni modifié ni effacé.":"Name, licence, date and time for every action. This log can't be edited or erased."}>
          {fr?"Journal d'audit":"Audit log"}
        </H1>
        <button onClick={()=>window.print()} className="ns-btn ns-btn-quiet">{fr?"Imprimer":"Print"}</button>
      </div>
      {err&&<Note tone="flag">{err}</Note>}
      <div className="ns-panel" style={{overflowX:"auto"}}>
        <table style={{width:"100%",minWidth:820}}>
          <thead><tr><th>{fr?"Quand":"When"}</th><th>Action</th><th>{fr?"Détail":"Detail"}</th><th>{fr?"Par":"By"}</th><th>{fr?"Licence":"Licence"}</th></tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={5} style={{color:C.text3}}>{fr?"Chargement":"Loading"}</td></tr>}
            {!loading&&rows.length===0&&<tr><td colSpan={5} style={{color:C.text3,padding:"20px 10px"}}>{fr?"Rien encore. Les actions apparaîtront ici.":"Nothing yet. Actions will show up here."}</td></tr>}
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

function InventoryPage({session,member,lang,profile}){
  const fr=lang==="fr";
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
  async function load(s){setLoading(true);setErr("");try{setRows(await INV.list(pid,s));}catch(e){setErr(e.message);}setLoading(false);}
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
      setCatQuery("");setCatRes([]);setInfo((fr?"Ajouté : ":"Added: ")+d.molecule);await load(search);
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
      setInfo((fr?"Ajouté : ":"Added: ")+nw.molecule+" · "+fq+" "+packLabel(nw.format,fr));
      setNw({cup:"",molecule:"",strength:"",format:"",din:"",qty:"",mode:"pack"});setShowAdd(false);await load(search);
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
      await AUDIT.log(member,"import_inventory","pharmacy_drugs",null,pending.length+(fr?" lignes, ":" lines, ")+res.added+(fr?" ajoutées, ":" added, ")+res.merged+(fr?" fusionnées":" merged"));
      setPending(null);setBusy("");
      setInfo(res.added+(fr?" produits ajoutés":" products added")+(res.merged?", "+res.merged+(fr?" quantités mises à jour":" quantities updated"):"")+(newOnes.length?", "+newOnes.length+(fr?" nouveaux au catalogue":" new to the catalog"):""));
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
      {showKey&&<AIKeyModal lang={lang} onClose={()=>setShowKey(false)} onSaved={()=>{setShowKey(false);fileRef.current?.click();}}/>}
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
          {canEdit&&(<>
              <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFiles} style={{display:"none"}}/>
              <button onClick={()=>setShowAdd(!showAdd)} className="ns-btn ns-btn-quiet">{fr?"Ajouter un produit":"Add a product"}</button>
              <button onClick={()=>{if(!SB.getAIKey()){setShowKey(true);}else{fileRef.current?.click();}}} disabled={!!busy} className="ns-btn ns-btn-primary">
                {busy?(fr?"Lecture en cours":"Reading"):(fr?"Lire un document":"Read a document")}</button>
          </>)}
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
              <div key={k}><FieldLabel>{l}</FieldLabel>
                <input value={nw[k]} onChange={e=>setNw({...nw,[k]:e.target.value})} placeholder={k==="format"?"100 TAB":""}
                  className={"ns-in"+(k==="cup"||k==="din"||k==="qty"?" ns-num":"")} style={k==="qty"?{textAlign:"center"}:{}}/></div>
            ))}
          </div>
          <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
            <span style={{fontSize:12.5,color:C.text2}}>{fr?"Cette quantité est en":"This quantity is in"}</span>
            {[{v:"pack",l:fr?"bouteilles":"bottles"},{v:"unit",l:fr?"unités":"units"}].map(o=>(
              <button key={o.v} onClick={()=>setNw({...nw,mode:o.v})} style={{padding:"6px 14px",borderRadius:6,
                border:"1px solid "+(nw.mode===o.v?C.teal:C.line),background:nw.mode===o.v?C.teal:C.paper,
                color:nw.mode===o.v?"#fff":C.text2,cursor:"pointer",fontSize:12.5,fontWeight:600}}>{o.l}</button>
            ))}
            {nw.qty&&nw.format&&nw.mode==="pack"&&<Tag tone="ok"><span className="ns-num">{(Number(nw.qty)||0)*unitsPerPack(nw.format)}</span> {packLabel(nw.format,fr)}</Tag>}
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
            <button onClick={()=>{ctrlRef.current.paused=!ctrlRef.current.paused;setPaused(ctrlRef.current.paused);}} className="ns-btn ns-btn-quiet" style={{padding:"5px 13px",fontSize:12}}>{paused?(fr?"Reprendre":"Resume"):"Pause"}</button>
            <button onClick={()=>{ctrlRef.current.cancelled=true;}} className="ns-btn ns-btn-quiet" style={{padding:"5px 13px",fontSize:12,color:C.flag}}>{fr?"Arrêter":"Stop"}</button>
          </span>
        </div>
      )}
      {err&&<div className="ns-noprint"><Note tone="flag">{err}</Note></div>}
      {info&&<div className="ns-noprint"><Note tone="ok">{info}</Note></div>}
      {pending&&<ValidationTable rows={pending} setRows={setPending} showQty={true} onConfirm={confirmPending}
        onCancel={()=>setPending(null)} busy={!!busy} lang={lang} member={member} unitMode={unitMode} setUnitMode={setUnitMode}/>}
      <div className="ns-panel" style={{overflowX:"auto"}}>
        <table style={{width:"100%",minWidth:880}}>
          <thead><tr>
            <th>CUP</th><th>Description</th><th>{fr?"Force":"Strength"}</th><th>Format</th><th>DIN</th>
            <th style={{textAlign:"right"}}>{fr?"Quantité":"Quantity"}</th>{canEdit&&<th className="ns-noprint"></th>}
          </tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={7} style={{color:C.text3}}>{fr?"Chargement":"Loading"}</td></tr>}
            {!loading&&rows.length===0&&<tr><td colSpan={7} style={{color:C.text3,padding:"22px 10px"}}>
              {fr?"Aucun produit. Lisez un bon d'achat ou ajoutez un produit à la main.":"No products yet. Read a purchase order or add one by hand."}</td></tr>}
            {rows.map(r=>(
              <tr key={r.id}>
                <td className="ns-num" style={{fontSize:12,color:C.text2}}>{r.cup||"—"}</td>
                <td style={{fontWeight:600}}>{r.molecule||"—"}</td>
                <td style={{color:C.text2}}>{r.strength||"—"}</td>
                <td style={{color:C.text2}}>{r.format||"—"}</td>
                <td className="ns-num" style={{fontSize:12}}>{r.din||"—"}</td>
                <td style={{textAlign:"right"}}>
                  {canEdit?<input type="number" defaultValue={r.qty||0} onBlur={e=>saveQty(r,e.target.value)}
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
  async function load(s){setLoading(true);setErr("");try{setRows(await CAT.list(s));}catch(e){setErr(e.message);}setLoading(false);}
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
      {showKey&&<AIKeyModal lang="en" onClose={()=>setShowKey(false)} onSaved={()=>{setShowKey(false);fileRef.current?.click();}}/>}
      <div style={{display:"flex",flexWrap:"wrap",gap:14,alignItems:"flex-start",justifyContent:"space-between"}}>
        <H1 sub="Shared across every pharmacy. Discontinued lines are excluded on import.">{rows.length} products</H1>
        <div>
          <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFiles} style={{display:"none"}}/>
          <button onClick={()=>{if(!SB.getAIKey()){setShowKey(true);}else{fileRef.current?.click();}}} disabled={!!busy} className="ns-btn ns-btn-primary">
            {busy?"Reading":"Read a document"}</button>
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
        onCancel={()=>setPending(null)} busy={!!busy} lang="en" unitMode="unit" setUnitMode={()=>{}}/>}
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

function AdminPharmacies(){
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [err,setErr]=useState("");
  const [filter,setFilter]=useState("all");
  async function load(){
    setLoading(true);setErr("");
    try{setRows(await sbFetch("profiles?select=*&order=created_at.desc"));}catch(e){setErr(e.message);}
    setLoading(false);
  }
  useEffect(()=>{load();},[]);
  async function setVerified(p,val,note){
    try{
      await sbFetch("profiles?id=eq."+p.id,{method:"PATCH",body:{verified:val,verified_at:val?new Date().toISOString():null,verified_note:note||null}});
      await load();
    }catch(e){setErr(e.message);}
  }
  const pending=rows.filter(r=>!r.verified).length;
  const shown=filter==="pending"?rows.filter(r=>!r.verified):filter==="verified"?rows.filter(r=>r.verified):rows;
  return(
    <div style={{padding:"30px 34px",maxWidth:1080}}>
      <H1 sub="You see profiles and licences. Their inventory, counts and audit log stay private to them.">
        {rows.length} {rows.length===1?"pharmacy":"pharmacies"}{pending>0?" · "+pending+" to verify":""}
      </H1>
      {err&&<Note tone="flag">{err}</Note>}
      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
        {[["all","All"],["pending","To verify"],["verified","Verified"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{padding:"6px 13px",borderRadius:20,cursor:"pointer",
            border:"1px solid "+(filter===v?C.teal:C.line),background:filter===v?C.teal:C.paper,
            color:filter===v?"#fff":C.text2,fontSize:12.5,fontWeight:600}}>{l}</button>
        ))}
      </div>
      {loading?<div style={{color:C.text3}}>Loading</div>:
       shown.length===0?<div className="ns-panel" style={{padding:26,color:C.text3,fontSize:13}}>Nothing here.</div>:
       shown.map((p,i)=>{
        const li=licenceInfo(p.country);
        return(
          <div key={i} className="ns-panel" style={{padding:19,marginBottom:11,
            borderLeft:p.verified?("3px solid "+C.ok):("3px solid "+C.warnLine)}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:12,marginBottom:9,flexWrap:"wrap"}}>
              <div>
                <div style={{fontSize:15,fontWeight:650}}>{p.pharmacy_name||"—"}</div>
                <div style={{fontSize:12.5,color:C.text2,marginTop:2}}>{p.email}</div>
              </div>
              <span style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                {p.verified?<Tag tone="ok">Verified</Tag>:<Tag tone="warn">To verify</Tag>}
                {p.clinical_addon&&<Tag tone="teal">Clinical</Tag>}
                {p.plan&&<Tag>{p.plan}</Tag>}
              </span>
            </div>
            <div style={{fontSize:12.5,color:C.text2,marginBottom:10,lineHeight:1.6}}>
              {[p.pharmacy_address,p.province,p.country].filter(Boolean).join(", ")||"—"}<br/>
              {p.pharmacist_owner||"—"}
              {p.permit_number&&<span className="ns-num"> · {p.permit_number}</span>}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",paddingTop:11,borderTop:"1px solid "+C.line2}}>
              {li.url&&<a href={li.url} target="_blank" rel="noreferrer" className="ns-btn ns-btn-quiet"
                style={{textDecoration:"none",padding:"6px 13px",fontSize:12}}>Check {li.body}</a>}
              {p.verified
                ?<button onClick={()=>setVerified(p,false,"")} className="ns-btn ns-btn-quiet" style={{padding:"6px 13px",fontSize:12,color:C.flag}}>Revoke</button>
                :<button onClick={()=>setVerified(p,true,"Verified in register")} className="ns-btn ns-btn-primary" style={{padding:"6px 13px",fontSize:12}}>Mark verified</button>}
              {p.verified_at&&<span className="ns-num" style={{fontSize:11.5,color:C.text3}}>
                {new Date(p.verified_at).toLocaleDateString("en-CA")}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AdminDashboard({session,onLogout}){
  const [page,setPage]=useState("overview");
  const [profiles,setProfiles]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    sbFetch("profiles?select=*&order=created_at.desc").then(d=>{if(Array.isArray(d))setProfiles(d);setLoading(false);}).catch(()=>setLoading(false));
  },[]);
  const base=profiles.reduce((s,p)=>s+(PLAN_PRICE[p.plan]||0),0);
  const clin=profiles.filter(p=>p.clinical_addon).length*CLINICAL_PRICE;
  const toVerify=profiles.filter(p=>!p.verified).length;
  const items=[{id:"overview",label:"Overview"},{id:"pharmacies",label:"Pharmacies"},
    {id:"catalog",label:"Drug catalog"},{id:"clinical",label:"Clinical content"}];
  return(
    <Shell items={items} page={page} setPage={setPage} name={session.user.email} signOutLabel="Sign out"
      tag={<span style={{background:"rgba(255,255,255,.12)",color:"rgba(255,255,255,.82)",fontSize:10.5,fontWeight:600,padding:"3px 8px",borderRadius:4}}>Admin</span>}
      onLogout={onLogout}>
      {page==="overview"&&(
        <div style={{padding:"30px 34px",maxWidth:1000}}>
          <H1 sub="Pharmacy profiles and revenue. Their inventory and counts stay private to them.">Overview</H1>
          {loading?<div style={{color:C.text3}}>Loading</div>:(<>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(172px,1fr))",gap:14,marginBottom:20}}>
              {[["Pharmacies",profiles.length,null],["Monthly revenue","$"+(base+clin),C.teal],
                ["Clinical module",profiles.filter(p=>p.clinical_addon).length,null],
                ["To verify",toVerify,toVerify>0?C.warn:null]].map(([l,v,col])=>(
                <div key={l} className="ns-panel" style={{padding:20}}>
                  <div className="ns-num" style={{fontSize:32,fontWeight:650,letterSpacing:"-.03em",color:col||C.text}}>{v}</div>
                  <div style={{fontSize:12.5,color:C.text2,marginTop:5}}>{l}</div>
                </div>
              ))}
            </div>
            {toVerify>0&&<Note tone="warn">
              {toVerify} {toVerify===1?"pharmacy hasn't":"pharmacies haven't"} had {toVerify===1?"its":"their"} licence checked yet.
              They can use NarcoSync in the meantime — open Pharmacies to review them.
            </Note>}
          </>)}
        </div>
      )}
      {page==="pharmacies"&&<AdminPharmacies/>}
      {page==="catalog"&&<AdminCatalogPage/>}
      {page==="clinical"&&<AdminClinicalPage/>}
    </Shell>
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
        const p=new URLSearchParams({q:v,limit:7});
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
        className="ns-in" style={{borderColor:required&&!value.trim()?C.flagLine:C.line}} autoComplete="off"/>
      {open&&res.length>0&&(
        <div ref={dRef} className="ns-panel" style={{position:"fixed",top:pos.top,left:pos.left,width:pos.width,zIndex:9999,maxHeight:240,overflowY:"auto",boxShadow:"0 12px 32px rgba(14,26,28,.14)"}}>
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
        style={{borderColor:required&&!value.trim()?C.flagLine:C.line}} autoComplete="off"/>
      {open&&f.length>0&&(
        <div ref={dRef} className="ns-panel" style={{position:"fixed",top:pos.top,left:pos.left,width:pos.width,zIndex:9999,maxHeight:230,overflowY:"auto",boxShadow:"0 12px 32px rgba(14,26,28,.14)"}}>
          {f.map(o=>(
            <div key={o} onClick={()=>{onChange(o);setQ(o);setOpen(false);}}
              style={{padding:"10px 13px",cursor:"pointer",fontSize:13,borderBottom:"1px solid "+C.line2,background:value===o?C.tealSoft:C.paper}}>{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function LangSearch({lang,setLang}){
  const [open,setOpen]=useState(false);
  const [q,setQ]=useState("");
  const ref=useRef();const inRef=useRef();
  useEffect(()=>{
    function out(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false);}
    document.addEventListener("mousedown",out);return()=>document.removeEventListener("mousedown",out);
  },[]);
  useEffect(()=>{if(open&&inRef.current) inRef.current.focus();},[open]);
  const cur=LANGS.find(l=>l.c===lang)||LANGS[1];
  const hits=LANGS.filter(l=>!q||l.n.toLowerCase().indexOf(q.toLowerCase())>=0);
  return(
    <div ref={ref} style={{position:"relative",maxWidth:262}}>
      <button onClick={()=>{setOpen(!open);setQ("");}} style={{display:"flex",alignItems:"center",gap:8,
        border:"1px solid rgba(255,255,255,.16)",background:"transparent",borderRadius:7,cursor:"pointer",
        padding:"9px 13px",color:"rgba(255,255,255,.74)",fontSize:13,width:"100%",justifyContent:"space-between"}}>
        <span>{cur.n}</span><span style={{fontSize:9,opacity:.5}}>▾</span>
      </button>
      {open&&(
        <div className="ns-panel" style={{position:"absolute",bottom:"100%",left:0,width:262,marginBottom:6,
          zIndex:80,overflow:"hidden",boxShadow:"0 14px 40px rgba(0,0,0,.42)"}}>
          <div style={{padding:9,borderBottom:"1px solid "+C.line2}}>
            <input ref={inRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search a language"
              className="ns-in" style={{fontSize:13,padding:"7px 10px"}}/>
          </div>
          <div style={{maxHeight:220,overflowY:"auto"}}>
            {hits.length===0&&<div style={{padding:"13px",fontSize:12.5,color:C.text3}}>Nothing matches.</div>}
            {hits.map(l=>{
              const ready=READY.indexOf(l.c)>=0;
              return(
                <button key={l.c} onClick={()=>{if(ready){SB.setLang(l.c);setLang(l.c);setOpen(false);}}} disabled={!ready}
                  style={{width:"100%",padding:"10px 13px",border:"none",borderBottom:"1px solid "+C.line2,
                    cursor:ready?"pointer":"not-allowed",background:l.c===lang?C.tealSoft:C.paper,
                    color:ready?(l.c===lang?C.teal2:C.text):C.text3,fontSize:13,textAlign:"left",
                    display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                  <span>{l.n}</span>
                  {l.c===lang&&<span style={{fontSize:11,color:C.teal}}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function AuthScreen({onAuth,lang,setLang}){
  const fr=lang==="fr";
  const t=(k)=>tr(lang,k);
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [pwd,setPwd]=useState("");
  const [name,setName]=useState("");
  const [lic,setLic]=useState("");
  const [country,setCountry]=useState("Canada");
  const [err,setErr]=useState("");
  const [msg,setMsg]=useState("");
  const [busy,setBusy]=useState(false);
  const [tok,setTok]=useState(null);
  const [np1,setNp1]=useState("");
  const [np2,setNp2]=useState("");
  const li=licenceInfo(country);

  useEffect(()=>{
    const h=window.location.hash||"";
    if(h.indexOf("access_token")>=0&&h.indexOf("type=recovery")>=0){
      const p=new URLSearchParams(h.replace(/^#/,""));
      const tk=p.get("access_token");
      if(tk){setTok(tk);setMode("reset");}
    }
  },[]);

  async function signIn(){
    if(!email||!pwd){setErr(fr?"Entrez votre courriel et votre mot de passe.":"Enter your email and password.");return;}
    setBusy(true);setErr("");setMsg("");
    const {url,key}=SB.get();
    try{
      const r=await fetch(url+"/auth/v1/token?grant_type=password",{method:"POST",
        headers:{"Content-Type":"application/json","apikey":key},body:JSON.stringify({email,password:pwd})});
      const d=await r.json();
      if(d.access_token){SB.saveSession(d);onAuth(d);}
      else setErr(d.error_description||d.msg||d.message||(fr?"Ces identifiants ne fonctionnent pas.":"Those credentials didn't work."));
    }catch(e){setErr(fr?"Connexion échouée.":"Connection failed.");}
    setBusy(false);
  }
  async function signUp(){
    if(!email||!pwd||!name.trim()||!lic.trim()){
      setErr(fr?"Tous les champs sont requis, incluant votre numéro de licence.":"Every field is required, including your licence number.");return;}
    if(pwd.length<6){setErr(fr?"Le mot de passe doit avoir 6 caractères minimum.":"Password needs 6 characters minimum.");return;}
    setBusy(true);setErr("");setMsg("");
    const {url,key}=SB.get();
    try{
      const r=await fetch(url+"/auth/v1/signup",{method:"POST",
        headers:{"Content-Type":"application/json","apikey":key},body:JSON.stringify({email,password:pwd})});
      const d=await r.json();
      if(d.access_token){
        SB.saveSignup({full_name:name.trim(),licence:lic.trim(),country});
        SB.saveSession(d);onAuth(d);
      } else setErr(d.error_description||d.msg||d.message||(fr?"Création impossible.":"Couldn't create the account."));
    }catch(e){setErr(fr?"Connexion échouée.":"Connection failed.");}
    setBusy(false);
  }
  async function sendRecovery(){
    if(!email){setErr(fr?"Entrez votre courriel.":"Enter your email.");return;}
    setBusy(true);setErr("");setMsg("");
    const {url,key}=SB.get();
    try{
      const r=await fetch(url+"/auth/v1/recover",{method:"POST",headers:{"Content-Type":"application/json","apikey":key},
        body:JSON.stringify({email,redirect_to:window.location.origin})});
      if(r.ok) setMsg((fr?"Un lien vient d'être envoyé à ":"A link was just sent to ")+email+".");
      else{const d=await r.json();setErr(d.msg||d.message||(fr?"Envoi impossible.":"Couldn't send."));}
    }catch(e){setErr(fr?"Connexion échouée.":"Connection failed.");}
    setBusy(false);
  }
  async function applyNew(){
    if(np1.length<6){setErr(fr?"Choisissez au moins 6 caractères.":"Use at least 6 characters.");return;}
    if(np1!==np2){setErr(fr?"Les deux mots de passe diffèrent.":"The passwords don't match.");return;}
    setBusy(true);setErr("");
    const {url,key}=SB.get();
    try{
      const r=await fetch(url+"/auth/v1/user",{method:"PUT",
        headers:{"Content-Type":"application/json","apikey":key,"Authorization":"Bearer "+tok},body:JSON.stringify({password:np1})});
      const d=await r.json();
      if(r.ok){setMsg(t("pwdSaved"));setTok(null);setMode("login");setNp1("");setNp2("");setPwd("");
        try{window.history.replaceState({},"",window.location.pathname);}catch(e){}}
      else setErr(d.msg||d.message||(fr?"Enregistrement impossible.":"Couldn't save."));
    }catch(e){setErr(fr?"Connexion échouée.":"Connection failed.");}
    setBusy(false);
  }

  return(
    <div style={{minHeight:"100vh",display:"flex",background:C.ink}}>
      <div style={{flex:"1 1 46%",display:"flex",flexDirection:"column",justifyContent:"space-between",
        padding:"46px 46px 34px",minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:8,height:26,background:C.teal,borderRadius:2}}/>
          <div style={{color:"#fff",fontSize:21,fontWeight:650,letterSpacing:"-.024em"}}>NarcoSync</div>
        </div>
        <div style={{maxWidth:420}}>
          <div style={{color:"#fff",fontSize:34,fontWeight:650,letterSpacing:"-.028em",lineHeight:1.2,marginBottom:16}}>
            {fr?"Le registre des narcotiques, tenu correctement."
               :"The narcotics register, kept properly."}
          </div>
          <div style={{color:"rgba(255,255,255,.55)",fontSize:14.5,lineHeight:1.65}}>
            {fr?"Chaque décompte est calculé, chaque écart est signalé, et chaque geste porte le nom et la licence de la personne qui l'a posé."
               :"Every count is calculated, every variance is flagged, and every action carries the name and licence of the person who took it."}
          </div>
        </div>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          {LANGS.map(l=>{
            const ready=READY.indexOf(l.c)>=0;
            return(
              <button key={l.c} onClick={()=>{if(ready){SB.setLang(l.c);setLang(l.c);}}} disabled={!ready}
                style={{border:"none",background:"none",cursor:ready?"pointer":"default",fontSize:12.5,
                  color:lang===l.c?"#fff":(ready?"rgba(255,255,255,.42)":"rgba(255,255,255,.18)"),
                  fontWeight:lang===l.c?600:400,padding:0}}>{l.n}</button>
            );
          })}
        </div>
      </div>

      <div style={{flex:"1 1 54%",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"36px 28px",minWidth:0}}>
        <div style={{width:"100%",maxWidth:392}}>
          {mode==="reset"?(
            <div className="ns-panel" style={{padding:28}}>
              <div style={{fontSize:19,fontWeight:650,marginBottom:18,letterSpacing:"-.02em"}}>{t("chooseYourPwd")}</div>
              <FieldLabel>{t("newPassword")}</FieldLabel>
              <input type="password" value={np1} onChange={e=>setNp1(e.target.value)} placeholder={t("min6")} className="ns-in" style={{marginBottom:12}}/>
              <FieldLabel>{t("repeat")}</FieldLabel>
              <input type="password" value={np2} onChange={e=>setNp2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&applyNew()} className="ns-in" style={{marginBottom:15}}/>
              {err&&<div style={{color:C.flag,fontSize:12.5,marginBottom:12}}>{err}</div>}
              {msg&&<div style={{color:C.ok,fontSize:12.5,marginBottom:12}}>{msg}</div>}
              <button onClick={applyNew} disabled={busy} className="ns-btn ns-btn-primary" style={{width:"100%"}}>{busy?t("saving"):t("save")}</button>
            </div>
          ):mode==="forgot"?(
            <div className="ns-panel" style={{padding:28}}>
              <div style={{fontSize:19,fontWeight:650,marginBottom:6,letterSpacing:"-.02em"}}>{t("forgotTitle")}</div>
              <div style={{fontSize:13.5,color:C.text2,marginBottom:18,lineHeight:1.5}}>{t("forgotSub")}</div>
              <FieldLabel>{t("email")}</FieldLabel>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendRecovery()} className="ns-in" style={{marginBottom:15}}/>
              {err&&<div style={{color:C.flag,fontSize:12.5,marginBottom:12}}>{err}</div>}
              {msg&&<div style={{color:C.ok,fontSize:12.5,marginBottom:12}}>{msg}</div>}
              <button onClick={sendRecovery} disabled={busy} className="ns-btn ns-btn-primary" style={{width:"100%",marginBottom:9}}>{busy?"…":t("sendLink")}</button>
              <button onClick={()=>{setMode("login");setErr("");setMsg("");}} className="ns-btn ns-btn-quiet" style={{width:"100%"}}>{t("back")}</button>
            </div>
          ):mode==="signup"?(
            <div className="ns-panel" style={{padding:28}}>
              <div style={{fontSize:19,fontWeight:650,marginBottom:6,letterSpacing:"-.02em"}}>{t("createAccount")}</div>
              <div style={{fontSize:13,color:C.text2,marginBottom:18,lineHeight:1.55}}>{t("ownerOnly")}</div>
              <FieldLabel required>{t("email")}</FieldLabel>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="ns-in" style={{marginBottom:12}} autoComplete="off"/>
              <FieldLabel required>{t("password")}</FieldLabel>
              <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder={t("min6")} className="ns-in" style={{marginBottom:12}} autoComplete="off"/>
              <FieldLabel required>{t("yourName")}</FieldLabel>
              <input value={name} onChange={e=>setName(e.target.value)} className="ns-in" style={{marginBottom:12}}/>
              <FieldLabel>{t("country")}</FieldLabel>
              <select value={country} onChange={e=>{setCountry(e.target.value);
                const ls=COUNTRY_LANGS[e.target.value]||["en"];
                const first=ls.filter(c=>READY.indexOf(c)>=0)[0];
                if(first){SB.setLang(first);setLang(first);}
              }} className="ns-in" style={{marginBottom:12,cursor:"pointer"}}>
                {COUNTRIES.map(c=><option key={c}>{c}</option>)}
              </select>
              <FieldLabel required>{t("yourLicence")}</FieldLabel>
              <input value={lic} onChange={e=>setLic(e.target.value)} placeholder={li.ph} className="ns-in ns-num" style={{marginBottom:7}}/>
              <div style={{fontSize:11.5,color:C.text3,marginBottom:16,lineHeight:1.5}}>
                {t("licenceWhy")}
                {li.url&&<> <a href={li.url} target="_blank" rel="noreferrer" style={{fontWeight:600}}>{t("checkRegister")} — {li.body}</a></>}
              </div>
              {err&&<div style={{color:C.flag,fontSize:12.5,marginBottom:12}}>{err}</div>}
              <button onClick={signUp} disabled={busy} className="ns-btn ns-btn-primary" style={{width:"100%",marginBottom:12}}>
                {busy?"…":t("createAccount")}
              </button>
              <button onClick={()=>{setMode("login");setErr("");}} style={{width:"100%",border:"none",background:"none",cursor:"pointer",fontSize:12.5,color:C.text2}}>
                {fr?"J'ai déjà un compte":"I already have an account"}
              </button>
            </div>
          ):(
            <div className="ns-panel" style={{padding:28}}>
              <div style={{fontSize:19,fontWeight:650,marginBottom:20,letterSpacing:"-.02em"}}>{t("signIn")}</div>
              <FieldLabel>{t("email")}</FieldLabel>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="ns-in" style={{marginBottom:13}} autoComplete="off"/>
              <FieldLabel>{t("password")}</FieldLabel>
              <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&signIn()} className="ns-in" style={{marginBottom:16}} autoComplete="off"/>
              {err&&<div style={{color:C.flag,fontSize:12.5,marginBottom:12}}>{err}</div>}
              {msg&&<div style={{color:C.ok,fontSize:12.5,marginBottom:12}}>{msg}</div>}
              <button onClick={signIn} disabled={busy} className="ns-btn ns-btn-primary" style={{width:"100%",marginBottom:14}}>{busy?"…":t("signIn")}</button>
              <div style={{display:"flex",justifyContent:"space-between",gap:12,paddingTop:14,borderTop:"1px solid "+C.line2}}>
                <button onClick={()=>{setMode("forgot");setErr("");}} style={{border:"none",background:"none",cursor:"pointer",fontSize:12.5,color:C.text2,padding:0}}>{t("forgot")}</button>
                <button onClick={()=>{setMode("signup");setErr("");}} style={{border:"none",background:"none",cursor:"pointer",fontSize:12.5,color:C.teal,fontWeight:600,padding:0}}>{t("createAccount")}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OnboardingWizard({userEmail,onComplete,session,lang,setLang}){
  const su=SB.getSignup();
  const fr=lang==="fr";
  const t=(k)=>tr(lang,k);
  const [step,setStep]=useState(1);
  const [country,setCountry]=useState(su?.country||"Canada");
  const [province,setProvince]=useState("");
  const [pharmacyName,setPharmacyName]=useState("");
  const [dispensingSystem,setDispensingSystem]=useState("");
  const [inventorySystem,setInventorySystem]=useState("");
  const [pharmacyPhone,setPharmacyPhone]=useState("");
  const [pharmacyEmail,setPharmacyEmail]=useState("");
  const [pharmacyAddress,setPharmacyAddress]=useState("");
  const [permitNumber,setPermitNumber]=useState("");
  const [pharmacistOwner,setPharmacistOwner]=useState(su?.full_name||"");
  const [licence,setLicence]=useState(su?.licence||"");
  const [plan,setPlan]=useState("");
  const [saving,setSaving]=useState(false);
  const cc=COUNTRY_CODES[country]||"+1";
  const li=licenceInfo(country);
  const allowed=(COUNTRY_LANGS[country]||["en"]).filter(c=>READY.indexOf(c)>=0);
  useEffect(()=>{setPharmacyName("");setPharmacyAddress("");setDispensingSystem("");setInventorySystem("");},[country]);
  const ok=pharmacyName.trim()&&pharmacyAddress.trim()&&pharmacyPhone.trim()&&pharmacistOwner.trim()&&licence.trim()&&dispensingSystem.trim()&&inventorySystem.trim()&&plan;
  function fmtPhone(d){if(!d)return "";if(d.length<=3)return d;if(d.length<=6)return d.slice(0,3)+"-"+d.slice(3);return d.slice(0,3)+"-"+d.slice(3,6)+"-"+d.slice(6,10);}
  async function finish(){
    if(!ok) return;
    setSaving(true);
    const langName=(LANGS.find(l=>l.c===lang)||{n:"English"}).n;
    const profile={id:session.user.id,email:userEmail,language:langName,country,province,
      pharmacy_name:pharmacyName,dispensing_system:dispensingSystem,inventory_system:inventorySystem,
      pharmacy_phone:cc+" "+pharmacyPhone,pharmacy_email:pharmacyEmail,pharmacy_address:pharmacyAddress,
      permit_number:permitNumber||licence,pharmacist_owner:pharmacistOwner,pharmacist_email:userEmail,
      owner_name:pharmacistOwner,plan,verified:false};
    try{await sbFetch("profiles",{method:"POST",body:profile,prefer:"resolution=merge-duplicates"});}catch(e){}
    try{await MEM.add({pharmacy_id:session.user.id,user_id:session.user.id,email:userEmail,
      full_name:pharmacistOwner,licence:licence.trim(),role:"owner",active:true});}catch(e){}
    SB.clearSignup();
    onComplete(profile);setSaving(false);
  }
  return(
    <div style={{minHeight:"100vh",background:C.bg,padding:"40px 20px"}}>
      <div style={{maxWidth:520,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:13,color:C.text2}}>{t("stepOf")} {step} {t("ofTotal")} 3</div>
          {allowed.length>1&&<div style={{display:"flex",gap:11}}>
            {allowed.map(c=>{
              const l=LANGS.find(x=>x.c===c);
              return(<button key={c} onClick={()=>{SB.setLang(c);setLang(c);}} style={{border:"none",background:"none",cursor:"pointer",
                fontSize:12.5,color:lang===c?C.teal:C.text3,fontWeight:lang===c?600:400,padding:0}}>{l.n}</button>);
            })}
          </div>}
        </div>
        <div style={{height:3,background:C.line,borderRadius:3,marginBottom:26,overflow:"hidden"}}>
          <div style={{height:"100%",width:(step/3)*100+"%",background:C.teal,borderRadius:3,transition:"width .25s"}}/>
        </div>
        <div className="ns-panel" style={{padding:28,marginBottom:30}}>
          {step===1&&(<div>
            <div style={{fontSize:20,fontWeight:650,marginBottom:5,letterSpacing:"-.02em"}}>{t("location")}</div>
            <div style={{fontSize:13.5,color:C.text2,marginBottom:20}}>{t("locationSubtitle")}</div>
            <div style={{marginBottom:14}}><FieldLabel>{t("country")}</FieldLabel>
              <select value={country} onChange={e=>{
                setCountry(e.target.value);setProvince("");
                const ls=(COUNTRY_LANGS[e.target.value]||["en"]).filter(c=>READY.indexOf(c)>=0);
                if(ls.length&&ls.indexOf(lang)<0){SB.setLang(ls[0]);setLang(ls[0]);}
              }} className="ns-in" style={{cursor:"pointer"}}>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</select></div>
            <div style={{marginBottom:22}}>
              <FieldLabel>{country==="Canada"?t("province"):country==="United States"?t("state"):t("regionCity")}</FieldLabel>
              {country==="Canada"?(<select value={province} onChange={e=>setProvince(e.target.value)} className="ns-in" style={{cursor:"pointer"}}><option value="">{t("selectProvince")}</option>{CA_PROVINCES.map(p=><option key={p}>{p}</option>)}</select>)
                :country==="United States"?(<select value={province} onChange={e=>setProvince(e.target.value)} className="ns-in" style={{cursor:"pointer"}}><option value="">{t("selectState")}</option>{US_STATES.map(p=><option key={p}>{p}</option>)}</select>)
                :(<input value={province} onChange={e=>setProvince(e.target.value)} placeholder={t("enterRegion")} className="ns-in"/>)}
            </div>
            <button onClick={()=>setStep(2)} disabled={!province} className="ns-btn ns-btn-primary" style={{width:"100%"}}>{t("next")}</button>
          </div>)}
          {step===2&&(<div>
            <div style={{fontSize:20,fontWeight:650,marginBottom:5,letterSpacing:"-.02em"}}>{t("yourPharmacy")}</div>
            <div style={{fontSize:13.5,color:C.text2,marginBottom:6}}>{t("requiredNote")} <span style={{color:C.flag}}>*</span></div>
            <SectionLabel>{t("pharmacyInfoSection")}</SectionLabel>
            <div style={{marginBottom:14}}>
              <FieldLabel required>{t("pharmacyName")}</FieldLabel>
              <SearchableSelect key={"c-"+country} options={PHARMACY_CHAINS_BY_COUNTRY[country]||DEFAULT_CHAINS} value={pharmacyName} onChange={setPharmacyName} placeholder={t("startTyping")} required/>
            </div>
            <Field label={t("permitNumber")} value={permitNumber} onChange={setPermitNumber} placeholder={li.ph} num/>
            <AddressAutocomplete key={"a-"+country} value={pharmacyAddress} onChange={setPharmacyAddress} placeholder={t("pharmacyAddress")} hint={t("addressHint")} countryIso={COUNTRY_ISO[country]||""} province={province} required/>
            <div style={{marginBottom:14}}>
              <FieldLabel required>{t("pharmacyPhone")}</FieldLabel>
              <div style={{display:"flex",gap:8}}>
                <div className="ns-num" style={{padding:"9px 12px",borderRadius:6,border:"1px solid "+C.line,fontSize:13.5,background:C.bg,color:C.text2,flexShrink:0}}>{cc}</div>
                <input type="tel" value={pharmacyPhone} onChange={e=>setPharmacyPhone(fmtPhone(e.target.value.replace(/\D/g,"").slice(0,10)))} placeholder="514-000-0000" className="ns-in ns-num" style={{flex:1,borderColor:!pharmacyPhone.trim()?C.flagLine:C.line}}/>
              </div>
            </div>
            <Field label={t("pharmacyEmail")} value={pharmacyEmail} onChange={setPharmacyEmail} placeholder={t("emailPlaceholder")} type="email"/>
            <SectionLabel>{t("teamSection")}</SectionLabel>
            <Field label={t("pharmacistOwner")} value={pharmacistOwner} onChange={setPharmacistOwner} placeholder={t("ownerPlaceholder")} required/>
            <Field label={t("yourLicence")} value={licence} onChange={setLicence} placeholder={li.ph} required num
              hint={t("licenceWhy")}/>
            <SectionLabel>{t("softwareSection")}</SectionLabel>
            <div style={{marginBottom:14}}>
              <FieldLabel required>{t("dispensingSystem")}</FieldLabel>
              <SearchableSelect key={"d-"+country} options={DISPENSING_SYSTEMS[country]||DEFAULT_LIST} value={dispensingSystem} onChange={setDispensingSystem} placeholder={t("startTyping")} required/>
            </div>
            <div style={{marginBottom:20}}>
              <FieldLabel required>{t("inventorySystem")}</FieldLabel>
              <SearchableSelect key={"i-"+country} options={INVENTORY_SYSTEMS[country]||DEFAULT_LIST} value={inventorySystem} onChange={setInventorySystem} placeholder={t("startTyping")} required/>
            </div>
            <div style={{display:"flex",gap:9}}>
              <button onClick={()=>setStep(1)} className="ns-btn ns-btn-quiet" style={{flex:1}}>{t("back")}</button>
              <button onClick={()=>setStep(3)} className="ns-btn ns-btn-primary" style={{flex:2}}>{t("next")}</button>
            </div>
          </div>)}
          {step===3&&(<div>
            <div style={{fontSize:20,fontWeight:650,marginBottom:18,letterSpacing:"-.02em"}}>{t("planSection")}</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {[{v:"basic",lk:"basicLabel",dk:"basicDesc",pk:"basicPrice"},{v:"pro",lk:"proLabel",dk:"proDesc",pk:"proPrice"},{v:"enterprise",lk:"enterpriseLabel",dk:"enterpriseDesc",pk:"enterprisePrice"}].map(p=>(
                <button key={p.v} onClick={()=>setPlan(p.v)} style={{padding:"14px 16px",borderRadius:8,
                  border:"1px solid "+(plan===p.v?C.teal:C.line),background:plan===p.v?C.teal:C.paper,cursor:"pointer",textAlign:"left"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:12}}>
                    <div>
                      <div style={{fontSize:13.5,fontWeight:650,color:plan===p.v?"#fff":C.text}}>{t(p.lk)}</div>
                      <div style={{fontSize:12,color:plan===p.v?"rgba(255,255,255,.68)":C.text2,marginTop:2}}>{t(p.dk)}</div>
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
            {!ok&&<div style={{fontSize:12,color:C.text3,marginTop:10}}>
              {fr?"Complétez les champs obligatoires des étapes précédentes.":"Complete the required fields in the earlier steps."}
            </div>}
          </div>)}
        </div>
      </div>
    </div>
  );
}

function Dashboard({session,profile,member,onLogout,lang,setLang}){
  const [page,setPage]=useState("home");
  const email=session?.user?.email||"";
  const t=(k)=>tr(lang,k);
  const role=member?member.role:"owner";
  const allowed=(COUNTRY_LANGS[profile?.country]||["fr","en"]).filter(c=>READY.indexOf(c)>=0);
  const items=[
    {id:"home",label:t("dashboard")},{id:"inv",label:t("inventory")},{id:"reco",label:t("reconciliation")},
    {id:"history",label:t("history")},{id:"team",label:t("team")},{id:"audit",label:t("audit")},
    {id:"clinical",label:t("clinical")},{id:"pricing",label:t("plans")}
  ];
  const r=ROLES[role]||ROLES.pharmacist;
  return(
    <Shell items={items} page={page} setPage={setPage} lang={lang} setLang={setLang} allowedLangs={allowed}
      onLogout={onLogout} signOutLabel={t("signOut")} name={member?.full_name||email}
      sub={(lang==="fr"?r.fr:r.en)+(member?.licence?" · "+member.licence:"")}>
      {page==="home"&&<HomePage onNewReco={()=>setPage("reco")} email={email} lang={lang} profile={profile} session={session} member={member}/>}
      {page==="inv"&&<InventoryPage session={session} member={member} lang={lang} profile={profile}/>}
      {page==="reco"&&<RecoPage onBack={()=>setPage("home")} lang={lang} profile={profile} session={session} member={member} onGoInv={()=>setPage("inv")}/>}
      {page==="history"&&<HistoryPage session={session} member={member} lang={lang} profile={profile}/>}
      {page==="team"&&<TeamPage session={session} member={member} lang={lang} profile={profile}/>}
      {page==="audit"&&<AuditPage session={session} member={member} lang={lang}/>}
      {page==="clinical"&&<ClinicalPage profile={profile} member={member} lang={lang} session={session}/>}
      {page==="pricing"&&(
        <div style={{padding:"30px 34px",maxWidth:640}}>
          <H1 sub="Basic $49 · Pro $99 · Enterprise $249 CAD">{t("plans")}</H1>
          {profile?.plan&&<div className="ns-panel" style={{padding:20}}>
            <div style={{fontSize:12.5,color:C.text2,marginBottom:5}}>{lang==="fr"?"Forfait actuel":"Current plan"}</div>
            <div style={{fontSize:18,fontWeight:650,textTransform:"capitalize"}}>{profile.plan}</div>
            {profile.clinical_addon&&<div style={{marginTop:10}}><Tag tone="teal">{lang==="fr"?"Module clinique actif":"Clinical module active"}</Tag></div>}
            {!profile.verified&&<div style={{marginTop:10}}><Tag tone="warn">{lang==="fr"?"Licence en cours de vérification":"Licence being verified"}</Tag></div>}
          </div>}
        </div>
      )}
    </Shell>
  );
}

function HistoryPage({session,member,lang,profile}){
  const fr=lang==="fr";
  const pid=member?member.pharmacy_id:session.user.id;
  const role=member?member.role:"owner";
  const [cycles,setCycles]=useState([]);
  const [loading,setLoading]=useState(true);
  const [sel,setSel]=useState(null);
  useEffect(()=>{
    sbFetch("reconciliations?select=*&pharmacy_id=eq."+pid+"&order=completed_at.desc")
      .then(d=>{if(Array.isArray(d))setCycles(d);setLoading(false);}).catch(()=>setLoading(false));
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
        <button className="ns-noprint ns-btn ns-btn-quiet" onClick={()=>setSel(null)} style={{marginBottom:20,padding:"6px 13px",fontSize:12.5}}>{tr(lang,"back")}</button>
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
                  {[m.opening,m.received,m.dispensed,theo].map((v,j)=>(<td key={j} className="ns-num" style={{textAlign:"right"}}>{v||0}</td>))}
                  <td className="ns-num" style={{textAlign:"right",fontWeight:600}}>{m.physical!==""?m.physical:"—"}</td>
                  <td className="ns-num" style={{textAlign:"right",fontWeight:650,color:d===null?C.text3:d===0?C.ok:C.flag}}>
                    {d===null?"—":d===0?"0":(d>0?"+":"")+d}</td>
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
        {cycles.length} {cycles.length===1?"cycle":"cycles"}
      </H1>
      {loading?<div style={{color:C.text3}}>{fr?"Chargement":"Loading"}</div>:
       cycles.length===0?<div className="ns-panel" style={{padding:30,fontSize:13.5,color:C.text2,lineHeight:1.6}}>
          {fr?"Aucun cycle encore. Lancez une réconciliation pour créer le premier.":"No cycles yet. Run a reconciliation to create the first one."}
        </div>:(
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

function HomePage({onNewReco,email,lang,profile,session,member}){
  const fr=lang==="fr";
  const pid=member?member.pharmacy_id:session.user.id;
  const [cycles,setCycles]=useState([]);
  const [invCount,setInvCount]=useState(null);
  useEffect(()=>{
    sbFetch("reconciliations?select=*&pharmacy_id=eq."+pid+"&order=completed_at.desc&limit=5")
      .then(d=>{if(Array.isArray(d))setCycles(d);}).catch(()=>{});
    INV.list(pid,"").then(r=>setInvCount(r.length)).catch(()=>setInvCount(0));
  },[]);
  const total=cycles.length;
  const last=cycles[0];
  return(
    <div style={{padding:"30px 34px",maxWidth:900}}>
      <H1 sub={profile?.pharmacy_name||""}>{tr(lang,"welcomeMsg")}</H1>
      {profile&&!profile.verified&&<Note tone="warn">
        {fr?"Votre licence est en cours de vérification. NarcoSync fonctionne normalement en attendant."
           :"Your licence is being verified. NarcoSync works normally in the meantime."}
      </Note>}
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
          <div style={{fontSize:15,fontWeight:650,marginBottom:5}}>{tr(lang,"liveMsg")}</div>
          <div style={{fontSize:13.5,color:C.text2,lineHeight:1.55}}>{tr(lang,"liveSubMsg")}</div>
        </div>
      )}
      <button onClick={onNewReco} className="ns-btn ns-btn-primary" style={{padding:"13px 24px",fontSize:14}}>{tr(lang,"newReco")}</button>
    </div>
  );
}

function RecoTable({session,profile,member,onComplete,onGoInv,lang}){
  const fr=lang==="fr";
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
  function doPrint(mode){setPrintMode(mode);setTimeout(()=>{window.print();setTimeout(()=>setPrintMode("all"),500);},120);}
  async function save(){
    setSaving(true);
    const cycle={pharmacy_id:pid,pharmacy_name:profile?.pharmacy_name,dispensing_system:profile?.dispensing_system,
      inventory_system:profile?.inventory_system,molecules:JSON.stringify(mols),
      total_molecules:mols.length,total_discrepancies:totalDisc,completed_at:new Date().toISOString()};
    try{await sbFetch("reconciliations",{method:"POST",body:[cycle],prefer:"return=minimal"});}catch(e){}
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
          {gaps.length>0&&<button onClick={()=>doPrint("gaps")} className="ns-btn ns-btn-quiet" style={{color:C.flag,borderColor:C.flagLine}}>
            {fr?"Écarts à recompter":"Variances to recount"} ({gaps.length})</button>}
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
            <th style={{textAlign:"right",background:C.tealSoft,color:C.teal2}}>{fr?"Compté":"Counted"}</th>
            <th className="ns-noprint" style={{textAlign:"right"}}>{fr?"Écart":"Variance"}</th>
            <th>{fr?"Note":"Note"}</th><th className="ns-noprint"></th>
          </tr></thead>
          <tbody>
            {shown.map((m)=>{
              const t2=theo(m);const d=diff(m);
              return(
                <tr key={m.id} style={{background:d!==null&&d!==0?C.flagBg:"transparent"}}>
                  <td><input value={m.cup} onChange={e=>upd(m.id,"cup",e.target.value)} className="ns-cell ns-num" style={{width:84,fontSize:12}}/></td>
                  <td><input value={m.name} onChange={e=>upd(m.id,"name",e.target.value)} className="ns-cell" style={{width:166,fontWeight:600}}/></td>
                  <td><input value={m.strength} onChange={e=>upd(m.id,"strength",e.target.value)} className="ns-cell" style={{width:54}}/></td>
                  <td><input value={m.format} onChange={e=>upd(m.id,"format",e.target.value)} className="ns-cell" style={{width:68}}/></td>
                  <td><input value={m.din} onChange={e=>upd(m.id,"din",e.target.value)} className="ns-cell ns-num" style={{width:70,fontSize:12}}/></td>
                  <td className="ns-noprint" style={{textAlign:"right"}}><input type="number" value={m.opening} onChange={e=>upd(m.id,"opening",e.target.value)} className="ns-cell ns-num" style={{width:56,textAlign:"right"}} min="0"/></td>
                  <td className="ns-noprint" style={{textAlign:"right"}}><input type="number" value={m.received} onChange={e=>upd(m.id,"received",e.target.value)} className="ns-cell ns-num" style={{width:52,textAlign:"right"}} min="0"/></td>
                  <td className="ns-noprint" style={{textAlign:"right"}}><input type="number" value={m.dispensed} onChange={e=>upd(m.id,"dispensed",e.target.value)} className="ns-cell ns-num" style={{width:52,textAlign:"right"}} min="0"/></td>
                  <td className="ns-noprint ns-num" style={{textAlign:"right",fontWeight:650}}>{t2}</td>
                  {printMode==="gaps"&&<td className="ns-print-only ns-num" style={{textAlign:"right",fontWeight:650,color:C.flag}}>{d>0?"+":""}{d}</td>}
                  <td style={{textAlign:"right",background:"#F4FAFA"}}>
                    <input type="number" value={m.physical} onChange={e=>upd(m.id,"physical",e.target.value)}
                      className="ns-cell ns-num ns-noprint" placeholder="—" min="0"
                      style={{width:64,textAlign:"right",fontWeight:650,borderColor:C.teal}}/>
                    <span className="ns-print-only ns-writebox"></span>
                  </td>
                  <td className="ns-noprint ns-num" style={{textAlign:"right",fontWeight:650,color:d===null?C.text3:d===0?C.ok:C.flag}}>
                    {d===null?"—":d===0?"0":(d>0?"+":"")+d}</td>
                  <td>
                    <input value={m.notes} onChange={e=>upd(m.id,"notes",e.target.value)} className="ns-cell ns-noprint"
                      placeholder={d!==null&&d!==0?(fr?"Justification":"Reason"):""}
                      style={{width:116,borderColor:(d!==null&&d!==0&&!m.notes)?C.flagLine:C.line}}/>
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
        {fr?"Ajouter une ligne":"Add a row"}</button>
      {totalDisc>0&&<div className="ns-noprint"><Note tone="flag">
        {fr?"Imprimez la liste des écarts, recomptez, puis inscrivez une justification. Les écarts qui persistent après recomptage doivent être approuvés par un pharmacien.":"Print the variance list, recount, then write a reason. Variances that persist after a recount need pharmacist approval."}
      </Note></div>}
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

function RecoPage({onBack,lang,profile,session,member,onGoInv}){
  const fr=lang==="fr";
  const [step,setStep]=useState("table");
  const [result,setResult]=useState(null);
  if(step==="done"){
    return(
      <div style={{padding:"30px 34px",maxWidth:560}}>
        <div className="ns-panel" style={{padding:28}}>
          <div style={{fontSize:20,fontWeight:650,marginBottom:6,letterSpacing:"-.02em"}}>{tr(lang,"recoComplete")}</div>
          <div style={{fontSize:13.5,color:C.text2,marginBottom:16}}>{result?.totalMolecules} {fr?"produits":"products"}</div>
          <div style={{marginBottom:22}}>
            {result?.totalDisc>0
              ?<Tag tone="flag">{result.totalDisc} {fr?(result.totalDisc===1?"écart":"écarts"):(result.totalDisc===1?"variance":"variances")}</Tag>
              :<Tag tone="ok">{fr?"Tout balance":"All balanced"}</Tag>}
          </div>
          <button onClick={()=>{setStep("table");setResult(null);}} className="ns-btn ns-btn-primary">{tr(lang,"newRecoBtn")}</button>
        </div>
      </div>
    );
  }
  return(
    <div style={{padding:"30px 34px",maxWidth:1400}}>
      <button className="ns-noprint ns-btn ns-btn-quiet" onClick={onBack} style={{marginBottom:20,padding:"6px 13px",fontSize:12.5}}>{tr(lang,"back")}</button>
      <RecoTable session={session} profile={profile} member={member} onGoInv={onGoInv} lang={lang} onComplete={r=>{setResult(r);setStep("done");}}/>
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
    st.textContent=CSS;
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
        const d=await sbFetch("profiles?select=*&id=eq."+pid);
        if(Array.isArray(d)&&d.length>0){
          SB.saveProfile(d[0]);setProfile(d[0]);
          try{if(!localStorage.getItem("ns_lang")) setLang(getLang(d[0].language));}catch(e){}
        }
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
      timer=setTimeout(()=>{
        alert(lang==="fr"?"Session fermée après 5 minutes sans activité.":"Session closed after 5 minutes of inactivity.");
        logout();
      },IDLE_MS);
    }
    const evts=["mousemove","mousedown","keydown","scroll","touchstart","click"];
    evts.forEach(e=>window.addEventListener(e,reset,{passive:true}));
    reset();
    const rf=setInterval(()=>{refreshToken();},45*60*1000);
    return()=>{if(timer)clearTimeout(timer);clearInterval(rf);evts.forEach(e=>window.removeEventListener(e,reset));};
  },[session,lang]);

  if(!session) return <AuthScreen lang={lang} setLang={setLang} onAuth={s=>{SB.saveSession(s);setSession(s);if(s.user.email!==ADMIN_EMAIL)setLoading(true);}}/>;
  if(session.user.email===ADMIN_EMAIL) return <AdminDashboard session={session} onLogout={logout}/>;
  if(loading) return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg}}>
      <div style={{fontSize:13.5,color:C.text2}}>{lang==="fr"?"Chargement…":"Loading…"}</div>
    </div>
  );
  if(!profile&&!member) return <OnboardingWizard userEmail={session.user.email} lang={lang} setLang={setLang} onComplete={p=>{SB.saveProfile(p);setProfile(p);}} session={session}/>;
  return <Dashboard session={session} profile={profile} member={member} onLogout={logout} lang={lang} setLang={setLang}/>;
}
