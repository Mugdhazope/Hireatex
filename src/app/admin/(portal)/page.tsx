'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRecruitmentStore } from '@/lib/recruitment-store'
import { formatRelativeTime, getStatusLabel } from '@/lib/utils'

export default function AdminDashboard() {
  const store = useRecruitmentStore()
  const metrics = store.orgMetrics()
  const feed = store.getAuditFeed(12)

  if (!store.ready) {
    return (
      <main className="py-8">
        <div className="container mx-auto max-w-7xl px-4 text-foreground-muted">
          Loading…
        </div>
      </main>
    )
  }

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Org dashboard
            </h1>
            <p className="text-foreground-muted">
              Cross-team recruitment health
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/audit">View full audit log</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {[
            { label: 'Total jobs', value: metrics.totalJobs },
            { label: 'Active jobs', value: metrics.activeJobs },
            { label: 'Applications', value: metrics.totalApplications },
            { label: 'Pending reviews', value: metrics.pendingReviews },
            { label: 'Candidates', value: metrics.totalCandidates },
            { label: 'Active HR', value: metrics.activeHr },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground-muted">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Workload by HR</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.workloadByHr.length === 0 ? (
                <p className="text-sm text-foreground-muted">No active HR users.</p>
              ) : (
                metrics.workloadByHr.map(({ hr, count }) => (
                  <div
                    key={hr.id}
                    className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{hr.fullName}</p>
                      <p className="text-xs text-foreground-muted">{hr.email}</p>
                    </div>
                    <p className="text-lg font-semibold tabular-nums">{count}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {feed.length === 0 ? (
                <p className="text-sm text-foreground-muted">No audit events yet.</p>
              ) : (
                feed.map((event) => {
                  const actor = store.getHrUser(event.actorHrId)
                  return (
                    <div
                      key={event.id}
                      className="border-b border-border pb-3 last:border-0"
                    >
                      <p className="text-sm text-foreground">
                        <span className="font-medium">
                          {actor?.fullName ?? 'HR'}
                        </span>
                        {' — '}
                        {event.note ?? event.action}
                        {event.toStatus
                          ? ` (${getStatusLabel(event.toStatus, 'hr')})`
                          : ''}
                      </p>
                      <p className="text-xs text-foreground-muted">
                        {formatRelativeTime(event.timestamp)}
                      </p>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
