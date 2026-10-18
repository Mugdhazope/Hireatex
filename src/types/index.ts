// Core entity types for HiretaX

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'shortlisted'
  | 'forwarded'
  | 'interview'
  | 'selected'
  | 'rejected'
  | 'saved_for_later'

export type JobType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'internship'

export type ExperienceLevel =
  | 'entry'
  | 'mid'
  | 'senior'
  | 'lead'

export type JobCategory =
  | 'clinical-research'
  | 'regulatory-affairs'
  | 'pharmacovigilance'
  | 'medical-affairs'
  | 'quality-assurance'
  | 'data-management'
  | 'biostatistics'
  | 'medical-writing'

export type QualificationLevel =
  | 'high-school'
  | 'bachelors'
  | 'masters'
  | 'phd'
  | 'md'

export type AuditAction =
  | 'status_change'
  | 'note_added'
  | 'assigned'
  | 'saved_for_later'
  | 'unsaved_for_later'
  | 'job_created'
  | 'job_published'
  | 'job_unpublished'
  | 'job_closed'
  | 'job_updated'
  | 'talent_saved'
  | 'talent_removed'

export interface Skill {
  id: string
  name: string
}

export interface Education {
  id: string
  degree: string
  field: string
  institution: string
  year: number
  current?: boolean
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: Date
  endDate?: Date
  current?: boolean
  description?: string
}

export interface Certification {
  id: string
  name: string
  issuer?: string
  year?: number
}

export interface ResumeFileMeta {
  id: string
  name: string
  size: number
  mimeType: string
  uploadedAt: Date
  isDefault: boolean
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  jobType: JobType
  experienceLevel: ExperienceLevel
  category: JobCategory
  department?: string
  qualifications: QualificationLevel[]
  skills: Skill[]
  about: string
  responsibilities: string[]
  requirements: string[]
  qualificationDescription: string
  postedDate: Date
  status: 'active' | 'paused' | 'closed' | 'draft'
  applicationCount?: number
  createdByHrId?: string
  salaryMin?: number
  salaryMax?: number
  deadline?: Date
}

export interface Candidate {
  id: string
  fullName: string
  email: string
  phone: string
  password?: string
  location?: string
  headline?: string
  bio?: string
  avatarUrl?: string
  education: Education[]
  experience: Experience[]
  skills: Skill[]
  certifications: Certification[]
  careerInterests: string[]
  preferredRoles: string[]
  preferredLocations: string[]
  resumes: ResumeFileMeta[]
  /** @deprecated use resumes; kept for seed compatibility */
  resumeUrl?: string
  profileComplete: boolean
  emailVerified: boolean
  onboardingComplete: boolean
  createdAt: Date
}

export interface Application {
  id: string
  candidateId: string
  jobId: string
  status: ApplicationStatus
  appliedDate: Date
  resumeUrl: string
  resumeId?: string
  coverLetter?: string
  notes?: string
  internalNotes?: string
  assignedHrId?: string
  savedForLaterBy?: string[]
}

export interface SavedJob {
  candidateId: string
  jobId: string
  savedAt: Date
}

export interface AuditEvent {
  id: string
  applicationId?: string
  jobId?: string
  candidateId?: string
  actorHrId: string
  action: AuditAction
  note?: string
  fromStatus?: ApplicationStatus
  toStatus?: ApplicationStatus
  timestamp: Date
  meta?: Record<string, string>
}

export interface HrTalentSave {
  id: string
  hrId: string
  candidateId: string
  tags: string[]
  note?: string
  savedAt: Date
}

export interface HRUser {
  id: string
  fullName: string
  email: string
  password?: string
  role: 'hr' | 'admin'
  active: boolean
  createdAt: Date
}

export interface AdminUser extends HRUser {
  role: 'admin'
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'candidate' | 'hr' | 'admin'
  candidateId?: string
  hrId?: string
  emailVerified?: boolean
}

export interface ApplicationWithDetails extends Application {
  candidate: Candidate
  job: Job
}

export interface JobWithApplications extends Job {
  applications: Application[]
}

export interface CandidateWithApplications extends Candidate {
  applications: ApplicationWithDetails[]
}

export interface ParsedResumeData {
  fullName?: string
  email?: string
  phone?: string
  skills: string[]
  education: Array<{
    degree?: string
    field?: string
    institution?: string
    year?: number
  }>
  experience: Array<{
    title?: string
    company?: string
    location?: string
    description?: string
  }>
  rawText: string
  warnings: string[]
}

/** Candidate-facing status labels (no HR jargon for internals) */
export const CANDIDATE_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  forwarded: 'Forwarded',
  interview: 'Interview',
  selected: 'Offered',
  rejected: 'Rejected',
  saved_for_later: 'Under Review',
}

export const HR_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'New',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  forwarded: 'Forwarded',
  interview: 'Interview',
  selected: 'Offered',
  rejected: 'Rejected',
  saved_for_later: 'Saved for Later',
}
