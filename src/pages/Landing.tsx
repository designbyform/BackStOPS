import { useBrandStore } from '../store/brandStore'
import { Button } from '../components/ui/Button'

export function Landing() {
  const setStep = useBrandStore((s) => s.setStep)

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
      {/* Top bar */}
      <header className="px-10 py-5 border-b border-[#E0DDD7] bg-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-[#1A1916] rounded-sm flex items-center justify-center">
            <span className="text-white text-[10px] font-semibold">M</span>
          </div>
          <span className="text-sm font-semibold text-[#1A1916] tracking-tight">Brand MRI</span>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setStep('new-scan')}>
          Start a scan
        </Button>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center max-w-3xl mx-auto">
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E0DDD7] bg-white text-xs text-[#6B6860]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Brand intelligence, not a chatbot
        </div>

        <h1 className="text-5xl font-semibold text-[#1A1916] tracking-tight leading-tight mb-6">
          Your brand,<br />diagnosed.
        </h1>

        <p className="text-lg text-[#6B6860] leading-relaxed max-w-lg mb-10">
          Brand MRI ingests your existing brand assets and converts them into a structured, editable Brand Brain — with confidence scores, gap analysis, and exports for every AI tool you use.
        </p>

        <Button size="lg" onClick={() => setStep('new-scan')}>
          Run a Brand MRI scan
        </Button>

        {/* Process steps */}
        <div className="mt-20 grid grid-cols-4 gap-6 text-left w-full">
          {[
            { n: '01', label: 'Upload assets', desc: 'Brand guide, pitch deck, website, copy examples' },
            { n: '02', label: 'Extract Brand Brain', desc: 'Structured extraction with confidence scores and gap flags' },
            { n: '03', label: 'Edit and approve', desc: 'Every field is editable. You are the source of truth.' },
            { n: '04', label: 'Export everywhere', desc: 'Claude, Notion, PDF report, AI tool instruction packs' },
          ].map((step) => (
            <div key={step.n} className="space-y-2">
              <span className="text-[10px] font-semibold text-[#9C9A94] tabular-nums">{step.n}</span>
              <p className="text-sm font-medium text-[#1A1916]">{step.label}</p>
              <p className="text-xs text-[#6B6860] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What Brand MRI produces */}
      <section className="border-t border-[#E0DDD7] bg-white px-10 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-[#9C9A94] tracking-widest uppercase mb-8">What Brand MRI produces</p>
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                label: 'Brand Brain',
                items: ['Strategic DNA', 'Personality model', 'Verbal system', 'Visual system', 'Decision rules', 'Competitive context'],
              },
              {
                label: 'Diagnosis',
                items: ['Messaging inconsistency', 'Visual drift', 'Audience clarity gaps', 'Generic language risk', 'Trust gaps', 'Differentiation gaps'],
              },
              {
                label: 'Exports',
                items: ['PDF intelligence report', 'Claude Project instructions', 'Notion Brand Brain', 'AI tool instruction pack'],
              },
            ].map((col) => (
              <div key={col.label}>
                <p className="text-sm font-semibold text-[#1A1916] mb-3">{col.label}</p>
                <ul className="space-y-1.5">
                  {col.items.map((item) => (
                    <li key={item} className="text-sm text-[#6B6860] flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#C5C1B9] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
