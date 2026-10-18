'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DEMO_EMAIL, useAuth } from '@/lib/mock-auth'
import { useCandidateStore } from '@/lib/candidate-store'
import { toast } from 'sonner'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/candidate'
  const { login } = useAuth()
  const store = useCandidateStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = login(email, password, 'candidate')
    setLoading(false)
    if ('error' in result) {
      toast.error(result.error)
      return
    }
    if (!result.user.emailVerified) {
      router.push('/candidate/verify')
      return
    }
    const candidate = store.getCandidate(result.user.candidateId || result.user.id)
    if (candidate && !candidate.onboardingComplete) {
      router.push('/candidate/onboarding')
      return
    }
    router.push(next.startsWith('/') ? next : '/candidate')
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">
          Don&apos;t have an account?{' '}
          <Link href="/candidate/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/candidate/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="mt-6 rounded-md bg-background-muted px-3 py-2 text-xs text-foreground-muted">
          Demo: {DEMO_EMAIL} / any password
        </p>
      </div>
    </div>
  )
}
