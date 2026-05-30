import { useState } from 'react'
import { clsx } from 'clsx'
import { ConfidenceBadge } from '../ui/Badge'
import { useBrandStore } from '../../store/brandStore'
import type { PersonalityTrait } from '../../types/brandBrain'

interface TraitSliderProps {
  label: string
  trait: PersonalityTrait
  path: string
}

export function TraitSlider({ label, trait, path }: TraitSliderProps) {
  const [editing, setEditing] = useState(false)
  const [score, setScore] = useState(trait.score)
  const [rationale, setRationale] = useState(trait.rationale)
  const { updateBrandBrainField } = useBrandStore()

  function save() {
    updateBrandBrainField(`${path}.score`, score)
    updateBrandBrainField(`${path}.rationale`, rationale)
    setEditing(false)
  }

  const filled = Math.round(trait.score / 10)

  return (
    <div
      className={clsx(
        'rounded-lg border transition-all duration-150',
        editing ? 'border-[#1A1916] ring-1 ring-[#1A1916] bg-white' : 'border-[#E0DDD7] bg-white hover:border-[#C5C1B9]'
      )}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-medium text-[#1A1916] tracking-wide uppercase">{label}</span>
          <div className="flex items-center gap-2">
            <ConfidenceBadge level={trait.confidenceLevel} score={trait.confidence} />
            <span className="text-sm font-semibold text-[#1A1916] w-8 text-right tabular-nums">
              {editing ? score : trait.score}
            </span>
          </div>
        </div>

        {/* Bar visualization */}
        <div className="flex gap-0.5 mb-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                'flex-1 h-2 rounded-sm transition-colors duration-150',
                i < filled ? 'bg-[#1A1916]' : 'bg-[#ECEAE5]'
              )}
            />
          ))}
        </div>

        {editing ? (
          <div className="space-y-3">
            <div>
              <input
                type="range"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full accent-[#1A1916]"
              />
              <div className="flex justify-between text-[10px] text-[#9C9A94] mt-0.5">
                <span>0</span>
                <span>100</span>
              </div>
            </div>
            <textarea
              className="w-full text-xs text-[#3D3B35] bg-[#F9F8F6] border border-[#E0DDD7] rounded p-2 resize-none outline-none focus:border-[#1A1916]"
              rows={2}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Rationale for this score..."
            />
            <div className="flex gap-2">
              <button
                onClick={save}
                className="text-xs font-medium text-white bg-[#1A1916] px-3 py-1 rounded hover:bg-[#3D3B35] transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => { setScore(trait.score); setRationale(trait.rationale); setEditing(false) }}
                className="text-xs font-medium text-[#6B6860] hover:text-[#1A1916] px-2 py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="w-full text-left" onClick={() => setEditing(true)}>
            <p className="text-xs text-[#6B6860] leading-relaxed hover:text-[#3D3B35] transition-colors">
              {trait.rationale}
            </p>
          </button>
        )}
      </div>
    </div>
  )
}
