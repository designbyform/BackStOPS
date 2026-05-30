import { useState } from 'react'
import { clsx } from 'clsx'
import { ConfidenceBadge, NeedsReviewBadge, SourceBadge } from '../ui/Badge'
import { useBrandStore } from '../../store/brandStore'
import type { ExtractedField, ExtractedListField } from '../../types/brandBrain'

interface EditableFieldProps {
  label: string
  field: ExtractedField
  path: string
  multiline?: boolean
  rows?: number
}

export function EditableField({ label, field, path, multiline = false, rows = 3 }: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(field.value)
  const { updateBrandBrainField } = useBrandStore()

  function save() {
    updateBrandBrainField(`${path}.value`, draft)
    setEditing(false)
  }

  function cancel() {
    setDraft(field.value)
    setEditing(false)
  }

  return (
    <div
      className={clsx(
        'group rounded-lg border transition-all duration-150',
        field.needsReview ? 'border-amber-200 bg-amber-50/30' : 'border-[#E0DDD7] bg-white',
        editing && 'ring-1 ring-[#1A1916] border-[#1A1916]'
      )}
    >
      <div className="px-4 py-3 border-b border-inherit">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-[#6B6860] tracking-wide uppercase">{label}</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <NeedsReviewBadge show={field.needsReview} />
            <SourceBadge source={field.source} />
            <ConfidenceBadge level={field.confidenceLevel} score={field.confidence} />
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        {editing ? (
          <div className="space-y-2">
            {multiline ? (
              <textarea
                className="w-full text-sm text-[#1A1916] bg-transparent border-none outline-none resize-none leading-relaxed"
                rows={rows}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
              />
            ) : (
              <input
                className="w-full text-sm text-[#1A1916] bg-transparent border-none outline-none"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
              />
            )}
            <div className="flex items-center gap-2 pt-1 border-t border-[#E0DDD7]">
              <button
                onClick={save}
                className="text-xs font-medium text-white bg-[#1A1916] px-3 py-1 rounded hover:bg-[#3D3B35] transition-colors"
              >
                Save
              </button>
              <button
                onClick={cancel}
                className="text-xs font-medium text-[#6B6860] hover:text-[#1A1916] px-2 py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="w-full text-left group/text"
            onClick={() => setEditing(true)}
          >
            <p className="text-sm text-[#1A1916] leading-relaxed group-hover/text:text-[#1A1916]">
              {field.value || <span className="text-[#9C9A94] italic">No value — click to add</span>}
            </p>
            <p className="mt-1 text-[10px] text-[#C5C1B9] opacity-0 group-hover/text:opacity-100 transition-opacity">
              Click to edit
            </p>
          </button>
        )}
      </div>
    </div>
  )
}

interface EditableListFieldProps {
  label: string
  field: ExtractedListField
  path: string
}

export function EditableListField({ label, field, path }: EditableListFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(field.values.join('\n'))
  const { updateBrandBrainField } = useBrandStore()

  function save() {
    const values = draft.split('\n').map(v => v.trim()).filter(Boolean)
    updateBrandBrainField(`${path}.values`, values)
    setEditing(false)
  }

  function cancel() {
    setDraft(field.values.join('\n'))
    setEditing(false)
  }

  return (
    <div
      className={clsx(
        'group rounded-lg border transition-all duration-150',
        field.needsReview ? 'border-amber-200 bg-amber-50/30' : 'border-[#E0DDD7] bg-white',
        editing && 'ring-1 ring-[#1A1916] border-[#1A1916]'
      )}
    >
      <div className="px-4 py-3 border-b border-inherit">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-[#6B6860] tracking-wide uppercase">{label}</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <NeedsReviewBadge show={field.needsReview} />
            <SourceBadge source={field.source} />
            <ConfidenceBadge level={field.confidenceLevel} score={field.confidence} />
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        {editing ? (
          <div className="space-y-2">
            <textarea
              className="w-full text-sm text-[#1A1916] bg-transparent border-none outline-none resize-none font-mono"
              rows={Math.max(field.values.length + 1, 3)}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              placeholder="One item per line"
            />
            <p className="text-[10px] text-[#9C9A94]">One item per line</p>
            <div className="flex items-center gap-2 pt-1 border-t border-[#E0DDD7]">
              <button
                onClick={save}
                className="text-xs font-medium text-white bg-[#1A1916] px-3 py-1 rounded hover:bg-[#3D3B35] transition-colors"
              >
                Save
              </button>
              <button
                onClick={cancel}
                className="text-xs font-medium text-[#6B6860] hover:text-[#1A1916] px-2 py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="w-full text-left group/list" onClick={() => setEditing(true)}>
            {field.values.length > 0 ? (
              <ul className="space-y-1">
                {field.values.map((v, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1A1916]">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-[#C5C1B9] shrink-0" />
                    {v}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-sm text-[#9C9A94] italic">No items — click to add</span>
            )}
            <p className="mt-1 text-[10px] text-[#C5C1B9] opacity-0 group-hover/list:opacity-100 transition-opacity">
              Click to edit
            </p>
          </button>
        )}
      </div>
    </div>
  )
}
