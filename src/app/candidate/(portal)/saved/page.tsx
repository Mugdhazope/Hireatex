'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/common/page-header'
import { JobCard } from '@/components/jobs/job-card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/empty-state'
import { useAuth } from '@/lib/mock-auth'
import { useCandidateStore } from '@/lib/candidate-store'

export default function SavedJobsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const store = useCandidateStore()
  const candidateId = user?.candidateId || user?.id || ''
  const saved = store.getSavedJobsForCandidate(candidateId)

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Saved Jobs"
        description={`${saved.length} saved`}
        actions={
          <Button variant="outline" asChild>
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        }
      />

      {saved.length === 0 ? (
        <EmptyState
          title="No saved jobs"
          description="Save roles you want to revisit later."
          action={{
            label: 'Explore Jobs',
            onClick: () => router.push('/jobs'),
          }}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
