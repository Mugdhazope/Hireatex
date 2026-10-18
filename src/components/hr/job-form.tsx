'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  ExperienceLevel,
  Job,
  JobCategory,
  JobType,
  QualificationLevel,
  Skill,
} from '@/types'

const CATEGORIES: { value: JobCategory; label: string }[] = [
  { value: 'clinical-research', label: 'Clinical Research' },
  { value: 'regulatory-affairs', label: 'Regulatory Affairs' },
  { value: 'pharmacovigilance', label: 'Pharmacovigilance' },
  { value: 'medical-affairs', label: 'Medical Affairs' },
  { value: 'quality-assurance', label: 'Quality Assurance' },
  { value: 'data-management', label: 'Data Management' },
  { value: 'biostatistics', label: 'Biostatistics' },
  { value: 'medical-writing', label: 'Medical Writing' },
]

export type JobFormValues = {
  title: string
  company: string
  location: string
  jobType: JobType
  experienceLevel: ExperienceLevel
  category: JobCategory
  department: string
  about: string
  responsibilitiesText: string
  requirementsText: string
  qualificationDescription: string
  skillsText: string
  salaryMin: string
  salaryMax: string
  deadline: string
  qualifications: QualificationLevel[]
}

function jobToValues(job?: Job): JobFormValues {
  return {
    title: job?.title ?? '',
    company: job?.company ?? 'HiretaX Partners',
    location: job?.location ?? '',
    jobType: job?.jobType ?? 'full-time',
    experienceLevel: job?.experienceLevel ?? 'mid',
    category: job?.category ?? 'clinical-research',
    department: job?.department ?? '',
    about: job?.about ?? '',
    responsibilitiesText: (job?.responsibilities ?? []).join('\n'),
    requirementsText: (job?.requirements ?? []).join('\n'),
    qualificationDescription: job?.qualificationDescription ?? '',
    skillsText: (job?.skills ?? []).map((s) => s.name).join(', '),
    salaryMin: job?.salaryMin != null ? String(job.salaryMin) : '',
    salaryMax: job?.salaryMax != null ? String(job.salaryMax) : '',
    deadline: job?.deadline
      ? new Date(job.deadline).toISOString().slice(0, 10)
      : '',
    qualifications: job?.qualifications ?? ['bachelors'],
  }
}

export function valuesToJobPatch(values: JobFormValues): Omit<
  Job,
  'id' | 'postedDate' | 'status' | 'applicationCount' | 'createdByHrId'
> {
  const skills: Skill[] = values.skillsText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((name) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
    }))

  return {
    title: values.title.trim(),
    company: values.company.trim() || 'HiretaX Partners',
    location: values.location.trim(),
    jobType: values.jobType,
    experienceLevel: values.experienceLevel,
    category: values.category,
    department: values.department.trim() || undefined,
    about: values.about.trim(),
    responsibilities: values.responsibilitiesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
    requirements: values.requirementsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
    qualificationDescription: values.qualificationDescription.trim(),
    skills,
    qualifications: values.qualifications,
    salaryMin: values.salaryMin ? Number(values.salaryMin) : undefined,
    salaryMax: values.salaryMax ? Number(values.salaryMax) : undefined,
    deadline: values.deadline ? new Date(values.deadline) : undefined,
  }
}

interface JobFormProps {
  initial?: Job
  onSaveDraft: (values: JobFormValues) => void
  onPublish: (values: JobFormValues) => void
  saving?: boolean
}

export function JobForm({ initial, onSaveDraft, onPublish, saving }: JobFormProps) {
  const [values, setValues] = useState<JobFormValues>(() => jobToValues(initial))

  const set = <K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const valid = values.title.trim() && values.location.trim() && values.about.trim()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Job title</Label>
          <Input
            id="title"
            value={values.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Clinical Research Associate"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={values.company}
            onChange={(e) => set('company', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={values.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="Boston, MA or Remote"
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={values.category}
            onValueChange={(v) => set('category', v as JobCategory)}
          >
            <SelectTrigger className="bg-surface">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface">
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={values.department}
            onChange={(e) => set('department', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Job type</Label>
          <Select
            value={values.jobType}
            onValueChange={(v) => set('jobType', v as JobType)}
          >
            <SelectTrigger className="bg-surface">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface">
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Experience</Label>
          <Select
            value={values.experienceLevel}
            onValueChange={(v) => set('experienceLevel', v as ExperienceLevel)}
          >
            <SelectTrigger className="bg-surface">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface">
              <SelectItem value="entry">Entry</SelectItem>
              <SelectItem value="mid">Mid</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaryMin">Salary min</Label>
          <Input
            id="salaryMin"
            type="number"
            value={values.salaryMin}
            onChange={(e) => set('salaryMin', e.target.value)}
            placeholder="80000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaryMax">Salary max</Label>
          <Input
            id="salaryMax"
            type="number"
            value={values.salaryMax}
            onChange={(e) => set('salaryMax', e.target.value)}
            placeholder="120000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deadline">Application deadline</Label>
          <Input
            id="deadline"
            type="date"
            value={values.deadline}
            onChange={(e) => set('deadline', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="about">About the role</Label>
        <Textarea
          id="about"
          rows={4}
          value={values.about}
          onChange={(e) => set('about', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
        <Textarea
          id="responsibilities"
          rows={4}
          value={values.responsibilitiesText}
          onChange={(e) => set('responsibilitiesText', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements (one per line)</Label>
        <Textarea
          id="requirements"
          rows={4}
          value={values.requirementsText}
          onChange={(e) => set('requirementsText', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="qualificationDescription">Qualifications</Label>
        <Textarea
          id="qualificationDescription"
          rows={2}
          value={values.qualificationDescription}
          onChange={(e) => set('qualificationDescription', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Input
          id="skills"
          value={values.skillsText}
          onChange={(e) => set('skillsText', e.target.value)}
          placeholder="GCP, ICH Guidelines, Site Monitoring"
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={!valid || saving}
          onClick={() => onSaveDraft(values)}
        >
          Save Draft
        </Button>
        <Button
          type="button"
          disabled={!valid || saving}
          onClick={() => onPublish(values)}
        >
          Publish
        </Button>
      </div>
    </div>
  )
}
