"use client";
import { useState } from "react";

const C = {
  bg: "#0C0F14", card: "#161B22", card2: "#1C2333", border: "#2A3040",
  accent: "#22C55E", green: "#22C55E", yellow: "#EAB308", red: "#EF4444",
  blue: "#3B82F6", orange: "#FF6B35", text: "#E8ECF0", textDim: "#8B95A5",
};

const OUTLETS = [
  { id: "damansara", name: "Damansara", sales: 4820, payout: 1240, wastage: 38, foodCost: 33.2, open: true },
  { id: "bistro", name: "Bistro", sales: 3950, payout: 980, wastage: 42, foodCost: 36.1, open: true },
  { id: "jakel", name: "Jakel", sales: 5210, payout: 1520, wastage: 29, foodCost: 31.5, open: true },
  { id: "sek6", name: "SEK 6", sales: 2860, payout: 720, wastage: 55, foodCost: 38.4, open: true },
  { id: "sek14", name: "SEK 14", sales: 3410, payout: 890, wastage: 48, foodCost: 41.2, open: true },
  { id: "sek20", name: "SEK 20", sales: 2705, payout: 650, wastage: 22, foodCost: 34.8, open: false },
  { id: "kl", name: "KL", sales: 6120, payout: 1780, wastage: 62, foodCost: 37.9, open: true },
  { id: "vista", name: "Vista Alam", sales: 3190, payout: 810, wastage: 31, foodCost: 35.8, open: true },
  { id: "signature", name: "Signature", sales: 7240, payout: 2100, wastage: 44, foodCost: 32.8, open: true },
  { id: "klang1", name: "Klang 1", sales: 2980, payout: 760, wastage: 36, foodCost: 39.1, open: true },
];

const ALERTS = [
  { id: 1, severity: "red", outlet: "SEK 14", msg: "Food cost 41.2% — melebihi 40%", time: "12:45 PM" },
  { id: 2, severity: "red", outlet: "KL", msg: "Wastage RM62 — melebihi RM50", time: "11:30 AM" },
  { id: 3, severity: "yellow", outlet: "SEK 6", msg: "Wastage RM55 — melebihi RM50", time: "11:15 AM" },
  { id: 4, severity: "yellow", outlet: "Klang 1", msg: "Food cost 39.1% — hampir 40%", time: "10:20 AM" },
  { id: 5, severity: "yellow", outlet: "Bistro", msg: "Food cost 36.1% — naik dari semalam", time: "10:05 AM" },
  { id: 6, severity: "green", outlet: "Vista Alam", msg: "Food cost 35.8% ON TARGET", time: "9:50 AM" },
  { id: 7, severity: "green", outlet: "Jakel", msg: "Food cost 31.5% — terbaik hari ni", time: "9:30 AM" },
  { id: 8, severity: "green", outlet: "Signature", msg: "Top sales RM7,240", time: "9:15 AM" },
];

const PNL = {
  outlet: "Damansara", month: "Mac 2026",
  sales: 119593,
  foodCost: 50000,
  wastage: 1200,
  rental: 13000,
  salary: 20222,
  utilities: 5960,
  other: 9702,
};

const ALERT_RULES = [
  { id: 1, name: "Food Cost > 40%", enabled: true },
  { id: 2, name: "Wastage > RM50/hari", enabled: true },
  { id: 3, name: "Sales drop > 20%", enabled: false },
  { id: 4, name: "Late open (>9am)", enabled: true },
];

export default function Home() {
  const [tab, setTab] = useState(0);
  const [compareMetric, setCompareMetric] = useState("sales");
  const [rules, setRules] = useState(ALERT_RULES);
  const today = new Date().toISOString().split("T")[0];

  const totalSales = OUTLETS.reduce((s, o) => s + o.sales, 0);
  const totalPayout = OUTLETS.reduce((s, o) => s + o.payout, 0);
  const totalWastage = OUTLETS.reduce((s, o) => s + o.wastage, 0);
  const avgFC = (OUTLETS.reduce((s, o) => s + o.foodCost, 0) / OUTLETS.length).toFixed(1);
  const sorted = [...OUTLETS].sort((a, b) => b.sales - a.sales);
  const topSales = sorted[0]?.sales || 1;

  function fcColor(fc) { return fc <= 35 ? C.green : fc <= 40 ? C.yellow : C.red; }
  function sevColor(sev) { return sev === "red" ? C.red : sev === "yellow" ? C.yellow : C.green; }

  const pnlProfit = PNL.sales - PNL.foodCost - PNL.wastage - PNL.rental - PNL.salary - PNL.utilities - PNL.other;
  const pnlMargin = ((pnlProfit / PNL.sales) * 100).toFixed(2);

  const pnlLines = [
    { label: "Jualan", val: PNL.sales, pct: 100, color: C.green, bench: null },
    { label: "Food Cost", val: -PNL.foodCost, pct: (PNL.foodCost / PNL.sales * 100), color: C.red, bench: 35 },
    { label: "Wastage", val: -PNL.wastage, pct: (PNL.wastage / PNL.sales * 100), color: C.red, bench: null },
    { label: "Sewa", val: -PNL.rental, pct: (PNL.rental / PNL.sales * 100), color: C.orange, bench: 12 },
    { label: "Gaji", val: -PNL.salary, pct: (PNL.salary / PNL.sales * 100), color: C.orange, bench: 25 },
    { label: "Utilities", val: -PNL.utilities, pct: (PNL.utilities / PNL.sales * 100), color: C.yellow, bench: null },
    { label: "Lain-lain", val: -PNL.other, pct: (PNL.other / PNL.sales * 100), color: C.yellow, bench: null },
  ];

  function getCompareData() {
    if (compareMetric === "sales") return [...OUTLETS].sort((a, b) => b.sales - a.sales).map(o => ({ ...o, val: o.sales, label: `RM ${o.sales.toLocaleString()}` }));
    if (compareMetric === "foodcost") return [...OUTLETS].sort((a, b) => a.foodCost - b.foodCost).map(o => ({ ...o, val: o.foodCost, label: `${o.foodCost}%` }));
    return [...OUTLETS].sort((a, b) => b.wastage - a.wastage).map(o => ({ ...o, val: o.wastage, label: `RM ${o.wastage}` }));
  }

  const s = {
    wrap: { maxWidth: 520, margin: "0 auto", minHeight: "100vh", padding: "12px 14px 90px" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0 14px", borderBottom: `1px solid ${C.border}` },
    statCard: { background: C.card, padding: 14, borderRadius: 12, border: `1px solid ${C.border}`, flex: 1, minWidth: 0 },
    bigNum: (color) => ({ fontSize: 20, fontWeight: 900, color, marginTop: 2 }),
    label: { fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 },
    section: { background: C.card, padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 12 },
    itemRow: { background: C.card, padding: "12px 14px", borderRadius: 12, marginBottom: 6, border: `1px solid ${C.border}` },
    chip: (active) => ({ padding: "8px 16px", borderRadius: 20, border: `1px solid ${active ? C.accent : C.border}`, background: active ? C.accent + "22" : C.card, color: active ? C.accent : C.textDim, fontSize: 12, fontWeight: 700, cursor: "pointer" }),
    bottomNav: { position: "fixed", bottom: 0, left: 0, right: 0, background: C.card, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", padding: "8px 0 12px", zIndex: 100 },
    navBtn: (active) => ({ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", color: active ? C.accent : C.textDim, fontSize: 10, fontWeight: 600, cursor: "pointer", padding: "4px 12px" }),
    badge: (color) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700, background: color + "22", color }),
  };

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>👑 KHULAFA OWNER</h1>
          <p style={{ margin: 0, fontSize: 11, color: C.textDim }}>{today}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>LIVE</span>
        </div>
      </div>

      {tab === 0 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "14px 0" }}>
            <div style={s.statCard}>
              <div style={s.label}>Total Sales</div>
              <div style={s.bigNum(C.green)}>RM {totalSales.toLocaleString()}</div>
            </div>
            <div style={s.statCard}>
              <div style={s.label}>Total Payout</div>
              <div style={s.bigNum(C.red)}>RM {totalPayout.toLocaleString()}</div>
            </div>
            <div style={s.statCard}>
              <div style={s.label}>Wastage</div>
              <div style={s.bigNum(C.yellow)}>RM {totalWastage}</div>
            </div>
            <div style={s.statCard}>
              <div style={s.label}>Avg Food Cost</div>
              <div style={s.bigNum(fcColor(parseFloat(avgFC)))}>{avgFC}%</div>
            </div>
          </div>
          <div style={{ ...s.label, margin: "4px 0 8px" }}>{OUTLETS.length} Cawangan</div>
          {sorted.map((o, i) => {
            const netVal = o.sales - o.payout;
            return (
              <div key={o.id} style={s.itemRow}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: o.open ? C.green : C.textMuted, flexShrink: 0 }} />
                    <span style={{ fontSize: 15, fontWeight: 800 }}>{o.name}</span>
                  </div>
                  <span style={s.badge(fcColor(o.foodCost))}>FC {o.foodCost}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textDim, marginBottom: 6 }}>
                  <span>Sales: <b style={{ color: C.green }}>RM {o.sales.toLocaleString()}</b></span>
                  <span>Payout: <b style={{ color: C.red }}>RM {o.payout}</b></span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textDim, marginBottom: 6 }}>
                  <span>Wastage: <b style={{ color: o.wastage > 50 ? C.red : C.yellow }}>RM {o.wastage}</b></span>
                  <span>Net: <b style={{ color: netVal >= 0 ? C.green : C.red }}>RM {netVal.toLocaleString()}</b></span>
                </div>
                <div style={{ height: 4, background: C.bg, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(o.sales / topSales) * 100}%`, background: C.accent, borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 1 && (
        <div>
          <div style={{ display: "flex", gap: 8, margin: "14px 0" }}>
            <div style={s.statCard}>
              <div style={s.label}>Alerts</div>
              <div style={s.bigNum(C.red)}>{ALERTS.filter(a => a.severity === "red").length} Critical</div>
            </div>
            <div style={s.statCard}>
              <div style={s.label}>Warnings</div>
              <div style={s.bigNum(C.yellow)}>{ALERTS.filter(a => a.severity === "yellow").length}</div>
            </div>
          </div>
          {ALERTS.map(a => (
            <div key={a.id} style={{ ...s.itemRow, borderLeft: `3px solid ${sevColor(a.severity)}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{a.outlet}</div>
                  <div style={{ fontSize: 12, color: sevColor(a.severity), marginTop: 2 }}>{a.msg}</div>
                </div>
                <span style={{ fontSize: 11, color: C.textDim, flexShrink: 0, marginLeft: 8 }}>{a.time}</span>
              </div>
            </div>
          ))}
          <div style={{ ...s.section, marginTop: 16 }}>
            <div style={{ ...s.label, marginBottom: 10 }}>Alert Rules</div>
            {rules.map(r => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 13, color: r.enabled ? C.text : C.textDim }}>{r.name}</span>
                <button onClick={() => setRules(prev => prev.map(x => x.id === r.id ? { ...x, enabled: !x.enabled } : x))} style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: r.enabled ? C.green : C.textMuted, cursor: "pointer", position: "relative", transition: "background .2s" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 3, left: r.enabled ? 23 : 3, transition: "left .2s" }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 2 && (
        <div>
          <div style={{ ...s.section, marginTop: 14, background: `linear-gradient(135deg, ${C.accent} 0%, #16A34A 100%)`, border: "none", color: "#fff" }}>
            <div style={{ fontSize: 11, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1.5 }}>P&L — {PNL.outlet} · {PNL.month}</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4 }}>RM {pnlProfit.toLocaleString()}</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>Margin: {pnlMargin}%</div>
          </div>

          <div style={s.section}>
            {pnlLines.map((line, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{line.label}</span>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: line.color }}>
                      {line.val >= 0 ? "" : "-"}RM {Math.abs(line.val).toLocaleString()}
                    </span>
                    <span style={{ fontSize: 11, color: C.textDim, marginLeft: 8 }}>{line.pct.toFixed(1)}%</span>
                  </div>
                </div>
                {line.bench && (
                  <div style={{ fontSize: 11, marginTop: 4, color: line.pct > line.bench ? C.red : C.green }}>
                    {line.pct > line.bench ? "⚠" : "✓"} Benchmark: {line.bench}% — Actual: {line.pct.toFixed(1)}%
                  </div>
                )}
              </div>
            ))}
            <div style={{ padding: "10px 0", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 800 }}>PROFIT</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: pnlProfit >= 0 ? C.green : C.red }}>RM {pnlProfit.toLocaleString()}</span>
            </div>
          </div>

          <div style={s.section}>
            <div style={{ ...s.label, marginBottom: 8 }}>Benchmark vs Target</div>
            {[
              { label: "Food Cost", actual: (PNL.foodCost / PNL.sales * 100), target: 35 },
              { label: "Rental", actual: (PNL.rental / PNL.sales * 100), target: 12 },
              { label: "Salary", actual: (PNL.salary / PNL.sales * 100), target: 25 },
              { label: "Margin", actual: parseFloat(pnlMargin), target: 15 },
            ].map(b => {
              const ok = b.label === "Margin" ? b.actual >= b.target : b.actual <= b.target;
              return (
                <div key={b.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span>{b.label}</span>
                    <span style={{ fontWeight: 700, color: ok ? C.green : C.red }}>{b.actual.toFixed(1)}% {ok ? "✓" : "⚠"} (target: {b.target}%)</span>
                  </div>
                  <div style={{ height: 6, background: C.bg, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min((b.actual / (b.target * 1.5)) * 100, 100)}%`, background: ok ? C.green : C.red, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={s.section}>
            <div style={{ ...s.label, marginBottom: 8 }}>Action Items</div>
            {[
              { text: "Food cost 41.8% — review supplier pricing", status: "urgent" },
              { text: "Rental 10.9% — within target ✓", status: "ok" },
              { text: "Salary 16.9% — within target ✓", status: "ok" },
              { text: "Margin 8.95% — below 15% target, review all costs", status: "urgent" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 14 }}>{item.status === "urgent" ? "🔴" : "🟢"}</span>
                <span style={{ fontSize: 12, color: item.status === "urgent" ? C.text : C.textDim }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 3 && (
        <div>
          <div style={{ display: "flex", gap: 6, margin: "14px 0 12px", justifyContent: "center" }}>
            {[
              { key: "sales", label: "Sales" },
              { key: "foodcost", label: "Food Cost" },
              { key: "wastage", label: "Wastage" },
            ].map(m => (
              <button key={m.key} onClick={() => setCompareMetric(m.key)} style={s.chip(compareMetric === m.key)}>{m.label}</button>
            ))}
          </div>
          {getCompareData().map((o, i) => {
            const maxVal = compareMetric === "sales" ? getCompareData()[0].val : compareMetric === "foodcost" ? 50 : getCompareData()[0].val;
            const pct = compareMetric === "foodcost" ? (o.val / maxVal) * 100 : (o.val / maxVal) * 100;
            const barColor = i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : C.accent;
            const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
            return (
              <div key={o.id} style={{ ...s.itemRow, borderLeft: i < 3 ? `3px solid ${rankColors[i]}` : "3px solid transparent" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: i < 3 ? rankColors[i] : C.textDim, minWidth: 22 }}>#{i + 1}</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{o.name}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: compareMetric === "foodcost" ? fcColor(o.val) : i < 3 ? rankColors[i] : C.accent }}>{o.label}</span>
                </div>
                <div style={{ height: 6, background: C.bg, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: barColor, borderRadius: 3, transition: "width .3s" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={s.bottomNav}>
        {[
          { icon: "🏪", label: "Live" },
          { icon: "🔔", label: "Alerts" },
          { icon: "📈", label: "P&L" },
          { icon: "⚖️", label: "Compare" },
        ].map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={s.navBtn(tab === i)}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
