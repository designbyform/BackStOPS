/**
 * Real AI extraction using the Claude API.
 *
 * Called from Processing.tsx during the scan. The caller supplies an Anthropic
 * API key — no server required. All calls go directly from the browser to the
 * Anthropic API using the `anthropic-dangerous-direct-browser-access` header.
 *
 * To add server-side extraction later, replace callClaude() with a fetch to
 * your own endpoint that holds the key server-side.
 */

import type {
  BrandBrain,
  ProjectSetup,
  AssetInputs,
  ExtractedField,
  ExtractedListField,
  PersonalityTrait,
  DecisionRule,
  ConfidenceLevel,
} from '../types/brandBrain'

// ─── PDF text extraction (browser-side, best-effort) ─────────────────────────
// Works for unencrypted text-based PDFs. Falls back to empty string otherwise.

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer()
    const raw = new TextDecoder('latin1').decode(new Uint8Array(buffer))

    const blocks: string[] = []

    // Extract text between BT/ET markers
    const btEt = raw.match(/BT[\s\S]*?ET/g) ?? []
    for (const block of btEt) {
      const tj = (block.match(/\(([^)]*)\)\s*(?:Tj|')/g) ?? [])
        .map(m => m.replace(/^\(|\)\s*(?:Tj|')$/g, '').replace(/\\n/g, ' '))
        .join(' ')

      const tjArr = (block.match(/\[([^\]]*)\]\s*TJ/g) ?? [])
        .map(m => {
          const inner = m.replace(/^\[|\]\s*TJ$/g, '')
          return (inner.match(/\(([^)]*)\)/g) ?? [])
            .map(s => s.replace(/[()]/g, ''))
            .join('')
        })
        .join(' ')

      const combined = [tj, tjArr].filter(Boolean).join(' ').trim()
      if (combined.length > 5) blocks.push(combined)
    }

    const text = blocks.join('\n').replace(/\s{2,}/g, ' ').trim()
    return text.length > 50 ? text.slice(0, 10_000) : ''
  } catch {
    return ''
  }
}

// ─── Claude API call ──────────────────────────────────────────────────────────

async function callClaude(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = (err as { error?: { message?: string } }).error?.message ?? res.statusText
    throw new Error(`Claude API error ${res.status}: ${msg}`)
  }

  const data = await res.json() as { content: { type: string; text: string }[] }
  return data.content[0]?.text ?? ''
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(
  project: ProjectSetup,
  assets: AssetInputs,
  brandGuideText: string,
  pitchDeckText: string,
): string {
  const sections: string[] = []

  if (brandGuideText)              sections.push(`BRAND GUIDE:\n${brandGuideText}`)
  if (pitchDeckText)               sections.push(`PITCH DECK:\n${pitchDeckText}`)
  if (assets.socialExamples?.trim())    sections.push(`SOCIAL COPY EXAMPLES:\n${assets.socialExamples}`)
  if (assets.messagingExamples?.trim()) sections.push(`MESSAGING / WEBSITE COPY:\n${assets.messagingExamples}`)
  if (assets.visualNotes?.trim())       sections.push(`VISUAL NOTES:\n${assets.visualNotes}`)
  if (assets.competitorUrls?.trim())    sections.push(`COMPETITOR CONTEXT:\n${assets.competitorUrls}`)

  const materialsBlock = sections.length > 0
    ? sections.join('\n\n---\n\n')
    : 'No brand materials submitted — use company information only.'

  return `You are a brand intelligence analyst performing a structured Brand MRI extraction.

COMPANY:
- Name: ${project.companyName}
- Website: ${project.websiteUrl || 'Not provided'}
- Industry: ${project.industry || 'Not provided'}
- Stage: ${project.stage}
- Stated primary audience: ${project.primaryAudience || 'Not provided'}
- Notes: ${project.notes || 'None'}

BRAND MATERIALS:
${materialsBlock}

---

Extract a complete Brand Brain from these materials. Ground every field in the actual submitted content. Where evidence is thin, say so with a low confidence score. Do not fabricate specifics not present in or directly inferable from the materials.

Confidence scoring:
- 80–95 = Strong direct evidence in the materials
- 60–79 = Clear evidence with minor inference
- 40–59 = Partial evidence, significant inference
- 20–39 = Very little direct evidence
- 10–19 = Cannot determine — placeholder only

For source, name the specific material: "Social Examples", "Messaging", "Visual Notes", "Brand Guide", "Pitch Deck", or "Inferred".

Return ONLY a single valid JSON object — no markdown fences, no explanation. Exact schema:

{
  "strategicDNA": {
    "mission":              { "value": "", "confidence": 0, "source": "" },
    "vision":               { "value": "", "confidence": 0, "source": "" },
    "purpose":              { "value": "", "confidence": 0, "source": "" },
    "category":             { "value": "", "confidence": 0, "source": "" },
    "positioningStatement": { "value": "", "confidence": 0, "source": "" },
    "corePromise":          { "value": "", "confidence": 0, "source": "" },
    "primaryAudience":      { "value": "", "confidence": 0, "source": "" },
    "secondaryAudience":    { "value": "", "confidence": 0, "source": "" },
    "differentiators":      { "values": [], "confidence": 0, "source": "" },
    "proofPoints":          { "values": [], "confidence": 0, "source": "" },
    "marketContext":        { "value": "", "confidence": 0, "source": "" },
    "brandTension":         { "value": "", "confidence": 0, "source": "" }
  },
  "personalityModel": {
    "authority":      { "score": 50, "rationale": "", "confidence": 0 },
    "warmth":         { "score": 50, "rationale": "", "confidence": 0 },
    "technicalDepth": { "score": 50, "rationale": "", "confidence": 0 },
    "innovation":     { "score": 50, "rationale": "", "confidence": 0 },
    "playfulness":    { "score": 50, "rationale": "", "confidence": 0 },
    "sophistication": { "score": 50, "rationale": "", "confidence": 0 },
    "boldness":       { "score": 50, "rationale": "", "confidence": 0 },
    "clarity":        { "score": 50, "rationale": "", "confidence": 0 },
    "restraint":      { "score": 50, "rationale": "", "confidence": 0 },
    "emotionality":   { "score": 50, "rationale": "", "confidence": 0 }
  },
  "verbalSystem": {
    "voicePrinciples":    { "values": [], "confidence": 0, "source": "" },
    "toneAttributes":     { "values": [], "confidence": 0, "source": "" },
    "messagingHierarchy": { "values": [], "confidence": 0, "source": "" },
    "elevatorPitch":      { "value": "", "confidence": 0, "source": "" },
    "approvedVocabulary": { "values": [], "confidence": 0, "source": "" },
    "bannedVocabulary":   { "values": [], "confidence": 0, "source": "" },
    "repeatedPhrases":    { "values": [], "confidence": 0, "source": "" },
    "claimsToSupport":    { "values": [], "confidence": 0, "source": "" },
    "phrasesToAvoid":     { "values": [], "confidence": 0, "source": "" },
    "onBrandCopy":        { "value": "", "confidence": 0, "source": "" },
    "offBrandCopy":       { "value": "", "confidence": 0, "source": "" }
  },
  "visualSystem": {
    "colorLogic":                   { "value": "", "confidence": 0, "source": "" },
    "typographyLogic":              { "value": "", "confidence": 0, "source": "" },
    "layoutPrinciples":             { "value": "", "confidence": 0, "source": "" },
    "graphicMotifs":                { "value": "", "confidence": 0, "source": "" },
    "photographyStyle":             { "value": "", "confidence": 0, "source": "" },
    "illustrationStyle":            { "value": "", "confidence": 0, "source": "" },
    "iconographyStyle":             { "value": "", "confidence": 0, "source": "" },
    "motionPrinciples":             { "value": "", "confidence": 0, "source": "" },
    "dataVisualizationPrinciples":  { "value": "", "confidence": 0, "source": "" },
    "visualDensity":                { "value": "", "confidence": 0, "source": "" },
    "visualReferences":             { "values": [], "confidence": 0, "source": "" },
    "visualPatternsToAvoid":        { "values": [], "confidence": 0, "source": "" }
  },
  "decisionRules": {
    "rules": [
      { "rule": "", "whyItMatters": "", "exampleApplication": "", "confidence": 0 }
    ]
  },
  "competitiveContext": {
    "directCompetitors":            { "values": [], "confidence": 0, "source": "" },
    "adjacentCompetitors":          { "values": [], "confidence": 0, "source": "" },
    "categoryConventions":          { "values": [], "confidence": 0, "source": "" },
    "similarityRisks":              { "values": [], "confidence": 0, "source": "" },
    "whiteSpaceOpportunities":      { "values": [], "confidence": 0, "source": "" },
    "differentiationOpportunities": { "values": [], "confidence": 0, "source": "" }
  },
  "brandDiagnosis": {
    "messagingInconsistency": { "id": "messaging-inconsistency", "title": "Messaging Inconsistency",  "severity": "Low", "finding": "", "evidence": "", "recommendation": "" },
    "visualInconsistency":    { "id": "visual-inconsistency",    "title": "Visual Inconsistency",     "severity": "Low", "finding": "", "evidence": "", "recommendation": "" },
    "audienceClarity":        { "id": "audience-clarity",        "title": "Audience Clarity Issue",   "severity": "Low", "finding": "", "evidence": "", "recommendation": "" },
    "categoryConfusion":      { "id": "category-confusion",      "title": "Category Confusion",       "severity": "Low", "finding": "", "evidence": "", "recommendation": "" },
    "genericLanguageRisk":    { "id": "generic-language",        "title": "Generic Language Risk",    "severity": "Low", "finding": "", "evidence": "", "recommendation": "" },
    "trustGap":               { "id": "trust-gap",               "title": "Trust Gap",                "severity": "Low", "finding": "", "evidence": "", "recommendation": "" },
    "differentiationGap":     { "id": "differentiation-gap",     "title": "Differentiation Gap",      "severity": "Low", "finding": "", "evidence": "", "recommendation": "" }
  }
}

Now extract the Brand Brain for ${project.companyName}.`
}

// ─── Response → BrandBrain mapping ───────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toField(f: any, fallback = 'Not identified — add manually'): ExtractedField {
  const confidence: number = typeof f?.confidence === 'number' ? f.confidence : 20
  const confidenceLevel: ConfidenceLevel = confidence >= 75 ? 'high' : confidence >= 45 ? 'medium' : 'low'
  return {
    value: typeof f?.value === 'string' && f.value.trim() ? f.value : fallback,
    confidence,
    confidenceLevel,
    source: typeof f?.source === 'string' ? f.source : 'Extracted',
    needsReview: confidence < 60,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toListField(f: any): ExtractedListField {
  const confidence: number = typeof f?.confidence === 'number' ? f.confidence : 20
  const confidenceLevel: ConfidenceLevel = confidence >= 75 ? 'high' : confidence >= 45 ? 'medium' : 'low'
  return {
    values: Array.isArray(f?.values) ? (f.values as string[]).filter(Boolean) : [],
    confidence,
    confidenceLevel,
    source: typeof f?.source === 'string' ? f.source : 'Extracted',
    needsReview: confidence < 60,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTrait(t: any): PersonalityTrait {
  const confidence: number = typeof t?.confidence === 'number' ? t.confidence : 30
  const confidenceLevel: ConfidenceLevel = confidence >= 75 ? 'high' : confidence >= 45 ? 'medium' : 'low'
  return {
    score: typeof t?.score === 'number' ? Math.max(0, Math.min(100, t.score)) : 50,
    rationale: typeof t?.rationale === 'string' ? t.rationale : '',
    confidence,
    confidenceLevel,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRule(r: any): DecisionRule {
  const confidence: number = typeof r?.confidence === 'number' ? r.confidence : 40
  const confidenceLevel: ConfidenceLevel = confidence >= 75 ? 'high' : confidence >= 45 ? 'medium' : 'low'
  return {
    rule: r?.rule ?? '',
    whyItMatters: r?.whyItMatters ?? '',
    exampleApplication: r?.exampleApplication ?? '',
    confidence,
    confidenceLevel,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRawToBrandBrain(raw: any, project: ProjectSetup): BrandBrain {
  const s = raw.strategicDNA ?? {}
  const p = raw.personalityModel ?? {}
  const v = raw.verbalSystem ?? {}
  const vis = raw.visualSystem ?? {}
  const dr = raw.decisionRules ?? {}
  const cc = raw.competitiveContext ?? {}
  const bd = raw.brandDiagnosis ?? {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function diagCard(key: string, d: any, fallbackTitle: string) {
    return {
      id: d?.id ?? key,
      title: d?.title ?? fallbackTitle,
      severity: (['Low', 'Medium', 'High'].includes(d?.severity) ? d.severity : 'Low') as 'Low' | 'Medium' | 'High',
      finding: d?.finding ?? 'Not assessed — add manually.',
      evidence: d?.evidence ?? '',
      recommendation: d?.recommendation ?? '',
    }
  }

  return {
    project,
    generatedAt: new Date().toISOString(),
    isApproved: false,

    strategicDNA: {
      mission:              toField(s.mission),
      vision:               toField(s.vision),
      purpose:              toField(s.purpose),
      category:             toField(s.category),
      positioningStatement: toField(s.positioningStatement),
      corePromise:          toField(s.corePromise),
      primaryAudience:      toField(s.primaryAudience),
      secondaryAudience:    toField(s.secondaryAudience),
      differentiators:      toListField(s.differentiators),
      proofPoints:          toListField(s.proofPoints),
      marketContext:        toField(s.marketContext),
      brandTension:         toField(s.brandTension),
    },

    personalityModel: {
      authority:      toTrait(p.authority),
      warmth:         toTrait(p.warmth),
      technicalDepth: toTrait(p.technicalDepth),
      innovation:     toTrait(p.innovation),
      playfulness:    toTrait(p.playfulness),
      sophistication: toTrait(p.sophistication),
      boldness:       toTrait(p.boldness),
      clarity:        toTrait(p.clarity),
      restraint:      toTrait(p.restraint),
      emotionality:   toTrait(p.emotionality),
    },

    verbalSystem: {
      voicePrinciples:    toListField(v.voicePrinciples),
      toneAttributes:     toListField(v.toneAttributes),
      messagingHierarchy: toListField(v.messagingHierarchy),
      elevatorPitch:      toField(v.elevatorPitch),
      approvedVocabulary: toListField(v.approvedVocabulary),
      bannedVocabulary:   toListField(v.bannedVocabulary),
      repeatedPhrases:    toListField(v.repeatedPhrases),
      claimsToSupport:    toListField(v.claimsToSupport),
      phrasesToAvoid:     toListField(v.phrasesToAvoid),
      onBrandCopy:        toField(v.onBrandCopy),
      offBrandCopy:       toField(v.offBrandCopy),
    },

    visualSystem: {
      colorLogic:                  toField(vis.colorLogic),
      typographyLogic:             toField(vis.typographyLogic),
      layoutPrinciples:            toField(vis.layoutPrinciples),
      graphicMotifs:               toField(vis.graphicMotifs),
      photographyStyle:            toField(vis.photographyStyle),
      illustrationStyle:           toField(vis.illustrationStyle),
      iconographyStyle:            toField(vis.iconographyStyle),
      motionPrinciples:            toField(vis.motionPrinciples),
      dataVisualizationPrinciples: toField(vis.dataVisualizationPrinciples),
      visualDensity:               toField(vis.visualDensity),
      visualReferences:            toListField(vis.visualReferences),
      visualPatternsToAvoid:       toListField(vis.visualPatternsToAvoid),
    },

    decisionRules: {
      rules: Array.isArray(dr.rules) ? (dr.rules as unknown[]).map(toRule) : [],
    },

    competitiveContext: {
      directCompetitors:            toListField(cc.directCompetitors),
      adjacentCompetitors:          toListField(cc.adjacentCompetitors),
      categoryConventions:          toListField(cc.categoryConventions),
      similarityRisks:              toListField(cc.similarityRisks),
      whiteSpaceOpportunities:      toListField(cc.whiteSpaceOpportunities),
      differentiationOpportunities: toListField(cc.differentiationOpportunities),
    },

    brandDiagnosis: {
      messagingInconsistency: diagCard('messaging-inconsistency', bd.messagingInconsistency, 'Messaging Inconsistency'),
      visualInconsistency:    diagCard('visual-inconsistency',    bd.visualInconsistency,    'Visual Inconsistency'),
      audienceClarity:        diagCard('audience-clarity',        bd.audienceClarity,        'Audience Clarity Issue'),
      categoryConfusion:      diagCard('category-confusion',      bd.categoryConfusion,      'Category Confusion'),
      genericLanguageRisk:    diagCard('generic-language',        bd.genericLanguageRisk,    'Generic Language Risk'),
      trustGap:               diagCard('trust-gap',               bd.trustGap,               'Trust Gap'),
      differentiationGap:     diagCard('differentiation-gap',     bd.differentiationGap,     'Differentiation Gap'),
    },
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export type ExtractionProgress = (step: string, index: number) => void

export async function extractBrandBrain(
  project: ProjectSetup,
  assets: AssetInputs,
  apiKey: string,
  onProgress?: ExtractionProgress,
): Promise<BrandBrain> {
  onProgress?.('Reading uploaded files', 0)

  const brandGuideText = assets.brandGuidePdf
    ? await extractTextFromPDF(assets.brandGuidePdf)
    : ''
  const pitchDeckText = assets.pitchDeckPdf
    ? await extractTextFromPDF(assets.pitchDeckPdf)
    : ''

  onProgress?.('Sending to Claude for extraction', 1)

  const prompt = buildPrompt(project, assets, brandGuideText, pitchDeckText)
  const rawText = await callClaude(prompt, apiKey)

  onProgress?.('Parsing Brand Brain', 2)

  // Strip markdown fences if Claude wrapped the JSON
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    // If JSON is malformed, try to extract the JSON object with a regex
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Claude returned unparseable output. Try again or check your API key.')
    parsed = JSON.parse(match[0])
  }

  onProgress?.('Mapping to Brand Brain schema', 3)
  return mapRawToBrandBrain(parsed, project)
}
