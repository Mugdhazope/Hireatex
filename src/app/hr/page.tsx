import Link from 'next/link'
import { HRSidebar } from '@/components/layout/hr-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { applications } from '@/data/applications'
import { jobs } from '@/data/jobs'
import { StatusBadge } from '@/components/common/status-badge'
import { candidates } from '@/data/candidates'
import { formatRelativeTime } from '@/lib/utils'
import { Plus, FileText } from 'lucide-react'

export default function HRDashboard() {
  const activeJobs = jobs.filter(j => j.status === 'active')
  const newApplications = applications.filter(a => a.status === 'applied')
  const underReview = applications.filter(a => a.status === 'under_review')
  const shortlisted = applications.filter(a => a.status === 'shortlisted')
  const forwarded = applications.filter(a => a.status === 'forwarded')
  
  const recentApplications = applications.slice(0, 10)

  return (
    <>
      <HRSidebar />
      <div className="lg:pl-64">
        <main className="py-8">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
                Overview
              </h1>
              <p className="text-foreground-muted">
                Manage your recruitment pipeline
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 mb-8">
              <Button asChild>
                <Link href="/hr/jobs/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Job
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/hr/applications">
                  <FileText className="mr-2 h-4 w-4" />
                  View Applications
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground-muted">Active Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-foreground">{activeJobs.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground-muted">New Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-foreground">{newApplications.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground-muted">Under Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-foreground">{underReview.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground-muted">Shortlisted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-foreground">{shortlisted.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground-muted">Forwarded</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-foreground">{forwarded.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Applications</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/hr/applications">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((app) => {
                    const candidate = candidates.find(c => c.id === app.candidateId)
                    const job = jobs.find(j => j.id === app.jobId)
                    if (!candidate || !job) return null

                    return (
                      <div key={app.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{candidate.fullName}</p>
                          <p className="text-sm text-foreground-muted">{job.title}</p>
                          <p className="text-xs text-foreground-subtle">{formatRelativeTime(app.appliedDate)}</p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  )
}
