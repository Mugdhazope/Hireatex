import { get, set, del } from 'idb-keyval'

const PREFIX = 'hiretaex_'

export function lsGet<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function lsSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
}

export function lsRemove(key: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(PREFIX + key)
}

const resumeKey = (id: string) => `resume-blob-${id}`

export async function saveResumeBlob(id: string, blob: Blob): Promise<void> {
  await set(resumeKey(id), blob)
}

export async function getResumeBlob(id: string): Promise<Blob | undefined> {
  return get(resumeKey(id))
}

export async function deleteResumeBlob(id: string): Promise<void> {
  await del(resumeKey(id))
}
