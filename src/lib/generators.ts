/**
 * Generator functions for Brand Brain and all export formats.
 *
 * AI INTEGRATION POINT:
 * Replace generateBrandBrain() with a real extraction pipeline:
 *   1. Parse uploaded PDFs with a PDF-to-text library
 *   2. Scrape website URL content
 *   3. Send content to Claude API with a structured extraction prompt
 *   4. Map Claude's JSON response to the BrandBrain type
 *
 * The BrandBrain type is the contract. The source of data (mock vs real AI) is
 * swappable without touching any component downstream.
 */

import type {
  BrandBrain,
  BrandPrompt,
  PromptLibrary,
  ProjectSetup,
} from '../types/brandBrain'
import { SAMPLE_BRAND_BRAIN } from '../data/mockData'

// ─── Brand Brain generation ───────────────────────────────────────────────────

/**
 * AI INTEGRATION POINT: Replace this function body with real AI extraction.
 * Input: AssetInputs (PDFs, URLs, text)
 * Output: BrandBrain populated with confidence-scored extracted fields
 */
export function generateBrandBrain(project: ProjectSetup): BrandBrain {
  // Currently returns mock data — substitute AI-extracted output here
  return {
    ...SAMPLE_BRAND_BRAIN,
    project,
    generatedAt: new Date().toISOString(),
  }
}

// ─── Prompt Library generation ────────────────────────────────────────────────

/**
 * Generates a prompt library derived from the finalized Brand Brain.
 * Prompts dynamically reference extracted fields — not generic templates.
 *
 * AI INTEGRATION POINT: Claude could also generate additional prompts based
 * on observed brand patterns. The current implementation uses Brand Brain fields
 * as direct variable substitutions.
 */
export function generatePromptLibrary(brain: BrandBrain): PromptLibrary {
  const { project, strategicDNA, verbalSystem, visualSystem, personalityModel, decisionRules } = brain
  const company = project.companyName
  const audience = strategicDNA.primaryAudience.value
  const category = strategicDNA.category.value
  const positioning = strategicDNA.positioningStatement.value
  const corePromise = strategicDNA.corePromise.value
  const elevatorPitch = verbalSystem.elevatorPitch.value
  const toneAttrs = verbalSystem.toneAttributes.values.join(', ')
  const voicePrinciples = verbalSystem.voicePrinciples.values.join('\n- ')
  const bannedWords = verbalSystem.bannedVocabulary.values.join(', ')
  const phrasesToAvoid = verbalSystem.phrasesToAvoid.values.join('\n- ')
  const approvedWords = verbalSystem.approvedVocabulary.values.join(', ')
  const onBrand = verbalSystem.onBrandCopy.value
  const offBrand = verbalSystem.offBrandCopy.value
  const diff = strategicDNA.differentiators.values.slice(0, 3).join('; ')
  const proofs = strategicDNA.proofPoints.values.slice(0, 3).join('; ')
  const colorLogic = visualSystem.colorLogic.value
  const typography = visualSystem.typographyLogic.value
  const clarityScore = personalityModel.clarity.score
  const authorityScore = personalityModel.authority.score
  const rules = decisionRules.rules.map(r => `- ${r.rule}`).join('\n')

  const writing: BrandPrompt[] = [
    {
      id: 'write-homepage-headline',
      title: 'Homepage Headline',
      category: 'writing',
      useCase: 'Generate on-brand homepage headline options for the primary landing page.',
      prompt: `You are a brand strategist writing for ${company}, a ${category}.

Brand context:
- Core promise: ${corePromise}
- Primary audience: ${audience}
- Positioning: ${positioning}
- Top differentiators: ${diff}
- Proof points: ${proofs}

Voice: ${toneAttrs}
Voice principles:
- ${voicePrinciples}

Do not use these words or phrases: ${bannedWords}
Do not use these phrases:
- ${phrasesToAvoid}

On-brand example: "${onBrand}"
Off-brand example (avoid this register): "${offBrand}"

Write 5 homepage headline options. Each should:
1. Lead with an outcome or a precise problem statement
2. Be under 10 words
3. Require no explanation to understand
4. Avoid all superlatives unless backed by a specific number
5. Sound like it was written by a ${clarityScore > 80 ? 'precise, direct' : 'thoughtful'} expert — not a copywriter`,
      variables: ['company', 'category', 'corePromise', 'primaryAudience', 'differentiators', 'proofPoints'],
    },
    {
      id: 'write-linkedin-post',
      title: 'LinkedIn Post',
      category: 'writing',
      useCase: 'Write a LinkedIn post appropriate for the brand voice.',
      prompt: `Write a LinkedIn post for ${company}, a ${category}.

Brand voice: ${toneAttrs}
Primary audience: ${audience}

Voice rules:
- ${voicePrinciples}

Banned vocabulary: ${bannedWords}

The post should:
- Open with a specific insight, data point, or tension — not a question
- Be 150–250 words
- End with a conclusion or invitation, not a call to action
- Sound like a practitioner, not a marketer
- Reference real operational stakes in healthcare, not abstract benefits

Topic: [Insert topic here — e.g., scheduling errors, credentialing backlog, EHR fatigue]`,
      variables: ['company', 'category', 'toneAttributes', 'primaryAudience', 'voicePrinciples', 'bannedVocabulary'],
    },
    {
      id: 'write-founder-announcement',
      title: 'Founder Announcement',
      category: 'writing',
      useCase: 'Draft an on-brand founder announcement for funding, hires, or milestones.',
      prompt: `Write a founder announcement for ${company}.

Company: ${company}
Category: ${category}
Elevator pitch: ${elevatorPitch}

Voice: ${toneAttrs}
Voice principles:
- ${voicePrinciples}

Do not use: ${bannedWords}

The announcement should:
- Open by naming the problem or moment — not congratulating ourselves
- State the news clearly in the first paragraph
- Ground the milestone in outcomes for ${audience}
- Close with a forward-looking statement grounded in specificity
- Avoid corporate-speak and founder clichés ("humbled," "excited to announce," "thrilled")

Announcement type: [Insert: funding round / new hire / partnership / product milestone]
Amount or detail: [Insert specific detail]`,
      variables: ['company', 'category', 'elevatorPitch', 'toneAttributes', 'primaryAudience'],
    },
    {
      id: 'write-product-launch',
      title: 'Product Launch Copy',
      category: 'writing',
      useCase: 'Write copy for a new feature or product launch.',
      prompt: `Write launch copy for a new ${company} product or feature.

Brand positioning: ${positioning}
Core promise: ${corePromise}
Primary audience: ${audience}

Voice: ${toneAttrs}
Approved vocabulary: ${approvedWords}
Banned vocabulary: ${bannedWords}

Launch copy package needed:
1. One-sentence hook (under 15 words)
2. Three-sentence product description
3. Three key benefits (outcome-first, specific)
4. One supporting proof point or data reference
5. CTA (action-oriented, specific)

Feature/product being launched: [Insert feature name and description]
Key outcome it delivers: [Insert primary outcome with metric if available]`,
      variables: ['company', 'positioning', 'corePromise', 'primaryAudience', 'toneAttributes', 'approvedVocabulary', 'bannedVocabulary'],
    },
    {
      id: 'write-investor-update',
      title: 'Investor Update',
      category: 'writing',
      useCase: 'Draft a monthly or quarterly investor update email.',
      prompt: `Write a monthly investor update for ${company}.

Company: ${company}
Stage: ${project.stage}
Category: ${category}

Voice: Precise, assured, substantive. No hyperbole.
Proof points to reference: ${proofs}

Structure the update as:
1. Headline metric (1 sentence, specific number)
2. Key wins this period (3 bullet points with metrics)
3. What we learned (honest, specific)
4. What we're doing about it (specific)
5. Next month targets (3 specific, measurable goals)
6. Ask (if any)

Do not use: vague growth language, "traction," "momentum," "exciting"
Do use: specific numbers, named customers or segments, honest problem statements

Period: [Insert period]
Key metric: [Insert metric and direction]`,
      variables: ['company', 'stage', 'category', 'proofPoints'],
    },
    {
      id: 'write-email-campaign',
      title: 'Email Campaign',
      category: 'writing',
      useCase: 'Write a targeted email campaign for the primary audience.',
      prompt: `Write a 3-email nurture sequence for ${company} targeting ${audience}.

Brand voice: ${toneAttrs}
Core promise: ${corePromise}
Key differentiators: ${diff}
Proof points: ${proofs}

Voice rules:
- ${voicePrinciples}

Banned vocabulary: ${bannedWords}

Email 1 (Problem): Name the operational problem precisely. No solution yet.
Email 2 (Evidence): Present proof of the problem's cost. Reference real operational data.
Email 3 (Solution): Introduce ${company}'s approach. Lead with outcomes, not features.

Each email:
- Subject line: under 8 words, no exclamation points
- Opener: a specific insight or observation, not a greeting
- Body: 120–180 words
- Close: one clear next step

Campaign theme/trigger: [Insert theme — e.g., credentialing backlogs, scheduling errors, compliance season]`,
      variables: ['company', 'primaryAudience', 'toneAttributes', 'corePromise', 'differentiators', 'proofPoints', 'voicePrinciples', 'bannedVocabulary'],
    },
    {
      id: 'write-case-study-intro',
      title: 'Case Study Intro',
      category: 'writing',
      useCase: 'Write the opening section of a customer case study.',
      prompt: `Write the opening section of a ${company} case study.

Brand voice: ${toneAttrs}
Primary audience: ${audience}

The case study intro should:
- Open with the customer's problem, not the company name or product
- Quantify the problem if possible
- Establish the stakes (why this problem matters for patient care and operations)
- Introduce the customer by role and facility type — not by name first
- Be 120–180 words

Do not open with: "When [Customer] decided to..." or "[Customer] was looking for..."
Do not use: ${bannedWords}

Customer details:
- Facility type: [Insert: 500-bed regional health system / academic medical center / etc.]
- Problem: [Insert specific operational challenge]
- Outcome achieved: [Insert metric]`,
      variables: ['company', 'toneAttributes', 'primaryAudience', 'bannedVocabulary'],
    },
  ]

  const strategy: BrandPrompt[] = [
    {
      id: 'strategy-positioning-refinement',
      title: 'Positioning Refinement',
      category: 'strategy',
      useCase: 'Stress-test and refine the current positioning statement.',
      prompt: `You are a brand strategist. Review and refine the positioning statement for ${company}.

Current positioning:
"${positioning}"

Core promise: ${corePromise}
Primary audience: ${audience}
Key differentiators: ${diff}
Key proof points: ${proofs}

Evaluate the current positioning on:
1. Specificity — does it name a precise category and audience?
2. Differentiation — does it require ${company} to deliver it, or could any competitor claim it?
3. Credibility — is the promise achievable and provable?
4. Resonance — does it speak to the actual operational pain of ${audience}?

Then provide:
1. Diagnosis of current positioning (2–3 sentences)
2. Three alternative positioning statements to consider
3. Recommendation with rationale`,
      variables: ['company', 'positioning', 'corePromise', 'primaryAudience', 'differentiators', 'proofPoints'],
    },
    {
      id: 'strategy-category-narrative',
      title: 'Category Narrative',
      category: 'strategy',
      useCase: 'Develop a category narrative that frames the market on your terms.',
      prompt: `Develop a category narrative for ${company} in the ${category} space.

Company: ${company}
Category: ${category}
Market context: ${strategicDNA.marketContext.value}
Brand tension: ${strategicDNA.brandTension.value}
Differentiators: ${diff}

A category narrative should:
1. Name the old way (what the market was doing before / the broken status quo)
2. Name why it broke (the force that made the old way obsolete)
3. Name the new way (the category you're defining)
4. Establish the stakes (who wins and loses in this new world)
5. Position ${company} as the category leader — but through logic, not assertion

Write a 3-paragraph category narrative draft. Then provide a 2-sentence version for use in presentations.`,
      variables: ['company', 'category', 'marketContext', 'brandTension', 'differentiators'],
    },
    {
      id: 'strategy-audience-segmentation',
      title: 'Audience Segmentation',
      category: 'strategy',
      useCase: 'Develop detailed audience segments with messaging implications.',
      prompt: `Develop audience segmentation for ${company}.

Primary audience: ${audience}
Secondary audience: ${strategicDNA.secondaryAudience.value}
Category: ${category}
Core promise: ${corePromise}

For each segment, define:
1. Role and title
2. Primary operational problem they experience
3. How they measure success
4. Their biggest fear/risk in making a purchase decision
5. What they need to believe before they'll act
6. Message that will resonate vs. message that will alienate
7. Where they encounter ${company} (channel, context)

Then recommend:
- Which segment to prioritize and why
- What messaging adjustment is needed for each segment
- What proof point unlocks each segment`,
      variables: ['company', 'primaryAudience', 'secondaryAudience', 'category', 'corePromise'],
    },
    {
      id: 'strategy-competitive-differentiation',
      title: 'Competitive Differentiation',
      category: 'strategy',
      useCase: 'Map competitive landscape and sharpen differentiation.',
      prompt: `Map the competitive differentiation strategy for ${company}.

Direct competitors: ${brain.competitiveContext.directCompetitors.values.join(', ')}
Adjacent competitors: ${brain.competitiveContext.adjacentCompetitors.values.join(', ')}
Category conventions: ${brain.competitiveContext.categoryConventions.values.join('; ')}
Similarity risks: ${brain.competitiveContext.similarityRisks.values.join('; ')}
White space opportunities: ${brain.competitiveContext.whiteSpaceOpportunities.values.join('; ')}

Analyze:
1. What messages/claims are saturated in this category?
2. What visual and verbal territory is unclaimed?
3. Which white space opportunities are most defensible for ${company} specifically?
4. What would ${company} need to do to own that space credibly?

Deliver:
- Differentiation map (table format: us vs. them on 5 dimensions)
- 3 differentiation moves ranked by defensibility
- Anti-positioning statement (what we explicitly are NOT)`,
      variables: ['company', 'directCompetitors', 'adjacentCompetitors', 'categoryConventions', 'similarityRisks', 'whiteSpaceOpportunities'],
    },
    {
      id: 'strategy-messaging-hierarchy',
      title: 'Messaging Hierarchy',
      category: 'strategy',
      useCase: 'Build or refine a complete messaging hierarchy for the brand.',
      prompt: `Build a messaging hierarchy for ${company}.

Positioning: ${positioning}
Core promise: ${corePromise}
Differentiators: ${diff}
Proof points: ${proofs}
Primary audience: ${audience}

A messaging hierarchy defines what to say, in what order, and at what level of detail.

Deliver:
1. Primary message (the one claim that matters most — 1 sentence)
2. Three supporting messages (each substantiates the primary)
3. Three proof points for each supporting message
4. One-liner summary for each supporting message
5. Full elevator pitch (under 60 seconds, conversational)

Formatting note: each level should be shorter and more precise as you move up. Headlines earn their brevity. Details earn their depth.`,
      variables: ['company', 'positioning', 'corePromise', 'differentiators', 'proofPoints', 'primaryAudience'],
    },
  ]

  const design: BrandPrompt[] = [
    {
      id: 'design-visual-direction',
      title: 'Visual Direction Generation',
      category: 'design',
      useCase: 'Generate creative direction for a visual design project.',
      prompt: `Generate visual direction for a ${company} design project.

Brand visual system:
- Color logic: ${colorLogic}
- Typography: ${typography}
- Layout principles: ${visualSystem.layoutPrinciples.value}
- Photography style: ${visualSystem.photographyStyle.value}
- Visual density: ${visualSystem.visualDensity.value}
- Visual references: ${visualSystem.visualReferences.values.join(', ')}

Patterns to avoid: ${visualSystem.visualPatternsToAvoid.values.join('; ')}

Personality: Authority ${authorityScore}/100, Clarity ${clarityScore}/100, Restraint ${personalityModel.restraint.score}/100

For the following project, provide:
1. Creative direction statement (2–3 sentences)
2. Color application guidance
3. Typography approach
4. Imagery/photography direction
5. Layout guidance
6. What to avoid specifically for this project

Project: [Describe the design project — website, campaign, deck, etc.]
Key message to convey: [Insert message]`,
      variables: ['company', 'colorLogic', 'typographyLogic', 'layoutPrinciples', 'photographyStyle', 'visualDensity', 'visualReferences', 'visualPatternsToAvoid'],
    },
    {
      id: 'design-website-art-direction',
      title: 'Website Art Direction',
      category: 'design',
      useCase: 'Art direct a new website or website section.',
      prompt: `Provide art direction for a ${company} website redesign.

Visual system:
- Colors: ${colorLogic}
- Typography: ${typography}
- Density: ${visualSystem.visualDensity.value}
- Motifs: ${visualSystem.graphicMotifs.value}
- Photography: ${visualSystem.photographyStyle.value}

References: ${visualSystem.visualReferences.values.join(', ')}
Avoid: ${visualSystem.visualPatternsToAvoid.values.join('; ')}

Brand personality: Clarity ${clarityScore}/100, Authority ${authorityScore}/100, Sophistication ${personalityModel.sophistication.score}/100

Provide art direction for each of these sections:
1. Hero / Above the fold
2. Problem / Pain section
3. Solution / Product section
4. Proof / Social proof section
5. CTA / Bottom of page

For each section include:
- Layout structure
- Visual element guidance
- Color application
- Typography hierarchy
- What to avoid`,
      variables: ['company', 'colorLogic', 'typographyLogic', 'visualDensity', 'graphicMotifs', 'photographyStyle', 'visualReferences', 'visualPatternsToAvoid'],
    },
    {
      id: 'design-deck-guidance',
      title: 'Deck Design Guidance',
      category: 'design',
      useCase: 'Design a pitch deck, sales deck, or presentation.',
      prompt: `Provide design guidance for a ${company} presentation deck.

Visual system:
- Colors: ${colorLogic}
- Typography: ${typography}
- Data visualization: ${visualSystem.dataVisualizationPrinciples.value}
- Motion: ${visualSystem.motionPrinciples.value}

Deck type: [Insert: pitch deck / sales deck / product demo / board presentation]

Provide:
1. Slide template structure (master, title, content, data, quote, CTA)
2. Color application per slide type
3. Typography scale for this context
4. Data visualization style guide for this deck
5. Transition and animation guidance
6. Common deck design mistakes to avoid for this brand`,
      variables: ['company', 'colorLogic', 'typographyLogic', 'dataVisualizationPrinciples', 'motionPrinciples'],
    },
    {
      id: 'design-social-templates',
      title: 'Social Template Guidance',
      category: 'design',
      useCase: 'Design a social media template system.',
      prompt: `Design social media templates for ${company}.

Visual system:
- Colors: ${colorLogic}
- Typography: ${typography}
- Iconography: ${visualSystem.iconographyStyle.value}
- Patterns to avoid: ${visualSystem.visualPatternsToAvoid.values.slice(0, 4).join('; ')}

Brand personality: Clarity ${clarityScore}/100, Restraint ${personalityModel.restraint.score}/100, Sophistication ${personalityModel.sophistication.score}/100

Design template specifications for:
1. LinkedIn post (1200x627)
2. LinkedIn document cover
3. LinkedIn event cover
4. Instagram square (1080x1080)

For each template provide:
- Layout grid structure
- Text zone positions and hierarchy
- Color zone allocation
- Image/graphic zone
- Logo placement
- What content types each template is designed for`,
      variables: ['company', 'colorLogic', 'typographyLogic', 'iconographyStyle', 'visualPatternsToAvoid'],
    },
    {
      id: 'design-icon-illustration',
      title: 'Icon & Illustration Guidance',
      category: 'design',
      useCase: 'Define icon and illustration direction for the brand.',
      prompt: `Define icon and illustration direction for ${company}.

Current direction:
- Iconography: ${visualSystem.iconographyStyle.value}
- Illustration: ${visualSystem.illustrationStyle.value}
- Graphic motifs: ${visualSystem.graphicMotifs.value}

Brand personality: Technical depth ${personalityModel.technicalDepth.score}/100, Sophistication ${personalityModel.sophistication.score}/100, Playfulness ${personalityModel.playfulness.score}/100

Provide:
1. Icon design specification (stroke weight, corner radius, grid, naming conventions)
2. Icon set priorities (which categories to build first for this brand)
3. Illustration style guide (technique, color palette within visual system, use cases)
4. What types of illustration are off-brand and why
5. Reference examples that align with this direction`,
      variables: ['company', 'iconographyStyle', 'illustrationStyle', 'graphicMotifs'],
    },
  ]

  const critique: BrandPrompt[] = [
    {
      id: 'critique-landing-page',
      title: 'Critique This Landing Page',
      category: 'critique',
      useCase: 'Evaluate a landing page against the brand system.',
      prompt: `Critique a landing page against the ${company} brand system.

Brand standards:
- Core promise: ${corePromise}
- Voice: ${toneAttrs}
- Decision rules:
${rules}
- Banned vocabulary: ${bannedWords}
- Phrases to avoid:
- ${phrasesToAvoid}
- On-brand example: "${onBrand}"
- Off-brand example: "${offBrand}"

Evaluate the landing page on:
1. Messaging alignment (does it lead with outcome or feature?)
2. Voice compliance (are banned terms or phrases present?)
3. Audience specificity (does it speak to ${audience}?)
4. Proof point usage (are claims backed by evidence?)
5. Visual alignment (if describable)
6. Decision rule adherence

For each dimension, rate: On Brand / Needs Work / Off Brand
Provide specific, quoted examples from the page.
Recommend specific edits, not general guidance.

Landing page URL or content: [Paste URL or full text here]`,
      variables: ['company', 'corePromise', 'toneAttributes', 'decisionRules', 'bannedVocabulary', 'phrasesToAvoid', 'onBrandCopy', 'offBrandCopy', 'primaryAudience'],
    },
    {
      id: 'critique-pitch-deck',
      title: 'Critique This Pitch Deck',
      category: 'critique',
      useCase: 'Evaluate a pitch deck against brand positioning and voice standards.',
      prompt: `Critique a pitch deck against ${company}'s brand and positioning standards.

Brand positioning: ${positioning}
Core promise: ${corePromise}
Decision rules:
${rules}

Banned vocabulary: ${bannedWords}

Evaluate each section of the deck on:
1. Positioning alignment — does it reinforce or dilute the core positioning?
2. Claim specificity — are claims backed by data or vague?
3. Voice compliance — are banned terms or weak phrases present?
4. Audience focus — does it speak to investor needs while grounding in customer outcomes?
5. Category clarity — does it establish or confuse the category?

Provide:
- Overall brand alignment score (1–10)
- Top 3 strengths
- Top 3 issues with specific examples
- Priority edits (ordered by impact)

Deck content: [Paste slide text or describe each slide here]`,
      variables: ['company', 'positioning', 'corePromise', 'decisionRules', 'bannedVocabulary'],
    },
    {
      id: 'critique-copy-brand-fit',
      title: 'Check Copy for Brand Fit',
      category: 'critique',
      useCase: 'Quickly evaluate any copy against voice and messaging standards.',
      prompt: `Check the following copy for brand fit against ${company}'s voice standards.

Voice: ${toneAttrs}
Voice principles:
- ${voicePrinciples}

Banned vocabulary: ${bannedWords}
Phrases to avoid:
- ${phrasesToAvoid}

On-brand example: "${onBrand}"
Off-brand example: "${offBrand}"

For the submitted copy, provide:
1. Brand fit assessment: On Brand / Partially On Brand / Off Brand
2. Specific issues (quote the problem phrase and explain why)
3. Specific strengths (quote what works)
4. Revised version that keeps the intent but brings it on brand

Copy to evaluate:
[Paste copy here]`,
      variables: ['company', 'toneAttributes', 'voicePrinciples', 'bannedVocabulary', 'phrasesToAvoid', 'onBrandCopy', 'offBrandCopy'],
    },
    {
      id: 'critique-visual-direction',
      title: 'Check Visual Direction for Brand Fit',
      category: 'critique',
      useCase: 'Evaluate visual creative work against brand visual standards.',
      prompt: `Evaluate visual direction against ${company}'s visual brand system.

Visual standards:
- Color logic: ${colorLogic}
- Typography: ${typography}
- Photography style: ${visualSystem.photographyStyle.value}
- Layout principles: ${visualSystem.layoutPrinciples.value}
- Patterns to avoid: ${visualSystem.visualPatternsToAvoid.values.join('; ')}

Brand personality expressed visually: Clarity ${clarityScore}/100, Authority ${authorityScore}/100, Sophistication ${personalityModel.sophistication.score}/100, Restraint ${personalityModel.restraint.score}/100

Evaluate on:
1. Color application (correct palette and usage rules?)
2. Typography (correct typeface, scale, weight usage?)
3. Photography/imagery (aligned with editorial, non-stock direction?)
4. Layout (information density appropriate? grid-based?)
5. Off-brand elements (any visual codes from the avoid list?)

Verdict for each dimension: On Brand / Needs Work / Off Brand
Specific recommendations with rationale.

Creative to evaluate: [Describe the visual or paste image reference]`,
      variables: ['company', 'colorLogic', 'typographyLogic', 'photographyStyle', 'layoutPrinciples', 'visualPatternsToAvoid'],
    },
    {
      id: 'critique-off-brand-elements',
      title: 'Identify Off-Brand Elements',
      category: 'critique',
      useCase: 'Scan any asset for off-brand elements across copy and visual.',
      prompt: `Scan for off-brand elements in ${company} assets.

Brand standards (complete):

VOICE:
- Tone: ${toneAttrs}
- Banned vocabulary: ${bannedWords}
- Phrases to avoid: ${phrasesToAvoid}

VISUAL:
- Patterns to avoid: ${visualSystem.visualPatternsToAvoid.values.join('; ')}

DECISION RULES:
${rules}

Perform a full brand compliance audit on the submitted asset:
1. List every off-brand verbal element (quote directly, explain why)
2. List every off-brand visual element (describe specifically)
3. Rate overall brand compliance: Compliant / Partially Compliant / Non-Compliant
4. Priority order for remediation (what to fix first)
5. Quick fixes vs. requires redesign

Asset to audit: [Describe or paste asset content here]`,
      variables: ['company', 'toneAttributes', 'bannedVocabulary', 'phrasesToAvoid', 'visualPatternsToAvoid', 'decisionRules'],
    },
  ]

  return { writing, strategy, design, critique }
}

// ─── Export generators ────────────────────────────────────────────────────────

export function generateClaudeExport(brain: BrandBrain): string {
  const { project, strategicDNA, verbalSystem, visualSystem, decisionRules, personalityModel } = brain

  return `# ${project.companyName} — Claude Project Instructions
*Generated by Brand MRI | ${new Date(brain.generatedAt).toLocaleDateString()}*

---

## Company Context

**Company:** ${project.companyName}
**Category:** ${strategicDNA.category.value}
**Stage:** ${project.stage}
**Primary audience:** ${strategicDNA.primaryAudience.value}
**Secondary audience:** ${strategicDNA.secondaryAudience.value}

**Core promise:** ${strategicDNA.corePromise.value}

**Positioning:**
${strategicDNA.positioningStatement.value}

**Elevator pitch:**
${verbalSystem.elevatorPitch.value}

---

## Brand DNA

**Mission:** ${strategicDNA.mission.value}

**Vision:** ${strategicDNA.vision.value}

**Key differentiators:**
${strategicDNA.differentiators.values.map(d => `- ${d}`).join('\n')}

**Proof points:**
${strategicDNA.proofPoints.values.map(p => `- ${p}`).join('\n')}

**Market context:**
${strategicDNA.marketContext.value}

---

## Voice Rules

**Tone attributes:** ${verbalSystem.toneAttributes.values.join(', ')}

**Voice principles:**
${verbalSystem.voicePrinciples.values.map(p => `- ${p}`).join('\n')}

**Messaging hierarchy:**
${verbalSystem.messagingHierarchy.values.map((m, i) => `${i + 1}. ${m}`).join('\n')}

**On-brand example:**
> ${verbalSystem.onBrandCopy.value}

**Off-brand example (avoid this register):**
> ${verbalSystem.offBrandCopy.value}

---

## Vocabulary Rules

**Approved vocabulary:** ${verbalSystem.approvedVocabulary.values.join(', ')}

**Banned vocabulary — never use these words or phrases:**
${verbalSystem.bannedVocabulary.values.map(w => `- ${w}`).join('\n')}

**Phrases to avoid:**
${verbalSystem.phrasesToAvoid.values.map(p => `- ${p}`).join('\n')}

**Claims that require supporting evidence:**
${verbalSystem.claimsToSupport.values.map(c => `- ${c}`).join('\n')}

---

## Visual Rules

When advising on design or describing visuals:

**Color:** ${visualSystem.colorLogic.value}

**Typography:** ${visualSystem.typographyLogic.value}

**Photography:** ${visualSystem.photographyStyle.value}

**Visual patterns to avoid:**
${visualSystem.visualPatternsToAvoid.values.map(p => `- ${p}`).join('\n')}

---

## Decision Rules

When making any brand decision or helping with ${project.companyName} content:

${decisionRules.rules.map(r => `**${r.rule}**\n${r.whyItMatters}\nExample: ${r.exampleApplication}`).join('\n\n')}

---

## Personality Calibration

When writing for ${project.companyName}, calibrate your output to these trait levels (0 = none, 100 = extreme):

- Authority: ${personalityModel.authority.score}/100 — ${personalityModel.authority.rationale}
- Warmth: ${personalityModel.warmth.score}/100 — ${personalityModel.warmth.rationale}
- Clarity: ${personalityModel.clarity.score}/100 — ${personalityModel.clarity.rationale}
- Restraint: ${personalityModel.restraint.score}/100 — ${personalityModel.restraint.rationale}
- Playfulness: ${personalityModel.playfulness.score}/100 — ${personalityModel.playfulness.rationale}

---

## How to Behave When Helping With This Brand

1. **Default to precision.** Name specific numbers, specific roles, specific outcomes. Never approximate when a specific is available.
2. **Lead with outcomes.** Start with what the customer gains, not what the product does.
3. **Reject banned vocabulary immediately.** If asked to write copy containing banned words, rewrite without them and explain briefly.
4. **Treat silence as restraint.** When in doubt, say less. Short, earned sentences over comprehensive coverage.
5. **Speak to the operator.** The primary audience is a VP or COO of a health system — not a patient, not a clinician. Frame everything in operational and financial terms first.
6. **Never overclaim.** If a claim lacks a specific supporting data point, flag it rather than assert it.
7. **On-brand critique mode:** When asked to review copy or creative, apply the decision rules and vocabulary rules systematically before offering suggestions.
`
}

export function generateNotionExport(brain: BrandBrain): string {
  const { project, strategicDNA, verbalSystem, visualSystem, decisionRules, competitiveContext, brandDiagnosis } = brain

  return `# ${project.companyName} Brand Brain
> Generated by Brand MRI | ${new Date(brain.generatedAt).toLocaleDateString()}

---

## 🧬 Brand DNA

### Strategic Foundation

| Field | Value |
|-------|-------|
| Mission | ${strategicDNA.mission.value} |
| Vision | ${strategicDNA.vision.value} |
| Purpose | ${strategicDNA.purpose.value} |
| Category | ${strategicDNA.category.value} |
| Core Promise | ${strategicDNA.corePromise.value} |
| Brand Tension | ${strategicDNA.brandTension.value} |

### Positioning Statement

> ${strategicDNA.positioningStatement.value}

### Audience

**Primary:** ${strategicDNA.primaryAudience.value}

**Secondary:** ${strategicDNA.secondaryAudience.value}

### Differentiators

${strategicDNA.differentiators.values.map(d => `- ${d}`).join('\n')}

### Proof Points

${strategicDNA.proofPoints.values.map(p => `- ${p}`).join('\n')}

---

## 💬 Messaging Database

### Elevator Pitch

${verbalSystem.elevatorPitch.value}

### Voice Principles

${verbalSystem.voicePrinciples.values.map((p, i) => `${i + 1}. ${p}`).join('\n')}

### Tone Attributes

${verbalSystem.toneAttributes.values.map(t => `- ${t}`).join('\n')}

### Messaging Hierarchy

${verbalSystem.messagingHierarchy.values.map((m, i) => `${i + 1}. ${m}`).join('\n')}

### Vocabulary

**Approved:** ${verbalSystem.approvedVocabulary.values.join(', ')}

**Banned:** ${verbalSystem.bannedVocabulary.values.join(', ')}

**Phrases to avoid:**
${verbalSystem.phrasesToAvoid.values.map(p => `- ${p}`).join('\n')}

### Copy Examples

**✅ On-brand:**
> ${verbalSystem.onBrandCopy.value}

**❌ Off-brand:**
> ${verbalSystem.offBrandCopy.value}

---

## 🎨 Visual System

| Element | Direction |
|---------|-----------|
| Colors | ${visualSystem.colorLogic.value} |
| Typography | ${visualSystem.typographyLogic.value} |
| Photography | ${visualSystem.photographyStyle.value} |
| Illustration | ${visualSystem.illustrationStyle.value} |
| Iconography | ${visualSystem.iconographyStyle.value} |
| Layout | ${visualSystem.layoutPrinciples.value} |
| Motion | ${visualSystem.motionPrinciples.value} |
| Data Viz | ${visualSystem.dataVisualizationPrinciples.value} |
| Visual Density | ${visualSystem.visualDensity.value} |

### Visual References

${visualSystem.visualReferences.values.map(r => `- ${r}`).join('\n')}

### Patterns to Avoid

${visualSystem.visualPatternsToAvoid.values.map(p => `- ❌ ${p}`).join('\n')}

---

## 📋 Decision Rules

${decisionRules.rules.map(r => `### ${r.rule}

**Why it matters:** ${r.whyItMatters}

**Example:** ${r.exampleApplication}
`).join('\n')}

---

## 🏆 Competitive Context

### Direct Competitors

${competitiveContext.directCompetitors.values.map(c => `- ${c}`).join('\n')}

### Adjacent Competitors

${competitiveContext.adjacentCompetitors.values.map(c => `- ${c}`).join('\n')}

### White Space Opportunities

${competitiveContext.whiteSpaceOpportunities.values.map(o => `- ${o}`).join('\n')}

### Differentiation Opportunities

${competitiveContext.differentiationOpportunities.values.map(o => `- ${o}`).join('\n')}

---

## 🔬 Brand Diagnosis

${Object.values(brandDiagnosis).map(card => `### ${card.title}

**Severity:** ${card.severity}

**Finding:** ${card.finding}

**Evidence:** ${card.evidence}

**Recommendation:** ${card.recommendation}
`).join('\n')}

---

## 📚 Asset References

- Brand Guide: [Upload link]
- Pitch Deck: [Upload link]
- Website: ${project.websiteUrl}

---

## ❓ Open Questions

- [ ] Confirm primary audience definition with sales team
- [ ] Validate proof points with customer data
- [ ] Review banned vocabulary list with content team
- [ ] Confirm visual references with design team
- [ ] Validate competitive analysis with strategy team
`
}

export function generatePDFReportData(brain: BrandBrain): string {
  const { project, strategicDNA, personalityModel, verbalSystem, visualSystem, decisionRules, brandDiagnosis } = brain

  const highSeverityCount = Object.values(brandDiagnosis).filter(c => c.severity === 'High').length
  const mediumSeverityCount = Object.values(brandDiagnosis).filter(c => c.severity === 'Medium').length

  return `BRAND MRI INTELLIGENCE REPORT
${project.companyName}
Generated ${new Date(brain.generatedAt).toLocaleDateString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTIVE SUMMARY

This Brand MRI report presents a structured analysis of ${project.companyName}'s current brand system — including strategic positioning, verbal identity, visual language, and competitive standing.

The scan identified ${highSeverityCount} high-severity issue${highSeverityCount !== 1 ? 's' : ''} and ${mediumSeverityCount} medium-severity finding${mediumSeverityCount !== 1 ? 's' : ''} requiring attention.

Company: ${project.companyName}
Category: ${strategicDNA.category.value}
Stage: ${project.stage}
Industry: ${project.industry}

Core Promise: ${strategicDNA.corePromise.value}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A. STRATEGIC DNA

Mission
${strategicDNA.mission.value}
[Confidence: ${strategicDNA.mission.confidence}% | Source: ${strategicDNA.mission.source}]

Vision
${strategicDNA.vision.value}
[Confidence: ${strategicDNA.vision.confidence}% | Source: ${strategicDNA.vision.source}]

Positioning Statement
${strategicDNA.positioningStatement.value}

Primary Audience
${strategicDNA.primaryAudience.value}

Differentiators
${strategicDNA.differentiators.values.map((d, i) => `${i + 1}. ${d}`).join('\n')}

Proof Points
${strategicDNA.proofPoints.values.map((p, i) => `${i + 1}. ${p}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

B. PERSONALITY MODEL

${Object.entries(personalityModel).map(([key, trait]) => {
  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
  const bar = '█'.repeat(Math.round(trait.score / 10)) + '░'.repeat(10 - Math.round(trait.score / 10))
  return `${label.padEnd(20)} ${bar} ${trait.score}/100\n${trait.rationale}`
}).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

C. VERBAL SYSTEM

Voice Principles
${verbalSystem.voicePrinciples.values.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Tone Attributes
${verbalSystem.toneAttributes.values.join(' · ')}

Elevator Pitch
${verbalSystem.elevatorPitch.value}

Banned Vocabulary
${verbalSystem.bannedVocabulary.values.join(', ')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

D. VISUAL SYSTEM

Color Logic
${visualSystem.colorLogic.value}

Typography Logic
${visualSystem.typographyLogic.value}

Photography Style
${visualSystem.photographyStyle.value}

Visual Patterns to Avoid
${visualSystem.visualPatternsToAvoid.values.map(p => `- ${p}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

E. DECISION RULES

${decisionRules.rules.map(r => `RULE: ${r.rule}
Why: ${r.whyItMatters}
Example: ${r.exampleApplication}
Confidence: ${r.confidence}%`).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

F. BRAND DRIFT FINDINGS

${Object.values(brandDiagnosis).map(card => `[${card.severity.toUpperCase()}] ${card.title}

Finding: ${card.finding}

Evidence: ${card.evidence}

Recommendation: ${card.recommendation}`).join('\n\n─────────────────────────────────────────────────\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

G. RECOMMENDED NEXT STEPS

1. Address high-severity findings immediately — ${Object.values(brandDiagnosis).filter(c => c.severity === 'High').map(c => c.title).join(', ')}
2. Conduct a full copy audit across all digital surfaces against the banned vocabulary list
3. Establish single primary claim and enforce across all surfaces
4. Elevate "Built by operators" to core messaging pillar in all primary marketing
5. Align marketing visual language with product UI visual language
6. Commission editorial photography shoot to replace stock photography
7. Develop a category narrative that defines the Clinical Operations Intelligence space on your terms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated by Brand MRI | Form Brand Intelligence Platform
This report is a starting point. Every field is editable and should reflect your own judgment.
`
}

export function generateAIToolPack(brain: BrandBrain): string {
  const { project, strategicDNA, verbalSystem, decisionRules } = brain
  const company = project.companyName
  const category = strategicDNA.category.value
  const promise = strategicDNA.corePromise.value
  const tone = verbalSystem.toneAttributes.values.join(', ')
  const banned = verbalSystem.bannedVocabulary.values.join(', ')
  const voice = verbalSystem.voicePrinciples.values.map(p => `- ${p}`).join('\n')
  const rules = decisionRules.rules.map(r => `- ${r.rule}`).join('\n')
  const audience = strategicDNA.primaryAudience.value

  return `# ${company} — AI Tool Instruction Pack
Generated by Brand MRI | ${new Date(brain.generatedAt).toLocaleDateString()}

Copy the relevant block into each tool.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## CLAUDE (Project Instructions)

You are a brand assistant for ${company}, a ${category}.

Core promise: ${promise}
Primary audience: ${audience}
Tone: ${tone}

Voice rules:
${voice}

Never use: ${banned}

Decision rules:
${rules}

Always lead with outcomes. Always be precise. Never overpromise.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## CHATGPT (Custom Instructions)

What would you like ChatGPT to know about you:
I need help with brand communications for ${company}, a ${category} that serves ${audience}.

Our core promise is: ${promise}

Our tone is: ${tone}

How would you like ChatGPT to respond:
- Lead with outcomes, not features
- Use precise, specific language — never approximate
- Never use these words: ${banned}
- Apply decision rules: ${rules}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## FIGMA AI / FIGMA MAKE

Brand context for ${company}:

Category: ${category}
Promise: ${promise}
Visual personality: Authority-led, editorial precision, institutional credibility

Color: ${brain.visualSystem.colorLogic.value}
Typography: ${brain.visualSystem.typographyLogic.value}

Avoid: ${brain.visualSystem.visualPatternsToAvoid.values.slice(0, 4).join(', ')}

Design for: ${audience}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## CLAUDE CODE (CLAUDE.md)

# ${company} Brand Standards

This project builds for ${company}, a ${category}.

## Writing Rules
- Tone: ${tone}
- Never use: ${banned}
- Lead with outcomes

## UI Copy Guidelines
- Use approved vocabulary: ${verbalSystem.approvedVocabulary.values.join(', ')}
- Avoid consumer health visual language in UI text
- Address the operator role (VP, COO) not patients

## Decision Rules
${rules}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## V0 (Vercel v0)

Build UI for ${company}, a ${category}.

Visual direction:
- ${brain.visualSystem.colorLogic.value}
- ${brain.visualSystem.typographyLogic.value}
- ${brain.visualSystem.layoutPrinciples.value}

Avoid: ${brain.visualSystem.visualPatternsToAvoid.values.slice(0, 3).join('; ')}

The UI should feel institutional and precise — not consumer health or startup-casual.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## CURSOR (Rules for AI)

# ${company} project — brand-aware coding

When generating UI copy, error messages, or any user-facing text:
- Tone: ${tone}
- Never use: ${banned}
- Address: ${audience}

When generating UI components:
- Follow ${company} visual system (institutional, editorial, precise)
- Avoid: ${brain.visualSystem.visualPatternsToAvoid.values.slice(0, 3).join(', ')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## LOVABLE

Build for ${company}.

Brand: ${category} | Promise: ${promise}

Visual: Institutional precision. No consumer health palettes. Editorial typography.
Colors: ${brain.visualSystem.colorLogic.value}

Tone for all UI copy: ${tone}
Avoid in UI text: ${banned}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## DECK GENERATION (Beautiful.ai / Gamma / Tome)

Deck brand context for ${company}:

Company: ${company} | Category: ${category}
Promise: ${promise}

Visual direction:
- Colors: Deep navy, warm slate, clinical green accents, off-white background
- Typography: Editorial serif headlines, clean sans body
- Data viz: Minimal chartjunk, direct annotation, high information density
- Images: Editorial photography of real clinical environments (not stock)
- Avoid: Gradient backgrounds, rounded cards, infographic excess

Tone: ${tone}
`
}
