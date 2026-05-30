import { clsx } from 'clsx'
import { useBrandStore } from '../../store/brandStore'
import type { AppStep } from '../../types/brandBrain'

const NAV_ITEMS: { id: AppStep; label: string; group?: string }[] = [
  { id: 'landing', label: 'Home', group: 'start' },
  { id: 'new-scan', label: 'Project Setup', group: 'scan' },
  { id: 'upload-assets', label: 'Asset Upload', group: 'scan' },
  { id: 'processing', label: 'Processing', group: 'scan' },
  { id: 'brand-brain', label: 'Brand Brain', group: 'output' },
  { id: 'diagnosis', label: 'Diagnosis', group: 'output' },
  { id: 'prompt-library', label: 'Prompt Library', group: 'output' },
  { id: 'exports', label: 'Exports', group: 'output' },
]

const STEP_ORDER: AppStep[] = [
  'landing',
  'new-scan',
  'upload-assets',
  'processing',
  'brand-brain',
  'diagnosis',
  'prompt-library',
  'exports',
]

export function Sidebar() {
  const { currentStep, setStep, brandBrain } = useBrandStore()
  const currentIndex = STEP_ORDER.indexOf(currentStep)

  function isAccessible(step: AppStep) {
    const idx = STEP_ORDER.indexOf(step)
    if (idx <= 1) return true
    if (step === 'upload-assets') return currentIndex >= 1
    if (step === 'processing') return currentIndex >= 2
    if (idx >= 4) return brandBrain !== null
    return false
  }

  return (
    <aside className="w-52 shrink-0 border-r border-[#E0DDD7] bg-[#F9F8F6] flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#E0DDD7]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#1A1916] rounded-sm flex items-center justify-center">
            <span className="text-white text-[10px] font-semibold">M</span>
          </div>
          <span className="text-sm font-semibold text-[#1A1916] tracking-tight">Brand MRI</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {(['start', 'scan', 'output'] as const).map((group) => {
          const items = NAV_ITEMS.filter((n) => n.group === group)
          return (
            <div key={group} className="mb-3">
              {group !== 'start' && (
                <p className="px-2 mb-1 text-[10px] font-semibold text-[#9C9A94] tracking-widest uppercase">
                  {group === 'scan' ? 'Scan' : 'Results'}
                </p>
              )}
              {items.map((item) => {
                const accessible = isAccessible(item.id)
                const active = currentStep === item.id
                const done = STEP_ORDER.indexOf(item.id) < currentIndex

                return (
                  <button
                    key={item.id}
                    onClick={() => accessible && setStep(item.id)}
                    disabled={!accessible}
                    className={clsx(
                      'w-full text-left px-2 py-1.5 rounded text-sm transition-all duration-100',
                      active && 'bg-[#1A1916] text-white font-medium',
                      !active && accessible && 'text-[#3D3B35] hover:bg-[#ECEAE5] hover:text-[#1A1916]',
                      !accessible && 'text-[#C5C1B9] cursor-not-allowed'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {done && !active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      )}
                      {(!done || active) && <span className="w-1.5 h-1.5 shrink-0" />}
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#E0DDD7]">
        <p className="text-[10px] text-[#9C9A94]">Brand MRI MVP</p>
        <p className="text-[10px] text-[#C5C1B9]">by Form</p>
      </div>
    </aside>
  )
}
