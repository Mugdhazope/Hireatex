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
import { applications as seedApplications } from '@/data/applications'
import { candidates as seedCandidates } from '@/data/candidates'
import { jobs } from '@/data/jobs'
import { reviveCandidate } from '@/lib/normalize-candidate'
import {
  deleteResumeBlob,
  getResumeBlob,
  lsGet,
  lsSet,
  saveResumeBlob,
} from '@/lib/storage'
import type {
  Application,
  ApplicationStatus,
  Candidate,
  Education,
  Experience,
  Job,
  ResumeFileMeta,
  SavedJob,
  Skill,
} from '@/types'

const CANDIDATES_KEY = 'candidates'
const APPLICATIONS_KEY = 'applications'
const SAVED_KEY = 'saved_jobs'

function reviveApplication(a: Application): Application {
  return {
    ...a,
    appliedDate: new Date(a.appliedDate),
  }
}

function reviveSaved(s: SavedJob): SavedJob {
  return { ...s, savedAt: new Date(s.savedAt) }
}

function loadCandidates(): Candidate[] {
  const stored = lsGet<Candidate[]>(CANDIDATES_KEY)
  if (stored?.length) return stored.map(reviveCandidate)
  return seedCandidates.map((c) => reviveCandidate(structuredClone(c)))
}

function loadApplications(): Application[] {
  const stored = lsGet<Application[]>(APPLICATIONS_KEY)
  if (stored?.length) return stored.map(reviveApplication)
  return seedApplications.map((a) => reviveApplication(structuredClone(a)))
}

function loadSaved(): SavedJob[] {
  const stored = lsGet<SavedJob[]>(SAVED_KEY)
  if (stored) return stored.map(reviveSaved)
  return []
}

export function computeProfileCompletion(c: Candidate): number {
  const checks = [
    Boolean(c.fullName?.trim()),
    Boolean(c.email?.trim()),
    Boolean(c.phone?.trim()),
    Boolean(c.location?.trim()),
    Boolean(c.headline?.trim()),
    Boolean(c.bio?.trim()),
    c.education.length > 0,
    c.experience.length > 0,
    c.skills.length > 0,
    c.resumes.length > 0 || Boolean(c.resumeUrl),
    c.preferredRoles.length > 0 || c.careerInterests.length > 0,
  ]
  const done = checks.filter(Boolean).length
  return Math.round((done / checks.length) * 100)
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

interface CandidateStoreValue {
  ready: boolean
  candidates: Candidate[]
  applications: Application[]
  savedJobs: SavedJob[]
  jobs: Job[]
  getCandidate: (id: string) => Candidate | undefined
  getCandidateByEmail: (email: string) => Candidate | undefined
  upsertCandidate: (candidate: Candidate) => void
  updateCandidate: (id: string, patch: Partial<Candidate>) => void
  createCandidate: (input: {
    fullName: string
    email: string
    phone: string
    password: string
  }) => Candidate
  getApplicationsForCandidate: (candidateId: string) => Application[]
  getApplicationWithJob: (candidateId: string) => Array<Application & { job: Job }>
  hasApplied: (candidateId: string, jobId: string) => boolean
  submitApplication: (input: {
    candidateId: string
    jobId: string
    resumeId?: string
    resumeUrl: string
    coverLetter?: string
  }) => Application | { error: string }
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void
  isJobSaved: (candidateId: string, jobId: string) => boolean
  toggleSaveJob: (candidateId: string, jobId: string) => void
  getSavedJobsForCandidate: (candidateId: string) => Job[]
  getRecommendedJobs: (candidateId: string, limit?: number) => Job[]
  addResume: (
    candidateId: string,
    meta: Omit<ResumeFileMeta, 'id' | 'uploadedAt'>,
    blob: Blob
  ) => Promise<ResumeFileMeta>
  updateResume: (
    candidateId: string,
    resumeId: string,
    patch: Partial<ResumeFileMeta>
  ) => void
  deleteResume: (candidateId: string, resumeId: string) => Promise<void>
  setDefaultResume: (candidateId: string, resumeId: string) => void
  getResumeFile: (resumeId: string) => Promise<Blob | undefined>
  addEducation: (candidateId: string, edu: Omit<Education, 'id'>) => void
  updateEducation: (candidateId: string, edu: Education) => void
  removeEducation: (candidateId: string, eduId: string) => void
  addExperience: (candidateId: string, exp: Omit<Experience, 'id'>) => void
  updateExperience: (candidateId: string, exp: Experience) => void
  removeExperience: (candidateId: string, expId: string) => void
  setSkills: (candidateId: string, skills: Skill[]) => void
  profileCompletion: (candidateId: string) => number
}

const CandidateStoreContext = createContext<CandidateStoreValue | null>(null)

export function CandidateStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])

  // Hydrate from localStorage / seed after mount (client-only)
  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      setCandidates(loadCandidates())
      setApplications(loadApplications())
      setSavedJobs(loadSaved())
      setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    lsSet(CANDIDATES_KEY, candidates)
  }, [candidates, ready])

  useEffect(() => {
    if (!ready) return
    lsSet(APPLICATIONS_KEY, applications)
  }, [applications, ready])

  useEffect(() => {
    if (!ready) return
    lsSet(SAVED_KEY, savedJobs)
  }, [savedJobs, ready])

  const getCandidate = useCallback(
    (id: string) => candidates.find((c) => c.id === id),
    [candidates]
  )

  const getCandidateByEmail = useCallback(
    (email: string) =>
      candidates.find((c) => c.email.toLowerCase() === email.toLowerCase()),
    [candidates]
  )

  const upsertCandidate = useCallback((candidate: Candidate) => {
    setCandidates((prev) => {
      const idx = prev.findIndex((c) => c.id === candidate.id)
      if (idx === -1) return [...prev, reviveCandidate(candidate)]
      const next = [...prev]
      next[idx] = reviveCandidate(candidate)
      return next
    })
  }, [])

  const updateCandidate = useCallback((id: string, patch: Partial<Candidate>) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id
          ? reviveCandidate({
              ...c,
              ...patch,
              profileComplete: computeProfileCompletion({ ...c, ...patch } as Candidate) >= 80,
            })
          : c
      )
    )
  }, [])

  const createCandidate = useCallback(
    (input: {
      fullName: string
      email: string
      phone: string
      password: string
    }) => {
      const existing = candidates.find(
        (c) => c.email.toLowerCase() === input.email.toLowerCase()
      )
      if (existing) return existing

      const candidate: Candidate = {
        id: uid('cand'),
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        password: input.password,
        location: '',
        headline: '',
        bio: '',
        education: [],
        experience: [],
        skills: [],
        certifications: [],
        careerInterests: [],
        preferredRoles: [],
        preferredLocations: [],
        resumes: [],
        profileComplete: false,
        emailVerified: false,
        onboardingComplete: false,
        createdAt: new Date(),
      }
      setCandidates((prev) => {
        const next = [...prev, candidate]
        lsSet(CANDIDATES_KEY, next)
        return next
      })
      return candidate
    },
    [candidates]
  )

  const getApplicationsForCandidate = useCallback(
    (candidateId: string) =>
      applications
        .filter((a) => a.candidateId === candidateId)
        .sort((a, b) => b.appliedDate.getTime() - a.appliedDate.getTime()),
    [applications]
  )

  const getApplicationWithJob = useCallback(
    (candidateId: string) =>
      getApplicationsForCandidate(candidateId)
        .map((app) => {
          const job = jobs.find((j) => j.id === app.jobId)
          if (!job) return null
          return { ...app, job }
        })
        .filter(Boolean) as Array<Application & { job: Job }>,
    [getApplicationsForCandidate]
  )

  const hasApplied = useCallback(
    (candidateId: string, jobId: string) =>
      applications.some((a) => a.candidateId === candidateId && a.jobId === jobId),
    [applications]
  )

  const submitApplication = useCallback(
    (input: {
      candidateId: string
      jobId: string
      resumeId?: string
      resumeUrl: string
      coverLetter?: string
    }) => {
      if (hasApplied(input.candidateId, input.jobId)) {
        return { error: 'You already applied to this job.' }
      }
      const app: Application = {
        id: uid('app'),
        candidateId: input.candidateId,
        jobId: input.jobId,
        status: 'applied',
        appliedDate: new Date(),
        resumeUrl: input.resumeUrl,
        resumeId: input.resumeId,
        coverLetter: input.coverLetter,
      }
      setApplications((prev) => [app, ...prev])
      return app
    },
    [hasApplied]
  )

  const updateApplicationStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      )
    },
    []
  )

  const isJobSaved = useCallback(
    (candidateId: string, jobId: string) =>
      savedJobs.some((s) => s.candidateId === candidateId && s.jobId === jobId),
    [savedJobs]
  )

  const toggleSaveJob = useCallback((candidateId: string, jobId: string) => {
    setSavedJobs((prev) => {
      const exists = prev.find(
        (s) => s.candidateId === candidateId && s.jobId === jobId
      )
      if (exists) {
        return prev.filter(
          (s) => !(s.candidateId === candidateId && s.jobId === jobId)
        )
      }
      return [...prev, { candidateId, jobId, savedAt: new Date() }]
    })
  }, [])

  const getSavedJobsForCandidate = useCallback(
    (candidateId: string) =>
      savedJobs
        .filter((s) => s.candidateId === candidateId)
        .map((s) => jobs.find((j) => j.id === s.jobId))
        .filter(Boolean) as Job[],
    [savedJobs]
  )

  const getRecommendedJobs = useCallback(
    (candidateId: string, limit = 6) => {
      const candidate = candidates.find((c) => c.id === candidateId)
      if (!candidate) return jobs.filter((j) => j.status === 'active').slice(0, limit)

      const appliedIds = new Set(
        applications
          .filter((a) => a.candidateId === candidateId)
          .map((a) => a.jobId)
      )
      const skillNames = new Set(candidate.skills.map((s) => s.name.toLowerCase()))
      const preferred = new Set(
        [...candidate.preferredRoles, ...candidate.careerInterests].map((s) =>
          s.toLowerCase()
        )
      )

      return jobs
        .filter((j) => j.status === 'active' && !appliedIds.has(j.id))
        .map((j) => {
          let score = 0
          j.skills.forEach((s) => {
            if (skillNames.has(s.name.toLowerCase())) score += 2
          })
          if (preferred.has(j.title.toLowerCase())) score += 3
          preferred.forEach((p) => {
            if (j.title.toLowerCase().includes(p) || j.category.includes(p.replace(/\s/g, '-')))
              score += 1
          })
          if (
            candidate.preferredLocations.some(
              (loc) =>
                j.location.toLowerCase().includes(loc.toLowerCase()) ||
                loc.toLowerCase() === 'remote'
            )
          )
            score += 1
          return { job: j, score }
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((x) => x.job)
    },
    [candidates, applications]
  )

  const addResume = useCallback(
    async (
      candidateId: string,
      meta: Omit<ResumeFileMeta, 'id' | 'uploadedAt'>,
      blob: Blob
    ) => {
      const id = uid('resume')
      await saveResumeBlob(id, blob)
      const resume: ResumeFileMeta = {
        ...meta,
        id,
        uploadedAt: new Date(),
      }
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          const resumes = meta.isDefault
            ? [...c.resumes.map((r) => ({ ...r, isDefault: false })), resume]
            : [...c.resumes, resume]
          if (resumes.length === 1) resumes[0].isDefault = true
          return reviveCandidate({ ...c, resumes, resumeUrl: resume.name })
        })
      )
      return resume
    },
    []
  )

  const updateResume = useCallback(
    (candidateId: string, resumeId: string, patch: Partial<ResumeFileMeta>) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          return reviveCandidate({
            ...c,
            resumes: c.resumes.map((r) =>
              r.id === resumeId ? { ...r, ...patch } : r
            ),
          })
        })
      )
    },
    []
  )

  const deleteResume = useCallback(async (candidateId: string, resumeId: string) => {
    await deleteResumeBlob(resumeId)
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c
        let resumes = c.resumes.filter((r) => r.id !== resumeId)
        if (resumes.length && !resumes.some((r) => r.isDefault)) {
          resumes = resumes.map((r, i) => ({ ...r, isDefault: i === 0 }))
        }
        return reviveCandidate({ ...c, resumes })
      })
    )
  }, [])

  const setDefaultResume = useCallback((candidateId: string, resumeId: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c
        return reviveCandidate({
          ...c,
          resumes: c.resumes.map((r) => ({
            ...r,
            isDefault: r.id === resumeId,
          })),
        })
      })
    )
  }, [])

  const getResumeFile = useCallback(async (resumeId: string) => {
    return getResumeBlob(resumeId)
  }, [])

  const addEducation = useCallback(
    (candidateId: string, edu: Omit<Education, 'id'>) => {
      updateCandidate(candidateId, {
        education: [
          ...(getCandidate(candidateId)?.education ?? []),
          { ...edu, id: uid('edu') },
        ],
      })
    },
    [getCandidate, updateCandidate]
  )

  const updateEducation = useCallback(
    (candidateId: string, edu: Education) => {
      const c = getCandidate(candidateId)
      if (!c) return
      updateCandidate(candidateId, {
        education: c.education.map((e) => (e.id === edu.id ? edu : e)),
      })
    },
    [getCandidate, updateCandidate]
  )

  const removeEducation = useCallback(
    (candidateId: string, eduId: string) => {
      const c = getCandidate(candidateId)
      if (!c) return
      updateCandidate(candidateId, {
        education: c.education.filter((e) => e.id !== eduId),
      })
    },
    [getCandidate, updateCandidate]
  )

  const addExperience = useCallback(
    (candidateId: string, exp: Omit<Experience, 'id'>) => {
      updateCandidate(candidateId, {
        experience: [
          ...(getCandidate(candidateId)?.experience ?? []),
          { ...exp, id: uid('exp') },
        ],
      })
    },
    [getCandidate, updateCandidate]
  )

  const updateExperience = useCallback(
    (candidateId: string, exp: Experience) => {
      const c = getCandidate(candidateId)
      if (!c) return
      updateCandidate(candidateId, {
        experience: c.experience.map((e) => (e.id === exp.id ? exp : e)),
      })
    },
    [getCandidate, updateCandidate]
  )

  const removeExperience = useCallback(
    (candidateId: string, expId: string) => {
      const c = getCandidate(candidateId)
      if (!c) return
      updateCandidate(candidateId, {
        experience: c.experience.filter((e) => e.id !== expId),
      })
    },
    [getCandidate, updateCandidate]
  )

  const setSkills = useCallback(
    (candidateId: string, skills: Skill[]) => {
      updateCandidate(candidateId, { skills })
    },
    [updateCandidate]
  )

  const profileCompletion = useCallback(
    (candidateId: string) => {
      const c = getCandidate(candidateId)
      return c ? computeProfileCompletion(c) : 0
    },
    [getCandidate]
  )

  const value = useMemo<CandidateStoreValue>(
    () => ({
      ready,
      candidates,
      applications,
      savedJobs,
      jobs,
      getCandidate,
      getCandidateByEmail,
      upsertCandidate,
      updateCandidate,
      createCandidate,
      getApplicationsForCandidate,
      getApplicationWithJob,
      hasApplied,
      submitApplication,
      updateApplicationStatus,
      isJobSaved,
      toggleSaveJob,
      getSavedJobsForCandidate,
      getRecommendedJobs,
      addResume,
      updateResume,
      deleteResume,
      setDefaultResume,
      getResumeFile,
      addEducation,
      updateEducation,
      removeEducation,
      addExperience,
      updateExperience,
      removeExperience,
      setSkills,
      profileCompletion,
    }),
    [
      ready,
      candidates,
      applications,
      savedJobs,
      getCandidate,
      getCandidateByEmail,
      upsertCandidate,
      updateCandidate,
      createCandidate,
      getApplicationsForCandidate,
      getApplicationWithJob,
      hasApplied,
      submitApplication,
      updateApplicationStatus,
      isJobSaved,
      toggleSaveJob,
      getSavedJobsForCandidate,
      getRecommendedJobs,
      addResume,
      updateResume,
      deleteResume,
      setDefaultResume,
      getResumeFile,
      addEducation,
      updateEducation,
      removeEducation,
      addExperience,
      updateExperience,
      removeExperience,
      setSkills,
      profileCompletion,
    ]
  )

  return (
    <CandidateStoreContext.Provider value={value}>
      {children}
    </CandidateStoreContext.Provider>
  )
}

export function useCandidateStore() {
  const ctx = useContext(CandidateStoreContext)
  if (!ctx) {
    throw new Error('useCandidateStore must be used within CandidateStoreProvider')
  }
  return ctx
}
