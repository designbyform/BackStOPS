import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { useBrandStore } from '../store/brandStore'
import { AppShell, PageHeader } from '../components/layout/AppShell'
import { Button } from '../components/ui/Button'
import {
  generateClaudeExport,
  generateNotionExport,
  generatePDFReportData,
  generateAIToolPack,
} from '../lib/generators'

type ExportTab = 'pdf' | 'claude' | 'notion' | 'aipack'

const TABS: { id: ExportTab; label: string; description: string }[] = [
  { id: 'pdf', label: 'PDF Report', description: 'Brand intelligence report — all sections' },
  { id: 'claude', label: 'Claude Instructions', description: 'Paste into Claude Project instructions' },
  { id: 'notion', label: 'Notion Export', description: 'Markdown ready to import into Notion' },
  { id: 'aipack', label: 'AI Tool Pack', description: 'Instructions for Claude, ChatGPT, Figma, Cursor, v0' },
]

export function Exports() {
  const { brandBrain } = useBrandStore()
  const [activeTab, setActiveTab] = useState<ExportTab>('claude')
  const [copied, setCopied] = useState(false)
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!brandBrain) return
    switch (activeTab) {
      case 'pdf':
        setContent(generatePDFReportData(brandBrain))
        break
      case 'claude':
        setContent(generateClaudeExport(brandBrain))
        break
      case 'notion':
        setContent(generateNotionExport(brandBrain))
        break
      case 'aipack':
        setContent(generateAIToolPack(brandBrain))
        break
    }
  }, [activeTab, brandBrain])

  if (!brandBrain) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-96">
          <p className="text-sm text-[#9C9A94]">No Brand Brain yet. Run a scan first.</p>
        </div>
      </AppShell>
    )
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function handleDownload() {
    const ext = activeTab === 'pdf' ? 'txt' : 'md'
    const names: Record<ExportTab, string> = {
      pdf: `${brandBrain!.project.companyName.toLowerCase().replace(/\s+/g, '-')}-brand-mri-report`,
      claude: `${brandBrain!.project.companyName.toLowerCase().replace(/\s+/g, '-')}-claude-instructions`,
      notion: `${brandBrain!.project.companyName.toLowerCase().replace(/\s+/g, '-')}-notion-export`,
      aipack: `${brandBrain!.project.companyName.toLowerCase().replace(/\s+/g, '-')}-ai-tool-pack`,
    }
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${names[activeTab]}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AppShell>
      <PageHeader
        title="Exports"
        subtitle={`${brandBrain.project.companyName} — Brand Brain export package`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleDownload}>
              Download
            </Button>
            <Button size="sm" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </Button>
          </div>
        }
      />

      <div className="flex min-h-0" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Tab sidebar */}
        <div className="w-48 shrink-0 border-r border-[#E0DDD7] bg-[#F9F8F6] py-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'w-full text-left px-4 py-3 transition-colors duration-100',
                activeTab === tab.id
                  ? 'bg-white border-r-2 border-[#1A1916]'
                  : 'hover:bg-[#ECEAE5]'
              )}
            >
              <p
                className={clsx(
                  'text-sm',
                  activeTab === tab.id ? 'text-[#1A1916] font-medium' : 'text-[#6B6860]'
                )}
              >
                {tab.label}
              </p>
              <p className="text-[10px] text-[#9C9A94] mt-0.5 leading-snug">{tab.description}</p>
            </button>
          ))}

          {/* Export note */}
          <div className="mt-6 mx-3 p-3 rounded bg-[#ECEAE5]">
            <p className="text-[10px] text-[#6B6860] leading-relaxed">
              All exports are generated from your approved Brand Brain — not generic templates.
            </p>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto flex flex-col">
          <div className="px-8 py-4 border-b border-[#E0DDD7] bg-white flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#1A1916]">
                {TABS.find((t) => t.id === activeTab)?.label}
              </p>
              <p className="text-xs text-[#9C9A94] mt-0.5">
                {TABS.find((t) => t.id === activeTab)?.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9C9A94]">
                {content.split('\n').length} lines
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-3xl">
              {activeTab === 'pdf' ? (
                <PDFPreview content={content} brain={brandBrain} />
              ) : (
                <pre className="text-xs text-[#3D3B35] leading-relaxed whitespace-pre-wrap font-mono bg-white border border-[#E0DDD7] rounded-lg p-6">
                  {content}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

import type { BrandBrain } from '../types/brandBrain'

function PDFPreview({ content, brain }: { content: string; brain: BrandBrain }) {
  const highCount = Object.values(brain.brandDiagnosis).filter(c => c.severity === 'High').length
  const medCount = Object.values(brain.brandDiagnosis).filter(c => c.severity === 'Medium').length

  return (
    <div className="bg-white border border-[#E0DDD7] rounded-lg overflow-hidden">
      {/* Report header */}
      <div className="bg-[#1A1916] px-8 py-8 text-white">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-white/50 mb-3">Brand Intelligence Report</p>
        <h1 className="text-2xl font-semibold tracking-tight">{brain.project.companyName}</h1>
        <p className="text-white/60 text-sm mt-1">{brain.strategicDNA.category.value}</p>
        <p className="text-white/40 text-xs mt-4">{new Date(brain.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Executive summary */}
      <div className="px-8 py-6 border-b border-[#E0DDD7]">
        <p className="text-[10px] font-semibold text-[#9C9A94] tracking-widest uppercase mb-3">Executive Summary</p>
        <p className="text-sm text-[#3D3B35] leading-relaxed">
          This Brand MRI report presents a structured analysis of {brain.project.companyName}&apos;s current brand system.
          The scan identified <strong className="text-[#1A1916]">{highCount} high-severity</strong> and{' '}
          <strong className="text-[#1A1916]">{medCount} medium-severity</strong> findings requiring attention.
        </p>

        <div className="grid grid-cols-4 gap-4 mt-5">
          {[
            { label: 'Stage', value: brain.project.stage },
            { label: 'Industry', value: brain.project.industry },
            { label: 'Core Promise', value: brain.strategicDNA.corePromise.value },
            { label: 'Primary Audience', value: brain.strategicDNA.primaryAudience.value.split(' ').slice(0, 6).join(' ') + '...' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[9px] font-semibold text-[#9C9A94] tracking-widest uppercase mb-1">{item.label}</p>
              <p className="text-xs text-[#1A1916]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sections preview */}
      <div className="px-8 py-6 space-y-5">
        {[
          {
            label: 'A. Strategic DNA',
            preview: brain.strategicDNA.positioningStatement.value,
          },
          {
            label: 'B. Core Promise',
            preview: brain.strategicDNA.corePromise.value,
          },
          {
            label: 'C. Voice & Verbal System',
            preview: brain.verbalSystem.voicePrinciples.values.slice(0, 2).join(' · '),
          },
          {
            label: 'D. Decision Rules',
            preview: brain.decisionRules.rules.slice(0, 2).map(r => r.rule).join(' · '),
          },
        ].map((section) => (
          <div key={section.label} className="pb-5 border-b border-[#E0DDD7] last:border-0">
            <p className="text-[10px] font-semibold text-[#9C9A94] tracking-widest uppercase mb-2">{section.label}</p>
            <p className="text-sm text-[#3D3B35] leading-relaxed">{section.preview}</p>
          </div>
        ))}
      </div>

      {/* Full text */}
      <div className="px-8 py-6 border-t border-[#E0DDD7] bg-[#F9F8F6]">
        <p className="text-[10px] font-semibold text-[#9C9A94] tracking-widest uppercase mb-3">Full Report Text</p>
        <pre className="text-[11px] text-[#6B6860] leading-relaxed whitespace-pre-wrap font-mono">
          {content}
        </pre>
      </div>
    </div>
  )
}
