import { Badge } from '@/components/ui/badge'
import { getStatusColor, getStatusLabel } from '@/lib/utils'
import type { ApplicationStatus } from '@/types'

interface StatusBadgeProps {
  status: ApplicationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={getStatusColor(status)}>
      {getStatusLabel(status)}
    </Badge>
  )
}
