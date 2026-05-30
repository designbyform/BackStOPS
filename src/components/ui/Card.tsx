import { clsx } from 'clsx'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'bordered'
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg',
        variant === 'default' && 'bg-white border border-[#E0DDD7]',
        variant === 'subtle' && 'bg-[#F9F8F6] border border-[#E0DDD7]',
        variant === 'bordered' && 'bg-white border-2 border-[#1A1916]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('px-5 py-4 border-b border-[#E0DDD7]', className)} {...props}>
      {children}
    </div>
  )
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('p-5', className)} {...props}>
      {children}
    </div>
  )
}
