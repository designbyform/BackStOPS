/**
 * Mock Brand Brain for sample company: Meridian Health
 * This is the stub data layer. Replace generateBrandBrain() with real AI extraction
 * when connecting to Claude API or another extraction pipeline.
 */

import type {
  BrandBrain,
  ExtractedField,
  ExtractedListField,
  PersonalityTrait,
  DiagnosticCard,
  ProjectSetup,
  ConfidenceLevel,
} from '../types/brandBrain'

function field(
  value: string,
  confidence: number,
  source: string
): ExtractedField {
  const confidenceLevel: ConfidenceLevel =
    confidence >= 75 ? 'high' : confidence >= 45 ? 'medium' : 'low'
  return {
    value,
    confidence,
    confidenceLevel,
    source,
    needsReview: confidence < 60,
  }
}

function listField(
  values: string[],
  confidence: number,
  source: string
): ExtractedListField {
  const confidenceLevel: ConfidenceLevel =
    confidence >= 75 ? 'high' : confidence >= 45 ? 'medium' : 'low'
  return {
    values,
    confidence,
    confidenceLevel,
    source,
    needsReview: confidence < 60,
  }
}

function trait(
  score: number,
  rationale: string,
  confidence: number
): PersonalityTrait {
  const confidenceLevel: ConfidenceLevel =
    confidence >= 75 ? 'high' : confidence >= 45 ? 'medium' : 'low'
  return { score, rationale, confidence, confidenceLevel }
}

function card(
  id: string,
  title: string,
  severity: DiagnosticCard['severity'],
  finding: string,
  evidence: string,
  recommendation: string
): DiagnosticCard {
  return { id, title, severity, finding, evidence, recommendation }
}

export const SAMPLE_PROJECT: ProjectSetup = {
  id: 'meridian-001',
  companyName: 'Meridian Health',
  websiteUrl: 'https://meridianhealth.com',
  industry: 'Healthcare Technology',
  stage: 'Series A',
  primaryAudience: 'Health system administrators and clinical ops leads',
  notes: 'Preparing for a rebrand ahead of Series B fundraise.',
  createdAt: new Date().toISOString(),
}

export const SAMPLE_BRAND_BRAIN: BrandBrain = {
  project: SAMPLE_PROJECT,
  generatedAt: new Date().toISOString(),
  isApproved: false,

  strategicDNA: {
    mission: field(
      'Make clinical operations invisible so clinicians can focus entirely on patient care.',
      88,
      'Brand Guide'
    ),
    vision: field(
      'A world where the friction of healthcare administration is zero.',
      72,
      'Pitch Deck'
    ),
    purpose: field(
      'We exist to give time back to clinicians — the most valuable and scarce resource in healthcare.',
      65,
      'Website'
    ),
    category: field(
      'Clinical Operations Intelligence Platform',
      81,
      'Brand Guide'
    ),
    positioningStatement: field(
      'For health system operators who are drowning in administrative complexity, Meridian is the only platform that unifies scheduling, credentialing, and compliance into a single intelligent system — so your clinical team can spend less time managing and more time healing.',
      78,
      'Brand Guide'
    ),
    corePromise: field(
      'Operational clarity without compromise.',
      82,
      'Brand Guide'
    ),
    primaryAudience: field(
      'VP of Clinical Operations and COOs at mid-to-large health systems (250–2,000 beds)',
      85,
      'Pitch Deck'
    ),
    secondaryAudience: field(
      'CMOs and CNOs who sponsor technology decisions; department heads managing scheduling complexity',
      58,
      'Inferred'
    ),
    differentiators: listField(
      [
        'Unifies three historically siloed systems into one workflow',
        'Built by former clinical operators, not software engineers',
        'Configurable to existing EHR workflows — not a rip-and-replace',
        'Real-time compliance alerts tied to credentialing status',
        'Implementation in 60 days, not 18 months',
      ],
      79,
      'Pitch Deck'
    ),
    proofPoints: listField(
      [
        '34% reduction in scheduling errors at Northbridge Medical Center',
        'Deployed in 12 health systems across 6 states',
        'SOC 2 Type II certified',
        'Average implementation: 58 days',
        '$2.1M in recovered clinical hours annually per 500-bed facility',
      ],
      84,
      'Website'
    ),
    marketContext: field(
      'The clinical operations software market is dominated by legacy EHR vendors with bloated, disconnected toolsets. Health systems are exhausted by point solutions that don\'t talk to each other. AI-native platforms are emerging but most lack deep clinical workflow expertise.',
      71,
      'Pitch Deck'
    ),
    brandTension: field(
      'Between clinical warmth (we care about people) and operational precision (we are a serious enterprise platform). The brand must resolve this tension by being warm in intent, rigorous in capability.',
      55,
      'Inferred'
    ),
  },

  personalityModel: {
    authority: trait(
      82,
      'Speaks with the confidence of clinical operators who have lived the problem. Backed by outcomes data, not just features.',
      85
    ),
    warmth: trait(
      64,
      'Understands the human stakes of healthcare. References patients and clinicians with genuine empathy, not performative care language.',
      70
    ),
    technicalDepth: trait(
      75,
      'Comfortable with systems architecture conversations but never leads with tech specs to non-technical buyers.',
      78
    ),
    innovation: trait(
      68,
      'Positions as modern and forward-looking without overusing "AI-powered" or "next-generation" language.',
      65
    ),
    playfulness: trait(
      18,
      'Almost none. The category demands gravitas. Occasional dry wit in informal contexts only.',
      88
    ),
    sophistication: trait(
      77,
      'Premium positioning, institutional credibility, restraint over flair.',
      80
    ),
    boldness: trait(
      61,
      'Confident, direct claims — but backed by evidence. Not aggressive or provocative.',
      72
    ),
    clarity: trait(
      90,
      'The defining verbal trait. Every sentence earns its place. No jargon without reason.',
      92
    ),
    restraint: trait(
      84,
      'Does not oversell. Does not use hyperbole. Trusts the facts to carry weight.',
      87
    ),
    emotionality: trait(
      42,
      'Present but controlled. Acknowledges the human cost of operational failure without becoming sentimental.',
      68
    ),
  },

  verbalSystem: {
    voicePrinciples: listField(
      [
        'Lead with outcomes, not features',
        'Name the problem precisely before offering the solution',
        'Respect the intelligence of the buyer — no hand-holding',
        'Use clinical language correctly; earn the room',
        'Let data carry emotional weight',
      ],
      82,
      'Brand Guide'
    ),
    toneAttributes: listField(
      ['Precise', 'Assured', 'Empathetic', 'Substantive', 'Unhurried'],
      75,
      'Brand Guide'
    ),
    messagingHierarchy: listField(
      [
        'Primary: Clinical operations unified at last',
        'Secondary: Built by operators, for operators',
        'Tertiary: Compliance, scheduling, and credentialing in one place',
        'Supporting: Deployed in 60 days — not 18 months',
      ],
      77,
      'Brand Guide'
    ),
    elevatorPitch: field(
      'Meridian replaces the three or four disconnected systems your clinical ops team patches together every day — scheduling, credentialing, and compliance — with a single platform that actually talks to your EHR. Health systems that switch recover an average of two million dollars in clinical hours per year.',
      83,
      'Pitch Deck'
    ),
    approvedVocabulary: listField(
      [
        'clinical operations',
        'health system',
        'administrative burden',
        'clinical hours',
        'credentialing',
        'compliance',
        'workflow',
        'operational clarity',
        'implementation',
        'outcomes',
        'evidence',
      ],
      79,
      'Brand Guide'
    ),
    bannedVocabulary: listField(
      [
        'AI-powered (standalone)',
        'next-generation',
        'revolutionary',
        'game-changer',
        'seamless',
        'robust',
        'leverage',
        'synergy',
        'ecosystem (as buzzword)',
        'patient-centric (as standalone claim)',
      ],
      91,
      'Brand Guide'
    ),
    repeatedPhrases: listField(
      [
        '"operational clarity"',
        '"clinical hours recovered"',
        '"built by operators"',
        '"your existing EHR"',
        '"60 days"',
      ],
      74,
      'Website + Pitch Deck'
    ),
    claimsToSupport: listField(
      [
        'Reduces scheduling errors by 34%',
        'Implementation in 60 days',
        '$2.1M in recovered clinical hours annually per 500-bed facility',
        'SOC 2 Type II certified',
      ],
      88,
      'Website'
    ),
    phrasesToAvoid: listField(
      [
        '"We are passionate about..."',
        '"At Meridian, we believe..."',
        '"Our cutting-edge platform..."',
        '"Transforming healthcare"',
        '"Making healthcare better"',
      ],
      85,
      'Brand Guide'
    ),
    onBrandCopy: field(
      'Scheduling errors cost health systems more than time. They cost trust. Meridian surfaces conflicts before they become incidents — and gives your clinical ops team a single view to resolve them.',
      87,
      'Brand Guide'
    ),
    offBrandCopy: field(
      'We\'re passionate about revolutionizing healthcare with our cutting-edge, AI-powered platform that seamlessly integrates with your existing systems to deliver next-generation clinical outcomes!',
      92,
      'Brand Guide'
    ),
  },

  visualSystem: {
    colorLogic: field(
      'Primary: Deep navy (#0F1E3C) conveys institutional authority. Secondary: Warm slate (#6B7A8D) for supporting information. Accent: Clinical green (#2D6A4F) for positive states and data callouts. Background: Off-white (#F9F8F6) to avoid the sterility of pure white. Never use consumer health palette — no teal gradients, no wellness pastels.',
      76,
      'Brand Guide'
    ),
    typographyLogic: field(
      'Headlines: Editorial Serif (or equivalent) — conveys authority without stiffness. Body: Inter or system sans-serif for clarity and screen readability. Monospace: JetBrains Mono for data and code contexts. Type scale: Generous leading, conservative weight — never bold everything.',
      74,
      'Brand Guide'
    ),
    layoutPrinciples: field(
      'Information-dense layouts with clear visual hierarchy. Generous whitespace around key data points. Tables and structured data preferred over infographics. Grid-based, not freeform. Navigation stays predictable.',
      68,
      'Inferred'
    ),
    graphicMotifs: field(
      'Architectural line work — structural diagrams, system maps, workflow visualizations. No abstract blobs or gradient swooshes. Data visualization as primary visual language.',
      55,
      'Inferred'
    ),
    photographyStyle: field(
      'Real clinical environments. Actual healthcare workers in context — not stock photography smiles. Low-saturation editorial treatment. Documentary over lifestyle.',
      62,
      'Website'
    ),
    illustrationStyle: field(
      'Technical line illustration — system diagrams, workflow maps. Minimal color. No character illustration or isometric scenes. Precision over personality.',
      48,
      'Inferred'
    ),
    iconographyStyle: field(
      'Outlined, consistent stroke weight (1.5–2px). Medical and operational metaphors. No filled icons in primary UI contexts. No rounded-corner softening beyond functional necessity.',
      58,
      'Inferred'
    ),
    motionPrinciples: field(
      'Functional motion only. Data loading states, transition cues. No decorative animation. Easing: ease-out. Duration: 150–250ms for UI, 400–600ms for data reveals.',
      42,
      'Inferred'
    ),
    dataVisualizationPrinciples: field(
      'Data is the hero. Minimal chartjunk. Annotate directly. Dark gridlines only when necessary. Color-encode meaning, not decoration. Always include source and methodology.',
      71,
      'Website'
    ),
    visualDensity: field(
      'Medium-high. Respects the intelligence of operators who work with dense information systems daily. Not minimal-for-minimalism-sake, but never cluttered.',
      65,
      'Inferred'
    ),
    visualReferences: listField(
      [
        'Bloomberg Terminal (information density)',
        'New York Times data journalism (editorial data viz)',
        'Linear (UI precision)',
        'McKinsey reports (institutional authority)',
        'Stripe docs (technical clarity)',
      ],
      60,
      'Inferred'
    ),
    visualPatternsToAvoid: listField(
      [
        'Gradient hero backgrounds',
        'Rounded card stacks with drop shadows',
        'Wellness color palettes (teal, lavender, sage)',
        'Stock photography of smiling doctors',
        'Illustrated characters',
        'Bubbly or friendly iconography',
        'Animation-heavy landing pages',
      ],
      82,
      'Brand Guide'
    ),
  },

  decisionRules: {
    rules: [
      {
        rule: 'Prefer clarity over cleverness',
        whyItMatters:
          'Clinical buyers are time-poor and skeptical. A clever turn of phrase that requires decoding signals we value our own voice over their understanding.',
        exampleApplication:
          'Write "Reduces scheduling errors by 34%" not "Operational harmony at scale."',
        confidence: 91,
        confidenceLevel: 'high',
      },
      {
        rule: 'Prefer institutional trust over hype',
        whyItMatters:
          'Health system buyers have been burned by vendor promises. Credibility is earned through restraint, not amplified claims.',
        exampleApplication:
          'Lead with peer-reviewed outcomes data or named health system references, not category-level claims.',
        confidence: 88,
        confidenceLevel: 'high',
      },
      {
        rule: 'Prefer precision over personality',
        whyItMatters:
          'The category demands exactness. Approximate language signals imprecise thinking — which translates directly to product risk for buyers.',
        exampleApplication:
          'Say "58-day implementation average" not "fast implementation." Say "12 health systems" not "many customers."',
        confidence: 85,
        confidenceLevel: 'high',
      },
      {
        rule: 'Avoid overpromising',
        whyItMatters:
          'Clinical environments have real consequences. Overclaiming damages credibility immediately with buyers who have seen implementations fail.',
        exampleApplication:
          'Do not promise outcomes we cannot substantiate. Always qualify with conditions ("in facilities with 500+ beds").',
        confidence: 90,
        confidenceLevel: 'high',
      },
      {
        rule: 'Avoid category clichés',
        whyItMatters:
          'Healthcare tech is saturated with "patient-centered," "seamless," and "transforming care." These phrases are dismissed before they are processed.',
        exampleApplication:
          'Replace "transforming patient care" with the specific mechanism: "Recovers 2.1M in clinical hours annually per facility."',
        confidence: 87,
        confidenceLevel: 'high',
      },
      {
        rule: 'Respect the operator, not just the patient',
        whyItMatters:
          'The primary buyer is a clinical operator, not a patient. Content that speaks only to patient outcomes misses the actual decision-maker\'s needs.',
        exampleApplication:
          'Frame outcomes in operational terms first: cost, time, compliance risk — then connect to patient impact.',
        confidence: 80,
        confidenceLevel: 'high',
      },
    ],
  },

  competitiveContext: {
    directCompetitors: listField(
      ['Symplr', 'Qgenda', 'ShiftMed', 'API Healthcare', 'Intrigma'],
      75,
      'Pitch Deck'
    ),
    adjacentCompetitors: listField(
      [
        'Epic (scheduling modules)',
        'Workday Healthcare',
        'Salesforce Health Cloud',
        'ServiceNow Healthcare',
      ],
      68,
      'Pitch Deck'
    ),
    categoryConventions: listField(
      [
        'Feature-led marketing ("powerful," "flexible," "scalable")',
        'ROI calculators',
        'Compliance and certification badges',
        'Case study-heavy websites',
        'Conference-first brand presence',
      ],
      72,
      'Inferred'
    ),
    similarityRisks: listField(
      [
        'Visually similar to Symplr — both use navy + clinical green',
        'Messaging overlap with Qgenda on "scheduling simplified"',
        '"Unified platform" claim is shared by 4+ competitors',
        'SOC 2 badge used by all serious competitors — not a differentiator',
      ],
      65,
      'Inferred'
    ),
    whiteSpaceOpportunities: listField(
      [
        'No competitor leads with recovered clinical hours as primary metric',
        '"Built by operators" positioning is unoccupied',
        'Editorial / journalistic visual language is unused in category',
        'Implementation speed as brand pillar is underdeveloped industry-wide',
      ],
      58,
      'Inferred'
    ),
    differentiationOpportunities: listField(
      [
        'Operator credibility — build brand around clinical operations expertise',
        'Data storytelling — become the category\'s source of operational benchmarks',
        'Speed-to-value — own the 60-day implementation narrative explicitly',
        'Anti-category positioning — name what everyone else does wrong',
      ],
      61,
      'Inferred'
    ),
  },

  brandDiagnosis: {
    messagingInconsistency: card(
      'messaging-inconsistency',
      'Messaging Inconsistency',
      'Medium',
      'Core value proposition shifts between "unified platform" and "time recovery" depending on context. Neither message is consistently prioritized.',
      'Website homepage leads with "unified platform." Pitch deck leads with "recovered clinical hours." Sales one-pager uses "operational clarity." Three different primary claims across three surfaces.',
      'Establish a single primary claim and enforce it across all surfaces. Recommend: "Clinical hours recovered" as the measurable anchor.'
    ),
    visualInconsistency: card(
      'visual-inconsistency',
      'Visual Inconsistency',
      'High',
      'Visual language ranges from clinical precision (data dashboards, line work) to generic SaaS (gradient backgrounds, stock photography). The brand appears to have two different creative directions competing.',
      'Website header uses a gradient background with stock photography of a doctor smiling. The product screenshots show a rigorous, data-dense interface. These do not belong to the same brand.',
      'Align all marketing surfaces to the visual language of the product — dense, precise, editorial. Remove all consumer health visual codes.'
    ),
    audienceClarity: card(
      'audience-clarity',
      'Audience Clarity Issue',
      'Medium',
      'Content alternates between writing for clinical operators (COOs, VPs) and writing for clinicians themselves. These are different buyers with different motivations.',
      'Case studies address department heads but ROI framing targets finance. Feature descriptions are written for technical evaluators. No single piece of content speaks consistently to one buyer.',
      'Define a primary content persona (VP Clinical Operations) and write every piece of content for that person first. Secondary personas addressed in dedicated segments.'
    ),
    categoryConfusion: card(
      'category-confusion',
      'Category Confusion',
      'Low',
      'Category name "Clinical Operations Intelligence Platform" is accurate but may be unfamiliar to some buyers who search for "scheduling software" or "credentialing software."',
      'Category label used inconsistently across surfaces — sometimes "clinical ops platform," sometimes "healthcare operations software," sometimes "workforce management."',
      'Standardize category language. Consider whether to own the new category ("Clinical Operations Intelligence") or ride existing search categories while differentiating within them.'
    ),
    genericLanguageRisk: card(
      'generic-language',
      'Generic Language Risk',
      'High',
      'Multiple instances of banned vocabulary appear in live website copy: "seamless," "robust," "next-generation," "patient-centric." These undermine positioning precision.',
      'Homepage body copy: "Our seamless integration with your existing EHR..." and "robust compliance tools." About page: "patient-centric approach." These phrases appear verbatim in competitor copy.',
      'Conduct full copy audit against banned vocabulary list. Replace with specific, verifiable language. Every superlative must be replaced with a data point.'
    ),
    trustGap: card(
      'trust-gap',
      'Trust Gap',
      'Medium',
      'Evidence and proof points exist but are buried. The brand does not lead with credibility — it requires buyers to find it.',
      'Outcomes data ($2.1M, 34% error reduction, 58 days) appears only in a downloadable case study. Named health system references require form completion. Homepage leads with features, not outcomes.',
      'Surface the three strongest proof points on every primary surface. Gated case studies may be losing the most credible moments in the buyer journey.'
    ),
    differentiationGap: card(
      'differentiation-gap',
      'Differentiation Gap',
      'Medium',
      '"Built by operators" is the strongest differentiator but is underdeployed. It appears once in the About page and nowhere in primary messaging.',
      'Competitor analysis shows no competitor claims this positioning. Yet Meridian\'s own content buries it. The founding team\'s clinical operations backgrounds are mentioned only in team bios.',
      'Elevate "Built by operators" to a core messaging pillar. Feature the team\'s operational credentials in primary marketing, not just About pages.'
    ),
  },
}
