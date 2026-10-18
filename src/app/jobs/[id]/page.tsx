import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { JobDetailClient } from './job-detail-client'

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="text-sm text-foreground-muted">Loading…</div>}>
            <JobDetailClient jobId={id} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
