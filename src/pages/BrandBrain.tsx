import { useState } from 'react'
import { clsx } from 'clsx'
import { useBrandStore } from '../store/brandStore'
import { AppShell, PageHeader } from '../components/layout/AppShell'
import { EditableField, EditableListField } from '../components/brandBrain/EditableField'
import { TraitSlider } from '../components/brandBrain/TraitSlider'
import { DecisionRuleCard } from '../components/brandBrain/DecisionRuleCard'
import { Button } from '../components/ui/Button'
import type { DecisionRule } from '../types/brandBrain'

type SectionId = 'dna' | 'personality' | 'verbal' | 'visual' | 'rules' | 'competitive'

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'dna', label: 'Strategic DNA' },
  { id: 'personality', label: 'Personality' },
  { id: 'verbal', label: 'Verbal System' },
  { id: 'visual', label: 'Visual System' },
  { id: 'rules', label: 'Decision Rules' },
  { id: 'competitive', label: 'Competitive' },
]

export function BrandBrain() {
  const { brandBrain, approveBrandBrain, setStep, updateBrandBrainField } = useBrandStore()
  const [activeSection, setActiveSection] = useState<SectionId>('dna')

  if (!brandBrain) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-96">
          <p className="text-sm text-[#9C9A94]">No Brand Brain yet. Run a scan first.</p>
        </div>
      </AppShell>
    )
  }

  const { strategicDNA, personalityModel, verbalSystem, visualSystem, decisionRules, competitiveContext } = brandBrain

  function handleApprove() {
    approveBrandBrain()
    setStep('diagnosis')
  }

  function handleRuleUpdate(index: number, updated: DecisionRule) {
    const newRules = [...decisionRules.rules]
    newRules[index] = updated
    updateBrandBrainField('decisionRules.rules', newRules as unknown as string[])
  }

  // Count needs-review fields
  const reviewItems = [
    ...Object.values(strategicDNA).filter((f) => 'needsReview' in f && f.needsReview),
    ...Object.values(verbalSystem).filter((f) => 'needsReview' in f && f.needsReview),
    ...Object.values(visualSystem).filter((f) => 'needsReview' in f && f.needsReview),
  ].length

  return (
    <AppShell>
      <PageHeader
        title="Brand Brain"
        subtitle={`${brandBrain.project.companyName} — extracted ${new Date(brandBrain.generatedAt).toLocaleDateString()}`}
        actions={
          <div className="flex items-center gap-3">
            {reviewItems > 0 && (
              <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                {reviewItems} fields need review
              </span>
            )}
            {brandBrain.isApproved ? (
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
                Approved
              </span>
            ) : (
              <Button size="sm" onClick={handleApprove}>
                Approve & Continue
              </Button>
            )}
          </div>
        }
      />

      <div className="flex min-h-0">
        {/* Section tabs */}
        <div className="w-40 shrink-0 border-r border-[#E0DDD7] bg-[#F9F8F6] py-4">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={clsx(
                'w-full text-left px-4 py-2 text-sm transition-colors duration-100',
                activeSection === s.id
                  ? 'text-[#1A1916] font-medium bg-white border-r-2 border-[#1A1916]'
                  : 'text-[#6B6860] hover:text-[#1A1916] hover:bg-[#ECEAE5]'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto px-10 py-8">
          {activeSection === 'dna' && (
            <div className="max-w-3xl space-y-4">
              <SectionHeading title="Strategic DNA" description="The foundational strategic logic of the brand." />
              <EditableField label="Mission" field={strategicDNA.mission} path="strategicDNA.mission" multiline />
              <EditableField label="Vision" field={strategicDNA.vision} path="strategicDNA.vision" multiline />
              <EditableField label="Purpose" field={strategicDNA.purpose} path="strategicDNA.purpose" multiline />
              <EditableField label="Category" field={strategicDNA.category} path="strategicDNA.category" />
              <EditableField label="Positioning Statement" field={strategicDNA.positioningStatement} path="strategicDNA.positioningStatement" multiline rows={4} />
              <EditableField label="Core Promise" field={strategicDNA.corePromise} path="strategicDNA.corePromise" />
              <EditableField label="Primary Audience" field={strategicDNA.primaryAudience} path="strategicDNA.primaryAudience" multiline />
              <EditableField label="Secondary Audience" field={strategicDNA.secondaryAudience} path="strategicDNA.secondaryAudience" multiline />
              <EditableListField label="Differentiators" field={strategicDNA.differentiators} path="strategicDNA.differentiators" />
              <EditableListField label="Proof Points" field={strategicDNA.proofPoints} path="strategicDNA.proofPoints" />
              <EditableField label="Market Context" field={strategicDNA.marketContext} path="strategicDNA.marketContext" multiline rows={4} />
              <EditableField label="Brand Tension" field={strategicDNA.brandTension} path="strategicDNA.brandTension" multiline />
            </div>
          )}

          {activeSection === 'personality' && (
            <div className="max-w-3xl">
              <SectionHeading title="Personality Model" description="Brand traits on a 0–100 scale. Each score has a rationale and confidence level." />
              <div className="grid grid-cols-2 gap-3 mt-4">
                <TraitSlider label="Authority" trait={personalityModel.authority} path="personalityModel.authority" />
                <TraitSlider label="Warmth" trait={personalityModel.warmth} path="personalityModel.warmth" />
                <TraitSlider label="Technical Depth" trait={personalityModel.technicalDepth} path="personalityModel.technicalDepth" />
                <TraitSlider label="Innovation" trait={personalityModel.innovation} path="personalityModel.innovation" />
                <TraitSlider label="Playfulness" trait={personalityModel.playfulness} path="personalityModel.playfulness" />
                <TraitSlider label="Sophistication" trait={personalityModel.sophistication} path="personalityModel.sophistication" />
                <TraitSlider label="Boldness" trait={personalityModel.boldness} path="personalityModel.boldness" />
                <TraitSlider label="Clarity" trait={personalityModel.clarity} path="personalityModel.clarity" />
                <TraitSlider label="Restraint" trait={personalityModel.restraint} path="personalityModel.restraint" />
                <TraitSlider label="Emotionality" trait={personalityModel.emotionality} path="personalityModel.emotionality" />
              </div>
            </div>
          )}

          {activeSection === 'verbal' && (
            <div className="max-w-3xl space-y-4">
              <SectionHeading title="Verbal System" description="How the brand speaks — voice, vocabulary, messaging structure." />
              <EditableListField label="Voice Principles" field={verbalSystem.voicePrinciples} path="verbalSystem.voicePrinciples" />
              <EditableListField label="Tone Attributes" field={verbalSystem.toneAttributes} path="verbalSystem.toneAttributes" />
              <EditableListField label="Messaging Hierarchy" field={verbalSystem.messagingHierarchy} path="verbalSystem.messagingHierarchy" />
              <EditableField label="Elevator Pitch" field={verbalSystem.elevatorPitch} path="verbalSystem.elevatorPitch" multiline rows={4} />
              <EditableListField label="Approved Vocabulary" field={verbalSystem.approvedVocabulary} path="verbalSystem.approvedVocabulary" />
              <EditableListField label="Banned Vocabulary" field={verbalSystem.bannedVocabulary} path="verbalSystem.bannedVocabulary" />
              <EditableListField label="Repeated Phrases" field={verbalSystem.repeatedPhrases} path="verbalSystem.repeatedPhrases" />
              <EditableListField label="Claims to Support" field={verbalSystem.claimsToSupport} path="verbalSystem.claimsToSupport" />
              <EditableListField label="Phrases to Avoid" field={verbalSystem.phrasesToAvoid} path="verbalSystem.phrasesToAvoid" />
              <EditableField label="On-Brand Copy Example" field={verbalSystem.onBrandCopy} path="verbalSystem.onBrandCopy" multiline rows={4} />
              <EditableField label="Off-Brand Copy Example" field={verbalSystem.offBrandCopy} path="verbalSystem.offBrandCopy" multiline rows={4} />
            </div>
          )}

          {activeSection === 'visual' && (
            <div className="max-w-3xl space-y-4">
              <SectionHeading title="Visual System" description="The visual language of the brand — color, type, imagery, motion." />
              <EditableField label="Color Logic" field={visualSystem.colorLogic} path="visualSystem.colorLogic" multiline rows={4} />
              <EditableField label="Typography Logic" field={visualSystem.typographyLogic} path="visualSystem.typographyLogic" multiline rows={3} />
              <EditableField label="Layout Principles" field={visualSystem.layoutPrinciples} path="visualSystem.layoutPrinciples" multiline rows={3} />
              <EditableField label="Graphic Motifs" field={visualSystem.graphicMotifs} path="visualSystem.graphicMotifs" multiline />
              <EditableField label="Photography Style" field={visualSystem.photographyStyle} path="visualSystem.photographyStyle" multiline rows={3} />
              <EditableField label="Illustration Style" field={visualSystem.illustrationStyle} path="visualSystem.illustrationStyle" multiline />
              <EditableField label="Iconography Style" field={visualSystem.iconographyStyle} path="visualSystem.iconographyStyle" multiline />
              <EditableField label="Motion Principles" field={visualSystem.motionPrinciples} path="visualSystem.motionPrinciples" multiline />
              <EditableField label="Data Visualization Principles" field={visualSystem.dataVisualizationPrinciples} path="visualSystem.dataVisualizationPrinciples" multiline />
              <EditableField label="Visual Density" field={visualSystem.visualDensity} path="visualSystem.visualDensity" multiline />
              <EditableListField label="Visual References" field={visualSystem.visualReferences} path="visualSystem.visualReferences" />
              <EditableListField label="Visual Patterns to Avoid" field={visualSystem.visualPatternsToAvoid} path="visualSystem.visualPatternsToAvoid" />
            </div>
          )}

          {activeSection === 'rules' && (
            <div className="max-w-3xl">
              <SectionHeading title="Decision Rules" description="The operating principles that govern every brand decision." />
              <div className="mt-4 space-y-3">
                {decisionRules.rules.map((rule, i) => (
                  <DecisionRuleCard
                    key={rule.rule}
                    rule={rule}
                    index={i}
                    onUpdate={(updated) => handleRuleUpdate(i, updated)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeSection === 'competitive' && (
            <div className="max-w-3xl space-y-4">
              <SectionHeading title="Competitive Context" description="The competitive landscape and differentiation opportunities." />
              <EditableListField label="Direct Competitors" field={competitiveContext.directCompetitors} path="competitiveContext.directCompetitors" />
              <EditableListField label="Adjacent Competitors" field={competitiveContext.adjacentCompetitors} path="competitiveContext.adjacentCompetitors" />
              <EditableListField label="Category Conventions" field={competitiveContext.categoryConventions} path="competitiveContext.categoryConventions" />
              <EditableListField label="Similarity Risks" field={competitiveContext.similarityRisks} path="competitiveContext.similarityRisks" />
              <EditableListField label="White Space Opportunities" field={competitiveContext.whiteSpaceOpportunities} path="competitiveContext.whiteSpaceOpportunities" />
              <EditableListField label="Differentiation Opportunities" field={competitiveContext.differentiationOpportunities} path="competitiveContext.differentiationOpportunities" />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold text-[#1A1916]">{title}</h2>
      <p className="text-sm text-[#6B6860] mt-0.5">{description}</p>
    </div>
  )
}
