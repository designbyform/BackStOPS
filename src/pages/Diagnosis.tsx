import { useBrandStore } from '../store/brandStore'
import { AppShell, PageHeader, PageBody } from '../components/layout/AppShell'
import { Button } from '../components/ui/Button'
import { SeverityBadge } from '../components/ui/Badge'
import { clsx } from 'clsx'
import type { DiagnosticCard } from '../types/brandBrain'

export function Diagnosis() {
  const { brandBrain, setStep } = useBrandStore()

  if (!brandBrain) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-96">
          <p className="text-sm text-[#9C9A94]">No Brand Brain yet. Run a scan first.</p>
        </div>
      </AppShell>
    )
  }

  const cards = Object.values(brandBrain.brandDiagnosis) as DiagnosticCard[]
  const highSeverity = cards.filter((c) => c.severity === 'High')
  const medSeverity = cards.filter((c) => c.severity === 'Medium')
  const hasHighSeverity = highSeverity.length > 0

  const sortedCards = [
    ...cards.filter((c) => c.severity === 'High'),
    ...cards.filter((c) => c.severity === 'Medium'),
    ...cards.filter((c) => c.severity === 'Low'),
  ]

  return (
    <AppShell>
      <PageHeader
        title="Brand Diagnosis"
        subtitle={`${brandBrain.project.companyName} — ${cards.length} diagnostic findings`}
        actions={
          <Button size="sm" onClick={() => setStep('prompt-library')}>
            Continue to Prompts
          </Button>
        }
      />
      <PageBody>
        {/* Summary bar */}
        <div className="mb-8 flex items-center gap-6 p-4 bg-white border border-[#E0DDD7] rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-semibold text-red-600 tabular-nums">{highSeverity.length}</p>
            <p className="text-xs text-[#6B6860] mt-0.5">High severity</p>
          </div>
          <div className="w-px h-8 bg-[#E0DDD7]" />
          <div className="text-center">
            <p className="text-2xl font-semibold text-amber-600 tabular-nums">{medSeverity.length}</p>
            <p className="text-xs text-[#6B6860] mt-0.5">Medium severity</p>
          </div>
          <div className="w-px h-8 bg-[#E0DDD7]" />
          <div className="text-center">
            <p className="text-2xl font-semibold text-emerald-600 tabular-nums">
              {cards.filter((c) => c.severity === 'Low').length}
            </p>
            <p className="text-xs text-[#6B6860] mt-0.5">Low severity</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-[#9C9A94]">{cards.length} findings total</p>
          </div>
        </div>

        {/* Diagnostic cards */}
        <div className="space-y-4 mb-12">
          {sortedCards.map((card) => (
            <DiagnosticCardView key={card.id} card={card} />
          ))}
        </div>

        {/* Form CTA — shown when high severity issues exist */}
        {hasHighSeverity && (
          <div
            className={clsx(
              'rounded-lg border p-6',
              'border-[#E0DDD7] bg-white'
            )}
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#1A1916] rounded shrink-0 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">F</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1A1916]">
                  Your Brand MRI found strategic and visual gaps that may require deeper brand work.
                </p>
                <p className="text-sm text-[#6B6860] mt-1 leading-relaxed">
                  Work with Form to evolve this into a complete Intelligent Brand System — a full brand architecture built for an AI-native world.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <Button size="sm">
                    Book a consultation
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setStep('exports')}>
                    Export Brand Brain
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageBody>
    </AppShell>
  )
}

function DiagnosticCardView({ card }: { card: DiagnosticCard }) {
  return (
    <div
      className={clsx(
        'rounded-lg border overflow-hidden',
        card.severity === 'High' && 'border-red-200',
        card.severity === 'Medium' && 'border-amber-200',
        card.severity === 'Low' && 'border-emerald-200'
      )}
    >
      <div
        className={clsx(
          'px-5 py-3 border-b flex items-center justify-between',
          card.severity === 'High' && 'bg-red-50 border-red-200',
          card.severity === 'Medium' && 'bg-amber-50 border-amber-200',
          card.severity === 'Low' && 'bg-emerald-50 border-emerald-200'
        )}
      >
        <span className="text-sm font-semibold text-[#1A1916]">{card.title}</span>
        <SeverityBadge level={card.severity} />
      </div>

      <div className="bg-white px-5 py-4 grid grid-cols-3 gap-5 divide-x divide-[#E0DDD7]">
        <div>
          <p className="text-[10px] font-semibold text-[#9C9A94] uppercase tracking-wide mb-1.5">Finding</p>
          <p className="text-sm text-[#3D3B35] leading-relaxed">{card.finding}</p>
        </div>
        <div className="pl-5">
          <p className="text-[10px] font-semibold text-[#9C9A94] uppercase tracking-wide mb-1.5">Evidence</p>
          <p className="text-sm text-[#3D3B35] leading-relaxed">{card.evidence}</p>
        </div>
        <div className="pl-5">
          <p className="text-[10px] font-semibold text-[#9C9A94] uppercase tracking-wide mb-1.5">Recommendation</p>
          <p className="text-sm text-[#3D3B35] leading-relaxed">{card.recommendation}</p>
        </div>
      </div>
    </div>
  )
}
