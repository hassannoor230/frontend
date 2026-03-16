import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { FiAlertTriangle, FiRefreshCw, FiPackage } from "react-icons/fi";
import { BsCheckCircleFill, BsBoxSeam } from "react-icons/bs";
import { GoAlertFill } from "react-icons/go";
import { FaBox, FaLayerGroup } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { RiStockLine } from "react-icons/ri";
import { MdInventory, MdWarehouse } from "react-icons/md";

/* ─── Font + CSS Injection (same as admin dashboard) ─── */
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
    @keyframes ld-glow { 0%,100%{text-shadow:0 0 0 transparent} 50%{text-shadow:0 0 24px rgba(16,185,129,.35)} }
    .ld-fu  { animation: ld-fadeup .55s cubic-bezier(.23,1,.32,1) both; }
    .ld-fu1 { animation: ld-fadeup .55s .06s cubic-bezier(.23,1,.32,1) both; }
    .ld-fu2 { animation: ld-fadeup .55s .12s cubic-bezier(.23,1,.32,1) both; }
    .ld-fu3 { animation: ld-fadeup .55s .18s cubic-bezier(.23,1,.32,1) both; }
    .ld-fu4 { animation: ld-fadeup .55s .24s cubic-bezier(.23,1,.32,1) both; }
    .ld-fu5 { animation: ld-fadeup .55s .30s cubic-bezier(.23,1,.32,1) both; }
    .ld-gold { animation: ld-glow 3s ease-in-out infinite; }
    .ld-spin { animation: ld-spin 1s linear infinite; }
    .ld-pulse-dot { animation: ld-pulse 2s ease-in-out infinite; }
    .ld-card { transition: transform .22s ease, box-shadow .22s ease; }
    .ld-card:hover { transform: translateY(-3px); }
    .ld-row:hover { background: rgba(255,255,255,.028) !important; }
    ::-webkit-scrollbar { width:3px; height:3px; }
    ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08); border-radius:2px; }
    ::-webkit-scrollbar-track { background:transparent; }
  `;
  document.head.appendChild(style);
};

/* ─── Clock ─── */
const Clock = () => {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return (
    <span style={{ fontSize: 12, color: "rgba(255,255,255,.28)", fontVariantNumeric: "tabular-nums", letterSpacing: 1 }}>
      {t.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </span>
  );
};

/* ─── KPI Card ─── */
const KPI = ({ title, value, sub, icon, color, cls = "" }) => (
  <div className={`ld-card ${cls}`} style={{
    background: "linear-gradient(135deg, rgba(255,255,255,.045) 0%, rgba(255,255,255,.012) 100%)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 20,
    padding: "22px 22px 20px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.06)",
  }}>
    <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${color}28 0%, transparent 70%)`, pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, width: "50%", height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
      <div style={{ width: 42, height: 42, borderRadius: 13, background: `${color}18`, border: `1px solid ${color}35`, display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: 19 }}>
        {icon}
      </div>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,.28)", textTransform: "uppercase", letterSpacing: "2.5px", fontWeight: 600, lineHeight: 1.4, textAlign: "right", maxWidth: 100 }}>{title}</span>
    </div>
    <div className="ld-gold" style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-0.5px" }}>{value}</div>
    {sub && <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginTop: 6, fontWeight: 400 }}>{sub}</p>}
  </div>
);

/* ─── Section Header ─── */
const SHead = ({ title, sub, right }) => (
  <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.2px" }}>{title}</h2>
      {sub && <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)", marginTop: 3 }}>{sub}</p>}
    </div>
    {right}
  </div>
);

/* ─── Chip ─── */
const Chip = ({ children, color = "#6366f1" }) => (
  <span style={{ padding: "3px 12px", borderRadius: 20, background: `${color}18`, border: `1px solid ${color}35`, fontSize: 11, color, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
    {children}
  </span>
);

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const InventoryDashboard = () => {
  const navigate = useNavigate();
  useEffect(() => { injectStyles(); }, []);

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [spinning, setSpinning] = useState(false);

  const fetchProducts = async (manual = false) => {
    if (manual) setSpinning(true);
    try {
      const { data } = await API.get("/products");
      setProducts(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSpinning(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const lowStock   = products.filter((p) => p.stock <= p.minStock && p.stock > 0);
  const outOfStock = products.filter((p) => p.stock === 0);
  const inStock    = products.filter((p) => p.stock > p.minStock);

  const GLASS = {
    background: "linear-gradient(135deg,rgba(255,255,255,.042) 0%,rgba(255,255,255,.012) 100%)",
    border: "1px solid rgba(255,255,255,.075)",
    borderRadius: 20,
    boxShadow: "0 4px 32px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.055)",
  };
  const TH = { padding: "11px 20px", fontSize: 10, color: "rgba(255,255,255,.22)", textTransform: "uppercase", letterSpacing: "2px", textAlign: "left", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,.055)", background: "rgba(255,255,255,.015)", fontFamily: "Outfit" };
  const TD = { padding: "13px 20px", fontSize: 13, color: "rgba(255,255,255,.7)", fontFamily: "Outfit", borderBottom: "1px solid rgba(255,255,255,.03)" };

  if (loading) return (
    <div className="ld-root" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div className="ld-spin" style={{ width: 44, height: 44, border: "2px solid rgba(16,185,129,.15)", borderTop: "2px solid #10b981", borderRadius: "50%", margin: "0 auto 16px" }} />
        <p style={{ color: "rgba(255,255,255,.25)", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Outfit" }}>Loading</p>
      </div>
    </div>
  );

  return (
    <div className="ld-root" style={{ minHeight: "100vh", padding: "0 0 48px" }}>

      {/* Ambient blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-25%", left: "-15%", width: "55%", height: "55%", borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,.05) 0%,transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-25%", right: "-15%", width: "55%", height: "55%", borderRadius: "50%", background: "radial-gradient(circle,rgba(245,158,11,.035) 0%,transparent 70%)" }} />
        <div style={{ position: "absolute", top: "40%", right: "20%", width: "30%", height: "30%", borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,.025) 0%,transparent 70%)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ══ HEADER ══ */}
        <div className="ld-fu" style={{ paddingBottom: 26, borderBottom: "1px solid rgba(255,255,255,.06)", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div className="ld-pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
                <span style={{ fontSize: 10, color: "#10b981", textTransform: "uppercase", letterSpacing: "3px", fontWeight: 700 }}>Live Inventory</span>
                <Clock />
              </div>
              <h1 className="ld-serif" style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 400, color: "#fff", margin: 0, lineHeight: 1.1 }}>
                Inventory
                <span style={{ fontStyle: "italic", color: "rgba(255,255,255,.38)" }}> — Stock Control</span>
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,.28)", marginTop: 7, fontWeight: 400 }}>
                {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ textAlign: "right", paddingRight: 16, borderRight: "1px solid rgba(255,255,255,.07)" }}>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,.28)", textTransform: "uppercase", letterSpacing: 2, margin: 0 }}>Total Products</p>
                <p className="ld-gold" style={{ fontSize: 22, fontWeight: 900, color: "#10b981", margin: 0 }}>{products.length}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,.28)", margin: 0 }}>{inStock.length} in stock</p>
              </div>
              <button
                onClick={() => fetchProducts(true)}
                disabled={spinning}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", color: "rgba(255,255,255,.55)", fontSize: 13, cursor: "pointer", transition: "all .2s", fontFamily: "Outfit" }}
              >
                <FiRefreshCw className={spinning ? "ld-spin" : ""} />
                Refresh
              </button>
              <button
                onClick={() => navigate("/inventory/products")}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, background: "linear-gradient(135deg,#10b981,#059669)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit", boxShadow: "0 4px 20px rgba(16,185,129,.28)" }}
              >
                <MdInventory /> View Products
              </button>
            </div>
          </div>
        </div>

        {/* ══ KPI ROW 1 ══ */}
        <div className="ld-fu1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 16, marginBottom: 20 }}>
          <KPI title="Total Products" value={products.length}   icon={<FaLayerGroup />}    color="#6366f1" sub="All catalog items" />
          <KPI title="In Stock"       value={inStock.length}    icon={<FaBox />}           color="#10b981" sub="Above minimum level" />
          <KPI title="Low Stock"      value={lowStock.length}   icon={<GoAlertFill />}     color="#f59e0b" sub="Needs restocking soon" />
          <KPI title="Out of Stock"   value={outOfStock.length} icon={<FiAlertTriangle />} color="#ef4444" sub="Immediate action needed" />
        </div>

        {/* ══ LOW STOCK TABLE ══ */}
        <div className="ld-fu2 ld-card" style={{ ...GLASS, overflow: "hidden", marginBottom: 20 }}>
          <SHead
            title="Low Stock Products"
            sub="Products approaching minimum stock level"
            right={
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Chip color="#f59e0b"><GoAlertFill /> {lowStock.length} items</Chip>
                <button
                  onClick={() => navigate("/inventory/adjustments")}
                  style={{ padding: "5px 16px", borderRadius: 10, background: "rgba(16,185,129,.15)", border: "1px solid rgba(16,185,129,.3)", color: "#10b981", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit" }}
                >
                  Adjust Stock →
                </button>
              </div>
            }
          />
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={TH}>Product</th>
                  <th style={TH}>SKU</th>
                  <th style={TH}>Category</th>
                  <th style={TH}>Current Stock</th>
                  <th style={TH}>Min Stock</th>
                  <th style={TH}>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.length > 0 ? (
                  lowStock.map((product) => (
                    <tr key={product._id} className="ld-row">
                      <td style={{ ...TD, fontWeight: 600, color: "rgba(255,255,255,.82)" }}>{product.name}</td>
                      <td style={{ ...TD, fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,.25)" }}>{product.sku}</td>
                      <td style={{ ...TD, color: "rgba(255,255,255,.38)", fontSize: 12 }}>{product.category?.name}</td>
                      <td style={TD}>
                        <span style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(245,158,11,.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,.3)", fontSize: 12, fontWeight: 800 }}>
                          {product.stock} {product.unit}
                        </span>
                      </td>
                      <td style={TD}>
                        <span style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.35)", border: "1px solid rgba(255,255,255,.08)", fontSize: 12 }}>
                          {product.minStock} {product.unit}
                        </span>
                      </td>
                      <td style={TD}>
                        <span style={{ padding: "4px 12px", borderRadius: 20, background: product.stock === 0 ? "rgba(239,68,68,.15)" : "rgba(245,158,11,.15)", color: product.stock === 0 ? "#ef4444" : "#f59e0b", border: `1px solid ${product.stock === 0 ? "rgba(239,68,68,.3)" : "rgba(245,158,11,.3)"}`, fontSize: 11, fontWeight: 700 }}>
                          {product.stock === 0 ? "Out of Stock" : "Low Stock"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ ...TD, textAlign: "center", padding: "48px", color: "rgba(255,255,255,.2)" }}>
                      <BsCheckCircleFill style={{ fontSize: 32, display: "block", margin: "0 auto 8px", color: "#10b981" }} />
                      All products have sufficient stock
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ OUT OF STOCK TABLE ══ */}
        {outOfStock.length > 0 && (
          <div className="ld-fu3 ld-card" style={{ ...GLASS, overflow: "hidden", border: "1px solid rgba(239,68,68,.2)" }}>
            <SHead
              title="Out of Stock Products"
              sub="Immediate restocking required"
              right={<Chip color="#ef4444"><FiAlertTriangle /> {outOfStock.length} critical</Chip>}
            />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ ...TH, background: "rgba(239,68,68,.06)" }}>Product</th>
                    <th style={{ ...TH, background: "rgba(239,68,68,.06)" }}>SKU</th>
                    <th style={{ ...TH, background: "rgba(239,68,68,.06)" }}>Category</th>
                    <th style={{ ...TH, background: "rgba(239,68,68,.06)" }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {outOfStock.map((product) => (
                    <tr key={product._id} className="ld-row">
                      <td style={{ ...TD, fontWeight: 600, color: "rgba(255,255,255,.82)" }}>{product.name}</td>
                      <td style={{ ...TD, fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,.25)" }}>{product.sku}</td>
                      <td style={{ ...TD, color: "rgba(255,255,255,.38)", fontSize: 12 }}>{product.category?.name}</td>
                      <td style={{ ...TD, fontWeight: 800, color: "#f59e0b" }}>Rs. {product.price?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InventoryDashboard;