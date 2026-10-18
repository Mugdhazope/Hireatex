'use client'

import { useRecruitmentStore } from '@/lib/recruitment-store'
import { formatRelativeTime, getStatusLabel } from '@/lib/utils'
import type { AuditEvent } from '@/types'

export function AuditTimeline({
  events,
  emptyMessage = 'No activity yet.',
}: {
  events: AuditEvent[]
  emptyMessage?: string
}) {
  const store = useRecruitmentStore()

  if (events.length === 0) {
    return <p className="text-sm text-foreground-muted">{emptyMessage}</p>
  }

  return (
    <ol className="space-y-4">
      {events.map((event) => {
        const actor = store.getHrUser(event.actorHrId)
        return (
          <li key={event.id} className="relative pl-4 border-l-2 border-border">
            <p className="text-sm text-foreground">
              <span className="font-medium">{actor?.fullName ?? 'HR'}</span>
              {event.action === 'status_change' && event.toStatus ? (
                <>
                  {' '}
                  moved to{' '}
                  <span className="font-medium">
                    {getStatusLabel(event.toStatus, 'hr')}
                  </span>
                </>
              ) : (
                <> — {event.note ?? event.action.replace(/_/g, ' ')}</>
              )}
            </p>
            {event.note && event.action === 'status_change' && (
              <p className="text-sm text-foreground-muted mt-0.5">{event.note}</p>
            )}
            {event.action === 'note_added' && event.note && (
              <p className="text-sm text-foreground-muted mt-0.5 italic">
                &ldquo;{event.note}&rdquo;
              </p>
            )}
            <p className="text-xs text-foreground-muted mt-1">
              {formatRelativeTime(event.timestamp)}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
