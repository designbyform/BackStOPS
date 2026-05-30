import { clsx } from 'clsx'
import type { ConfidenceLevel, SeverityLevel } from '../../types/brandBrain'

interface ConfidenceBadgeProps {
  level: ConfidenceLevel
  score: number
}

export function ConfidenceBadge({ level, score }: ConfidenceBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase',
        level === 'high' && 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        level === 'medium' && 'bg-amber-50 text-amber-700 border border-amber-200',
        level === 'low' && 'bg-red-50 text-red-700 border border-red-200'
      )}
    >
      <span
        className={clsx(
          'w-1.5 h-1.5 rounded-full',
          level === 'high' && 'bg-emerald-500',
          level === 'medium' && 'bg-amber-500',
          level === 'low' && 'bg-red-500'
        )}
      />
      {score}%
    </span>
  )
}

interface NeedsReviewBadgeProps {
  show: boolean
}

export function NeedsReviewBadge({ show }: NeedsReviewBadgeProps) {
  if (!show) return null
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase bg-amber-50 text-amber-700 border border-amber-200">
      Review
    </span>
  )
}

interface SeverityBadgeProps {
  level: SeverityLevel
}

export function SeverityBadge({ level }: SeverityBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide',
        level === 'High' && 'bg-red-50 text-red-700 border border-red-200',
        level === 'Medium' && 'bg-amber-50 text-amber-700 border border-amber-200',
        level === 'Low' && 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      )}
    >
      {level}
    </span>
  )
}

interface SourceBadgeProps {
  source: string
}

export function SourceBadge({ source }: SourceBadgeProps) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F2F1EE] text-[#6B6860] border border-[#E0DDD7]">
      {source}
    </span>
  )
}
