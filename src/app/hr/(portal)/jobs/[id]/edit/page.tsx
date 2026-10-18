'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { JobForm, valuesToJobPatch, type JobFormValues } from '@/components/hr/job-form'
import { useAuth } from '@/lib/mock-auth'
import { useRecruitmentStore } from '@/lib/recruitment-store'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

export default function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const store = useRecruitmentStore()
  const hrId = user?.hrId ?? user?.id ?? ''
  const job = store.getJob(id)

  if (!store.ready) {
    return (
      <main className="py-8">
        <div className="container mx-auto max-w-3xl px-4 text-foreground-muted">
          Loading…
        </div>
      </main>
    )
  }

  if (!job) {
    return (
      <main className="py-8">
        <div className="container mx-auto max-w-3xl px-4">
          <p className="text-foreground-muted mb-4">Job not found.</p>
          <Button asChild>
            <Link href="/hr/jobs">Back to jobs</Link>
          </Button>
        </div>
      </main>
    )
  }

  const handleSaveDraft = (values: JobFormValues) => {
    const patch = valuesToJobPatch(values)
    store.updateJob(id, { ...patch, status: job.status === 'active' ? 'active' : 'draft' }, hrId)
    toast.success('Job updated')
  }

  const handlePublish = (values: JobFormValues) => {
    const patch = valuesToJobPatch(values)
    store.updateJob(id, patch, hrId)
    store.publishJob(id, hrId)
    toast.success('Job published')
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
          Edit job
        </h1>
        <p className="text-foreground-muted mb-8">{job.title}</p>
        <div className="rounded-lg border border-border bg-surface p-6">
          <JobForm
            initial={job}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
          />
        </div>
      </div>
    </main>
  )
}
