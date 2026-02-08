import AppHeader from '@/components/AppHeader'
import type { ReactNode } from 'react'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 w-full relative">
        {children}
      </main>
    </div>
  )
}
