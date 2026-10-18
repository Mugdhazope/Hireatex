'use client'

import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, Clock, Bookmark } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { useAuth } from '@/lib/mock-auth'
import { useCandidateStore } from '@/lib/candidate-store'
import type { Job } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const { user } = useAuth()
  const store = useCandidateStore()
  const candidateId = user?.role === 'candidate' ? user.candidateId || user.id : null
  const saved = candidateId ? store.isJobSaved(candidateId, job.id) : false

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!candidateId) {
      toast.message('Sign in to save jobs')
      return
    }
    store.toggleSaveJob(candidateId, job.id)
    toast.success(saved ? 'Removed from saved' : 'Job saved')
  }

  return (
    <Card className="group shadow-none transition-all hover:border-primary/30 hover:shadow-sm">
      <CardContent className="pt-6">
        <div className="mb-2 flex items-start justify-between gap-2">
          <Link href={`/jobs/${job.id}`} className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
              {job.title}
            </h3>
          </Link>
          <button
            type="button"
            onClick={toggleSave}
            className={cn(
              'rounded-md p-1.5 text-foreground-muted transition-colors hover:bg-background-muted hover:text-primary',
              saved && 'text-primary'
            )}
            aria-label={saved ? 'Unsave job' : 'Save job'}
          >
            <Bookmark className={cn('h-4 w-4', saved && 'fill-current')} />
          </button>
        </div>

        <p className="mb-3 text-base font-medium text-foreground-muted">{job.company}</p>

        <div className="mb-4 flex flex-wrap gap-3 text-sm text-foreground-muted">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4" />
            <span className="capitalize">{job.experienceLevel.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{formatRelativeTime(job.postedDate)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="capitalize font-normal">
            {job.jobType.replace('-', ' ')}
          </Badge>
          {job.skills.slice(0, 2).map((skill) => (
            <Badge key={skill.id} variant="outline" className="font-normal">
              {skill.name}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          asChild
          variant="outline"
          className="w-full border-border bg-surface text-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Link href={`/jobs/${job.id}`}>View Job</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
