'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { JobCard } from '@/components/jobs/job-card'
import { useRecruitmentStore } from '@/lib/recruitment-store'
import { ArrowRight } from 'lucide-react'

export function FeaturedJobs() {
  const store = useRecruitmentStore()
  const featured = store.getActiveJobs().slice(0, 6)

  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
              Featured roles
            </h2>
            <p className="text-foreground-muted">
              Active openings from our recruitment partners
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/jobs">
              View all jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {!store.ready ? (
          <p className="text-sm text-foreground-muted">Loading…</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
