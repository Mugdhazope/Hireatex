'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/status-badge'
import { useAuth } from '@/lib/mock-auth'
import { useRecruitmentStore } from '@/lib/recruitment-store'
import { formatRelativeTime, getStatusLabel } from '@/lib/utils'
import { Plus, FileText, Users, Briefcase } from 'lucide-react'
import { HR_STATUS_LABELS } from '@/types'

const PIPELINE_STAGES = [
  'applied',
  'under_review',
  'shortlisted',
  'interview',
  'selected',
  'rejected',
] as const

export default function HRDashboard() {
  const { user } = useAuth()
  const store = useRecruitmentStore()
  const hrId = user?.hrId ?? user?.id ?? ''
  const metrics = store.hrMetrics(hrId)
  const pipeline = store.pipelineCounts()
  const recentApps = store
    .getApplicationsWithDetails()
    .sort((a, b) => b.appliedDate.getTime() - a.appliedDate.getTime())
    .slice(0, 8)
  const feed = store.getAuditFeed(8)

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
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
            Overview
          </h1>
          <p className="text-foreground-muted">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}. Manage
            your recruitment pipeline.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Button asChild>
            <Link href="/hr/jobs/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Job
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/hr/applications">
              <FileText className="mr-2 h-4 w-4" />
              Review Applications
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/hr/candidates">
              <Users className="mr-2 h-4 w-4" />
              Find Candidates
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: 'My jobs', value: metrics.jobsCreated, icon: Briefcase },
            { label: 'Active openings', value: metrics.activeJobs, icon: Briefcase },
            { label: 'Applicants', value: metrics.applicants, icon: Users },
            { label: 'Pending review', value: metrics.pendingReview, icon: FileText },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground-muted">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: 'Shortlisted', value: metrics.shortlisted },
            { label: 'Interviews', value: metrics.interviews },
            { label: 'Rejected', value: metrics.rejected },
            { label: 'Talent saved', value: metrics.savedTalent },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <p className="text-sm text-foreground-muted">{stat.label}</p>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {PIPELINE_STAGES.map((stage) => (
                <div
                  key={stage}
                  className="rounded-md border border-border bg-background-muted px-3 py-2 text-center min-w-[100px]"
                >
                  <p className="text-lg font-semibold text-foreground">
                    {pipeline[stage] ?? 0}
                  </p>
                  <p className="text-xs text-foreground-muted">
                    {HR_STATUS_LABELS[stage]}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent applications</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/hr/applications">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentApps.length === 0 ? (
                <p className="text-sm text-foreground-muted">No applications yet.</p>
              ) : (
                recentApps.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {app.candidate.fullName}
                      </p>
                      <p className="text-sm text-foreground-muted truncate">
                        {app.job.title}
                      </p>
                      <p className="text-xs text-foreground-muted">
                        {formatRelativeTime(app.appliedDate)}
                      </p>
                    </div>
                    <StatusBadge status={app.status} audience="hr" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {feed.length === 0 ? (
                <p className="text-sm text-foreground-muted">
                  No recent activity. Actions will appear here.
                </p>
              ) : (
                feed.map((event) => {
                  const actor = store.getHrUser(event.actorHrId)
                  return (
                    <div key={event.id} className="border-b border-border pb-3 last:border-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{actor?.fullName ?? 'HR'}</span>
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
