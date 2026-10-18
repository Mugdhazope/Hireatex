import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { jobs } from '@/data/jobs'
import { JobDetailClient } from './job-detail-client'

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params
  const job = jobs.find((j) => j.id === id)
  if (!job) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="text-sm text-foreground-muted">Loading…</div>}>
            <JobDetailClient job={job} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
