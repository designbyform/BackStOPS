import { Sidebar } from './Sidebar'
import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-[#F9F8F6]">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="px-10 py-8 border-b border-[#E0DDD7] bg-white">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1916] tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-[#6B6860]">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}

export function PageBody({ children }: { children: ReactNode }) {
  return <div className="px-10 py-8 max-w-4xl">{children}</div>
}
