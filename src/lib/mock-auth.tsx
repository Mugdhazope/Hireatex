'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEMO_HR_PASSWORD, hrUsers as seedHrUsers } from '@/data/hr-users'
import { lsGet, lsRemove, lsSet } from '@/lib/storage'
import type { AuthUser, Candidate, HRUser } from '@/types'

const AUTH_KEY = 'auth_session'
const HR_USERS_KEY = 'hr_users'
export const DEMO_OTP = '123456'
export const DEMO_EMAIL = 'sarah.chen@email.com'
export const DEMO_CANDIDATE_ID = 'cand-1'

interface AuthContextValue {
  user: AuthUser | null
  ready: boolean
  login: (
    email: string,
    password: string,
    role?: 'candidate' | 'hr' | 'admin'
  ) => { user: AuthUser } | { error: string }
  register: (input: {
    fullName: string
    email: string
    phone: string
    password: string
    createCandidate: (input: {
      fullName: string
      email: string
      phone: string
      password: string
    }) => Candidate
  }) => { user: AuthUser } | { error: string }
  verifyEmail: (code: string) => { ok: true } | { error: string }
  logout: () => void
  setVerified: () => void
  refreshFromCandidate: (candidate: Candidate) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function lookupHrUser(email: string): HRUser | undefined {
  const stored = lsGet<HRUser[]>(HR_USERS_KEY)
  const users = stored?.length ? stored : seedHrUsers
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      const stored = lsGet<AuthUser>(AUTH_KEY)
      if (stored) setUser(stored)
      setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const persist = useCallback((next: AuthUser | null) => {
    setUser(next)
    if (next) lsSet(AUTH_KEY, next)
    else lsRemove(AUTH_KEY)
  }, [])

  const login = useCallback(
    (
      email: string,
      password: string,
      role: 'candidate' | 'hr' | 'admin' = 'candidate'
    ) => {
      if (!email.trim() || !password.trim()) {
        return { error: 'Email and password are required.' }
      }

      if (role === 'hr' || role === 'admin') {
        const hr = lookupHrUser(email)
        if (!hr) {
          return { error: 'No HR account found for this email.' }
        }
        if (!hr.active) {
          return { error: 'This account is deactivated. Contact an admin.' }
        }
        const expected = hr.password ?? DEMO_HR_PASSWORD
        if (password !== expected) {
          return { error: 'Incorrect password.' }
        }
        if (role === 'admin' && hr.role !== 'admin') {
          return { error: 'Admin access required. Use the HR portal instead.' }
        }
        if (role === 'hr' && hr.role === 'admin') {
          // Allow admin through HR login → redirect handled by UI to /admin
        }
        const authUser: AuthUser = {
          id: hr.id,
          name: hr.fullName,
          email: hr.email,
          role: hr.role,
          hrId: hr.id,
          emailVerified: true,
        }
        persist(authUser)
        return { user: authUser }
      }

      if (email.toLowerCase() === DEMO_EMAIL) {
        const authUser: AuthUser = {
          id: DEMO_CANDIDATE_ID,
          name: 'Sarah Chen',
          email: DEMO_EMAIL,
          role: 'candidate',
          candidateId: DEMO_CANDIDATE_ID,
          emailVerified: true,
        }
        persist(authUser)
        return { user: authUser }
      }

      const candidates = lsGet<Candidate[]>('candidates') ?? []
      const match = candidates.find(
        (c) => c.email.toLowerCase() === email.toLowerCase()
      )
      if (match) {
        if (match.password && match.password !== password) {
          return { error: 'Incorrect password.' }
        }
        const authUser: AuthUser = {
          id: match.id,
          name: match.fullName,
          email: match.email,
          role: 'candidate',
          candidateId: match.id,
          emailVerified: match.emailVerified,
        }
        persist(authUser)
        return { user: authUser }
      }

      return { error: 'No account found. Create an account first.' }
    },
    [persist]
  )

  const register = useCallback(
    (input: {
      fullName: string
      email: string
      phone: string
      password: string
      createCandidate: (input: {
        fullName: string
        email: string
        phone: string
        password: string
      }) => Candidate
    }) => {
      if (!input.fullName.trim() || !input.email.trim() || !input.password.trim()) {
        return { error: 'Name, email, and password are required.' }
      }
      const candidate = input.createCandidate({
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        password: input.password,
      })
      const authUser: AuthUser = {
        id: candidate.id,
        name: candidate.fullName,
        email: candidate.email,
        role: 'candidate',
        candidateId: candidate.id,
        emailVerified: false,
      }
      persist(authUser)
      return { user: authUser }
    },
    [persist]
  )

  const verifyEmail = useCallback(
    (code: string) => {
      if (code.trim() !== DEMO_OTP) {
        return { error: 'Invalid code. Use 123456 for this demo.' }
      }
      if (!user) return { error: 'Not signed in.' }
      const next = { ...user, emailVerified: true }
      persist(next)
      return { ok: true as const }
    },
    [user, persist]
  )

  const setVerified = useCallback(() => {
    if (!user) return
    persist({ ...user, emailVerified: true })
  }, [user, persist])

  const logout = useCallback(() => {
    persist(null)
  }, [persist])

  const refreshFromCandidate = useCallback(
    (candidate: Candidate) => {
      if (!user || user.candidateId !== candidate.id) return
      persist({
        ...user,
        name: candidate.fullName,
        email: candidate.email,
        emailVerified: candidate.emailVerified,
      })
    },
    [user, persist]
  )

  const value = useMemo(
    () => ({
      user,
      ready,
      login,
      register,
      verifyEmail,
      logout,
      setVerified,
      refreshFromCandidate,
    }),
    [user, ready, login, register, verifyEmail, logout, setVerified, refreshFromCandidate]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function getCurrentUser(): AuthUser | null {
  return lsGet<AuthUser>(AUTH_KEY)
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function logout(): void {
  lsRemove(AUTH_KEY)
}
