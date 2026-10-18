'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/mock-auth'
import { useRecruitmentStore } from '@/lib/recruitment-store'
import { DEMO_HR_PASSWORD } from '@/data/hr-users'
import { toast } from 'sonner'

export default function HRProfilePage() {
  const { user } = useAuth()
  const store = useRecruitmentStore()
  const hrId = user?.hrId ?? user?.id ?? ''
  const hr = store.getHrUser(hrId)

  const [name, setName] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const displayName = name ?? hr?.fullName ?? ''

  if (!store.ready) {
    return (
      <main className="py-8">
        <div className="container mx-auto max-w-lg px-4 text-foreground-muted">
          Loading…
        </div>
      </main>
    )
  }

  if (!hr) {
    return (
      <main className="py-8">
        <div className="container mx-auto max-w-lg px-4 text-foreground-muted">
          Profile not found.
        </div>
      </main>
    )
  }

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
          Profile
        </h1>
        <p className="text-foreground-muted mb-8">{hr.email}</p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Display name</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setName(e.target.value)}
                className="bg-background"
              />
            </div>
            <Button
              onClick={() => {
                if (!displayName.trim()) return
                store.updateHrUser(hrId, { fullName: displayName.trim() })
                toast.success('Name updated')
              }}
            >
              Save name
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Change password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background"
                placeholder={DEMO_HR_PASSWORD}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="bg-background"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if (password.length < 6) {
                  toast.error('Password must be at least 6 characters')
                  return
                }
                if (password !== confirm) {
                  toast.error('Passwords do not match')
                  return
                }
                store.resetHrPassword(hrId, password)
                setPassword('')
                setConfirm('')
                toast.success('Password updated (demo only)')
              }}
            >
              Update password
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
