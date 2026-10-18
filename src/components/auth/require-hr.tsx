'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/mock-auth'
import { Skeleton } from '@/components/ui/skeleton'

export function RequireHr({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!ready) return
    if (!user || (user.role !== 'hr' && user.role !== 'admin')) {
      const next = encodeURIComponent(pathname || '/hr')
      router.replace(`/hr/login?next=${next}`)
      return
    }
    if (user.role === 'admin') {
      // Admins may use HR portal; stay
    }
  }, [ready, user, router, pathname])

  if (!ready) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!user || (user.role !== 'hr' && user.role !== 'admin')) return null

  return <>{children}</>
}
