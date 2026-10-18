import { Badge } from '@/components/ui/badge'
import { getStatusColor, getStatusLabel } from '@/lib/utils'
import type { ApplicationStatus } from '@/types'

interface StatusBadgeProps {
  status: ApplicationStatus
  audience?: 'hr' | 'candidate'
}

export function StatusBadge({ status, audience = 'candidate' }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={getStatusColor(status)}>
      {getStatusLabel(status, audience)}
    </Badge>
  )
}
