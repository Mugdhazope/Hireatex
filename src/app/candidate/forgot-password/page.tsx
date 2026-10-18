'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Enter your email')
      return
    }
    setSent(true)
    toast.success('If an account exists, a reset link was simulated locally.')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Reset password
            </h1>
            <p className="mt-2 text-sm text-foreground-muted">
              No email is sent in this demo. We simulate a reset locally.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-8 shadow-sm">
            {sent ? (
              <div className="space-y-4 text-center">
                <p className="text-sm text-foreground-muted">
                  Check your inbox for a reset link (simulated). You can sign in
                  with your existing password.
                </p>
                <Button asChild className="w-full">
                  <Link href="/candidate/login">Back to Sign In</Link>
                </Button>
              </div>
            ) : (
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
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send reset link
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/candidate/login">Back to Sign In</Link>
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
