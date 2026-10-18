'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useRecruitmentStore } from '@/lib/recruitment-store'
import { formatDate } from '@/lib/utils'

export default function AdminJobsPage() {
  const store = useRecruitmentStore()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return store.jobs
      .filter((j) => {
        if (!q) return true
        return `${j.title} ${j.company} ${j.location}`.toLowerCase().includes(q)
      })
      .sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime())
  }, [store.jobs, query])

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
          All jobs
        </h1>
        <p className="text-foreground-muted mb-6">Organization-wide openings</p>
        <Input
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-6 max-w-sm bg-surface"
        />
        <div className="rounded-lg border border-border bg-surface overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="border-b border-border bg-background-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created by</th>
                <th className="px-4 py-3 font-medium">Apps</th>
                <th className="px-4 py-3 font-medium">Posted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => {
                const creator = job.createdByHrId
                  ? store.getHrUser(job.createdByHrId)
                  : null
                return (
                  <tr key={job.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{job.title}</p>
                      <p className="text-xs text-foreground-muted">{job.company}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="capitalize">
                        {job.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-foreground-muted">
                      {creator?.fullName ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      {store.applications.filter((a) => a.jobId === job.id).length}
                    </td>
                    <td className="px-4 py-3 text-foreground-muted">
                      {formatDate(job.postedDate)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
