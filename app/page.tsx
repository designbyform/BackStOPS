import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  Bell,
  FileText,
  Building2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Zap,
} from "lucide-react";

const PAIN_POINTS = [
  {
    icon: AlertTriangle,
    title: "Missed renewals = fines, shutdowns, and lost revenue.",
    desc: "One lapsed liquor license can shut down a wine bar for weeks. One expired contractor bond can void every job. The cost of forgetting is catastrophic.",
  },
  {
    icon: Clock,
    title: "Compliance is a second full-time job.",
    desc: "Between state agencies, city permits, insurance renewals, and federal filings, tracking it all in email folders and sticky notes isn't working.",
  },
  {
    icon: FileText,
    title: "Your documents are everywhere — or nowhere.",
    desc: "Where's your Certificate of Insurance? Your health permit? Your current ABRA license? If you're not sure, you're exposed.",
  },
];

const WHAT_IT_TRACKS = [
  "Business licenses & renewals",
  "Liquor & alcohol licenses",
  "Health & food permits",
  "Insurance certificates",
  "Tax & excise deadlines",
  "Corporate filings",
  "Federal permits (TTB, FDA)",
  "Required labor postings",
  "Food handler certifications",
  "Fire & safety inspections",
  "Vendor & supplier documents",
  "Contractor licenses & bonds",
];

const WHO_ITS_FOR = [
  { type: "Restaurants", icon: "🍽️", desc: "Health permits, food handler cards, fire inspections, payroll taxes" },
  { type: "Wine Bars", icon: "🍷", desc: "ABRA / liquor board renewals, liquor liability, music licensing" },
  { type: "Wine Importers", icon: "📦", desc: "TTB Basic Permits, COLA tracking, FDA registration, excise tax" },
  { type: "Food Trucks", icon: "🚚", desc: "Mobile unit permits, commissary agreements, city vending permits" },
  { type: "Salons", icon: "✂️", desc: "State cosmetology licenses, practitioner renewals, liability insurance" },
  { type: "Contractors", icon: "🔨", desc: "Contractor license, bond, workers comp, vehicle registration" },
];

const PRICING = [
  {
    name: "Basic Tracking",
    price: "$199",
    period: "/month",
    desc: "For owners who want to stop forgetting and start tracking.",
    features: [
      "Unlimited compliance items",
      "Overdue & renewal alerts",
      "Business templates",
      "Document tracking",
      "Calendar view",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Managed Compliance",
    price: "$399",
    period: "/month",
    desc: "For operators who want a human concierge in their corner.",
    features: [
      "Everything in Basic",
      "Monthly compliance review",
      "Document collection support",
      "Concierge follow-up",
      "Priority alerts",
    ],
    cta: "Most Popular",
    highlight: true,
  },
  {
    name: "Premium Regulated Ops",
    price: "$799",
    period: "/month",
    desc: "For multi-location or heavily regulated operators.",
    features: [
      "Everything in Managed",
      "Multi-location dashboard",
      "Priority concierge review",
      "Custom compliance calendar",
      "Dedicated account manager",
    ],
    cta: "Contact Us",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900">BackStOPS</span>
              <span className="text-slate-400 ml-1 text-sm">Compliance</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200 mb-6">
          <Zap size={12} />
          Built for regulated small businesses
        </div>
        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-5 max-w-3xl mx-auto">
          Compliance tracking for small{" "}
          <span className="text-blue-600">regulated businesses.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          Track permits, renewals, insurance certs, licenses, tax deadlines,
          required filings, and documents in one simple dashboard. Never miss a
          deadline again.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors text-base shadow-lg shadow-blue-200"
          >
            <ShieldCheck size={18} />
            Start Compliance Dashboard
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 bg-white text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors text-base"
          >
            View Demo
            <ChevronRight size={16} />
          </Link>
        </div>
        <p className="text-xs text-slate-400 mt-5">
          No credit card required · Cancel anytime
        </p>
      </section>

      {/* Stats Banner */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "32+", label: "Compliance categories tracked" },
              { value: "7", label: "Business type templates" },
              { value: "$0", label: "Cost of one missed renewal" },
              { value: "∞", label: "Regret avoided" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-blue-400 mb-1">{s.value}</div>
                <div className="text-sm text-slate-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            The cost of missed compliance is real.
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Every small business operator we've talked to has a story about a
            surprise fine, a lapsed permit, or a failed inspection. BackStOPS
            is built to eliminate those stories.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PAIN_POINTS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-red-50 border border-red-100 rounded-2xl p-6"
              >
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={20} className="text-red-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* What it tracks */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Everything you need to track, in one place.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              From federal alcohol permits to local vending licenses — we
              cover the full compliance stack for regulated small businesses.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {WHAT_IT_TRACKS.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 py-3"
              >
                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Built for your type of business.
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Pre-loaded compliance templates for the most common regulated
            business types. Start in minutes, not days.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {WHO_ITS_FOR.map((b) => (
            <div
              key={b.type}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-default"
            >
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-semibold text-slate-900 mb-1">{b.type}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              How BackStOPS works.
            </h2>
            <p className="text-blue-200 max-w-xl mx-auto">
              Three steps to a compliant operation.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Add your businesses",
                desc: "Set up your business profile. Choose your business type and we'll suggest a starter compliance checklist instantly.",
                icon: Building2,
              },
              {
                step: "02",
                title: "Track your items",
                desc: "Add permits, licenses, insurance certs, tax deadlines, and filings. Set due dates, renewal dates, and document requirements.",
                icon: ClipboardListIcon,
              },
              {
                step: "03",
                title: "Never miss a deadline",
                desc: "Your dashboard shows what's overdue, due soon, and missing. Your concierge sends reminders and helps collect documents.",
                icon: Bell,
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="text-center">
                  <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="text-blue-300 text-sm font-semibold mb-2">
                    Step {s.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-blue-200 text-sm leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Simple, transparent pricing.
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Choose the level of support that matches your operation. Upgrade or
            downgrade anytime.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 ${
                plan.highlight
                  ? "border-blue-500 bg-blue-600 text-white shadow-xl shadow-blue-200 scale-[1.02]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h3
                className={`font-bold text-lg mb-1 ${
                  plan.highlight ? "text-white" : "text-slate-900"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm mb-4 ${
                  plan.highlight ? "text-blue-200" : "text-slate-500"
                }`}
              >
                {plan.desc}
              </p>
              <div className="flex items-baseline gap-1 mb-5">
                <span
                  className={`text-4xl font-bold ${
                    plan.highlight ? "text-white" : "text-slate-900"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-sm ${
                    plan.highlight ? "text-blue-200" : "text-slate-500"
                  }`}
                >
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2
                      size={14}
                      className={plan.highlight ? "text-blue-300" : "text-green-500"}
                    />
                    <span className={plan.highlight ? "text-blue-100" : "text-slate-600"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className={`block text-center font-semibold text-sm py-2.5 px-4 rounded-xl transition-colors ${
                  plan.highlight
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <TrendingUp size={40} className="text-blue-400 mx-auto mb-5" />
          <h2 className="text-3xl font-bold mb-4">
            Stop managing compliance in your head.
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Every week you operate without a compliance system is a week of
            risk. Start today — it takes less than 10 minutes to set up your
            first business.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-500 transition-colors text-base shadow-lg shadow-blue-900/50"
          >
            <ShieldCheck size={18} />
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShieldCheck size={15} className="text-white" />
              </div>
              <span className="font-bold text-slate-900">BackStOPS Compliance</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/auth/login" className="text-sm text-slate-500 hover:text-slate-700">Sign in</Link>
              <Link href="/auth/signup" className="text-sm text-slate-500 hover:text-slate-700">Sign up</Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 max-w-3xl">
              <strong>Disclaimer:</strong> BackStOPS helps organize compliance
              tasks and reminders. It does not provide legal, tax, or regulatory
              advice. Always verify requirements with the relevant agency or
              qualified professional.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ClipboardListIcon(props: { size: number; className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}
