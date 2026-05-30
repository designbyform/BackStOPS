import { create } from 'zustand'
import type {
  BrandBrain,
  ProjectSetup,
  AssetInputs,
  AppStep,
  PromptLibrary,
  CompanyStage,
} from '../types/brandBrain'
import { generateBrandBrain, generatePromptLibrary } from '../lib/generators'

interface BrandStore {
  // Navigation
  currentStep: AppStep
  setStep: (step: AppStep) => void

  // Project setup
  project: ProjectSetup
  updateProject: (updates: Partial<ProjectSetup>) => void

  // Asset inputs
  assets: AssetInputs
  updateAssets: (updates: Partial<AssetInputs>) => void

  // Brand Brain
  brandBrain: BrandBrain | null
  startProcessing: () => void
  setBrandBrain: (brain: BrandBrain) => void
  updateBrandBrainField: (path: string, value: string | string[] | number) => void
  approveBrandBrain: () => void

  // Prompt library
  promptLibrary: PromptLibrary | null
  generatePrompts: () => void

  // Export active tab
  activeExportTab: string
  setActiveExportTab: (tab: string) => void
}

const DEFAULT_PROJECT: ProjectSetup = {
  id: '',
  companyName: '',
  websiteUrl: '',
  industry: '',
  stage: 'Seed' as CompanyStage,
  primaryAudience: '',
  notes: '',
  createdAt: '',
}

const DEFAULT_ASSETS: AssetInputs = {
  brandGuidePdf: null,
  pitchDeckPdf: null,
  websiteUrl: '',
  socialExamples: '',
  messagingExamples: '',
  visualNotes: '',
  competitorUrls: '',
}

export const useBrandStore = create<BrandStore>((set, get) => ({
  currentStep: 'landing',
  setStep: (step) => set({ currentStep: step }),

  project: DEFAULT_PROJECT,
  updateProject: (updates) =>
    set((state) => ({ project: { ...state.project, ...updates } })),

  assets: DEFAULT_ASSETS,
  updateAssets: (updates) =>
    set((state) => ({ assets: { ...state.assets, ...updates } })),

  brandBrain: null,
  startProcessing: () => {
    // Processing UI handles the delay; this triggers after scanning completes
    const brain = generateBrandBrain(get().project)
    set({ brandBrain: brain })
  },
  setBrandBrain: (brain) => set({ brandBrain: brain }),

  // Deep path update for nested brand brain fields
  // Path format: "strategicDNA.mission.value" or "personalityModel.clarity.score"
  updateBrandBrainField: (path, value) => {
    set((state) => {
      if (!state.brandBrain) return state
      const brain = JSON.parse(JSON.stringify(state.brandBrain)) as BrandBrain
      const parts = path.split('.')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let cursor: any = brain
      for (let i = 0; i < parts.length - 1; i++) {
        cursor = cursor[parts[i]!]
      }
      cursor[parts[parts.length - 1]!] = value
      return { brandBrain: brain }
    })
  },

  approveBrandBrain: () => {
    set((state) => {
      if (!state.brandBrain) return state
      return { brandBrain: { ...state.brandBrain, isApproved: true } }
    })
  },

  promptLibrary: null,
  generatePrompts: () => {
    const brain = get().brandBrain
    if (!brain) return
    set({ promptLibrary: generatePromptLibrary(brain) })
  },

  activeExportTab: 'claude',
  setActiveExportTab: (tab) => set({ activeExportTab: tab }),
}))
