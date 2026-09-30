"use client";

import {useState} from "react";
import {AlertTriangle, ArrowRight, Camera, Check, ChevronDown, ClipboardCheck, FileDown, FlaskConical, RefreshCw, ShieldCheck, Stethoscope} from "lucide-react";
import demo from "../data/demo.json";

type Clinic=(typeof demo.clinics)[number];
type Result={expected:number;observed:number;variance:number;status:"balanced"|"review"|"critical"};
const quantity=(value:number,unit:string)=>`${value.toLocaleString(undefined,{maximumFractionDigits:3})} ${unit}`;

function reconcile(clinic:Clinic):Result{
  const expected=clinic.opening+clinic.purchased-clinic.administered-clinic.waste-clinic.transferred;
  const variance=clinic.observed-expected;
  const absolute=Math.abs(variance);
  return {expected,observed:clinic.observed,variance,status:absolute>=demo.varianceThresholds.critical?"critical":absolute>=demo.varianceThresholds.watch?"review":"balanced"};
}

export default function Home(){
  const [clinic,setClinic]=useState<Clinic>({...demo.clinics[0]});
  const [result,setResult]=useState<Result|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [showMath,setShowMath]=useState(false);
  const [packet,setPacket]=useState(false);

  function load(id:string){const found=demo.clinics.find(item=>item.id===id)!;setClinic({...found});setResult(null);setError("");setPacket(false);setShowMath(false)}
  function update<K extends keyof Clinic>(key:K,value:Clinic[K]){setClinic(current=>({...current,[key]:value}));setResult(null);setPacket(false);setError("")}
  function run(){
    const fields=[clinic.opening,clinic.purchased,clinic.administered,clinic.waste,clinic.transferred,clinic.observed];
    if(!clinic.name.trim()||!clinic.drug.trim()){setError("Add a clinic and controlled-substance name.");return}
    if(fields.some(value=>!Number.isFinite(value)||value<0)){setError("Every quantity must be a number at or above zero.");return}
    if(clinic.administered+clinic.waste+clinic.transferred>clinic.opening+clinic.purchased){setError("Logged outflow exceeds available inventory. Review the opening balance and transactions.");return}
    setError("");setBusy(true);setResult(null);setPacket(false);window.setTimeout(()=>{setResult(reconcile(clinic));setBusy(false)},650);
  }

  return <main>
    <header className="topbar"><a className="brand" href="#top"><span><FlaskConical/></span>CountSafe</a><span className="demo-chip">Fictional demo · no uploads</span></header>
    <section className="hero" id="top"><div><p className="eyebrow">LOGS → COUNT → EXCEPTION</p><h1>Close the drug log.<br/><em>Before an auditor opens it.</em></h1><p className="lede">Reconcile a veterinary clinic&apos;s monthly controlled-substance count, surface the exact variance, and prepare a review packet without hiding the math.</p></div><div className="hero-note"><ShieldCheck/><div><b>Human verification required</b><span>This prototype calculates from entered totals. It does not read photos, file records, or determine legal compliance.</span></div></div></section>
    <nav className="steps" aria-label="Workflow steps"><span className="current">1 <b>Enter totals</b></span><span>2 <b>Reconcile</b></span><span>3 <b>Review exception</b></span></nav>
    <div className="workspace">
      <section className="intake" aria-labelledby="intake-title">
        <div className="section-head"><div><p>MONTH-END WORKSHEET</p><h2 id="intake-title">Reconcile one drug</h2></div><button className="icon-button" onClick={()=>load("cedar")} aria-label="Reset demo"><RefreshCw/></button></div>
        <div className="scenario-row"><span>Try fictional records</span><div>{demo.clinics.map(item=><button key={item.id} onClick={()=>load(item.id)} className={clinic.id===item.id?"selected":""}>{item.name.split(" ")[0]}</button>)}</div></div>
        <div className="identity"><label>Clinic<input aria-label="Clinic" value={clinic.name} maxLength={60} onChange={e=>update("name",e.target.value)}/></label><label>Controlled substance<input aria-label="Controlled substance" value={clinic.drug} maxLength={60} onChange={e=>update("drug",e.target.value)}/></label></div>
        <div className="form-grid">
          {(["opening","purchased","administered","waste","transferred","observed"] as const).map(key=><label key={key}>{({opening:"Opening count",purchased:"Purchases received",administered:"Administered",waste:"Witnessed waste",transferred:"Transfers out",observed:"Observed shelf count"})[key]}<span className="unit-input"><input aria-label={({opening:"Opening count",purchased:"Purchases received",administered:"Administered",waste:"Witnessed waste",transferred:"Transfers out",observed:"Observed shelf count"})[key]} type="number" min="0" step="0.001" value={clinic[key]} onChange={e=>update(key,Number(e.target.value))}/><i>{clinic.unit}</i></span></label>)}
        </div>
        <div className="photo-note"><Camera/><span><b>Photo ingestion is simulated</b>Production would retain the source image and require human confirmation before posting totals.</span></div>
        <button className="primary" onClick={run} disabled={busy}>{busy?"Reconciling ledger…":"Run monthly reconciliation"}<ArrowRight/></button>
        {error&&<p className="error" role="alert"><AlertTriangle/>{error}</p>}
      </section>
      <section className="output" aria-live="polite" aria-busy={busy}>
        {!result?<div className="empty"><div><ClipboardCheck/></div><h2>{busy?"Checking every movement…":"No reconciliation yet"}</h2><p>Use the fictional record or edit the totals. The expected count and variance will appear here.</p></div>:<>
          <div className="section-head"><div><p>{clinic.deaSchedule} · {clinic.name.toUpperCase()}</p><h2>Monthly count result</h2></div><span className={`status ${result.status}`}>{result.status}</span></div>
          <div className={`variance ${result.status}`}><span>Ledger variance</span><strong>{result.variance>0?"+":""}{quantity(result.variance,clinic.unit)}</strong><p>{result.status==="balanced"?"Within the demo review threshold.":result.variance<0?"Observed inventory is below the ledger expectation.":"Observed inventory is above the ledger expectation."}</p></div>
          <div className="comparison"><article><span>Expected</span><b>{quantity(result.expected,clinic.unit)}</b><small>opening + received − outflow</small></article><article><span>Observed</span><b>{quantity(result.observed,clinic.unit)}</b><small>entered shelf count</small></article><article><span>Review level</span><b>{result.status}</b><small>demo policy only</small></article></div>
          <button className="math-toggle" onClick={()=>setShowMath(value=>!value)} aria-expanded={showMath}>Show ledger equation <ChevronDown className={showMath?"open":""}/></button>
          {showMath&&<div className="method"><code>{clinic.opening} + {clinic.purchased} − {clinic.administered} − {clinic.waste} − {clinic.transferred} = {result.expected} {clinic.unit}</code><p>Thresholds are configurable demo policy, not DEA guidance.</p></div>}
          <div className="checklist"><p>EXCEPTION REVIEW</p>{demo.auditSteps.map((step,index)=><div key={step}><span>{index+1}</span><b>{step}</b></div>)}</div>
          <button className={`save ${packet?"saved":""}`} onClick={()=>setPacket(true)}><FileDown/>{packet?"Demo audit packet prepared":"Prepare demo audit packet"}</button>
          <p className="disclaimer">{demo.disclaimer}</p>
        </>}
      </section>
    </div>
    <section className="trust-strip"><div><Stethoscope/><span><b>Clinic-owned policy</b><small>Thresholds require responsible-person approval</small></span></div><div><Camera/><span><b>Source evidence</b><small>Keep immutable photos and invoices</small></span></div><div><Check/><span><b>Human sign-off</b><small>Never auto-correct a controlled-drug log</small></span></div></section>
    <footer><span>CountSafe · Fictional prototype, September 2026</span><a href="https://www.ideabrowser.com/hub/ideas/monthly-controlled-drug-reconciliation-for-independent-vet-clinics-38e3fe31">Public source idea ↗</a></footer>
  </main>;
}
