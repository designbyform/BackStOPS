import { useBrandStore } from '../store/brandStore'
import { AppShell, PageHeader, PageBody } from '../components/layout/AppShell'
import { Input, Select, Textarea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import type { CompanyStage } from '../types/brandBrain'

const STAGE_OPTIONS = [
  { value: 'Pre-seed', label: 'Pre-seed' },
  { value: 'Seed', label: 'Seed' },
  { value: 'Series A', label: 'Series A' },
  { value: 'Series B', label: 'Series B' },
  { value: 'Growth', label: 'Growth' },
  { value: 'Enterprise', label: 'Enterprise' },
  { value: 'Other', label: 'Other' },
]

export function NewScan() {
  const { project, updateProject, setStep } = useBrandStore()

  function handleNext() {
    if (!project.companyName.trim()) return
    updateProject({
      id: `scan-${Date.now()}`,
      createdAt: new Date().toISOString(),
    })
    setStep('upload-assets')
  }

  return (
    <AppShell>
      <PageHeader
        title="New Brand MRI Scan"
        subtitle="Tell us about the brand before we start scanning."
      />
      <PageBody>
        <div className="space-y-6 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input
                label="Company name"
                placeholder="Meridian Health"
                value={project.companyName}
                onChange={(e) => updateProject({ companyName: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Website URL"
                placeholder="https://example.com"
                type="url"
                value={project.websiteUrl}
                onChange={(e) => updateProject({ websiteUrl: e.target.value })}
              />
            </div>
            <Input
              label="Industry / Category"
              placeholder="Healthcare Technology"
              value={project.industry}
              onChange={(e) => updateProject({ industry: e.target.value })}
            />
            <Select
              label="Company stage"
              options={STAGE_OPTIONS}
              value={project.stage}
              onChange={(e) => updateProject({ stage: e.target.value as CompanyStage })}
            />
          </div>

          <Input
            label="Primary audience"
            placeholder="VP of Clinical Operations at mid-to-large health systems"
            value={project.primaryAudience}
            onChange={(e) => updateProject({ primaryAudience: e.target.value })}
            hint="Who is the primary buyer or user this brand speaks to?"
          />

          <Textarea
            label="Additional notes (optional)"
            placeholder="Preparing for Series B, recent rebrand, competitive positioning concerns..."
            value={project.notes}
            onChange={(e) => updateProject({ notes: e.target.value })}
            rows={3}
          />

          <div className="pt-2 flex items-center gap-3">
            <Button
              onClick={handleNext}
              disabled={!project.companyName.trim()}
            >
              Continue to Asset Upload
            </Button>
            <Button variant="ghost" onClick={() => setStep('landing')}>
              Back
            </Button>
          </div>
        </div>

        {/* Use sample company shortcut */}
        <div className="mt-10 pt-6 border-t border-[#E0DDD7]">
          <p className="text-xs text-[#9C9A94] mb-3">Or use sample data to preview the full experience:</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              updateProject({
                id: 'meridian-demo',
                companyName: 'Meridian Health',
                websiteUrl: 'https://meridianhealth.com',
                industry: 'Healthcare Technology',
                stage: 'Series A',
                primaryAudience: 'VP of Clinical Operations at mid-to-large health systems',
                notes: 'Preparing for Series B fundraise. Considering rebrand.',
                createdAt: new Date().toISOString(),
              })
              setStep('upload-assets')
            }}
          >
            Load Meridian Health sample
          </Button>
        </div>
      </PageBody>
    </AppShell>
  )
}
