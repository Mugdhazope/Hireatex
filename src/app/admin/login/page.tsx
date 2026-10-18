'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/mock-auth'
import { toast } from 'sonner'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [email, setEmail] = useState('rachel@hiretaex.com')
  const [password, setPassword] = useState('demo123')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = login(email, password, 'admin')
    if ('error' in result) {
      toast.error(result.error)
      return
    }
    const next = searchParams.get('next')
    router.push(next && next.startsWith('/admin') ? next : '/admin')
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
      <div className="mt-6 rounded-md bg-background-muted p-3 text-xs text-foreground-muted">
        <p className="font-medium text-foreground mb-1">Demo admin</p>
        <p>rachel@hiretaex.com / demo123</p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-foreground">
            Hire<span className="text-primary">taX</span>
          </h1>
          <p className="text-foreground-muted">Super Admin</p>
        </div>
        <Suspense fallback={<div className="h-64 rounded-lg border border-border bg-surface" />}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  )
}
