import { MapPin, Briefcase, Clock } from 'lucide-react'
import type { Job } from '@/types'

interface JobMetaProps {
  job: Job
  className?: string
}

export function JobMeta({ job, className }: JobMetaProps) {
  return (
    <div className={`flex flex-wrap gap-4 text-sm text-foreground-muted ${className || ''}`}>
      <div className="flex items-center gap-1.5">
        <MapPin className="h-4 w-4 flex-shrink-0" />
        <span>{job.location}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Briefcase className="h-4 w-4 flex-shrink-0" />
        <span className="capitalize">{job.experienceLevel.replace('-', ' ')}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="h-4 w-4 flex-shrink-0" />
        <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
      </div>
    </div>
  )
}
