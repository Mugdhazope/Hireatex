import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/common/page-header'
import { FilterBar } from '@/components/jobs/filter-bar'
import { JobCard } from '@/components/jobs/job-card'
import { jobs } from '@/data/jobs'

export default function JobsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Find your next opportunity"
            description="Explore positions in pharma, healthcare, and life sciences"
          />

          <FilterBar />

          <div className="mt-8">
            <p className="text-sm text-foreground-muted mb-4">
              Showing {jobs.length} jobs
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
