import { useEffect, useState } from 'react'
import { useBrandStore } from '../store/brandStore'
import type { ScanStep } from '../types/brandBrain'

const SCAN_STEPS: ScanStep[] = [
  { id: 'extracting', label: 'Extracting brand DNA', duration: 1400 },
  { id: 'verbal', label: 'Identifying verbal patterns', duration: 1200 },
  { id: 'visual', label: 'Mapping visual language', duration: 1300 },
  { id: 'rules', label: 'Finding decision rules', duration: 1100 },
  { id: 'brain', label: 'Generating Brand Brain', duration: 1500 },
  { id: 'prompts', label: 'Calibrating prompt library', duration: 900 },
]

export function Processing() {
  const { brandBrain, setStep } = useBrandStore()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let idx = 0
    let total = 0

    const timers: ReturnType<typeof setTimeout>[] = []

    SCAN_STEPS.forEach((step, i) => {
      const t = setTimeout(() => {
        setCurrentStepIndex(i)
      }, total)
      timers.push(t)
      total += step.duration
    })

    const finish = setTimeout(() => {
      setCurrentStepIndex(SCAN_STEPS.length)
      setDone(true)
    }, total + 600)
    timers.push(finish)

    return () => {
      timers.forEach(clearTimeout)
      void idx
    }
  }, [])

  useEffect(() => {
    if (done && brandBrain) {
      const t = setTimeout(() => setStep('brand-brain'), 1200)
      return () => clearTimeout(t)
    }
  }, [done, brandBrain, setStep])

  const progress = done ? 100 : Math.round((currentStepIndex / SCAN_STEPS.length) * 100)

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
      <div className="max-w-sm w-full px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
          <div className="w-6 h-6 bg-[#1A1916] rounded-sm flex items-center justify-center">
            <span className="text-white text-[10px] font-semibold">M</span>
          </div>
          <span className="text-sm font-semibold text-[#1A1916] tracking-tight">Brand MRI</span>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#1A1916] mb-1">
            {done ? 'Scan complete.' : 'Scanning brand assets...'}
          </h2>
          <p className="text-sm text-[#6B6860]">
            {done
              ? 'Your Brand Brain is ready for review.'
              : 'Extracting structure, patterns, and identity signals.'}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-0.5 bg-[#E0DDD7] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1A1916] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-[#9C9A94]">{progress}%</span>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {SCAN_STEPS.map((step, i) => {
            const isActive = i === currentStepIndex && !done
            const isDone = i < currentStepIndex || done

            return (
              <div
                key={step.id}
                className="flex items-center gap-3 py-1.5"
              >
                <div className="shrink-0 w-4 h-4 flex items-center justify-center">
                  {isDone ? (
                    <span className="w-3 h-3 rounded-full bg-[#1A1916] flex items-center justify-center">
                      <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                        <path d="M1 2.5L2.8 4L6 1" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  ) : isActive ? (
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-[#1A1916] animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#E0DDD7]" />
                  )}
                </div>
                <span
                  className={
                    isDone
                      ? 'text-sm text-[#1A1916]'
                      : isActive
                      ? 'text-sm text-[#1A1916] font-medium'
                      : 'text-sm text-[#C5C1B9]'
                  }
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
