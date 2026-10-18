'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/status-badge'
import { JobCard } from '@/components/jobs/job-card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/lib/mock-auth'
import { computeProfileCompletion, useCandidateStore } from '@/lib/candidate-store'
import { formatDate } from '@/lib/utils'
import { Bookmark, FileUp, UserRound, Briefcase } from 'lucide-react'

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function CandidateDashboard() {
  const { user } = useAuth()
  const store = useCandidateStore()
  const candidateId = user?.candidateId || user?.id || ''
  const candidate = store.getCandidate(candidateId)
  const apps = store.getApplicationWithJob(candidateId)
  const completion = candidate ? computeProfileCompletion(candidate) : 0
  const recommended = store.getRecommendedJobs(candidateId, 3)
  const saved = store.getSavedJobsForCandidate(candidateId).slice(0, 3)

  const statusCounts = {
    applied: apps.filter((a) => a.status === 'applied').length,
    under_review: apps.filter((a) => a.status === 'under_review').length,
    shortlisted: apps.filter((a) => a.status === 'shortlisted').length,
    interview: apps.filter((a) => a.status === 'interview').length,
    offers: apps.filter((a) => a.status === 'selected').length,
  }

  if (!candidate) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <p className="text-foreground-muted">Loading your workspace…</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Avatar className="h-12 w-12 shrink-0 border border-border sm:h-14 sm:w-14">
            <AvatarFallback className="bg-primary-subtle text-base font-semibold text-primary sm:text-lg">
              {initials(candidate.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
              Welcome back, {candidate.fullName.split(' ')[0]}
            </h1>
            <p className="truncate text-sm text-foreground-muted">
              {candidate.headline || 'Track applications and find your next role'}
            </p>
          </div>
        </div>
        <div className="w-full rounded-lg border border-border bg-surface px-4 py-3 sm:w-auto sm:min-w-[140px]">
          <p className="text-xs text-foreground-muted">Profile</p>
          <p className="text-2xl font-semibold text-foreground">{completion}%</p>
          <div className="mt-2 h-1.5 rounded-full bg-background-muted">
            <div
              className="h-1.5 rounded-full bg-primary transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: 'Applied', value: statusCounts.applied },
          { label: 'Under Review', value: statusCounts.under_review },
          { label: 'Shortlisted', value: statusCounts.shortlisted },
          { label: 'Interviews', value: statusCounts.interview },
          { label: 'Offers', value: statusCounts.offers },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-none">
            <CardContent className="pt-5 pb-5">
              <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
              <div className="text-sm text-foreground-muted">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
        <Button variant="outline" className="w-full sm:w-auto" asChild>
          <Link href="/candidate/profile">
            <UserRound className="h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
        <Button variant="outline" className="w-full sm:w-auto" asChild>
          <Link href="/candidate/profile#resumes">
            <FileUp className="h-4 w-4" />
            Upload Resume
          </Link>
        </Button>
        <Button className="w-full sm:w-auto" asChild>
          <Link href="/jobs">
            <Briefcase className="h-4 w-4" />
            Browse Jobs
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <section className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Applications</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/candidate/applications">View All</Link>
            </Button>
          </div>
          {apps.length === 0 ? (
            <Card className="shadow-none">
              <CardContent className="py-10 text-center">
                <p className="text-sm text-foreground-muted mb-4">No applications yet</p>
                <Button asChild>
                  <Link href="/jobs">Explore Jobs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {apps.slice(0, 5).map((app) => (
                <Card key={app.id} className="shadow-none">
                  <CardContent className="pt-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Link
                          href={`/jobs/${app.job.id}`}
                          className="font-semibold text-foreground hover:text-primary"
                        >
                          {app.job.title}
                        </Link>
                        <p className="text-sm text-foreground-muted">{app.job.company}</p>
                        <p className="text-xs text-foreground-subtle mt-1">
                          Applied {formatDate(app.appliedDate)}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="lg:col-span-2 space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Saved</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/candidate/saved">
                  <Bookmark className="h-4 w-4" />
                  All
                </Link>
              </Button>
            </div>
            {saved.length === 0 ? (
              <p className="text-sm text-foreground-muted">No saved jobs yet</p>
            ) : (
              <ul className="space-y-2">
                {saved.map((job) => (
                  <li key={job.id}>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="block rounded-md border border-border bg-surface px-3 py-2 hover:border-primary/40 transition-colors"
                    >
                      <p className="text-sm font-medium text-foreground">{job.title}</p>
                      <p className="text-xs text-foreground-muted">{job.company}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Recommended for you</h2>
            <p className="text-sm text-foreground-muted">Based on your skills and preferences</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </div>
  )
}
