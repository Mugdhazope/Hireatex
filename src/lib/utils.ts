import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ApplicationStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting helpers
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(d)
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 30) return formatDate(d)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

// Status badge helpers
export function getStatusColor(status: ApplicationStatus): string {
  switch (status) {
    case 'applied':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'under_review':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'shortlisted':
      return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'forwarded':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200'
    case 'interview':
      return 'bg-cyan-100 text-cyan-700 border-cyan-200'
    case 'selected':
      return 'bg-green-100 text-green-700 border-green-200'
    case 'rejected':
      return 'bg-red-100 text-red-700 border-red-200'
    case 'saved_for_later':
      return 'bg-orange-100 text-orange-700 border-orange-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export function getStatusLabel(status: ApplicationStatus, audience: 'hr' | 'candidate' = 'candidate'): string {
  if (audience === 'hr') {
    switch (status) {
      case 'applied':
        return 'New'
      case 'under_review':
        return 'Under Review'
      case 'shortlisted':
        return 'Shortlisted'
      case 'forwarded':
        return 'Forwarded'
      case 'interview':
        return 'Interview'
      case 'selected':
        return 'Offered'
      case 'rejected':
        return 'Rejected'
      case 'saved_for_later':
        return 'Saved for Later'
      default:
        return status
    }
  }
  switch (status) {
    case 'applied':
      return 'Applied'
    case 'under_review':
      return 'Under Review'
    case 'shortlisted':
      return 'Shortlisted'
    case 'forwarded':
      return 'Forwarded'
    case 'interview':
      return 'Interview'
    case 'selected':
      return 'Offered'
    case 'rejected':
      return 'Rejected'
    case 'saved_for_later':
      return 'Under Review'
    default:
      return status
  }
}
