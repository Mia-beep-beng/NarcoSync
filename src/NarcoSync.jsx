import React, { useState, useRef, useEffect } from "react";

const NS_URL="https://lqykpjgqbhaprbtafimi.supabase.co";
const NS_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeWtwamdxYmhhcHJidGFmaW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MzMzNjMsImV4cCI6MjA5OTMwOTM2M30.N2C5u-FmEqVyemYyqVlw64RQErQe7O-uGVzYulV8nOI";
try{localStorage.setItem("ns_url",NS_URL);localStorage.setItem("ns_key",NS_KEY);}catch(e){}

const IDLE_MS=5*60*1000;

const C = {
  navy:"#0F2744",blue:"#1E4D8C",sky:"#2E86DE",
  green:"#1A9E5F",red:"#D63031",orange:"#E67E22",
  light:"#F4F7FB",white:"#FFFFFF",grey:"#6B7280",border:"#E2E8F0",
};

const ADMIN_EMAIL = "mtrofin@icloud.com";

const ROLES={
  owner:{fr:"Pharmacien-propriétaire",en:"Pharmacist-owner",col:"#1E4D8C"},
  pharmacist:{fr:"Pharmacien",en:"Pharmacist",col:"#2E86DE"},
  technician:{fr:"Chef technicien",en:"Chief technician",col:"#E67E22"},
};
function can(role,action){
  if(role==="owner") return true;
  if(role==="pharmacist") return action!=="manage_team";
  if(role==="technician") return action==="view"||action==="count"||action==="print";
  return false;
}

const T = {
  en:{
    login:"Login",createAccount:"Create account",signIn:"Sign in →",createMyAccount:"Create my account →",
    restrictedAccess:"Restricted access · Confidential",fillAllFields:"Fill in all fields.",
    authFailed:"Authentication failed.",networkError:"Network error.",
    language:"Language",searchLanguage:"Search language",
    langSubtitle:"Type to search any language in the world",
    langPlaceholder:"Type to search… Français, Arabic, Spanish…",
    selected:"✓ Selected",next:"Next →",back:"← Back",launch:"🚀 Launch NarcoSync",saving:"Saving…",
    location:"Location",locationSubtitle:"Where is your pharmacy located?",
    country:"Country",province:"Province",state:"State",regionCity:"Region / City",
    selectProvince:"Select province…",selectState:"Select state…",enterRegion:"Enter your region or city",
    yourPharmacy:"Your Pharmacy",pharmacySubtitle:"Complete your pharmacy profile",
    pharmacyInfoSection:"📋 Pharmacy Info",teamSection:"👤 Team",planSection:"💳 Subscription Plan",
    softwareSection:"💻 Software Systems",
    pharmacyName:"Pharmacy chain / banner",permitNumber:"Permit / License number",
    pharmacyAddress:"Pharmacy address",pharmacyPhone:"Pharmacy phone",pharmacyEmail:"Pharmacy email",
    dispensingSystem:"Dispensing software",dispensingSystemHint:"Software that generates your dispensing records",
    dispensingSystemPlaceholder:"Search dispensing software…",
    inventorySystem:"Ordering / inventory system",inventorySystemHint:"Software used for stock ordering",
    inventorySystemPlaceholder:"Search inventory system…",
    pharmacistOwner:"Pharmacist-owner name",pharmacistEmail:"Pharmacist-owner email",
    managerName:"Your name (team lead / manager)",
    pharmacyPlaceholder:"Search chain or type custom name…",
    pharmacyNameHint:"e.g. Pharmaprix, Jean Coutu, Independent…",
    permitPlaceholder:"e.g. OPQ-12345",addressPlaceholder:"Start typing your address…",
    addressHint:"Type street number + name to search",
    phonePlaceholder:"514-000-0000",emailPlaceholder:"info@pharmacy.com",
    ownerPlaceholder:"Full name",ownerEmailPlaceholder:"owner@pharmacy.com",managerPlaceholder:"Your full name",
    stripeNote:"💳 Payment setup via Stripe after onboarding — no card required now.",
    requiredNote:"* Required fields",planRequired:"⚠️ Please select a plan to continue.",
    welcomeToNarco:"Welcome to NarcoSync",stepOf:"Step",ofTotal:"of",
    dashboard:"Dashboard",reconciliation:"Reconciliation",history:"History",
    inventory:"My inventory",team:"My team",
    clinical:"Clinical",plans:"Plans",signOut:"🔒 Sign out",loggedInAs:"LOGGED IN AS",
    welcomeMsg:"Welcome to NarcoSync 👋",liveMsg:"🎉 NarcoSync is live!",
    liveSubMsg:"Connected to Supabase · Ready for your first reconciliation",
    emptyState:"No cycles yet",emptyStateSub:"Complete your first reconciliation to see stats here.",
    newReco:"⚡ + New Reconciliation",newRecoTitle:"⚡ New Reconciliation",
    reconcileNow:"⚡ Proceed to reconciliation →",recoComplete:"Reconciliation complete!",
    newRecoBtn:"New reconciliation",
    clinicalDesc:"Calculators, minor ailments, global billing guide — coming soon.",
    plansDesc:"Basic $49 · Pro $99 · Enterprise $249 CAD/month.",
    basicLabel:"Basic",basicDesc:"1 pharmacy · Core reconciliation",basicPrice:"$49 CAD/mo",
    proLabel:"Pro",proDesc:"Up to 3 pharmacies · Clinical tools",proPrice:"$99 CAD/mo",
    enterpriseLabel:"Enterprise",enterpriseDesc:"Unlimited · API · Custom reporting",enterprisePrice:"$249 CAD/mo",
  },
  fr:{
    login:"Connexion",createAccount:"Créer un compte",signIn:"Se connecter →",createMyAccount:"Créer mon compte →",
    restrictedAccess:"Accès restreint · Confidentiel",fillAllFields:"Veuillez remplir tous les champs.",
    authFailed:"Échec de l'authentification.",networkError:"Erreur réseau.",
    language:"Langue",searchLanguage:"Rechercher une langue",
    langSubtitle:"Tapez pour rechercher n'importe quelle langue au monde",
    langPlaceholder:"Tapez pour chercher… Français, Arabe, Espagnol…",
    selected:"✓ Sélectionné",next:"Suivant →",back:"← Retour",launch:"🚀 Lancer NarcoSync",saving:"Enregistrement…",
    location:"Localisation",locationSubtitle:"Où est située votre pharmacie?",
    country:"Pays",province:"Province",state:"État",regionCity:"Région / Ville",
    selectProvince:"Sélectionner une province…",selectState:"Sélectionner un état…",enterRegion:"Entrez votre région ou ville",
    yourPharmacy:"Votre Pharmacie",pharmacySubtitle:"Complétez le profil de votre pharmacie",
    pharmacyInfoSection:"📋 Informations",teamSection:"👤 Équipe",planSection:"💳 Forfait",
    softwareSection:"💻 Logiciels",
    pharmacyName:"Bannière / chaîne pharmacie",permitNumber:"Numéro de permis / licence",
    pharmacyAddress:"Adresse de la pharmacie",pharmacyPhone:"Téléphone",pharmacyEmail:"Courriel de la pharmacie",
    dispensingSystem:"Logiciel de dispensation",dispensingSystemHint:"Logiciel qui génère vos dossiers de dispensation",
    dispensingSystemPlaceholder:"Chercher le logiciel de dispensation…",
    inventorySystem:"Système de commande / inventaire",inventorySystemHint:"Logiciel utilisé pour les commandes",
    inventorySystemPlaceholder:"Chercher le système d'inventaire…",
    pharmacistOwner:"Nom du pharmacien-propriétaire",pharmacistEmail:"Courriel du pharmacien-propriétaire",
    managerName:"Votre nom (chef d'équipe / gestionnaire)",
    pharmacyPlaceholder:"Chercher une bannière ou entrer un nom…",
    pharmacyNameHint:"ex. Pharmaprix, Jean Coutu, Indépendant…",
    permitPlaceholder:"ex. OPQ-12345",addressPlaceholder:"Commencez à taper votre adresse…",
    addressHint:"Tapez numéro + rue pour chercher",
    phonePlaceholder:"514-000-0000",emailPlaceholder:"info@pharmacie.com",
    ownerPlaceholder:"Nom complet",ownerEmailPlaceholder:"proprio@pharmacie.com",managerPlaceholder:"Votre nom complet",
    stripeNote:"💳 Paiement configuré via Stripe après l'inscription — aucune carte requise maintenant.",
    requiredNote:"* Champs obligatoires",planRequired:"⚠️ Veuillez sélectionner un forfait pour continuer.",
    welcomeToNarco:"Bienvenue sur NarcoSync",stepOf:"Étape",ofTotal:"sur",
    dashboard:"Tableau de bord",reconciliation:"Réconciliation",history:"Historique",
    inventory:"Mon inventaire",team:"Mon équipe",
    clinical:"Clinique",plans:"Forfaits",signOut:"🔒 Se déconnecter",loggedInAs:"CONNECTÉ EN TANT QUE",
    welcomeMsg:"Bienvenue sur NarcoSync 👋",liveMsg:"🎉 NarcoSync est en ligne!",
    liveSubMsg:"Connecté à Supabase · Prêt pour votre première réconciliation",
    emptyState:"Aucun cycle pour l'instant",emptyStateSub:"Complétez votre première réconciliation pour voir les statistiques ici.",
    newReco:"⚡ + Nouvelle réconciliation",newRecoTitle:"⚡ Nouvelle réconciliation",
    reconcileNow:"⚡ Procéder à la réconciliation →",recoComplete:"Réconciliation complète!",
    newRecoBtn:"Nouvelle réconciliation",
    clinicalDesc:"Calculateurs, affections mineures, guide de facturation — à venir.",
    plansDesc:"Basique 49$ · Pro 99$ · Entreprise 249$ CAD/mois.",
    basicLabel:"Basique",basicDesc:"1 pharmacie · Réconciliation principale",basicPrice:"49$ CAD/mois",
    proLabel:"Pro",proDesc:"Jusqu'à 3 pharmacies · Outils cliniques",proPrice:"99$ CAD/mois",
    enterpriseLabel:"Entreprise",enterpriseDesc:"Illimité · API · Rapports personnalisés",enterprisePrice:"249$ CAD/mois",
  }
};

function getLang(l){
  if(!l) return "en";
  if(l.startsWith("Français")||l.includes("Bilingual")||l.includes("Bilingue")) return "fr";
  return "en";
}

const DISPENSING_SYSTEMS={
  "Canada":["AssiStRx","RxPro","Gespar","Ubik","Reflex","Kroll","Datascan","Logibec","Purkinje","WinRx","Fillware","Nexxsys","Prodigy RX","Propel Rx","HealthWatch","Pharmaserv","Axys Pharmacy","MedAccess","Cerner Pharmacy","BD Pyxis (hospital)","Omnicell (hospital)","Other / Custom"],
  "United States":["QS/1 (NRx)","PioneerRx","Liberty Software","Rx30","ScriptPro","PDX","Computer-Rx","BestRx","McKesson EnterpriseRx","Intercom Plus","Epic Willow","Cerner Pharmacy","SuiteRx","FrameworkLTC","Winpharm","ARxIUM","Other / Custom"],
  "France":["Winpharma","Lgpi (Pharmagest)","Pharmagest Smart Rx","Isipharm","Pharmonet","Caducée","Ordoclic","Cegi","Propharm","Delta Informatique","Other / Custom"],
  "United Kingdom":["Rx Web (Cegedim)","Pharmacy Manager (EMIS Health)","SystmOne Pharmacy","Vision Pharmacy","Titan Pharmacy System","Positive Solutions","IPS Dispense","Other / Custom"],
  "Australia":["Fred Dispense (Fred IT)","Minfos","Corum Clear Dispense","Z Dispense","Simple Pharmacy System","Toniq","Other / Custom"],
  "Germany":["LAUER-FISCHER","IXOS","Pharmatechnik","ADG Apothekensoftware","Other / Custom"],
  "Switzerland":["Aeskulap","Other / Custom"],
  "Belgium":["Officine","Medimix","Other / Custom"],
};
const DEFAULT_DISPENSING=["Other / Custom"];

const INVENTORY_SYSTEMS={
  "Canada":["Matrix (Pharmaprix / Shoppers)","PharmaClik (McKesson / Proxim / IDA)","Gespar","MMS (Medication Management Systems)","Logibec","Kroll Inventory","WinRx Inventory","Datascan","McKesson Connect","Cardinal Health","SAP (chains / hospital)","Other / Custom"],
  "United States":["McKesson Connect","Cardinal Health","AmerisourceBergen","PioneerRx Inventory","QS/1 Inventory","ScriptPro Inventory","SAP","Other / Custom"],
  "France":["Pharmagest Inventory","Winpharma Stock","CERP","OCP (Ophrys)","Alliance Healthcare","Other / Custom"],
  "United Kingdom":["AAH Pharmaceuticals","Phoenix Medical","Accord Healthcare","EMIS Inventory","Rx Web Inventory","Other / Custom"],
  "Australia":["Fred Office (Fred IT)","Minfos Inventory","LOTS","Pharmacy Alliance","API (Australian Pharmaceutical Industries)","Other / Custom"],
  "Germany":["LAUER-FISCHER Warenwirtschaft","Noventi","Other / Custom"],
  "Switzerland":["Galexis","Voigt AG","Other / Custom"],
  "Belgium":["Multipharma Inventory","Alliance Healthcare Belgium","Other / Custom"],
};
const DEFAULT_INVENTORY=["Other / Custom"];

const COUNTRY_ISO={
  "Canada":"ca","United States":"us","France":"fr","Algeria":"dz","Argentina":"ar","Australia":"au","Austria":"at","Belgium":"be","Brazil":"br","Chile":"cl","China":"cn","Colombia":"co","Croatia":"hr","Czech Republic":"cz","Denmark":"dk","Egypt":"eg","Finland":"fi","Germany":"de","Greece":"gr","Hungary":"hu","India":"in","Indonesia":"id","Ireland":"ie","Israel":"il","Italy":"it","Japan":"jp","Jordan":"jo","Kenya":"ke","Lebanon":"lb","Luxembourg":"lu","Malaysia":"my","Mexico":"mx","Morocco":"ma","Netherlands":"nl","New Zealand":"nz","Nigeria":"ng","Norway":"no","Pakistan":"pk","Peru":"pe","Philippines":"ph","Poland":"pl","Portugal":"pt","Romania":"ro","Russia":"ru","Saudi Arabia":"sa","Senegal":"sn","Singapore":"sg","South Africa":"za","South Korea":"kr","Spain":"es","Sweden":"se","Switzerland":"ch","Thailand":"th","Tunisia":"tn","Turkey":"tr","Ukraine":"ua","United Arab Emirates":"ae","United Kingdom":"gb","Uruguay":"uy","Vietnam":"vn",
};
const COUNTRY_CODES={
  "Canada":"+1","United States":"+1","France":"+33","United Kingdom":"+44","Australia":"+61","Belgium":"+32","Germany":"+49","Switzerland":"+41","Algeria":"+213","Morocco":"+212","Tunisia":"+216","Senegal":"+221","Lebanon":"+961","Israel":"+972","Jordan":"+962","Egypt":"+20","Nigeria":"+234","Kenya":"+254","South Africa":"+27","Mexico":"+52","Brazil":"+55","Argentina":"+54","Chile":"+56","Colombia":"+57","Peru":"+51","China":"+86","Japan":"+81","South Korea":"+82","India":"+91","Pakistan":"+92","Indonesia":"+62","Malaysia":"+60","Philippines":"+63","Thailand":"+66","Vietnam":"+84","Singapore":"+65","Netherlands":"+31","Spain":"+34","Italy":"+39","Portugal":"+351","Poland":"+48","Romania":"+40","Czech Republic":"+420","Hungary":"+36","Sweden":"+46","Norway":"+47","Denmark":"+45","Finland":"+358","Ireland":"+353","Austria":"+43","Luxembourg":"+352","Croatia":"+385","Ukraine":"+380","Russia":"+7","Turkey":"+90","Saudi Arabia":"+966","United Arab Emirates":"+971","Other":"+",
};
const PROVINCE_COORDS={
  "Québec":{lat:46.8,lon:-71.2},"Ontario":{lat:51.2,lon:-85.3},"British Columbia":{lat:53.7,lon:-127.6},
  "Alberta":{lat:53.9,lon:-116.6},"Manitoba":{lat:56.4,lon:-98.7},"Saskatchewan":{lat:55.0,lon:-106.0},
  "Nova Scotia":{lat:44.7,lon:-63.7},"New Brunswick":{lat:46.5,lon:-66.5},
  "Newfoundland & Labrador":{lat:53.1,lon:-57.7},"Prince Edward Island":{lat:46.5,lon:-63.4},
};

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
};

const ALL_LANGUAGES=["Français","English","Bilingue / Bilingual","Arabic","Chinese (Simplified)","Dutch","German","Greek","Hindi","Italian","Japanese","Korean","Polish","Portuguese","Punjabi","Romanian","Russian","Spanish","Tagalog","Ukrainian","Urdu","Vietnamese","Other"];

const PHARMACY_CHAINS_BY_COUNTRY={
  "Canada":["Pharmaprix","Jean Coutu","Uniprix","Familiprix","Brunet","Proxim","IDA","Pharmasave","Lawtons","Rexall","Guardian","Medicine Shoppe","Shoppers Drug Mart","Walmart Pharmacy","Costco Pharmacy","Loblaw Pharmacy","Sobeys Pharmacy","London Drugs","PharmaChoice","Remedy'sRx","Co-op Pharmacy","Other / Independent"],
  "United States":["CVS Pharmacy","Walgreens","Rite Aid","Walmart Pharmacy","Costco Pharmacy","Kroger Pharmacy","Publix Pharmacy","Target Pharmacy","Health Mart","Good Neighbor Pharmacy","Medicine Shoppe","Other / Independent"],
  "France":["Pharmacie Lafayette","Pharmavie","Giropharm","PHR Pharmacies","Pharmodel","Welcoop","Alphega Pharmacie","Other / Independent"],
  "United Kingdom":["Boots","Lloyds Pharmacy","Well Pharmacy","Superdrug Pharmacy","Day Lewis Pharmacy","Rowlands Pharmacy","Other / Independent"],
  "Australia":["Chemist Warehouse","Priceline Pharmacy","Terry White Chemmart","Blooms The Chemist","Amcal","Guardian Pharmacy","Other / Independent"],
  "Belgium":["Multipharma","Newpharma","Other / Independent"],
  "Germany":["DocMorris","dm Pharmacy","Rossmann Pharmacy","Other / Independent"],
  "Switzerland":["Amavita","Sun Store","Coop Vitality","Zur Rose","Other / Independent"],
};
const DEFAULT_CHAINS=["Other / Independent"];
const COUNTRIES=["Canada","United States","France","Algeria","Argentina","Australia","Austria","Belgium","Brazil","Chile","China","Colombia","Croatia","Czech Republic","Denmark","Egypt","Finland","Germany","Greece","Hungary","India","Indonesia","Ireland","Israel","Italy","Japan","Jordan","Kenya","Lebanon","Luxembourg","Malaysia","Mexico","Morocco","Netherlands","New Zealand","Nigeria","Norway","Pakistan","Peru","Philippines","Poland","Portugal","Romania","Russia","Saudi Arabia","Senegal","Singapore","South Africa","South Korea","Spain","Sweden","Switzerland","Thailand","Tunisia","Turkey","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Vietnam","Other"];
const CA_PROVINCES=["Québec","Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland & Labrador","Nova Scotia","Ontario","Prince Edward Island","Saskatchewan","Northwest Territories","Nunavut","Yukon"];
const US_STATES=["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

const inputStyle={width:"100%",padding:"10px 12px",borderRadius:9,border:"1.5px solid #E2E8F0",fontSize:13,fontFamily:"inherit",boxSizing:"border-box",background:"#fff"};
const PLAN_COLORS={basic:{bg:"#EFF6FF",color:"#1E4D8C"},pro:{bg:"#F0FDF4",color:"#1A9E5F"},enterprise:{bg:"#FFF7ED",color:"#C2410C"}};
const PLAN_PRICE={basic:49,pro:99,enterprise:249};

function PlanBadge({plan}){
  if(!plan) return null;
  const s=PLAN_COLORS[plan]||{bg:"#F3F4F6",color:"#6B7280"};
  return <span style={{background:s.bg,color:s.color,fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:20,textTransform:"uppercase",letterSpacing:.5}}>{plan}</span>;
}
function RoleBadge({role,fr}){
  const r=ROLES[role]||ROLES.pharmacist;
  return <span style={{background:r.col+"18",color:r.col,fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:20}}>{fr?r.fr:r.en}</span>;
}

/* ===== SUPABASE REST ===== */

async function sbFetch(path,opts){
  const g=SB.get();
  const s=SB.getSession();
  const tok=(s&&s.access_token)?s.access_token:g.key;
  const o=opts||{};
  const h={"apikey":g.key,"Authorization":"Bearer "+tok,"Content-Type":"application/json"};
  if(o.prefer) h["Prefer"]=o.prefer;
  const r=await fetch(g.url+"/rest/v1/"+path,{method:o.method||"GET",headers:h,body:o.body?JSON.stringify(o.body):undefined});
  if(!r.ok){const t=await r.text();throw new Error("Supabase "+r.status+" - "+t.slice(0,200));}
  const txt=await r.text();
  return txt?JSON.parse(txt):[];
}

function isDiscontinued(v){
  const s=String(v||"").toLowerCase();
  return s.indexOf("disc")>=0||s.indexOf("cesse")>=0||s.indexOf("retir")>=0;
}
function cleanDin(d){return String(d||"").replace(/\D/g,"").trim();}
function cleanCup(v){return String(v||"").replace(/\s/g,"").trim();}

const MEM={
  async byEmail(email){
    const q="pharmacy_members?select=*&email=eq."+encodeURIComponent(email.toLowerCase().trim())+"&active=eq.true&limit=1";
    const r=await sbFetch(q);
    return r&&r.length?r[0]:null;
  },
  async list(pharmacyId){
    return await sbFetch("pharmacy_members?select=*&pharmacy_id=eq."+pharmacyId+"&order=created_at.asc");
  },
  async add(row){
    return await sbFetch("pharmacy_members",{method:"POST",body:[row],prefer:"return=representation"});
  },
  async update(id,patch){await sbFetch("pharmacy_members?id=eq."+id,{method:"PATCH",body:patch});},
  async remove(id){await sbFetch("pharmacy_members?id=eq."+id,{method:"DELETE"});},
  async linkUser(id,userId){await sbFetch("pharmacy_members?id=eq."+id,{method:"PATCH",body:{user_id:userId}});}
};

const AUDIT={
  async log(member,action,entity,entityId,details){
    if(!member) return;
    try{
      await sbFetch("audit_log",{method:"POST",body:[{
        user_id:member.user_id,
        action:action,
        entity:entity,
        entity_id:entityId?String(entityId):null,
        details:details||null,
        pharmacist_licence:member.licence||"—",
        pharmacist_name:member.full_name||member.email
      }],prefer:"return=minimal"});
    }catch(e){}
  },
  async list(userIds){
    if(!userIds||!userIds.length) return [];
    return await sbFetch("audit_log?select=*&user_id=in.("+userIds.join(",")+")&order=created_at.desc&limit=500");
  }
};

const CAT={
  async list(search){
    let q="drug_catalog?select=*&order=molecule.asc&limit=5000";
    if(search&&search.trim()){
      const s=encodeURIComponent("*"+search.trim()+"*");
      q+="&or=(molecule.ilike."+s+",din.ilike."+s+",cup.ilike."+s+")";
    }
    return await sbFetch(q);
  },
  async byDins(dins){
    if(!dins.length) return [];
    const out=[];
    for(let i=0;i<dins.length;i+=100){
      const chunk=dins.slice(i,i+100).filter(Boolean);
      if(!chunk.length) continue;
      const r=await sbFetch("drug_catalog?select=*&din=in.("+chunk.join(",")+")");
      r.forEach(x=>out.push(x));
    }
    return out;
  },
  async byCups(cups){
    if(!cups.length) return [];
    const out=[];
    for(let i=0;i<cups.length;i+=100){
      const chunk=cups.slice(i,i+100).filter(Boolean);
      if(!chunk.length) continue;
      const r=await sbFetch("drug_catalog?select=*&cup=in.("+chunk.join(",")+")");
      r.forEach(x=>out.push(x));
    }
    return out;
  },
  async upsertMany(rows){
    const clean=rows
      .filter(r=>r&&(r.description||r.molecule))
      .filter(r=>!isDiscontinued(r.status))
      .map(r=>({
        cup:cleanCup(r.cup)||null,
        molecule:String(r.description||r.molecule||"").trim(),
        strength:String(r.strength||"").trim()||null,
        format:String(r.format||"").trim()||null,
        din:cleanDin(r.din)||null,
        category:r.category||"narco",
        is_narcotic:true
      }));
    const seen={};const withDin=[];const noDin=[];
    clean.forEach(r=>{ if(r.din){ if(!seen[r.din]){seen[r.din]=1;withDin.push(r);} } else noDin.push(r); });
    let n=0;const B=200;
    for(let i=0;i<withDin.length;i+=B){
      const d=await sbFetch("drug_catalog?on_conflict=din",{method:"POST",body:withDin.slice(i,i+B),prefer:"resolution=merge-duplicates,return=representation"});
      n+=(d||[]).length;
    }
    for(let i=0;i<noDin.length;i+=B){
      const d=await sbFetch("drug_catalog",{method:"POST",body:noDin.slice(i,i+B),prefer:"return=representation"});
      n+=(d||[]).length;
    }
    return n;
  },
  async remove(id){await sbFetch("drug_catalog?id=eq."+id,{method:"DELETE"});}
};

const INV={
  async list(pharmacyId,search){
    let q="pharmacy_drugs?select=*&user_id=eq."+pharmacyId+"&order=molecule.asc&limit=5000";
    if(search&&search.trim()){
      const s=encodeURIComponent("*"+search.trim()+"*");
      q+="&or=(molecule.ilike."+s+",din.ilike."+s+",cup.ilike."+s+")";
    }
    return await sbFetch(q);
  },
  async addMany(pharmacyId,rows){
    const existing=await sbFetch("pharmacy_drugs?select=din,cup&user_id=eq."+pharmacyId+"&limit=5000");
    const haveDin={};const haveCup={};
    existing.forEach(e=>{if(e.din)haveDin[e.din]=1;if(e.cup)haveCup[e.cup]=1;});
    const body=[];
    rows.forEach(r=>{
      const din=cleanDin(r.din);
      const cup=cleanCup(r.cup);
      if(din&&haveDin[din]) return;
      if(!din&&cup&&haveCup[cup]) return;
      if(din) haveDin[din]=1;
      if(cup) haveCup[cup]=1;
      body.push({
        user_id:pharmacyId,
        pharmacy_id:pharmacyId,
        drug_id:r.drug_id||null,
        din:din||null,
        cup:cup||null,
        molecule:String(r.molecule||r.description||"").trim(),
        strength:String(r.strength||"").trim()||null,
        format:String(r.format||"").trim()||null,
        qty:Number(r.qty)||0,
        active:true
      });
    });
    if(!body.length) return 0;
    let n=0;const B=200;
    for(let i=0;i<body.length;i+=B){
      const d=await sbFetch("pharmacy_drugs",{method:"POST",body:body.slice(i,i+B),prefer:"return=representation"});
      n+=(d||[]).length;
    }
    return n;
  },
  async update(id,patch){await sbFetch("pharmacy_drugs?id=eq."+id,{method:"PATCH",body:patch});},
  async remove(id){await sbFetch("pharmacy_drugs?id=eq."+id,{method:"DELETE"});}
};

/* ===== PDF + AI ===== */

function loadPdfLib(){
  return new Promise((res,rej)=>{
    if(window.PDFLib) return res(window.PDFLib);
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
    s.onload=()=>{ if(window.PDFLib) res(window.PDFLib); else rej(new Error("pdf-lib introuvable")); };
    s.onerror=()=>rej(new Error("Chargement pdf-lib echoue"));
    document.head.appendChild(s);
  });
}
function b64FromBytes(bytes){
  let bin="";const chunk=8192;
  for(let i=0;i<bytes.length;i+=chunk) bin+=String.fromCharCode.apply(null,bytes.subarray(i,i+chunk));
  return btoa(bin);
}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

const PROMPT_CATALOG="Ce document est une liste de produits d'une pharmacie canadienne. Colonnes: CUP, description, format, commande (statut), DIN. "
  +"Pour CHAQUE ligne extrais ces valeurs. N'inclus PAS les lignes dont la commande indique discontinue, DISC, cesse ou retire. "
  +"Retourne UNIQUEMENT un tableau JSON valide, sans markdown ni backticks. "
  +"Format: [{\"cup\":\"\",\"description\":\"\",\"strength\":\"\",\"format\":\"\",\"status\":\"\",\"din\":\"\"}]";

const PROMPT_ORDER="Ce document est un bon de commande ou une liste d'inventaire d'une pharmacie canadienne. "
  +"Pour CHAQUE ligne de produit extrais: cup (code produit), description (nom du medicament), strength (force ex 5mg), format (ex 100 comp), din (8 chiffres si present sinon vide), qty (quantite recue ou en stock, un nombre). "
  +"Si une valeur est absente mets une chaine vide, et qty a 0 si aucune quantite. "
  +"Retourne UNIQUEMENT un tableau JSON valide, sans markdown ni backticks. "
  +"Format: [{\"cup\":\"\",\"description\":\"\",\"strength\":\"\",\"format\":\"\",\"din\":\"\",\"qty\":0}]";

async function callClaude(block,aiKey,prompt){
  const response=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":aiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:16000,messages:[{role:"user",content:[block,{type:"text",text:prompt}]}]})
  });
  if(!response.ok){const t=await response.text();throw new Error("API "+response.status+" - "+t.slice(0,150));}
  const data=await response.json();
  const text=(data.content||[]).map(i=>i.text||"").join("");
  const clean=text.replace(/```json|```/g,"").trim();
  const a=clean.indexOf("[");const b=clean.lastIndexOf("]");
  if(a===-1||b===-1) throw new Error("Reponse illisible");
  return JSON.parse(clean.slice(a,b+1));
}

async function callClaudeRetry(block,aiKey,prompt){
  for(let a=0;a<4;a++){
    try{ return await callClaude(block,aiKey,prompt); }
    catch(e){
      const m=String(e.message||"");
      const retry=m.indexOf("429")>=0||m.indexOf("529")>=0||m.indexOf("500")>=0||m.indexOf("503")>=0||m.indexOf("illisible")>=0;
      if(retry&&a<3){ await sleep(2000*Math.pow(2,a)); continue; }
      throw e;
    }
  }
}

async function refreshToken(){
  const s=SB.getSession();
  if(!s||!s.refresh_token) return null;
  const g=SB.get();
  try{
    const r=await fetch(g.url+"/auth/v1/token?grant_type=refresh_token",{
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":g.key},
      body:JSON.stringify({refresh_token:s.refresh_token})
    });
    const d=await r.json();
    if(d.access_token){SB.saveSession(d);return d;}
  }catch(e){}
  return null;
}

async function scanFile(file,aiKey,prompt,onProgress,ctrl){
  const isPDF=file.type==="application/pdf"||/\.pdf$/i.test(file.name);
  if(!isPDF){
    const base64=await new Promise((res,rej)=>{
      const rd=new FileReader();
      rd.onload=()=>res(rd.result.split(",")[1]);
      rd.onerror=rej;rd.readAsDataURL(file);
    });
    const rows=await callClaudeRetry({type:"image",source:{type:"base64",media_type:file.type||"image/jpeg",data:base64}},aiKey,prompt);
    const r=rows.filter(x=>!isDiscontinued(x.status));r.failedRanges="";return r;
  }
  const PDFLib=await loadPdfLib();
  const buf=await file.arrayBuffer();
  const src=await PDFLib.PDFDocument.load(buf,{ignoreEncryption:true});
  const total=src.getPageCount();
  const CHUNK=4,PARALLEL=3;
  const blocks=[];
  for(let s=0;s<total;s+=CHUNK) blocks.push([s,Math.min(s+CHUNK,total)]);
  let all=[];const failed=[];let done=0;const t0=Date.now();let cursor=0;

  function report(){
    if(!onProgress) return;
    const pct=Math.round(done/blocks.length*100);
    const el=(Date.now()-t0)/1000;
    const rate=done>0?done/el:0;
    const left=rate>0?Math.round((blocks.length-done)/rate):0;
    const m=Math.floor(left/60),s2=left%60;
    onProgress(pct+"% · "+Math.min(done*CHUNK,total)+"/"+total+" pages"+(left>0?" · ~"+(m?m+"m ":"")+s2+"s":"")+(failed.length?" · "+failed.length+" manqué(s)":""));
  }
  async function worker(){
    while(true){
      if(ctrl&&ctrl.cancelled) return;
      while(ctrl&&ctrl.paused){await sleep(400);if(ctrl.cancelled)return;}
      const my=cursor++;
      if(my>=blocks.length) return;
      const st=blocks[my][0],en=blocks[my][1];
      try{
        const out=await PDFLib.PDFDocument.create();
        const idx=[];for(let p=st;p<en;p++) idx.push(p);
        const cp=await out.copyPages(src,idx);
        cp.forEach(pg=>out.addPage(pg));
        const bytes=await out.save();
        let b64=b64FromBytes(bytes);
        const rows=await callClaudeRetry({type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}},aiKey,prompt);
        b64=null;
        if(Array.isArray(rows)) all=all.concat(rows);
      }catch(e){ failed.push((st+1)+"-"+en); }
      done++;report();
    }
  }
  report();
  const ws=[];
  for(let w=0;w<Math.min(PARALLEL,blocks.length);w++) ws.push(worker());
  await Promise.all(ws);
  if(failed.length===blocks.length) throw new Error("Toutes les pages ont echoue");
  const res=all.filter(x=>!isDiscontinued(x.status));
  res.failedRanges=failed.join(", ");
  return res;
}

/* ===== AI KEY MODAL ===== */
function AIKeyModal({onClose,onSaved}){
  const [k,setK]=useState("");
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#fff",borderRadius:16,padding:28,maxWidth:440,width:"90%",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
        <div style={{fontWeight:800,fontSize:16,color:C.navy,marginBottom:4}}>🤖 Clé API Claude</div>
        <div style={{fontSize:12,color:C.grey,marginBottom:16}}>Votre clé reste dans votre navigateur uniquement.</div>
        <input value={k} onChange={e=>setK(e.target.value)} placeholder="sk-ant-..." style={{...inputStyle,marginBottom:12,fontFamily:"monospace",fontSize:11}}/>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:10,borderRadius:9,border:"1.5px solid #E2E8F0",background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:C.grey}}>Annuler</button>
          <button onClick={()=>{SB.saveAIKey(k);onSaved();}} disabled={!k.startsWith("sk-")} style={{flex:2,padding:10,borderRadius:9,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12,color:"#fff",background:"linear-gradient(135deg,#7C3AED,#1E4D8C)",opacity:k.startsWith("sk-")?1:.4}}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

/* ===== VALIDATION TABLE ===== */
function ValidationTable({rows,setRows,showQty,onConfirm,onCancel,busy,fr,member}){
  function up(i,f,v){ setRows(rows.map((r,j)=>j===i?{...r,[f]:v}:r)); }
  function del(i){ setRows(rows.filter((r,j)=>j!==i)); }
  const th={textAlign:"left",padding:"8px 10px",fontSize:10,fontWeight:800,color:C.grey,background:"#F8FAFC",borderBottom:"2px solid #E2E8F0",whiteSpace:"nowrap"};
  const ni={padding:"5px 7px",borderRadius:6,border:"1.5px solid #E2E8F0",fontSize:12,fontFamily:"inherit",boxSizing:"border-box",width:"100%"};
  const td={padding:"4px 6px",borderBottom:"1px solid #F3F4F6"};
  const badDin=rows.filter(r=>cleanDin(r.din).length!==8).length;
  return(
    <div style={{background:"#FFFBEB",border:"2px solid #FCD34D",borderRadius:14,padding:18,marginBottom:20}}>
      <div style={{fontWeight:900,fontSize:15,color:"#92400E",marginBottom:4}}>
        ⚠️ {fr?"Validation requise par le pharmacien":"Pharmacist validation required"}
      </div>
      <div style={{fontSize:12,color:"#92400E",marginBottom:6}}>
        {rows.length} {fr?"lignes lues. Vérifiez et corrigez chaque valeur avant d'enregistrer.":"rows read. Check and correct each value before saving."}
        {badDin>0&&<span style={{fontWeight:800}}> · {badDin} DIN {fr?"à vérifier (≠ 8 chiffres)":"to check"}</span>}
      </div>
      {member&&<div style={{fontSize:11,color:"#92400E",marginBottom:14,fontWeight:700}}>
        ✍️ {fr?"Signé par":"Signed by"} : {member.full_name||member.email} · {fr?"licence":"licence"} {member.licence||"—"}
      </div>}
      <div style={{maxHeight:420,overflowY:"auto",background:"#fff",borderRadius:10,marginBottom:14}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:820}}>
          <thead><tr>
            <th style={th}>CUP</th><th style={th}>Description</th><th style={th}>{fr?"Force":"Strength"}</th>
            <th style={th}>Format</th><th style={th}>DIN</th>{showQty&&<th style={th}>{fr?"Qté":"Qty"}</th>}<th style={th}></th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>{
              const dinOk=cleanDin(r.din).length===8;
              return(
                <tr key={i}>
                  <td style={td}><input value={r.cup||""} onChange={e=>up(i,"cup",e.target.value)} style={{...ni,fontFamily:"monospace",width:110}}/></td>
                  <td style={td}><input value={r.description||r.molecule||""} onChange={e=>up(i,"description",e.target.value)} style={{...ni,minWidth:200}}/></td>
                  <td style={td}><input value={r.strength||""} onChange={e=>up(i,"strength",e.target.value)} style={{...ni,width:70}}/></td>
                  <td style={td}><input value={r.format||""} onChange={e=>up(i,"format",e.target.value)} style={{...ni,width:90}}/></td>
                  <td style={td}><input value={r.din||""} onChange={e=>up(i,"din",e.target.value)} style={{...ni,width:90,fontFamily:"monospace",borderColor:dinOk?"#E2E8F0":"#FCA5A5",background:dinOk?"#fff":"#FEF2F2"}}/></td>
                  {showQty&&<td style={td}><input type="number" value={r.qty||0} onChange={e=>up(i,"qty",e.target.value)} style={{...ni,width:64,textAlign:"center"}}/></td>}
                  <td style={td}><button onClick={()=>del(i)} style={{border:"none",background:"none",cursor:"pointer",color:C.red,fontSize:15}}>×</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={onConfirm} disabled={busy||rows.length===0} style={{padding:"11px 20px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:800,fontSize:13,color:"#fff",background:C.green,marginRight:8,opacity:busy?.5:1}}>
        ✅ {fr?"Valider et enregistrer":"Validate and save"}
      </button>
      <button onClick={onCancel} style={{padding:"11px 20px",borderRadius:10,border:"1.5px solid #E2E8F0",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,background:"#fff",color:C.grey}}>
        {fr?"Annuler":"Cancel"}
      </button>
    </div>
  );
}

/* ===== TEAM PAGE ===== */
function TeamPage({session,member,fr}){
  const pharmacyId=member?member.pharmacy_id:session.user.id;
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [err,setErr]=useState("");
  const [info,setInfo]=useState("");
  const [busy,setBusy]=useState(false);
  const [nw,setNw]=useState({email:"",full_name:"",licence:"",role:"pharmacist"});
  const isOwner=member&&member.role==="owner";

  async function load(){
    setLoading(true);setErr("");
    try{setRows(await MEM.list(pharmacyId));}catch(e){setErr(e.message||String(e));}
    setLoading(false);
  }
  useEffect(()=>{load();},[]);

  async function invite(){
    const email=nw.email.toLowerCase().trim();
    if(!email||!nw.full_name.trim()){setErr(fr?"Courriel et nom requis.":"Email and name required.");return;}
    if(nw.role!=="technician"&&!nw.licence.trim()){setErr(fr?"Le numéro de licence est obligatoire pour un pharmacien.":"Licence required for a pharmacist.");return;}
    setBusy(true);setErr("");setInfo("");
    try{
      await MEM.add({
        pharmacy_id:pharmacyId,
        user_id:null,
        email:email,
        full_name:nw.full_name.trim(),
        licence:nw.licence.trim()||null,
        role:nw.role,
        active:true
      });
      const g=SB.get();
      let mailed=false;
      try{
        const r=await fetch(g.url+"/auth/v1/signup",{
          method:"POST",
          headers:{"Content-Type":"application/json","apikey":g.key},
          body:JSON.stringify({email:email,password:"Temp-"+Math.random().toString(36).slice(2,10)+"!A9"})
        });
        if(r.ok) mailed=true;
      }catch(e){}
      try{
        await fetch(g.url+"/auth/v1/recover",{
          method:"POST",
          headers:{"Content-Type":"application/json","apikey":g.key},
          body:JSON.stringify({email:email,redirect_to:window.location.origin})
        });
        mailed=true;
      }catch(e){}
      await AUDIT.log(member,"invite_member","pharmacy_members",null,nw.role+" · "+email);
      setNw({email:"",full_name:"",licence:"",role:"pharmacist"});
      setInfo(mailed
        ?(fr?"Invitation envoyée à ":"Invitation sent to ")+email+(fr?" — la personne reçoit un courriel pour choisir son mot de passe.":" — they get an email to set their password.")
        :(fr?"Membre ajouté. Demandez-lui d'utiliser « Mot de passe oublié » pour activer son compte.":"Member added. Ask them to use \"Forgot password\" to activate."));
      await load();
    }catch(e){setErr(e.message||String(e));}
    setBusy(false);
  }

  async function toggleActive(r){
    try{
      await MEM.update(r.id,{active:!r.active});
      await AUDIT.log(member,r.active?"deactivate_member":"activate_member","pharmacy_members",r.id,r.email);
      await load();
    }catch(e){setErr(e.message||String(e));}
  }

  async function del(r){
    if(r.role==="owner"){setErr(fr?"Le propriétaire ne peut pas être retiré.":"Owner cannot be removed.");return;}
    if(!window.confirm(fr?("Retirer "+(r.full_name||r.email)+" de l'équipe?"):("Remove "+(r.full_name||r.email)+"?"))) return;
    try{
      await MEM.remove(r.id);
      await AUDIT.log(member,"remove_member","pharmacy_members",r.id,r.email);
      await load();
    }catch(e){setErr(e.message||String(e));}
  }

  const th={textAlign:"left",padding:"10px 12px",fontSize:11,fontWeight:800,color:C.grey,background:"#F8FAFC",borderBottom:"1.5px solid #E2E8F0",whiteSpace:"nowrap"};
  const td={padding:"10px 12px",fontSize:13,borderBottom:"1px solid #F3F4F6",color:C.navy};

  return(
    <div style={{padding:"28px 32px"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontWeight:900,fontSize:22,color:C.navy}}>👥 {fr?"Mon équipe":"My team"}</div>
        <div style={{fontSize:13,color:C.grey,marginTop:4}}>
          {rows.length} {fr?"membre(s) · chaque action est signée par la personne connectée":"member(s) · every action is signed by the logged-in person"}
        </div>
      </div>

      {!isOwner&&(
        <div style={{background:"#FFFBEB",border:"1.5px solid #FCD34D",borderRadius:10,padding:"12px 16px",fontSize:12,color:"#92400E",marginBottom:18}}>
          🔒 {fr?"Seul le pharmacien-propriétaire peut ajouter ou retirer des membres.":"Only the pharmacist-owner can add or remove members."}
        </div>
      )}

      {isOwner&&(
        <div style={{background:"#EFF6FF",border:"1.5px solid "+C.sky,borderRadius:12,padding:18,marginBottom:20}}>
          <div style={{fontWeight:800,fontSize:14,color:C.navy,marginBottom:12}}>➕ {fr?"Inviter un membre":"Invite a member"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1.4fr 1.2fr 1fr 1fr",gap:10,marginBottom:12}}>
            <div>
              <label style={{fontSize:10,fontWeight:700,color:C.grey,display:"block",marginBottom:3}}>{fr?"Courriel *":"Email *"}</label>
              <input value={nw.email} onChange={e=>setNw({...nw,email:e.target.value})} placeholder="prenom@pharmacie.com" style={{...inputStyle,fontSize:12,padding:"8px 10px"}}/>
            </div>
            <div>
              <label style={{fontSize:10,fontWeight:700,color:C.grey,display:"block",marginBottom:3}}>{fr?"Nom complet *":"Full name *"}</label>
              <input value={nw.full_name} onChange={e=>setNw({...nw,full_name:e.target.value})} placeholder={fr?"Prénom Nom":"First Last"} style={{...inputStyle,fontSize:12,padding:"8px 10px"}}/>
            </div>
            <div>
              <label style={{fontSize:10,fontWeight:700,color:C.grey,display:"block",marginBottom:3}}>{fr?"Rôle":"Role"}</label>
              <select value={nw.role} onChange={e=>setNw({...nw,role:e.target.value})} style={{...inputStyle,fontSize:12,padding:"8px 10px",cursor:"pointer"}}>
                <option value="pharmacist">{fr?ROLES.pharmacist.fr:ROLES.pharmacist.en}</option>
                <option value="technician">{fr?ROLES.technician.fr:ROLES.technician.en}</option>
                <option value="owner">{fr?ROLES.owner.fr:ROLES.owner.en}</option>
              </select>
            </div>
            <div>
              <label style={{fontSize:10,fontWeight:700,color:C.grey,display:"block",marginBottom:3}}>
                {fr?"Licence":"Licence"}{nw.role!=="technician"&&<span style={{color:C.red}}> *</span>}
              </label>
              <input value={nw.licence} onChange={e=>setNw({...nw,licence:e.target.value})} placeholder="OPQ-12345" style={{...inputStyle,fontSize:12,padding:"8px 10px"}}/>
            </div>
          </div>
          <button onClick={invite} disabled={busy} style={{padding:"10px 20px",borderRadius:9,border:"none",cursor:busy?"wait":"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,color:"#fff",background:C.sky,opacity:busy?.5:1}}>
            {busy?(fr?"Envoi…":"Sending…"):(fr?"✉️ Envoyer l'invitation":"✉️ Send invitation")}
          </button>
          <div style={{fontSize:11,color:C.grey,marginTop:8}}>
            {fr?"La personne reçoit un courriel pour choisir son propre mot de passe. Sa licence sera automatiquement attachée à chaque action qu'elle pose.":"They receive an email to set their own password."}
          </div>
        </div>
      )}

      {err&&<div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:8,padding:"10px 14px",fontSize:12,color:C.red,marginBottom:14}}>{err}</div>}
      {info&&<div style={{background:"#F0FDF4",border:"1px solid #86EFAC",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#166534",marginBottom:14}}>✅ {info}</div>}

      <div style={{overflowX:"auto",borderRadius:12,border:"1.5px solid #E2E8F0",background:"#fff"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:800}}>
          <thead><tr>
            <th style={th}>{fr?"Nom":"Name"}</th><th style={th}>{fr?"Courriel":"Email"}</th>
            <th style={th}>{fr?"Licence":"Licence"}</th><th style={th}>{fr?"Rôle":"Role"}</th>
            <th style={th}>{fr?"Statut":"Status"}</th><th style={th}></th>
          </tr></thead>
          <tbody>
            {loading&&<tr><td style={td} colSpan={6}>{fr?"Chargement…":"Loading…"}</td></tr>}
            {!loading&&rows.length===0&&<tr><td style={td} colSpan={6}>{fr?"Aucun membre.":"No members."}</td></tr>}
            {rows.map(r=>(
              <tr key={r.id} style={{opacity:r.active?1:.45}}>
                <td style={{...td,fontWeight:700}}>{r.full_name||"—"}</td>
                <td style={td}>{r.email}</td>
                <td style={{...td,fontFamily:"monospace",fontSize:12}}>{r.licence||"—"}</td>
                <td style={td}><RoleBadge role={r.role} fr={fr}/></td>
                <td style={td}>
                  {r.user_id
                    ?<span style={{color:C.green,fontSize:11,fontWeight:700}}>✅ {fr?"Actif":"Active"}</span>
                    :<span style={{color:C.orange,fontSize:11,fontWeight:700}}>⏳ {fr?"Invitation envoyée":"Invited"}</span>}
                </td>
                <td style={td}>
                  {isOwner&&r.role!=="owner"&&(
                    <span style={{display:"flex",gap:8}}>
                      <button onClick={()=>toggleActive(r)} style={{border:"1px solid #E2E8F0",background:"#fff",cursor:"pointer",fontSize:11,padding:"4px 10px",borderRadius:7,fontFamily:"inherit",color:C.grey}}>
                        {r.active?(fr?"Désactiver":"Disable"):(fr?"Activer":"Enable")}
                      </button>
                      <button onClick={()=>del(r)} style={{border:"none",background:"none",cursor:"pointer",color:C.red,fontSize:15}}>×</button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{marginTop:24,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {[
          {r:"owner",items:fr?["Tout l'accès","Gestion de l'équipe","Suppression et ajustement","Validation des écarts"]:["Full access","Team management","Delete and adjust","Approve variances"]},
          {r:"pharmacist",items:fr?["Inventaire et réconciliation","Validation des imports","Validation des écarts","Pas de gestion d'équipe"]:["Inventory and reconciliation","Validate imports","Approve variances","No team management"]},
          {r:"technician",items:fr?["Consultation seulement","Saisie du décompte physique","Impression des rapports","Aucune suppression"]:["View only","Enter physical counts","Print reports","No deletion"]},
        ].map(x=>(
          <div key={x.r} style={{background:"#fff",borderRadius:12,padding:16,border:"1.5px solid #E2E8F0",borderTop:"4px solid "+ROLES[x.r].col}}>
            <div style={{marginBottom:10}}><RoleBadge role={x.r} fr={fr}/></div>
            {x.items.map((it,i)=>(
              <div key={i} style={{fontSize:11,color:C.grey,marginBottom:5}}>· {it}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== AUDIT PAGE ===== */
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
      }catch(e){setErr(e.message||String(e));}
      setLoading(false);
    })();
  },[]);
  function fd(d){ if(!d) return "—"; return new Date(d).toLocaleDateString(fr?"fr-CA":"en-CA",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}); }
  const LABELS={
    invite_member:fr?"Invitation d'un membre":"Member invited",
    remove_member:fr?"Retrait d'un membre":"Member removed",
    activate_member:fr?"Activation d'un membre":"Member activated",
    deactivate_member:fr?"Désactivation d'un membre":"Member deactivated",
    delete_drug:fr?"Suppression d'un produit":"Product deleted",
    adjust_qty:fr?"Ajustement de quantité":"Quantity adjusted",
    import_inventory:fr?"Import validé":"Import validated",
    save_cycle:fr?"Cycle de réconciliation sauvegardé":"Reconciliation cycle saved",
    delete_cycle:fr?"Suppression d'un cycle":"Cycle deleted",
    add_drug:fr?"Ajout d'un produit":"Product added",
  };
  const th={textAlign:"left",padding:"10px 12px",fontSize:11,fontWeight:800,color:C.grey,background:"#F8FAFC",borderBottom:"1.5px solid #E2E8F0",whiteSpace:"nowrap"};
  const td={padding:"9px 12px",fontSize:12,borderBottom:"1px solid #F3F4F6",color:C.navy};
  return(
    <div style={{padding:"28px 32px"}}>
      <div style={{marginBottom:8}}>
        <div style={{fontWeight:900,fontSize:22,color:C.navy}}>📋 {fr?"Journal d'audit":"Audit log"}</div>
        <div style={{fontSize:13,color:C.grey,marginTop:4}}>
          {fr?"Chaque action est inscrite avec le nom, la licence, la date et l'heure. Le journal ne peut être ni modifié ni effacé.":"Every action is recorded. The log cannot be edited or deleted."}
        </div>
      </div>
      {err&&<div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:8,padding:"10px 14px",fontSize:12,color:C.red,margin:"14px 0"}}>{err}</div>}
      <div style={{overflowX:"auto",borderRadius:12,border:"1.5px solid #E2E8F0",background:"#fff",marginTop:16}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:800}}>
          <thead><tr>
            <th style={th}>{fr?"Date":"Date"}</th><th style={th}>{fr?"Action":"Action"}</th>
            <th style={th}>{fr?"Détail":"Detail"}</th><th style={th}>{fr?"Par":"By"}</th><th style={th}>{fr?"Licence":"Licence"}</th>
          </tr></thead>
          <tbody>
            {loading&&<tr><td style={td} colSpan={5}>{fr?"Chargement…":"Loading…"}</td></tr>}
            {!loading&&rows.length===0&&<tr><td style={td} colSpan={5}>{fr?"Aucune action enregistrée pour l'instant.":"No actions logged yet."}</td></tr>}
            {rows.map(r=>(
              <tr key={r.id}>
                <td style={{...td,whiteSpace:"nowrap",color:C.grey}}>{fd(r.created_at)}</td>
                <td style={{...td,fontWeight:700}}>{LABELS[r.action]||r.action}</td>
                <td style={td}>{r.details||"—"}</td>
                <td style={td}>{r.pharmacist_name||"—"}</td>
                <td style={{...td,fontFamily:"monospace"}}>{r.pharmacist_licence||"—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ===== CLIENT: MY INVENTORY ===== */
function InventoryPage({session,member,fr}){
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
  const [showKey,setShowKey]=useState(false);
  const [showAdd,setShowAdd]=useState(false);
  const [nw,setNw]=useState({cup:"",molecule:"",strength:"",format:"",din:"",qty:""});
  const [catQuery,setCatQuery]=useState("");
  const [catRes,setCatRes]=useState([]);
  const fileRef=useRef();
  const ctrlRef=useRef({paused:false,cancelled:false});

  async function load(s){
    setLoading(true);setErr("");
    try{setRows(await INV.list(pid,s));}catch(e){setErr(e.message||String(e));}
    setLoading(false);
  }
  useEffect(()=>{load("");},[]);

  async function searchCatalog(q){
    setCatQuery(q);
    if(!q||q.length<2){setCatRes([]);return;}
    try{ setCatRes((await CAT.list(q)).slice(0,20)); }catch(e){}
  }

  async function addFromCatalog(d){
    try{
      await INV.addMany(pid,[{drug_id:d.id,din:d.din,cup:d.cup,molecule:d.molecule,strength:d.strength,format:d.format,qty:0}]);
      await AUDIT.log(member,"add_drug","pharmacy_drugs",null,d.molecule+" · DIN "+(d.din||"—"));
      setCatQuery("");setCatRes([]);setInfo(fr?"Ajouté à votre inventaire.":"Added.");
      await load(search);
    }catch(e){setErr(e.message||String(e));}
  }

  async function addManual(){
    if(!nw.molecule.trim()){setErr(fr?"Le nom est requis.":"Name required.");return;}
    try{
      const din=cleanDin(nw.din);
      if(din){
        const hit=await CAT.byDins([din]);
        if(!hit.length) await CAT.upsertMany([{din:din,description:nw.molecule,strength:nw.strength,format:nw.format,cup:nw.cup}]);
      }
      await INV.addMany(pid,[{din:din,cup:nw.cup,molecule:nw.molecule,strength:nw.strength,format:nw.format,qty:nw.qty}]);
      await AUDIT.log(member,"add_drug","pharmacy_drugs",null,nw.molecule+" · DIN "+(din||"—")+" · qté "+(nw.qty||0));
      setNw({cup:"",molecule:"",strength:"",format:"",din:"",qty:""});setShowAdd(false);
      setInfo(fr?"Produit ajouté.":"Product added.");
      await load(search);
    }catch(e){setErr(e.message||String(e));}
  }

  async function handleFiles(e){
    const files=Array.from(e.target.files||[]);
    if(!files.length) return;
    const key=SB.getAIKey();
    if(!key){setShowKey(true);e.target.value="";return;}
    setErr("");setInfo("");setPaused(false);
    ctrlRef.current={paused:false,cancelled:false};
    let all=[];let bad="";
    for(let i=0;i<files.length;i++){
      try{
        const lbl=files.length>1?"["+(i+1)+"/"+files.length+"] ":"";
        const r=await scanFile(files[i],key,PROMPT_ORDER,(p)=>setBusy(lbl+p),ctrlRef.current);
        if(Array.isArray(r)) all=all.concat(r);
      }catch(e2){bad=files[i].name+" - "+(e2.message||String(e2));}
      if(ctrlRef.current.cancelled) break;
    }
    setBusy("");e.target.value="";
    if(bad) setErr(bad);
    if(all.length){
      setBusy(fr?"Recherche des DIN par CUP…":"Matching DIN by CUP…");
      let filled=0;
      try{
        const needCup=all.filter(r=>cleanDin(r.din).length!==8&&cleanCup(r.cup)).map(r=>cleanCup(r.cup));
        if(needCup.length){
          const hits=await CAT.byCups([...new Set(needCup)]);
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
      if(filled) setInfo((fr?"DIN retrouvés automatiquement par CUP : ":"DIN found by CUP: ")+filled);
      setPending(all.map(r=>({...r,din:cleanDin(r.din)})));
    }
    else if(!bad) setErr(fr?"Aucun produit détecté.":"No product detected.");
  }

  async function confirmPending(){
    setBusy(fr?"Enregistrement…":"Saving…");
    try{
      const dins=pending.map(r=>cleanDin(r.din)).filter(d=>d.length===8);
      const known=await CAT.byDins(dins);
      const map={};known.forEach(k=>{if(k.din)map[k.din]=k;});
      const newOnes=pending.filter(r=>{const d=cleanDin(r.din);return d.length===8&&!map[d];});
      if(newOnes.length) await CAT.upsertMany(newOnes);
      const nAdded=await INV.addMany(pid,pending.map(r=>{
        const d=cleanDin(r.din);
        const hit=map[d];
        return {drug_id:hit?hit.id:null,din:d,cup:r.cup||(hit?hit.cup:""),molecule:r.description||r.molecule||(hit?hit.molecule:""),strength:r.strength||(hit?hit.strength:""),format:r.format||(hit?hit.format:""),qty:r.qty};
      }));
      await AUDIT.log(member,"import_inventory","pharmacy_drugs",null,pending.length+(fr?" lignes validées · ":" lines validated · ")+nAdded+(fr?" ajoutées":" added"));
      setPending(null);setBusy("");
      setInfo((fr?"Inventaire mis à jour : ":"Inventory updated: ")+nAdded+(newOnes.length?(fr?" · nouveaux au catalogue : ":" · new to catalog: ")+newOnes.length:""));
      await load(search);
    }catch(e){setBusy("");setErr(e.message||String(e));}
  }

  async function saveQty(r,v){
    const val=Number(v)||0;
    if(val===(Number(r.qty)||0)) return;
    try{
      await INV.update(r.id,{qty:val,last_count_at:new Date().toISOString()});
      await AUDIT.log(member,"adjust_qty","pharmacy_drugs",r.id,(r.molecule||"")+" : "+(r.qty||0)+" → "+val);
      setInfo((fr?"Quantité mise à jour : ":"Qty updated: ")+(r.molecule||"")+" → "+val);
    }catch(e){setErr(e.message||String(e));}
  }

  async function del(r){
    if(!window.confirm(fr?"Retirer ce produit de votre inventaire?":"Remove this product?")) return;
    try{
      await INV.remove(r.id);
      await AUDIT.log(member,"delete_drug","pharmacy_drugs",r.id,(r.molecule||"")+" · DIN "+(r.din||"—"));
      setRows(rows.filter(x=>x.id!==r.id));
    }catch(e){setErr(e.message||String(e));}
  }

  const th={textAlign:"left",padding:"10px 12px",fontSize:11,fontWeight:800,color:C.grey,background:"#F8FAFC",borderBottom:"1.5px solid #E2E8F0",whiteSpace:"nowrap"};
  const td={padding:"8px 12px",fontSize:13,borderBottom:"1px solid #F3F4F6",color:C.navy};

  return(
    <div style={{padding:"28px 32px"}}>
      {showKey&&<AIKeyModal onClose={()=>setShowKey(false)} onSaved={()=>{setShowKey(false);fileRef.current?.click();}}/>}

      <div style={{display:"flex",flexWrap:"wrap",gap:12,alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div>
          <div style={{fontWeight:900,fontSize:22,color:C.navy}}>📦 {fr?"Mon inventaire":"My inventory"}</div>
          <div style={{fontSize:13,color:C.grey,marginTop:4}}>{rows.length} {fr?"produits détenus par votre pharmacie":"products held by your pharmacy"}</div>
        </div>
        {canEdit&&(
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFiles} style={{display:"none"}}/>
            <button onClick={()=>setShowAdd(!showAdd)} style={{padding:"10px 16px",borderRadius:10,border:"1.5px solid "+C.sky,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,color:C.sky,background:"#fff"}}>
              + {fr?"Ajout manuel":"Add manually"}
            </button>
            <button onClick={()=>{if(!SB.getAIKey()){setShowKey(true);}else{fileRef.current?.click();}}} disabled={busy?true:false} style={{padding:"10px 16px",borderRadius:10,border:"none",cursor:busy?"wait":"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,color:"#fff",background:"linear-gradient(135deg,#7C3AED,#5B21B6)"}}>
              🤖 {fr?"Scanner inventaire / bon d'achat":"Scan inventory / order"}
            </button>
          </div>
        )}
      </div>

      {!canEdit&&(
        <div style={{background:"#FFF7ED",border:"1.5px solid #FDBA74",borderRadius:10,padding:"12px 16px",fontSize:12,color:"#9A3412",marginBottom:18}}>
          👁 {fr?"Consultation seulement. Comme chef technicien, vous pouvez imprimer le rapport et saisir le décompte physique, mais pas modifier l'inventaire.":"View only. As chief technician you can print and enter counts, but not modify the inventory."}
        </div>
      )}

      {showAdd&&canEdit&&(
        <div style={{background:"#EFF6FF",border:"1.5px solid "+C.sky,borderRadius:12,padding:16,marginBottom:18}}>
          <div style={{fontWeight:800,fontSize:14,color:C.navy,marginBottom:10}}>🔍 {fr?"Chercher dans le catalogue":"Search the catalog"}</div>
          <input value={catQuery} onChange={e=>searchCatalog(e.target.value)} placeholder={fr?"Nom, DIN ou CUP…":"Name, DIN or CUP…"} style={{...inputStyle,marginBottom:10}}/>
          {catRes.length>0&&(
            <div style={{background:"#fff",borderRadius:10,maxHeight:200,overflowY:"auto",marginBottom:14}}>
              {catRes.map(d=>(
                <div key={d.id} onClick={()=>addFromCatalog(d)} style={{padding:"9px 12px",borderBottom:"1px solid #F3F4F6",cursor:"pointer",fontSize:12,display:"flex",justifyContent:"space-between",gap:10}}>
                  <span style={{fontWeight:700,color:C.navy}}>{d.molecule}</span>
                  <span style={{color:C.grey,fontFamily:"monospace"}}>{d.format||""} · {d.din||"—"}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{fontWeight:800,fontSize:14,color:C.navy,marginBottom:10,marginTop:6}}>✍️ {fr?"Ou saisir un produit absent du catalogue":"Or enter a product not in the catalog"}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:10}}>
            {[["cup","CUP"],["molecule",fr?"Description *":"Description *"],["strength",fr?"Force":"Strength"],["format","Format"],["din","DIN"],["qty",fr?"Qté reçue":"Qty"]].map(([k,l])=>(
              <div key={k}>
                <label style={{fontSize:10,fontWeight:700,color:C.grey,display:"block",marginBottom:3}}>{l}</label>
                <input value={nw[k]} onChange={e=>setNw({...nw,[k]:e.target.value})} style={{...inputStyle,fontSize:12,padding:"8px 10px",...(k==="qty"?{textAlign:"center",borderColor:C.sky}:{})}}/>
              </div>
            ))}
          </div>
          <button onClick={addManual} style={{padding:"9px 18px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,color:"#fff",background:C.sky}}>
            {fr?"Ajouter":"Add"}
          </button>
        </div>
      )}

      <input value={search} placeholder={fr?"Chercher dans mon inventaire…":"Search my inventory…"} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")load(search);}} style={{...inputStyle,maxWidth:420,marginBottom:16}}/>

      {busy&&(
        <div style={{background:"#F5F3FF",border:"1.5px solid #C4B5FD",borderRadius:10,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <span style={{fontSize:13,color:"#5B21B6",fontWeight:600}}>🤖 {busy}</span>
          <span style={{display:"flex",gap:8}}>
            <button onClick={()=>{ctrlRef.current.paused=!ctrlRef.current.paused;setPaused(ctrlRef.current.paused);}} style={{padding:"5px 12px",borderRadius:8,border:"1.5px solid #C4B5FD",background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,color:"#5B21B6"}}>{paused?"▶️ Reprendre":"⏸ Pause"}</button>
            <button onClick={()=>{ctrlRef.current.cancelled=true;}} style={{padding:"5px 12px",borderRadius:8,border:"1.5px solid #FCA5A5",background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,color:C.red}}>✕ Arrêter</button>
          </span>
        </div>
      )}
      {err&&<div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:8,padding:"10px 14px",fontSize:12,color:C.red,marginBottom:14}}>{err}</div>}
      {info&&<div style={{background:"#F0FDF4",border:"1px solid #86EFAC",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#166534",marginBottom:14}}>✅ {info}</div>}

      {pending&&<ValidationTable rows={pending} setRows={setPending} showQty={true} onConfirm={confirmPending} onCancel={()=>setPending(null)} busy={!!busy} fr={fr} member={member}/>}

      <div style={{overflowX:"auto",borderRadius:12,border:"1.5px solid #E2E8F0",background:"#fff"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:900}}>
          <thead><tr>
            <th style={th}>CUP</th><th style={th}>Description</th><th style={th}>{fr?"Force":"Strength"}</th><th style={th}>Format</th><th style={th}>DIN</th>
            <th style={{...th,background:"#EFF6FF",color:C.sky}}>🔵 {fr?"Qté actuelle":"Current qty"}</th>{canEdit&&<th style={th}></th>}
          </tr></thead>
          <tbody>
            {loading&&<tr><td style={td} colSpan={7}>{fr?"Chargement…":"Loading…"}</td></tr>}
            {!loading&&rows.length===0&&<tr><td style={td} colSpan={7}>{fr?"Inventaire vide.":"Empty."}</td></tr>}
            {rows.map(r=>(
              <tr key={r.id}>
                <td style={{...td,fontFamily:"monospace",fontSize:12}}>{r.cup||"—"}</td>
                <td style={{...td,fontWeight:700}}>{r.molecule||"—"}</td>
                <td style={td}>{r.strength||"—"}</td>
                <td style={td}>{r.format||"—"}</td>
                <td style={{...td,fontFamily:"monospace"}}>{r.din||"—"}</td>
                <td style={{...td,background:"#EFF6FF"}}>
                  {canEdit
                    ?<input type="number" defaultValue={r.qty||0} onBlur={e=>saveQty(r,e.target.value)}
                      style={{padding:"5px 7px",borderRadius:6,border:"2px solid "+C.sky,fontSize:12,textAlign:"center",fontWeight:700,background:"#fff",width:72,fontFamily:"inherit"}}/>
                    :<span style={{fontWeight:800,color:C.sky}}>{r.qty||0}</span>}
                </td>
                {canEdit&&<td style={td}><button onClick={()=>del(r)} style={{border:"none",background:"none",cursor:"pointer",color:C.red,fontSize:16}}>×</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length>0&&canEdit&&<div style={{fontSize:11,color:C.grey,marginTop:8}}>💡 {fr?"Modifiez la quantité et cliquez ailleurs — l'ajustement est enregistré au journal avec votre licence.":"Edit and click away — logged with your licence."}</div>}
    </div>
  );
}

/* ===== ADMIN CATALOG ===== */
function AdminCatalogPage(){
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [err,setErr]=useState("");
  const [warn,setWarn]=useState("");
  const [busy,setBusy]=useState("");
  const [paused,setPaused]=useState(false);
  const [pending,setPending]=useState(null);
  const [showKey,setShowKey]=useState(false);
  const fileRef=useRef();
  const ctrlRef=useRef({paused:false,cancelled:false});

  async function load(s){
    setLoading(true);setErr("");
    try{setRows(await CAT.list(s));}catch(e){setErr(e.message||String(e));}
    setLoading(false);
  }
  useEffect(()=>{load("");},[]);

  async function handleFiles(e){
    const files=Array.from(e.target.files||[]);
    if(!files.length) return;
    const key=SB.getAIKey();
    if(!key){setShowKey(true);e.target.value="";return;}
    setErr("");setWarn("");setPaused(false);
    ctrlRef.current={paused:false,cancelled:false};
    let all=[];let bad="";let skipped="";
    for(let i=0;i<files.length;i++){
      try{
        const lbl=files.length>1?"["+(i+1)+"/"+files.length+"] ":"";
        const r=await scanFile(files[i],key,PROMPT_CATALOG,(p)=>setBusy(lbl+p),ctrlRef.current);
        if(Array.isArray(r)) all=all.concat(r);
        if(r.failedRanges) skipped+=(skipped?" · ":"")+files[i].name+": "+r.failedRanges;
      }catch(e2){bad=files[i].name+" - "+(e2.message||String(e2));}
      if(ctrlRef.current.cancelled) break;
    }
    setBusy("");e.target.value="";
    if(bad)setErr(bad);
    if(skipped)setWarn("Pages non lues: "+skipped);
    if(all.length) setPending(all.map(r=>({...r,din:cleanDin(r.din)})));
    else if(!bad) setErr("Aucun produit detecte.");
  }

  async function confirmImport(){
    setBusy("Enregistrement…");
    try{
      const n=await CAT.upsertMany(pending);
      setPending(null);setBusy("");
      await load(search);
      alert("Importe : "+n);
    }catch(e){setBusy("");setErr(e.message||String(e));}
  }

  async function del(id){
    if(!window.confirm("Supprimer cette ligne?")) return;
    try{await CAT.remove(id);setRows(rows.filter(r=>r.id!==id));}catch(e){setErr(e.message||String(e));}
  }

  const th={textAlign:"left",padding:"10px 12px",fontSize:11,fontWeight:800,color:C.grey,background:"#F8FAFC",borderBottom:"1.5px solid #E2E8F0",whiteSpace:"nowrap"};
  const td={padding:"8px 12px",fontSize:13,borderBottom:"1px solid #F3F4F6",color:C.navy};

  return(
    <div style={{padding:"28px 32px"}}>
      {showKey&&<AIKeyModal onClose={()=>setShowKey(false)} onSaved={()=>{setShowKey(false);fileRef.current?.click();}}/>}
      <div style={{display:"flex",flexWrap:"wrap",gap:12,alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div>
          <div style={{fontWeight:900,fontSize:22,color:C.navy}}>📚 Drug catalog</div>
          <div style={{fontSize:13,color:C.grey,marginTop:4}}>{rows.length} produits · lignes discontinuées exclues</div>
        </div>
        <div>
          <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFiles} style={{display:"none"}}/>
          <button onClick={()=>{if(!SB.getAIKey()){setShowKey(true);}else{fileRef.current?.click();}}} disabled={busy?true:false} style={{padding:"10px 16px",borderRadius:10,border:"none",cursor:busy?"wait":"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,color:"#fff",background:"linear-gradient(135deg,#7C3AED,#5B21B6)"}}>
            {busy?"⏳ Import…":"🤖 Import scan"}
          </button>
        </div>
      </div>

      <input value={search} placeholder="Chercher description, DIN, CUP…" onChange={e=>setSearch(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")load(search);}} style={{...inputStyle,maxWidth:420,marginBottom:16}}/>

      {busy&&(
        <div style={{background:"#F5F3FF",border:"1.5px solid #C4B5FD",borderRadius:10,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <span style={{fontSize:13,color:"#5B21B6",fontWeight:600}}>🤖 {busy}</span>
          <span style={{display:"flex",gap:8}}>
            <button onClick={()=>{ctrlRef.current.paused=!ctrlRef.current.paused;setPaused(ctrlRef.current.paused);}} style={{padding:"5px 12px",borderRadius:8,border:"1.5px solid #C4B5FD",background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,color:"#5B21B6"}}>{paused?"▶️ Reprendre":"⏸ Pause"}</button>
            <button onClick={()=>{ctrlRef.current.cancelled=true;}} style={{padding:"5px 12px",borderRadius:8,border:"1.5px solid #FCA5A5",background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,color:C.red}}>✕ Arrêter</button>
          </span>
        </div>
      )}
      {err&&<div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:8,padding:"10px 14px",fontSize:12,color:C.red,marginBottom:14}}>{err}</div>}
      {warn&&<div style={{background:"#FFFBEB",border:"1px solid #FCD34D",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#92400E",marginBottom:14}}>⚠️ {warn}</div>}

      {pending&&<ValidationTable rows={pending} setRows={setPending} showQty={false} onConfirm={confirmImport} onCancel={()=>setPending(null)} busy={!!busy} fr={true}/>}

      <div style={{overflowX:"auto",borderRadius:12,border:"1.5px solid #E2E8F0",background:"#fff"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:800}}>
          <thead><tr><th style={th}>CUP</th><th style={th}>Description</th><th style={th}>Force</th><th style={th}>Format</th><th style={th}>DIN</th><th style={th}></th></tr></thead>
          <tbody>
            {loading&&<tr><td style={td} colSpan={6}>Chargement…</td></tr>}
            {!loading&&rows.length===0&&<tr><td style={td} colSpan={6}>Catalogue vide.</td></tr>}
            {rows.map(r=>(
              <tr key={r.id}>
                <td style={{...td,fontFamily:"monospace",fontSize:12}}>{r.cup||"—"}</td>
                <td style={{...td,fontWeight:700}}>{r.molecule}</td>
                <td style={td}>{r.strength||"—"}</td>
                <td style={td}>{r.format||"—"}</td>
                <td style={{...td,fontFamily:"monospace"}}>{r.din||"—"}</td>
                <td style={td}><button onClick={()=>del(r.id)} style={{border:"none",background:"none",cursor:"pointer",color:C.red,fontSize:16}}>×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminDashboard({session,onLogout}){
  const [page,setPage]=useState("overview");
  const [profiles,setProfiles]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [filterPlan,setFilterPlan]=useState("all");
  const [filterCountry,setFilterCountry]=useState("all");
  const [selected,setSelected]=useState(null);
  useEffect(()=>{
    const {url,key}=SB.get();
    fetch(url+"/rest/v1/profiles?select=*&order=created_at.desc",{headers:{"apikey":key,"Authorization":"Bearer "+session.access_token}})
      .then(r=>r.json()).then(data=>{if(Array.isArray(data))setProfiles(data);setLoading(false);}).catch(()=>setLoading(false));
  },[]);
  const mrr=profiles.reduce((s,p)=>s+(PLAN_PRICE[p.plan]||0),0);
  const planCounts={basic:profiles.filter(p=>p.plan==="basic").length,pro:profiles.filter(p=>p.plan==="pro").length,enterprise:profiles.filter(p=>p.plan==="enterprise").length};
  const countries=[...new Set(profiles.map(p=>p.country).filter(Boolean))].sort();
  const filtered=profiles.filter(p=>{
    const q=search.toLowerCase();
    const mS=!search||[p.pharmacy_name,p.email,p.pharmacist_owner,p.pharmacy_address].some(v=>v?.toLowerCase().includes(q));
    const mP=filterPlan==="all"||p.plan===filterPlan;
    const mC=filterCountry==="all"||p.country===filterCountry;
    return mS&&mP&&mC;
  });
  const nav=[{id:"overview",icon:"📊",label:"Overview"},{id:"pharmacies",icon:"🏥",label:"Pharmacies"},{id:"catalog",icon:"📚",label:"Drug catalog"},{id:"revenue",icon:"💰",label:"Revenue"}];
  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div style={{width:200,background:"linear-gradient(180deg,#0F2744,#1E4D8C)",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"20px 14px 12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{fontSize:22}}>💊</div>
            <div>
              <div style={{color:"#fff",fontWeight:900,fontSize:15}}>NarcoSync</div>
              <div style={{background:C.red,color:"#fff",fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:4,marginTop:2,display:"inline-block"}}>ADMIN</div>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,.07)",borderRadius:10,padding:"8px 10px"}}>
            <div style={{color:"rgba(255,255,255,.4)",fontSize:9}}>CONNECTED AS</div>
            <div style={{color:"#fff",fontSize:10,fontWeight:600,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{session.user.email}</div>
          </div>
        </div>
        <div style={{flex:1,padding:"0 8px"}}>
          {nav.map(item=>(
            <button key={item.id} onClick={()=>{setPage(item.id);setSelected(null);}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 10px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"left",fontSize:11,marginBottom:2,background:page===item.id?"rgba(46,134,222,.3)":"transparent",color:page===item.id?"#fff":"rgba(255,255,255,.45)",fontWeight:page===item.id?700:400}}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
        <div style={{padding:"10px 14px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
          <button onClick={onLogout} style={{width:"100%",padding:"8px 10px",borderRadius:10,border:"none",cursor:"pointer",background:"transparent",color:"rgba(255,255,255,.35)",fontSize:11,fontFamily:"inherit",textAlign:"left"}}>🔒 Sign out</button>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",background:C.light}}>
        {selected?<PharmacyDetail profile={selected} onBack={()=>setSelected(null)}/>:(
          <>
            {page==="overview"&&<AdminOverview profiles={profiles} mrr={mrr} planCounts={planCounts} countries={countries} loading={loading} onViewAll={()=>setPage("pharmacies")}/>}
            {page==="pharmacies"&&<AdminPharmacies profiles={filtered} total={profiles.length} search={search} setSearch={setSearch} filterPlan={filterPlan} setFilterPlan={setFilterPlan} filterCountry={filterCountry} setFilterCountry={setFilterCountry} countries={countries} loading={loading} onSelect={setSelected}/>}
            {page==="catalog"&&<AdminCatalogPage/>}
            {page==="revenue"&&<AdminRevenue profiles={profiles} mrr={mrr} planCounts={planCounts} loading={loading}/>}
          </>
        )}
      </div>
    </div>
  );
}

function AdminOverview({profiles,mrr,planCounts,countries,loading,onViewAll}){
  const recent=profiles.slice(0,5);
  return(
    <div style={{padding:"28px 32px"}}>
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:900,fontSize:22,color:C.navy}}>Admin Overview</div>
        <div style={{color:C.grey,fontSize:13,marginTop:4}}>NarcoSync · All pharmacies</div>
      </div>
      {loading?<div style={{textAlign:"center",padding:60,color:C.grey}}>Loading…</div>:(
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
            {[{icon:"🏥",label:"Total pharmacies",val:profiles.length,col:C.sky},{icon:"💰",label:"Est. MRR",val:"$"+mrr+" CAD",col:C.green},{icon:"🌍",label:"Countries",val:countries.length,col:"#7C3AED"},{icon:"⭐",label:"Pro + Enterprise",val:planCounts.pro+planCounts.enterprise,col:C.orange}].map(s=>(
              <div key={s.label} style={{background:"#fff",borderRadius:14,padding:18,boxShadow:"0 2px 10px rgba(0,0,0,.06)",borderTop:"4px solid "+s.col}}>
                <div style={{fontSize:24,marginBottom:8}}>{s.icon}</div>
                <div style={{fontSize:26,fontWeight:900,color:s.col}}>{s.val}</div>
                <div style={{fontSize:11,color:C.grey,marginTop:4}}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div style={{fontWeight:800,fontSize:14,color:C.navy}}>🕐 Recent signups</div>
              <button onClick={onViewAll} style={{fontSize:12,color:C.sky,fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>View all →</button>
            </div>
            {recent.length===0?<div style={{color:C.grey,fontSize:12}}>No pharmacies yet.</div>:recent.map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:i<recent.length-1?"1px solid #F3F4F6":"none"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{p.pharmacy_name||"—"}</div>
                  <div style={{fontSize:11,color:C.grey,marginTop:2}}>{p.email} · {p.country}</div>
                </div>
                <PlanBadge plan={p.plan}/>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AdminPharmacies({profiles,total,search,setSearch,filterPlan,setFilterPlan,filterCountry,setFilterCountry,countries,loading,onSelect}){
  const sel={padding:"8px 12px",borderRadius:8,border:"1.5px solid #E2E8F0",fontSize:12,fontFamily:"inherit",background:"#fff",cursor:"pointer"};
  return(
    <div style={{padding:"28px 32px"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontWeight:900,fontSize:22,color:C.navy}}>🏥 All Pharmacies</div>
        <div style={{color:C.grey,fontSize:13,marginTop:4}}>{total} registered · {profiles.length} shown</div>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{...inputStyle,maxWidth:280}}/>
        <select value={filterPlan} onChange={e=>setFilterPlan(e.target.value)} style={sel}>
          <option value="all">All plans</option><option value="basic">Basic</option><option value="pro">Pro</option><option value="enterprise">Enterprise</option>
        </select>
        <select value={filterCountry} onChange={e=>setFilterCountry(e.target.value)} style={sel}>
          <option value="all">All countries</option>{countries.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      {loading?<div style={{textAlign:"center",padding:60,color:C.grey}}>Loading…</div>:
       profiles.length===0?<div style={{background:"#fff",borderRadius:14,padding:40,textAlign:"center",color:C.grey}}>No pharmacies found.</div>:(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {profiles.map((p,i)=>(
            <div key={i} onClick={()=>onSelect(p)} style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 2px 10px rgba(0,0,0,.06)",cursor:"pointer",border:"1.5px solid transparent"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <div style={{fontWeight:800,fontSize:15,color:C.navy}}>{p.pharmacy_name||"—"}</div>
                  <div style={{fontSize:12,color:C.grey,marginTop:2}}>{p.email}</div>
                </div>
                <PlanBadge plan={p.plan}/>
              </div>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                {[{icon:"📍",val:[p.pharmacy_address,p.province,p.country].filter(Boolean).join(", ")||"—"},{icon:"👤",val:p.pharmacist_owner||"—"},{icon:"📞",val:p.pharmacy_phone||"—"}].map((it,j)=>(
                  <div key={j} style={{fontSize:11,color:C.grey}}><span style={{marginRight:4}}>{it.icon}</span>{it.val}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PharmacyDetail({profile:p,onBack}){
  const rows=[["Pharmacy","pharmacy_name"],["Email","email"],["Plan","plan"],["Country","country"],["Province","province"],["Address","pharmacy_address"],["Phone","pharmacy_phone"],["Permit #","permit_number"],["Pharmacist-owner","pharmacist_owner"],["Manager","owner_name"],["Dispensing system","dispensing_system"],["Inventory system","inventory_system"],["Language","language"]];
  return(
    <div style={{padding:"28px 32px"}}>
      <button onClick={onBack} style={{marginBottom:20,padding:"7px 14px",borderRadius:8,border:"1px solid #E2E8F0",background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:C.grey}}>← Back</button>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
        <div>
          <div style={{fontWeight:900,fontSize:20,color:C.navy}}>{p.pharmacy_name||"—"}</div>
          <div style={{fontSize:13,color:C.grey,marginTop:2}}>{p.email}</div>
        </div>
        <PlanBadge plan={p.plan}/>
      </div>
      <div style={{background:"#fff",borderRadius:14,padding:24,boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
        {rows.map(([label,key],i)=>(
          <div key={key} style={{display:"flex",padding:"10px 0",borderBottom:i<rows.length-1?"1px solid #F3F4F6":"none"}}>
            <div style={{width:180,fontSize:11,fontWeight:700,color:C.grey,flexShrink:0}}>{label}</div>
            <div style={{fontSize:13,color:C.navy}}>{key==="plan"?<PlanBadge plan={p[key]}/>:(p[key]||<span style={{color:"#D1D5DB"}}>—</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminRevenue({profiles,mrr,planCounts,loading}){
  const arr=[{k:"basic",price:49,col:C.sky},{k:"pro",price:99,col:C.green},{k:"enterprise",price:249,col:C.orange}];
  const arr2=[{label:"Monthly (MRR)",val:"$"+mrr},{label:"Annual (ARR)",val:"$"+(mrr*12)},{label:"Avg per pharmacy",val:profiles.length?"$"+(mrr/profiles.length).toFixed(0):"—"}];
  return(
    <div style={{padding:"28px 32px"}}>
      <div style={{fontWeight:900,fontSize:22,color:C.navy,marginBottom:4}}>💰 Revenue</div>
      <div style={{color:C.grey,fontSize:13,marginBottom:24}}>Estimated based on plan subscriptions</div>
      {loading?<div style={{textAlign:"center",padding:60,color:C.grey}}>Loading…</div>:(
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:28}}>
            {arr2.map(s=>(
              <div key={s.label} style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 2px 10px rgba(0,0,0,.06)",borderTop:"4px solid "+C.green}}>
                <div style={{fontSize:28,fontWeight:900,color:C.green}}>{s.val}</div>
                <div style={{fontSize:12,color:C.grey,marginTop:6}}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#fff",borderRadius:14,padding:24,boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
            <div style={{fontWeight:800,fontSize:14,color:C.navy,marginBottom:20}}>Breakdown by plan</div>
            {arr.map(p=>(
              <div key={p.k} style={{marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><PlanBadge plan={p.k}/><span style={{fontSize:12,color:C.grey}}>{planCounts[p.k]} × ${p.price}/mo</span></div>
                  <span style={{fontWeight:800,fontSize:13,color:C.navy}}>${planCounts[p.k]*p.price}/mo</span>
                </div>
                <div style={{height:8,background:"#F3F4F6",borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:mrr?((planCounts[p.k]*p.price)/mrr*100)+"%":"0%",background:p.col,borderRadius:4}}/>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FieldLabel({children,required}){
  return <label style={{fontSize:11,fontWeight:700,color:"#6B7280",display:"block",marginBottom:4}}>{children}{required&&<span style={{color:"#D63031",marginLeft:2}}>*</span>}</label>;
}
function Field({label,value,onChange,placeholder,type="text",hint,required}){
  return(
    <div style={{marginBottom:13}}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{...inputStyle,border:required&&!value.trim()?"1.5px solid #FCA5A5":"1.5px solid #E2E8F0"}}/>
      {hint&&<div style={{fontSize:10,color:"#9CA3AF",marginTop:3}}>{hint}</div>}
    </div>
  );
}
function SectionLabel({children}){
  return <div style={{fontSize:10,fontWeight:800,color:"#2E86DE",letterSpacing:1,marginBottom:10,marginTop:16,textTransform:"uppercase"}}>{children}</div>;
}
function formatLocalPhone(d){
  if(!d) return "";
  if(d.length<=3) return d;
  if(d.length<=6) return d.slice(0,3)+"-"+d.slice(3);
  return d.slice(0,3)+"-"+d.slice(3,6)+"-"+d.slice(6,10);
}
function PhoneField({label,value,onChange,countryCode,required}){
  const code=countryCode||"+1";
  function handle(v){onChange(formatLocalPhone(v.replace(/\D/g,"").slice(0,10)));}
  return(
    <div style={{marginBottom:13}}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div style={{display:"flex",gap:8}}>
        <div style={{padding:"10px 12px",borderRadius:9,border:"1.5px solid #E2E8F0",fontSize:13,background:"#EFF6FF",color:"#1E4D8C",fontWeight:800,whiteSpace:"nowrap",flexShrink:0}}>{code}</div>
        <input type="tel" value={value} onChange={e=>handle(e.target.value)} placeholder="514-000-0000" style={{...inputStyle,flex:1,border:required&&!value.trim()?"1.5px solid #FCA5A5":"1.5px solid #E2E8F0"}}/>
      </div>
    </div>
  );
}

function AddressAutocomplete({value,onChange,placeholder,hint,countryIso,province,required}){
  const [query,setQuery]=useState(value||"");
  const [results,setResults]=useState([]);
  const [open,setOpen]=useState(false);
  const [dropPos,setDropPos]=useState({top:0,left:0,width:300});
  const inputRef=useRef();const dropRef=useRef();const timer=useRef();
  useEffect(()=>{
    function outside(e){const i=inputRef.current&&inputRef.current.contains(e.target);const d=dropRef.current&&dropRef.current.contains(e.target);if(!i&&!d)setOpen(false);}
    document.addEventListener("mousedown",outside);return()=>document.removeEventListener("mousedown",outside);
  },[]);
  function updatePos(){if(inputRef.current){const r=inputRef.current.getBoundingClientRect();setDropPos({top:r.bottom+4,left:r.left,width:r.width});}}
  function handleInput(val){
    setQuery(val);onChange(val);clearTimeout(timer.current);
    if(val.length<3){setResults([]);setOpen(false);return;}
    updatePos();
    timer.current=setTimeout(async()=>{
      try{
        const params=new URLSearchParams({q:val,limit:7,lang:"fr"});
        if(countryIso) params.set("countrycode",countryIso);
        const co=PROVINCE_COORDS[province];
        if(co){params.set("lat",co.lat);params.set("lon",co.lon);}
        const r=await fetch("https://photon.komoot.io/api/?"+params);
        const data=await r.json();
        const f=(data.features||[]).filter(x=>x.properties&&(x.properties.street||x.properties.name));
        setResults(f);if(f.length){updatePos();setOpen(true);}
      }catch{}
    },400);
  }
  function select(f){
    const p=f.properties;const parts=[];
    if(p.housenumber) parts.push(p.housenumber);
    if(p.street||p.name) parts.push(p.street||p.name);
    if(p.city||p.locality) parts.push(p.city||p.locality);
    if(p.state) parts.push(p.state);if(p.postcode) parts.push(p.postcode);
    const a=parts.join(", ")||p.name||"";setQuery(a);onChange(a);setOpen(false);setResults([]);
  }
  return(
    <div style={{marginBottom:13}}>
      <FieldLabel required={required}>📍 {placeholder}</FieldLabel>
      <input ref={inputRef} value={query} onChange={e=>handleInput(e.target.value)} onFocus={()=>{if(results.length){updatePos();setOpen(true);}}}
        placeholder={placeholder} style={{...inputStyle,border:required&&!value.trim()?"1.5px solid #FCA5A5":"1.5px solid #E2E8F0"}} autoComplete="off"/>
      {open&&results.length>0&&(
        <div ref={dropRef} style={{position:"fixed",top:dropPos.top,left:dropPos.left,width:dropPos.width,background:"#fff",border:"1.5px solid #E2E8F0",borderRadius:10,boxShadow:"0 8px 28px rgba(0,0,0,.2)",zIndex:9999,maxHeight:240,overflowY:"auto"}}>
          {results.map((f,i)=>{const p=f.properties;const main=(p.housenumber?p.housenumber+" ":"")+(p.street||p.name||"");const sub=[p.city||p.locality,p.state,p.postcode].filter(Boolean).join(", ");
            return(<div key={i} onClick={()=>select(f)} style={{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid #E2E8F0"}}>
              <div style={{fontSize:13,fontWeight:600,color:"#0F2744"}}>{main}</div>
              <div style={{fontSize:11,color:"#6B7280",marginTop:2}}>{sub}</div>
            </div>);})}
        </div>
      )}
      {hint&&<div style={{fontSize:10,color:"#9CA3AF",marginTop:3}}>{hint}</div>}
    </div>
  );
}

function SearchableSelect({options,value,onChange,placeholder,required}){
  const [query,setQuery]=useState(value||"");
  const [open,setOpen]=useState(false);
  const [dropPos,setDropPos]=useState({top:0,left:0,width:300});
  const inputRef=useRef();const dropRef=useRef();
  useEffect(()=>{
    function outside(e){const i=inputRef.current&&inputRef.current.contains(e.target);const d=dropRef.current&&dropRef.current.contains(e.target);if(!i&&!d)setOpen(false);}
    document.addEventListener("mousedown",outside);return()=>document.removeEventListener("mousedown",outside);
  },[]);
  function updatePos(){if(inputRef.current){const r=inputRef.current.getBoundingClientRect();setDropPos({top:r.bottom+4,left:r.left,width:r.width});}}
  const filtered=options.filter(o=>!query||o.toLowerCase().includes(query.toLowerCase())).slice(0,20);
  return(
    <div>
      <input ref={inputRef} value={query} onChange={e=>{setQuery(e.target.value);onChange(e.target.value);updatePos();setOpen(true);}}
        onFocus={()=>{updatePos();setOpen(true);}} placeholder={placeholder}
        style={{...inputStyle,border:required&&!value.trim()?"1.5px solid #FCA5A5":"1.5px solid #E2E8F0"}} autoComplete="off"/>
      {open&&filtered.length>0&&(
        <div ref={dropRef} style={{position:"fixed",top:dropPos.top,left:dropPos.left,width:dropPos.width,background:"#fff",border:"1.5px solid #E2E8F0",borderRadius:10,boxShadow:"0 8px 28px rgba(0,0,0,.2)",zIndex:9999,maxHeight:220,overflowY:"auto"}}>
          {filtered.map(o=>(
            <div key={o} onClick={()=>{onChange(o);setQuery(o);setOpen(false);}} style={{padding:"10px 14px",cursor:"pointer",fontSize:13,color:"#0F2744",borderBottom:"1px solid #E2E8F0",background:value===o?"#EFF6FF":"#fff"}}>{o}</div>
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
  const [recoveryToken,setRecoveryToken]=useState(null);
  const [np1,setNp1]=useState("");
  const [np2,setNp2]=useState("");
  const t=(k)=>T.en[k];

  useEffect(()=>{
    const h=window.location.hash||"";
    if(h.indexOf("access_token")>=0&&h.indexOf("type=recovery")>=0){
      const p=new URLSearchParams(h.replace(/^#/,""));
      const tok=p.get("access_token");
      if(tok){setRecoveryToken(tok);setMode("reset");}
    }
  },[]);

  async function submit(){
    if(!email||!pwd){setErr(t("fillAllFields"));return;}
    setBusy(true);setErr("");setMsg("");
    const {url,key}=SB.get();
    const ep=mode==="login"?url+"/auth/v1/token?grant_type=password":url+"/auth/v1/signup";
    try{
      const r=await fetch(ep,{method:"POST",headers:{"Content-Type":"application/json","apikey":key},body:JSON.stringify({email,password:pwd})});
      const d=await r.json();
      if(d.access_token){SB.saveSession(d);onAuth(d);}
      else setErr((d.error_description||d.msg||d.message||t("authFailed"))+" ["+r.status+"]");
    }catch(e){setErr(t("networkError")+" - "+(e.message||""));}
    setBusy(false);
  }

  async function sendRecovery(){
    if(!email){setErr("Entrez votre courriel.");return;}
    setBusy(true);setErr("");setMsg("");
    const {url,key}=SB.get();
    try{
      const r=await fetch(url+"/auth/v1/recover",{method:"POST",headers:{"Content-Type":"application/json","apikey":key},body:JSON.stringify({email:email,redirect_to:window.location.origin})});
      if(r.ok) setMsg("Courriel envoyé à "+email+".");
      else{const d=await r.json();setErr((d.msg||d.message||"Erreur")+" ["+r.status+"]");}
    }catch(e){setErr("Network error - "+(e.message||""));}
    setBusy(false);
  }

  async function applyNewPassword(){
    if(np1.length<6){setErr("Minimum 6 caractères.");return;}
    if(np1!==np2){setErr("Les deux mots de passe ne correspondent pas.");return;}
    setBusy(true);setErr("");setMsg("");
    const {url,key}=SB.get();
    try{
      const r=await fetch(url+"/auth/v1/user",{method:"PUT",headers:{"Content-Type":"application/json","apikey":key,"Authorization":"Bearer "+recoveryToken},body:JSON.stringify({password:np1})});
      const d=await r.json();
      if(r.ok){
        setMsg("Mot de passe mis à jour. Connectez-vous maintenant.");
        setRecoveryToken(null);setMode("login");setNp1("");setNp2("");setPwd("");
        try{window.history.replaceState({},"",window.location.pathname);}catch(e){}
      } else setErr((d.msg||d.message||"Erreur")+" ["+r.status+"]");
    }catch(e){setErr("Network error - "+(e.message||""));}
    setBusy(false);
  }

  const inp={width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid "+C.border,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"};

  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"linear-gradient(135deg,#0F2744,#1E4D8C)"}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:40,marginBottom:10}}>💊</div>
          <div style={{color:"#fff",fontWeight:900,fontSize:26}}>NarcoSync</div>
          <div style={{color:"rgba(255,255,255,.5)",fontSize:12,marginTop:4}}>{t("restrictedAccess")}</div>
        </div>
        <div style={{background:"#fff",borderRadius:18,padding:26,boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
          {mode==="reset"?(
            <div>
              <div style={{fontWeight:800,fontSize:16,color:C.navy,marginBottom:4}}>🔑 Nouveau mot de passe</div>
              <div style={{fontSize:12,color:C.grey,marginBottom:18}}>Choisissez un nouveau mot de passe.</div>
              <div style={{marginBottom:13}}>
                <label style={{fontSize:11,fontWeight:700,color:C.grey,display:"block",marginBottom:3}}>Nouveau mot de passe</label>
                <input type="password" value={np1} onChange={e=>setNp1(e.target.value)} placeholder="Min. 6 caractères" style={inp} autoComplete="new-password"/>
              </div>
              <div style={{marginBottom:13}}>
                <label style={{fontSize:11,fontWeight:700,color:C.grey,display:"block",marginBottom:3}}>Confirmer</label>
                <input type="password" value={np2} onChange={e=>setNp2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&applyNewPassword()} placeholder="Retapez-le" style={{...inp,border:np2&&np1!==np2?"1.5px solid #FCA5A5":"1.5px solid "+C.border}} autoComplete="new-password"/>
              </div>
              {np2&&np1!==np2&&<div style={{color:C.red,fontSize:11,marginBottom:10}}>Ne correspondent pas.</div>}
              {np2&&np1===np2&&np1.length>=6&&<div style={{color:C.green,fontSize:11,marginBottom:10}}>✓ Correspondent</div>}
              {err&&<div style={{color:C.red,fontSize:11,marginBottom:10}}>{err}</div>}
              {msg&&<div style={{color:C.green,fontSize:11,marginBottom:10}}>{msg}</div>}
              <button onClick={applyNewPassword} disabled={busy} style={{width:"100%",padding:12,borderRadius:9,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:800,fontSize:13,color:"#fff",background:"linear-gradient(135deg,#1A9E5F,#1E4D8C)"}}>
                {busy?"…":"Enregistrer →"}
              </button>
            </div>
          ):mode==="forgot"?(
            <div>
              <div style={{fontWeight:800,fontSize:16,color:C.navy,marginBottom:4}}>🔓 Mot de passe oublié</div>
              <div style={{fontSize:12,color:C.grey,marginBottom:18}}>Nous vous enverrons un lien.</div>
              <div style={{marginBottom:13}}>
                <label style={{fontSize:11,fontWeight:700,color:C.grey,display:"block",marginBottom:3}}>Courriel</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendRecovery()} placeholder="pharmacien@pharmacie.com" style={inp}/>
              </div>
              {err&&<div style={{color:C.red,fontSize:11,marginBottom:10}}>{err}</div>}
              {msg&&<div style={{color:C.green,fontSize:11,marginBottom:10}}>{msg}</div>}
              <button onClick={sendRecovery} disabled={busy} style={{width:"100%",padding:12,borderRadius:9,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:800,fontSize:13,color:"#fff",background:"linear-gradient(135deg,"+C.navy+","+C.sky+")"}}>
                {busy?"…":"Envoyer le lien →"}
              </button>
              <button onClick={()=>{setMode("login");setErr("");setMsg("");}} style={{width:"100%",marginTop:10,padding:9,borderRadius:9,border:"1.5px solid "+C.border,cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:12,color:C.grey,background:"#fff"}}>
                ← Retour
              </button>
            </div>
          ):(
            <div>
              <div style={{display:"flex",marginBottom:20,borderRadius:10,overflow:"hidden",border:"1px solid "+C.border}}>
                {["login","signup"].map(m=>(
                  <button key={m} onClick={()=>{setMode(m);setErr("");setMsg("");}} style={{flex:1,padding:"9px",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12,background:mode===m?C.navy:"#fff",color:mode===m?"#fff":C.grey}}>
                    {m==="login"?t("login"):t("createAccount")}
                  </button>
                ))}
              </div>
              {[{l:"Email",v:email,s:setEmail,ty:"email",ph:"pharmacist@clinic.com"},{l:"Password",v:pwd,s:setPwd,ty:"password",ph:"Min. 6 characters"}].map(f=>(
                <div key={f.l} style={{marginBottom:13}}>
                  <label style={{fontSize:11,fontWeight:700,color:C.grey,display:"block",marginBottom:3}}>{f.l}</label>
                  <input type={f.ty} value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.ph} onKeyDown={e=>e.key==="Enter"&&submit()} style={inp} autoComplete="off"/>
                </div>
              ))}
              {err&&<div style={{color:C.red,fontSize:11,marginBottom:10}}>{err}</div>}
              {msg&&<div style={{color:C.green,fontSize:11,marginBottom:10}}>{msg}</div>}
              <button onClick={submit} disabled={busy} style={{width:"100%",padding:12,borderRadius:9,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:800,fontSize:13,color:"#fff",background:"linear-gradient(135deg,"+C.navy+","+C.sky+")"}}>
                {busy?"…":mode==="login"?t("signIn"):t("createMyAccount")}
              </button>
              {mode==="login"&&(
                <button onClick={()=>{setMode("forgot");setErr("");setMsg("");}} style={{width:"100%",marginTop:12,padding:6,border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:C.sky,fontWeight:600}}>
                  Mot de passe oublié? · Forgot password?
                </button>
              )}
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
  const pharmacyOptions=PHARMACY_CHAINS_BY_COUNTRY[country]||DEFAULT_CHAINS;
  const dispensingOptions=DISPENSING_SYSTEMS[country]||DEFAULT_DISPENSING;
  const inventoryOptions=INVENTORY_SYSTEMS[country]||DEFAULT_INVENTORY;
  const countryCode=COUNTRY_CODES[country]||"+1";
  const countryIso=COUNTRY_ISO[country]||"";
  useEffect(()=>{setPharmacyName("");setPharmacyAddress("");setDispensingSystem("");setInventorySystem("");},[country]);
  const canLaunch=pharmacyName.trim()&&pharmacyAddress.trim()&&pharmacyPhone.trim()&&pharmacistOwner.trim()&&dispensingSystem.trim()&&inventorySystem.trim()&&plan;
  async function finish(){
    if(!canLaunch) return;
    setSaving(true);
    const fullPhone=pharmacyPhone?countryCode+" "+pharmacyPhone:"";
    const profile={id:session.user.id,email:userEmail,language,country,province,pharmacy_name:pharmacyName,dispensing_system:dispensingSystem,inventory_system:inventorySystem,pharmacy_phone:fullPhone,pharmacy_email:pharmacyEmail,pharmacy_address:pharmacyAddress,permit_number:permitNumber,pharmacist_owner:pharmacistOwner,pharmacist_email:pharmacistEmail,owner_name:managerName,plan};
    const {url,key}=SB.get();
    try{await fetch(url+"/rest/v1/profiles",{method:"POST",headers:{"apikey":key,"Authorization":"Bearer "+session.access_token,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates"},body:JSON.stringify(profile)});}catch{}
    try{await MEM.add({pharmacy_id:session.user.id,user_id:session.user.id,email:userEmail,full_name:pharmacistOwner,licence:permitNumber||null,role:"owner",active:true});}catch{}
    onComplete(profile);setSaving(false);
  }
  const pct=(step/3)*100;
  const sel={width:"100%",padding:"10px 12px",borderRadius:9,border:"1.5px solid "+C.border,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",background:"#fff"};
  const nextBtn=(d,l,o,g)=>(<button onClick={o} disabled={d} style={{flex:2,padding:13,borderRadius:10,border:"none",cursor:d?"not-allowed":"pointer",fontFamily:"inherit",fontWeight:800,fontSize:14,color:"#fff",background:g?"linear-gradient(135deg,#1A9E5F,#1E4D8C)":"linear-gradient(135deg,#1E4D8C,#2E86DE)",opacity:d?.4:1}}>{l}</button>);
  const backBtn=(o)=>(<button onClick={o} style={{flex:1,padding:13,borderRadius:10,border:"1.5px solid "+C.border,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,color:C.grey,background:"#fff"}}>{t("back")}</button>);
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0F2744,#1E4D8C,#2E86DE)",padding:"24px 16px",overflowY:"auto"}}>
      <div style={{maxWidth:500,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:40,marginBottom:8}}>💊</div>
          <div style={{color:"#fff",fontWeight:900,fontSize:24}}>{t("welcomeToNarco")}</div>
          <div style={{color:"rgba(255,255,255,.5)",fontSize:12,marginTop:4}}>{t("stepOf")} {step} {t("ofTotal")} 3 · {userEmail}</div>
        </div>
        <div style={{height:4,background:"rgba(255,255,255,.15)",borderRadius:4,marginBottom:22,overflow:"hidden"}}>
          <div style={{height:"100%",width:pct+"%",background:"#2E86DE",borderRadius:4}}/>
        </div>
        <div style={{background:"#fff",borderRadius:20,padding:28,boxShadow:"0 24px 64px rgba(0,0,0,.25)",marginBottom:32}}>
          {step===1&&(<div>
            <div style={{fontWeight:800,fontSize:18,color:C.navy,marginBottom:4}}>🌐 {t("language")}</div>
            <div style={{fontSize:12,color:C.grey,marginBottom:20}}>{t("langSubtitle")}</div>
            <div style={{marginBottom:16}}><FieldLabel>{t("searchLanguage")}</FieldLabel><SearchableSelect options={ALL_LANGUAGES} value={language} onChange={setLanguage} placeholder={t("langPlaceholder")}/></div>
            {nextBtn(!language.trim(),t("next"),()=>setStep(2))}
          </div>)}
          {step===2&&(<div>
            <div style={{fontWeight:800,fontSize:18,color:C.navy,marginBottom:4}}>📍 {t("location")}</div>
            <div style={{fontSize:12,color:C.grey,marginBottom:20}}>{t("locationSubtitle")}</div>
            <div style={{marginBottom:14}}><FieldLabel>{t("country")}</FieldLabel><select value={country} onChange={e=>{setCountry(e.target.value);setProvince("");}} style={sel}>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</select></div>
            <div style={{marginBottom:22}}>
              <FieldLabel>{country==="Canada"?t("province"):country==="United States"?t("state"):t("regionCity")}</FieldLabel>
              {country==="Canada"?(<select value={province} onChange={e=>setProvince(e.target.value)} style={sel}><option value="">{t("selectProvince")}</option>{CA_PROVINCES.map(p=><option key={p}>{p}</option>)}</select>):country==="United States"?(<select value={province} onChange={e=>setProvince(e.target.value)} style={sel}><option value="">{t("selectState")}</option>{US_STATES.map(p=><option key={p}>{p}</option>)}</select>):(<input value={province} onChange={e=>setProvince(e.target.value)} placeholder={t("enterRegion")} style={inputStyle}/>)}
            </div>
            <div style={{display:"flex",gap:10}}>{backBtn(()=>setStep(1))}{nextBtn(!province,t("next"),()=>setStep(3))}</div>
          </div>)}
          {step===3&&(<div>
            <div style={{fontWeight:800,fontSize:18,color:C.navy,marginBottom:4}}>🏥 {t("yourPharmacy")}</div>
            <div style={{fontSize:10,color:C.red,marginBottom:12}}>{t("requiredNote")}</div>
            <SectionLabel>{t("pharmacyInfoSection")}</SectionLabel>
            <div style={{marginBottom:13}}>
              <FieldLabel required>{t("pharmacyName")}</FieldLabel>
              <SearchableSelect key={"chain-"+country} options={pharmacyOptions} value={pharmacyName} onChange={setPharmacyName} placeholder={t("pharmacyPlaceholder")} required/>
            </div>
            <Field label={t("permitNumber")} value={permitNumber} onChange={setPermitNumber} placeholder={t("permitPlaceholder")}/>
            <AddressAutocomplete key={"addr-"+country} value={pharmacyAddress} onChange={setPharmacyAddress} placeholder={t("addressPlaceholder")} hint={t("addressHint")} countryIso={countryIso} province={province} required/>
            <PhoneField label={t("pharmacyPhone")} value={pharmacyPhone} onChange={setPharmacyPhone} countryCode={countryCode} required/>
            <Field label={t("pharmacyEmail")} value={pharmacyEmail} onChange={setPharmacyEmail} placeholder={t("emailPlaceholder")} type="email"/>
            <SectionLabel>{t("softwareSection")}</SectionLabel>
            <div style={{marginBottom:13}}>
              <FieldLabel required>{t("dispensingSystem")}</FieldLabel>
              <SearchableSelect key={"disp-"+country} options={dispensingOptions} value={dispensingSystem} onChange={setDispensingSystem} placeholder={t("dispensingSystemPlaceholder")} required/>
            </div>
            <div style={{marginBottom:13}}>
              <FieldLabel required>{t("inventorySystem")}</FieldLabel>
              <SearchableSelect key={"inv-"+country} options={inventoryOptions} value={inventorySystem} onChange={setInventorySystem} placeholder={t("inventorySystemPlaceholder")} required/>
            </div>
            <SectionLabel>{t("teamSection")}</SectionLabel>
            <Field label={t("pharmacistOwner")} value={pharmacistOwner} onChange={setPharmacistOwner} placeholder={t("ownerPlaceholder")} required/>
            <Field label={t("pharmacistEmail")} value={pharmacistEmail} onChange={setPharmacistEmail} placeholder={t("ownerEmailPlaceholder")} type="email"/>
            <Field label={t("managerName")} value={managerName} onChange={setManagerName} placeholder={t("managerPlaceholder")}/>
            <SectionLabel>{t("planSection")} <span style={{color:C.red}}>*</span></SectionLabel>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
              {[{v:"basic",lk:"basicLabel",dk:"basicDesc",pk:"basicPrice"},{v:"pro",lk:"proLabel",dk:"proDesc",pk:"proPrice"},{v:"enterprise",lk:"enterpriseLabel",dk:"enterpriseDesc",pk:"enterprisePrice"}].map(p=>(
                <button key={p.v} onClick={()=>setPlan(p.v)} style={{padding:"12px 16px",borderRadius:12,border:"2px solid "+(plan===p.v?C.sky:C.border),cursor:"pointer",fontFamily:"inherit",textAlign:"left",background:plan===p.v?"#EFF6FF":"#fff"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div><span style={{fontWeight:700,fontSize:13,color:plan===p.v?C.sky:C.navy}}>{t(p.lk)}</span><span style={{fontSize:11,color:C.grey,marginLeft:8}}>{t(p.dk)}</span></div>
                    <span style={{fontWeight:800,fontSize:12,color:plan===p.v?C.sky:C.grey}}>{t(p.pk)}</span>
                  </div>
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>{backBtn(()=>setStep(2))}{nextBtn(!canLaunch||saving,saving?t("saving"):t("launch"),finish,true)}</div>
          </div>)}
        </div>
      </div>
    </div>
  );
}

function Dashboard({session,profile,member,onLogout}){
  const [page,setPage]=useState("home");
  const email=session?.user?.email||"pharmacist@clinic.com";
  const lang=getLang(profile?.language);
  const fr=lang==="fr";
  const t=(k)=>T[lang][k]||T.en[k]||k;
  const role=member?member.role:"owner";
  const nav=[
    {id:"home",icon:"🏠",label:t("dashboard")},
    {id:"inv",icon:"📦",label:t("inventory")},
    {id:"reco",icon:"⚡",label:t("reconciliation")},
    {id:"history",icon:"📝",label:t("history")},
    {id:"team",icon:"👥",label:t("team")},
    {id:"audit",icon:"📋",label:fr?"Journal":"Audit log"},
    {id:"clinical",icon:"🏥",label:t("clinical")},
    {id:"pricing",icon:"💳",label:t("plans")}
  ];
  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div style={{width:210,background:"linear-gradient(180deg,#0F2744,#1E4D8C)",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"20px 14px 12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{fontSize:22}}>💊</div>
            <div><div style={{color:"#fff",fontWeight:900,fontSize:15}}>NarcoSync</div><div style={{color:"rgba(255,255,255,.3)",fontSize:9}}>Universal</div></div>
          </div>
          <div style={{background:"rgba(255,255,255,.07)",borderRadius:10,padding:"8px 10px"}}>
            <div style={{color:"rgba(255,255,255,.4)",fontSize:9}}>{t("loggedInAs")}</div>
            <div style={{color:"#fff",fontSize:10,fontWeight:600,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{member?.full_name||email}</div>
            <div style={{marginTop:5}}><RoleBadge role={role} fr={fr}/></div>
            {member?.licence&&<div style={{color:"rgba(255,255,255,.35)",fontSize:9,marginTop:4,fontFamily:"monospace"}}>{member.licence}</div>}
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
          <button onClick={onLogout} style={{width:"100%",padding:"8px 10px",borderRadius:10,border:"none",cursor:"pointer",background:"transparent",color:"rgba(255,255,255,.35)",fontSize:11,fontFamily:"inherit",textAlign:"left"}}>{t("signOut")}</button>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",background:C.light}}>
        {page==="home"&&<HomePage onNewReco={()=>setPage("reco")} email={email} t={t} profile={profile} session={session} member={member}/>}
        {page==="inv"&&<InventoryPage session={session} member={member} fr={fr}/>}
        {page==="reco"&&<RecoPage onBack={()=>setPage("home")} t={t} profile={profile} session={session} member={member} onGoInv={()=>setPage("inv")}/>}
        {page==="history"&&<HistoryPage session={session} member={member} fr={fr}/>}
        {page==="team"&&<TeamPage session={session} member={member} fr={fr}/>}
        {page==="audit"&&<AuditPage session={session} member={member} fr={fr}/>}
        {page==="clinical"&&<PlaceholderPage icon="🏥" title={t("clinical")} desc={t("clinicalDesc")}/>}
        {page==="pricing"&&<PlaceholderPage icon="💳" title={t("plans")} desc={t("plansDesc")}/>}
      </div>
    </div>
  );
}

function PlaceholderPage({icon,title,desc}){
  return(<div style={{padding:"60px 40px",textAlign:"center"}}><div style={{fontSize:48,marginBottom:16}}>{icon}</div><div style={{fontWeight:800,fontSize:22,color:C.navy,marginBottom:8}}>{title}</div><div style={{fontSize:14,color:C.grey,maxWidth:400,margin:"0 auto"}}>{desc}</div></div>);
}

function HistoryPage({session,member,fr}){
  const pid=member?member.pharmacy_id:session.user.id;
  const role=member?member.role:"owner";
  const [cycles,setCycles]=useState([]);
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState(null);
  useEffect(()=>{
    const {url,key}=SB.get();
    fetch(url+"/rest/v1/reconciliations?pharmacy_id=eq."+pid+"&order=completed_at.desc",{
      headers:{"apikey":key,"Authorization":"Bearer "+session.access_token}
    }).then(r=>r.json()).then(d=>{if(Array.isArray(d))setCycles(d);setLoading(false);}).catch(()=>setLoading(false));
  },[]);
  function fd(d){ if(!d) return "—"; return new Date(d).toLocaleDateString(fr?"fr-CA":"en-CA",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}); }

  async function delCycle(c){
    if(!window.confirm(fr?"Supprimer ce cycle?":"Delete this cycle?")) return;
    try{
      await sbFetch("reconciliations?id=eq."+c.id,{method:"DELETE"});
      await AUDIT.log(member,"delete_cycle","reconciliations",c.id,fd(c.completed_at));
      setCycles(cycles.filter(x=>x.id!==c.id));
    }catch(e){alert(e.message||String(e));}
  }

  if(selected){
    const mols=typeof selected.molecules==="string"?JSON.parse(selected.molecules||"[]"):selected.molecules||[];
    return(
      <div style={{padding:"28px 32px"}}>
        <button onClick={()=>setSelected(null)} style={{marginBottom:20,padding:"7px 14px",borderRadius:8,border:"1px solid #E2E8F0",background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:C.grey}}>← {fr?"Retour":"Back"}</button>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10,marginBottom:12}}>
          <div style={{fontWeight:900,fontSize:20,color:C.navy}}>📋 {fd(selected.completed_at)}</div>
          <button onClick={()=>window.print()} style={{padding:"9px 18px",borderRadius:9,border:"1.5px solid "+C.sky,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12,color:C.sky}}>
            🖨 {fr?"Imprimer ce rapport":"Print this report"}
          </button>
        </div>
        <div style={{overflowX:"auto",borderRadius:12,border:"1.5px solid #E2E8F0",background:"#fff"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:900}}>
            <thead><tr style={{background:"#F8FAFC"}}>
              {["Description","Format","DIN",fr?"Ouverture":"Opening",fr?"Reçu":"Received",fr?"Dispensé":"Dispensed",fr?"Théorique":"Theoretical",fr?"Physique":"Physical",fr?"Écart":"Diff"].map(h=>(
                <th key={h} style={{padding:"8px 10px",fontSize:10,fontWeight:800,color:C.grey,textAlign:"left",borderBottom:"2px solid #E2E8F0"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {mols.map((m,i)=>{
                const theo=(Number(m.opening)||0)+(Number(m.received)||0)-(Number(m.dispensed)||0);
                const disc=m.physical!==""?theo-(Number(m.physical)||0):null;
                return(<tr key={i} style={{background:disc===null?(i%2===0?"#fff":"#FAFAFA"):disc===0?"#F0FDF4":"#FEF2F2"}}>
                  {[m.name,m.format,m.din,m.opening,m.received,m.dispensed,theo].map((v,j)=>(
                    <td key={j} style={{padding:"6px 10px",fontSize:12,borderBottom:"1px solid #F3F4F6",color:C.navy}}>{v||"—"}</td>
                  ))}
                  <td style={{padding:"6px 10px",fontSize:12,borderBottom:"1px solid #F3F4F6",color:C.sky,fontWeight:700}}>{m.physical!==""?m.physical:"—"}</td>
                  <td style={{padding:"6px 10px",fontSize:12,borderBottom:"1px solid #F3F4F6",fontWeight:700,color:disc===null?"#D1D5DB":disc===0?C.green:C.red}}>
                    {disc===null?"—":disc===0?"✓ 0":"⚠️ "+(disc>0?"+":"")+disc}
                  </td>
                </tr>);
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return(
    <div style={{padding:"28px 32px"}}>
      <div style={{fontWeight:900,fontSize:22,color:C.navy,marginBottom:20}}>📝 {fr?"Historique":"History"}</div>
      {loading?<div style={{textAlign:"center",padding:60,color:C.grey}}>…</div>:
       cycles.length===0?(
        <div style={{background:"#fff",borderRadius:14,padding:60,textAlign:"center",boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
          <div style={{fontSize:48,marginBottom:16}}>📋</div>
          <div style={{fontWeight:800,fontSize:16,color:C.navy}}>{fr?"Aucun cycle":"No cycles yet"}</div>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {cycles.map((c,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                <div onClick={()=>setSelected(c)} style={{cursor:"pointer",flex:1}}>
                  <div style={{fontWeight:800,fontSize:15,color:C.navy}}>📋 {fd(c.completed_at)}</div>
                  <div style={{fontSize:12,color:C.grey,marginTop:2}}>{c.total_molecules} {fr?"produits · cliquer pour le détail et l'impression":"products · click for detail"}</div>
                </div>
                <span style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{background:c.total_discrepancies>0?"#FEF2F2":"#F0FDF4",color:c.total_discrepancies>0?C.red:C.green,fontSize:11,fontWeight:800,padding:"4px 12px",borderRadius:20}}>
                    {c.total_discrepancies>0?"⚠️ "+c.total_discrepancies:"✅"}
                  </span>
                  {can(role,"edit")&&<button onClick={()=>delCycle(c)} style={{border:"none",background:"none",cursor:"pointer",color:C.red,fontSize:16}}>🗑</button>}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HomePage({onNewReco,email,t,profile,session,member}){
  const pid=member?member.pharmacy_id:session.user.id;
  const [cycles,setCycles]=useState([]);
  const pharmacyName=profile?.pharmacy_name||"";
  const fr=getLang(profile?.language)==="fr";
  useEffect(()=>{
    const {url,key}=SB.get();
    fetch(url+"/rest/v1/reconciliations?pharmacy_id=eq."+pid+"&order=completed_at.desc&limit=5",{
      headers:{"apikey":key,"Authorization":"Bearer "+session.access_token}
    }).then(r=>r.json()).then(d=>{if(Array.isArray(d))setCycles(d);}).catch(()=>{});
  },[]);
  const total=cycles.length;
  const lastDisc=cycles[0]?.total_discrepancies||0;
  return(
    <div style={{padding:"28px 32px"}}>
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:900,fontSize:22,color:C.navy}}>{t("welcomeMsg")}</div>
        <div style={{color:C.grey,fontSize:13,marginTop:4}}>{member?.full_name||email}</div>
        {pharmacyName&&<div style={{color:C.sky,fontSize:12,fontWeight:600,marginTop:2}}>🏥 {pharmacyName}</div>}
      </div>
      {total>0?(
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
          {[{icon:"📋",label:fr?"Cycles":"Cycles",val:total,col:C.sky},
            {icon:lastDisc>0?"⚠️":"✅",label:fr?"Écarts dernier cycle":"Last discrepancies",val:lastDisc,col:lastDisc>0?C.red:C.green},
            {icon:"💊",label:fr?"Produits":"Products",val:cycles[0]?.total_molecules||0,col:"#7C3AED"}].map(s=>(
            <div key={s.label} style={{background:"#fff",borderRadius:14,padding:18,boxShadow:"0 2px 10px rgba(0,0,0,.06)",borderTop:"4px solid "+s.col}}>
              <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
              <div style={{fontSize:28,fontWeight:900,color:s.col}}>{s.val}</div>
              <div style={{fontSize:11,color:C.grey,marginTop:4}}>{s.label}</div>
            </div>
          ))}
        </div>
      ):(
        <div style={{background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",border:"1.5px solid #FCD34D",borderRadius:14,padding:"16px 20px",marginBottom:24}}>
          <div style={{fontWeight:800,fontSize:14,color:C.navy}}>{t("liveMsg")}</div>
          <div style={{fontSize:12,color:C.grey,marginTop:2}}>{t("liveSubMsg")}</div>
        </div>
      )}
      <button onClick={onNewReco} style={{width:"100%",padding:16,borderRadius:14,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:900,fontSize:15,color:"#fff",background:"linear-gradient(135deg,#2E86DE,#0F2744)",boxShadow:"0 6px 20px rgba(46,134,222,.35)"}}>
        {t("newReco")}
      </button>
    </div>
  );
}

function RecoTable({session,profile,member,onComplete,lang,onGoInv}){
  const pid=member?member.pharmacy_id:session.user.id;
  const role=member?member.role:"owner";
  const [molecules,setMolecules]=useState([]);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [nextId,setNextId]=useState(1);
  const [err,setErr]=useState("");
  const fr=lang==="fr";

  useEffect(()=>{
    (async()=>{
      try{
        const inv=await INV.list(pid,"");
        let id=1;
        setMolecules(inv.map(r=>({id:id++,inv_id:r.id,name:r.molecule||"",strength:r.strength||"",cup:r.cup||"",format:r.format||"",din:r.din||"",opening:Number(r.qty)||0,received:0,dispensed:0,physical:"",notes:""})));
        setNextId(id);
      }catch(e){setErr(e.message||String(e));}
      setLoading(false);
    })();
  },[]);

  function update(id,f,v){setMolecules(p=>p.map(m=>m.id===id?{...m,[f]:v}:m));}
  function addRow(){setMolecules(p=>[...p,{id:nextId,name:"",strength:"",cup:"",format:"",din:"",opening:0,received:0,dispensed:0,physical:"",notes:""}]);setNextId(n=>n+1);}
  function removeRow(id){setMolecules(p=>p.filter(m=>m.id!==id));}
  function theo(m){return(Number(m.opening)||0)+(Number(m.received)||0)-(Number(m.dispensed)||0);}
  function diff(m){if(m.physical==="")return null;return theo(m)-(Number(m.physical)||0);}
  const totalDisc=molecules.filter(m=>diff(m)!==null&&diff(m)!==0).length;
  const filled=molecules.filter(m=>m.physical!=="").length;

  async function save(){
    setSaving(true);
    const {url,key}=SB.get();
    const cycle={pharmacy_id:pid,pharmacy_name:profile?.pharmacy_name,dispensing_system:profile?.dispensing_system,inventory_system:profile?.inventory_system,molecules:JSON.stringify(molecules),total_molecules:molecules.length,total_discrepancies:totalDisc,completed_at:new Date().toISOString()};
    try{await fetch(url+"/rest/v1/reconciliations",{method:"POST",headers:{"apikey":key,"Authorization":"Bearer "+session.access_token,"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify(cycle)});}catch{}
    for(const m of molecules){
      if(m.inv_id&&m.physical!==""){
        try{await INV.update(m.inv_id,{qty:Number(m.physical)||0,last_count_at:new Date().toISOString()});}catch(e){}
      }
    }
    await AUDIT.log(member,"save_cycle","reconciliations",null,molecules.length+(fr?" produits · ":" products · ")+totalDisc+(fr?" écart(s)":" variance(s)"));
    setSaving(false);onComplete({totalDisc,totalMolecules:molecules.length});
  }

  const th={padding:"7px 8px",fontSize:10,fontWeight:800,color:C.grey,textAlign:"left",whiteSpace:"nowrap",borderBottom:"2px solid #E2E8F0",background:"#F8FAFC"};
  const td={padding:"4px 6px",fontSize:12,borderBottom:"1px solid #F3F4F6"};
  const ni={padding:"4px 6px",borderRadius:6,border:"1.5px solid #E2E8F0",fontSize:11,fontFamily:"inherit",boxSizing:"border-box"};
  const pi={padding:"4px 6px",borderRadius:6,border:"2px solid "+C.sky,fontSize:12,textAlign:"center",fontWeight:700,background:"#EFF6FF",width:64,fontFamily:"inherit"};

  if(loading) return <div style={{padding:40,color:C.grey}}>{fr?"Chargement de votre inventaire…":"Loading inventory…"}</div>;

  if(molecules.length===0){
    return(
      <div style={{background:"#FFFBEB",border:"2px solid #FCD34D",borderRadius:14,padding:32,textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:12}}>📦</div>
        <div style={{fontWeight:800,fontSize:16,color:C.navy,marginBottom:8}}>{fr?"Votre inventaire est vide":"Your inventory is empty"}</div>
        <div style={{fontSize:13,color:C.grey,marginBottom:18,maxWidth:380,margin:"0 auto 18px"}}>
          {fr?"Ajoutez d'abord vos produits dans « Mon inventaire ».":"Add your products in \"My inventory\" first."}
        </div>
        <button onClick={onGoInv} style={{padding:"11px 22px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:800,fontSize:13,color:"#fff",background:C.sky}}>
          📦 {fr?"Aller à Mon inventaire":"Go to My inventory"}
        </button>
      </div>
    );
  }

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontWeight:900,fontSize:18,color:C.navy}}>📋 {fr?"Tableau de réconciliation":"Reconciliation Table"}</div>
          <div style={{fontSize:12,color:C.grey,marginTop:2}}>{molecules.length} {fr?"produits · ouverture = qté de votre inventaire":"products"}</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <button onClick={()=>window.print()} style={{padding:"8px 14px",borderRadius:9,border:"1.5px solid "+C.sky,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12,color:C.sky}}>
            🖨 {fr?"Imprimer pour le décompte":"Print for counting"}
          </button>
          {filled>0&&<span style={{background:"#EFF6FF",color:C.sky,fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:20}}>{filled}/{molecules.length} {fr?"comptés":"counted"}</span>}
          {totalDisc>0&&<span style={{background:"#FEF2F2",color:C.red,fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:20}}>⚠️ {totalDisc} {fr?"écart(s)":"diff"}</span>}
          {totalDisc===0&&filled===molecules.length&&<span style={{background:"#F0FDF4",color:C.green,fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:20}}>✅ {fr?"Tout balance":"All balanced"}</span>}
        </div>
      </div>
      {err&&<div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:8,padding:"8px 14px",fontSize:12,color:C.red,marginBottom:12}}>{err}</div>}

      <div style={{overflowX:"auto",borderRadius:12,border:"1.5px solid #E2E8F0",marginBottom:14,background:"#fff"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:1150}}>
          <thead><tr>
            {["CUP","Description",fr?"Force":"Strength","Format","DIN",fr?"Ouverture":"Opening","+ "+(fr?"Reçu":"Received"),"− "+(fr?"Dispensé":"Dispensed"),"= "+(fr?"Théorique":"Theo"),"🔵 "+(fr?"Physique":"Physical"),fr?"Écart":"Diff",fr?"Note":"Note",""].map((h,i)=>(
              <th key={i} style={{...th,background:i===9?"#EFF6FF":"#F8FAFC",color:i===6?C.orange:i===7?C.red:i===8?"#7C3AED":i===9?C.sky:C.grey}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {molecules.map((m,i)=>{
              const th2=theo(m);const d=diff(m);
              return(
                <tr key={m.id} style={{background:d===null?(i%2===0?"#fff":"#FAFAFA"):d===0?"#F0FDF4":"#FEF2F2"}}>
                  <td style={td}><input value={m.cup} onChange={e=>update(m.id,"cup",e.target.value)} style={{...ni,width:88,fontFamily:"monospace"}}/></td>
                  <td style={td}><input value={m.name} onChange={e=>update(m.id,"name",e.target.value)} style={{...ni,width:170}}/></td>
                  <td style={td}><input value={m.strength} onChange={e=>update(m.id,"strength",e.target.value)} style={{...ni,width:58}}/></td>
                  <td style={td}><input value={m.format} onChange={e=>update(m.id,"format",e.target.value)} style={{...ni,width:74}}/></td>
                  <td style={td}><input value={m.din} onChange={e=>update(m.id,"din",e.target.value)} style={{...ni,width:74,fontFamily:"monospace"}}/></td>
                  <td style={td}><input type="number" value={m.opening} onChange={e=>update(m.id,"opening",e.target.value)} style={{...ni,width:52,textAlign:"center"}} min="0"/></td>
                  <td style={td}><input type="number" value={m.received} onChange={e=>update(m.id,"received",e.target.value)} style={{...ni,width:52,textAlign:"center",borderColor:C.orange}} min="0"/></td>
                  <td style={td}><input type="number" value={m.dispensed} onChange={e=>update(m.id,"dispensed",e.target.value)} style={{...ni,width:52,textAlign:"center",borderColor:C.red}} min="0"/></td>
                  <td style={{...td,textAlign:"center"}}><span style={{fontWeight:900,fontSize:15,color:"#7C3AED"}}>{th2}</span></td>
                  <td style={{...td,background:"#EFF6FF"}}><input type="number" value={m.physical} onChange={e=>update(m.id,"physical",e.target.value)} style={pi} placeholder="—" min="0"/></td>
                  <td style={{...td,textAlign:"center"}}>
                    {d===null?<span style={{color:"#D1D5DB",fontSize:11}}>—</span>:d===0?<span style={{color:C.green,fontWeight:800}}>✓ 0</span>:<span style={{color:C.red,fontWeight:800}}>⚠️ {d>0?"+":""}{d}</span>}
                  </td>
                  <td style={td}>
                    {d!==null&&d!==0
                      ?<input value={m.notes} onChange={e=>update(m.id,"notes",e.target.value)} placeholder={fr?"Justification…":"Reason…"} style={{...ni,width:130,borderColor:m.notes?"#E2E8F0":"#FCA5A5"}}/>
                      :<span style={{color:"#D1D5DB",fontSize:11}}>—</span>}
                  </td>
                  <td style={td}><button onClick={()=>removeRow(m.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#D1D5DB",fontSize:18}}>×</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button onClick={addRow} style={{padding:"8px 16px",borderRadius:9,border:"1.5px dashed #E2E8F0",background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:C.grey,fontWeight:600,marginBottom:20}}>
        + {fr?"Ajouter une ligne":"Add row"}
      </button>

      {totalDisc>0&&(
        <div style={{background:"#FEF2F2",border:"1.5px solid #FCA5A5",borderRadius:12,padding:16,marginBottom:16}}>
          <div style={{fontWeight:800,fontSize:14,color:C.red,marginBottom:6}}>
            ⚠️ {totalDisc} {fr?"écart(s) à valider par le pharmacien":"variance(s) to validate"}
          </div>
          <div style={{fontSize:12,color:"#991B1B"}}>
            {fr?"Recomptez les produits en rouge. Si l'écart persiste, inscrivez une justification avant de sauvegarder — elle sera signée avec votre licence.":"Recount the red rows and add a reason before saving."}
          </div>
        </div>
      )}

      {can(role,"edit")?(
        <button onClick={save} disabled={saving} style={{width:"100%",padding:14,borderRadius:12,border:"none",cursor:saving?"not-allowed":"pointer",fontFamily:"inherit",fontWeight:800,fontSize:14,color:"#fff",background:"linear-gradient(135deg,#1A9E5F,#1E4D8C)",opacity:saving?.5:1}}>
          {saving?"…":fr?"💾 Valider et sauvegarder ce cycle":"💾 Validate and save this cycle"}
        </button>
      ):(
        <div style={{background:"#FFF7ED",border:"1.5px solid #FDBA74",borderRadius:10,padding:"12px 16px",fontSize:12,color:"#9A3412",textAlign:"center"}}>
          👁 {fr?"Un pharmacien doit valider et sauvegarder ce cycle.":"A pharmacist must validate and save this cycle."}
        </div>
      )}
      {member&&can(role,"edit")&&<div style={{fontSize:11,color:C.grey,marginTop:8,textAlign:"center"}}>
        {fr?"Signé par":"Signed by"} {member.full_name||member.email} · {fr?"licence":"licence"} {member.licence||"—"}
      </div>}
    </div>
  );
}

function RecoPage({onBack,t,profile,session,member,onGoInv}){
  const [step,setStep]=useState("table");
  const [result,setResult]=useState(null);
  const lang=getLang(profile?.language);
  const fr=lang==="fr";

  if(step==="done"){
    return(
      <div style={{padding:"28px 32px"}}>
        <div style={{background:"#fff",borderRadius:14,padding:32,boxShadow:"0 2px 10px rgba(0,0,0,.06)",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:12}}>{result?.totalDisc>0?"⚠️":"✅"}</div>
          <div style={{fontWeight:800,fontSize:20,color:C.navy,marginBottom:8}}>{t("recoComplete")}</div>
          <div style={{fontSize:13,color:C.grey,marginBottom:6}}>{result?.totalMolecules} {fr?"produits":"products"}</div>
          <div style={{fontSize:14,fontWeight:700,marginBottom:20,color:result?.totalDisc>0?C.red:C.green}}>
            {result?.totalDisc>0?"⚠️ "+result.totalDisc+" "+(fr?"écart(s)":"discrepancies"):"✅ "+(fr?"Tout équilibré":"All balanced")}
          </div>
          <button onClick={()=>{setStep("table");setResult(null);}} style={{padding:"10px 24px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,color:"#fff",background:C.sky}}>
            {t("newRecoBtn")}
          </button>
        </div>
      </div>
    );
  }

  return(
    <div style={{padding:"28px 32px"}}>
      <button onClick={onBack} style={{marginBottom:20,padding:"7px 14px",borderRadius:8,border:"1px solid "+C.border,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:C.grey}}>{t("back")}</button>
      <RecoTable session={session} profile={profile} member={member} lang={lang} onGoInv={onGoInv} onComplete={r=>{setResult(r);setStep("done");}}/>
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

  useEffect(()=>{
    if(!session||session.user.email===ADMIN_EMAIL) return;
    (async()=>{
      setLoading(true);
      let mem=member;
      try{
        mem=await MEM.byEmail(session.user.email);
        if(mem&&!mem.user_id){
          try{await MEM.linkUser(mem.id,session.user.id);mem.user_id=session.user.id;}catch(e){}
        }
        if(mem){SB.saveMember(mem);setMember(mem);}
      }catch(e){}
      const pid=mem?mem.pharmacy_id:session.user.id;
      try{
        const {url,key}=SB.get();
        const r=await fetch(url+"/rest/v1/profiles?id=eq."+pid,{headers:{"apikey":key,"Authorization":"Bearer "+session.access_token}});
        const d=await r.json();
        if(Array.isArray(d)&&d.length>0){SB.saveProfile(d[0]);setProfile(d[0]);}
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
        alert("Session expirée après 5 minutes d'inactivité. Reconnectez-vous.");
        logout();
      },IDLE_MS);
    }
    const evts=["mousemove","mousedown","keydown","scroll","touchstart","click"];
    evts.forEach(e=>window.addEventListener(e,reset,{passive:true}));
    reset();
    const refresher=setInterval(()=>{refreshToken();},45*60*1000);
    return ()=>{
      if(timer) clearTimeout(timer);
      clearInterval(refresher);
      evts.forEach(e=>window.removeEventListener(e,reset));
    };
  },[session]);

  if(!session) return <AuthScreen onAuth={s=>{SB.saveSession(s);setSession(s);if(s.user.email!==ADMIN_EMAIL)setLoading(true);}}/>;
  if(session.user.email===ADMIN_EMAIL) return <AdminDashboard session={session} onLogout={logout}/>;
  if(loading) return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.light}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:36,marginBottom:12}}>💊</div><div style={{fontSize:14,color:C.grey,fontWeight:600}}>Loading NarcoSync…</div></div>
    </div>
  );
  if(!profile&&!member) return <OnboardingWizard userEmail={session.user.email} onComplete={p=>{SB.saveProfile(p);setProfile(p);}} session={session}/>;
  return <Dashboard session={session} profile={profile} member={member} onLogout={logout}/>;
}
