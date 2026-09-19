import Link from 'next/link'
import { HRSidebar } from '@/components/layout/hr-sidebar'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { jobs } from '@/data/jobs'
import { Plus, Search } from 'lucide-react'

export default function HRJobsPage() {
  return (
    <>
      <HRSidebar />
      <div className="lg:pl-64">
        <main className="py-8">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PageHeader
              title="Jobs"
              description="Manage job postings"
              actions={
                <Button asChild>
                  <Link href="/hr/jobs/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Job
                  </Link>
                </Button>
              }
            />

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <Input placeholder="Search jobs..." className="pl-10" />
              </div>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                          <Badge variant={job.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-foreground-muted mb-2">{job.company}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-subtle">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.applicationCount || 0} applications</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/jobs/${job.id}`}>View</Link>
                        </Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
