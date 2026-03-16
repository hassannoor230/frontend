import { useEffect, useState, useMemo } from "react";
import API from "../../api/axios";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import {
  FiShoppingCart, FiPackage, FiUsers, FiDollarSign,
  FiAlertTriangle, FiTrendingUp, FiFilter, FiRefreshCw
} from "react-icons/fi";
import { MdPointOfSale, MdPayments } from "react-icons/md";
import { BsCheckCircleFill, BsGraphUpArrow, BsBoxSeam } from "react-icons/bs";
import { RiStockLine } from "react-icons/ri";
import { FaMoneyCheckDollar, FaFire } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import { BsLightningChargeFill } from "react-icons/bs";

/* ─── Font + CSS Injection ─── */
const injectStyles = () => {
  if (document.getElementById("luxury-dash-styles")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap";
  document.head.appendChild(link);
  const style = document.createElement("style");
  style.id = "luxury-dash-styles";
  style.textContent = `
    .ld-root * { box-sizing: border-box; }
    .ld-root { font-family: 'Outfit', sans-serif; }
    .ld-serif { font-family: 'DM Serif Display', serif; }
    @keyframes ld-fadeup { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes ld-spin { to { transform:rotate(360deg); } }
    @keyframes ld-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:.7} }
    @keyframes ld-glow { 0%,100%{text-shadow:0 0 0 transparent} 50%{text-shadow:0 0 24px rgba(245,158,11,.35)} }
    @keyframes ld-shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    .ld-fu  { animation: ld-fadeup .55s cubic-bezier(.23,1,.32,1) both; }
    .ld-fu1 { animation: ld-fadeup .55s .06s cubic-bezier(.23,1,.32,1) both; }
    .ld-fu2 { animation: ld-fadeup .55s .12s cubic-bezier(.23,1,.32,1) both; }
    .ld-fu3 { animation: ld-fadeup .55s .18s cubic-bezier(.23,1,.32,1) both; }
    .ld-fu4 { animation: ld-fadeup .55s .24s cubic-bezier(.23,1,.32,1) both; }
    .ld-fu5 { animation: ld-fadeup .55s .30s cubic-bezier(.23,1,.32,1) both; }
    .ld-fu6 { animation: ld-fadeup .55s .36s cubic-bezier(.23,1,.32,1) both; }
    .ld-fu7 { animation: ld-fadeup .55s .42s cubic-bezier(.23,1,.32,1) both; }
    .ld-fu8 { animation: ld-fadeup .55s .48s cubic-bezier(.23,1,.32,1) both; }
    .ld-gold { animation: ld-glow 3s ease-in-out infinite; }
    .ld-spin { animation: ld-spin 1s linear infinite; }
    .ld-pulse-dot { animation: ld-pulse 2s ease-in-out infinite; }
    .ld-card { transition: transform .22s ease, box-shadow .22s ease; }
    .ld-card:hover { transform: translateY(-3px); }
    .ld-row:hover { background: rgba(255,255,255,.028) !important; }
    ::-webkit-scrollbar { width:3px; height:3px; }
    ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08); border-radius:2px; }
    ::-webkit-scrollbar-track { background:transparent; }
    .ld-input { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:10px; padding:8px 14px; color:#fff; font-size:13px; outline:none; font-family:'Outfit',sans-serif; color-scheme:dark; transition:border .2s; }
    .ld-input:focus { border-color:rgba(99,102,241,.5); }
    @media(max-width:768px){.ld-hide-mob{display:none!important}.ld-show-mob{display:block!important}}
    @media(min-width:769px){.ld-hide-mob{display:block!important}.ld-show-mob{display:none!important}}
  `;
  document.head.appendChild(style);
};

const PALETTE = ["#6366f1","#f59e0b","#10b981","#ec4899","#06b6d4","#f97316","#8b5cf6","#14b8a6"];
const FILTERS = [
  { key:"today", label:"Today" },
  { key:"weekly", label:"7 Days" },
  { key:"monthly", label:"Month" },
  { key:"custom", label:"Custom" },
];

const getRange = (filter, cs, ce) => {
  const now = new Date();
  let s = new Date(), e = new Date();
  e.setHours(23,59,59,999);
  if (filter==="today") { s.setHours(0,0,0,0); }
  else if (filter==="weekly") { s.setDate(now.getDate()-6); s.setHours(0,0,0,0); }
  else if (filter==="monthly") { s = new Date(now.getFullYear(),now.getMonth(),1); s.setHours(0,0,0,0); }
  else if (filter==="custom"&&cs&&ce) { s=new Date(cs); s.setHours(0,0,0,0); e=new Date(ce); e.setHours(23,59,59,999); }
  else { s.setDate(now.getDate()-6); s.setHours(0,0,0,0); }
  return { s, e };
};

/* ─── Tooltip ─── */
const Tip = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background:"rgba(8,9,18,.95)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, padding:"10px 16px", backdropFilter:"blur(20px)", boxShadow:"0 8px 32px rgba(0,0,0,.5)" }}>
      <p style={{ color:"rgba(255,255,255,.4)", fontSize:11, marginBottom:4, fontFamily:"Outfit" }}>{label}</p>
      <p style={{ color:"#f59e0b", fontWeight:800, fontSize:14, fontFamily:"Outfit" }}>Rs. {Number(payload[0]?.value).toLocaleString()}</p>
    </div>
  );
};

/* ─── Clock ─── */
const Clock = () => {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(()=>setT(new Date()),1000); return ()=>clearInterval(id); },[]);
  return <span style={{ fontSize:12, color:"rgba(255,255,255,.28)", fontVariantNumeric:"tabular-nums", letterSpacing:1 }}>{t.toLocaleTimeString("en-PK",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>;
};

/* ─── KPI Card ─── */
const KPI = ({ title, value, sub, icon, color, cls="" }) => (
  <div className={`ld-card ${cls}`} style={{
    background:"linear-gradient(135deg, rgba(255,255,255,.045) 0%, rgba(255,255,255,.012) 100%)",
    border:"1px solid rgba(255,255,255,.08)",
    borderRadius:20,
    padding:"22px 22px 20px",
    position:"relative",
    overflow:"hidden",
    boxShadow:"0 4px 24px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.06)",
  }}>
    {/* Glow orb */}
    <div style={{ position:"absolute", top:-30, right:-30, width:100, height:100, borderRadius:"50%", background:`radial-gradient(circle, ${color}28 0%, transparent 70%)`, pointerEvents:"none" }} />
    {/* Bottom line accent */}
    <div style={{ position:"absolute", bottom:0, left:0, width:"50%", height:2, background:`linear-gradient(90deg, ${color}, transparent)` }} />

    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18 }}>
      <div style={{ width:42, height:42, borderRadius:13, background:`${color}18`, border:`1px solid ${color}35`, display:"flex", alignItems:"center", justifyContent:"center", color, fontSize:19 }}>
        {icon}
      </div>
      <span style={{ fontSize:10, color:"rgba(255,255,255,.28)", textTransform:"uppercase", letterSpacing:"2.5px", fontWeight:600, lineHeight:1.4, textAlign:"right", maxWidth:100 }}>{title}</span>
    </div>

    <div className="ld-gold" style={{ fontSize:"clamp(20px,3vw,28px)", fontWeight:900, color:"#fff", lineHeight:1, letterSpacing:"-0.5px" }}>{value}</div>
    {sub && <p style={{ fontSize:11, color:"rgba(255,255,255,.3)", marginTop:6, fontWeight:400 }}>{sub}</p>}
  </div>
);

/* ─── Badge ─── */
const Badge = ({ status }) => {
  const map = {
    completed: { bg:"rgba(16,185,129,.15)", c:"#10b981", b:"rgba(16,185,129,.3)" },
    pending:   { bg:"rgba(245,158,11,.15)", c:"#f59e0b", b:"rgba(245,158,11,.3)" },
    refunded:  { bg:"rgba(239,68,68,.15)",  c:"#ef4444", b:"rgba(239,68,68,.3)" },
  };
  const s = map[status] || map.refunded;
  return <span style={{ padding:"3px 10px", borderRadius:20, background:s.bg, color:s.c, border:`1px solid ${s.b}`, fontSize:11, fontWeight:700, textTransform:"capitalize", whiteSpace:"nowrap" }}>{status}</span>;
};

/* ─── Section Header ─── */
const SHead = ({ title, sub, right }) => (
  <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
    <div>
      <h2 style={{ fontSize:15, fontWeight:700, color:"#fff", margin:0, letterSpacing:"-0.2px" }}>{title}</h2>
      {sub && <p style={{ fontSize:12, color:"rgba(255,255,255,.3)", marginTop:3 }}>{sub}</p>}
    </div>
    {right}
  </div>
);

/* ─── Chip ─── */
const Chip = ({ children, color="#6366f1" }) => (
  <span style={{ padding:"3px 12px", borderRadius:20, background:`${color}18`, border:`1px solid ${color}35`, fontSize:11, color, fontWeight:700, display:"inline-flex", alignItems:"center", gap:5 }}>{children}</span>
);

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const Dashboard = () => {
  useEffect(() => { injectStyles(); }, []);

  const [sales,    setSales]    = useState([]);
  const [products, setProducts] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [filter,   setFilter]   = useState("weekly");
  const [cs, setCs] = useState("");
  const [ce, setCe] = useState("");
  const [showC, setShowC] = useState(false);

  const fetchAll = async (manual=false) => {
    if (manual) setSpinning(true);
    try {
      const [sr,pr,ur] = await Promise.all([API.get("/sales"),API.get("/products"),API.get("/users")]);
      setSales(sr.data.data||[]); setProducts(pr.data.data||[]); setUsers(ur.data.data||[]);
    } catch(e){ console.error(e); }
    finally { setLoading(false); setSpinning(false); }
  };

  useEffect(() => { fetchAll(); const t=setInterval(()=>fetchAll(false),30000); return()=>clearInterval(t); },[]);

  const { s, e } = useMemo(()=>getRange(filter,cs,ce),[filter,cs,ce]);
  const completed  = useMemo(()=>sales.filter(x=>x.status==="completed"),[sales]);
  const filtered   = useMemo(()=>completed.filter(x=>{ const d=new Date(x.createdAt); return d>=s&&d<=e; }),[completed,s,e]);

  const rev      = filtered.reduce((a,x)=>a+(x.total||0),0);
  const tax      = filtered.reduce((a,x)=>a+(x.tax||0),0);
  const disc     = filtered.reduce((a,x)=>a+(x.discount||0),0);
  const todayS   = new Date(); todayS.setHours(0,0,0,0);
  const todayRev = completed.filter(x=>new Date(x.createdAt)>=todayS).reduce((a,x)=>a+(x.total||0),0);
  const todayCnt = completed.filter(x=>new Date(x.createdAt)>=todayS).length;
  const lowStock = products.filter(p=>p.stock<=p.minStock);
  const oos      = products.filter(p=>p.stock===0);
  const recent   = [...filtered].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,8);

  const barData = useMemo(()=>{
    const m={};
    filtered.forEach(x=>{ const d=new Date(x.createdAt); const k=filter==="today"?`${d.getHours()}:00`:d.toLocaleDateString("en-PK",{month:"short",day:"numeric"}); if(!m[k])m[k]={date:k,Revenue:0,_r:d}; m[k].Revenue+=x.total||0; });
    return Object.values(m).sort((a,b)=>filter==="today"?parseInt(a.date)-parseInt(b.date):new Date(a._r)-new Date(b._r)).map(({_r,...r})=>r);
  },[filtered,filter]);

  const topProds = useMemo(()=>{
    const m={};
    filtered.forEach(x=>(x.items||[]).forEach(it=>{ if(!m[it.name])m[it.name]={name:it.name,v:0,q:0}; m[it.name].v+=it.total||0; m[it.name].q+=it.quantity||0; }));
    return Object.values(m).sort((a,b)=>b.v-a.v).slice(0,6).map((p,i)=>({...p,fill:PALETTE[i%PALETTE.length]}));
  },[filtered]);

  const payPie = useMemo(()=>{
    const m={};
    filtered.forEach(x=>{ const k=x.paymentMethod||"other"; if(!m[k])m[k]={name:k.charAt(0).toUpperCase()+k.slice(1),value:0}; m[k].value+=x.total||0; });
    return Object.values(m).map((p,i)=>({...p,fill:PALETTE[i%PALETTE.length]}));
  },[filtered]);

  const flabel = FILTERS.find(f=>f.key===filter)?.label||"7 Days";

  const BG    = "#070a14";
  const GLASS = { background:"linear-gradient(135deg,rgba(255,255,255,.042) 0%,rgba(255,255,255,.012) 100%)", border:"1px solid rgba(255,255,255,.075)", borderRadius:20, boxShadow:"0 4px 32px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.055)" };
  const TH    = { padding:"11px 20px", fontSize:10, color:"rgba(255,255,255,.22)", textTransform:"uppercase", letterSpacing:"2px", textAlign:"left", fontWeight:700, borderBottom:"1px solid rgba(255,255,255,.055)", background:"rgba(255,255,255,.015)", fontFamily:"Outfit" };
  const TD    = { padding:"13px 20px", fontSize:13, color:"rgba(255,255,255,.7)", fontFamily:"Outfit", borderBottom:"1px solid rgba(255,255,255,.03)" };

  if (loading) return (
    <div className="ld-root" style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div className="ld-spin" style={{ width:44,height:44,border:"2px solid rgba(99,102,241,.15)",borderTop:"2px solid #6366f1",borderRadius:"50%",margin:"0 auto 16px" }}/>
        <p style={{ color:"rgba(255,255,255,.25)",fontSize:12,letterSpacing:3,textTransform:"uppercase",fontFamily:"Outfit" }}>Loading</p>
      </div>
    </div>
  );

  return (
    <div className="ld-root" style={{ background:BG, minHeight:"100vh", padding:"0 0 48px" }}>

      {/* Ambient blobs */}
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
        <div style={{ position:"absolute",top:"-25%",left:"-15%",width:"55%",height:"55%",borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,.05) 0%,transparent 70%)" }}/>
        <div style={{ position:"absolute",bottom:"-25%",right:"-15%",width:"55%",height:"55%",borderRadius:"50%",background:"radial-gradient(circle,rgba(245,158,11,.035) 0%,transparent 70%)" }}/>
        <div style={{ position:"absolute",top:"40%",right:"20%",width:"30%",height:"30%",borderRadius:"50%",background:"radial-gradient(circle,rgba(16,185,129,.025) 0%,transparent 70%)" }}/>
      </div>

      <div style={{ position:"relative",zIndex:1,maxWidth:1440,margin:"0 auto",padding:"0 20px" }}>

        {/* ══ HEADER ══ */}
        <div className="ld-fu" style={{ padding:"32px 0 26px",borderBottom:"1px solid rgba(255,255,255,.06)",marginBottom:28 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16 }}>
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
                <div className="ld-pulse-dot" style={{ width:7,height:7,borderRadius:"50%",background:"#10b981" }}/>
                <span style={{ fontSize:10,color:"#10b981",textTransform:"uppercase",letterSpacing:"3px",fontWeight:700 }}>Live System</span>
                <Clock/>
              </div>
              <h1 className="ld-serif" style={{ fontSize:"clamp(26px,4vw,42px)",fontWeight:400,color:"#fff",margin:0,lineHeight:1.1 }}>
                {new Date().getHours()<12?"Good Morning":new Date().getHours()<17?"Good Afternoon":"Good Evening"}
                <span style={{ fontStyle:"italic",color:"rgba(255,255,255,.38)" }}> — Admin Panel</span>
              </h1>
              <p style={{ fontSize:13,color:"rgba(255,255,255,.28)",marginTop:7,fontWeight:400 }}>
                {new Date().toLocaleDateString("en-PK",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
              </p>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ textAlign:"right",paddingRight:16,borderRight:"1px solid rgba(255,255,255,.07)" }}>
                <p style={{ fontSize:10,color:"rgba(255,255,255,.28)",textTransform:"uppercase",letterSpacing:2,margin:0 }}>Today's Revenue</p>
                <p className="ld-gold" style={{ fontSize:22,fontWeight:900,color:"#f59e0b",margin:0 }}>Rs. {todayRev.toLocaleString()}</p>
                <p style={{ fontSize:11,color:"rgba(255,255,255,.28)",margin:0 }}>{todayCnt} sales</p>
              </div>
              <button onClick={()=>fetchAll(true)} disabled={spinning}
                style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:12,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.09)",color:"rgba(255,255,255,.55)",fontSize:13,cursor:"pointer",transition:"all .2s",fontFamily:"Outfit" }}>
                <FiRefreshCw className={spinning?"ld-spin":""}/>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ══ FILTER BAR ══ */}
        <div className="ld-fu1" style={{ ...GLASS,borderRadius:16,padding:"14px 20px",marginBottom:24,display:"flex",alignItems:"center",flexWrap:"wrap",gap:12 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginRight:4 }}>
            <FiFilter style={{ color:"rgba(99,102,241,.8)",fontSize:13 }}/>
            <span style={{ fontSize:11,color:"rgba(255,255,255,.35)",textTransform:"uppercase",letterSpacing:"2.5px",fontWeight:700 }}>Period</span>
          </div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {FILTERS.map(f=>(
              <button key={f.key} onClick={()=>{ setFilter(f.key); setShowC(f.key==="custom"); }}
                style={{ padding:"6px 18px",borderRadius:10,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .2s",fontFamily:"Outfit",
                  background: filter===f.key?"linear-gradient(135deg,#6366f1,#4f46e5)":"rgba(255,255,255,.04)",
                  border: filter===f.key?"1px solid rgba(99,102,241,.6)":"1px solid rgba(255,255,255,.07)",
                  color: filter===f.key?"#fff":"rgba(255,255,255,.45)",
                  boxShadow: filter===f.key?"0 4px 20px rgba(99,102,241,.28)":"none" }}>
                {f.label}
              </button>
            ))}
          </div>
          <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:12 }}>
            <span style={{ fontSize:11,color:"rgba(255,255,255,.22)",fontWeight:500 }}>{filtered.length} transactions in period</span>
          </div>
          {showC && (
            <div style={{ width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,.05)",marginTop:4 }}>
              {["Start","End"].map((lb,i)=>(
                <div key={lb}>
                  <p style={{ fontSize:10,color:"rgba(255,255,255,.28)",marginBottom:6,textTransform:"uppercase",letterSpacing:2 }}>{lb}</p>
                  <input type="date" className="ld-input" style={{ width:"100%" }} value={i===0?cs:ce} onChange={e=>i===0?setCs(e.target.value):setCe(e.target.value)}/>
                </div>
              ))}
              <div style={{ display:"flex",alignItems:"flex-end" }}>
                <button style={{ padding:"8px 22px",borderRadius:10,background:"linear-gradient(135deg,#6366f1,#4f46e5)",border:"none",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Outfit",boxShadow:"0 4px 20px rgba(99,102,241,.3)" }}>Apply</button>
              </div>
            </div>
          )}
        </div>

        {/* ══ KPI ROW 1 ══ */}
        <div className="ld-fu2" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:16,marginBottom:16 }}>
          <KPI title="Period Revenue"  value={`Rs. ${rev.toLocaleString()}`}      sub={`${filtered.length} sales · ${flabel}`}                       icon={<FaMoneyCheckDollar/>} color="#f59e0b" />
          <KPI title="Sales Count"     value={filtered.length}                     sub={`Avg Rs. ${(rev/(filtered.length||1)).toFixed(0)}`}              icon={<MdPointOfSale/>}      color="#6366f1" />
          <KPI title="Tax Collected"   value={`Rs. ${tax.toLocaleString()}`}       sub={`Discount Rs. ${disc.toLocaleString()}`}                         icon={<FiDollarSign/>}       color="#06b6d4" />
          <KPI title="Items Sold"      value={filtered.reduce((a,x)=>a+(x.items?.length||0),0)} sub={`${topProds.length} unique products`}              icon={<FiPackage/>}          color="#ec4899" />
        </div>

        {/* ══ KPI ROW 2 ══ */}
        <div className="ld-fu3" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:16,marginBottom:28 }}>
          <KPI title="Today Revenue"   value={`Rs. ${todayRev.toLocaleString()}`}  sub={`${todayCnt} sales today`}                                      icon={<BsLightningChargeFill/>} color="#f59e0b" />
          <KPI title="System Users"    value={users.length}                         sub="All roles combined"                                              icon={<FiUsers/>}            color="#10b981" />
          <KPI title="Low Stock Alert" value={lowStock.length}                      sub={`${oos.length} fully out of stock`}                              icon={<FiAlertTriangle/>}    color="#ef4444" />
          <KPI title="Total Products"  value={products.length}                      sub={`${products.filter(p=>p.isActive).length} active listings`}      icon={<BsGraphUpArrow/>}     color="#8b5cf6" />
        </div>

        {/* ══ CHARTS ══ */}
        <div className="ld-fu4" style={{ display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginBottom:20 }}>

          {/* Area Chart */}
          <div className="ld-card" style={{ ...GLASS,padding:"26px 28px" }}>
            <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24 }}>
              <div>
                <h2 style={{ fontSize:16,fontWeight:700,color:"#fff",margin:0,letterSpacing:"-0.3px" }}>Revenue Trend</h2>
                <p style={{ fontSize:12,color:"rgba(255,255,255,.3)",marginTop:4 }}>{flabel} · {barData.length} data points</p>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ fontSize:11,color:"rgba(255,255,255,.28)",textTransform:"uppercase",letterSpacing:2,margin:0 }}>Total</p>
                <p style={{ fontSize:22,fontWeight:900,color:"#f59e0b",margin:0 }}>Rs. {rev.toLocaleString()}</p>
              </div>
            </div>
            {barData.length>0?(
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={barData} margin={{top:5,right:5,left:0,bottom:5}}>
                  <defs>
                    <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35}/>
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false}/>
                  <XAxis dataKey="date" tick={{fontSize:10,fill:"rgba(255,255,255,.22)",fontFamily:"Outfit"}} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
                  <YAxis tick={{fontSize:10,fill:"rgba(255,255,255,.22)"}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v} width={34}/>
                  <Tooltip content={<Tip/>} cursor={{stroke:"rgba(255,255,255,.05)",strokeWidth:1}}/>
                  <Area type="monotone" dataKey="Revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#aGrad)" dot={{fill:"#6366f1",r:3,strokeWidth:0}} activeDot={{r:5,fill:"#f59e0b",strokeWidth:0}}/>
                </AreaChart>
              </ResponsiveContainer>
            ):(
              <div style={{height:230,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.15)"}}>
                <MdPointOfSale style={{fontSize:38,marginBottom:8}}/><p style={{fontSize:13}}>No data this period</p>
              </div>
            )}
          </div>

          {/* Payment Pie */}
          <div className="ld-card" style={{...GLASS,padding:"26px 24px"}}>
            <h2 style={{fontSize:16,fontWeight:700,color:"#fff",margin:"0 0 4px",letterSpacing:"-0.3px"}}>Payment Split</h2>
            <p style={{fontSize:12,color:"rgba(255,255,255,.3)",marginBottom:20}}>{flabel}</p>
            {payPie.length>0?(
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={payPie} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value">
                      {payPie.map((x,i)=><Cell key={i} fill={x.fill}/>)}
                    </Pie>
                    <Tooltip content={<Tip/>}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:9}}>
                  {payPie.map((p,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{width:8,height:8,borderRadius:"50%",background:p.fill,display:"inline-block"}}/>
                        <span style={{fontSize:12,color:"rgba(255,255,255,.45)",textTransform:"capitalize"}}>{p.name}</span>
                      </div>
                      <span style={{fontSize:12,fontWeight:800,color:"#fff"}}>Rs. {p.value?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            ):(
              <div style={{height:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.15)"}}>
                <MdPayments style={{fontSize:36,marginBottom:8}}/><p style={{fontSize:13}}>No payments</p>
              </div>
            )}
          </div>
        </div>

        {/* ══ TOP PRODUCTS + LINE ══ */}
        <div className="ld-fu5" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>

          {/* Top Products */}
          <div className="ld-card" style={{...GLASS,overflow:"hidden"}}>
            <SHead title="Top Products" sub={`By revenue · ${flabel}`}
              right={<Chip color="#f59e0b"><FaFire/>{topProds.length} items</Chip>}/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr><th style={TH}>#</th><th style={TH}>Product</th><th style={TH}>Qty</th><th style={TH}>Revenue</th></tr>
                </thead>
                <tbody>
                  {topProds.length>0?topProds.map((p,i)=>(
                    <tr key={i} className="ld-row">
                      <td style={TD}><span style={{width:26,height:26,borderRadius:8,background:`${p.fill}18`,border:`1px solid ${p.fill}35`,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:p.fill}}>{i+1}</span></td>
                      <td style={{...TD,fontWeight:600,color:"rgba(255,255,255,.82)"}}>{p.name}</td>
                      <td style={TD}><span style={{padding:"2px 10px",borderRadius:20,background:`${p.fill}18`,color:p.fill,fontSize:11,fontWeight:800,border:`1px solid ${p.fill}30`}}>{p.q}</span></td>
                      <td style={{...TD,fontWeight:800,color:"#f59e0b"}}>Rs. {p.v?.toLocaleString()}</td>
                    </tr>
                  )):(
                    <tr><td colSpan="4" style={{...TD,textAlign:"center",padding:"40px",color:"rgba(255,255,255,.2)"}}>No product data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Line Chart */}
          <div className="ld-card" style={{...GLASS,padding:"26px 24px"}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20}}>
              <div>
                <h2 style={{fontSize:16,fontWeight:700,color:"#fff",margin:0,letterSpacing:"-0.3px"}}>Growth Line</h2>
                <p style={{fontSize:12,color:"rgba(255,255,255,.3)",marginTop:3}}>Revenue over time</p>
              </div>
              <Chip color="#10b981"><FiTrendingUp/> Trend</Chip>
            </div>
            {barData.length>1?(
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={barData} margin={{top:5,right:10,left:0,bottom:5}}>
                  <defs>
                    <linearGradient id="lGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="50%" stopColor="#10b981" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false}/>
                  <XAxis dataKey="date" tick={{fontSize:10,fill:"rgba(255,255,255,.2)",fontFamily:"Outfit"}} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
                  <YAxis tick={{fontSize:10,fill:"rgba(255,255,255,.2)"}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v} width={34}/>
                  <Tooltip content={<Tip/>}/>
                  <Line type="monotone" dataKey="Revenue" stroke="url(#lGrad)" strokeWidth={2.5} dot={{fill:"#10b981",r:3,strokeWidth:2,stroke:"rgba(0,0,0,.5)"}} activeDot={{r:6,fill:"#f59e0b",strokeWidth:0}}/>
                </LineChart>
              </ResponsiveContainer>
            ):(
              <div style={{height:210,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.15)"}}>
                <FiTrendingUp style={{fontSize:36,marginBottom:8}}/><p style={{fontSize:13}}>Need more data</p>
              </div>
            )}
          </div>
        </div>

        {/* ══ RECENT SALES ══ */}
        <div className="ld-fu6 ld-card" style={{...GLASS,overflow:"hidden",marginBottom:20}}>
          <SHead title="Recent Transactions" sub={`Latest ${recent.length} · ${flabel}`}
            right={<Chip color="#6366f1"><HiSparkles/>{recent.length}</Chip>}/>

          {/* Mobile */}
          <div className="ld-show-mob">
            {recent.length>0?recent.map(s=>(
              <div key={s._id} style={{padding:"14px 20px",borderBottom:"1px solid rgba(255,255,255,.04)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                <div>
                  <p style={{fontSize:12,fontWeight:700,color:"#6366f1",margin:0}}>{s.invoiceNumber}</p>
                  <p style={{fontSize:14,fontWeight:600,color:"rgba(255,255,255,.78)",margin:"3px 0 2px"}}>{s.customer}</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,.28)",margin:0,textTransform:"capitalize"}}>{s.paymentMethod}</p>
                </div>
                <div style={{textAlign:"right"}}>
                  <p style={{fontSize:16,fontWeight:900,color:"#f59e0b",margin:"0 0 4px"}}> Rs. {s.total?.toLocaleString()}</p>
                  <Badge status={s.status}/>
                </div>
              </div>
            )):(
              <div style={{padding:"48px 20px",textAlign:"center",color:"rgba(255,255,255,.18)"}}>
                <FiShoppingCart style={{fontSize:32,display:"block",margin:"0 auto 8px"}}/><p style={{fontSize:13}}>No sales this period</p>
              </div>
            )}
          </div>

          {/* Desktop */}
          <div className="ld-hide-mob" style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr><th style={TH}>Invoice</th><th style={TH}>Customer</th><th style={TH}>Cashier</th><th style={TH}>Status</th><th style={TH}>Total</th><th style={TH}>Payment</th><th style={TH}>Date</th></tr>
              </thead>
              <tbody>
                {recent.length>0?recent.map(s=>(
                  <tr key={s._id} className="ld-row">
                    <td style={{...TD,fontWeight:700,color:"#6366f1",fontSize:12}}>{s.invoiceNumber}</td>
                    <td style={{...TD,fontWeight:600,color:"rgba(255,255,255,.78)"}}>{s.customer}</td>
                    <td style={{...TD,color:"rgba(255,255,255,.35)",fontSize:12}}>{s.cashier?.name||"—"}</td>
                    <td style={TD}><Badge status={s.status}/></td>
                    <td style={{...TD,fontWeight:900,color:"#f59e0b",fontSize:14}}>Rs. {s.total?.toLocaleString()}</td>
                    <td style={{...TD,color:"rgba(255,255,255,.38)",textTransform:"capitalize",fontSize:12}}>{s.paymentMethod}</td>
                    <td style={{...TD,color:"rgba(255,255,255,.22)",fontSize:11}}>{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                )):(
                  <tr><td colSpan="7" style={{...TD,textAlign:"center",padding:"48px",color:"rgba(255,255,255,.2)"}}>
                    <FiShoppingCart style={{fontSize:32,display:"block",margin:"0 auto 8px"}}/> No sales this period
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ STOCK ALERTS ══ */}
        <div className="ld-fu7 ld-card" style={{...GLASS,overflow:"hidden"}}>
          <SHead title="Stock Alerts" sub="Below minimum threshold"
            right={lowStock.length>0
              ?<Chip color="#ef4444"><FiAlertTriangle/> {lowStock.length} items</Chip>
              :<Chip color="#10b981"><BsCheckCircleFill/> All Good</Chip>}/>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr><th style={TH}>SKU</th><th style={TH}>Product</th><th style={TH}>Category</th><th style={TH}>Stock</th><th style={TH}>Min</th><th style={TH}>Status</th></tr>
              </thead>
              <tbody>
                {lowStock.length>0?lowStock.map(p=>(
                  <tr key={p._id} className="ld-row">
                    <td style={{...TD,fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,.25)"}}>{p.sku}</td>
                    <td style={{...TD,fontWeight:600,color:"rgba(255,255,255,.8)"}}>{p.name}</td>
                    <td style={{...TD,color:"rgba(255,255,255,.38)",fontSize:12}}>{p.category?.name||"—"}</td>
                    <td style={TD}>
                      <span style={{padding:"4px 12px",borderRadius:20,background:p.stock===0?"rgba(239,68,68,.15)":"rgba(245,158,11,.15)",color:p.stock===0?"#ef4444":"#f59e0b",border:`1px solid ${p.stock===0?"rgba(239,68,68,.3)":"rgba(245,158,11,.3)"}`,fontSize:12,fontWeight:800}}>
                        {p.stock} {p.unit}
                      </span>
                    </td>
                    <td style={TD}><span style={{padding:"4px 12px",borderRadius:20,background:"rgba(255,255,255,.05)",color:"rgba(255,255,255,.35)",border:"1px solid rgba(255,255,255,.08)",fontSize:12}}>{p.minStock} {p.unit}</span></td>
                    <td style={TD}>
                      <span style={{padding:"4px 12px",borderRadius:20,background:p.stock===0?"rgba(239,68,68,.15)":"rgba(245,158,11,.15)",color:p.stock===0?"#ef4444":"#f59e0b",border:`1px solid ${p.stock===0?"rgba(239,68,68,.3)":"rgba(245,158,11,.3)"}`,fontSize:11,fontWeight:700}}>
                        {p.stock===0?"Out of Stock":"Low Stock"}
                      </span>
                    </td>
                  </tr>
                )):(
                  <tr><td colSpan="6" style={{...TD,textAlign:"center",padding:"48px",color:"rgba(255,255,255,.2)"}}>
                    <RiStockLine style={{fontSize:32,display:"block",margin:"0 auto 8px"}}/> All stock levels healthy
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
