'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/common/page-header'
import { FilterBar, type JobFilters } from '@/components/jobs/filter-bar'
import { JobCard } from '@/components/jobs/job-card'
import { EmptyState } from '@/components/common/empty-state'
import { useRecruitmentStore } from '@/lib/recruitment-store'

const emptyFilters: JobFilters = {
  query: '',
  location: '',
  experience: '',
  jobType: '',
  category: '',
}

export default function JobsPage() {
  const store = useRecruitmentStore()
  const [filters, setFilters] = useState<JobFilters>(emptyFilters)

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    const loc = filters.location.trim().toLowerCase()
    return store.jobs.filter((job) => {
      if (job.status !== 'active') return false
      if (filters.experience && job.experienceLevel !== filters.experience) return false
      if (filters.jobType && job.jobType !== filters.jobType) return false
      if (filters.category && job.category !== filters.category) return false
      if (loc && !job.location.toLowerCase().includes(loc)) return false
      if (q) {
        const hay = [
          job.title,
          job.company,
          job.about,
          ...job.skills.map((s) => s.name),
        ]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [filters, store.jobs])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Find your next opportunity"
            description="Explore positions in pharma, healthcare, and life sciences"
          />
          <FilterBar filters={filters} onChange={setFilters} />
          <div className="mt-8">
            <p className="mb-4 text-sm text-foreground-muted">
              Showing {filtered.length} job{filtered.length === 1 ? '' : 's'}
            </p>
            {!store.ready ? (
              <p className="text-sm text-foreground-muted">Loading jobs…</p>
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No jobs match"
                description="Try adjusting your search or filters."
                action={{ label: 'Clear filters', onClick: () => setFilters(emptyFilters) }}
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
