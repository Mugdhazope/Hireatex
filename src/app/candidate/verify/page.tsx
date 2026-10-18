'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { OtpInput } from '@/components/auth/otp-input'
import { DEMO_OTP, useAuth } from '@/lib/mock-auth'
import { useCandidateStore } from '@/lib/candidate-store'
import { toast } from 'sonner'

export default function VerifyPage() {
  const router = useRouter()
  const { user, ready, verifyEmail } = useAuth()
  const store = useCandidateStore()
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (!user) {
      router.replace('/candidate/login')
      return
    }
    if (user.emailVerified) {
      const candidate = store.getCandidate(user.candidateId || user.id)
      router.replace(
        candidate && !candidate.onboardingComplete
          ? '/candidate/onboarding'
          : '/candidate'
      )
    }
  }, [ready, user, router, store])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = verifyEmail(code)
    setLoading(false)
    if ('error' in result) {
      toast.error(result.error)
      return
    }
    if (user?.candidateId) {
      store.updateCandidate(user.candidateId, { emailVerified: true })
    }
    toast.success('Email verified')
    const candidate = user?.candidateId
      ? store.getCandidate(user.candidateId)
      : undefined
    router.push(
      candidate && !candidate.onboardingComplete
        ? '/candidate/onboarding'
        : '/candidate'
    )
  }

  const handleResend = () => {
    if (countdown > 0) return
    setCountdown(60)
    toast.message(`Demo code resent: ${DEMO_OTP}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Check your email
            </h1>
            <p className="mt-2 text-sm text-foreground-muted">
              Enter the 6-digit code{user?.email ? ` sent to ${user.email}` : ''}.
              Demo code: <span className="font-mono text-foreground">{DEMO_OTP}</span>
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-8 shadow-sm">
            <form onSubmit={handleVerify} className="space-y-6">
              <OtpInput value={code} onChange={setCode} disabled={loading} />
              <Button
                type="submit"
                className="w-full"
                disabled={loading || code.length < 6}
              >
                {loading ? 'Verifying…' : 'Verify'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-primary"
                onClick={handleResend}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
