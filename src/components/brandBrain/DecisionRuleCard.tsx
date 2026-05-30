import { useState } from 'react'
import { ConfidenceBadge } from '../ui/Badge'
import type { DecisionRule } from '../../types/brandBrain'

interface DecisionRuleCardProps {
  rule: DecisionRule
  index: number
  onUpdate: (updated: DecisionRule) => void
}

export function DecisionRuleCard({ rule, index, onUpdate }: DecisionRuleCardProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ ...rule })

  function save() {
    onUpdate(draft)
    setEditing(false)
  }

  return (
    <div className="rounded-lg border border-[#E0DDD7] bg-white overflow-hidden">
      <div className="px-4 py-3 bg-[#F9F8F6] border-b border-[#E0DDD7] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-[#9C9A94] tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-sm font-medium text-[#1A1916]">{rule.rule}</span>
        </div>
        <ConfidenceBadge level={rule.confidenceLevel} score={rule.confidence} />
      </div>

      {editing ? (
        <div className="p-4 space-y-3">
          <div>
            <label className="block text-[10px] font-medium text-[#9C9A94] uppercase tracking-wide mb-1">Rule</label>
            <input
              className="w-full text-sm border border-[#E0DDD7] rounded px-3 py-2 focus:outline-none focus:border-[#1A1916]"
              value={draft.rule}
              onChange={(e) => setDraft({ ...draft, rule: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-[#9C9A94] uppercase tracking-wide mb-1">Why it matters</label>
            <textarea
              className="w-full text-sm border border-[#E0DDD7] rounded px-3 py-2 resize-none focus:outline-none focus:border-[#1A1916]"
              rows={2}
              value={draft.whyItMatters}
              onChange={(e) => setDraft({ ...draft, whyItMatters: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-[#9C9A94] uppercase tracking-wide mb-1">Example application</label>
            <textarea
              className="w-full text-sm border border-[#E0DDD7] rounded px-3 py-2 resize-none focus:outline-none focus:border-[#1A1916]"
              rows={2}
              value={draft.exampleApplication}
              onChange={(e) => setDraft({ ...draft, exampleApplication: e.target.value })}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={save}
              className="text-xs font-medium text-white bg-[#1A1916] px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => { setDraft({ ...rule }); setEditing(false) }}
              className="text-xs font-medium text-[#6B6860] px-2 py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="w-full text-left p-4 space-y-2 group" onClick={() => setEditing(true)}>
          <div>
            <p className="text-[10px] font-medium text-[#9C9A94] uppercase tracking-wide mb-1">Why it matters</p>
            <p className="text-sm text-[#3D3B35] leading-relaxed">{rule.whyItMatters}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-[#9C9A94] uppercase tracking-wide mb-1">Example</p>
            <p className="text-sm text-[#3D3B35] leading-relaxed italic">{rule.exampleApplication}</p>
          </div>
          <p className="text-[10px] text-[#C5C1B9] opacity-0 group-hover:opacity-100 transition-opacity">
            Click to edit
          </p>
        </button>
      )}
    </div>
  )
}
