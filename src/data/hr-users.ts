import type { HRUser, AdminUser } from '@/types'

/** Demo password for all HR/Admin accounts: demo123 */
export const DEMO_HR_PASSWORD = 'demo123'

export const hrUsers: (HRUser | AdminUser)[] = [
  {
    id: 'hr-1',
    fullName: 'Rachel Morrison',
    email: 'rachel@hiretaex.com',
    password: DEMO_HR_PASSWORD,
    role: 'admin',
    active: true,
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'hr-2',
    fullName: 'Marcus Thompson',
    email: 'marcus@hiretaex.com',
    password: DEMO_HR_PASSWORD,
    role: 'hr',
    active: true,
    createdAt: new Date('2025-03-20'),
  },
  {
    id: 'hr-3',
    fullName: 'Samantha Liu',
    email: 'samantha@hiretaex.com',
    password: DEMO_HR_PASSWORD,
    role: 'hr',
    active: true,
    createdAt: new Date('2025-06-10'),
  },
  {
    id: 'hr-4',
    fullName: 'Daniel Cooper',
    email: 'daniel@hiretaex.com',
    password: DEMO_HR_PASSWORD,
    role: 'hr',
    active: true,
    createdAt: new Date('2025-09-05'),
  },
  {
    id: 'hr-5',
    fullName: 'Aisha Rahman',
    email: 'aisha@hiretaex.com',
    password: DEMO_HR_PASSWORD,
    role: 'hr',
    active: true,
    createdAt: new Date('2026-02-18'),
  },
  {
    id: 'hr-6',
    fullName: "Patrick O'Brien",
    email: 'patrick@hiretaex.com',
    password: DEMO_HR_PASSWORD,
    role: 'hr',
    active: false,
    createdAt: new Date('2024-11-22'),
  },
]
