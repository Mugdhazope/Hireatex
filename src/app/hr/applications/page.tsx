import { HRSidebar } from '@/components/layout/hr-sidebar'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/common/status-badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { applications } from '@/data/applications'
import { jobs } from '@/data/jobs'
import { candidates } from '@/data/candidates'
import { formatDate } from '@/lib/utils'
import { Search } from 'lucide-react'

export default function HRApplicationsPage() {
  return (
    <>
      <HRSidebar />
      <div className="lg:pl-64">
        <main className="py-8">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PageHeader
              title="Applications"
              description={`${applications.length} total applications`}
            />

            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <Input placeholder="Search candidates..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs.slice(0, 5).map(job => (
                    <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {applications.map((app) => {
                const candidate = candidates.find(c => c.id === app.candidateId)
                const job = jobs.find(j => j.id === app.jobId)
                if (!candidate || !job) return null

                return (
                  <Card key={app.id}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{candidate.fullName}</h3>
                          <p className="text-sm text-foreground-muted mb-2">{job.title} at {job.company}</p>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-foreground-subtle">
                            <span>Applied {formatDate(app.appliedDate)}</span>
                            <span>•</span>
                            <span>{candidate.experience.length}+ years exp</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={app.status} />
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button size="sm">Shortlist</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
