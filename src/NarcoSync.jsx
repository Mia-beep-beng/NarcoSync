import React, { useState, useRef, useEffect } from "react";

const C = {
  navy:"#0F2744",blue:"#1E4D8C",sky:"#2E86DE",
  green:"#1A9E5F",red:"#D63031",orange:"#E67E22",
  light:"#F4F7FB",white:"#FFFFFF",grey:"#6B7280",border:"#E2E8F0",
};

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
    pharmacyName:"Pharmacy name",permitNumber:"Permit / License number",
    pharmacyAddress:"Pharmacy address",pharmacyPhone:"Pharmacy phone",pharmacyEmail:"Pharmacy email",
    pharmacistOwner:"Pharmacist-owner name",pharmacistEmail:"Pharmacist-owner email",
    managerName:"Your name (team lead / manager)",
    pharmacyPlaceholder:"Type to search or enter custom name…",
    permitPlaceholder:"e.g. OPQ-12345",addressPlaceholder:"Street address, City, Province/State",
    phonePlaceholder:"(000) 000-0000",emailPlaceholder:"info@pharmacy.com",
    ownerPlaceholder:"Full name",ownerEmailPlaceholder:"owner@pharmacy.com",managerPlaceholder:"Your full name",
    stripeNote:"💳 Payment setup via Stripe after onboarding — no card required now.",
    welcomeToNarco:"Welcome to NarcoSync",stepOf:"Step",ofTotal:"of",
    dashboard:"Dashboard",reconciliation:"Reconciliation",history:"History",
    clinical:"Clinical",plans:"Plans",signOut:"🔒 Sign out",loggedInAs:"LOGGED IN AS",
    welcomeMsg:"Welcome to NarcoSync 👋",liveMsg:"🎉 NarcoSync is live!",
    liveSubMsg:"Connected to Supabase · Ready for reconciliation",
    lastCycle:"Last cycle",molecules:"Molecules",discrepancies:"Discrepancies",
    newReco:"⚡ + New Reconciliation",newRecoTitle:"⚡ New Reconciliation",
    newRecoSub:"Upload your inventory and sales files · Any format",
    inventoryLabel:"📦 Inventory",inventoryDesc:"Matrix/MMS export · Excel · CSV · Scan",
    salesLabel:"💊 Sales / Dispensing",salesDesc:"AssiStRx CSV · Any dispensing system",
    reconcileNow:"⚡ Reconcile now →",recoComplete:"Reconciliation complete!",
    recoCompleteSub:"NarcoSync is live and connected to Supabase.",newRecoBtn:"New reconciliation",
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
    pharmacyName:"Nom de la pharmacie",permitNumber:"Numéro de permis / licence",
    pharmacyAddress:"Adresse de la pharmacie",pharmacyPhone:"Téléphone",pharmacyEmail:"Courriel de la pharmacie",
    pharmacistOwner:"Nom du pharmacien-propriétaire",pharmacistEmail:"Courriel du pharmacien-propriétaire",
    managerName:"Votre nom (chef d'équipe / gestionnaire)",
    pharmacyPlaceholder:"Tapez pour chercher ou entrez un nom…",
    permitPlaceholder:"ex. OPQ-12345",addressPlaceholder:"Adresse, Ville, Province/État",
    phonePlaceholder:"(000) 000-0000",emailPlaceholder:"info@pharmacie.com",
    ownerPlaceholder:"Nom complet",ownerEmailPlaceholder:"proprio@pharmacie.com",managerPlaceholder:"Votre nom complet",
    stripeNote:"💳 Paiement configuré via Stripe après l'inscription — aucune carte requise maintenant.",
    welcomeToNarco:"Bienvenue sur NarcoSync",stepOf:"Étape",ofTotal:"sur",
    dashboard:"Tableau de bord",reconciliation:"Réconciliation",history:"Historique",
    clinical:"Clinique",plans:"Forfaits",signOut:"🔒 Se déconnecter",loggedInAs:"CONNECTÉ EN TANT QUE",
    welcomeMsg:"Bienvenue sur NarcoSync 👋",liveMsg:"🎉 NarcoSync est en ligne!",
    liveSubMsg:"Connecté à Supabase · Prêt pour la réconciliation",
    lastCycle:"Dernier cycle",molecules:"Molécules",discrepancies:"Écarts",
    newReco:"⚡ + Nouvelle réconciliation",newRecoTitle:"⚡ Nouvelle réconciliation",
    newRecoSub:"Téléversez vos fichiers d'inventaire et de ventes · Tout format",
    inventoryLabel:"📦 Inventaire",inventoryDesc:"Export Matrix/MMS · Excel · CSV · Scan",
    salesLabel:"💊 Ventes / Dispensation",salesDesc:"CSV AssiStRx · Tout système de dispensation",
    reconcileNow:"⚡ Réconcilier maintenant →",recoComplete:"Réconciliation complète!",
    recoCompleteSub:"NarcoSync est en ligne et connecté à Supabase.",newRecoBtn:"Nouvelle réconciliation",
    historyDesc:"Vos cycles de réconciliation passés apparaîtront ici.",
    clinicalDesc:"Calculateurs, affections mineures, guide de facturation — à venir.",
    plansDesc:"Basique 49$ · Pro 99$ · Entreprise 249$ CAD/mois.",
    basicLabel:"Basique",basicDesc:"1 pharmacie · Réconciliation principale",basicPrice:"49$ CAD/mois",
    proLabel:"Pro",proDesc:"Jusqu'à 3 pharmacies · Outils cliniques",proPrice:"99$ CAD/mois",
    enterpriseLabel:"Entreprise",enterpriseDesc:"Illimité · API · Rapports personnalisés",enterprisePrice:"249$ CAD/mois",
  }
};

function getLang(language){
  if(!language) return "en";
  if(language.startsWith("Français")||language.includes("Bilingual")||language.includes("Bilingue")) return "fr";
  return "en";
}

const SB = {
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

// ── Moved OUTSIDE components so they don't remount on every keystroke ──
const inputStyle={width:"100%",padding:"10px 12px",borderRadius:9,border:"1.5px solid #E2E8F0",fontSize:13,fontFamily:"inherit",boxSizing:"border-box",background:"#fff"};

function FieldLabel({children}){
  return <label style={{fontSize:11,fontWeight:700,color:"#6B7280",display:"block",marginBottom:4}}>{children}</label>;
}

function Field({label,value,onChange,placeholder,type="text"}){
  return(
    <div style={{marginBottom:13}}>
      <FieldLabel>{label}</FieldLabel>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={inputStyle}/>
    </div>
  );
}

function SectionLabel({children}){
  return <div style={{fontSize:10,fontWeight:800,color:"#2E86DE",letterSpacing:1,marginBottom:10,marginTop:16,textTransform:"uppercase"}}>{children}</div>;
}

function SearchableSelect({options,value,onChange,placeholder}){
  const [query,setQuery]=useState(value||"");
  const [open,setOpen]=useState(false);
  const ref=useRef();
  useEffect(()=>{
    function outside(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false);}
    document.addEventListener("mousedown",outside);
    return()=>document.removeEventListener("mousedown",outside);
  },[]);
  useEffect(()=>{setQuery(value||"");},[value]);
  const filtered=options.filter(o=>!query||o.toLowerCase().includes(query.toLowerCase())).slice(0,18);
  return(
    <div ref={ref} style={{position:"relative"}}>
      <input value={query} onChange={e=>{setQuery(e.target.value);onChange(e.target.value);setOpen(true);}} onFocus={()=>setOpen(true)} placeholder={placeholder} style={inputStyle} autoComplete="off"/>
      {open&&filtered.length>0&&(
        <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#fff",border:"1.5px solid #E2E8F0",borderRadius:10,boxShadow:"0 8px 28px rgba(0,0,0,.14)",zIndex:200,maxHeight:200,overflowY:"auto"}}>
          {filtered.map(o=>(
            <div key={o} onMouseDown={e=>e.preventDefault()} onClick={()=>{onChange(o);setQuery(o);setOpen(false);}} style={{padding:"10px 14px",cursor:"pointer",fontSize:13,color:"#0F2744",borderBottom:"1px solid #E2E8F0",background:value===o?"#EFF6FF":"#fff"}}>{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function SetupScreen({onDone}){
  const [url,setUrl]=useState("");
  const [key,setKey]=useState("");
  const [err,setErr]=useState("");
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
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [pwd,setPwd]=useState("");
  const [err,setErr]=useState("");
  const [busy,setBusy]=useState(false);
  const t=(k)=>T.en[k];
  async function submit(){
    if(!email||!pwd){setErr(t("fillAllFields"));return;}
    setBusy(true);setErr("");
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
  const [language,setLanguage]=useState("");
  const [country,setCountry]=useState("Canada");
  const [province,setProvince]=useState("");
  const [pharmacyName,setPharmacyName]=useState("");
  const [pharmacyPhone,setPharmacyPhone]=useState("");
  const [pharmacyEmail,setPharmacyEmail]=useState("");
  const [pharmacyAddress,setPharmacyAddress]=useState("");
  const [permitNumber,setPermitNumber]=useState("");
  const [pharmacistOwner,setPharmacistOwner]=useState("");
  const [pharmacistEmail,setPharmacistEmail]=useState("");
  const [managerName,setManagerName]=useState("");
  const [plan,setPlan]=useState("");
  const [saving,setSaving]=useState(false);

  const lang=getLang(language);
  const t=(k)=>T[lang][k]||T.en[k]||k;
  const pharmacyOptions=PHARMACY_CHAINS_BY_COUNTRY[country]||DEFAULT_CHAINS;
  useEffect(()=>{setPharmacyName("");},[country]);

  async function finish(){
    setSaving(true);
    const profile={id:session.user.id,email:userEmail,language,country,province,pharmacy_name:pharmacyName,pharmacy_phone:pharmacyPhone,pharmacy_email:pharmacyEmail,pharmacy_address:pharmacyAddress,permit_number:permitNumber,pharmacist_owner:pharmacistOwner,pharmacist_email:pharmacistEmail,owner_name:managerName,plan};
    const {url,key}=SB.get();
    try{await fetch(url+"/rest/v1/profiles",{method:"POST",headers:{"apikey":key,"Authorization":"Bearer "+session.access_token,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates"},body:JSON.stringify(profile)});}catch{}
    onComplete(profile);setSaving(false);
  }

  const pct=(step/3)*100;
  const sel={width:"100%",padding:"10px 12px",borderRadius:9,border:"1.5px solid "+C.border,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",background:"#fff"};
  const nextBtn=(disabled,label,onClick,green)=>(<button onClick={onClick} disabled={disabled} style={{flex:2,padding:13,borderRadius:10,border:"none",cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",fontWeight:800,fontSize:14,color:"#fff",background:green?"linear-gradient(135deg,#1A9E5F,#1E4D8C)":"linear-gradient(135deg,#1E4D8C,#2E86DE)",opacity:disabled?.4:1}}>{label}</button>);
  const backBtn=(onClick)=>(<button onClick={onClick} style={{flex:1,padding:13,borderRadius:10,border:"1.5px solid "+C.border,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,color:C.grey,background:"#fff"}}>{t("back")}</button>);

  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"linear-gradient(135deg,#0F2744,#1E4D8C,#2E86DE)"}}>
      <div style={{width:"100%",maxWidth:500}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:40,marginBottom:8}}>💊</div>
          <div style={{color:"#fff",fontWeight:900,fontSize:24}}>{t("welcomeToNarco")}</div>
          <div style={{color:"rgba(255,255,255,.5)",fontSize:12,marginTop:4}}>{t("stepOf")} {step} {t("ofTotal")} 3 · {userEmail}</div>
        </div>
        <div style={{height:4,background:"rgba(255,255,255,.15)",borderRadius:4,marginBottom:22,overflow:"hidden"}}>
          <div style={{height:"100%",width:pct+"%",background:"#2E86DE",borderRadius:4,transition:"width .3s ease"}}/>
        </div>
        <div style={{background:"#fff",borderRadius:20,padding:28,boxShadow:"0 24px 64px rgba(0,0,0,.25)",maxHeight:"80vh",overflowY:"auto"}}>

          {step===1&&(
            <div>
              <div style={{fontWeight:800,fontSize:18,color:C.navy,marginBottom:4}}>🌐 {t("language")}</div>
              <div style={{fontSize:12,color:C.grey,marginBottom:20}}>{t("langSubtitle")}</div>
              <div style={{marginBottom:16}}>
                <FieldLabel>{t("searchLanguage")}</FieldLabel>
                <SearchableSelect options={ALL_LANGUAGES} value={language} onChange={setLanguage} placeholder={t("langPlaceholder")}/>
              </div>
              {language&&<div style={{background:"#EFF6FF",border:"1.5px solid "+C.sky,borderRadius:10,padding:"10px 14px",marginBottom:18,fontSize:12,color:C.sky,fontWeight:700}}>{t("selected")}: {language}</div>}
              {nextBtn(!language.trim(),t("next"),()=>setStep(2))}
            </div>
          )}

          {step===2&&(
            <div>
              <div style={{fontWeight:800,fontSize:18,color:C.navy,marginBottom:4}}>📍 {t("location")}</div>
              <div style={{fontSize:12,color:C.grey,marginBottom:20}}>{t("locationSubtitle")}</div>
              <div style={{marginBottom:14}}>
                <FieldLabel>{t("country")}</FieldLabel>
                <select value={country} onChange={e=>{setCountry(e.target.value);setProvince("");}} style={sel}>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</select>
              </div>
              <div style={{marginBottom:22}}>
                <FieldLabel>{country==="Canada"?t("province"):country==="United States"?t("state"):t("regionCity")}</FieldLabel>
                {country==="Canada"?(<select value={province} onChange={e=>setProvince(e.target.value)} style={sel}><option value="">{t("selectProvince")}</option>{CA_PROVINCES.map(p=><option key={p}>{p}</option>)}</select>):country==="United States"?(<select value={province} onChange={e=>setProvince(e.target.value)} style={sel}><option value="">{t("selectState")}</option>{US_STATES.map(p=><option key={p}>{p}</option>)}</select>):(<input value={province} onChange={e=>setProvince(e.target.value)} placeholder={t("enterRegion")} style={inputStyle}/>)}
              </div>
              <div style={{display:"flex",gap:10}}>{backBtn(()=>setStep(1))}{nextBtn(!province,t("next"),()=>setStep(3))}</div>
            </div>
          )}

          {step===3&&(
            <div>
              <div style={{fontWeight:800,fontSize:18,color:C.navy,marginBottom:4}}>🏥 {t("yourPharmacy")}</div>
              <div style={{fontSize:12,color:C.grey,marginBottom:4}}>{t("pharmacySubtitle")}</div>

              <SectionLabel>{t("pharmacyInfoSection")}</SectionLabel>
              <div style={{marginBottom:13}}>
                <FieldLabel>{t("pharmacyName")} — {country}</FieldLabel>
                <SearchableSelect options={pharmacyOptions} value={pharmacyName} onChange={setPharmacyName} placeholder={t("pharmacyPlaceholder")}/>
              </div>
              <Field label={t("permitNumber")} value={permitNumber} onChange={setPermitNumber} placeholder={t("permitPlaceholder")}/>
              <Field label={t("pharmacyAddress")} value={pharmacyAddress} onChange={setPharmacyAddress} placeholder={t("addressPlaceholder")}/>
              <Field label={t("pharmacyPhone")} value={pharmacyPhone} onChange={setPharmacyPhone} placeholder={t("phonePlaceholder")} type="tel"/>
              <Field label={t("pharmacyEmail")} value={pharmacyEmail} onChange={setPharmacyEmail} placeholder={t("emailPlaceholder")} type="email"/>

              <SectionLabel>{t("teamSection")}</SectionLabel>
              <Field label={t("pharmacistOwner")} value={pharmacistOwner} onChange={setPharmacistOwner} placeholder={t("ownerPlaceholder")}/>
              <Field label={t("pharmacistEmail")} value={pharmacistEmail} onChange={setPharmacistEmail} placeholder={t("ownerEmailPlaceholder")} type="email"/>
              <Field label={t("managerName")} value={managerName} onChange={setManagerName} placeholder={t("managerPlaceholder")}/>

              <SectionLabel>{t("planSection")}</SectionLabel>
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
              <div style={{display:"flex",gap:10}}>{backBtn(()=>setStep(2))}{nextBtn(!pharmacyName.trim()||saving,saving?t("saving"):t("launch"),finish,true)}</div>
            </div>
          )}
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
        {page==="home"&&<HomePage onNewReco={()=>setPage("reco")} email={email} t={t}/>}
        {page==="reco"&&<RecoPage onBack={()=>setPage("home")} t={t}/>}
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

function HomePage({onNewReco,email,t}){
  return(
    <div style={{padding:"28px 32px"}}>
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:900,fontSize:22,color:C.navy}}>{t("welcomeMsg")}</div>
        <div style={{color:C.grey,fontSize:13,marginTop:4}}>{email}</div>
      </div>
      <div style={{background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",border:"1.5px solid #FCD34D",borderRadius:14,padding:"16px 20px",marginBottom:24}}>
        <div style={{fontWeight:800,fontSize:14,color:C.navy}}>{t("liveMsg")}</div>
        <div style={{fontSize:12,color:C.grey,marginTop:2}}>{t("liveSubMsg")}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
        {[{icon:"⚡",label:t("lastCycle"),val:"V75",col:C.sky},{icon:"💊",label:t("molecules"),val:"250",col:"#7C3AED"},{icon:"⚠️",label:t("discrepancies"),val:"18",col:C.red}].map(s=>(
          <div key={s.label} style={{background:"#fff",borderRadius:14,padding:18,boxShadow:"0 2px 10px rgba(0,0,0,.06)",borderTop:"4px solid "+s.col}}>
            <div style={{fontSize:22,marginBottom:8}}>{s.icon}</div>
            <div style={{fontSize:26,fontWeight:900,color:s.col}}>{s.val}</div>
            <div style={{fontSize:11,color:C.grey,marginTop:4}}>{s.label}</div>
          </div>
        ))}
      </div>
      <button onClick={onNewReco} style={{width:"100%",padding:16,borderRadius:14,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:900,fontSize:15,color:"#fff",background:"linear-gradient(135deg,#2E86DE,#0F2744)",boxShadow:"0 6px 20px rgba(46,134,222,.35)"}}>
        {t("newReco")}
      </button>
    </div>
  );
}

function RecoPage({onBack,t}){
  const [files,setFiles]=useState({inv:null,sales:null});
  const [done,setDone]=useState(false);
  return(
    <div style={{padding:"28px 32px"}}>
      <button onClick={onBack} style={{marginBottom:20,padding:"7px 14px",borderRadius:8,border:"1px solid "+C.border,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:C.grey}}>{t("back")}</button>
      <div style={{fontWeight:900,fontSize:20,color:C.navy,marginBottom:4}}>{t("newRecoTitle")}</div>
      <div style={{color:C.grey,fontSize:12,marginBottom:20}}>{t("newRecoSub")}</div>
      {!done?(
        <div>
          {[{k:"inv",label:t("inventoryLabel"),desc:t("inventoryDesc")},{k:"sales",label:t("salesLabel"),desc:t("salesDesc")}].map(f=>(
            <div key={f.k} style={{background:"#fff",borderRadius:14,padding:20,marginBottom:14,boxShadow:"0 2px 10px rgba(0,0,0,.06)",border:"2px dashed "+(files[f.k]?C.green:C.border)}}>
              <div style={{fontWeight:700,fontSize:14,color:C.navy,marginBottom:4}}>{f.label}</div>
              <div style={{fontSize:12,color:C.grey,marginBottom:12}}>{f.desc}</div>
              <input type="file" accept=".csv,.xlsx,.xls,.pdf,.jpg,.png" onChange={e=>setFiles(v=>({...v,[f.k]:e.target.files[0]}))} style={{fontSize:12}}/>
              {files[f.k]&&<div style={{color:C.green,fontWeight:700,fontSize:12,marginTop:8}}>✓ {files[f.k].name}</div>}
            </div>
          ))}
          <button onClick={()=>setDone(true)} disabled={!files.inv&&!files.sales} style={{width:"100%",padding:14,borderRadius:12,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:800,fontSize:14,color:"#fff",background:C.sky,opacity:(!files.inv&&!files.sales)?.5:1}}>{t("reconcileNow")}</button>
        </div>
      ):(
        <div style={{background:"#fff",borderRadius:14,padding:24,boxShadow:"0 2px 10px rgba(0,0,0,.06)",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:12}}>✅</div>
          <div style={{fontWeight:800,fontSize:18,color:C.navy,marginBottom:8}}>{t("recoComplete")}</div>
          <div style={{fontSize:13,color:C.grey,marginBottom:20}}>{t("recoCompleteSub")}</div>
          <button onClick={()=>{setDone(false);setFiles({inv:null,sales:null});}} style={{padding:"10px 24px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,color:"#fff",background:C.sky}}>{t("newRecoBtn")}</button>
        </div>
      )}
    </div>
  );
}

export default function App(){
  const [configured,setConfigured]=useState(SB.isConfigured());
  const [session,setSession]=useState(SB.getSession());
  const [profile,setProfile]=useState(SB.getProfile());
  const [loading,setLoading]=useState(()=>!!(SB.getSession()&&!SB.getProfile()));

  useEffect(()=>{
    if(session&&!profile){
      setLoading(true);
      const {url,key}=SB.get();
      fetch(url+"/rest/v1/profiles?id=eq."+session.user.id,{headers:{"apikey":key,"Authorization":"Bearer "+session.access_token}})
        .then(r=>r.json())
        .then(data=>{if(Array.isArray(data)&&data.length>0){SB.saveProfile(data[0]);setProfile(data[0]);}setLoading(false);})
        .catch(()=>setLoading(false));
    }
  },[session]);

  if(!configured) return <SetupScreen onDone={()=>setConfigured(true)}/>;
  if(!session) return <AuthScreen onAuth={s=>{SB.saveSession(s);setSession(s);setLoading(true);}}/>;
  if(loading) return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.light}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:36,marginBottom:12}}>💊</div><div style={{fontSize:14,color:C.grey,fontWeight:600}}>Loading NarcoSync…</div></div>
    </div>
  );
  if(!profile) return <OnboardingWizard userEmail={session.user.email} onComplete={p=>{SB.saveProfile(p);setProfile(p);}} session={session}/>;
  return <Dashboard session={session} profile={profile} onLogout={()=>{SB.clearSession();SB.clearProfile();setSession(null);setProfile(null);}}/>;
}
