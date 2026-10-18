'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JobMeta } from '@/components/jobs/job-meta'
import { ApplyJobDialog } from '@/components/jobs/apply-job-dialog'
import { formatDate, cn } from '@/lib/utils'
import { useAuth } from '@/lib/mock-auth'
import { useRecruitmentStore } from '@/lib/recruitment-store'
import { Bookmark } from 'lucide-react'
import { toast } from 'sonner'

export function JobDetailClient({ jobId }: { jobId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const store = useRecruitmentStore()
  const job = store.getJob(jobId)

  const autoApply =
    searchParams.get('apply') === '1' && user?.role === 'candidate'
  const [applyOpen, setApplyOpen] = useState(autoApply)
  const [autoDismissed, setAutoDismissed] = useState(false)

  if (!store.ready) {
    return <p className="text-sm text-foreground-muted">Loading…</p>
  }

  if (!job || job.status !== 'active') {
    return (
      <div className="py-12 text-center">
        <p className="text-foreground-muted mb-4">
          This job is unavailable or no longer active.
        </p>
        <Button asChild variant="outline">
          <Link href="/jobs">Browse jobs</Link>
        </Button>
      </div>
    )
  }

  const candidateId = user?.role === 'candidate' ? user.candidateId || user.id : null
  const saved = candidateId ? store.isJobSaved(candidateId, job.id) : false
  const applied = candidateId ? store.hasApplied(candidateId, job.id) : false
  const dialogOpen = applyOpen || (autoApply && !autoDismissed)

  const handleApply = () => {
    if (!user || user.role !== 'candidate') {
      router.push(
        `/candidate/login?next=${encodeURIComponent(`/jobs/${job.id}?apply=1`)}`
      )
      return
    }
    setApplyOpen(true)
  }

  const handleDialogChange = (open: boolean) => {
    setApplyOpen(open)
    if (!open) setAutoDismissed(true)
  }

  const toggleSave = () => {
    if (!candidateId) {
      toast.message('Sign in to save jobs')
      return
    }
    store.toggleSaveJob(candidateId, job.id)
    toast.success(saved ? 'Removed from saved' : 'Job saved')
  }

  return (
    <>
      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {job.title}
        </h1>
        <p className="mb-4 text-xl text-foreground-muted">{job.company}</p>
        <JobMeta job={job} className="mb-4" />
        <p className="mb-6 text-sm text-foreground-subtle">
          Posted {formatDate(job.postedDate)}
        </p>
        <div className="hidden items-center gap-3 md:flex">
          <Button size="lg" onClick={handleApply} disabled={applied}>
            {applied ? 'Already Applied' : 'Apply Now'}
          </Button>
          <Button variant="outline" size="lg" onClick={toggleSave}>
            <Bookmark className={cn('h-4 w-4', saved && 'fill-current text-primary')} />
            {saved ? 'Saved' : 'Save'}
          </Button>
          {applied && (
            <Link
              href="/candidate/applications"
              className="text-sm text-primary hover:underline"
            >
              View application
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-8 pb-28 md:pb-8">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">About the role</h2>
          <p className="leading-relaxed text-foreground-muted">{job.about}</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">What you&apos;ll do</h2>
          <ul className="space-y-2">
            {job.responsibilities.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="mt-1.5 text-primary">•</span>
                <span className="text-foreground-muted">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            What we&apos;re looking for
          </h2>
          <ul className="space-y-2">
            {job.requirements.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="mt-1.5 text-primary">•</span>
                <span className="text-foreground-muted">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">Qualifications</h2>
          <p className="mb-3 text-foreground-muted">{job.qualificationDescription}</p>
          <div className="flex flex-wrap gap-2">
            {job.qualifications.map((qual) => (
              <Badge key={qual} variant="secondary" className="capitalize font-normal">
                {qual.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Badge key={skill.id} variant="outline" className="font-normal">
                {skill.name}
              </Badge>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background p-4 md:hidden">
        <div className="flex gap-2">
          <Button className="flex-1" size="lg" onClick={handleApply} disabled={applied}>
            {applied ? 'Already Applied' : 'Apply Now'}
          </Button>
          <Button variant="outline" size="lg" onClick={toggleSave}>
            <Bookmark className={cn('h-4 w-4', saved && 'fill-current')} />
          </Button>
        </div>
      </div>

      <ApplyJobDialog job={job} open={dialogOpen} onOpenChange={handleDialogChange} />
    </>
  )
}
