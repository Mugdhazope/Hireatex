'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/mock-auth'
import { Skeleton } from '@/components/ui/skeleton'

export function RequireCandidate({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!ready) return
    if (!user || user.role !== 'candidate') {
      const next = encodeURIComponent(pathname || '/candidate')
      router.replace(`/candidate/login?next=${next}`)
      return
    }
    if (!user.emailVerified && !pathname?.startsWith('/candidate/verify')) {
      router.replace('/candidate/verify')
    }
  }, [ready, user, router, pathname])

  if (!ready) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!user || user.role !== 'candidate') return null
  if (!user.emailVerified && !pathname?.startsWith('/candidate/verify')) return null

  return <>{children}</>
}
