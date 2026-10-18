'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle } from 'lucide-react'
import { useAuth } from '@/lib/mock-auth'
import { useCandidateStore } from '@/lib/candidate-store'
import { useMediaQuery } from '@/hooks/use-media-query'
import type { Job } from '@/types'
import { toast } from 'sonner'

interface ApplyJobDialogProps {
  job: Job
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ApplyForm({
  job,
  onOpenChange,
}: {
  job: Job
  onOpenChange: (open: boolean) => void
}) {
  const store = useCandidateStore()
  const { user } = useAuth()
  const candidateId = user?.candidateId || user?.id || ''
  const candidate = store.getCandidate(candidateId)
  const alreadyApplied = store.hasApplied(candidateId, job.id)
  const defaultResume =
    candidate?.resumes.find((r) => r.isDefault) || candidate?.resumes[0]

  const [fullName, setFullName] = useState(candidate?.fullName || '')
  const [phone, setPhone] = useState(candidate?.phone || '')
  const [email, setEmail] = useState(candidate?.email || '')
  const [resumeId, setResumeId] = useState(defaultResume?.id || '')
  const [coverLetter, setCoverLetter] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!candidateId) return
    if (alreadyApplied) {
      toast.error('You already applied to this job.')
      return
    }
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      toast.error('Name, email, and phone are required.')
      return
    }
    if (!resumeId && !candidate?.resumeUrl) {
      toast.error('Add a resume in your profile before applying.')
      return
    }

    setSubmitting(true)
    const resume = candidate?.resumes.find((r) => r.id === resumeId)
    const result = store.submitApplication({
      candidateId,
      jobId: job.id,
      resumeId: resume?.id,
      resumeUrl: resume?.name || candidate?.resumeUrl || 'resume.pdf',
      coverLetter: coverLetter.trim() || undefined,
    })
    setSubmitting(false)

    if ('error' in result) {
      toast.error(result.error)
      return
    }

    store.updateCandidate(candidateId, { fullName, email, phone })
    setDone(true)
    toast.success('Application submitted')
  }

  if (alreadyApplied && !done) {
    return (
      <div className="space-y-4 py-2">
        <p className="text-sm text-foreground-muted">
          You already applied to this role. Track it in My Applications.
        </p>
        <Button asChild className="w-full">
          <Link href="/candidate/applications">View Applications</Link>
        </Button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="space-y-4 py-4 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-success" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">You&apos;re all set</h3>
          <p className="mt-1 text-sm text-foreground-muted">
            Your application for {job.title} was submitted.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link href="/candidate/applications">View Application</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/jobs" onClick={() => onOpenChange(false)}>
              Explore More Jobs
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="apply-name">Full name</Label>
        <Input
          id="apply-name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="apply-phone">Phone</Label>
        <Input
          id="apply-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="apply-email">Email</Label>
        <Input
          id="apply-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Resume</Label>
        {candidate?.resumes.length ? (
          <Select value={resumeId} onValueChange={setResumeId}>
            <SelectTrigger>
              <SelectValue placeholder="Select resume" />
            </SelectTrigger>
            <SelectContent>
              {candidate.resumes.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                  {r.isDefault ? ' (default)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm text-foreground-muted">
            No resume on file.{' '}
            <Link href="/candidate/profile#resumes" className="text-primary hover:underline">
              Upload one
            </Link>
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="cover">Cover letter (optional)</Label>
        <Textarea
          id="cover"
          rows={4}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="A short note for the hiring team"
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={submitting || (!resumeId && !candidate?.resumeUrl)}
      >
        {submitting ? 'Submitting…' : 'Submit Application'}
      </Button>
    </form>
  )
}

export function ApplyJobDialog({ job, open, onOpenChange }: ApplyJobDialogProps) {
  const router = useRouter()
  const { user, ready } = useAuth()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isCandidate = ready && user?.role === 'candidate'

  useEffect(() => {
    if (!open || !ready) return
    if (!isCandidate) {
      onOpenChange(false)
      router.push(
        `/candidate/login?next=${encodeURIComponent(`/jobs/${job.id}?apply=1`)}`
      )
    }
  }, [open, ready, isCandidate, job.id, onOpenChange, router])

  if (!isCandidate) return null

  const body = open ? (
    <ApplyForm key={`${job.id}-${String(open)}`} job={job} onOpenChange={onOpenChange} />
  ) : null

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Apply — {job.title}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">{body}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply — {job.title}</DialogTitle>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  )
}
