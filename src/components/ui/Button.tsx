import { clsx } from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-[#1A1916] text-white hover:bg-[#3D3B35] active:bg-[#1A1916]',
        variant === 'secondary' && 'bg-white text-[#1A1916] border border-[#E0DDD7] hover:border-[#C5C1B9] hover:bg-[#F9F8F6]',
        variant === 'ghost' && 'text-[#6B6860] hover:text-[#1A1916] hover:bg-[#F2F1EE]',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
        size === 'sm' && 'text-xs px-3 py-1.5',
        size === 'md' && 'text-sm px-4 py-2',
        size === 'lg' && 'text-sm px-6 py-3',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
