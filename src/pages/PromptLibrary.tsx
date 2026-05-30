import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { useBrandStore } from '../store/brandStore'
import { AppShell, PageHeader } from '../components/layout/AppShell'
import { Button } from '../components/ui/Button'
import type { BrandPrompt, PromptCategory } from '../types/brandBrain'

const CATEGORY_LABELS: Record<PromptCategory, string> = {
  writing: 'Writing',
  strategy: 'Strategy',
  design: 'Design',
  critique: 'Critique',
}

const CATEGORY_DESCRIPTIONS: Record<PromptCategory, string> = {
  writing: 'Generate on-brand copy for every channel and format.',
  strategy: 'Refine positioning, audience, and messaging architecture.',
  design: 'Direct visual creative work and evaluate design decisions.',
  critique: 'Evaluate assets against the Brand Brain for compliance.',
}

export function PromptLibrary() {
  const { brandBrain, promptLibrary, generatePrompts, setStep } = useBrandStore()
  const [activeCategory, setActiveCategory] = useState<PromptCategory>('writing')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (brandBrain && !promptLibrary) {
      generatePrompts()
    }
  }, [brandBrain, promptLibrary, generatePrompts])

  if (!brandBrain) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-96">
          <p className="text-sm text-[#9C9A94]">No Brand Brain yet. Run a scan first.</p>
        </div>
      </AppShell>
    )
  }

  if (!promptLibrary) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-[#1A1916] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#6B6860]">Generating prompt library from Brand Brain...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (!brandBrain.isApproved) {
    return (
      <AppShell>
        <PageHeader title="Prompt Library" />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="text-center max-w-sm">
            <p className="text-sm font-medium text-[#1A1916] mb-2">Brand Brain not yet approved</p>
            <p className="text-sm text-[#6B6860]">
              The prompt library is generated from the finalized Brand Brain. Review and approve the Brand Brain first.
            </p>
          </div>
          <Button size="sm" onClick={() => setStep('brand-brain')}>
            Review Brand Brain
          </Button>
        </div>
      </AppShell>
    )
  }

  const prompts = promptLibrary[activeCategory]
  const totalCount = Object.values(promptLibrary).reduce((sum, arr) => sum + arr.length, 0)

  async function copyPrompt(prompt: BrandPrompt) {
    await navigator.clipboard.writeText(prompt.prompt)
    setCopiedId(prompt.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <AppShell>
      <PageHeader
        title="Prompt Library"
        subtitle={`${totalCount} prompts generated from ${brandBrain.project.companyName}'s Brand Brain`}
        actions={
          <Button size="sm" variant="secondary" onClick={() => setStep('exports')}>
            Continue to Exports
          </Button>
        }
      />

      <div className="flex min-h-0">
        {/* Category sidebar */}
        <div className="w-40 shrink-0 border-r border-[#E0DDD7] bg-[#F9F8F6] py-4">
          {(Object.keys(CATEGORY_LABELS) as PromptCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                'w-full text-left px-4 py-2 text-sm transition-colors duration-100',
                activeCategory === cat
                  ? 'text-[#1A1916] font-medium bg-white border-r-2 border-[#1A1916]'
                  : 'text-[#6B6860] hover:text-[#1A1916] hover:bg-[#ECEAE5]'
              )}
            >
              <span>{CATEGORY_LABELS[cat]}</span>
              <span className="block text-[10px] text-[#9C9A94] mt-0.5">
                {promptLibrary[cat].length} prompts
              </span>
            </button>
          ))}
        </div>

        {/* Prompt list */}
        <div className="flex-1 overflow-auto px-10 py-8">
          <div className="max-w-3xl">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-[#1A1916]">{CATEGORY_LABELS[activeCategory]}</h2>
              <p className="text-sm text-[#6B6860] mt-0.5">{CATEGORY_DESCRIPTIONS[activeCategory]}</p>
            </div>

            <div className="space-y-3">
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  isCopied={copiedId === prompt.id}
                  isExpanded={expandedId === prompt.id}
                  onCopy={() => copyPrompt(prompt)}
                  onToggle={() => setExpandedId(expandedId === prompt.id ? null : prompt.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

interface PromptCardProps {
  prompt: BrandPrompt
  isCopied: boolean
  isExpanded: boolean
  onCopy: () => void
  onToggle: () => void
}

function PromptCard({ prompt, isCopied, isExpanded, onCopy, onToggle }: PromptCardProps) {
  return (
    <div className="rounded-lg border border-[#E0DDD7] bg-white overflow-hidden">
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <button
              onClick={onToggle}
              className="text-left w-full"
            >
              <p className="text-sm font-semibold text-[#1A1916] group-hover:text-[#3D3B35]">
                {prompt.title}
              </p>
              <p className="text-xs text-[#6B6860] mt-0.5">{prompt.useCase}</p>
            </button>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-xs"
            >
              {isExpanded ? 'Collapse' : 'Preview'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onCopy}
              className="text-xs min-w-[60px]"
            >
              {isCopied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Variables */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {prompt.variables.slice(0, 5).map((v) => (
            <span
              key={v}
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#F2F1EE] text-[#6B6860] border border-[#E0DDD7]"
            >
              {v}
            </span>
          ))}
          {prompt.variables.length > 5 && (
            <span className="text-[10px] text-[#9C9A94] py-0.5">
              +{prompt.variables.length - 5} more
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-[#E0DDD7] px-5 py-4 bg-[#F9F8F6]">
          <pre className="text-xs text-[#3D3B35] leading-relaxed whitespace-pre-wrap font-sans">
            {prompt.prompt}
          </pre>
        </div>
      )}
    </div>
  )
}
