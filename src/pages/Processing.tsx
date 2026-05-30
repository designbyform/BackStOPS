import { useEffect, useRef, useState } from 'react'
import { useBrandStore } from '../store/brandStore'
import { extractBrandBrain } from '../lib/extraction'
import { generateBrandBrain } from '../lib/generators'

const STEP_LABELS = [
  'Reading uploaded files',
  'Sending to Claude for extraction',
  'Parsing Brand Brain',
  'Mapping to Brand Brain schema',
  'Calibrating confidence scores',
  'Building prompt library',
]

export function Processing() {
  const { project, assets, apiKey, setBrandBrain, setExtractionError, setStep } = useBrandStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    async function run() {
      if (!apiKey.trim()) {
        // No API key — animate through steps then load sample data
        for (let i = 0; i < STEP_LABELS.length; i++) {
          setCurrentStep(i)
          await delay(900 + Math.random() * 600)
        }
        const brain = generateBrandBrain(project)
        setBrandBrain(brain)
        setDone(true)
        return
      }

      try {
        const brain = await extractBrandBrain(
          project,
          assets,
          apiKey,
          (_, idx) => setCurrentStep(Math.min(idx, STEP_LABELS.length - 1)),
        )
        // Animate remaining steps quickly
        for (let i = currentStep + 1; i < STEP_LABELS.length; i++) {
          setCurrentStep(i)
          await delay(400)
        }
        setBrandBrain(brain)
        setDone(true)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        setError(msg)
        setExtractionError(msg)
      }
    }

    void run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setStep('brand-brain'), 1000)
      return () => clearTimeout(t)
    }
  }, [done, setStep])

  const progress = done
    ? 100
    : Math.round(((currentStep + 1) / STEP_LABELS.length) * 100)

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

        {error ? (
          <div>
            <h2 className="text-lg font-semibold text-[#1A1916] mb-2">Extraction failed</h2>
            <p className="text-sm text-red-600 mb-4 leading-relaxed">{error}</p>
            <p className="text-xs text-[#9C9A94] mb-4">
              Check your API key and try again, or continue with sample data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setStep('upload-assets')}
                className="text-sm font-medium text-white bg-[#1A1916] px-4 py-2 rounded hover:bg-[#3D3B35] transition-colors"
              >
                Go back
              </button>
              <button
                onClick={() => {
                  setBrandBrain(generateBrandBrain(project))
                  setStep('brand-brain')
                }}
                className="text-sm font-medium text-[#6B6860] hover:text-[#1A1916] px-3 py-2"
              >
                Load sample data
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#1A1916] mb-1">
                {done ? 'Scan complete.' : (apiKey.trim() ? 'Extracting brand intelligence...' : 'Scanning brand assets...')}
              </h2>
              <p className="text-sm text-[#6B6860]">
                {done
                  ? 'Your Brand Brain is ready for review.'
                  : apiKey.trim()
                  ? 'Claude is reading your brand materials and building the Brand Brain.'
                  : 'Loading sample data — add an API key to extract from real materials.'}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="h-0.5 bg-[#E0DDD7] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1A1916] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-[#9C9A94] mt-2 block">{progress}%</span>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {STEP_LABELS.map((label, i) => {
                const isActive = i === currentStep && !done
                const isDone = i < currentStep || done
                return (
                  <div key={label} className="flex items-center gap-3 py-1.5">
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
                    <span className={
                      isDone ? 'text-sm text-[#1A1916]'
                      : isActive ? 'text-sm text-[#1A1916] font-medium'
                      : 'text-sm text-[#C5C1B9]'
                    }>
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}
