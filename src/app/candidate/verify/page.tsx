'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function VerifyPage() {
  const router = useRouter()
  const [code, setCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/candidate')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Check your email
            </h1>
            <p className="mt-2 text-sm text-foreground-muted">
              We've sent a verification code to your email address
            </p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Verify
              </Button>

              <Button variant="ghost" type="button" className="w-full text-primary">
                Resend Code
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
