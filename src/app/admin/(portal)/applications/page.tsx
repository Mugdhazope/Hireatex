'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge } from '@/components/common/status-badge'
import { useAuth } from '@/lib/mock-auth'
import { useRecruitmentStore } from '@/lib/recruitment-store'
import { formatRelativeTime } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminApplicationsPage() {
  const { user } = useAuth()
  const store = useRecruitmentStore()
  const actorId = user?.hrId ?? user?.id ?? ''
  const [query, setQuery] = useState('')

  const apps = useMemo(() => {
    const q = query.trim().toLowerCase()
    return store
      .getApplicationsWithDetails()
      .filter((a) => {
        if (!q) return true
        return `${a.candidate.fullName} ${a.job.title}`.toLowerCase().includes(q)
      })
      .sort((a, b) => b.appliedDate.getTime() - a.appliedDate.getTime())
  }, [store, query])

  const hrs = store.hrUsers.filter((u) => u.active && u.role === 'hr')

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
          Applications
        </h1>
        <p className="text-foreground-muted mb-6">
          Reassign ownership across the org
        </p>
        <Input
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-6 max-w-sm bg-surface"
        />
        <div className="rounded-lg border border-border bg-surface overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="border-b border-border bg-background-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Candidate</th>
                <th className="px-4 py-3 font-medium">Job</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Applied</th>
                <th className="px-4 py-3 font-medium">Assigned HR</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{app.candidate.fullName}</td>
                  <td className="px-4 py-3 text-foreground-muted">{app.job.title}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} audience="hr" />
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">
                    {formatRelativeTime(app.appliedDate)}
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={app.assignedHrId ?? ''}
                      onValueChange={(v) => {
                        store.assignHr(app.id, v, actorId)
                        toast.success('Reassigned')
                      }}
                    >
                      <SelectTrigger className="w-44 bg-background h-8">
                        <SelectValue placeholder="Assign" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface">
                        {hrs.map((hr) => (
                          <SelectItem key={hr.id} value={hr.id}>
                            {hr.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {apps.length === 0 && (
          <p className="text-center text-foreground-muted py-8">No applications.</p>
        )}
      </div>
    </main>
  )
}
