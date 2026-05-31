import { useState, useMemo } from "react";

// ─── MOCK DATA ──────────────────────────────────────────────────────────────

const TODAY = new Date("2026-05-30");

const d = (offset) => {
  const base = new Date("2026-05-30");
  base.setDate(base.getDate() + offset);
  return base.toISOString().split("T")[0];
};

const BUSINESSES = [
  { id: "b1", name: "Light Sleeper Wine Bar", type: "Wine Bar", city: "Washington", state: "DC", contact: "Sarah Chen" },
  { id: "b2", name: "Kily Import", type: "Wine Importer", city: "Washington", state: "DC", contact: "Marcus Wright" },
  { id: "b3", name: "Capitol Hill Food Truck", type: "Food Truck", city: "Washington", state: "DC", contact: "Priya Patel" },
];

const ITEMS = [
  // Light Sleeper Wine Bar
  { id: "1", biz: "b1", title: "City Business License Renewal", category: "Business License", status: "Overdue", priority: "Critical", due: d(-15), reqDoc: true, docStatus: "missing" },
  { id: "2", biz: "b1", title: "ABRA Retailer Liquor License Renewal", category: "Alcohol License", status: "In Progress", priority: "Critical", due: d(11), reqDoc: true, docStatus: "uploaded" },
  { id: "3", biz: "b1", title: "Liquor Liability Insurance Certificate", category: "Insurance", status: "In Progress", priority: "Critical", due: d(16), reqDoc: true, docStatus: "missing" },
  { id: "4", biz: "b1", title: "Food Handler Cards — Staff Renewal", category: "Food Handler / Safety", status: "Due Soon", priority: "Medium", due: d(6), reqDoc: false, docStatus: "not_required" },
  { id: "5", biz: "b1", title: "Health Department Food Service Permit", category: "Health Permit", status: "Not Started", priority: "High", due: d(32), reqDoc: true, docStatus: "missing" },
  { id: "6", biz: "b1", title: "Required Labor Law Postings", category: "Required Posting", status: "Completed", priority: "Low", due: d(-60), reqDoc: false, docStatus: "not_required" },
  { id: "7", biz: "b1", title: "Q2 Payroll Tax Filing (941)", category: "Tax / Excise", status: "Not Started", priority: "High", due: d(31), reqDoc: false, docStatus: "not_required" },
  // Kily Import
  { id: "8", biz: "b2", title: "TTB Basic Importer Permit — Annual Review", category: "TTB / Alcohol Federal", status: "Overdue", priority: "Critical", due: d(-29), reqDoc: true, docStatus: "missing" },
  { id: "9", biz: "b2", title: "Workers' Compensation Insurance", category: "Insurance", status: "Overdue", priority: "Critical", due: d(-31), reqDoc: true, docStatus: "expired" },
  { id: "10", biz: "b2", title: "Federal Excise Tax Return (Q2)", category: "Tax / Excise", status: "Overdue", priority: "Critical", due: d(-10), reqDoc: false, docStatus: "not_required" },
  { id: "11", biz: "b2", title: "FDA Food Facility Registration Renewal", category: "FDA / Federal", status: "Not Started", priority: "High", due: d(9), reqDoc: false, docStatus: "not_required" },
  { id: "12", biz: "b2", title: "Maryland Warehouse Liability Insurance", category: "Insurance", status: "Due Soon", priority: "High", due: d(13), reqDoc: true, docStatus: "expired" },
  { id: "13", biz: "b2", title: "General Liability Insurance — Annual Renewal", category: "Insurance", status: "In Progress", priority: "Critical", due: d(31), reqDoc: true, docStatus: "missing" },
  { id: "14", biz: "b2", title: "Product Label Documentation", category: "Other", status: "Completed", priority: "Low", due: d(-60), reqDoc: true, docStatus: "uploaded" },
  // Capitol Hill Food Truck
  { id: "15", biz: "b3", title: "Mobile Food Unit Permit — Annual", category: "Health Permit", status: "Due Soon", priority: "Critical", due: d(4), reqDoc: true, docStatus: "missing" },
  { id: "16", biz: "b3", title: "City Vending Permit (Public Space)", category: "Business License", status: "Overdue", priority: "Critical", due: d(-31), reqDoc: true, docStatus: "expired" },
  { id: "17", biz: "b3", title: "General Liability Insurance Certificate", category: "Insurance", status: "Overdue", priority: "Critical", due: d(-15), reqDoc: true, docStatus: "expired" },
  { id: "18", biz: "b3", title: "Health Department Inspection", category: "Health Permit", status: "Overdue", priority: "High", due: d(-20), reqDoc: false, docStatus: "not_required" },
  { id: "19", biz: "b3", title: "Fire Suppression System Inspection", category: "Fire / Safety", status: "Not Started", priority: "High", due: d(26), reqDoc: true, docStatus: "missing" },
  { id: "20", biz: "b3", title: "Food Handler Cards — 3 Staff Renewals", category: "Food Handler / Safety", status: "In Progress", priority: "Medium", due: d(16), reqDoc: false, docStatus: "not_required" },
  { id: "21", biz: "b3", title: "Commissary Agreement — Union Kitchen", category: "Lease / Real Estate", status: "Completed", priority: "Medium", due: d(-45), reqDoc: true, docStatus: "uploaded" },
  { id: "22", biz: "b3", title: "Q2 Sales Tax Filing", category: "Tax / Excise", status: "Not Started", priority: "Medium", due: d(31), reqDoc: false, docStatus: "not_required" },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────

function isOverdue(item) {
  if (item.status === "Completed" || item.status === "Not Applicable") return false;
  return new Date(item.due) < TODAY;
}

function isDueSoon(item, days = 30) {
  if (item.status === "Completed") return false;
  const due = new Date(item.due);
  const threshold = new Date(TODAY);
  threshold.setDate(threshold.getDate() + days);
  return due >= TODAY && due <= threshold;
}

function daysAway(item) {
  const diff = Math.round((new Date(item.due) - TODAY) / 86400000);
  return diff;
}

function fmtDate(str) {
  if (!str) return "—";
  const d = new Date(str + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const STATUS_STYLE = {
  "Overdue":          { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
  "Due Soon":         { bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
  "In Progress":      { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  "Not Started":      { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" },
  "Waiting on Client":{ bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  "Waiting on Agency":{ bg: "#faf5ff", text: "#7c3aed", border: "#ddd6fe" },
  "Completed":        { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  "Not Applicable":   { bg: "#f8fafc", text: "#94a3b8", border: "#e2e8f0" },
};

const PRIORITY_STYLE = {
  "Critical": { dot: "#ef4444", text: "#b91c1c", bg: "#fef2f2" },
  "High":     { dot: "#f97316", text: "#c2410c", bg: "#fff7ed" },
  "Medium":   { dot: "#eab308", text: "#a16207", bg: "#fefce8" },
  "Low":      { dot: "#94a3b8", text: "#475569", bg: "#f8fafc" },
};

function effStatus(item) {
  if (item.status === "Completed") return "Completed";
  if (isOverdue(item)) return "Overdue";
  if (isDueSoon(item, 7)) return "Due Soon";
  return item.status;
}

// ─── MICRO COMPONENTS ───────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE["Not Started"];
  return (
    <span style={{
      background: s.bg, color: s.text, border: `1px solid ${s.border}`,
      padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600,
      display: "inline-flex", alignItems: "center", whiteSpace: "nowrap"
    }}>{status}</span>
  );
}

function PriorityBadge({ priority }) {
  const p = PRIORITY_STYLE[priority] ?? PRIORITY_STYLE["Low"];
  return (
    <span style={{
      background: p.bg, color: p.text,
      padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600,
      display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap"
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.dot, display: "inline-block" }} />
      {priority}
    </span>
  );
}

function StatCard({ label, value, sub, alert, warn, success, icon }) {
  const bg = alert ? "#fef2f2" : warn ? "#fffbeb" : success ? "#f0fdf4" : "#fff";
  const border = alert ? "#fecaca" : warn ? "#fde68a" : success ? "#bbf7d0" : "#e2e8f0";
  const valColor = alert ? "#b91c1c" : warn ? "#b45309" : success ? "#15803d" : "#0f172a";
  return (
    <div style={{
      background: bg, border: `1px solid ${border}`, borderRadius: 12,
      padding: "16px 18px", display: "flex", flexDirection: "column", gap: 4, flex: 1
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b" }}>
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: valColor, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#94a3b8" }}>{sub}</div>}
    </div>
  );
}

// ─── SIDEBAR ────────────────────────────────────────────────────────────────

const NAV = [
  { id: "dashboard",   label: "Dashboard",       icon: "◉" },
  { id: "businesses",  label: "Businesses",       icon: "⊞" },
  { id: "compliance",  label: "Compliance Items", icon: "☑" },
  { id: "templates",   label: "Templates",        icon: "⊡" },
  { id: "calendar",    label: "Calendar",         icon: "◫" },
  { id: "documents",   label: "Documents",        icon: "⊟" },
  { id: "admin",       label: "Concierge View",   icon: "⊛" },
  { id: "settings",    label: "Settings",         icon: "⊙" },
];

function Sidebar({ view, setView }) {
  return (
    <div style={{
      width: 220, flexShrink: 0, background: "#fff", borderRight: "1px solid #e2e8f0",
      display: "flex", flexDirection: "column", height: "100%"
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, background: "#2563eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: "#fff", fontSize: 14 }}>✦</span>
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 13, color: "#0f172a", lineHeight: 1.2 }}>BackStOPS</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em", textTransform: "uppercase" }}>Compliance</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 10px", overflowY: "auto" }}>
        {NAV.map((n) => (
          <button key={n.id} onClick={() => setView(n.id)} style={{
            display: "flex", alignItems: "center", gap: 9, width: "100%",
            padding: "7px 10px", borderRadius: 8, border: "none", cursor: "pointer",
            background: view === n.id ? "#eff6ff" : "transparent",
            color: view === n.id ? "#2563eb" : "#475569",
            fontWeight: view === n.id ? 700 : 500,
            fontSize: 13, textAlign: "left", marginBottom: 1,
            transition: "all 0.1s"
          }}>
            <span style={{ fontSize: 14, opacity: 0.8 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: "10px 14px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#475569" }}>A</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>Alice Morgan</div>
          <div style={{ fontSize: 10, color: "#94a3b8" }}>Owner</div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD VIEW ─────────────────────────────────────────────────────────

function DashboardView({ setView, setSelectedItem }) {
  const overdue = ITEMS.filter(isOverdue);
  const due7    = ITEMS.filter(i => isDueSoon(i, 7));
  const due30   = ITEMS.filter(i => isDueSoon(i, 30));
  const missing = ITEMS.filter(i => i.reqDoc && i.docStatus === "missing");
  const completed = ITEMS.filter(i => i.status === "Completed");

  const needsAttn = ITEMS.filter(i => isOverdue(i) || (i.priority === "Critical" && i.status !== "Completed")).slice(0, 6);

  const catBreakdown = useMemo(() => {
    const counts = {};
    ITEMS.forEach(ci => {
      if (ci.status !== "Completed") counts[ci.category] = (counts[ci.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, 6);
  }, []);

  const bizMap = Object.fromEntries(BUSINESSES.map(b => [b.id, b]));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Compliance Dashboard</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>Saturday, May 30, 2026</div>
        </div>
        <button onClick={() => setView("compliance")} style={{
          background: "#2563eb", color: "#fff", border: "none", borderRadius: 8,
          padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6
        }}>+ Add Item</button>
      </div>

      {/* Overdue alert */}
      {overdue.length > 0 && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18 }}>⚠</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#b91c1c" }}>{overdue.length} overdue items require immediate attention</div>
            <div style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}>{overdue.slice(0, 3).map(i => i.title).join(", ")}{overdue.length > 3 ? ` +${overdue.length-3} more` : ""}</div>
          </div>
          <button onClick={() => setView("compliance")} style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>View Overdue</button>
        </div>
      )}

      {/* Stat cards row 1 */}
      <div style={{ display: "flex", gap: 12 }}>
        <StatCard label="Overdue" value={overdue.length} sub="Immediate action" alert={overdue.length > 0} />
        <StatCard label="Due in 7 Days" value={due7.length} sub="Act this week" warn={due7.length > 0} />
        <StatCard label="Due in 30 Days" value={due30.length} sub="Upcoming deadlines" />
        <StatCard label="Missing Documents" value={missing.length} sub="Need uploading" warn={missing.length > 0} />
      </div>

      {/* Stat cards row 2 */}
      <div style={{ display: "flex", gap: 12 }}>
        <StatCard label="Active Items" value={ITEMS.filter(i => i.status !== "Completed").length} sub="Not completed" />
        <StatCard label="Completed" value={completed.length} sub="This period" success />
        <StatCard label="Businesses" value={BUSINESSES.length} sub="Under management" />
        <StatCard label="Critical / High" value={ITEMS.filter(i => (i.priority === "Critical" || i.priority === "High") && i.status !== "Completed").length} sub="High priority" warn />
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 280px", gap: 16 }}>
        {/* Needs attention */}
        <div style={{ gridColumn: "1 / 3", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>⚠ Needs Attention</span>
            <button onClick={() => setView("compliance")} style={{ fontSize: 11, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
          </div>
          {needsAttn.map(item => {
            const biz = bizMap[item.biz];
            const days = daysAway(item);
            const overd = isOverdue(item);
            return (
              <div key={item.id} onClick={() => { setSelectedItem(item); setView("detail"); }} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
                borderBottom: "1px solid #f8fafc", cursor: "pointer",
                background: overd ? "#fff5f5" : "#fff"
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{biz?.name} · {item.category}</div>
                </div>
                <PriorityBadge priority={item.priority} />
                <StatusBadge status={effStatus(item)} />
                <div style={{ fontSize: 11, fontWeight: overd ? 700 : 400, color: overd ? "#dc2626" : "#64748b", minWidth: 70, textAlign: "right" }}>
                  {overd ? `${Math.abs(days)}d overdue` : `Due ${fmtDate(item.due)}`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Category breakdown */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>By Category</span>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Active items</div>
          </div>
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {catBreakdown.map(([cat, count]) => {
              const max = catBreakdown[0][1];
              return (
                <div key={cat}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>{cat}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{count}</span>
                  </div>
                  <div style={{ height: 5, background: "#f1f5f9", borderRadius: 99 }}>
                    <div style={{ height: "100%", width: `${(count/max)*100}%`, background: "#3b82f6", borderRadius: 99 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COMPLIANCE VIEW ─────────────────────────────────────────────────────────

function ComplianceView({ setSelectedItem, setView }) {
  const [search, setSearch] = useState("");
  const [bizFilter, setBizFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const bizMap = Object.fromEntries(BUSINESSES.map(b => [b.id, b]));

  const filtered = ITEMS.filter(item => {
    if (bizFilter !== "all" && item.biz !== bizFilter) return false;
    if (statusFilter !== "all" && effStatus(item) !== statusFilter) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const ao = isOverdue(a) ? 100 : 0;
    const bo = isOverdue(b) ? 100 : 0;
    if (bo !== ao) return bo - ao;
    const po = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return po[a.priority] - po[b.priority];
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Compliance Items</div>
          <div style={{ fontSize: 13, color: "#64748b" }}>{filtered.length} of {ITEMS.length} items</div>
        </div>
        <button style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add Item</button>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items…" style={{
          flex: 2, border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 11px", fontSize: 13, outline: "none"
        }} />
        <select value={bizFilter} onChange={e => setBizFilter(e.target.value)} style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 11px", fontSize: 13, background: "#fff" }}>
          <option value="all">All Businesses</option>
          {BUSINESSES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 11px", fontSize: 13, background: "#fff" }}>
          <option value="all">All Statuses</option>
          {["Overdue","Due Soon","In Progress","Not Started","Completed","Waiting on Client"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Item", "Business", "Category", "Due Date", "Status", "Priority"].map(h => (
                <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#64748b" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const biz = bizMap[item.biz];
              const overd = isOverdue(item);
              return (
                <tr key={item.id} onClick={() => { setSelectedItem(item); setView("detail"); }}
                  style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer", background: overd ? "#fff5f5" : "#fff" }}
                  onMouseEnter={e => e.currentTarget.style.background = overd ? "#fef2f2" : "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = overd ? "#fff5f5" : "#fff"}
                >
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{item.title}</div>
                    {item.reqDoc && item.docStatus === "missing" && <div style={{ fontSize: 10, color: "#f97316", marginTop: 1 }}>Missing document</div>}
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569" }}>{biz?.name}</td>
                  <td style={{ padding: "10px 14px", fontSize: 11, color: "#64748b" }}>{item.category}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, fontWeight: overd ? 700 : 400, color: overd ? "#dc2626" : "#475569" }}>{fmtDate(item.due)}</td>
                  <td style={{ padding: "10px 14px" }}><StatusBadge status={effStatus(item)} /></td>
                  <td style={{ padding: "10px 14px" }}><PriorityBadge priority={item.priority} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── DETAIL VIEW ─────────────────────────────────────────────────────────────

function DetailView({ item, setView }) {
  const [completed, setCompleted] = useState(item.status === "Completed");
  const biz = BUSINESSES.find(b => b.id === item.biz);
  const days = daysAway(item);
  const overd = isOverdue(item);

  return (
    <div style={{ maxWidth: 760, display: "flex", flexDirection: "column", gap: 16 }}>
      <button onClick={() => setView("compliance")} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13, textAlign: "left", display: "flex", alignItems: "center", gap: 5 }}>← Back to compliance items</button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>{item.title}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <StatusBadge status={completed ? "Completed" : effStatus(item)} />
            <PriorityBadge priority={item.priority} />
            <span style={{ background: "#f1f5f9", color: "#475569", borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{item.category}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {!completed && (
            <button onClick={() => setCompleted(true)} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✓ Mark Complete</button>
          )}
          <button style={{ background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✎ Edit</button>
        </div>
      </div>

      {overd && !completed && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 600, color: "#b91c1c", display: "flex", alignItems: "center", gap: 8 }}>
          ⚠ This item is {Math.abs(days)} days overdue. Immediate action required.
        </div>
      )}
      {completed && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 600, color: "#15803d", display: "flex", alignItems: "center", gap: 8 }}>
          ✓ Marked as complete.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
        {/* Main details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", fontSize: 12, fontWeight: 700, color: "#374151" }}>Item Details</div>
            {[
              ["Business", biz?.name],
              ["Agency", item.category.includes("TTB") ? "TTB" : item.category.includes("FDA") ? "FDA" : "Relevant Agency"],
              ["Jurisdiction", biz?.state ?? "—"],
              ["Frequency", "Annual"],
              ["Assigned To", biz?.contact],
              ["Reminder", "30 days before due"],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", gap: 16, padding: "9px 16px", borderBottom: "1px solid #f8fafc" }}>
                <dt style={{ width: 160, flexShrink: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8", paddingTop: 1 }}>{label}</dt>
                <dd style={{ fontSize: 13, color: "#0f172a" }}>{val || "—"}</dd>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", fontSize: 12, fontWeight: 700, color: "#374151" }}>Dates</div>
            {[
              ["Due Date", item.due],
              ["Renewal Date", d(365)],
              ["Last Completed", d(-365)],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", gap: 16, padding: "9px 16px", borderBottom: "1px solid #f8fafc" }}>
                <dt style={{ width: 160, flexShrink: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8" }}>{label}</dt>
                <dd style={{ fontSize: 13, color: overd && label === "Due Date" ? "#dc2626" : "#0f172a", fontWeight: overd && label === "Due Date" ? 700 : 400 }}>{fmtDate(val)}</dd>
              </div>
            ))}
          </div>

          {item.reqDoc && (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", fontSize: 12, fontWeight: 700, color: "#374151" }}>Document</div>
              <div style={{ display: "flex", gap: 16, padding: "12px 16px", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8", width: 160 }}>Doc Status</span>
                <span style={{
                  background: item.docStatus === "uploaded" ? "#f0fdf4" : item.docStatus === "expired" ? "#fffbeb" : "#fef2f2",
                  color: item.docStatus === "uploaded" ? "#15803d" : item.docStatus === "expired" ? "#b45309" : "#b91c1c",
                  borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 600
                }}>
                  {item.docStatus === "uploaded" ? "On File" : item.docStatus === "expired" ? "Expired" : "Missing"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick actions sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Quick Actions</div>
            {[
              { label: "✓ Mark Complete", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
              { label: "↻ Set Renewal Date", color: "#374151", bg: "#f8fafc", border: "#e2e8f0" },
              { label: "+ Add Note", color: "#374151", bg: "#f8fafc", border: "#e2e8f0" },
              { label: "✎ Edit Item", color: "#374151", bg: "#f8fafc", border: "#e2e8f0" },
              { label: "⧉ Duplicate", color: "#374151", bg: "#f8fafc", border: "#e2e8f0" },
            ].map(a => (
              <button key={a.label} onClick={a.label.includes("Complete") ? () => setCompleted(true) : undefined} style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                padding: "9px 12px", marginBottom: 6, borderRadius: 8, border: `1px solid ${a.border}`,
                background: a.bg, color: a.color, fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left"
              }}>{a.label}</button>
            ))}
          </div>

          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>Compliance Note</div>
            <div style={{ fontSize: 11, color: "#78350f", lineHeight: 1.5 }}>
              Always verify current requirements directly with the issuing agency before filing or renewing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BUSINESSES VIEW ─────────────────────────────────────────────────────────

function BusinessesView({ setView, setSelectedItem }) {
  const bizMap = Object.fromEntries(BUSINESSES.map(b => [b.id, b]));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Businesses</div>
          <div style={{ fontSize: 13, color: "#64748b" }}>{BUSINESSES.length} businesses under management</div>
        </div>
        <button style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add Business</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {BUSINESSES.map(biz => {
          const items = ITEMS.filter(i => i.biz === biz.id);
          const overdue = items.filter(isOverdue).length;
          const due30 = items.filter(i => isDueSoon(i, 30)).length;
          const missDocs = items.filter(i => i.reqDoc && i.docStatus === "missing").length;
          return (
            <div key={biz.id} onClick={() => setView("compliance")} style={{
              background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 18, cursor: "pointer",
              transition: "box-shadow 0.15s"
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, background: "#eff6ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⊞</div>
                <span style={{ background: "#f1f5f9", color: "#475569", borderRadius: 999, padding: "3px 9px", fontSize: 11, fontWeight: 600 }}>{biz.type}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{biz.name}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 12 }}>📍 {biz.city}, {biz.state}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
                {[
                  { label: "Total", val: items.length, color: "#0f172a" },
                  { label: "Overdue", val: overdue, color: overdue > 0 ? "#dc2626" : "#0f172a" },
                  { label: "Due Soon", val: due30, color: due30 > 0 ? "#d97706" : "#0f172a" },
                  { label: "Docs", val: missDocs, color: missDocs > 0 ? "#ea580c" : "#0f172a" },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {(overdue > 0 || missDocs > 0) && (
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {overdue > 0 && <span style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>{overdue} overdue</span>}
                  {missDocs > 0 && <span style={{ background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>{missDocs} missing docs</span>}
                </div>
              )}
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #f1f5f9", fontSize: 12, color: "#2563eb", fontWeight: 600 }}>View compliance items →</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ADMIN VIEW ──────────────────────────────────────────────────────────────

function AdminView({ setSelectedItem, setView }) {
  const bizMap = Object.fromEntries(BUSINESSES.map(b => [b.id, b]));
  const overdue = ITEMS.filter(isOverdue);
  const due7 = ITEMS.filter(i => isDueSoon(i, 7));
  const waitingClient = ITEMS.filter(i => i.status === "Waiting on Client");
  const missingDocs = ITEMS.filter(i => i.reqDoc && i.docStatus === "missing");

  const Section = ({ title, icon, items, color, bg, border }) => (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", background: bg, borderBottom: `1px solid ${border}` }}>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{icon} {title} ({items.length})</span>
      </div>
      {items.length === 0 ? (
        <div style={{ padding: "20px 14px", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>None</div>
      ) : items.slice(0, 5).map(item => {
        const biz = bizMap[item.biz];
        return (
          <div key={item.id} style={{ padding: "9px 14px", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>{biz?.name} · {fmtDate(item.due)}</div>
            </div>
            <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
              {[["🔔 Remind", "#1d4ed8", "#eff6ff", "#bfdbfe"], ["📄 Request Doc", "#c2410c", "#fff7ed", "#fed7aa"]].map(([label, c, bg2, b2]) => (
                <button key={label} style={{ fontSize: 10, fontWeight: 600, color: c, background: bg2, border: `1px solid ${b2}`, borderRadius: 6, padding: "3px 8px", cursor: "pointer" }}>{label}</button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Concierge View</div>
        <div style={{ fontSize: 13, color: "#64748b" }}>Internal dashboard for compliance concierge team</div>
      </div>

      {/* Client summary table */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", fontSize: 12, fontWeight: 700, color: "#374151" }}>Client Overview</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid #f1f5f9" }}>
            {["Business", "Type", "Overdue", "Due 7d", "Missing Docs", "Critical"].map(h => (
              <th key={h} style={{ padding: "8px 14px", textAlign: h === "Business" || h === "Type" ? "left" : "center", fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#64748b" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {BUSINESSES.map(biz => {
              const items = ITEMS.filter(i => i.biz === biz.id);
              return (
                <tr key={biz.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{biz.name}</td>
                  <td style={{ padding: "10px 14px" }}><span style={{ background: "#f1f5f9", color: "#475569", borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{biz.type}</span></td>
                  {[
                    items.filter(isOverdue).length,
                    items.filter(i => isDueSoon(i, 7)).length,
                    items.filter(i => i.reqDoc && i.docStatus === "missing").length,
                    items.filter(i => i.priority === "Critical" && i.status !== "Completed").length,
                  ].map((val, idx) => (
                    <td key={idx} style={{ padding: "10px 14px", textAlign: "center", fontSize: 14, fontWeight: 800, color: val > 0 ? (idx === 0 ? "#dc2626" : idx === 1 ? "#d97706" : "#ea580c") : "#94a3b8" }}>{val}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Section title="Overdue" icon="⚠" items={overdue} color="#b91c1c" bg="#fef2f2" border="#fecaca" />
        <Section title="Due in 7 Days" icon="⏱" items={due7} color="#b45309" bg="#fffbeb" border="#fde68a" />
        <Section title="Waiting on Client" icon="💬" items={waitingClient} color="#c2410c" bg="#fff7ed" border="#fed7aa" />
        <Section title="Missing Documents" icon="📄" items={missingDocs} color="#c2410c" bg="#fff7ed" border="#fed7aa" />
      </div>
    </div>
  );
}

// ─── TEMPLATES VIEW ───────────────────────────────────────────────────────────

function TemplatesView() {
  const [expanded, setExpanded] = useState(null);
  const templates = [
    { id: "restaurant", name: "Restaurant", icon: "🍽️", items: 10, desc: "Licenses, health permits, insurance, taxes, and required postings." },
    { id: "winebar", name: "Wine Bar", icon: "🍷", items: 10, desc: "ABRA/liquor board renewals, liquor liability, music licensing." },
    { id: "wineimporter", name: "Wine Importer", icon: "📦", items: 8, desc: "TTB Basic Permit, COLA tracking, FDA registration, excise tax." },
    { id: "foodtruck", name: "Food Truck", icon: "🚚", items: 8, desc: "Mobile unit permit, commissary agreement, city vending permits." },
    { id: "salon", name: "Salon", icon: "✂️", items: 7, desc: "Cosmetology licenses, practitioner renewals, liability insurance." },
    { id: "contractor", name: "Contractor", icon: "🔨", items: 7, desc: "Contractor license, bond, workers comp, vehicle registration." },
    { id: "winedist", name: "Wine Distributor", icon: "🏭", items: 5, desc: "State distributor license, excise tax, reporting deadlines." },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Compliance Templates</div>
        <div style={{ fontSize: 13, color: "#64748b" }}>Pre-built checklists by business type. Apply to a business to create compliance items instantly.</div>
      </div>
      {templates.map(t => (
        <div key={t.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
          <div onClick={() => setExpanded(expanded === t.id ? null : t.id)} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", cursor: "pointer"
          }}>
            <span style={{ fontSize: 28 }}>{t.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{t.name}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{t.desc}</div>
            </div>
            <span style={{ background: "#f1f5f9", color: "#475569", borderRadius: 999, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>{t.items} items</span>
            <button style={{
              background: "#2563eb", color: "#fff", border: "none", borderRadius: 7, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer"
            }} onClick={e => { e.stopPropagation(); alert(`Template "${t.name}" would be applied to a selected business.`); }}>
              Apply to Business
            </button>
            <span style={{ color: "#94a3b8", fontSize: 14 }}>{expanded === t.id ? "▲" : "▼"}</span>
          </div>
          {expanded === t.id && (
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "10px 18px 14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.07em", marginBottom: 8 }}>Template Items</div>
              {Array.from({ length: t.items }).map((_, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid #f8fafc" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#64748b", flexShrink: 0 }}>{i+1}</div>
                  <div style={{ fontSize: 12, color: "#0f172a", fontWeight: 500 }}>
                    {[
                      "Business License Renewal", "Liquor/Specialty License Renewal", "Health Permit",
                      "Food Handler Cards", "General Liability Insurance", "Workers' Compensation",
                      "Fire Inspection", "Required Labor Postings", "Quarterly Tax Filing",
                      "Annual Corporate Report"
                    ][i] ?? `Compliance Item ${i+1}`}
                  </div>
                  <span style={{ marginLeft: "auto", background: "#fef2f2", color: "#b91c1c", borderRadius: 999, padding: "2px 7px", fontSize: 10, fontWeight: 600 }}>Annual</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── LANDING VIEW ─────────────────────────────────────────────────────────────

function LandingView({ setView }) {
  return (
    <div style={{ minHeight: "100%", background: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "#2563eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 14 }}>✦</span></div>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>BackStOPS <span style={{ color: "#94a3b8", fontWeight: 400 }}>Compliance</span></span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setView("dashboard")} style={{ background: "none", border: "1px solid #e2e8f0", color: "#374151", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Sign in</button>
          <button onClick={() => setView("dashboard")} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Start Free Trial →</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "60px 40px 50px", background: "#f8fafc" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 700, marginBottom: 20 }}>⚡ Built for regulated small businesses</div>
        <h1 style={{ fontSize: 42, fontWeight: 900, color: "#0f172a", lineHeight: 1.15, margin: "0 0 16px" }}>
          Compliance tracking for<br /><span style={{ color: "#2563eb" }}>small regulated businesses.</span>
        </h1>
        <p style={{ fontSize: 17, color: "#64748b", maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.6 }}>
          Track permits, renewals, insurance certs, licenses, tax deadlines, required filings, and documents in one simple dashboard.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => setView("dashboard")} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>✦ Start Compliance Dashboard</button>
          <button onClick={() => setView("dashboard")} style={{ background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: 10, padding: "13px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>View Demo →</button>
        </div>
        <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 14 }}>No credit card required · Cancel anytime</p>
      </div>

      {/* Pain points */}
      <div style={{ padding: "50px 40px" }}>
        <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>The cost of missed compliance is real.</h2>
        <p style={{ textAlign: "center", color: "#64748b", fontSize: 14, marginBottom: 32 }}>Every small business operator has a story about a surprise fine or lapsed permit.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            ["⚠", "Missed renewals = fines, shutdowns.", "One lapsed liquor license can shut down a wine bar for weeks. One expired contractor bond can void every job."],
            ["⏱", "Compliance is a second full-time job.", "Between state agencies, city permits, insurance renewals, and federal filings, spreadsheets and sticky notes aren't working."],
            ["📂", "Your documents are everywhere — or nowhere.", "Where's your Certificate of Insurance? Your health permit? Your current ABRA license? If you're not sure, you're exposed."],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: "40px 40px 60px", background: "#f8fafc" }}>
        <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Simple, transparent pricing.</h2>
        <p style={{ textAlign: "center", color: "#64748b", fontSize: 14, marginBottom: 32 }}>Choose the level of support that matches your operation.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 860, margin: "0 auto" }}>
          {[
            { name: "Basic Tracking", price: "$199", desc: "Dashboard, reminders, templates", features: ["Unlimited compliance items", "Overdue & renewal alerts", "Business templates", "Document tracking"], cta: "Get Started", hl: false },
            { name: "Managed Compliance", price: "$399", desc: "Everything in Basic + concierge", features: ["Monthly compliance review", "Document collection support", "Concierge follow-up", "Priority alerts"], cta: "Most Popular ★", hl: true },
            { name: "Premium Regulated Ops", price: "$799", desc: "Multi-location + priority support", features: ["Multi-location dashboard", "Priority concierge review", "Custom compliance calendar", "Dedicated account manager"], cta: "Contact Us", hl: false },
          ].map(p => (
            <div key={p.name} style={{ background: p.hl ? "#2563eb" : "#fff", border: p.hl ? "2px solid #1d4ed8" : "1px solid #e2e8f0", borderRadius: 14, padding: 22, transform: p.hl ? "scale(1.03)" : "none" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: p.hl ? "#fff" : "#0f172a", marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: p.hl ? "#bfdbfe" : "#64748b", marginBottom: 12 }}>{p.desc}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: p.hl ? "#fff" : "#0f172a", marginBottom: 16 }}>{p.price}<span style={{ fontSize: 13, fontWeight: 400, color: p.hl ? "#93c5fd" : "#94a3b8" }}>/mo</span></div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                {p.features.map(f => (
                  <li key={f} style={{ fontSize: 12, color: p.hl ? "#dbeafe" : "#475569", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: p.hl ? "#93c5fd" : "#22c55e" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => setView("dashboard")} style={{ width: "100%", background: p.hl ? "#fff" : "#0f172a", color: p.hl ? "#2563eb" : "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "20px 40px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: "#0f172a" }}>BackStOPS Compliance</span>
        <p style={{ fontSize: 10, color: "#94a3b8", maxWidth: 500, textAlign: "right" }}>
          <strong>Disclaimer:</strong> BackStOPS helps organize compliance tasks and reminders. It does not provide legal, tax, or regulatory advice. Always verify with the relevant agency or qualified professional.
        </p>
      </div>
    </div>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────

export default function BackStOPSApp() {
  const [view, setView] = useState("landing");
  const [selectedItem, setSelectedItem] = useState(null);

  if (view === "landing") {
    return (
      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: "100vh", background: "#fff" }}>
        <LandingView setView={setView} />
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: "flex", height: "100vh", overflow: "hidden", background: "#f8fafc"
    }}>
      <Sidebar view={view} setView={(v) => { setView(v); if (v !== "detail") setSelectedItem(null); }} />
      <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        {view === "dashboard" && <DashboardView setView={setView} setSelectedItem={setSelectedItem} />}
        {view === "businesses" && <BusinessesView setView={setView} setSelectedItem={setSelectedItem} />}
        {view === "compliance" && <ComplianceView setSelectedItem={setSelectedItem} setView={setView} />}
        {view === "detail" && selectedItem && <DetailView item={selectedItem} setView={setView} />}
        {view === "templates" && <TemplatesView />}
        {view === "admin" && <AdminView setSelectedItem={setSelectedItem} setView={setView} />}
        {(view === "calendar" || view === "documents" || view === "settings") && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12 }}>
            <div style={{ fontSize: 40 }}>{view === "calendar" ? "📅" : view === "documents" ? "📄" : "⚙️"}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", textTransform: "capitalize" }}>{view}</div>
            <p style={{ fontSize: 13, color: "#64748b" }}>This section is fully built in the codebase. Click Dashboard, Businesses, Compliance Items, Templates, or Concierge View to see working data.</p>
          </div>
        )}
      </main>
    </div>
  );
}
