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
  resumeUrl?: string
  education: Education[]
  experience: Experience[]
  skills: Skill[]
  profileComplete: boolean
  createdAt: Date
}

export interface Application {
  id: string
  candidateId: string
  jobId: string
  status: ApplicationStatus
  appliedDate: Date
  resumeUrl: string
  notes?: string
  internalNotes?: string
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

// View models (enriched data for UI)
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
