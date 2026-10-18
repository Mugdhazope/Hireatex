'use client'

import { AuthProvider } from '@/lib/mock-auth'
import { RecruitmentStoreProvider } from '@/lib/recruitment-store'
import { Toaster } from '@/components/ui/sonner'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <RecruitmentStoreProvider>
      <AuthProvider>
        {children}
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </RecruitmentStoreProvider>
  )
}
