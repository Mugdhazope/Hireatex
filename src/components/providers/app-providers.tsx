'use client'

import { AuthProvider } from '@/lib/mock-auth'
import { CandidateStoreProvider } from '@/lib/candidate-store'
import { Toaster } from '@/components/ui/sonner'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CandidateStoreProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </CandidateStoreProvider>
  )
}
