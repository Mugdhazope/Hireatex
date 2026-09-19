'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/status-badge'
import { applications } from '@/data/applications'
import { jobs } from '@/data/jobs'
import { formatDate } from '@/lib/utils'
import type { ApplicationStatus } from '@/types'

export default function CandidateDashboard() {
  // Mock: Get current candidate's applications
  const candidateApps = applications.filter(app => app.candidateId === 'cand-1')
  
  const statusCounts = {
    applied: candidateApps.filter(a => a.status === 'applied').length,
    under_review: candidateApps.filter(a => a.status === 'under_review').length,
    shortlisted: candidateApps.filter(a => a.status === 'shortlisted').length,
    interview: candidateApps.filter(a => a.status === 'interview').length,
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
              Welcome back, Sarah
            </h1>
            <p className="text-foreground-muted">
              Track your applications and explore new opportunities
            </p>
          </div>

          {/* Status Overview */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-semibold text-foreground">{statusCounts.applied}</div>
                <div className="text-sm text-foreground-muted">Applied</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-semibold text-foreground">{statusCounts.under_review}</div>
                <div className="text-sm text-foreground-muted">Under Review</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-semibold text-foreground">{statusCounts.shortlisted}</div>
                <div className="text-sm text-foreground-muted">Shortlisted</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-semibold text-foreground">{statusCounts.interview}</div>
                <div className="text-sm text-foreground-muted">Interview</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Applications */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Recent Applications</h2>
              <Button variant="outline" asChild>
                <Link href="/candidate/applications">View All</Link>
              </Button>
            </div>

            <div className="space-y-3">
              {candidateApps.slice(0, 5).map((app) => {
                const job = jobs.find(j => j.id === app.jobId)
                if (!job) return null

                return (
                  <Card key={app.id}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <Link href={`/jobs/${job.id}`} className="hover:text-primary transition-colors">
                            <h3 className="font-semibold text-foreground mb-1">{job.title}</h3>
                          </Link>
                          <p className="text-sm text-foreground-muted mb-2">{job.company}</p>
                          <div className="flex items-center gap-4 text-sm text-foreground-subtle">
                            <span>Applied {formatDate(app.appliedDate)}</span>
                          </div>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <Card className="bg-primary-subtle border-primary/20">
            <CardContent className="pt-6 text-center py-8">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Ready for your next opportunity?
              </h3>
              <p className="text-sm text-foreground-muted mb-4">
                Explore new job openings in clinical research
              </p>
              <Button asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
