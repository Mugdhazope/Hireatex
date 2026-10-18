'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
import { useAuth } from '@/lib/mock-auth'
import { useRecruitmentStore } from '@/lib/recruitment-store'
import { formatDate } from '@/lib/utils'
import { Plus, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import type { Job } from '@/types'

export default function HRJobsPage() {
  const { user } = useAuth()
  const store = useRecruitmentStore()
  const hrId = user?.hrId ?? user?.id ?? ''
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [confirm, setConfirm] = useState<{
    job: Job
    action: 'unpublish' | 'close'
  } | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return store.jobs
      .filter((j) => {
        if (status !== 'all' && j.status !== status) return false
        if (q) {
          const hay = `${j.title} ${j.company} ${j.location}`.toLowerCase()
          if (!hay.includes(q)) return false
        }
        return true
      })
      .sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime())
  }, [store.jobs, query, status])

  const runConfirm = () => {
    if (!confirm || !hrId) return
    if (confirm.action === 'unpublish') {
      store.unpublishJob(confirm.job.id, hrId)
      toast.success('Job unpublished')
    } else {
      store.closeJob(confirm.job.id, hrId)
      toast.success('Job closed')
    }
    setConfirm(null)
  }

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Jobs
            </h1>
            <p className="text-foreground-muted">Create, publish, and manage openings</p>
          </div>
          <Button asChild>
            <Link href="/hr/jobs/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Job
            </Link>
          </Button>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search jobs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="sm:max-w-xs bg-surface"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-44 bg-surface">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-surface">
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-background-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Location</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Apps</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Posted</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-foreground-muted">
                    No jobs found.
                  </td>
                </tr>
              ) : (
                filtered.map((job) => (
                  <tr key={job.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{job.title}</p>
                      <p className="text-xs text-foreground-muted">{job.company}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-foreground-muted">
                      {job.location}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="capitalize">
                        {job.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {job.applicationCount ??
                        store.applications.filter((a) => a.jobId === job.id).length}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-foreground-muted">
                      {formatDate(job.postedDate)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/hr/jobs/${job.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        {job.status !== 'active' && job.status !== 'closed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              store.publishJob(job.id, hrId)
                              toast.success('Job published')
                            }}
                          >
                            Publish
                          </Button>
                        )}
                        {job.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setConfirm({ job, action: 'unpublish' })}
                          >
                            Unpublish
                          </Button>
                        )}
                        {job.status !== 'closed' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirm({ job, action: 'close' })}
                          >
                            Close
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent className="bg-surface">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.action === 'close' ? 'Close this job?' : 'Unpublish this job?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.action === 'close'
                ? `"${confirm?.job.title}" will no longer accept applications.`
                : `"${confirm?.job.title}" will be hidden from the public jobs board.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={runConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
