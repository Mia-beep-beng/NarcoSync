import React, { useState, useRef, useEffect } from "react";

const C = {
  navy:"#0F2744",blue:"#1E4D8C",sky:"#2E86DE",
  green:"#1A9E5F",red:"#D63031",orange:"#E67E22",
  light:"#F4F7FB",white:"#FFFFFF",grey:"#6B7280",border:"#E2E8F0",
};

const ADMIN_EMAIL = "mtrofin@icloud.com";

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
    dispensingSystem:"Dispensing software",dispensingSystemHint:"Software that generates your dispensing records (sales/Rx history)",
    dispensingSystemPlaceholder:"Search dispensing software…",
    inventorySystem:"Ordering / inventory system",inventorySystemHint:"Software used for stock ordering and inventory management",
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
    clinical:"Clinical",plans:"Plans",signOut:"🔒 Sign out",loggedInAs:"LOGGED IN AS",
    welcomeMsg:"Welcome to NarcoSync 👋",liveMsg:"🎉 NarcoSync is live!",
    liveSubMsg:"Connected to Supabase · Ready for your first reconciliation",
    emptyState:"No cycles yet",emptyStateSub:"Complete your first reconciliation to see stats here.",
    newReco:"⚡ + New Reconciliation",newRecoTitle:"⚡ New Reconciliation",
    newRecoSub:"Upload your 4 files · Any format",
    inventoryLabel:"📦 Inventory",inventoryDesc:"Export from your ordering/inventory system",
    salesLabel:"💊 Dispensing",salesDesc:"Export from your dispensing software",
    cspLabel:"📋 CSP Purchase Order",cspDesc:"Narcotics receiving documents — Purdue, Paladin, McKesson, etc.",
    regularOrderLabel:"📄 Regular Purchase Order",regularOrderDesc:"Regular orders — PharmaClik, Matrix, McKesson Connect",
    reconcileNow:"⚡ Proceed to reconciliation →",recoComplete:"Reconciliation complete!",
    recoCompleteSub:"Cycle saved successfully.",newRecoBtn:"New reconciliation",
    historyDesc:"Your past reconciliation cycles will appear here.",
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
    dispensingSystem:"Logiciel de dispensation",dispensingSystemHint:"Logiciel qui génère vos dossiers de dispensation (ventes / historique Rx)",
    dispensingSystemPlaceholder:"Chercher le logiciel de dispensation…",
    inventorySystem:"Système de commande / inventaire",inventorySystemHint:"Logiciel utilisé pour les commandes et la gestion des stocks",
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
    clinical:"Clinique",plans:"Forfaits",signOut:"🔒 Se déconnecter",loggedInAs:"CONNECTÉ EN TANT QUE",
    welcomeMsg:"Bienvenue sur NarcoSync 👋",liveMsg:"🎉 NarcoSync est en ligne!",
    liveSubMsg:"Connecté à Supabase · Prêt pour votre première réconciliation",
    emptyState:"Aucun cycle pour l'instant",emptyStateSub:"Complétez votre première réconciliation pour voir les statistiques ici.",
    newReco:"⚡ + Nouvelle réconciliation",newRecoTitle:"⚡ Nouvelle réconciliation",
    newRecoSub:"Téléversez vos 4 fichiers · Tout format",
    inventoryLabel:"📦 Inventaire",inventoryDesc:"Export de votre système de commande / inventaire",
    salesLabel:"💊 Dispensation",salesDesc:"Export de votre logiciel de dispensation",
    cspLabel:"📋 Bon de commande CSP",cspDesc:"Réceptions de narcotiques — Purdue, Paladin, McKesson, etc.",
    regularOrderLabel:"📄 Bon de commande régulier",regularOrderDesc:"Commandes régulières — PharmaClik, Matrix, McKesson Connect",
    reconcileNow:"⚡ Procéder à la réconciliation →",recoComplete:"Réconciliation complète!",
    recoCompleteSub:"Cycle sauvegardé avec succès.",newRecoBtn:"Nouvelle réconciliation",
    historyDesc:"Vos cycles de réconciliation passés apparaîtront ici.",
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

const DEFAULT_MOLECULES=[
  {id:1,name:"Hydromorphone",strength:"1mg",opening:0,received:0,dispensed:0,physical:"",notes:""},
  {id:2,name:"Hydromorphone",strength:"2mg",opening:0,received:0,dispensed:0,physical:"",notes:""},
  {id:3,name:"Hydromorphone",strength:"4mg",opening:0,received:0,dispensed:0,physical:"",notes:""},
  {id:4,name:"Hydromorphone",strength:"8mg",opening:0,received:0,dispensed:0,physical:"",notes:""},
  {id:5,name:"Morphine",strength:"15mg",opening:0,received:0,dispensed:0,physical:"",notes:""},
  {id:6,name:"Morphine",strength:"30mg",opening:0,received:0,dispensed:0,physical:"",notes:""},
  {id:7,name:"Oxycodone",strength:"5mg",opening:0,received:0,dispensed:0,physical:"",notes:""},
  {id:8,name:"Oxycodone",strength:"10mg",opening:0,received:0,dispensed:0,physical:"",notes:""},
  {id:9,name:"Oxycodone",strength:"20mg",opening:0,received:0,dispensed:0,physical:"",notes:""},
  {id:10,name:"Fentanyl",strength:"25mcg/h",opening:0,received:0,dispensed:0,physical:"",notes:""},
  {id:11,name:"Fentanyl",strength:"50mcg/h",opening:0,received:0,dispensed:0,physical:"",notes:""},
  {id:12,name:"Méthadone",strength:"10mg/mL",opening:0,received:0,dispensed:0,physical:"",notes:""},
  {id:13,name:"Codéine",strength:"30mg",opening:0,received:0,dispensed:0,physical:"",notes:""},
  {id:14,name:"Méthylphénidate",strength:"10mg",opening:0,received:0,dispensed:0,physical:"",notes:""},
  {id:15,name:"Lorazépam",strength:"1mg",opening:0,received:0,dispensed:0,physical:"",notes:""},
];

const DISPENSING_SYSTEMS={
  "Canada":["AssiStRx","RxPro","Gespar","Ubik","Reflex","Kroll","Datascan","Logibec","Purkinje","WinRx","Fillware","Nexxsys","Prodigy RX","Propel Rx","HealthWatch","Pharmaserv","Axys Pharmacy","MedAccess","Cerner Pharmacy","BD Pyxis (hospital)","Omnicell (hospital)","Other / Custom"],
  "United States":["QS/1 (NRx)","PioneerRx","Liberty Software","Rx30","ScriptPro","PDX","Computer-Rx","BestRx","McKesson EnterpriseRx","Intercom Plus","Epic Willow","Cerner Pharmacy","SuiteRx","FrameworkLTC","Winpharm","ARxIUM","Other / Custom"],
  "France":["Winpharma","Lgpi (Pharmagest)","Pharmagest Smart Rx","Isipharm","Pharmonet","Caducée","Ordoclic","Cegi","Propharm","Delta Informatique","BPCO Pharma","Other / Custom"],
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
  isConfigured:()=>{try{return !!(localStorage.getItem("ns_url")&&localStorage.getItem("ns_key"));}catch{return false;}},
  save:(url,key)=>{localStorage.setItem("ns_url",url);localStorage.setItem("ns_key",key);},
  get:()=>{try{return{url:localStorage.getItem("ns_url")||"",key:localStorage.getItem("ns_key")||""};}catch{return{url:"",key:""};}},
  getSession:()=>{try{const s=localStorage.getItem("ns_session");return s?JSON.parse(s):null;}catch{return null;}},
  saveSession:(s)=>{try{localStorage.setItem("ns_session",JSON.stringify(s));}catch{}},
  clearSession:()=>{try{localStorage.removeItem("ns_session");}catch{}},
  getProfile:()=>{try{const p=localStorage.getItem("ns_profile");return p?JSON.parse(p):null;}catch{return null;}},
  saveProfile:(p)=>{try{localStorage.setItem("ns_profile",JSON.stringify(p));}catch{}},
  clearProfile:()=>{try{localStorage.removeItem("ns_profile");}catch{}},
};

const ALL_LANGUAGES=["Français","English","Bilingue / Bilingual","Afrikaans","Albanian","Amharic","Arabic","Armenian","Azerbaijani","Basque","Belarusian","Bengali","Bosnian","Bulgarian","Catalan","Chinese (Simplified)","Chinese (Traditional)","Croatian","Czech","Danish","Dutch","Estonian","Filipino","Finnish","Galician","Georgian","German","Greek","Gujarati","Haitian Creole","Hausa","Hebrew","Hindi","Hungarian","Icelandic","Igbo","Indonesian","Irish","Italian","Japanese","Javanese","Kannada","Kazakh","Khmer","Korean","Kurdish","Kyrgyz","Lao","Latvian","Lithuanian","Luxembourgish","Macedonian","Malay","Malayalam","Maltese","Maori","Marathi","Mongolian","Nepali","Norwegian","Pashto","Persian","Polish","Portuguese","Punjabi","Romanian","Russian","Serbian","Sinhala","Slovak","Slovenian","Somali","Spanish","Swahili","Swedish","Tajik","Tamil","Telugu","Thai","Turkish","Turkmen","Ukrainian","Urdu","Uzbek","Vietnamese","Welsh","Xhosa","Yoruba","Zulu","Other"];

const PHARMACY_CHAINS_BY_COUNTRY={
  "Canada":["Pharmaprix","Jean Coutu","Uniprix","Familiprix","Brunet","Proxim","IDA","Pharmasave","Lawtons","Rexall","Guardian","Medicine Shoppe","Shoppers Drug Mart","Walmart Pharmacy","Costco Pharmacy","Loblaw Pharmacy","Sobeys Pharmacy","London Drugs","PharmaChoice","Remedy'sRx","Co-op Pharmacy","Other / Independent"],
  "United States":["CVS Pharmacy","Walgreens","Rite Aid","Walmart Pharmacy","Costco Pharmacy","Kroger Pharmacy","Publix Pharmacy","Albertsons Pharmacy","Safeway Pharmacy","Target Pharmacy","Hy-Vee Pharmacy","Meijer Pharmacy","Giant Pharmacy","Stop & Shop Pharmacy","Wegmans Pharmacy","H-E-B Pharmacy","Harris Teeter Pharmacy","Fred Meyer Pharmacy","Kinney Drugs","Health Mart","Good Neighbor Pharmacy","Medicine Shoppe","Other / Independent"],
  "France":["Pharmacie Lafayette","Pharmavie","Giropharm","PHR Pharmacies","Pharmodel","Optipharm","Welcoop","Alphega Pharmacie","Other / Independent"],
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
    const matchS=!search||[p.pharmacy_name,p.email,p.pharmacist_owner,p.pharmacy_address].some(v=>v?.toLowerCase().includes(q));
    const matchP=filterPlan==="all"||p.plan===filterPlan;
    const matchC=filterCountry==="all"||p.country===filterCountry;
    return matchS&&matchP&&matchC;
  });
  const nav=[{id:"overview",icon:"📊",label:"Overview"},{id:"pharmacies",icon:"🏥",label:"Pharmacies"},{id:"revenue",icon:"💰",label:"Revenue"}];
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
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:28}}>
            <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
              <div style={{fontWeight:800,fontSize:14,color:C.navy,marginBottom:16}}>📋 Plans breakdown</div>
              {[{k:"basic",price:49},{k:"pro",price:99},{k:"enterprise",price:249}].map(p=>(
                <div key={p.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><PlanBadge plan={p.k}/><span style={{fontSize:12,color:C.grey}}>{planCounts[p.k]} pharmacies</span></div>
                  <span style={{fontSize:12,fontWeight:700,color:C.navy}}>${planCounts[p.k]*p.price}/mo</span>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
              <div style={{fontWeight:800,fontSize:14,color:C.navy,marginBottom:16}}>🌍 Countries</div>
              {countries.length===0?<div style={{color:C.grey,fontSize:12}}>No data yet</div>:countries.map(c=>(
                <div key={c} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:12,color:C.navy,fontWeight:600}}>{c}</span>
                  <span style={{fontSize:11,color:C.grey}}>{profiles.filter(p=>p.country===c).length} pharmacy</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div style={{fontWeight:800,fontSize:14,color:C.navy}}>🕐 Recent signups</div>
              <button onClick={onViewAll} style={{fontSize:12,color:C.sky,fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>View all →</button>
            </div>
            {recent.length===0?<div style={{color:C.grey,fontSize:12}}>No pharmacies registered yet.</div>:recent.map((p,i)=>(
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
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search pharmacy, email, owner…" style={{...inputStyle,maxWidth:280}}/>
        <select value={filterPlan} onChange={e=>setFilterPlan(e.target.value)} style={sel}>
          <option value="all">All plans</option>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <select value={filterCountry} onChange={e=>setFilterCountry(e.target.value)} style={sel}>
          <option value="all">All countries</option>
          {countries.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      {loading?<div style={{textAlign:"center",padding:60,color:C.grey}}>Loading…</div>:
       profiles.length===0?<div style={{background:"#fff",borderRadius:14,padding:40,textAlign:"center",color:C.grey}}>No pharmacies found.</div>:(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {profiles.map((p,i)=>(
            <div key={i} onClick={()=>onSelect(p)} style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 2px 10px rgba(0,0,0,.06)",cursor:"pointer",border:"1.5px solid transparent"}}
              onMouseEnter={e=>e.currentTarget.style.border="1.5px solid "+C.sky}
              onMouseLeave={e=>e.currentTarget.style.border="1.5px solid transparent"}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <div style={{fontWeight:800,fontSize:15,color:C.navy}}>{p.pharmacy_name||"—"}</div>
                  <div style={{fontSize:12,color:C.grey,marginTop:2}}>{p.email}</div>
                </div>
                <PlanBadge plan={p.plan}/>
              </div>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                {[{icon:"📍",val:[p.pharmacy_address,p.province,p.country].filter(Boolean).join(", ")||"—"},{icon:"👤",val:p.pharmacist_owner||"—"},{icon:"📞",val:p.pharmacy_phone||"—"}].map((item,j)=>(
                  <div key={j} style={{fontSize:11,color:C.grey}}><span style={{marginRight:4}}>{item.icon}</span>{item.val}</div>
                ))}
              </div>
              {(p.dispensing_system||p.inventory_system)&&(
                <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
                  {p.dispensing_system&&<span style={{background:"#EFF6FF",color:C.sky,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6}}>💊 {p.dispensing_system}</span>}
                  {p.inventory_system&&<span style={{background:"#F0FDF4",color:C.green,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6}}>📦 {p.inventory_system}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PharmacyDetail({profile:p,onBack}){
  const rows=[["Pharmacy","pharmacy_name"],["Email","email"],["Plan","plan"],["Country","country"],["Province","province"],["Address","pharmacy_address"],["Phone","pharmacy_phone"],["Pharmacy email","pharmacy_email"],["Permit #","permit_number"],["Pharmacist-owner","pharmacist_owner"],["Owner email","pharmacist_email"],["Manager","owner_name"],["Dispensing system","dispensing_system"],["Inventory system","inventory_system"],["Language","language"]];
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
      {(p.dispensing_system||p.inventory_system)&&(
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {p.dispensing_system&&<span style={{background:"#EFF6FF",color:C.sky,fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:8}}>💊 {p.dispensing_system}</span>}
          {p.inventory_system&&<span style={{background:"#F0FDF4",color:C.green,fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:8}}>📦 {p.inventory_system}</span>}
        </div>
      )}
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
                  <div style={{display:"flex",alignItems:"center",gap:8}}><PlanBadge plan={p.k}/><span style={{fontSize:12,color:C.grey}}>{planCounts[p.k]} pharmacies × ${p.price}/mo</span></div>
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
function formatLocalPhone(digits){
  if(!digits) return "";
  if(digits.length<=3) return digits;
  if(digits.length<=6) return digits.slice(0,3)+"-"+digits.slice(3);
  return digits.slice(0,3)+"-"+digits.slice(3,6)+"-"+digits.slice(6,10);
}
function PhoneField({label,value,onChange,countryCode,required}){
  const code=countryCode||"+1";
  function handle(val){const digits=val.replace(/\D/g,"").slice(0,10);onChange(formatLocalPhone(digits));}
  return(
    <div style={{marginBottom:13}}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div style={{display:"flex",gap:8}}>
        <div style={{padding:"10px 12px",borderRadius:9,border:"1.5px solid #E2E8F0",fontSize:13,fontFamily:"inherit",background:"#EFF6FF",color:"#1E4D8C",fontWeight:800,whiteSpace:"nowrap",flexShrink:0}}>{code}</div>
        <input type="tel" value={value} onChange={e=>handle(e.target.value)} placeholder="514-000-0000"
          style={{...inputStyle,flex:1,border:required&&!value.trim()?"1.5px solid #FCA5A5":"1.5px solid #E2E8F0"}}/>
      </div>
      <div style={{fontSize:10,color:"#9CA3AF",marginTop:3}}>Indicatif / Country code: {code}</div>
    </div>
  );
}

function AddressAutocomplete({value,onChange,placeholder,hint,countryIso,province,required}){
  const [query,setQuery]=useState(value||"");
  const [results,setResults]=useState([]);
  const [open,setOpen]=useState(false);
  const [searching,setSearching]=useState(false);
  const [dropPos,setDropPos]=useState({top:0,left:0,width:300});
  const inputRef=useRef();const dropRef=useRef();const timer=useRef();
  useEffect(()=>{
    function outside(e){const inI=inputRef.current&&inputRef.current.contains(e.target);const inD=dropRef.current&&dropRef.current.contains(e.target);if(!inI&&!inD)setOpen(false);}
    document.addEventListener("mousedown",outside);return()=>document.removeEventListener("mousedown",outside);
  },[]);
  function updatePos(){if(inputRef.current){const r=inputRef.current.getBoundingClientRect();setDropPos({top:r.bottom+4,left:r.left,width:r.width});}}
  function handleInput(val){
    setQuery(val);onChange(val);clearTimeout(timer.current);
    if(val.length<3){setResults([]);setOpen(false);return;}
    updatePos();
    timer.current=setTimeout(async()=>{
      setSearching(true);
      try{
        const params=new URLSearchParams({q:val,limit:7,lang:"fr"});
        if(countryIso) params.set("countrycode",countryIso);
        const coords=PROVINCE_COORDS[province];
        if(coords){params.set("lat",coords.lat);params.set("lon",coords.lon);}
        const r=await fetch("https://photon.komoot.io/api/?"+params);
        const data=await r.json();
        const features=(data.features||[]).filter(f=>f.properties&&(f.properties.street||f.properties.name));
        setResults(features);if(features.length>0){updatePos();setOpen(true);}
      }catch{}
      setSearching(false);
    },400);
  }
  function select(feature){
    const p=feature.properties;const parts=[];
    if(p.housenumber) parts.push(p.housenumber);if(p.street||p.name) parts.push(p.street||p.name);
    if(p.city||p.locality) parts.push(p.city||p.locality);if(p.state) parts.push(p.state);if(p.postcode) parts.push(p.postcode);
    const addr=parts.join(", ")||p.name||"";setQuery(addr);onChange(addr);setOpen(false);setResults([]);
  }
  return(
    <div style={{marginBottom:13}}>
      <FieldLabel required={required}>📍 {placeholder}</FieldLabel>
      <div style={{position:"relative"}}>
        <input ref={inputRef} value={query} onChange={e=>handleInput(e.target.value)}
          onFocus={()=>{if(results.length>0){updatePos();setOpen(true);}}}
          placeholder={placeholder} style={{...inputStyle,border:required&&!value.trim()?"1.5px solid #FCA5A5":"1.5px solid #E2E8F0"}} autoComplete="off"/>
        {searching&&<div style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:12,color:"#6B7280"}}>🔍</div>}
      </div>
      {open&&results.length>0&&(
        <div ref={dropRef} style={{position:"fixed",top:dropPos.top,left:dropPos.left,width:dropPos.width,background:"#fff",border:"1.5px solid #E2E8F0",borderRadius:10,boxShadow:"0 8px 28px rgba(0,0,0,.2)",zIndex:9999,maxHeight:240,overflowY:"auto"}}>
          {results.map((f,i)=>{const p=f.properties;const main=(p.housenumber?p.housenumber+" ":"")+(p.street||p.name||"");const sub=[p.city||p.locality,p.state,p.postcode].filter(Boolean).join(", ");
            return(<div key={i} onClick={()=>select(f)} style={{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid #E2E8F0",background:"#fff"}}>
              <div style={{fontSize:13,fontWeight:600,color:"#0F2744"}}>{main}</div>
              <div style={{fontSize:11,color:"#6B7280",marginTop:2}}>{sub}</div>
            </div>);
          })}
          <div style={{padding:"6px 14px",fontSize:10,color:"#9CA3AF",borderTop:"1px solid #E2E8F0"}}>📍 OpenStreetMap</div>
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
    function outside(e){const inI=inputRef.current&&inputRef.current.contains(e.target);const inD=dropRef.current&&dropRef.current.contains(e.target);if(!inI&&!inD)setOpen(false);}
    document.addEventListener("mousedown",outside);return()=>document.removeEventListener("mousedown",outside);
  },[]);
  function updatePos(){if(inputRef.current){const r=inputRef.current.getBoundingClientRect();setDropPos({top:r.bottom+4,left:r.left,width:r.width});}}
  const filtered=options.filter(o=>!query||o.toLowerCase().includes(query.toLowerCase())).slice(0,20);
  return(
    <div>
      <input ref={inputRef} value={query}
        onChange={e=>{setQuery(e.target.value);onChange(e.target.value);updatePos();setOpen(true);}}
        onFocus={()=>{updatePos();setOpen(true);}}
        placeholder={placeholder} style={{...inputStyle,border:required&&!value.trim()?"1.5px solid #FCA5A5":"1.5px solid #E2E8F0"}} autoComplete="off"/>
      {open&&filtered.length>0&&(
        <div ref={dropRef} style={{position:"fixed",top:dropPos.top,left:dropPos.left,width:dropPos.width,background:"#fff",border:"1.5px solid #E2E8F0",borderRadius:10,boxShadow:"0 8px 28px rgba(0,0,0,.2)",zIndex:9999,maxHeight:220,overflowY:"auto"}}>
          {filtered.map(o=>(
            <div key={o} onClick={()=>{onChange(o);setQuery(o);setOpen(false);}}
              style={{padding:"10px 14px",cursor:"pointer",fontSize:13,color:"#0F2744",borderBottom:"1px solid #E2E8F0",background:value===o?"#EFF6FF":"#fff"}}>{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function SetupScreen({onDone}){
  const [url,setUrl]=useState("");const [key,setKey]=useState("");const [err,setErr]=useState("");
  function connect(){if(!url.trim()||!key.trim()){setErr("Both fields required.");return;}SB.save(url.replace(/\/+$/,""),key);onDone();}
  const inp={width:"100%",padding:"10px 12px",borderRadius:9,border:"1.5px solid "+C.border,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"};
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
              <input value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.ph} style={inp}/>
            </div>
          ))}
          {err&&<div style={{color:C.red,fontSize:11,marginBottom:12}}>{err}</div>}
          <button onClick={connect} style={{width:"100%",padding:13,borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:800,fontSize:14,color:"#fff",background:"linear-gradient(135deg,#1E4D8C,#2E86DE)"}}>Connect →</button>
          <div style={{marginTop:14,fontSize:11,color:C.grey,textAlign:"center"}}>supabase.com → Settings → API Keys → Legacy</div>
        </div>
      </div>
    </div>
  );
}

function AuthScreen({onAuth}){
  const [mode,setMode]=useState("login");const [email,setEmail]=useState("");const [pwd,setPwd]=useState("");const [err,setErr]=useState("");const [busy,setBusy]=useState(false);
  const t=(k)=>T.en[k];
  async function submit(){
    if(!email||!pwd){setErr(t("fillAllFields"));return;}setBusy(true);setErr("");
    const {url,key}=SB.get();
    const ep=mode==="login"?url+"/auth/v1/token?grant_type=password":url+"/auth/v1/signup";
    try{
      const r=await fetch(ep,{method:"POST",headers:{"Content-Type":"application/json","apikey":key},body:JSON.stringify({email,password:pwd})});
      const d=await r.json();
      if(d.access_token){SB.saveSession(d);onAuth(d);}
      else setErr(d.error_description||d.msg||t("authFailed"));
    }catch{setErr(t("networkError"));}
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
          <div style={{display:"flex",marginBottom:20,borderRadius:10,overflow:"hidden",border:"1px solid "+C.border}}>
            {["login","signup"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,padding:"9px",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12,background:mode===m?C.navy:"#fff",color:mode===m?"#fff":C.grey}}>
                {m==="login"?t("login"):t("createAccount")}
              </button>
            ))}
          </div>
          {[{l:"Email",v:email,s:setEmail,t:"email",ph:"pharmacist@clinic.com"},{l:"Password",v:pwd,s:setPwd,t:"password",ph:"Min. 6 characters"}].map(f=>(
            <div key={f.l} style={{marginBottom:13}}>
              <label style={{fontSize:11,fontWeight:700,color:C.grey,display:"block",marginBottom:3}}>{f.l}</label>
              <input type={f.t} value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.ph} onKeyDown={e=>e.key==="Enter"&&submit()} style={inp}/>
            </div>
          ))}
          {err&&<div style={{color:C.red,fontSize:11,marginBottom:10}}>{err}</div>}
          <button onClick={submit} disabled={busy} style={{width:"100%",padding:12,borderRadius:9,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:800,fontSize:13,color:"#fff",background:"linear-gradient(135deg,"+C.navy+","+C.sky+")"}}>
            {busy?"…":mode==="login"?t("signIn"):t("createMyAccount")}
          </button>
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
    onComplete(profile);setSaving(false);
  }
  const pct=(step/3)*100;
  const sel={width:"100%",padding:"10px 12px",borderRadius:9,border:"1.5px solid "+C.border,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",background:"#fff"};
  const nextBtn=(disabled,label,onClick,green)=>(<button onClick={onClick} disabled={disabled} style={{flex:2,padding:13,borderRadius:10,border:"none",cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",fontWeight:800,fontSize:14,color:"#fff",background:green?"linear-gradient(135deg,#1A9E5F,#1E4D8C)":"linear-gradient(135deg,#1E4D8C,#2E86DE)",opacity:disabled?.4:1}}>{label}</button>);
  const backBtn=(onClick)=>(<button onClick={onClick} style={{flex:1,padding:13,borderRadius:10,border:"1.5px solid "+C.border,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,color:C.grey,background:"#fff"}}>{t("back")}</button>);
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0F2744,#1E4D8C,#2E86DE)",padding:"24px 16px",overflowY:"auto"}}>
      <div style={{maxWidth:500,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:40,marginBottom:8}}>💊</div>
          <div style={{color:"#fff",fontWeight:900,fontSize:24}}>{t("welcomeToNarco")}</div>
          <div style={{color:"rgba(255,255,255,.5)",fontSize:12,marginTop:4}}>{t("stepOf")} {step} {t("ofTotal")} 3 · {userEmail}</div>
        </div>
        <div style={{height:4,background:"rgba(255,255,255,.15)",borderRadius:4,marginBottom:22,overflow:"hidden"}}>
          <div style={{height:"100%",width:pct+"%",background:"#2E86DE",borderRadius:4,transition:"width .3s ease"}}/>
        </div>
        <div style={{background:"#fff",borderRadius:20,padding:28,boxShadow:"0 24px 64px rgba(0,0,0,.25)",marginBottom:32}}>
          {step===1&&(<div>
            <div style={{fontWeight:800,fontSize:18,color:C.navy,marginBottom:4}}>🌐 {t("language")}</div>
            <div style={{fontSize:12,color:C.grey,marginBottom:20}}>{t("langSubtitle")}</div>
            <div style={{marginBottom:16}}><FieldLabel>{t("searchLanguage")}</FieldLabel><SearchableSelect options={ALL_LANGUAGES} value={language} onChange={setLanguage} placeholder={t("langPlaceholder")}/></div>
            {language&&<div style={{background:"#EFF6FF",border:"1.5px solid "+C.sky,borderRadius:10,padding:"10px 14px",marginBottom:18,fontSize:12,color:C.sky,fontWeight:700}}>{t("selected")}: {language}</div>}
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
            <div style={{fontSize:12,color:C.grey,marginBottom:2}}>{t("pharmacySubtitle")}</div>
            <div style={{fontSize:10,color:C.red,marginBottom:12}}>{t("requiredNote")}</div>
            <SectionLabel>{t("pharmacyInfoSection")}</SectionLabel>
            <div style={{marginBottom:13}}>
              <FieldLabel required>{t("pharmacyName")}</FieldLabel>
              <SearchableSelect key={"chain-"+country} options={pharmacyOptions} value={pharmacyName} onChange={setPharmacyName} placeholder={t("pharmacyPlaceholder")} required/>
              <div style={{fontSize:10,color:"#9CA3AF",marginTop:3}}>{t("pharmacyNameHint")}</div>
            </div>
            <Field label={t("permitNumber")} value={permitNumber} onChange={setPermitNumber} placeholder={t("permitPlaceholder")}/>
            <AddressAutocomplete key={"addr-"+country} value={pharmacyAddress} onChange={setPharmacyAddress} placeholder={t("addressPlaceholder")} hint={t("addressHint")} countryIso={countryIso} province={province} required/>
            <PhoneField label={t("pharmacyPhone")} value={pharmacyPhone} onChange={setPharmacyPhone} countryCode={countryCode} required/>
            <Field label={t("pharmacyEmail")} value={pharmacyEmail} onChange={setPharmacyEmail} placeholder={t("emailPlaceholder")} type="email"/>
            <SectionLabel>{t("softwareSection")}</SectionLabel>
            <div style={{marginBottom:13}}>
              <FieldLabel required>{t("dispensingSystem")}</FieldLabel>
              <SearchableSelect key={"disp-"+country} options={dispensingOptions} value={dispensingSystem} onChange={setDispensingSystem} placeholder={t("dispensingSystemPlaceholder")} required/>
              <div style={{fontSize:10,color:"#9CA3AF",marginTop:3}}>{t("dispensingSystemHint")}</div>
            </div>
            <div style={{marginBottom:13}}>
              <FieldLabel required>{t("inventorySystem")}</FieldLabel>
              <SearchableSelect key={"inv-"+country} options={inventoryOptions} value={inventorySystem} onChange={setInventorySystem} placeholder={t("inventorySystemPlaceholder")} required/>
              <div style={{fontSize:10,color:"#9CA3AF",marginTop:3}}>{t("inventorySystemHint")}</div>
            </div>
            <SectionLabel>{t("teamSection")}</SectionLabel>
            <Field label={t("pharmacistOwner")} value={pharmacistOwner} onChange={setPharmacistOwner} placeholder={t("ownerPlaceholder")} required/>
            <Field label={t("pharmacistEmail")} value={pharmacistEmail} onChange={setPharmacistEmail} placeholder={t("ownerEmailPlaceholder")} type="email"/>
            <Field label={t("managerName")} value={managerName} onChange={setManagerName} placeholder={t("managerPlaceholder")}/>
            <SectionLabel>{t("planSection")} <span style={{color:C.red}}>*</span></SectionLabel>
            {!plan&&<div style={{fontSize:11,color:C.red,marginBottom:8,fontWeight:600}}>{t("planRequired")}</div>}
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
            <div style={{background:"#FFFBEB",border:"1px solid #FCD34D",borderRadius:10,padding:"10px 14px",fontSize:11,color:"#92400E",marginBottom:18}}>{t("stripeNote")}</div>
            <div style={{display:"flex",gap:10}}>{backBtn(()=>setStep(2))}{nextBtn(!canLaunch||saving,saving?t("saving"):t("launch"),finish,true)}</div>
          </div>)}
        </div>
      </div>
    </div>
  );
}

function Dashboard({session,profile,onLogout}){
  const [page,setPage]=useState("home");
  const email=session?.user?.email||"pharmacist@clinic.com";
  const lang=getLang(profile?.language);
  const t=(k)=>T[lang][k]||T.en[k]||k;
  const nav=[{id:"home",icon:"🏠",label:t("dashboard")},{id:"reco",icon:"⚡",label:t("reconciliation")},{id:"history",icon:"📝",label:t("history")},{id:"clinical",icon:"🏥",label:t("clinical")},{id:"pricing",icon:"💳",label:t("plans")}];
  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div style={{width:200,background:"linear-gradient(180deg,#0F2744,#1E4D8C)",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"20px 14px 12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{fontSize:22}}>💊</div>
            <div><div style={{color:"#fff",fontWeight:900,fontSize:15}}>NarcoSync</div><div style={{color:"rgba(255,255,255,.3)",fontSize:9}}>Universal</div></div>
          </div>
          <div style={{background:"rgba(255,255,255,.07)",borderRadius:10,padding:"8px 10px"}}>
            <div style={{color:"rgba(255,255,255,.4)",fontSize:9}}>{t("loggedInAs")}</div>
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
          <button onClick={onLogout} style={{width:"100%",padding:"8px 10px",borderRadius:10,border:"none",cursor:"pointer",background:"transparent",color:"rgba(255,255,255,.35)",fontSize:11,fontFamily:"inherit",textAlign:"left"}}>{t("signOut")}</button>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",background:C.light}}>
        {page==="home"&&<HomePage onNewReco={()=>setPage("reco")} email={email} t={t} profile={profile}/>}
        {page==="reco"&&<RecoPage onBack={()=>setPage("home")} t={t} profile={profile} session={session}/>}
        {page==="history"&&<PlaceholderPage icon="📝" title={t("history")} desc={t("historyDesc")}/>}
        {page==="clinical"&&<PlaceholderPage icon="🏥" title={t("clinical")} desc={t("clinicalDesc")}/>}
        {page==="pricing"&&<PlaceholderPage icon="💳" title={t("plans")} desc={t("plansDesc")}/>}
      </div>
    </div>
  );
}

function PlaceholderPage({icon,title,desc}){
  return(<div style={{padding:"60px 40px",textAlign:"center"}}><div style={{fontSize:48,marginBottom:16}}>{icon}</div><div style={{fontWeight:800,fontSize:22,color:C.navy,marginBottom:8}}>{title}</div><div style={{fontSize:14,color:C.grey,maxWidth:400,margin:"0 auto"}}>{desc}</div></div>);
}

function HomePage({onNewReco,email,t,profile}){
  const pharmacyName=profile?.pharmacy_name||"";
  const dispensing=profile?.dispensing_system||"";
  const inventory=profile?.inventory_system||"";
  return(
    <div style={{padding:"28px 32px"}}>
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:900,fontSize:22,color:C.navy}}>{t("welcomeMsg")}</div>
        <div style={{color:C.grey,fontSize:13,marginTop:4}}>{email}</div>
        {pharmacyName&&<div style={{color:C.sky,fontSize:12,fontWeight:600,marginTop:2}}>🏥 {pharmacyName}</div>}
        {(dispensing||inventory)&&(
          <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
            {dispensing&&<span style={{background:"#EFF6FF",color:C.sky,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:6}}>💊 {dispensing}</span>}
            {inventory&&<span style={{background:"#F0FDF4",color:C.green,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:6}}>📦 {inventory}</span>}
          </div>
        )}
      </div>
      <div style={{background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",border:"1.5px solid #FCD34D",borderRadius:14,padding:"16px 20px",marginBottom:24}}>
        <div style={{fontWeight:800,fontSize:14,color:C.navy}}>{t("liveMsg")}</div>
        <div style={{fontSize:12,color:C.grey,marginTop:2}}>{t("liveSubMsg")}</div>
      </div>
      <div style={{background:"#fff",borderRadius:14,padding:32,boxShadow:"0 2px 10px rgba(0,0,0,.06)",textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:40,marginBottom:12}}>📊</div>
        <div style={{fontWeight:800,fontSize:16,color:C.navy,marginBottom:6}}>{t("emptyState")}</div>
        <div style={{fontSize:13,color:C.grey,maxWidth:300,margin:"0 auto"}}>{t("emptyStateSub")}</div>
      </div>
      <button onClick={onNewReco} style={{width:"100%",padding:16,borderRadius:14,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:900,fontSize:15,color:"#fff",background:"linear-gradient(135deg,#2E86DE,#0F2744)",boxShadow:"0 6px 20px rgba(46,134,222,.35)"}}>
        {t("newReco")}
      </button>
    </div>
  );
}

// ── RECONCILIATION TABLE ─────────────────────────────────────
function RecoTable({session,profile,onComplete,lang}){
  const [molecules,setMolecules]=useState(DEFAULT_MOLECULES.map(m=>({...m})));
  const [saving,setSaving]=useState(false);
  const [nextId,setNextId]=useState(DEFAULT_MOLECULES.length+1);

  function update(id,field,value){setMolecules(prev=>prev.map(m=>m.id===id?{...m,[field]:value}:m));}
  function addRow(){setMolecules(prev=>[...prev,{id:nextId,name:"",strength:"",opening:0,received:0,dispensed:0,physical:"",notes:""}]);setNextId(n=>n+1);}
  function removeRow(id){setMolecules(prev=>prev.filter(m=>m.id!==id));}
  function getTheoretical(m){return(Number(m.opening)||0)+(Number(m.received)||0)-(Number(m.dispensed)||0);}
  function getDiscrepancy(m){if(m.physical==="")return null;return getTheoretical(m)-(Number(m.physical)||0);}

  const totalDisc=molecules.filter(m=>getDiscrepancy(m)!==null&&getDiscrepancy(m)!==0).length;
  const allFilled=molecules.length>0&&molecules.every(m=>m.physical!=="");
  const fr=lang==="fr";

  async function save(){
    setSaving(true);
    const {url,key}=SB.get();
    const cycle={pharmacy_id:session?.user?.id,pharmacy_name:profile?.pharmacy_name,dispensing_system:profile?.dispensing_system,inventory_system:profile?.inventory_system,molecules:JSON.stringify(molecules),total_molecules:molecules.length,total_discrepancies:totalDisc,completed_at:new Date().toISOString()};
    try{await fetch(url+"/rest/v1/reconciliations",{method:"POST",headers:{"apikey":key,"Authorization":"Bearer "+session.access_token,"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify(cycle)});}catch{}
    setSaving(false);
    onComplete({totalDisc,totalMolecules:molecules.length});
  }

  const th={padding:"8px 10px",fontSize:10,fontWeight:800,color:C.grey,textAlign:"left",whiteSpace:"nowrap",borderBottom:"2px solid #E2E8F0",background:"#F8FAFC"};
  const td={padding:"5px 7px",fontSize:12,verticalAlign:"middle",borderBottom:"1px solid #F3F4F6"};
  const ni={width:60,padding:"4px 6px",borderRadius:6,border:"1.5px solid #E2E8F0",fontSize:12,fontFamily:"inherit",textAlign:"center",boxSizing:"border-box"};
  const pi={width:70,padding:"4px 6px",borderRadius:6,border:"2px solid "+C.sky,fontSize:13,fontFamily:"inherit",textAlign:"center",fontWeight:700,background:"#EFF6FF",boxSizing:"border-box"};

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontWeight:900,fontSize:18,color:C.navy}}>📋 {fr?"Tableau de réconciliation":"Reconciliation Table"}</div>
          <div style={{fontSize:12,color:C.grey,marginTop:2}}>{fr?"Saisissez les quantités · Les écarts sont calculés automatiquement":"Enter quantities · Discrepancies calculated automatically"}</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          {totalDisc>0&&<span style={{background:"#FEF2F2",color:C.red,fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:20}}>⚠️ {totalDisc} {fr?"écart(s)":"discrepancy(ies)"}</span>}
          {totalDisc===0&&allFilled&&<span style={{background:"#F0FDF4",color:C.green,fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:20}}>✅ {fr?"Tout équilibré":"All balanced"}</span>}
        </div>
      </div>

      <div style={{overflowX:"auto",borderRadius:12,border:"1.5px solid #E2E8F0",marginBottom:14,background:"#fff"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:920}}>
          <thead>
            <tr>
              <th style={th}>{fr?"Molécule":"Molecule"}</th>
              <th style={th}>{fr?"Force":"Strength"}</th>
              <th style={{...th,color:"#6B7280"}}>📦 {fr?"Ouverture":"Opening"}</th>
              <th style={{...th,color:C.orange}}>+ {fr?"Reçu CSP":"Received CSP"}</th>
              <th style={{...th,color:C.red}}>− {fr?"Dispensé":"Dispensed"}</th>
              <th style={{...th,color:"#7C3AED"}}>= {fr?"Théorique":"Theoretical"}</th>
              <th style={{...th,color:C.sky,background:"#EFF6FF"}}>🔵 {fr?"Inventaire physique":"Physical count"}</th>
              <th style={th}>{fr?"Écart":"Discrepancy"}</th>
              <th style={{...th,minWidth:130}}>{fr?"Notes / Justification":"Notes / Justification"}</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {molecules.map((m,i)=>{
              const theo=getTheoretical(m);
              const disc=getDiscrepancy(m);
              return(
                <tr key={m.id} style={{background:i%2===0?"#fff":"#FAFAFA"}}>
                  <td style={td}><input value={m.name} onChange={e=>update(m.id,"name",e.target.value)} style={{...ni,width:120,textAlign:"left"}} placeholder={fr?"Molécule":"Molecule"}/></td>
                  <td style={td}><input value={m.strength} onChange={e=>update(m.id,"strength",e.target.value)} style={{...ni,width:72,textAlign:"left"}} placeholder={fr?"Force":"Strength"}/></td>
                  <td style={td}><input type="number" value={m.opening} onChange={e=>update(m.id,"opening",e.target.value)} style={ni} min="0"/></td>
                  <td style={td}><input type="number" value={m.received} onChange={e=>update(m.id,"received",e.target.value)} style={{...ni,borderColor:C.orange}} min="0"/></td>
                  <td style={td}><input type="number" value={m.dispensed} onChange={e=>update(m.id,"dispensed",e.target.value)} style={{...ni,borderColor:C.red}} min="0"/></td>
                  <td style={{...td,textAlign:"center"}}><span style={{fontWeight:900,fontSize:15,color:"#7C3AED"}}>{theo}</span></td>
                  <td style={{...td,background:"#EFF6FF"}}><input type="number" value={m.physical} onChange={e=>update(m.id,"physical",e.target.value)} style={pi} placeholder="—" min="0"/></td>
                  <td style={{...td,textAlign:"center"}}>
                    {disc===null?<span style={{color:"#D1D5DB",fontSize:11}}>—</span>:
                     disc===0?<span style={{color:C.green,fontWeight:800}}>✓ 0</span>:
                     <span style={{color:C.red,fontWeight:800}}>⚠️ {disc>0?"+":""}{disc}</span>}
                  </td>
                  <td style={td}><input value={m.notes} onChange={e=>update(m.id,"notes",e.target.value)} style={{...ni,width:140,textAlign:"left"}} placeholder={fr?"Justification…":"Justification…"}/></td>
                  <td style={td}><button onClick={()=>removeRow(m.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#D1D5DB",fontSize:18,lineHeight:1}}>×</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button onClick={addRow} style={{padding:"8px 16px",borderRadius:9,border:"1.5px dashed #E2E8F0",background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:C.grey,fontWeight:600,marginBottom:20}}>
        + {fr?"Ajouter une molécule":"Add molecule"}
      </button>

      <div style={{background:"#fff",borderRadius:12,padding:18,boxShadow:"0 2px 10px rgba(0,0,0,.06)",marginBottom:20}}>
        <div style={{fontWeight:800,fontSize:13,color:C.navy,marginBottom:12}}>{fr?"Résumé":"Summary"}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {[{label:fr?"Molécules":"Molecules",val:molecules.length,col:C.sky},{label:fr?"Inventaires saisis":"Counts entered",val:molecules.filter(m=>m.physical!=="").length,col:"#7C3AED"},{label:fr?"Écarts":"Discrepancies",val:totalDisc,col:totalDisc>0?C.red:C.green}].map(s=>(
            <div key={s.label} style={{background:C.light,borderRadius:10,padding:"12px 16px",borderLeft:"4px solid "+s.col}}>
              <div style={{fontSize:24,fontWeight:900,color:s.col}}>{s.val}</div>
              <div style={{fontSize:11,color:C.grey,marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={save} disabled={saving||molecules.length===0} style={{width:"100%",padding:14,borderRadius:12,border:"none",cursor:saving||molecules.length===0?"not-allowed":"pointer",fontFamily:"inherit",fontWeight:800,fontSize:14,color:"#fff",background:"linear-gradient(135deg,#1A9E5F,#1E4D8C)",opacity:saving||molecules.length===0?.5:1}}>
        {saving?"Saving…":fr?"💾 Sauvegarder ce cycle de réconciliation":"💾 Save this reconciliation cycle"}
      </button>
    </div>
  );
}

// ── RECO PAGE — 3 steps: upload → table → done ───────────────
function RecoPage({onBack,t,profile,session}){
  const [step,setStep]=useState("upload");
  const [files,setFiles]=useState({disp:null,inv:null,csp:null,cmd:null});
  const [result,setResult]=useState(null);
  const dispensing=profile?.dispensing_system||"";
  const inventory=profile?.inventory_system||"";
  const lang=getLang(profile?.language);
  const fr=lang==="fr";

  const sections=[
    {k:"disp",label:t("salesLabel"),desc:dispensing?`${dispensing} · CSV · Excel · Tout format`:t("salesDesc"),color:"#EFF6FF",border:C.sky},
    {k:"inv",label:t("inventoryLabel"),desc:inventory?`${inventory} · CSV · Excel · Tout format`:t("inventoryDesc"),color:"#F0FDF4",border:C.green},
    {k:"csp",label:t("cspLabel"),desc:t("cspDesc"),color:"#FFF7ED",border:C.orange},
    {k:"cmd",label:t("regularOrderLabel"),desc:t("regularOrderDesc"),color:"#F5F3FF",border:"#7C3AED"},
  ];

  if(step==="table"){
    return(
      <div style={{padding:"28px 32px"}}>
        <button onClick={()=>setStep("upload")} style={{marginBottom:20,padding:"7px 14px",borderRadius:8,border:"1px solid "+C.border,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:C.grey}}>{t("back")}</button>
        <RecoTable session={session} profile={profile} lang={lang} onComplete={r=>{setResult(r);setStep("done");}}/>
      </div>
    );
  }

  if(step==="done"){
    return(
      <div style={{padding:"28px 32px"}}>
        <div style={{background:"#fff",borderRadius:14,padding:32,boxShadow:"0 2px 10px rgba(0,0,0,.06)",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:12}}>{result?.totalDisc>0?"⚠️":"✅"}</div>
          <div style={{fontWeight:800,fontSize:20,color:C.navy,marginBottom:8}}>{t("recoComplete")}</div>
          <div style={{fontSize:13,color:C.grey,marginBottom:6}}>{result?.totalMolecules} {fr?"molécules":"molecules"}</div>
          <div style={{fontSize:14,fontWeight:700,marginBottom:20,color:result?.totalDisc>0?C.red:C.green}}>
            {result?.totalDisc>0?`⚠️ ${result.totalDisc} ${fr?"écart(s) détecté(s)":"discrepancy(ies) found"}`:`✅ ${fr?"Tout équilibré":"All balanced"}`}
          </div>
          <button onClick={()=>{setStep("upload");setFiles({disp:null,inv:null,csp:null,cmd:null});setResult(null);}} style={{padding:"10px 24px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,color:"#fff",background:C.sky}}>
            {t("newRecoBtn")}
          </button>
        </div>
      </div>
    );
  }

  return(
    <div style={{padding:"28px 32px"}}>
      <button onClick={onBack} style={{marginBottom:20,padding:"7px 14px",borderRadius:8,border:"1px solid "+C.border,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:C.grey}}>{t("back")}</button>
      <div style={{fontWeight:900,fontSize:20,color:C.navy,marginBottom:4}}>{t("newRecoTitle")}</div>
      <div style={{color:C.grey,fontSize:12,marginBottom:16}}>{t("newRecoSub")}</div>
      {(dispensing||inventory)&&(
        <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
          {dispensing&&<span style={{background:"#EFF6FF",color:C.sky,fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:8}}>💊 {dispensing}</span>}
          {inventory&&<span style={{background:"#F0FDF4",color:C.green,fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:8}}>📦 {inventory}</span>}
        </div>
      )}
      {sections.map(f=>(
        <div key={f.k} style={{background:f.color,borderRadius:14,padding:20,marginBottom:14,boxShadow:"0 2px 10px rgba(0,0,0,.06)",border:`2px dashed ${files[f.k]?C.green:f.border}`}}>
          <div style={{fontWeight:700,fontSize:14,color:C.navy,marginBottom:4}}>{f.label}</div>
          <div style={{fontSize:12,color:C.grey,marginBottom:12}}>{f.desc}</div>
          <input type="file" accept=".csv,.xlsx,.xls,.pdf,.jpg,.png" onChange={e=>setFiles(v=>({...v,[f.k]:e.target.files[0]}))} style={{fontSize:12}}/>
          {files[f.k]&&<div style={{color:C.green,fontWeight:700,fontSize:12,marginTop:8}}>✓ {files[f.k].name}</div>}
        </div>
      ))}
      <div style={{background:"#F0FDF4",border:"1px solid "+C.green,borderRadius:10,padding:"12px 16px",fontSize:12,color:"#166534",marginBottom:16}}>
        💡 {fr?"Vous pouvez aussi procéder directement à la saisie manuelle sans téléverser de fichiers.":"You can also proceed directly to manual entry without uploading files."}
      </div>
      <button onClick={()=>setStep("table")} style={{width:"100%",padding:14,borderRadius:12,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:800,fontSize:14,color:"#fff",background:"linear-gradient(135deg,#2E86DE,#0F2744)"}}>
        {t("reconcileNow")}
      </button>
    </div>
  );
}

export default function App(){
  const [configured,setConfigured]=useState(SB.isConfigured());
  const [session,setSession]=useState(SB.getSession());
  const [profile,setProfile]=useState(SB.getProfile());
  const [loading,setLoading]=useState(()=>!!(SB.getSession()&&!SB.getProfile()));
  useEffect(()=>{
    if(session&&!profile&&session.user.email!==ADMIN_EMAIL){
      setLoading(true);
      const {url,key}=SB.get();
      fetch(url+"/rest/v1/profiles?id=eq."+session.user.id,{headers:{"apikey":key,"Authorization":"Bearer "+session.access_token}})
        .then(r=>r.json())
        .then(data=>{if(Array.isArray(data)&&data.length>0){SB.saveProfile(data[0]);setProfile(data[0]);}setLoading(false);})
        .catch(()=>setLoading(false));
    }
  },[session]);
  const logout=()=>{SB.clearSession();SB.clearProfile();setSession(null);setProfile(null);};
  if(!configured) return <SetupScreen onDone={()=>setConfigured(true)}/>;
  if(!session) return <AuthScreen onAuth={s=>{SB.saveSession(s);setSession(s);if(s.user.email!==ADMIN_EMAIL)setLoading(true);}}/>;
  if(session.user.email===ADMIN_EMAIL) return <AdminDashboard session={session} onLogout={logout}/>;
  if(loading) return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.light}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:36,marginBottom:12}}>💊</div><div style={{fontSize:14,color:C.grey,fontWeight:600}}>Loading NarcoSync…</div></div>
    </div>
  );
  if(!profile) return <OnboardingWizard userEmail={session.user.email} onComplete={p=>{SB.saveProfile(p);setProfile(p);}} session={session}/>;
  return <Dashboard session={session} profile={profile} onLogout={logout}/>;
}
