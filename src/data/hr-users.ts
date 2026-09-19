import type { HRUser, AdminUser } from '@/types'

export const hrUsers: (HRUser | AdminUser)[] = [
  {
    id: 'hr-1',
    fullName: 'Rachel Morrison',
    email: 'rachel@hiretaex.com',
    role: 'admin',
    active: true,
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'hr-2',
    fullName: 'Marcus Thompson',
    email: 'marcus@hiretaex.com',
    role: 'hr',
    active: true,
    createdAt: new Date('2025-03-20'),
  },
  {
    id: 'hr-3',
    fullName: 'Samantha Liu',
    email: 'samantha@hiretaex.com',
    role: 'hr',
    active: true,
    createdAt: new Date('2025-06-10'),
  },
  {
    id: 'hr-4',
    fullName: 'Daniel Cooper',
    email: 'daniel@hiretaex.com',
    role: 'hr',
    active: true,
    createdAt: new Date('2025-09-05'),
  },
  {
    id: 'hr-5',
    fullName: 'Aisha Rahman',
    email: 'aisha@hiretaex.com',
    role: 'hr',
    active: true,
    createdAt: new Date('2026-02-18'),
  },
  {
    id: 'hr-6',
    fullName: 'Patrick O\'Brien',
    email: 'patrick@hiretaex.com',
    role: 'hr',
    active: false,
    createdAt: new Date('2024-11-22'),
  },
]
