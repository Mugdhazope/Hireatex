'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useRecruitmentStore } from '@/lib/recruitment-store'

export default function AdminCandidatesPage() {
  const store = useRecruitmentStore()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return store.candidates.filter((c) => {
      if (!q) return true
      return `${c.fullName} ${c.email} ${c.location ?? ''}`.toLowerCase().includes(q)
    })
  }, [store.candidates, query])

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
          Candidates
        </h1>
        <p className="text-foreground-muted mb-6">
          Full candidate directory · {filtered.length}
        </p>
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
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Skills</th>
                <th className="px-4 py-3 font-medium">Apps</th>
                <th className="px-4 py-3 font-medium">Saved by</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const apps = store.applications.filter((a) => a.candidateId === c.id)
                const savers = store.getTalentSavers(c.id)
                return (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{c.fullName}</p>
                      <p className="text-xs text-foreground-muted">{c.email}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground-muted">
                      {c.location || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {c.skills.slice(0, 3).map((s) => (
                          <Badge key={s.id} variant="outline" className="text-xs font-normal">
                            {s.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">{apps.length}</td>
                    <td className="px-4 py-3 text-foreground-muted">
                      {savers.length === 0
                        ? '—'
                        : savers
                            .map((t) => store.getHrUser(t.hrId)?.fullName?.split(' ')[0])
                            .filter(Boolean)
                            .join(', ')}
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
