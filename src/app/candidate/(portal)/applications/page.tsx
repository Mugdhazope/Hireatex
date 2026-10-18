'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/status-badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/empty-state'
import { useAuth } from '@/lib/mock-auth'
import { useCandidateStore } from '@/lib/candidate-store'
import { formatDate } from '@/lib/utils'
import { CANDIDATE_STATUS_LABELS, type ApplicationStatus } from '@/types'

export default function ApplicationsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const store = useCandidateStore()
  const candidateId = user?.candidateId || user?.id || ''
  const apps = store.getApplicationWithJob(candidateId)
  const [status, setStatus] = useState<string>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (status === 'all') return apps
    return apps.filter((a) => a.status === status)
  }, [apps, status])

  const selected = apps.find((a) => a.id === selectedId)

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="My Applications"
        description={`${apps.length} application${apps.length === 1 ? '' : 's'}`}
      />

      <div className="mb-6">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {(
              [
                'applied',
                'under_review',
                'shortlisted',
                'forwarded',
                'interview',
                'selected',
                'rejected',
              ] as ApplicationStatus[]
            ).map((s) => (
              <SelectItem key={s} value={s}>
                {CANDIDATE_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No applications"
          description="When you apply to jobs, they will show up here."
          action={{
            label: 'Explore Jobs',
            onClick: () => router.push('/jobs'),
          }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <Card key={app.id} className="shadow-none">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <Link
                      href={`/jobs/${app.job.id}`}
                      className="text-lg font-semibold text-foreground hover:text-primary"
                    >
                      {app.job.title}
                    </Link>
                    <p className="text-foreground-muted">{app.job.company}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-foreground-subtle">
                      <span>Applied {formatDate(app.appliedDate)}</span>
                      <span>·</span>
                      <span>{app.job.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedId(app.id)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selected?.job.title}</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-foreground-muted">Company</p>
                <p className="font-medium text-foreground">{selected.job.company}</p>
              </div>
              <div>
                <p className="text-foreground-muted">Status</p>
                <StatusBadge status={selected.status} />
              </div>
              <div>
                <p className="text-foreground-muted">Applied</p>
                <p className="text-foreground">{formatDate(selected.appliedDate)}</p>
              </div>
              <div>
                <p className="text-foreground-muted">Resume</p>
                <p className="text-foreground">{selected.resumeUrl}</p>
              </div>
              {selected.coverLetter && (
                <div>
                  <p className="text-foreground-muted">Cover letter</p>
                  <p className="whitespace-pre-wrap text-foreground">
                    {selected.coverLetter}
                  </p>
                </div>
              )}
              <Button asChild className="w-full">
                <Link href={`/jobs/${selected.job.id}`}>View Job</Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
