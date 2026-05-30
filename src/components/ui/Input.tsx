import { clsx } from 'clsx'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export function Input({ label, hint, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-[#6B6860] tracking-wide uppercase">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-3 py-2 text-sm bg-white border rounded transition-colors duration-150',
          'text-[#1A1916] placeholder:text-[#9C9A94]',
          'focus:outline-none focus:ring-1 focus:ring-[#1A1916] focus:border-[#1A1916]',
          error ? 'border-red-400' : 'border-[#E0DDD7] hover:border-[#C5C1B9]',
          className
        )}
        {...props}
      />
      {hint && <p className="text-xs text-[#9C9A94]">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-[#6B6860] tracking-wide uppercase">
          {label}
        </label>
      )}
      <select
        className={clsx(
          'w-full px-3 py-2 text-sm bg-white border border-[#E0DDD7] rounded transition-colors duration-150',
          'text-[#1A1916]',
          'focus:outline-none focus:ring-1 focus:ring-[#1A1916] focus:border-[#1A1916]',
          'hover:border-[#C5C1B9]',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
}

export function Textarea({ label, hint, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-[#6B6860] tracking-wide uppercase">
          {label}
        </label>
      )}
      <textarea
        className={clsx(
          'w-full px-3 py-2 text-sm bg-white border border-[#E0DDD7] rounded transition-colors duration-150',
          'text-[#1A1916] placeholder:text-[#9C9A94] resize-none',
          'focus:outline-none focus:ring-1 focus:ring-[#1A1916] focus:border-[#1A1916]',
          'hover:border-[#C5C1B9]',
          className
        )}
        {...props}
      />
      {hint && <p className="text-xs text-[#9C9A94]">{hint}</p>}
    </div>
  )
}
