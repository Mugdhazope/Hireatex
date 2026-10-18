'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge } from '@/components/common/status-badge'
import { CandidateDrawer } from '@/components/hr/candidate-drawer'
import { useRecruitmentStore } from '@/lib/recruitment-store'
import { formatRelativeTime, getStatusLabel } from '@/lib/utils'
import { LayoutGrid, List } from 'lucide-react'
import type { Application, ApplicationStatus, Candidate, Job } from '@/types'
import { HR_STATUS_LABELS } from '@/types'
import { cn } from '@/lib/utils'

type AppDetail = Application & { candidate: Candidate; job: Job }

const KANBAN_COLUMNS: ApplicationStatus[] = [
  'applied',
  'under_review',
  'shortlisted',
  'interview',
  'selected',
  'rejected',
  'saved_for_later',
]

export default function HRApplicationsPage() {
  const store = useRecruitmentStore()
  const [view, setView] = useState<'table' | 'kanban'>('table')
  const [query, setQuery] = useState('')
  const [jobId, setJobId] = useState('all')
  const [status, setStatus] = useState('all')
  const [assignedHr, setAssignedHr] = useState('all')
  const [selected, setSelected] = useState<AppDetail | null>(null)

  const all = store.getApplicationsWithDetails()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return all
      .filter((a) => {
        if (jobId !== 'all' && a.jobId !== jobId) return false
        if (status !== 'all' && a.status !== status) return false
        if (assignedHr !== 'all' && a.assignedHrId !== assignedHr) return false
        if (q) {
          const hay = `${a.candidate.fullName} ${a.job.title} ${a.candidate.skills
            .map((s) => s.name)
            .join(' ')}`.toLowerCase()
          if (!hay.includes(q)) return false
        }
        return true
      })
      .sort((a, b) => b.appliedDate.getTime() - a.appliedDate.getTime())
  }, [all, query, jobId, status, assignedHr])

  const jobs = store.jobs
  const hrs = store.hrUsers.filter((u) => u.active)

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Applications
            </h1>
            <p className="text-foreground-muted">
              Review candidates · {filtered.length} shown
            </p>
          </div>
          <div className="flex rounded-md border border-border overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={cn('rounded-none', view === 'table' && 'bg-primary-subtle text-primary')}
              onClick={() => setView('table')}
            >
              <List className="h-4 w-4 mr-1" />
              Table
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn('rounded-none', view === 'kanban' && 'bg-primary-subtle text-primary')}
              onClick={() => setView('kanban')}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Kanban
            </Button>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            placeholder="Search candidate, role, skills…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-surface"
          />
          <Select value={jobId} onValueChange={setJobId}>
            <SelectTrigger className="bg-surface">
              <SelectValue placeholder="Job" />
            </SelectTrigger>
            <SelectContent className="bg-surface">
              <SelectItem value="all">All jobs</SelectItem>
              {jobs.map((j) => (
                <SelectItem key={j.id} value={j.id}>
                  {j.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-surface">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-surface">
              <SelectItem value="all">All statuses</SelectItem>
              {Object.entries(HR_STATUS_LABELS).map(([k, label]) => (
                <SelectItem key={k} value={k}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={assignedHr} onValueChange={setAssignedHr}>
            <SelectTrigger className="bg-surface">
              <SelectValue placeholder="Assigned HR" />
            </SelectTrigger>
            <SelectContent className="bg-surface">
              <SelectItem value="all">All HR</SelectItem>
              {hrs.map((hr) => (
                <SelectItem key={hr.id} value={hr.id}>
                  {hr.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {view === 'table' ? (
          <div className="rounded-lg border border-border bg-surface overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="border-b border-border bg-background-muted text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Candidate</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Applied</th>
                  <th className="px-4 py-3 font-medium">Skills</th>
                  <th className="px-4 py-3 font-medium">Assigned</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-foreground-muted">
                      No applications match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((app) => {
                    const assignee = app.assignedHrId
                      ? store.getHrUser(app.assignedHrId)
                      : null
                    return (
                      <tr
                        key={app.id}
                        className="border-b border-border last:border-0 cursor-pointer hover:bg-background-muted/60"
                        onClick={() => setSelected(app)}
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">
                            {app.candidate.fullName}
                          </p>
                          <p className="text-xs text-foreground-muted">
                            {app.candidate.email}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-foreground-muted">{app.job.title}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={app.status} audience="hr" />
                        </td>
                        <td className="px-4 py-3 text-foreground-muted">
                          {formatRelativeTime(app.appliedDate)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {app.candidate.skills.slice(0, 3).map((s) => (
                              <Badge key={s.id} variant="outline" className="text-xs font-normal">
                                {s.name}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-foreground-muted">
                          {assignee?.fullName?.split(' ')[0] ?? '—'}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {KANBAN_COLUMNS.map((col) => {
              const cards = filtered.filter((a) => a.status === col)
              return (
                <div
                  key={col}
                  className="w-72 shrink-0 rounded-lg border border-border bg-background-muted/40 p-3"
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      {getStatusLabel(col, 'hr')}
                    </h3>
                    <span className="text-xs text-foreground-muted">{cards.length}</span>
                  </div>
                  <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                    {cards.map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelected(app)}
                        className="w-full text-left rounded-md border border-border bg-surface p-3 hover:border-primary/40 transition-colors"
                      >
                        <p className="font-medium text-sm text-foreground">
                          {app.candidate.fullName}
                        </p>
                        <p className="text-xs text-foreground-muted mt-0.5 line-clamp-1">
                          {app.job.title}
                        </p>
                        <p className="text-xs text-foreground-muted mt-2">
                          {formatRelativeTime(app.appliedDate)}
                        </p>
                      </button>
                    ))}
                    {cards.length === 0 && (
                      <p className="text-xs text-foreground-muted px-1 py-4 text-center">
                        Empty
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <CandidateDrawer
        app={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </main>
  )
}
