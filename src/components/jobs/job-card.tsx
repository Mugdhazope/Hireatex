import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, Clock } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import type { Job } from '@/types'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <Link href={`/jobs/${job.id}`} className="group">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
            {job.title}
          </h3>
        </Link>
        
        <p className="text-base font-medium text-foreground-muted mb-3">
          {job.company}
        </p>

        <div className="flex flex-wrap gap-3 text-sm text-foreground-muted mb-4">
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
          <Badge variant="secondary" className="capitalize">
            {job.jobType.replace('-', ' ')}
          </Badge>
          {job.skills.slice(0, 3).map((skill) => (
            <Badge key={skill.id} variant="outline">
              {skill.name}
            </Badge>
          ))}
          {job.skills.length > 3 && (
            <Badge variant="outline">
              +{job.skills.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/jobs/${job.id}`}>View Job</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
