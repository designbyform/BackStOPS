import { useState, useEffect } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  bg: "#F9F8F6",
  bgSecondary: "#F2F1EE",
  bgTertiary: "#ECEAE5",
  white: "#FFFFFF",
  border: "#E0DDD7",
  borderStrong: "#C5C1B9",
  ink: "#1A1916",
  inkSecondary: "#6B6860",
  inkTertiary: "#9C9A94",
  inkFaint: "#C5C1B9",
  accentMuted: "#3D3B35",
  highBg: "#F0FDF4",
  highText: "#2D6A4F",
  highBorder: "#BBF7D0",
  medBg: "#FFFBEB",
  medText: "#B45309",
  medBorder: "#FDE68A",
  lowBg: "#FEF2F2",
  lowText: "#C0392B",
  lowBorder: "#FECACA",
};

const F = { family: "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" };

// ─── Mock data (Meridian Health) ──────────────────────────────────────────────

function mf(value, confidence, source) {
  const lvl = confidence >= 75 ? "high" : confidence >= 45 ? "medium" : "low";
  return { value, confidence, confidenceLevel: lvl, source, needsReview: confidence < 60 };
}
function mlf(values, confidence, source) {
  const lvl = confidence >= 75 ? "high" : confidence >= 45 ? "medium" : "low";
  return { values, confidence, confidenceLevel: lvl, source, needsReview: confidence < 60 };
}
function mt(score, rationale, confidence) {
  const lvl = confidence >= 75 ? "high" : confidence >= 45 ? "medium" : "low";
  return { score, rationale, confidence, confidenceLevel: lvl };
}

const BRAND_BRAIN = {
  project: {
    companyName: "Meridian Health",
    websiteUrl: "https://meridianhealth.com",
    industry: "Healthcare Technology",
    stage: "Series A",
    primaryAudience: "VP of Clinical Operations and COOs at mid-to-large health systems",
  },
  strategicDNA: {
    mission: mf("Make clinical operations invisible so clinicians can focus entirely on patient care.", 88, "Brand Guide"),
    vision: mf("A world where the friction of healthcare administration is zero.", 72, "Pitch Deck"),
    purpose: mf("We exist to give time back to clinicians — the most valuable and scarce resource in healthcare.", 65, "Website"),
    category: mf("Clinical Operations Intelligence Platform", 81, "Brand Guide"),
    positioningStatement: mf("For health system operators who are drowning in administrative complexity, Meridian is the only platform that unifies scheduling, credentialing, and compliance into a single intelligent system — so your clinical team can spend less time managing and more time healing.", 78, "Brand Guide"),
    corePromise: mf("Operational clarity without compromise.", 82, "Brand Guide"),
    primaryAudience: mf("VP of Clinical Operations and COOs at mid-to-large health systems (250–2,000 beds)", 85, "Pitch Deck"),
    secondaryAudience: mf("CMOs and CNOs who sponsor technology decisions; department heads managing scheduling complexity", 58, "Inferred"),
    differentiators: mlf(["Unifies three historically siloed systems into one workflow", "Built by former clinical operators, not software engineers", "Configurable to existing EHR workflows — not a rip-and-replace", "Real-time compliance alerts tied to credentialing status", "Implementation in 60 days, not 18 months"], 79, "Pitch Deck"),
    proofPoints: mlf(["34% reduction in scheduling errors at Northbridge Medical Center", "Deployed in 12 health systems across 6 states", "SOC 2 Type II certified", "Average implementation: 58 days", "$2.1M in recovered clinical hours annually per 500-bed facility"], 84, "Website"),
    marketContext: mf("The clinical operations software market is dominated by legacy EHR vendors with bloated, disconnected toolsets. Health systems are exhausted by point solutions that don't talk to each other.", 71, "Pitch Deck"),
    brandTension: mf("Between clinical warmth and operational precision. The brand must resolve this tension by being warm in intent, rigorous in capability.", 55, "Inferred"),
  },
  personalityModel: {
    authority: mt(82, "Speaks with the confidence of clinical operators who have lived the problem. Backed by outcomes data, not just features.", 85),
    warmth: mt(64, "Understands the human stakes of healthcare. References patients and clinicians with genuine empathy, not performative care language.", 70),
    technicalDepth: mt(75, "Comfortable with systems architecture conversations but never leads with tech specs to non-technical buyers.", 78),
    innovation: mt(68, "Positions as modern and forward-looking without overusing 'AI-powered' or 'next-generation' language.", 65),
    playfulness: mt(18, "Almost none. The category demands gravitas. Occasional dry wit in informal contexts only.", 88),
    sophistication: mt(77, "Premium positioning, institutional credibility, restraint over flair.", 80),
    boldness: mt(61, "Confident, direct claims — but backed by evidence. Not aggressive or provocative.", 72),
    clarity: mt(90, "The defining verbal trait. Every sentence earns its place. No jargon without reason.", 92),
    restraint: mt(84, "Does not oversell. Does not use hyperbole. Trusts the facts to carry weight.", 87),
    emotionality: mt(42, "Present but controlled. Acknowledges the human cost of operational failure without becoming sentimental.", 68),
  },
  verbalSystem: {
    voicePrinciples: mlf(["Lead with outcomes, not features", "Name the problem precisely before offering the solution", "Respect the intelligence of the buyer — no hand-holding", "Use clinical language correctly; earn the room", "Let data carry emotional weight"], 82, "Brand Guide"),
    toneAttributes: mlf(["Precise", "Assured", "Empathetic", "Substantive", "Unhurried"], 75, "Brand Guide"),
    messagingHierarchy: mlf(["Primary: Clinical operations unified at last", "Secondary: Built by operators, for operators", "Tertiary: Compliance, scheduling, and credentialing in one place", "Supporting: Deployed in 60 days — not 18 months"], 77, "Brand Guide"),
    elevatorPitch: mf("Meridian replaces the three or four disconnected systems your clinical ops team patches together every day — scheduling, credentialing, and compliance — with a single platform that actually talks to your EHR. Health systems that switch recover an average of two million dollars in clinical hours per year.", 83, "Pitch Deck"),
    approvedVocabulary: mlf(["clinical operations", "health system", "administrative burden", "clinical hours", "credentialing", "compliance", "workflow", "operational clarity", "outcomes", "evidence"], 79, "Brand Guide"),
    bannedVocabulary: mlf(["AI-powered (standalone)", "next-generation", "revolutionary", "game-changer", "seamless", "robust", "leverage", "synergy", "patient-centric (as standalone claim)"], 91, "Brand Guide"),
    phrasesToAvoid: mlf(["\"We are passionate about...\"", "\"At Meridian, we believe...\"", "\"Our cutting-edge platform...\"", "\"Transforming healthcare\"", "\"Making healthcare better\""], 85, "Brand Guide"),
    onBrandCopy: mf("Scheduling errors cost health systems more than time. They cost trust. Meridian surfaces conflicts before they become incidents — and gives your clinical ops team a single view to resolve them.", 87, "Brand Guide"),
    offBrandCopy: mf("We're passionate about revolutionizing healthcare with our cutting-edge, AI-powered platform that seamlessly integrates with your existing systems!", 92, "Brand Guide"),
  },
  visualSystem: {
    colorLogic: mf("Primary: Deep navy (#0F1E3C) conveys institutional authority. Accent: Clinical green (#2D6A4F) for positive states. Background: Off-white (#F9F8F6). Never use consumer health palette — no teal gradients, no wellness pastels.", 76, "Brand Guide"),
    typographyLogic: mf("Headlines: Editorial Serif — conveys authority without stiffness. Body: Inter or system sans-serif. Generous leading, conservative weight — never bold everything.", 74, "Brand Guide"),
    photographyStyle: mf("Real clinical environments. Actual healthcare workers in context — not stock photography smiles. Low-saturation editorial treatment. Documentary over lifestyle.", 62, "Website"),
    layoutPrinciples: mf("Information-dense layouts with clear visual hierarchy. Generous whitespace around key data points. Tables and structured data preferred over infographics.", 68, "Inferred"),
    visualPatternsToAvoid: mlf(["Gradient hero backgrounds", "Rounded card stacks with drop shadows", "Wellness color palettes (teal, lavender, sage)", "Stock photography of smiling doctors", "Illustrated characters", "Animation-heavy landing pages"], 82, "Brand Guide"),
    visualReferences: mlf(["Bloomberg Terminal (information density)", "New York Times data journalism (editorial data viz)", "Linear (UI precision)", "McKinsey reports (institutional authority)"], 60, "Inferred"),
  },
  decisionRules: [
    { rule: "Prefer clarity over cleverness", why: "Clinical buyers are time-poor and skeptical. A clever turn of phrase that requires decoding signals we value our own voice over their understanding.", example: "Write \"Reduces scheduling errors by 34%\" not \"Operational harmony at scale.\"", confidence: 91 },
    { rule: "Prefer institutional trust over hype", why: "Health system buyers have been burned by vendor promises. Credibility is earned through restraint, not amplified claims.", example: "Lead with peer-reviewed outcomes data or named health system references, not category-level claims.", confidence: 88 },
    { rule: "Prefer precision over personality", why: "The category demands exactness. Approximate language signals imprecise thinking — which translates directly to product risk for buyers.", example: "Say \"58-day implementation average\" not \"fast implementation.\" Say \"12 health systems\" not \"many customers.\"", confidence: 85 },
    { rule: "Avoid overpromising", why: "Clinical environments have real consequences. Overclaiming damages credibility immediately with buyers who have seen implementations fail.", example: "Do not promise outcomes we cannot substantiate. Always qualify with conditions.", confidence: 90 },
    { rule: "Avoid category clichés", why: "Healthcare tech is saturated with \"patient-centered,\" \"seamless,\" and \"transforming care.\" These phrases are dismissed before they are processed.", example: "Replace \"transforming patient care\" with: \"Recovers 2.1M in clinical hours annually per facility.\"", confidence: 87 },
    { rule: "Respect the operator, not just the patient", why: "The primary buyer is a clinical operator. Content that speaks only to patient outcomes misses the actual decision-maker's needs.", example: "Frame outcomes in operational terms first: cost, time, compliance risk — then connect to patient impact.", confidence: 80 },
  ],
  competitiveContext: {
    directCompetitors: mlf(["Symplr", "Qgenda", "ShiftMed", "API Healthcare", "Intrigma"], 75, "Pitch Deck"),
    adjacentCompetitors: mlf(["Epic (scheduling modules)", "Workday Healthcare", "Salesforce Health Cloud"], 68, "Pitch Deck"),
    whiteSpaceOpportunities: mlf(["No competitor leads with recovered clinical hours as primary metric", "\"Built by operators\" positioning is unoccupied", "Editorial visual language is unused in category", "Implementation speed as brand pillar is underdeveloped"], 58, "Inferred"),
    similarityRisks: mlf(["Visually similar to Symplr — both use navy + clinical green", "Messaging overlap with Qgenda on \"scheduling simplified\"", "\"Unified platform\" claim shared by 4+ competitors"], 65, "Inferred"),
  },
  brandDiagnosis: [
    { id: "visual", title: "Visual Inconsistency", severity: "High", finding: "Visual language ranges from clinical precision to generic SaaS. The brand appears to have two different creative directions competing.", evidence: "Website header uses gradient background with stock photography. Product screenshots show a rigorous, data-dense interface. These do not belong to the same brand.", recommendation: "Align all marketing surfaces to the visual language of the product — dense, precise, editorial. Remove all consumer health visual codes." },
    { id: "generic", title: "Generic Language Risk", severity: "High", finding: "Multiple instances of banned vocabulary appear in live website copy: \"seamless,\" \"robust,\" \"next-generation,\" \"patient-centric.\"", evidence: "Homepage body copy: \"Our seamless integration with your existing EHR...\" and \"robust compliance tools.\" These phrases appear verbatim in competitor copy.", recommendation: "Conduct full copy audit against banned vocabulary list. Replace with specific, verifiable language. Every superlative must be replaced with a data point." },
    { id: "messaging", title: "Messaging Inconsistency", severity: "Medium", finding: "Core value proposition shifts between \"unified platform\" and \"time recovery\" depending on context. Neither message is consistently prioritized.", evidence: "Website homepage leads with \"unified platform.\" Pitch deck leads with \"recovered clinical hours.\" Sales one-pager uses \"operational clarity.\" Three different primary claims across three surfaces.", recommendation: "Establish a single primary claim and enforce it across all surfaces. Recommend: \"Clinical hours recovered\" as the measurable anchor." },
    { id: "audience", title: "Audience Clarity Issue", severity: "Medium", finding: "Content alternates between writing for clinical operators (COOs, VPs) and writing for clinicians themselves. These are different buyers with different motivations.", evidence: "Case studies address department heads but ROI framing targets finance. Feature descriptions are written for technical evaluators.", recommendation: "Define a primary content persona (VP Clinical Operations) and write every piece of content for that person first." },
    { id: "trust", title: "Trust Gap", severity: "Medium", finding: "Evidence and proof points exist but are buried. The brand does not lead with credibility — it requires buyers to find it.", evidence: "Outcomes data ($2.1M, 34% error reduction, 58 days) appears only in a downloadable case study. Homepage leads with features, not outcomes.", recommendation: "Surface the three strongest proof points on every primary surface." },
    { id: "diff", title: "Differentiation Gap", severity: "Medium", finding: "\"Built by operators\" is the strongest differentiator but is underdeployed. It appears once in the About page and nowhere in primary messaging.", evidence: "No competitor claims this positioning. Yet Meridian's own content buries it. The founding team's clinical operations backgrounds are mentioned only in team bios.", recommendation: "Elevate \"Built by operators\" to a core messaging pillar. Feature the team's operational credentials in primary marketing." },
    { id: "category", title: "Category Confusion", severity: "Low", finding: "Category name is accurate but may be unfamiliar to buyers who search for \"scheduling software\" or \"credentialing software.\"", evidence: "Category label used inconsistently across surfaces — sometimes \"clinical ops platform,\" sometimes \"healthcare operations software.\"", recommendation: "Standardize category language. Consider whether to own the new category or ride existing search categories while differentiating within them." },
  ],
};

// ─── UI primitives ────────────────────────────────────────────────────────────

const px = (n) => `${n}px`;

function Badge({ level, score }) {
  const map = {
    high: { bg: C.highBg, text: C.highText, border: C.highBorder, dot: "#2D6A4F" },
    medium: { bg: C.medBg, text: C.medText, border: C.medBorder, dot: "#B45309" },
    low: { bg: C.lowBg, text: C.lowText, border: C.lowBorder, dot: "#C0392B" },
  };
  const s = map[level];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 6px", borderRadius: 4, background: s.bg, color: s.text, border: `1px solid ${s.border}`, fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {score}%
    </span>
  );
}

function SourceBadge({ source }) {
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 6px", borderRadius: 4, background: C.bgSecondary, color: C.inkSecondary, border: `1px solid ${C.border}`, fontSize: 10, fontWeight: 500 }}>{source}</span>;
}

function SeverityBadge({ level }) {
  const map = { High: { bg: C.lowBg, text: C.lowText, border: C.lowBorder }, Medium: { bg: C.medBg, text: C.medText, border: C.medBorder }, Low: { bg: C.highBg, text: C.highText, border: C.highBorder } };
  const s = map[level];
  return <span style={{ padding: "2px 8px", borderRadius: 4, background: s.bg, color: s.text, border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 600 }}>{level}</span>;
}

function Btn({ children, onClick, variant = "primary", size = "md", disabled }) {
  const base = { display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 6, fontWeight: 500, fontFamily: F.family, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1, border: "none", transition: "background 0.15s", lineHeight: 1 };
  const sizes = { sm: { fontSize: 12, padding: "6px 12px" }, md: { fontSize: 13, padding: "8px 16px" }, lg: { fontSize: 14, padding: "11px 22px" } };
  const variants = {
    primary: { background: C.ink, color: C.white },
    secondary: { background: C.white, color: C.ink, border: `1px solid ${C.border}` },
    ghost: { background: "transparent", color: C.inkSecondary },
  };
  return <button style={{ ...base, ...sizes[size], ...variants[variant] }} onClick={onClick} disabled={disabled}>{children}</button>;
}

// ─── Layout ───────────────────────────────────────────────────────────────────

const STEPS = ["landing", "new-scan", "upload", "processing", "brand-brain", "diagnosis", "prompts", "exports"];
const STEP_LABELS = { "new-scan": "Project Setup", upload: "Asset Upload", processing: "Processing", "brand-brain": "Brand Brain", diagnosis: "Diagnosis", prompts: "Prompt Library", exports: "Exports" };

function Sidebar({ step, setStep, hasBrain }) {
  const idx = STEPS.indexOf(step);
  const navItems = [
    { id: "landing", label: "Home", group: "start" },
    { id: "new-scan", label: "Project Setup", group: "scan" },
    { id: "upload", label: "Asset Upload", group: "scan" },
    { id: "processing", label: "Processing", group: "scan" },
    { id: "brand-brain", label: "Brand Brain", group: "output" },
    { id: "diagnosis", label: "Diagnosis", group: "output" },
    { id: "prompts", label: "Prompt Library", group: "output" },
    { id: "exports", label: "Exports", group: "output" },
  ];
  function accessible(id) {
    const i = STEPS.indexOf(id);
    if (i <= 1) return true;
    if (id === "upload") return idx >= 1;
    if (id === "processing") return idx >= 2;
    if (i >= 4) return hasBrain;
    return false;
  }
  const groups = [
    { key: "start", label: null },
    { key: "scan", label: "SCAN" },
    { key: "output", label: "RESULTS" },
  ];
  return (
    <aside style={{ width: 200, flexShrink: 0, borderRight: `1px solid ${C.border}`, background: C.bg, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ padding: "18px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 24, height: 24, background: C.ink, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: C.white, fontSize: 11, fontWeight: 700 }}>M</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em" }}>Brand MRI</span>
      </div>
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {groups.map(({ key, label }) => (
          <div key={key} style={{ marginBottom: 12 }}>
            {label && <p style={{ fontSize: 9, fontWeight: 700, color: C.inkTertiary, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 8px", marginBottom: 4 }}>{label}</p>}
            {navItems.filter(n => n.group === key).map(item => {
              const active = step === item.id;
              const done = STEPS.indexOf(item.id) < idx;
              const ok = accessible(item.id);
              return (
                <button key={item.id} onClick={() => ok && setStep(item.id)} disabled={!ok}
                  style={{ width: "100%", textAlign: "left", padding: "6px 8px", borderRadius: 6, fontSize: 13, fontWeight: active ? 500 : 400, background: active ? C.ink : "transparent", color: active ? C.white : ok ? C.inkSecondary : C.inkFaint, border: "none", cursor: ok ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 8, fontFamily: F.family }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: done && !active ? "#2D6A4F" : "transparent", flexShrink: 0 }} />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 10, color: C.inkTertiary }}>Brand MRI MVP</p>
        <p style={{ fontSize: 10, color: C.inkFaint }}>by Form</p>
      </div>
    </aside>
  );
}

function Shell({ step, setStep, hasBrain, title, subtitle, actions, children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: F.family, background: C.bg }}>
      <Sidebar step={step} setStep={setStep} hasBrain={hasBrain} />
      <main style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "28px 40px 24px", borderBottom: `1px solid ${C.border}`, background: C.white, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em" }}>{title}</h1>
            {subtitle && <p style={{ margin: "4px 0 0", fontSize: 13, color: C.inkSecondary }}>{subtitle}</p>}
          </div>
          {actions && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{actions}</div>}
        </div>
        {children}
      </main>
    </div>
  );
}

// ─── Page: Landing ────────────────────────────────────────────────────────────

function Landing({ setStep }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: F.family }}>
      <header style={{ padding: "18px 40px", borderBottom: `1px solid ${C.border}`, background: C.white, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, background: C.ink, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: C.white, fontSize: 11, fontWeight: 700 }}>M</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em" }}>Brand MRI</span>
        </div>
        <Btn size="sm" variant="secondary" onClick={() => setStep("new-scan")}>Start a scan</Btn>
      </header>

      <section style={{ maxWidth: 700, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 99, border: `1px solid ${C.border}`, background: C.white, fontSize: 11, color: C.inkSecondary, marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2D6A4F" }} />
          Brand intelligence, not a chatbot
        </div>
        <h1 style={{ margin: "0 0 20px", fontSize: 52, fontWeight: 600, color: C.ink, letterSpacing: "-0.04em", lineHeight: 1.1 }}>Your brand,<br />diagnosed.</h1>
        <p style={{ margin: "0 0 36px", fontSize: 17, color: C.inkSecondary, lineHeight: 1.65, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          Brand MRI ingests your existing brand assets and converts them into a structured, editable Brand Brain — with confidence scores, gap analysis, and exports for every AI tool you use.
        </p>
        <Btn size="lg" onClick={() => setStep("new-scan")}>Run a Brand MRI scan</Btn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, marginTop: 64, textAlign: "left" }}>
          {[
            { n: "01", label: "Upload assets", desc: "Brand guide, pitch deck, website, copy examples" },
            { n: "02", label: "Extract Brand Brain", desc: "Structured extraction with confidence scores and gap flags" },
            { n: "03", label: "Edit and approve", desc: "Every field is editable. You are the source of truth." },
            { n: "04", label: "Export everywhere", desc: "Claude, Notion, PDF report, AI tool instruction packs" },
          ].map(s => (
            <div key={s.n}>
              <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: C.inkTertiary }}>{s.n}</p>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500, color: C.ink }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: 12, color: C.inkSecondary, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ borderTop: `1px solid ${C.border}`, background: C.white, padding: "48px 40px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ margin: "0 0 24px", fontSize: 10, fontWeight: 700, color: C.inkTertiary, letterSpacing: "0.1em", textTransform: "uppercase" }}>What Brand MRI produces</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
            {[
              { label: "Brand Brain", items: ["Strategic DNA", "Personality model", "Verbal system", "Visual system", "Decision rules", "Competitive context"] },
              { label: "Diagnosis", items: ["Messaging inconsistency", "Visual drift", "Audience clarity gaps", "Generic language risk", "Trust gaps", "Differentiation gaps"] },
              { label: "Exports", items: ["PDF intelligence report", "Claude Project instructions", "Notion Brand Brain", "AI tool instruction pack"] },
            ].map(col => (
              <div key={col.label}>
                <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: C.ink }}>{col.label}</p>
                {col.items.map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.inkFaint, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: C.inkSecondary }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Page: New Scan ────────────────────────────────────────────────────────────

function NewScan({ step, setStep, project, setProject, hasBrain }) {
  const [form, setForm] = useState(project);
  function f(k, v) { setForm(p => ({ ...p, [k]: v })); }
  function next() { setProject(form); setStep("upload"); }

  return (
    <Shell step={step} setStep={setStep} hasBrain={hasBrain} title="New Brand MRI Scan" subtitle="Tell us about the brand before we start scanning.">
      <div style={{ padding: "32px 40px", maxWidth: 560 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <Label>Company name</Label>
            <Field value={form.companyName} onChange={e => f("companyName", e.target.value)} placeholder="Meridian Health" />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <Label>Website URL</Label>
            <Field value={form.websiteUrl} onChange={e => f("websiteUrl", e.target.value)} placeholder="https://example.com" type="url" />
          </div>
          <div>
            <Label>Industry / Category</Label>
            <Field value={form.industry} onChange={e => f("industry", e.target.value)} placeholder="Healthcare Technology" />
          </div>
          <div>
            <Label>Company stage</Label>
            <select value={form.stage} onChange={e => f("stage", e.target.value)} style={{ width: "100%", padding: "8px 12px", fontSize: 13, border: `1px solid ${C.border}`, borderRadius: 6, background: C.white, color: C.ink, fontFamily: F.family }}>
              {["Pre-seed","Seed","Series A","Series B","Growth","Enterprise","Other"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Label>Primary audience</Label>
          <Field value={form.primaryAudience} onChange={e => f("primaryAudience", e.target.value)} placeholder="VP of Clinical Operations at mid-to-large health systems" />
          <p style={{ margin: "4px 0 0", fontSize: 11, color: C.inkTertiary }}>Who is the primary buyer or user this brand speaks to?</p>
        </div>
        <div style={{ marginBottom: 28 }}>
          <Label>Notes (optional)</Label>
          <textarea value={form.notes || ""} onChange={e => f("notes", e.target.value)} placeholder="Preparing for Series B, recent rebrand concerns..." rows={3}
            style={{ width: "100%", padding: "8px 12px", fontSize: 13, border: `1px solid ${C.border}`, borderRadius: 6, background: C.white, color: C.ink, fontFamily: F.family, resize: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={next} disabled={!form.companyName.trim()}>Continue to Asset Upload</Btn>
          <Btn variant="ghost" onClick={() => setStep("landing")}>Back</Btn>
        </div>

        <div style={{ marginTop: 36, paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
          <p style={{ margin: "0 0 10px", fontSize: 11, color: C.inkTertiary }}>Or load sample data to preview the full experience:</p>
          <Btn variant="secondary" size="sm" onClick={() => {
            const demo = { companyName: "Meridian Health", websiteUrl: "https://meridianhealth.com", industry: "Healthcare Technology", stage: "Series A", primaryAudience: "VP of Clinical Operations at mid-to-large health systems", notes: "Preparing for Series B fundraise." };
            setProject(demo); setStep("upload");
          }}>Load Meridian Health sample</Btn>
        </div>
      </div>
    </Shell>
  );
}

function Label({ children }) {
  return <p style={{ margin: "0 0 5px", fontSize: 11, fontWeight: 600, color: C.inkSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{children}</p>;
}
function Field({ ...props }) {
  return <input {...props} style={{ width: "100%", padding: "8px 12px", fontSize: 13, border: `1px solid ${C.border}`, borderRadius: 6, background: C.white, color: C.ink, fontFamily: F.family, boxSizing: "border-box", outline: "none" }} />;
}

// ─── Page: Upload ─────────────────────────────────────────────────────────────

function Upload({ step, setStep, hasBrain, onStart }) {
  const [social, setSocial] = useState("");
  const [messaging, setMessaging] = useState("");
  return (
    <Shell step={step} setStep={setStep} hasBrain={hasBrain} title="Asset Upload" subtitle="Add everything you have. The more context, the higher the confidence scores.">
      <div style={{ padding: "32px 40px", maxWidth: 680 }}>
        <Section title="Documents">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <DropZone label="Brand Guide PDF" desc="Brand guidelines, style guide, identity manual" />
            <DropZone label="Pitch Deck PDF" desc="Investor deck, sales deck, company overview" />
          </div>
        </Section>
        <Section title="Copy & Examples">
          <div style={{ marginBottom: 14 }}>
            <Label>Social copy examples</Label>
            <textarea value={social} onChange={e => setSocial(e.target.value)} rows={4} placeholder="Paste 3–5 LinkedIn posts or social captions that represent the brand voice at its best..." style={{ width: "100%", padding: "8px 12px", fontSize: 13, border: `1px solid ${C.border}`, borderRadius: 6, background: C.white, color: C.ink, fontFamily: F.family, resize: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <Label>Messaging examples</Label>
            <textarea value={messaging} onChange={e => setMessaging(e.target.value)} rows={4} placeholder="Paste website copy, email campaigns, sales collateral..." style={{ width: "100%", padding: "8px 12px", fontSize: 13, border: `1px solid ${C.border}`, borderRadius: 6, background: C.white, color: C.ink, fontFamily: F.family, resize: "none", boxSizing: "border-box" }} />
          </div>
        </Section>

        <div style={{ padding: 14, background: C.bgSecondary, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 24, display: "flex", gap: 10 }}>
          <div style={{ width: 18, height: 18, background: C.bgTertiary, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: C.inkSecondary }}>i</span>
          </div>
          <div>
            <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 500, color: C.inkSecondary }}>MVP mode — mock extraction active</p>
            <p style={{ margin: 0, fontSize: 11, color: C.inkTertiary, lineHeight: 1.5 }}>Uploaded assets are noted but not parsed by AI. The Brand Brain is populated with structured sample data for Meridian Health. To connect real extraction, replace <code style={{ fontFamily: "monospace", color: C.ink }}>generateBrandBrain()</code> in <code style={{ fontFamily: "monospace", color: C.ink }}>src/lib/generators.ts</code>.</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={onStart}>Run Brand MRI Scan</Btn>
          <Btn variant="ghost" onClick={() => setStep("new-scan")}>Back</Btn>
        </div>
      </div>
    </Shell>
  );
}

function Section({ title, children }) {
  return <div style={{ marginBottom: 28 }}><p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 700, color: C.inkTertiary, letterSpacing: "0.1em", textTransform: "uppercase" }}>{title}</p>{children}</div>;
}

function DropZone({ label, desc }) {
  const [file, setFile] = useState(null);
  return (
    <label style={{ display: "block", border: `2px dashed ${C.border}`, borderRadius: 8, padding: 20, cursor: "pointer" }}>
      <input type="file" accept=".pdf" style={{ display: "none" }} onChange={e => setFile(e.target.files?.[0] || null)} />
      {file ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: C.ink, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: C.white, fontSize: 9, fontWeight: 700 }}>PDF</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: C.ink }}>{file.name}</p>
            <p style={{ margin: 0, fontSize: 11, color: C.inkTertiary }}>{(file.size / 1024).toFixed(0)} KB</p>
          </div>
        </div>
      ) : (
        <>
          <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500, color: C.ink }}>{label}</p>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: C.inkTertiary }}>{desc}</p>
          <p style={{ margin: 0, fontSize: 11, color: C.inkFaint }}>Click to upload</p>
        </>
      )}
    </label>
  );
}

// ─── Page: Processing ─────────────────────────────────────────────────────────

const SCAN_STEPS = [
  { id: "dna", label: "Extracting brand DNA", ms: 1400 },
  { id: "verbal", label: "Identifying verbal patterns", ms: 1200 },
  { id: "visual", label: "Mapping visual language", ms: 1300 },
  { id: "rules", label: "Finding decision rules", ms: 1100 },
  { id: "brain", label: "Generating Brand Brain", ms: 1500 },
  { id: "prompts", label: "Calibrating prompt library", ms: 900 },
];

function Processing({ setStep }) {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let total = 0;
    const timers = [];
    SCAN_STEPS.forEach((s, i) => {
      timers.push(setTimeout(() => setCurrent(i), total));
      total += s.ms;
    });
    timers.push(setTimeout(() => { setCurrent(SCAN_STEPS.length); setDone(true); }, total + 500));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (done) { const t = setTimeout(() => setStep("brand-brain"), 1200); return () => clearTimeout(t); }
  }, [done, setStep]);

  const pct = done ? 100 : Math.round((current / SCAN_STEPS.length) * 100);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.family }}>
      <div style={{ width: 360, padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48 }}>
          <div style={{ width: 24, height: 24, background: C.ink, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: C.white, fontSize: 11, fontWeight: 700 }}>M</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Brand MRI</span>
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 600, color: C.ink }}>{done ? "Scan complete." : "Scanning brand assets..."}</h2>
        <p style={{ margin: "0 0 28px", fontSize: 13, color: C.inkSecondary }}>{done ? "Your Brand Brain is ready for review." : "Extracting structure, patterns, and identity signals."}</p>

        <div style={{ marginBottom: 28 }}>
          <div style={{ height: 2, background: C.border, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", background: C.ink, borderRadius: 99, width: `${pct}%`, transition: "width 0.5s ease-out" }} />
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 11, color: C.inkTertiary }}>{pct}%</p>
        </div>

        <div>
          {SCAN_STEPS.map((s, i) => {
            const isActive = i === current && !done;
            const isDone = i < current || done;
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0" }}>
                <div style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {isDone ? (
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: C.white, fontSize: 8, fontWeight: 700 }}>✓</span>
                    </div>
                  ) : isActive ? (
                    <div style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${C.ink}`, animation: "pulse 1s infinite" }} />
                  ) : (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.border }} />
                  )}
                </div>
                <span style={{ fontSize: 13, color: isDone ? C.ink : isActive ? C.ink : C.inkFaint, fontWeight: isActive ? 500 : 400 }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}

// ─── Brand Brain: Editable field components ───────────────────────────────────

function EField({ label, field, onSave, multiline, rows = 3 }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(field.value);
  const border = field.needsReview ? C.medBorder : C.border;
  const bg = field.needsReview ? "#FFFBEB" : C.white;

  return (
    <div style={{ border: `1px solid ${editing ? C.ink : border}`, borderRadius: 8, background: bg, overflow: "hidden", boxShadow: editing ? `0 0 0 1px ${C.ink}` : "none" }}>
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: C.inkSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
          {field.needsReview && <span style={{ padding: "1px 6px", borderRadius: 4, background: C.medBg, color: C.medText, border: `1px solid ${C.medBorder}`, fontSize: 9, fontWeight: 600, textTransform: "uppercase" }}>Review</span>}
          <SourceBadge source={field.source} />
          <Badge level={field.confidenceLevel} score={field.confidence} />
        </div>
      </div>
      <div style={{ padding: "10px 14px" }}>
        {editing ? (
          <div>
            {multiline
              ? <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={rows} autoFocus style={{ width: "100%", fontSize: 13, color: C.ink, background: "transparent", border: "none", outline: "none", resize: "none", fontFamily: F.family, lineHeight: 1.6, boxSizing: "border-box" }} />
              : <input value={draft} onChange={e => setDraft(e.target.value)} autoFocus style={{ width: "100%", fontSize: 13, color: C.ink, background: "transparent", border: "none", outline: "none", fontFamily: F.family, boxSizing: "border-box" }} />
            }
            <div style={{ display: "flex", gap: 8, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
              <button onClick={() => { onSave(draft); setEditing(false); }} style={{ fontSize: 11, fontWeight: 600, color: C.white, background: C.ink, border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontFamily: F.family }}>Save</button>
              <button onClick={() => { setDraft(field.value); setEditing(false); }} style={{ fontSize: 11, color: C.inkSecondary, background: "transparent", border: "none", cursor: "pointer", fontFamily: F.family }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
            <p style={{ margin: 0, fontSize: 13, color: C.ink, lineHeight: 1.6, fontFamily: F.family }}>{field.value || <span style={{ color: C.inkTertiary, fontStyle: "italic" }}>No value — click to add</span>}</p>
            <p style={{ margin: "4px 0 0", fontSize: 10, color: C.inkFaint, fontFamily: F.family }}>Click to edit</p>
          </button>
        )}
      </div>
    </div>
  );
}

function EListField({ label, field, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(field.values.join("\n"));
  const border = field.needsReview ? C.medBorder : C.border;
  const bg = field.needsReview ? "#FFFBEB" : C.white;
  return (
    <div style={{ border: `1px solid ${editing ? C.ink : border}`, borderRadius: 8, background: bg, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: C.inkSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
        <div style={{ display: "flex", gap: 5 }}>
          {field.needsReview && <span style={{ padding: "1px 6px", borderRadius: 4, background: C.medBg, color: C.medText, border: `1px solid ${C.medBorder}`, fontSize: 9, fontWeight: 600, textTransform: "uppercase" }}>Review</span>}
          <SourceBadge source={field.source} />
          <Badge level={field.confidenceLevel} score={field.confidence} />
        </div>
      </div>
      <div style={{ padding: "10px 14px" }}>
        {editing ? (
          <div>
            <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={Math.max(field.values.length + 1, 3)} autoFocus placeholder="One item per line"
              style={{ width: "100%", fontSize: 12, color: C.ink, background: "transparent", border: "none", outline: "none", resize: "none", fontFamily: "monospace", lineHeight: 1.7, boxSizing: "border-box" }} />
            <p style={{ margin: "4px 0 8px", fontSize: 10, color: C.inkTertiary }}>One item per line</p>
            <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
              <button onClick={() => { onSave(draft.split("\n").map(v => v.trim()).filter(Boolean)); setEditing(false); }} style={{ fontSize: 11, fontWeight: 600, color: C.white, background: C.ink, border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontFamily: F.family }}>Save</button>
              <button onClick={() => { setDraft(field.values.join("\n")); setEditing(false); }} style={{ fontSize: 11, color: C.inkSecondary, background: "transparent", border: "none", cursor: "pointer", fontFamily: F.family }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
            {field.values.length > 0
              ? field.values.map((v, i) => <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}><span style={{ marginTop: 6, width: 4, height: 4, borderRadius: "50%", background: C.inkFaint, flexShrink: 0 }} /><span style={{ fontSize: 13, color: C.ink, fontFamily: F.family, lineHeight: 1.5 }}>{v}</span></div>)
              : <span style={{ fontSize: 13, color: C.inkTertiary, fontStyle: "italic", fontFamily: F.family }}>No items — click to add</span>
            }
            <p style={{ margin: "6px 0 0", fontSize: 10, color: C.inkFaint, fontFamily: F.family }}>Click to edit</p>
          </button>
        )}
      </div>
    </div>
  );
}

function TraitBar({ label, trait, onSave }) {
  const [editing, setEditing] = useState(false);
  const [score, setScore] = useState(trait.score);
  const [rat, setRat] = useState(trait.rationale);
  const filled = Math.round(trait.score / 10);
  return (
    <div style={{ border: `1px solid ${editing ? C.ink : C.border}`, borderRadius: 8, background: C.white, padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Badge level={trait.confidenceLevel} score={trait.confidence} />
          <span style={{ fontSize: 14, fontWeight: 600, color: C.ink, minWidth: 28, textAlign: "right" }}>{editing ? score : trait.score}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 6, borderRadius: 2, background: i < filled ? C.ink : C.bgTertiary }} />
        ))}
      </div>
      {editing ? (
        <div>
          <input type="range" min={0} max={100} value={score} onChange={e => setScore(Number(e.target.value))} style={{ width: "100%", marginBottom: 8, accentColor: C.ink }} />
          <textarea value={rat} onChange={e => setRat(e.target.value)} rows={2} style={{ width: "100%", fontSize: 11, border: `1px solid ${C.border}`, borderRadius: 4, padding: "6px 8px", fontFamily: F.family, resize: "none", color: C.inkSecondary, boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => { onSave(score, rat); setEditing(false); }} style={{ fontSize: 11, fontWeight: 600, color: C.white, background: C.ink, border: "none", borderRadius: 4, padding: "3px 10px", cursor: "pointer", fontFamily: F.family }}>Save</button>
            <button onClick={() => { setScore(trait.score); setRat(trait.rationale); setEditing(false); }} style={{ fontSize: 11, color: C.inkSecondary, background: "transparent", border: "none", cursor: "pointer", fontFamily: F.family }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} style={{ background: "transparent", border: "none", cursor: "pointer", textAlign: "left", padding: 0, width: "100%" }}>
          <p style={{ margin: 0, fontSize: 11, color: C.inkSecondary, lineHeight: 1.5, fontFamily: F.family }}>{trait.rationale}</p>
        </button>
      )}
    </div>
  );
}

// ─── Page: Brand Brain ────────────────────────────────────────────────────────

const BB_SECTIONS = [
  { id: "dna", label: "Strategic DNA" },
  { id: "personality", label: "Personality" },
  { id: "verbal", label: "Verbal System" },
  { id: "visual", label: "Visual System" },
  { id: "rules", label: "Decision Rules" },
  { id: "competitive", label: "Competitive" },
];

function BrandBrainPage({ step, setStep, hasBrain, brain, setBrain }) {
  const [section, setSection] = useState("dna");

  function updateField(section, key, value) {
    setBrain(b => ({ ...b, [section]: { ...b[section], [key]: { ...b[section][key], value } } }));
  }
  function updateListField(section, key, values) {
    setBrain(b => ({ ...b, [section]: { ...b[section], [key]: { ...b[section][key], values } } }));
  }
  function updateTrait(key, score, rationale) {
    setBrain(b => ({ ...b, personalityModel: { ...b.personalityModel, [key]: { ...b.personalityModel[key], score, rationale } } }));
  }
  function updateRule(i, updated) {
    const rules = [...brain.decisionRules];
    rules[i] = updated;
    setBrain(b => ({ ...b, decisionRules: rules }));
  }

  const reviewCount = [
    ...Object.values(brain.strategicDNA),
    ...Object.values(brain.verbalSystem),
    ...Object.values(brain.visualSystem),
  ].filter(f => f.needsReview).length;

  return (
    <Shell step={step} setStep={setStep} hasBrain={hasBrain}
      title="Brand Brain"
      subtitle={`${brain.project.companyName} — editable`}
      actions={
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {reviewCount > 0 && <span style={{ fontSize: 11, color: C.medText, background: C.medBg, border: `1px solid ${C.medBorder}`, padding: "4px 8px", borderRadius: 4 }}>{reviewCount} fields need review</span>}
          <Btn size="sm" onClick={() => setStep("diagnosis")}>Approve & Continue</Btn>
        </div>
      }
    >
      <div style={{ display: "flex", minHeight: 0 }}>
        {/* Section tabs */}
        <div style={{ width: 160, flexShrink: 0, borderRight: `1px solid ${C.border}`, background: C.bg, paddingTop: 14 }}>
          {BB_SECTIONS.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              style={{ width: "100%", textAlign: "left", padding: "8px 16px", fontSize: 13, fontWeight: section === s.id ? 500 : 400, background: section === s.id ? C.white : "transparent", color: section === s.id ? C.ink : C.inkSecondary, border: "none", borderRight: section === s.id ? `2px solid ${C.ink}` : "2px solid transparent", cursor: "pointer", fontFamily: F.family }}>
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "32px 40px" }}>
          <div style={{ maxWidth: 720 }}>
            {section === "dna" && (
              <div>
                <SectionHead title="Strategic DNA" desc="The foundational strategic logic of the brand." />
                <FieldGrid>
                  <EField label="Mission" field={brain.strategicDNA.mission} onSave={v => updateField("strategicDNA", "mission", v)} multiline />
                  <EField label="Vision" field={brain.strategicDNA.vision} onSave={v => updateField("strategicDNA", "vision", v)} multiline />
                  <EField label="Purpose" field={brain.strategicDNA.purpose} onSave={v => updateField("strategicDNA", "purpose", v)} multiline />
                  <EField label="Category" field={brain.strategicDNA.category} onSave={v => updateField("strategicDNA", "category", v)} />
                  <EField label="Positioning Statement" field={brain.strategicDNA.positioningStatement} onSave={v => updateField("strategicDNA", "positioningStatement", v)} multiline rows={4} />
                  <EField label="Core Promise" field={brain.strategicDNA.corePromise} onSave={v => updateField("strategicDNA", "corePromise", v)} />
                  <EField label="Primary Audience" field={brain.strategicDNA.primaryAudience} onSave={v => updateField("strategicDNA", "primaryAudience", v)} multiline />
                  <EField label="Secondary Audience" field={brain.strategicDNA.secondaryAudience} onSave={v => updateField("strategicDNA", "secondaryAudience", v)} multiline />
                  <EListField label="Differentiators" field={brain.strategicDNA.differentiators} onSave={v => updateListField("strategicDNA", "differentiators", v)} />
                  <EListField label="Proof Points" field={brain.strategicDNA.proofPoints} onSave={v => updateListField("strategicDNA", "proofPoints", v)} />
                  <EField label="Market Context" field={brain.strategicDNA.marketContext} onSave={v => updateField("strategicDNA", "marketContext", v)} multiline rows={4} />
                  <EField label="Brand Tension" field={brain.strategicDNA.brandTension} onSave={v => updateField("strategicDNA", "brandTension", v)} multiline />
                </FieldGrid>
              </div>
            )}

            {section === "personality" && (
              <div>
                <SectionHead title="Personality Model" desc="Brand traits on a 0–100 scale. Each score has a rationale and confidence level." />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
                  {Object.entries(brain.personalityModel).map(([key, trait]) => (
                    <TraitBar key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} trait={trait} onSave={(s, r) => updateTrait(key, s, r)} />
                  ))}
                </div>
              </div>
            )}

            {section === "verbal" && (
              <div>
                <SectionHead title="Verbal System" desc="How the brand speaks — voice, vocabulary, messaging structure." />
                <FieldGrid>
                  <EListField label="Voice Principles" field={brain.verbalSystem.voicePrinciples} onSave={v => updateListField("verbalSystem", "voicePrinciples", v)} />
                  <EListField label="Tone Attributes" field={brain.verbalSystem.toneAttributes} onSave={v => updateListField("verbalSystem", "toneAttributes", v)} />
                  <EListField label="Messaging Hierarchy" field={brain.verbalSystem.messagingHierarchy} onSave={v => updateListField("verbalSystem", "messagingHierarchy", v)} />
                  <EField label="Elevator Pitch" field={brain.verbalSystem.elevatorPitch} onSave={v => updateField("verbalSystem", "elevatorPitch", v)} multiline rows={4} />
                  <EListField label="Approved Vocabulary" field={brain.verbalSystem.approvedVocabulary} onSave={v => updateListField("verbalSystem", "approvedVocabulary", v)} />
                  <EListField label="Banned Vocabulary" field={brain.verbalSystem.bannedVocabulary} onSave={v => updateListField("verbalSystem", "bannedVocabulary", v)} />
                  <EListField label="Phrases to Avoid" field={brain.verbalSystem.phrasesToAvoid} onSave={v => updateListField("verbalSystem", "phrasesToAvoid", v)} />
                  <EField label="On-Brand Copy Example" field={brain.verbalSystem.onBrandCopy} onSave={v => updateField("verbalSystem", "onBrandCopy", v)} multiline rows={4} />
                  <EField label="Off-Brand Copy Example" field={brain.verbalSystem.offBrandCopy} onSave={v => updateField("verbalSystem", "offBrandCopy", v)} multiline rows={4} />
                </FieldGrid>
              </div>
            )}

            {section === "visual" && (
              <div>
                <SectionHead title="Visual System" desc="The visual language of the brand — color, type, imagery, motion." />
                <FieldGrid>
                  <EField label="Color Logic" field={brain.visualSystem.colorLogic} onSave={v => updateField("visualSystem", "colorLogic", v)} multiline rows={4} />
                  <EField label="Typography Logic" field={brain.visualSystem.typographyLogic} onSave={v => updateField("visualSystem", "typographyLogic", v)} multiline rows={3} />
                  <EField label="Photography Style" field={brain.visualSystem.photographyStyle} onSave={v => updateField("visualSystem", "photographyStyle", v)} multiline rows={3} />
                  <EField label="Layout Principles" field={brain.visualSystem.layoutPrinciples} onSave={v => updateField("visualSystem", "layoutPrinciples", v)} multiline rows={3} />
                  <EListField label="Visual References" field={brain.visualSystem.visualReferences} onSave={v => updateListField("visualSystem", "visualReferences", v)} />
                  <EListField label="Visual Patterns to Avoid" field={brain.visualSystem.visualPatternsToAvoid} onSave={v => updateListField("visualSystem", "visualPatternsToAvoid", v)} />
                </FieldGrid>
              </div>
            )}

            {section === "rules" && (
              <div>
                <SectionHead title="Decision Rules" desc="The operating principles that govern every brand decision." />
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                  {brain.decisionRules.map((rule, i) => (
                    <RuleCard key={rule.rule} rule={rule} index={i} onSave={updated => updateRule(i, updated)} />
                  ))}
                </div>
              </div>
            )}

            {section === "competitive" && (
              <div>
                <SectionHead title="Competitive Context" desc="The competitive landscape and differentiation opportunities." />
                <FieldGrid>
                  <EListField label="Direct Competitors" field={brain.competitiveContext.directCompetitors} onSave={v => updateListField("competitiveContext", "directCompetitors", v)} />
                  <EListField label="Adjacent Competitors" field={brain.competitiveContext.adjacentCompetitors} onSave={v => updateListField("competitiveContext", "adjacentCompetitors", v)} />
                  <EListField label="White Space Opportunities" field={brain.competitiveContext.whiteSpaceOpportunities} onSave={v => updateListField("competitiveContext", "whiteSpaceOpportunities", v)} />
                  <EListField label="Similarity Risks" field={brain.competitiveContext.similarityRisks} onSave={v => updateListField("competitiveContext", "similarityRisks", v)} />
                </FieldGrid>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function SectionHead({ title, desc }) {
  return <div style={{ marginBottom: 20 }}><h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: C.ink }}>{title}</h2><p style={{ margin: 0, fontSize: 13, color: C.inkSecondary }}>{desc}</p></div>;
}
function FieldGrid({ children }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>;
}

function RuleCard({ rule, index, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...rule });
  const conf = rule.confidence >= 75 ? "high" : rule.confidence >= 45 ? "medium" : "low";
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", background: C.bg, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.inkTertiary }}>{String(index + 1).padStart(2, "0")}</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{rule.rule}</span>
        </div>
        <Badge level={conf} score={rule.confidence} />
      </div>
      {editing ? (
        <div style={{ padding: 14 }}>
          {[["Rule", "rule"], ["Why it matters", "why"], ["Example application", "example"]].map(([lbl, key]) => (
            <div key={key} style={{ marginBottom: 10 }}>
              <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 600, color: C.inkTertiary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{lbl}</p>
              <textarea value={draft[key]} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} rows={2}
                style={{ width: "100%", fontSize: 12, border: `1px solid ${C.border}`, borderRadius: 4, padding: "6px 8px", fontFamily: F.family, resize: "none", boxSizing: "border-box", color: C.ink }} />
            </div>
          ))}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { onSave(draft); setEditing(false); }} style={{ fontSize: 11, fontWeight: 600, color: C.white, background: C.ink, border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontFamily: F.family }}>Save</button>
            <button onClick={() => { setDraft({ ...rule }); setEditing(false); }} style={{ fontSize: 11, color: C.inkSecondary, background: "transparent", border: "none", cursor: "pointer", fontFamily: F.family }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} style={{ width: "100%", textAlign: "left", padding: 14, background: "transparent", border: "none", cursor: "pointer" }}>
          <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 600, color: C.inkTertiary, textTransform: "uppercase", letterSpacing: "0.06em" }}>Why it matters</p>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: C.inkSecondary, lineHeight: 1.5, fontFamily: F.family }}>{rule.why}</p>
          <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 600, color: C.inkTertiary, textTransform: "uppercase", letterSpacing: "0.06em" }}>Example</p>
          <p style={{ margin: 0, fontSize: 12, color: C.inkSecondary, lineHeight: 1.5, fontStyle: "italic", fontFamily: F.family }}>{rule.example}</p>
        </button>
      )}
    </div>
  );
}

// ─── Page: Diagnosis ──────────────────────────────────────────────────────────

function DiagnosisPage({ step, setStep, hasBrain, brain }) {
  const high = brain.brandDiagnosis.filter(c => c.severity === "High");
  const sorted = [...brain.brandDiagnosis].sort((a, b) => ({ High: 0, Medium: 1, Low: 2 }[a.severity] - { High: 0, Medium: 1, Low: 2 }[b.severity]));

  return (
    <Shell step={step} setStep={setStep} hasBrain={hasBrain}
      title="Brand Diagnosis"
      subtitle={`${brain.project.companyName} — ${brain.brandDiagnosis.length} findings`}
      actions={<Btn size="sm" onClick={() => setStep("prompts")}>Continue to Prompts</Btn>}
    >
      <div style={{ padding: "32px 40px", maxWidth: 960 }}>
        {/* Summary */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, padding: 16, background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 24 }}>
          {[
            { count: brain.brandDiagnosis.filter(c => c.severity === "High").length, label: "High severity", color: C.lowText },
            { count: brain.brandDiagnosis.filter(c => c.severity === "Medium").length, label: "Medium severity", color: C.medText },
            { count: brain.brandDiagnosis.filter(c => c.severity === "Low").length, label: "Low severity", color: C.highText },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {i > 0 && <div style={{ width: 1, height: 32, background: C.border }} />}
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 600, color: item.color, fontVariantNumeric: "tabular-nums" }}>{item.count}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: C.inkSecondary }}>{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {sorted.map(card => {
            const sev = { High: { bg: "#FEF2F2", border: C.lowBorder, hbg: "#FEF2F2" }, Medium: { bg: "#FFFBEB", border: C.medBorder, hbg: "#FFFBEB" }, Low: { bg: "#F0FDF4", border: C.highBorder, hbg: "#F0FDF4" } }[card.severity];
            return (
              <div key={card.id} style={{ border: `1px solid ${sev.border}`, borderRadius: 8, overflow: "hidden" }}>
                <div style={{ padding: "10px 18px", background: sev.hbg, borderBottom: `1px solid ${sev.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{card.title}</span>
                  <SeverityBadge level={card.severity} />
                </div>
                <div style={{ background: C.white, padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, borderLeft: "none", borderRight: "none" }}>
                  {[["Finding", card.finding], ["Evidence", card.evidence], ["Recommendation", card.recommendation]].map(([lbl, text], i) => (
                    <div key={lbl} style={{ borderLeft: i > 0 ? `1px solid ${C.border}` : "none", paddingLeft: i > 0 ? 16 : 0 }}>
                      <p style={{ margin: "0 0 6px", fontSize: 9, fontWeight: 700, color: C.inkTertiary, textTransform: "uppercase", letterSpacing: "0.1em" }}>{lbl}</p>
                      <p style={{ margin: 0, fontSize: 12, color: C.inkSecondary, lineHeight: 1.55 }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Form CTA */}
        {high.length > 0 && (
          <div style={{ padding: 20, background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, display: "flex", gap: 14 }}>
            <div style={{ width: 32, height: 32, background: C.ink, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: C.white, fontSize: 12, fontWeight: 700 }}>F</span>
            </div>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500, color: C.ink }}>Your Brand MRI found strategic and visual gaps that may require deeper brand work.</p>
              <p style={{ margin: "0 0 14px", fontSize: 12, color: C.inkSecondary, lineHeight: 1.5 }}>Work with Form to evolve this into a complete Intelligent Brand System — a full brand architecture built for an AI-native world.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn size="sm">Book a consultation</Btn>
                <Btn size="sm" variant="secondary" onClick={() => setStep("exports")}>Export Brand Brain</Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

// ─── Page: Prompt Library ─────────────────────────────────────────────────────

function buildPrompts(brain) {
  const b = brain;
  const c = b.project.companyName;
  const audience = b.strategicDNA.primaryAudience.value;
  const tone = b.verbalSystem.toneAttributes.values.join(", ");
  const banned = b.verbalSystem.bannedVocabulary.values.join(", ");
  const principles = b.verbalSystem.voicePrinciples.values.map(p => `- ${p}`).join("\n");
  const diff = b.strategicDNA.differentiators.values.slice(0, 3).join("; ");
  const proofs = b.strategicDNA.proofPoints.values.slice(0, 3).join("; ");
  const promise = b.strategicDNA.corePromise.value;
  const rules = b.decisionRules.map(r => `- ${r.rule}`).join("\n");

  return {
    writing: [
      { id: "w1", title: "Homepage Headline", useCase: "Generate on-brand homepage headline options.", vars: ["company", "corePromise", "toneAttributes", "bannedVocabulary"],
        prompt: `You are a brand strategist writing for ${c}, a ${b.strategicDNA.category.value}.\n\nCore promise: ${promise}\nPrimary audience: ${audience}\nTop differentiators: ${diff}\nProof points: ${proofs}\n\nVoice: ${tone}\nVoice principles:\n${principles}\n\nDo not use: ${banned}\n\nWrite 5 homepage headline options. Each must:\n1. Lead with an outcome or precise problem statement\n2. Be under 10 words\n3. Avoid all superlatives unless backed by a specific number\n4. Sound like a precise expert, not a copywriter` },
      { id: "w2", title: "LinkedIn Post", useCase: "Write a LinkedIn post appropriate for the brand voice.", vars: ["company", "toneAttributes", "primaryAudience", "bannedVocabulary"],
        prompt: `Write a LinkedIn post for ${c}.\n\nBrand voice: ${tone}\nPrimary audience: ${audience}\n\nVoice rules:\n${principles}\n\nBanned vocabulary: ${banned}\n\nThe post should:\n- Open with a specific insight or data point — not a question\n- Be 150–250 words\n- End with a conclusion, not a call to action\n- Sound like a practitioner, not a marketer\n\nTopic: [Insert topic here]` },
      { id: "w3", title: "Founder Announcement", useCase: "Draft an on-brand announcement for funding, hires, or milestones.", vars: ["company", "toneAttributes", "primaryAudience"],
        prompt: `Write a founder announcement for ${c}.\n\nVoice: ${tone}\nDecision rules:\n${rules}\n\nDo not use: ${banned}\n\nThe announcement should:\n- Open by naming the problem or moment — not congratulating ourselves\n- Avoid: \"humbled,\" \"excited to announce,\" \"thrilled\"\n- Close with a specific forward-looking statement\n\nAnnouncement type: [Insert: funding / new hire / partnership]\nDetail: [Insert specific detail]` },
      { id: "w4", title: "Investor Update", useCase: "Draft a monthly or quarterly investor update email.", vars: ["company", "stage", "proofPoints"],
        prompt: `Write a monthly investor update for ${c} (${b.project.stage}).\n\nVoice: Precise, assured, no hyperbole.\nProof points: ${proofs}\n\nStructure:\n1. Headline metric (1 sentence, specific number)\n2. Key wins (3 bullet points with metrics)\n3. What we learned (honest, specific)\n4. What we're doing about it\n5. Next month targets (3 specific, measurable goals)\n\nDo not use: vague growth language, "traction," "momentum," "exciting"\n\nPeriod: [Insert]\nKey metric: [Insert]` },
    ],
    strategy: [
      { id: "s1", title: "Positioning Refinement", useCase: "Stress-test and refine the current positioning statement.", vars: ["company", "positioning", "differentiators", "proofPoints"],
        prompt: `Review and refine the positioning for ${c}.\n\nCurrent positioning:\n"${b.strategicDNA.positioningStatement.value}"\n\nCore promise: ${promise}\nDifferentiators: ${diff}\nProof points: ${proofs}\n\nEvaluate on:\n1. Specificity — does it name a precise category and audience?\n2. Differentiation — could any competitor claim it?\n3. Credibility — is the promise provable?\n4. Resonance — does it speak to the operational pain of ${audience}?\n\nProvide:\n1. Diagnosis (2–3 sentences)\n2. Three alternative positioning statements\n3. Recommendation with rationale` },
      { id: "s2", title: "Category Narrative", useCase: "Develop a category narrative that frames the market on your terms.", vars: ["company", "category", "marketContext"],
        prompt: `Develop a category narrative for ${c} in the ${b.strategicDNA.category.value} space.\n\nMarket context: ${b.strategicDNA.marketContext.value}\n\nA category narrative should:\n1. Name the old way (the broken status quo)\n2. Name why it broke\n3. Name the new way (the category you're defining)\n4. Establish the stakes\n5. Position ${c} as category leader — through logic, not assertion\n\nWrite a 3-paragraph draft. Then provide a 2-sentence version for presentations.` },
      { id: "s3", title: "Competitive Differentiation", useCase: "Map competitive landscape and sharpen differentiation.", vars: ["company", "directCompetitors", "whiteSpaceOpportunities"],
        prompt: `Map differentiation strategy for ${c}.\n\nDirect competitors: ${b.competitiveContext.directCompetitors.values.join(", ")}\nSimilarity risks: ${b.competitiveContext.similarityRisks.values.join("; ")}\nWhite space: ${b.competitiveContext.whiteSpaceOpportunities.values.join("; ")}\n\nProvide:\n1. What messages/claims are saturated in this category?\n2. What territory is unclaimed?\n3. Which white space opportunities are most defensible for ${c}?\n4. Anti-positioning statement (what we explicitly are NOT)` },
    ],
    design: [
      { id: "d1", title: "Visual Direction", useCase: "Generate creative direction for a visual design project.", vars: ["colorLogic", "typographyLogic", "photographyStyle", "visualPatternsToAvoid"],
        prompt: `Generate visual direction for a ${c} design project.\n\nBrand visual system:\n- Color: ${b.visualSystem.colorLogic.value}\n- Typography: ${b.visualSystem.typographyLogic.value}\n- Photography: ${b.visualSystem.photographyStyle.value}\n- Patterns to avoid: ${b.visualSystem.visualPatternsToAvoid.values.join("; ")}\n\nProvide:\n1. Creative direction statement (2–3 sentences)\n2. Color application guidance\n3. Typography approach\n4. Imagery direction\n5. What to avoid specifically\n\nProject: [Describe the design project]\nKey message: [Insert message]` },
      { id: "d2", title: "Website Art Direction", useCase: "Art direct a new website or website section.", vars: ["colorLogic", "typographyLogic", "layoutPrinciples"],
        prompt: `Provide art direction for a ${c} website redesign.\n\nVisual system:\n- Colors: ${b.visualSystem.colorLogic.value}\n- Typography: ${b.visualSystem.typographyLogic.value}\n- Layout: ${b.visualSystem.layoutPrinciples.value}\n- Avoid: ${b.visualSystem.visualPatternsToAvoid.values.slice(0, 4).join("; ")}\n\nProvide art direction for:\n1. Hero / Above the fold\n2. Problem / Pain section\n3. Solution / Product section\n4. Proof / Social proof\n5. CTA / Bottom\n\nFor each: layout structure, visual elements, color application, typography hierarchy.` },
    ],
    critique: [
      { id: "c1", title: "Critique This Landing Page", useCase: "Evaluate a landing page against the brand system.", vars: ["corePromise", "toneAttributes", "decisionRules", "bannedVocabulary"],
        prompt: `Critique a landing page against ${c}'s brand standards.\n\nBrand standards:\n- Core promise: ${promise}\n- Voice: ${tone}\n- Decision rules:\n${rules}\n- Banned vocabulary: ${banned}\n\nEvaluate on:\n1. Messaging alignment (outcome vs. feature led?)\n2. Voice compliance (banned terms present?)\n3. Audience specificity (speaks to ${audience}?)\n4. Proof point usage (claims backed by evidence?)\n5. Decision rule adherence\n\nFor each: On Brand / Needs Work / Off Brand\nProvide specific quoted examples. Recommend specific edits.\n\nLanding page URL or content: [Paste here]` },
      { id: "c2", title: "Check Copy for Brand Fit", useCase: "Quickly evaluate any copy against voice and messaging standards.", vars: ["toneAttributes", "bannedVocabulary", "phrasesToAvoid"],
        prompt: `Check copy for brand fit against ${c}'s voice standards.\n\nVoice: ${tone}\nVoice principles:\n${principles}\nBanned vocabulary: ${banned}\n\nProvide:\n1. Brand fit: On Brand / Partially / Off Brand\n2. Specific issues (quote the problem phrase, explain why)\n3. Specific strengths (quote what works)\n4. Revised version that brings it on brand\n\nCopy to evaluate:\n[Paste copy here]` },
      { id: "c3", title: "Identify Off-Brand Elements", useCase: "Scan any asset for off-brand elements across copy and visual.", vars: ["bannedVocabulary", "phrasesToAvoid", "visualPatternsToAvoid", "decisionRules"],
        prompt: `Scan for off-brand elements in ${c} assets.\n\nBANNED VOCABULARY: ${banned}\n\nVISUAL PATTERNS TO AVOID: ${b.visualSystem.visualPatternsToAvoid.values.join("; ")}\n\nDECISION RULES:\n${rules}\n\nAudit:\n1. Every off-brand verbal element (quote directly, explain why)\n2. Every off-brand visual element (describe specifically)\n3. Overall brand compliance: Compliant / Partially / Non-Compliant\n4. Priority order for remediation\n\nAsset to audit: [Describe or paste here]` },
    ],
  };
}

function PromptsPage({ step, setStep, hasBrain, brain }) {
  const [cat, setCat] = useState("writing");
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const prompts = buildPrompts(brain);
  const cats = { writing: "Writing", strategy: "Strategy", design: "Design", critique: "Critique" };

  async function copy(p) {
    try { await navigator.clipboard.writeText(p.prompt); } catch { }
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <Shell step={step} setStep={setStep} hasBrain={hasBrain}
      title="Prompt Library"
      subtitle={`Prompts generated from ${brain.project.companyName}'s Brand Brain`}
      actions={<Btn size="sm" variant="secondary" onClick={() => setStep("exports")}>Continue to Exports</Btn>}
    >
      <div style={{ display: "flex", minHeight: 0 }}>
        <div style={{ width: 160, flexShrink: 0, borderRight: `1px solid ${C.border}`, background: C.bg, paddingTop: 14 }}>
          {Object.entries(cats).map(([id, label]) => (
            <button key={id} onClick={() => setCat(id)}
              style={{ width: "100%", textAlign: "left", padding: "8px 16px", background: cat === id ? C.white : "transparent", color: cat === id ? C.ink : C.inkSecondary, fontWeight: cat === id ? 500 : 400, fontSize: 13, border: "none", borderRight: cat === id ? `2px solid ${C.ink}` : "2px solid transparent", cursor: "pointer", fontFamily: F.family }}>
              <span>{label}</span>
              <span style={{ display: "block", fontSize: 10, color: C.inkTertiary, marginTop: 2 }}>{prompts[id].length} prompts</span>
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "32px 40px" }}>
          <div style={{ maxWidth: 720 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: C.ink }}>{cats[cat]}</h2>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: C.inkSecondary }}>All prompts are generated from {brain.project.companyName}&apos;s Brand Brain — not generic templates.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {prompts[cat].map(p => (
                <div key={p.id} style={{ border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 600, color: C.ink }}>{p.title}</p>
                        <p style={{ margin: 0, fontSize: 11, color: C.inkSecondary }}>{p.useCase}</p>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)} style={{ fontSize: 11, color: C.inkSecondary, background: C.bgSecondary, border: `1px solid ${C.border}`, borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontFamily: F.family }}>{expandedId === p.id ? "Collapse" : "Preview"}</button>
                        <button onClick={() => copy(p)} style={{ fontSize: 11, color: C.white, background: copiedId === p.id ? "#2D6A4F" : C.ink, border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontFamily: F.family, minWidth: 54 }}>{copiedId === p.id ? "Copied" : "Copy"}</button>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {p.vars.slice(0, 5).map(v => <span key={v} style={{ padding: "1px 6px", borderRadius: 3, background: C.bgSecondary, color: C.inkSecondary, border: `1px solid ${C.border}`, fontSize: 10, fontFamily: "monospace" }}>{v}</span>)}
                    </div>
                  </div>
                  {expandedId === p.id && (
                    <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 18px", background: C.bgSecondary }}>
                      <pre style={{ margin: 0, fontSize: 11, color: C.inkSecondary, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{p.prompt}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

// ─── Page: Exports ────────────────────────────────────────────────────────────

function generateClaudeExport(brain) {
  const b = brain;
  return `# ${b.project.companyName} — Claude Project Instructions
Generated by Brand MRI

---

## Company Context

**Company:** ${b.project.companyName}
**Category:** ${b.strategicDNA.category.value}
**Stage:** ${b.project.stage}
**Primary audience:** ${b.strategicDNA.primaryAudience.value}

**Core promise:** ${b.strategicDNA.corePromise.value}

**Positioning:**
${b.strategicDNA.positioningStatement.value}

**Elevator pitch:**
${b.verbalSystem.elevatorPitch.value}

---

## Brand DNA

**Mission:** ${b.strategicDNA.mission.value}
**Vision:** ${b.strategicDNA.vision.value}

**Key differentiators:**
${b.strategicDNA.differentiators.values.map(d => `- ${d}`).join("\n")}

**Proof points:**
${b.strategicDNA.proofPoints.values.map(p => `- ${p}`).join("\n")}

---

## Voice Rules

**Tone:** ${b.verbalSystem.toneAttributes.values.join(", ")}

**Voice principles:**
${b.verbalSystem.voicePrinciples.values.map(p => `- ${p}`).join("\n")}

**On-brand example:**
> ${b.verbalSystem.onBrandCopy.value}

**Off-brand example (avoid):**
> ${b.verbalSystem.offBrandCopy.value}

---

## Vocabulary Rules

**Banned — never use:**
${b.verbalSystem.bannedVocabulary.values.map(w => `- ${w}`).join("\n")}

**Phrases to avoid:**
${b.verbalSystem.phrasesToAvoid.values.map(p => `- ${p}`).join("\n")}

---

## Decision Rules

${b.decisionRules.map(r => `**${r.rule}**\n${r.why}\nExample: ${r.example}`).join("\n\n")}

---

## Personality Calibration

- Authority: ${b.personalityModel.authority.score}/100 — ${b.personalityModel.authority.rationale}
- Warmth: ${b.personalityModel.warmth.score}/100 — ${b.personalityModel.warmth.rationale}
- Clarity: ${b.personalityModel.clarity.score}/100 — ${b.personalityModel.clarity.rationale}
- Restraint: ${b.personalityModel.restraint.score}/100 — ${b.personalityModel.restraint.rationale}
- Playfulness: ${b.personalityModel.playfulness.score}/100 — ${b.personalityModel.playfulness.rationale}

---

## How to Behave

1. **Default to precision.** Name specific numbers, roles, outcomes. Never approximate.
2. **Lead with outcomes.** Start with what the customer gains, not what the product does.
3. **Reject banned vocabulary.** Rewrite without banned words and explain briefly.
4. **Treat silence as restraint.** When in doubt, say less.
5. **Speak to the operator.** The primary audience is a VP or COO — not a patient.
6. **Never overclaim.** If a claim lacks a data point, flag it rather than assert it.`;
}

function generateNotionExport(brain) {
  const b = brain;
  return `# ${b.project.companyName} Brand Brain

---

## Brand DNA

| Field | Value |
|-------|-------|
| Mission | ${b.strategicDNA.mission.value} |
| Vision | ${b.strategicDNA.vision.value} |
| Category | ${b.strategicDNA.category.value} |
| Core Promise | ${b.strategicDNA.corePromise.value} |

### Positioning
> ${b.strategicDNA.positioningStatement.value}

### Differentiators
${b.strategicDNA.differentiators.values.map(d => `- ${d}`).join("\n")}

### Proof Points
${b.strategicDNA.proofPoints.values.map(p => `- ${p}`).join("\n")}

---

## Messaging

### Elevator Pitch
${b.verbalSystem.elevatorPitch.value}

### Voice Principles
${b.verbalSystem.voicePrinciples.values.map((p, i) => `${i + 1}. ${p}`).join("\n")}

### Vocabulary
**Approved:** ${b.verbalSystem.approvedVocabulary.values.join(", ")}
**Banned:** ${b.verbalSystem.bannedVocabulary.values.join(", ")}

---

## Visual System

| Element | Direction |
|---------|-----------|
| Colors | ${b.visualSystem.colorLogic.value} |
| Typography | ${b.visualSystem.typographyLogic.value} |
| Photography | ${b.visualSystem.photographyStyle.value} |

### Patterns to Avoid
${b.visualSystem.visualPatternsToAvoid.values.map(p => `- ❌ ${p}`).join("\n")}

---

## Decision Rules
${b.decisionRules.map(r => `\n### ${r.rule}\n**Why:** ${r.why}\n**Example:** ${r.example}`).join("\n")}

---

## Competitive Context

**Direct:** ${b.competitiveContext.directCompetitors.values.join(", ")}

### White Space
${b.competitiveContext.whiteSpaceOpportunities.values.map(o => `- ${o}`).join("\n")}`;
}

function generatePDFReport(brain) {
  const b = brain;
  const high = b.brandDiagnosis.filter(c => c.severity === "High").length;
  const med = b.brandDiagnosis.filter(c => c.severity === "Medium").length;
  return `BRAND MRI INTELLIGENCE REPORT
${b.project.companyName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTIVE SUMMARY

This Brand MRI identifies ${high} high-severity and ${med} medium-severity findings.

Company: ${b.project.companyName}
Category: ${b.strategicDNA.category.value}
Stage: ${b.project.stage}
Core Promise: ${b.strategicDNA.corePromise.value}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A. STRATEGIC DNA

Mission
${b.strategicDNA.mission.value}

Vision
${b.strategicDNA.vision.value}

Positioning
${b.strategicDNA.positioningStatement.value}

Differentiators
${b.strategicDNA.differentiators.values.map((d, i) => `${i + 1}. ${d}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

B. VERBAL SYSTEM

Voice: ${b.verbalSystem.toneAttributes.values.join(" · ")}

Elevator Pitch
${b.verbalSystem.elevatorPitch.value}

Banned Vocabulary
${b.verbalSystem.bannedVocabulary.values.join(", ")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

C. DECISION RULES

${b.decisionRules.map(r => `RULE: ${r.rule}\nWhy: ${r.why}\nExample: ${r.example}`).join("\n\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

D. BRAND DRIFT FINDINGS

${b.brandDiagnosis.map(card => `[${card.severity.toUpperCase()}] ${card.title}\nFinding: ${card.finding}\nRecommendation: ${card.recommendation}`).join("\n\n─────────────────────────────\n\n")}`;
}

function generateAIPack(brain) {
  const b = brain;
  const tone = b.verbalSystem.toneAttributes.values.join(", ");
  const banned = b.verbalSystem.bannedVocabulary.values.join(", ");
  const rules = b.decisionRules.map(r => `- ${r.rule}`).join("\n");
  return `# ${b.project.companyName} — AI Tool Instruction Pack

━━━━━━━━━━━━━━━━━━━━━━━━━━

## CLAUDE (Project Instructions)

You are a brand assistant for ${b.project.companyName}, a ${b.strategicDNA.category.value}.
Core promise: ${b.strategicDNA.corePromise.value}
Tone: ${tone}
Never use: ${banned}
Decision rules:
${rules}

━━━━━━━━━━━━━━━━━━━━━━━━━━

## CHATGPT (Custom Instructions)

Company: ${b.project.companyName} — ${b.strategicDNA.category.value}
Core promise: ${b.strategicDNA.corePromise.value}
Tone: ${tone}
Never use: ${banned}
Rules: ${rules}

━━━━━━━━━━━━━━━━━━━━━━━━━━

## FIGMA AI / FIGMA MAKE

Brand: ${b.project.companyName}
Visual: Institutional precision. Editorial typography.
Colors: ${b.visualSystem.colorLogic.value}
Avoid: ${b.visualSystem.visualPatternsToAvoid.values.slice(0, 4).join(", ")}

━━━━━━━━━━━━━━━━━━━━━━━━━━

## CURSOR (Rules for AI)

When generating UI copy or components for ${b.project.companyName}:
- Tone: ${tone}
- Never use: ${banned}
- Visual: Institutional precision, not consumer health

━━━━━━━━━━━━━━━━━━━━━━━━━━

## V0 / LOVABLE

Build for ${b.project.companyName}. Tone: ${tone}.
Colors: ${b.visualSystem.colorLogic.value}
Avoid: ${b.visualSystem.visualPatternsToAvoid.values.slice(0, 3).join("; ")}`;
}

const EXPORT_TABS = [
  { id: "claude", label: "Claude Instructions", desc: "Paste into Claude Project instructions" },
  { id: "notion", label: "Notion Export", desc: "Markdown for Notion import" },
  { id: "pdf", label: "PDF Report", desc: "Full brand intelligence report" },
  { id: "aipack", label: "AI Tool Pack", desc: "Claude, ChatGPT, Figma, Cursor, v0" },
];

function ExportsPage({ step, setStep, hasBrain, brain }) {
  const [tab, setTab] = useState("claude");
  const [copied, setCopied] = useState(false);

  const content = {
    claude: generateClaudeExport(brain),
    notion: generateNotionExport(brain),
    pdf: generatePDFReport(brain),
    aipack: generateAIPack(brain),
  }[tab];

  async function copy() {
    try { await navigator.clipboard.writeText(content); } catch { }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function download() {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brain.project.companyName.toLowerCase().replace(/\s+/g, "-")}-${tab}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Shell step={step} setStep={setStep} hasBrain={hasBrain}
      title="Exports"
      subtitle={`${brain.project.companyName} — Brand Brain export package`}
      actions={
        <div style={{ display: "flex", gap: 8 }}>
          <Btn size="sm" variant="secondary" onClick={download}>Download</Btn>
          <Btn size="sm" onClick={copy}>{copied ? "Copied!" : "Copy to clipboard"}</Btn>
        </div>
      }
    >
      <div style={{ display: "flex", height: "calc(100vh - 80px)" }}>
        <div style={{ width: 200, flexShrink: 0, borderRight: `1px solid ${C.border}`, background: C.bg, paddingTop: 14 }}>
          {EXPORT_TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ width: "100%", textAlign: "left", padding: "10px 16px", background: tab === t.id ? C.white : "transparent", borderRight: tab === t.id ? `2px solid ${C.ink}` : "2px solid transparent", border: "none", cursor: "pointer", fontFamily: F.family }}>
              <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: tab === t.id ? 500 : 400, color: tab === t.id ? C.ink : C.inkSecondary }}>{t.label}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.inkTertiary, lineHeight: 1.4 }}>{t.desc}</p>
            </button>
          ))}
          <div style={{ margin: "16px 10px 0", padding: 10, background: C.bgTertiary, borderRadius: 6 }}>
            <p style={{ margin: 0, fontSize: 10, color: C.inkSecondary, lineHeight: 1.5 }}>All exports generated from your approved Brand Brain — not generic templates.</p>
          </div>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "24px 32px" }}>
          <pre style={{ margin: 0, fontSize: 11, color: C.inkSecondary, lineHeight: 1.75, whiteSpace: "pre-wrap", fontFamily: "monospace", background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 24 }}>{content}</pre>
        </div>
      </div>
    </Shell>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function BrandMRI() {
  const [step, setStep] = useState("landing");
  const [project, setProject] = useState({ companyName: "", websiteUrl: "", industry: "", stage: "Seed", primaryAudience: "", notes: "" });
  const [brain, setBrain] = useState(null);

  function startScan() {
    setBrain({ ...BRAND_BRAIN, project: { ...BRAND_BRAIN.project, ...project } });
    setStep("processing");
  }

  const hasBrain = brain !== null;

  switch (step) {
    case "landing":    return <Landing setStep={setStep} />;
    case "new-scan":   return <NewScan step={step} setStep={setStep} project={project} setProject={setProject} hasBrain={hasBrain} />;
    case "upload":     return <Upload step={step} setStep={setStep} hasBrain={hasBrain} onStart={startScan} />;
    case "processing": return <Processing setStep={setStep} />;
    case "brand-brain":return hasBrain ? <BrandBrainPage step={step} setStep={setStep} hasBrain={hasBrain} brain={brain} setBrain={setBrain} /> : <Landing setStep={setStep} />;
    case "diagnosis":  return hasBrain ? <DiagnosisPage step={step} setStep={setStep} hasBrain={hasBrain} brain={brain} /> : <Landing setStep={setStep} />;
    case "prompts":    return hasBrain ? <PromptsPage step={step} setStep={setStep} hasBrain={hasBrain} brain={brain} /> : <Landing setStep={setStep} />;
    case "exports":    return hasBrain ? <ExportsPage step={step} setStep={setStep} hasBrain={hasBrain} brain={brain} /> : <Landing setStep={setStep} />;
    default:           return <Landing setStep={setStep} />;
  }
}
