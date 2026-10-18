'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { StatusBadge } from '@/components/common/status-badge'
import { AuditTimeline } from '@/components/hr/audit-timeline'
import { useAuth } from '@/lib/mock-auth'
import { useRecruitmentStore } from '@/lib/recruitment-store'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import type { Application, ApplicationStatus, Candidate, Job } from '@/types'
import { Bookmark, Forward } from 'lucide-react'

const STAGE_FLOW: ApplicationStatus[] = [
  'applied',
  'under_review',
  'shortlisted',
  'interview',
  'selected',
]

type AppDetail = Application & { candidate: Candidate; job: Job }

interface CandidateDrawerProps {
  app: AppDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CandidateDrawer({ app, open, onOpenChange }: CandidateDrawerProps) {
  const { user } = useAuth()
  const store = useRecruitmentStore()
  const hrId = user?.hrId ?? user?.id ?? ''
  const [note, setNote] = useState('')
  const [rejectOpen, setRejectOpen] = useState(false)

  if (!app) return null

  const audit = store.getAuditForApplication(app.id)
  const activeHrs = store.hrUsers.filter((u) => u.active && u.role === 'hr')
  const savedByMe = (app.savedForLaterBy ?? []).includes(hrId)

  const setStatus = (status: ApplicationStatus, message?: string) => {
    store.setApplicationStatus(app.id, status, hrId, message)
    toast.success(message ?? `Moved to ${status.replace(/_/g, ' ')}`)
  }

  const advance = () => {
    const idx = STAGE_FLOW.indexOf(
      app.status === 'saved_for_later' ? 'applied' : app.status
    )
    const next = STAGE_FLOW[Math.min(idx + 1, STAGE_FLOW.length - 1)]
    if (next === app.status) {
      toast.message('Already at final stage')
      return
    }
    setStatus(next)
  }

  const addNote = () => {
    if (!note.trim()) return
    store.addInternalNote(app.id, note.trim(), hrId)
    setNote('')
    toast.success('Note added')
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-surface p-0">
          <div className="p-6 space-y-6">
            <SheetHeader>
              <SheetTitle className="text-left text-xl">
                {app.candidate.fullName}
              </SheetTitle>
              <p className="text-sm text-foreground-muted text-left">
                {app.candidate.headline || app.candidate.email}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <StatusBadge status={app.status} />
                <span className="text-xs text-foreground-muted">
                  Applied {formatDate(app.appliedDate)}
                </span>
              </div>
            </SheetHeader>

            <section>
              <h3 className="text-sm font-semibold text-foreground mb-2">Role</h3>
              <p className="text-sm text-foreground">{app.job.title}</p>
              <p className="text-xs text-foreground-muted">
                {app.job.company} · {app.job.location}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-foreground mb-2">Contact</h3>
              <p className="text-sm text-foreground-muted">{app.candidate.email}</p>
              <p className="text-sm text-foreground-muted">{app.candidate.phone}</p>
              {app.candidate.location && (
                <p className="text-sm text-foreground-muted">{app.candidate.location}</p>
              )}
            </section>

            {app.candidate.skills.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-foreground mb-2">Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {app.candidate.skills.map((s) => (
                    <Badge key={s.id} variant="outline" className="font-normal">
                      {s.name}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {app.candidate.experience.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-foreground mb-2">Experience</h3>
                <ul className="space-y-2">
                  {app.candidate.experience.slice(0, 3).map((exp) => (
                    <li key={exp.id} className="text-sm">
                      <p className="font-medium text-foreground">{exp.title}</p>
                      <p className="text-foreground-muted">{exp.company}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {app.candidate.education.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-foreground mb-2">Education</h3>
                <ul className="space-y-1">
                  {app.candidate.education.map((edu) => (
                    <li key={edu.id} className="text-sm text-foreground-muted">
                      {edu.degree} in {edu.field} — {edu.institution}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h3 className="text-sm font-semibold text-foreground mb-2">Resume</h3>
              <p className="text-sm text-foreground-muted">{app.resumeUrl}</p>
            </section>

            {app.coverLetter && (
              <section>
                <h3 className="text-sm font-semibold text-foreground mb-2">Cover letter</h3>
                <p className="text-sm text-foreground-muted whitespace-pre-wrap">
                  {app.coverLetter}
                </p>
              </section>
            )}

            <section className="space-y-3 border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-foreground">Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={advance}>
                  Advance stage
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStatus('shortlisted', 'Shortlisted')}
                >
                  Shortlist
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStatus('interview', 'Moved to interview')}
                >
                  Interview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStatus('selected', 'Offered')}
                >
                  Offer
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setRejectOpen(true)}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    store.toggleSavedForLater(app.id, hrId)
                    toast.success(savedByMe ? 'Removed from saved' : 'Saved for later')
                  }}
                >
                  <Bookmark className="h-3.5 w-3.5 mr-1" />
                  {savedByMe ? 'Unsave' : 'Save later'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setStatus('forwarded', 'Forwarded to company')}
                >
                  <Forward className="h-3.5 w-3.5 mr-1" />
                  Forward
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Assign HR</Label>
                <Select
                  value={app.assignedHrId ?? ''}
                  onValueChange={(v) => {
                    store.assignHr(app.id, v, hrId)
                    toast.success('Assigned')
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select HR" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface">
                    {activeHrs.map((hr) => (
                      <SelectItem key={hr.id} value={hr.id}>
                        {hr.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>

            <section className="space-y-2 border-t border-border pt-4">
              <Label htmlFor="internal-note">Internal note</Label>
              <Textarea
                id="internal-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Visible to all HR — never to candidates"
                className="bg-background"
              />
              <Button size="sm" onClick={addNote} disabled={!note.trim()}>
                Add note
              </Button>
              {app.internalNotes && (
                <div className="mt-2 rounded-md bg-background-muted p-3 text-sm text-foreground-muted whitespace-pre-wrap">
                  {app.internalNotes}
                </div>
              )}
            </section>

            <section className="border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Audit timeline
              </h3>
              <AuditTimeline events={audit} />
            </section>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <AlertDialogContent className="bg-surface">
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this candidate?</AlertDialogTitle>
            <AlertDialogDescription>
              {app.candidate.fullName} will be marked rejected for {app.job.title}.
              They will only see the status — not who rejected them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setStatus('rejected', 'Rejected')
                setRejectOpen(false)
              }}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
