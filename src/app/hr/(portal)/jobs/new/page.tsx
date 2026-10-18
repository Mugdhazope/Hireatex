'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { JobForm, valuesToJobPatch, type JobFormValues } from '@/components/hr/job-form'
import { useAuth } from '@/lib/mock-auth'
import { useRecruitmentStore } from '@/lib/recruitment-store'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

export default function NewJobPage() {
  const router = useRouter()
  const { user } = useAuth()
  const store = useRecruitmentStore()
  const hrId = user?.hrId ?? user?.id ?? ''

  const handleSaveDraft = (values: JobFormValues) => {
    const patch = valuesToJobPatch(values)
    const job = store.createJob({ ...patch, status: 'draft' }, hrId)
    toast.success('Draft saved')
    router.push(`/hr/jobs/${job.id}/edit`)
  }

  const handlePublish = (values: JobFormValues) => {
    const patch = valuesToJobPatch(values)
    store.createJob({ ...patch, status: 'active' }, hrId)
    toast.success('Job published — live on public board')
    router.push('/hr/jobs')
  }

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/hr/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to jobs
          </Link>
        </Button>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
          Create job
        </h1>
        <p className="text-foreground-muted mb-8">
          Save as draft or publish immediately to the public jobs board.
        </p>
        <div className="rounded-lg border border-border bg-surface p-6">
          <JobForm onSaveDraft={handleSaveDraft} onPublish={handlePublish} />
        </div>
      </div>
    </main>
  )
}
