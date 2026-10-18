// Core entity types for HiretaX

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'shortlisted'
  | 'forwarded'
  | 'interview'
  | 'selected'
  | 'rejected'

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
  qualifications: QualificationLevel[]
  skills: Skill[]
  about: string
  responsibilities: string[]
  requirements: string[]
  qualificationDescription: string
  postedDate: Date
  status: 'active' | 'paused' | 'closed' | 'draft'
  applicationCount?: number
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
}

export interface SavedJob {
  candidateId: string
  jobId: string
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
