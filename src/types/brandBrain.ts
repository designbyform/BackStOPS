// ─── Core primitives ─────────────────────────────────────────────────────────

export type ConfidenceLevel = 'high' | 'medium' | 'low'
export type SeverityLevel = 'Low' | 'Medium' | 'High'
export type CompanyStage =
  | 'Pre-seed'
  | 'Seed'
  | 'Series A'
  | 'Series B'
  | 'Growth'
  | 'Enterprise'
  | 'Other'

export interface ExtractedField {
  value: string
  confidence: number        // 0–100
  confidenceLevel: ConfidenceLevel
  source: string            // e.g. "Brand Guide", "Website", "Inferred"
  needsReview: boolean
}

export interface ExtractedListField {
  values: string[]
  confidence: number
  confidenceLevel: ConfidenceLevel
  source: string
  needsReview: boolean
}

// ─── Project setup ────────────────────────────────────────────────────────────

export interface ProjectSetup {
  id: string
  companyName: string
  websiteUrl: string
  industry: string
  stage: CompanyStage
  primaryAudience: string
  notes: string
  createdAt: string
}

// ─── Asset inputs ─────────────────────────────────────────────────────────────

export interface AssetInputs {
  brandGuidePdf: File | null
  pitchDeckPdf: File | null
  websiteUrl: string
  socialExamples: string
  messagingExamples: string
  visualNotes: string
  competitorUrls: string
}

// ─── A. Strategic DNA ─────────────────────────────────────────────────────────

export interface StrategicDNA {
  mission: ExtractedField
  vision: ExtractedField
  purpose: ExtractedField
  category: ExtractedField
  positioningStatement: ExtractedField
  corePromise: ExtractedField
  primaryAudience: ExtractedField
  secondaryAudience: ExtractedField
  differentiators: ExtractedListField
  proofPoints: ExtractedListField
  marketContext: ExtractedField
  brandTension: ExtractedField
}

// ─── B. Personality Model ─────────────────────────────────────────────────────

export interface PersonalityTrait {
  score: number             // 0–100
  rationale: string
  confidence: number
  confidenceLevel: ConfidenceLevel
}

export interface PersonalityModel {
  authority: PersonalityTrait
  warmth: PersonalityTrait
  technicalDepth: PersonalityTrait
  innovation: PersonalityTrait
  playfulness: PersonalityTrait
  sophistication: PersonalityTrait
  boldness: PersonalityTrait
  clarity: PersonalityTrait
  restraint: PersonalityTrait
  emotionality: PersonalityTrait
}

// ─── C. Verbal System ─────────────────────────────────────────────────────────

export interface VerbalSystem {
  voicePrinciples: ExtractedListField
  toneAttributes: ExtractedListField
  messagingHierarchy: ExtractedListField
  elevatorPitch: ExtractedField
  approvedVocabulary: ExtractedListField
  bannedVocabulary: ExtractedListField
  repeatedPhrases: ExtractedListField
  claimsToSupport: ExtractedListField
  phrasesToAvoid: ExtractedListField
  onBrandCopy: ExtractedField
  offBrandCopy: ExtractedField
}

// ─── D. Visual System ─────────────────────────────────────────────────────────

export interface VisualSystem {
  colorLogic: ExtractedField
  typographyLogic: ExtractedField
  layoutPrinciples: ExtractedField
  graphicMotifs: ExtractedField
  photographyStyle: ExtractedField
  illustrationStyle: ExtractedField
  iconographyStyle: ExtractedField
  motionPrinciples: ExtractedField
  dataVisualizationPrinciples: ExtractedField
  visualDensity: ExtractedField
  visualReferences: ExtractedListField
  visualPatternsToAvoid: ExtractedListField
}

// ─── E. Decision Rules ────────────────────────────────────────────────────────

export interface DecisionRule {
  rule: string
  whyItMatters: string
  exampleApplication: string
  confidence: number
  confidenceLevel: ConfidenceLevel
}

export interface DecisionRules {
  rules: DecisionRule[]
}

// ─── F. Competitive Context ───────────────────────────────────────────────────

export interface CompetitiveContext {
  directCompetitors: ExtractedListField
  adjacentCompetitors: ExtractedListField
  categoryConventions: ExtractedListField
  similarityRisks: ExtractedListField
  whiteSpaceOpportunities: ExtractedListField
  differentiationOpportunities: ExtractedListField
}

// ─── G. Brand Drift / Diagnosis ──────────────────────────────────────────────

export interface DiagnosticCard {
  id: string
  title: string
  severity: SeverityLevel
  finding: string
  evidence: string
  recommendation: string
}

export interface BrandDiagnosis {
  messagingInconsistency: DiagnosticCard
  visualInconsistency: DiagnosticCard
  audienceClarity: DiagnosticCard
  categoryConfusion: DiagnosticCard
  genericLanguageRisk: DiagnosticCard
  trustGap: DiagnosticCard
  differentiationGap: DiagnosticCard
}

// ─── Full Brand Brain ─────────────────────────────────────────────────────────

export interface BrandBrain {
  project: ProjectSetup
  strategicDNA: StrategicDNA
  personalityModel: PersonalityModel
  verbalSystem: VerbalSystem
  visualSystem: VisualSystem
  decisionRules: DecisionRules
  competitiveContext: CompetitiveContext
  brandDiagnosis: BrandDiagnosis
  generatedAt: string
  isApproved: boolean
}

// ─── Prompt Library ───────────────────────────────────────────────────────────

export type PromptCategory = 'writing' | 'strategy' | 'design' | 'critique'

export interface BrandPrompt {
  id: string
  title: string
  category: PromptCategory
  useCase: string
  prompt: string
  variables: string[]
}

export interface PromptLibrary {
  writing: BrandPrompt[]
  strategy: BrandPrompt[]
  design: BrandPrompt[]
  critique: BrandPrompt[]
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export interface ExportData {
  pdfReport: string
  claudeInstructions: string
  notionExport: string
  aiToolPack: string
}

// ─── App state ────────────────────────────────────────────────────────────────

export type AppStep =
  | 'landing'
  | 'new-scan'
  | 'upload-assets'
  | 'processing'
  | 'brand-brain'
  | 'diagnosis'
  | 'prompt-library'
  | 'exports'

export interface ScanStep {
  id: string
  label: string
  duration: number  // ms
}
