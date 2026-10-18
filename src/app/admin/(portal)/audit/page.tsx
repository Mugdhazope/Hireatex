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
import { useRecruitmentStore } from '@/lib/recruitment-store'
import { formatRelativeTime, getStatusLabel } from '@/lib/utils'

export default function AdminAuditPage() {
  const store = useRecruitmentStore()
  const [hrFilter, setHrFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('all')
  const [query, setQuery] = useState('')

  const events = useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...store.auditEvents]
      .filter((e) => {
        if (hrFilter !== 'all' && e.actorHrId !== hrFilter) return false
        if (actionFilter !== 'all' && e.action !== actionFilter) return false
        if (q) {
          const hay = `${e.note ?? ''} ${e.action} ${e.jobId ?? ''} ${e.applicationId ?? ''}`.toLowerCase()
          if (!hay.includes(q)) return false
        }
        return true
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [store.auditEvents, hrFilter, actionFilter, query])

  const actions = Array.from(new Set(store.auditEvents.map((e) => e.action)))

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
          Audit log
        </h1>
        <p className="text-foreground-muted mb-6">
          Internal trail — never shown to candidates
        </p>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <Input
            placeholder="Search notes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-surface"
          />
          <Select value={hrFilter} onValueChange={setHrFilter}>
            <SelectTrigger className="bg-surface">
              <SelectValue placeholder="HR" />
            </SelectTrigger>
            <SelectContent className="bg-surface">
              <SelectItem value="all">All HR</SelectItem>
              {store.hrUsers.map((hr) => (
                <SelectItem key={hr.id} value={hr.id}>
                  {hr.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="bg-surface">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent className="bg-surface">
              <SelectItem value="all">All actions</SelectItem>
              {actions.map((a) => (
                <SelectItem key={a} value={a}>
                  {a.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border bg-surface divide-y divide-border">
          {events.length === 0 ? (
            <p className="p-8 text-center text-foreground-muted">No events match.</p>
          ) : (
            events.map((event) => {
              const actor = store.getHrUser(event.actorHrId)
              const job = event.jobId ? store.getJob(event.jobId) : null
              return (
                <div key={event.id} className="px-4 py-3">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{actor?.fullName ?? 'HR'}</span>
                    {' · '}
                    <span className="text-foreground-muted">
                      {event.action.replace(/_/g, ' ')}
                    </span>
                    {event.toStatus && (
                      <>
                        {' → '}
                        {getStatusLabel(event.toStatus, 'hr')}
                      </>
                    )}
                  </p>
                  {event.note && (
                    <p className="text-sm text-foreground-muted mt-0.5">{event.note}</p>
                  )}
                  <p className="text-xs text-foreground-muted mt-1">
                    {formatRelativeTime(event.timestamp)}
                    {job ? ` · ${job.title}` : ''}
                    {event.applicationId ? ` · ${event.applicationId}` : ''}
                  </p>
                </div>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}
