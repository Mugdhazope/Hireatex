'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/status-badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { applications } from '@/data/applications'
import { jobs } from '@/data/jobs'
import { formatDate } from '@/lib/utils'

export default function ApplicationsPage() {
  const candidateApps = applications.filter(app => app.candidateId === 'cand-1')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="My Applications"
            description={`You have ${candidateApps.length} active applications`}
          />

          <div className="mb-6 flex gap-3">
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {candidateApps.map((app) => {
              const job = jobs.find(j => j.id === app.jobId)
              if (!job) return null

              return (
                <Card key={app.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <Link href={`/jobs/${job.id}`} className="hover:text-primary transition-colors">
                          <h3 className="text-lg font-semibold text-foreground mb-1">{job.title}</h3>
                        </Link>
                        <p className="text-foreground-muted mb-3">{job.company}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-subtle">
                          <span>Applied {formatDate(app.appliedDate)}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={app.status} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
