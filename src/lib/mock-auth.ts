// Mock authentication utilities
// Frontend-only auth for development - replace with real auth later

interface AuthUser {
  id: string
  name: string
  email: string
  role: 'candidate' | 'hr' | 'admin'
}

const AUTH_STORAGE_KEY = 'hiretaex_auth'

export function login(email: string, password: string, role: 'candidate' | 'hr' | 'admin'): AuthUser | null {
  // Mock authentication - always succeeds for development
  const user: AuthUser = {
    id: `${role}-${Date.now()}`,
    name: email.split('@')[0],
    email,
    role,
  }
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  }
  
  return user
}

export function register(name: string, email: string, phone: string, password: string): AuthUser {
  // Mock registration
  const user: AuthUser = {
    id: `candidate-${Date.now()}`,
    name,
    email,
    role: 'candidate',
  }
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  }
  
  return user
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!stored) return null
  
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function requireAuth(role?: 'candidate' | 'hr' | 'admin'): AuthUser | null {
  const user = getCurrentUser()
  if (!user) return null
  if (role && user.role !== role) return null
  return user
}
