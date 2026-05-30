import { useRef, useState } from 'react'
import { useBrandStore } from '../store/brandStore'
import { AppShell, PageHeader, PageBody } from '../components/layout/AppShell'
import { Textarea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card, CardBody } from '../components/ui/Card'

interface FileDropZoneProps {
  label: string
  description: string
  accept: string
  file: File | null
  onChange: (file: File | null) => void
}

function FileDropZone({ label, description, accept, file, onChange }: FileDropZoneProps) {
  const ref = useRef<HTMLInputElement>(null)

  return (
    <button
      type="button"
      className="w-full border-2 border-dashed border-[#E0DDD7] rounded-lg p-6 text-left hover:border-[#C5C1B9] transition-colors duration-150 group"
      onClick={() => ref.current?.click()}
    >
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {file ? (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1A1916] rounded flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold">PDF</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#1A1916]">{file.name}</p>
            <p className="text-xs text-[#9C9A94]">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <span className="ml-auto text-xs text-[#6B6860] group-hover:text-[#1A1916]">Replace</span>
        </div>
      ) : (
        <div>
          <p className="text-sm font-medium text-[#1A1916]">{label}</p>
          <p className="text-xs text-[#9C9A94] mt-0.5">{description}</p>
          <p className="mt-3 text-xs text-[#C5C1B9] group-hover:text-[#9C9A94] transition-colors">
            Click to upload
          </p>
        </div>
      )}
    </button>
  )
}

export function UploadAssets() {
  const { assets, updateAssets, setStep, apiKey, setApiKey } = useBrandStore()
  const [showKey, setShowKey] = useState(false)

  function handleStart() {
    setStep('processing')
  }

  const hasContent =
    assets.brandGuidePdf !== null ||
    assets.pitchDeckPdf !== null ||
    assets.socialExamples.trim() ||
    assets.messagingExamples.trim() ||
    assets.visualNotes.trim()

  return (
    <AppShell>
      <PageHeader
        title="Asset Upload"
        subtitle="Add everything you have. The more context, the higher the confidence scores."
      />
      <PageBody>
        <div className="space-y-8">
          {/* API Key */}
          <section>
            <h2 className="text-xs font-semibold text-[#9C9A94] tracking-widest uppercase mb-3">
              Anthropic API Key
            </h2>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  placeholder="sk-ant-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E0DDD7] rounded font-mono focus:outline-none focus:ring-1 focus:ring-[#1A1916] focus:border-[#1A1916] pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#9C9A94] hover:text-[#1A1916]"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-xs text-[#9C9A94]">
                Used only in your browser to call the Claude API directly. Never stored or sent elsewhere.
                Get a key at{' '}
                <span className="text-[#1A1916] font-medium">console.anthropic.com</span>.
              </p>
              {!apiKey.trim() && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                  Without an API key, the scan will load sample Meridian Health data instead of extracting from your uploads.
                </p>
              )}
            </div>
          </section>

          {/* PDFs */}
          <section>
            <h2 className="text-xs font-semibold text-[#9C9A94] tracking-widest uppercase mb-3">
              Documents
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <FileDropZone
                label="Brand Guide PDF"
                description="Brand guidelines, style guide, identity manual"
                accept=".pdf"
                file={assets.brandGuidePdf}
                onChange={(f) => updateAssets({ brandGuidePdf: f })}
              />
              <FileDropZone
                label="Pitch Deck PDF"
                description="Investor deck, sales deck, company overview"
                accept=".pdf"
                file={assets.pitchDeckPdf}
                onChange={(f) => updateAssets({ pitchDeckPdf: f })}
              />
            </div>
            <p className="mt-2 text-xs text-[#9C9A94]">
              PDFs are read in-browser. For best results, also paste key copy into the text fields below.
            </p>
          </section>

          {/* Text inputs */}
          <section>
            <h2 className="text-xs font-semibold text-[#9C9A94] tracking-widest uppercase mb-3">
              Copy & Examples
            </h2>
            <div className="space-y-4">
              <Textarea
                label="Social copy examples"
                placeholder="Paste 3–5 LinkedIn posts, tweets, or social captions that represent the brand voice at its best..."
                value={assets.socialExamples}
                onChange={(e) => updateAssets({ socialExamples: e.target.value })}
                rows={5}
                hint="The more authentic examples you provide, the more accurate the voice extraction."
              />
              <Textarea
                label="Messaging examples"
                placeholder="Paste website copy, email campaigns, sales collateral, or any text that represents your brand messaging..."
                value={assets.messagingExamples}
                onChange={(e) => updateAssets({ messagingExamples: e.target.value })}
                rows={5}
              />
              <Textarea
                label="Visual notes"
                placeholder="Describe your visual direction — colors, fonts, photography style, design references, mood board descriptions..."
                value={assets.visualNotes}
                onChange={(e) => updateAssets({ visualNotes: e.target.value })}
                rows={4}
              />
            </div>
          </section>

          {/* Competitors */}
          <section>
            <h2 className="text-xs font-semibold text-[#9C9A94] tracking-widest uppercase mb-3">
              Competitive Context
            </h2>
            <Textarea
              label="Competitor URLs or names"
              placeholder="Symplr, Qgenda, https://competitor.com — one per line or comma-separated..."
              value={assets.competitorUrls}
              onChange={(e) => updateAssets({ competitorUrls: e.target.value })}
              rows={3}
              hint="Used to identify category conventions, similarity risks, and white space."
            />
          </section>

          {/* Status */}
          {apiKey.trim() ? (
            <Card variant="subtle">
              <CardBody>
                <div className="flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-medium text-[#3D3B35]">Real extraction enabled</p>
                    <p className="text-xs text-[#6B6860] mt-0.5 leading-relaxed">
                      Claude will extract the Brand Brain directly from your uploaded content.
                      {!hasContent && ' Add at least one text field or PDF for best results.'}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card variant="subtle">
              <CardBody>
                <div className="flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-medium text-[#3D3B35]">Demo mode — sample data will load</p>
                    <p className="text-xs text-[#6B6860] mt-0.5 leading-relaxed">
                      Add an Anthropic API key above to extract from your actual brand materials.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          <div className="flex items-center gap-3">
            <Button onClick={handleStart}>
              {apiKey.trim() ? 'Run Brand MRI Scan' : 'Load Sample Data'}
            </Button>
            <Button variant="ghost" onClick={() => setStep('new-scan')}>
              Back
            </Button>
          </div>
        </div>
      </PageBody>
    </AppShell>
  )
}
