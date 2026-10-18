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
import { jobs as seedJobs } from '@/data/jobs'
import { hrUsers as seedHrUsers, DEMO_HR_PASSWORD } from '@/data/hr-users'
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
  AuditAction,
  AuditEvent,
  Candidate,
  Education,
  Experience,
  HRUser,
  HrTalentSave,
  Job,
  ResumeFileMeta,
  SavedJob,
  Skill,
} from '@/types'

const CANDIDATES_KEY = 'candidates'
const APPLICATIONS_KEY = 'applications'
const SAVED_KEY = 'saved_jobs'
const JOBS_KEY = 'jobs'
const HR_USERS_KEY = 'hr_users'
const AUDIT_KEY = 'audit_events'
const TALENT_KEY = 'hr_talent'

const HR_CYCLE = ['hr-2', 'hr-3', 'hr-4', 'hr-5'] as const

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function reviveJob(j: Job): Job {
  return {
    ...j,
    postedDate: new Date(j.postedDate),
    deadline: j.deadline ? new Date(j.deadline) : undefined,
  }
}

function reviveApplication(a: Application): Application {
  return {
    ...a,
    appliedDate: new Date(a.appliedDate),
    savedForLaterBy: a.savedForLaterBy ?? [],
  }
}

function reviveSaved(s: SavedJob): SavedJob {
  return { ...s, savedAt: new Date(s.savedAt) }
}

function reviveHrUser(u: HRUser): HRUser {
  return {
    ...u,
    createdAt: new Date(u.createdAt),
    password: u.password ?? DEMO_HR_PASSWORD,
  }
}

function reviveAudit(e: AuditEvent): AuditEvent {
  return { ...e, timestamp: new Date(e.timestamp) }
}

function reviveTalent(t: HrTalentSave): HrTalentSave {
  return { ...t, savedAt: new Date(t.savedAt) }
}

function withSeedJobMeta(jobs: Job[]): Job[] {
  return jobs.map((j, i) =>
    reviveJob({
      ...j,
      createdByHrId: j.createdByHrId ?? HR_CYCLE[i % HR_CYCLE.length],
      status: j.status ?? 'active',
    })
  )
}

function withSeedAppMeta(apps: Application[]): Application[] {
  return apps.map((a, i) =>
    reviveApplication({
      ...a,
      assignedHrId: a.assignedHrId ?? HR_CYCLE[i % HR_CYCLE.length],
    })
  )
}

function loadCandidates(): Candidate[] {
  const stored = lsGet<Candidate[]>(CANDIDATES_KEY)
  if (stored?.length) return stored.map(reviveCandidate)
  return seedCandidates.map((c) => reviveCandidate(structuredClone(c)))
}

function loadApplications(): Application[] {
  const stored = lsGet<Application[]>(APPLICATIONS_KEY)
  if (stored?.length) return stored.map(reviveApplication)
  return withSeedAppMeta(seedApplications.map((a) => structuredClone(a)))
}

function loadSaved(): SavedJob[] {
  const stored = lsGet<SavedJob[]>(SAVED_KEY)
  if (stored) return stored.map(reviveSaved)
  return []
}

function loadJobs(): Job[] {
  const stored = lsGet<Job[]>(JOBS_KEY)
  if (stored?.length) return stored.map(reviveJob)
  return withSeedJobMeta(seedJobs.map((j) => structuredClone(j)))
}

function loadHrUsers(): HRUser[] {
  const stored = lsGet<HRUser[]>(HR_USERS_KEY)
  if (stored?.length) return stored.map(reviveHrUser)
  return seedHrUsers.map((u) => reviveHrUser(structuredClone(u)))
}

function loadAudit(): AuditEvent[] {
  const stored = lsGet<AuditEvent[]>(AUDIT_KEY)
  if (stored) return stored.map(reviveAudit)
  return []
}

function loadTalent(): HrTalentSave[] {
  const stored = lsGet<HrTalentSave[]>(TALENT_KEY)
  if (stored) return stored.map(reviveTalent)
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

export type JobInput = Omit<
  Job,
  'id' | 'postedDate' | 'applicationCount' | 'status'
> & {
  status?: Job['status']
  id?: string
}

interface RecruitmentStoreValue {
  ready: boolean
  candidates: Candidate[]
  applications: Application[]
  savedJobs: SavedJob[]
  jobs: Job[]
  hrUsers: HRUser[]
  auditEvents: AuditEvent[]
  talentSaves: HrTalentSave[]

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

  getJob: (id: string) => Job | undefined
  getActiveJobs: () => Job[]
  createJob: (input: JobInput, actorHrId: string) => Job
  updateJob: (id: string, patch: Partial<Job>, actorHrId: string) => void
  publishJob: (id: string, actorHrId: string) => void
  unpublishJob: (id: string, actorHrId: string) => void
  closeJob: (id: string, actorHrId: string) => void

  getHrUser: (id: string) => HRUser | undefined
  getHrUserByEmail: (email: string) => HRUser | undefined
  createHrUser: (input: {
    fullName: string
    email: string
    password?: string
    role?: 'hr' | 'admin'
  }) => HRUser | { error: string }
  updateHrUser: (id: string, patch: Partial<HRUser>) => void
  setHrActive: (id: string, active: boolean) => void
  resetHrPassword: (id: string, password?: string) => void

  setApplicationStatus: (
    id: string,
    status: ApplicationStatus,
    actorHrId: string,
    note?: string
  ) => void
  assignHr: (applicationId: string, hrId: string, actorHrId: string) => void
  addInternalNote: (applicationId: string, note: string, actorHrId: string) => void
  toggleSavedForLater: (applicationId: string, hrId: string) => void
  getApplicationsWithDetails: () => Array<
    Application & { candidate: Candidate; job: Job }
  >
  getAuditForApplication: (applicationId: string) => AuditEvent[]
  getAuditFeed: (limit?: number) => AuditEvent[]

  saveTalent: (
    hrId: string,
    candidateId: string,
    opts?: { tags?: string[]; note?: string }
  ) => void
  updateTalent: (
    hrId: string,
    candidateId: string,
    patch: { tags?: string[]; note?: string }
  ) => void
  removeTalent: (hrId: string, candidateId: string) => void
  getTalentForHr: (hrId: string) => HrTalentSave[]
  isTalentSavedBy: (hrId: string, candidateId: string) => boolean
  getTalentSavers: (candidateId: string) => HrTalentSave[]

  pipelineCounts: () => Record<ApplicationStatus | 'all', number>
  hrMetrics: (hrId: string) => {
    jobsCreated: number
    activeJobs: number
    applicants: number
    shortlisted: number
    interviews: number
    rejected: number
    pendingReview: number
    reviewed: number
    savedTalent: number
  }
  orgMetrics: () => {
    totalJobs: number
    activeJobs: number
    totalApplications: number
    pendingReviews: number
    totalCandidates: number
    activeHr: number
    workloadByHr: Array<{ hr: HRUser; count: number }>
  }
}

const RecruitmentStoreContext = createContext<RecruitmentStoreValue | null>(null)

export function RecruitmentStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [hrUsers, setHrUsers] = useState<HRUser[]>([])
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([])
  const [talentSaves, setTalentSaves] = useState<HrTalentSave[]>([])

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      setCandidates(loadCandidates())
      setApplications(loadApplications())
      setSavedJobs(loadSaved())
      setJobs(loadJobs())
      setHrUsers(loadHrUsers())
      setAuditEvents(loadAudit())
      setTalentSaves(loadTalent())
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

  useEffect(() => {
    if (!ready) return
    lsSet(JOBS_KEY, jobs)
  }, [jobs, ready])

  useEffect(() => {
    if (!ready) return
    lsSet(HR_USERS_KEY, hrUsers)
  }, [hrUsers, ready])

  useEffect(() => {
    if (!ready) return
    lsSet(AUDIT_KEY, auditEvents)
  }, [auditEvents, ready])

  useEffect(() => {
    if (!ready) return
    lsSet(TALENT_KEY, talentSaves)
  }, [talentSaves, ready])

  const appendAudit = useCallback(
    (
      partial: Omit<AuditEvent, 'id' | 'timestamp'> & { timestamp?: Date }
    ) => {
      const event: AuditEvent = {
        ...partial,
        id: uid('audit'),
        timestamp: partial.timestamp ?? new Date(),
      }
      setAuditEvents((prev) => [event, ...prev])
      return event
    },
    []
  )

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
              profileComplete:
                computeProfileCompletion({ ...c, ...patch } as Candidate) >= 80,
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

  const getJob = useCallback((id: string) => jobs.find((j) => j.id === id), [jobs])

  const getActiveJobs = useCallback(
    () => jobs.filter((j) => j.status === 'active'),
    [jobs]
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
    [getApplicationsForCandidate, jobs]
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
      const job = jobs.find((j) => j.id === input.jobId)
      const app: Application = {
        id: uid('app'),
        candidateId: input.candidateId,
        jobId: input.jobId,
        status: 'applied',
        appliedDate: new Date(),
        resumeUrl: input.resumeUrl,
        resumeId: input.resumeId,
        coverLetter: input.coverLetter,
        assignedHrId: job?.createdByHrId,
        savedForLaterBy: [],
      }
      setApplications((prev) => [app, ...prev])
      setJobs((prev) =>
        prev.map((j) =>
          j.id === input.jobId
            ? { ...j, applicationCount: (j.applicationCount ?? 0) + 1 }
            : j
        )
      )
      return app
    },
    [hasApplied, jobs]
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
    [savedJobs, jobs]
  )

  const getRecommendedJobs = useCallback(
    (candidateId: string, limit = 6) => {
      const candidate = candidates.find((c) => c.id === candidateId)
      const active = jobs.filter((j) => j.status === 'active')
      if (!candidate) return active.slice(0, limit)

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

      return active
        .filter((j) => !appliedIds.has(j.id))
        .map((j) => {
          let score = 0
          j.skills.forEach((s) => {
            if (skillNames.has(s.name.toLowerCase())) score += 2
          })
          if (preferred.has(j.title.toLowerCase())) score += 3
          preferred.forEach((p) => {
            if (
              j.title.toLowerCase().includes(p) ||
              j.category.includes(p.replace(/\s/g, '-'))
            )
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
    [candidates, applications, jobs]
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

  const createJob = useCallback(
    (input: JobInput, actorHrId: string) => {
      const job: Job = {
        ...input,
        id: input.id ?? uid('job'),
        status: input.status ?? 'draft',
        postedDate: new Date(),
        applicationCount: 0,
        createdByHrId: actorHrId,
        company: input.company || 'HiretaX Partners',
      }
      setJobs((prev) => [job, ...prev])
      appendAudit({
        actorHrId,
        action: 'job_created',
        jobId: job.id,
        note: `Created job: ${job.title}`,
      })
      return job
    },
    [appendAudit]
  )

  const updateJob = useCallback(
    (id: string, patch: Partial<Job>, actorHrId: string) => {
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? reviveJob({ ...j, ...patch }) : j))
      )
      appendAudit({
        actorHrId,
        action: 'job_updated',
        jobId: id,
        note: 'Updated job details',
      })
    },
    [appendAudit]
  )

  const publishJob = useCallback(
    (id: string, actorHrId: string) => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === id
            ? reviveJob({
                ...j,
                status: 'active',
                postedDate: j.status === 'draft' ? new Date() : j.postedDate,
              })
            : j
        )
      )
      appendAudit({
        actorHrId,
        action: 'job_published',
        jobId: id,
        note: 'Published job',
      })
    },
    [appendAudit]
  )

  const unpublishJob = useCallback(
    (id: string, actorHrId: string) => {
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, status: 'paused' as const } : j))
      )
      appendAudit({
        actorHrId,
        action: 'job_unpublished',
        jobId: id,
        note: 'Unpublished job',
      })
    },
    [appendAudit]
  )

  const closeJob = useCallback(
    (id: string, actorHrId: string) => {
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, status: 'closed' as const } : j))
      )
      appendAudit({
        actorHrId,
        action: 'job_closed',
        jobId: id,
        note: 'Closed job',
      })
    },
    [appendAudit]
  )

  const getHrUser = useCallback(
    (id: string) => hrUsers.find((u) => u.id === id),
    [hrUsers]
  )

  const getHrUserByEmail = useCallback(
    (email: string) =>
      hrUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()),
    [hrUsers]
  )

  const createHrUser = useCallback(
    (input: {
      fullName: string
      email: string
      password?: string
      role?: 'hr' | 'admin'
    }) => {
      if (hrUsers.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
        return { error: 'An HR user with this email already exists.' }
      }
      const user: HRUser = {
        id: uid('hr'),
        fullName: input.fullName,
        email: input.email,
        password: input.password ?? DEMO_HR_PASSWORD,
        role: input.role ?? 'hr',
        active: true,
        createdAt: new Date(),
      }
      setHrUsers((prev) => [...prev, user])
      return user
    },
    [hrUsers]
  )

  const updateHrUser = useCallback((id: string, patch: Partial<HRUser>) => {
    setHrUsers((prev) =>
      prev.map((u) => (u.id === id ? reviveHrUser({ ...u, ...patch }) : u))
    )
  }, [])

  const setHrActive = useCallback((id: string, active: boolean) => {
    setHrUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active } : u)))
  }, [])

  const resetHrPassword = useCallback(
    (id: string, password = DEMO_HR_PASSWORD) => {
      setHrUsers((prev) => prev.map((u) => (u.id === id ? { ...u, password } : u)))
    },
    []
  )

  const setApplicationStatus = useCallback(
    (
      id: string,
      status: ApplicationStatus,
      actorHrId: string,
      note?: string
    ) => {
      let fromStatus: ApplicationStatus | undefined
      setApplications((prev) =>
        prev.map((a) => {
          if (a.id !== id) return a
          fromStatus = a.status
          return { ...a, status }
        })
      )
      appendAudit({
        actorHrId,
        action: 'status_change',
        applicationId: id,
        fromStatus,
        toStatus: status,
        note: note ?? `Status → ${status}`,
      })
    },
    [appendAudit]
  )

  const assignHr = useCallback(
    (applicationId: string, hrId: string, actorHrId: string) => {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === applicationId ? { ...a, assignedHrId: hrId } : a
        )
      )
      const hr = hrUsers.find((u) => u.id === hrId)
      appendAudit({
        actorHrId,
        action: 'assigned',
        applicationId,
        note: `Assigned to ${hr?.fullName ?? hrId}`,
        meta: { assignedHrId: hrId },
      })
    },
    [appendAudit, hrUsers]
  )

  const addInternalNote = useCallback(
    (applicationId: string, note: string, actorHrId: string) => {
      setApplications((prev) =>
        prev.map((a) => {
          if (a.id !== applicationId) return a
          const existing = a.internalNotes?.trim()
          return {
            ...a,
            internalNotes: existing ? `${existing}\n\n${note}` : note,
          }
        })
      )
      appendAudit({
        actorHrId,
        action: 'note_added',
        applicationId,
        note,
      })
    },
    [appendAudit]
  )

  const toggleSavedForLater = useCallback(
    (applicationId: string, hrId: string) => {
      let action: AuditAction = 'saved_for_later'
      setApplications((prev) =>
        prev.map((a) => {
          if (a.id !== applicationId) return a
          const list = a.savedForLaterBy ?? []
          const has = list.includes(hrId)
          action = has ? 'unsaved_for_later' : 'saved_for_later'
          const savedForLaterBy = has
            ? list.filter((id) => id !== hrId)
            : [...list, hrId]
          const status =
            !has && a.status === 'applied'
              ? ('saved_for_later' as const)
              : a.status
          return { ...a, savedForLaterBy, status }
        })
      )
      appendAudit({
        actorHrId: hrId,
        action,
        applicationId,
        note: action === 'saved_for_later' ? 'Saved for later' : 'Removed from saved',
      })
    },
    [appendAudit]
  )

  const getApplicationsWithDetails = useCallback(() => {
    return applications
      .map((app) => {
        const candidate = candidates.find((c) => c.id === app.candidateId)
        const job = jobs.find((j) => j.id === app.jobId)
        if (!candidate || !job) return null
        return { ...app, candidate, job }
      })
      .filter(Boolean) as Array<Application & { candidate: Candidate; job: Job }>
  }, [applications, candidates, jobs])

  const getAuditForApplication = useCallback(
    (applicationId: string) =>
      auditEvents
        .filter((e) => e.applicationId === applicationId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [auditEvents]
  )

  const getAuditFeed = useCallback(
    (limit = 20) =>
      [...auditEvents]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit),
    [auditEvents]
  )

  const saveTalent = useCallback(
    (
      hrId: string,
      candidateId: string,
      opts?: { tags?: string[]; note?: string }
    ) => {
      setTalentSaves((prev) => {
        const existing = prev.find(
          (t) => t.hrId === hrId && t.candidateId === candidateId
        )
        if (existing) {
          return prev.map((t) =>
            t.id === existing.id
              ? {
                  ...t,
                  tags: opts?.tags ?? t.tags,
                  note: opts?.note ?? t.note,
                  savedAt: new Date(),
                }
              : t
          )
        }
        return [
          {
            id: uid('talent'),
            hrId,
            candidateId,
            tags: opts?.tags ?? [],
            note: opts?.note,
            savedAt: new Date(),
          },
          ...prev,
        ]
      })
      appendAudit({
        actorHrId: hrId,
        action: 'talent_saved',
        candidateId,
        note: 'Saved to talent pool',
      })
    },
    [appendAudit]
  )

  const updateTalent = useCallback(
    (
      hrId: string,
      candidateId: string,
      patch: { tags?: string[]; note?: string }
    ) => {
      setTalentSaves((prev) =>
        prev.map((t) =>
          t.hrId === hrId && t.candidateId === candidateId
            ? { ...t, ...patch }
            : t
        )
      )
    },
    []
  )

  const removeTalent = useCallback(
    (hrId: string, candidateId: string) => {
      setTalentSaves((prev) =>
        prev.filter((t) => !(t.hrId === hrId && t.candidateId === candidateId))
      )
      appendAudit({
        actorHrId: hrId,
        action: 'talent_removed',
        candidateId,
        note: 'Removed from talent pool',
      })
    },
    [appendAudit]
  )

  const getTalentForHr = useCallback(
    (hrId: string) => talentSaves.filter((t) => t.hrId === hrId),
    [talentSaves]
  )

  const isTalentSavedBy = useCallback(
    (hrId: string, candidateId: string) =>
      talentSaves.some((t) => t.hrId === hrId && t.candidateId === candidateId),
    [talentSaves]
  )

  const getTalentSavers = useCallback(
    (candidateId: string) => talentSaves.filter((t) => t.candidateId === candidateId),
    [talentSaves]
  )

  const pipelineCounts = useCallback(() => {
    const counts: Record<string, number> = { all: applications.length }
    for (const a of applications) {
      counts[a.status] = (counts[a.status] ?? 0) + 1
    }
    return counts as Record<ApplicationStatus | 'all', number>
  }, [applications])

  const hrMetrics = useCallback(
    (hrId: string) => {
      const myJobs = jobs.filter((j) => j.createdByHrId === hrId)
      const myJobIds = new Set(myJobs.map((j) => j.id))
      const myApps = applications.filter(
        (a) => a.assignedHrId === hrId || myJobIds.has(a.jobId)
      )
      const reviews = auditEvents.filter(
        (e) =>
          e.actorHrId === hrId &&
          (e.action === 'status_change' || e.action === 'note_added')
      )
      return {
        jobsCreated: myJobs.length,
        activeJobs: myJobs.filter((j) => j.status === 'active').length,
        applicants: myApps.length,
        shortlisted: myApps.filter((a) => a.status === 'shortlisted').length,
        interviews: myApps.filter((a) => a.status === 'interview').length,
        rejected: myApps.filter((a) => a.status === 'rejected').length,
        pendingReview: myApps.filter(
          (a) => a.status === 'applied' || a.status === 'under_review'
        ).length,
        reviewed: reviews.length,
        savedTalent: talentSaves.filter((t) => t.hrId === hrId).length,
      }
    },
    [jobs, applications, auditEvents, talentSaves]
  )

  const orgMetrics = useCallback(() => {
    const activeHr = hrUsers.filter((u) => u.active && u.role === 'hr')
    const workloadByHr = activeHr.map((hr) => ({
      hr,
      count: applications.filter((a) => a.assignedHrId === hr.id).length,
    }))
    return {
      totalJobs: jobs.length,
      activeJobs: jobs.filter((j) => j.status === 'active').length,
      totalApplications: applications.length,
      pendingReviews: applications.filter(
        (a) => a.status === 'applied' || a.status === 'under_review'
      ).length,
      totalCandidates: candidates.length,
      activeHr: activeHr.length,
      workloadByHr,
    }
  }, [jobs, applications, candidates, hrUsers])

  const value = useMemo<RecruitmentStoreValue>(
    () => ({
      ready,
      candidates,
      applications,
      savedJobs,
      jobs,
      hrUsers,
      auditEvents,
      talentSaves,
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
      getJob,
      getActiveJobs,
      createJob,
      updateJob,
      publishJob,
      unpublishJob,
      closeJob,
      getHrUser,
      getHrUserByEmail,
      createHrUser,
      updateHrUser,
      setHrActive,
      resetHrPassword,
      setApplicationStatus,
      assignHr,
      addInternalNote,
      toggleSavedForLater,
      getApplicationsWithDetails,
      getAuditForApplication,
      getAuditFeed,
      saveTalent,
      updateTalent,
      removeTalent,
      getTalentForHr,
      isTalentSavedBy,
      getTalentSavers,
      pipelineCounts,
      hrMetrics,
      orgMetrics,
    }),
    [
      ready,
      candidates,
      applications,
      savedJobs,
      jobs,
      hrUsers,
      auditEvents,
      talentSaves,
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
      getJob,
      getActiveJobs,
      createJob,
      updateJob,
      publishJob,
      unpublishJob,
      closeJob,
      getHrUser,
      getHrUserByEmail,
      createHrUser,
      updateHrUser,
      setHrActive,
      resetHrPassword,
      setApplicationStatus,
      assignHr,
      addInternalNote,
      toggleSavedForLater,
      getApplicationsWithDetails,
      getAuditForApplication,
      getAuditFeed,
      saveTalent,
      updateTalent,
      removeTalent,
      getTalentForHr,
      isTalentSavedBy,
      getTalentSavers,
      pipelineCounts,
      hrMetrics,
      orgMetrics,
    ]
  )

  return (
    <RecruitmentStoreContext.Provider value={value}>
      {children}
    </RecruitmentStoreContext.Provider>
  )
}

export function useRecruitmentStore() {
  const ctx = useContext(RecruitmentStoreContext)
  if (!ctx) {
    throw new Error('useRecruitmentStore must be within RecruitmentStoreProvider')
  }
  return ctx
}

/** Alias — candidate portal continues to use this name */
export function useCandidateStore() {
  return useRecruitmentStore()
}

export { RecruitmentStoreProvider as CandidateStoreProvider }
