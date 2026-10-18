'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  return (
    <main className="py-8">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
          Settings
        </h1>
        <p className="text-foreground-muted mb-8">Demo placeholders</p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Email templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-foreground-muted">
              Application received, shortlist, and rejection templates are mocked
              for this demo — no email is sent.
            </p>
            <Button
              variant="outline"
              onClick={() => toast.message('Demo: template preview only')}
            >
              Preview rejection template
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground-muted mb-3">
              Recruitment data lives in browser localStorage. Clear site data to
              reset to seed values.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                if (typeof window === 'undefined') return
                const keys = [
                  'jobs',
                  'applications',
                  'candidates',
                  'hr_users',
                  'audit_events',
                  'hr_talent',
                  'saved_jobs',
                ]
                keys.forEach((k) => localStorage.removeItem(k))
                toast.success('Store cleared — reload the page')
              }}
            >
              Clear local store
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
