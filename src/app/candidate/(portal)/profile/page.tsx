'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResumeParseReview } from '@/components/candidate/resume-parse-review'
import { useAuth } from '@/lib/mock-auth'
import { computeProfileCompletion, useCandidateStore } from '@/lib/candidate-store'
import { formatDate } from '@/lib/utils'
import { formatFileSize } from '@/lib/resume-parse'
import type { Education, Experience, ParsedResumeData } from '@/types'
import { toast } from 'sonner'
import { Pencil, Plus, Trash2, Star } from 'lucide-react'

export default function ProfilePage() {
  const { user, refreshFromCandidate } = useAuth()
  const store = useCandidateStore()
  const candidateId = user?.candidateId || user?.id || ''
  const candidate = store.getCandidate(candidateId)
  const completion = candidate ? computeProfileCompletion(candidate) : 0

  const [personal, setPersonal] = useState({
    fullName: candidate?.fullName || '',
    email: candidate?.email || '',
    phone: candidate?.phone || '',
    location: candidate?.location || '',
    headline: candidate?.headline || '',
    bio: candidate?.bio || '',
  })

  const [eduForm, setEduForm] = useState<Omit<Education, 'id'> | null>(null)
  const [expForm, setExpForm] = useState<
    (Omit<Experience, 'id' | 'startDate' | 'endDate'> & {
      startDate: string
      endDate: string
      id?: string
    }) | null
  >(null)
  const [skillsText, setSkillsText] = useState(
    candidate?.skills.map((s) => s.name).join(', ') || ''
  )
  const [certsText, setCertsText] = useState(
    candidate?.certifications.map((c) => c.name).join(', ') || ''
  )
  const [prefs, setPrefs] = useState({
    roles: candidate?.preferredRoles.join(', ') || '',
    locations: candidate?.preferredLocations.join(', ') || '',
    interests: candidate?.careerInterests.join(', ') || '',
  })

  if (!candidate) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <p className="text-foreground-muted">Loading profile…</p>
      </div>
    )
  }

  const savePersonal = () => {
    store.updateCandidate(candidateId, personal)
    const updated = store.getCandidate(candidateId)
    if (updated) refreshFromCandidate(updated)
    toast.success('Personal details saved')
  }

  const saveSkillsPrefs = () => {
    store.setSkills(
      candidateId,
      skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name, i) => ({ id: `skill-${i}-${name}`, name }))
    )
    store.updateCandidate(candidateId, {
      certifications: certsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name, i) => ({ id: `cert-${i}`, name })),
      preferredRoles: prefs.roles.split(',').map((s) => s.trim()).filter(Boolean),
      preferredLocations: prefs.locations
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      careerInterests: prefs.interests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    })
    toast.success('Skills and preferences saved')
  }

  const handleParsed = async (data: ParsedResumeData, file: File) => {
    await store.addResume(
      candidateId,
      {
        name: file.name,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
        isDefault: candidate.resumes.length === 0,
      },
      file
    )

    const patch: Parameters<typeof store.updateCandidate>[1] = {}
    if (data.fullName) patch.fullName = data.fullName
    if (data.email) patch.email = data.email
    if (data.phone) patch.phone = data.phone
    if (data.skills.length) {
      store.setSkills(
        candidateId,
        data.skills.map((name, i) => ({ id: `parsed-skill-${i}`, name }))
      )
      setSkillsText(data.skills.join(', '))
    }
    if (data.education.length) {
      data.education.forEach((e) => {
        if (e.degree || e.institution) {
          store.addEducation(candidateId, {
            degree: e.degree || 'Degree',
            field: e.field || '',
            institution: e.institution || '',
            year: e.year || new Date().getFullYear(),
          })
        }
      })
    }
    if (data.experience.length) {
      data.experience.forEach((e) => {
        if (e.title || e.company) {
          store.addExperience(candidateId, {
            title: e.title || 'Role',
            company: e.company || '',
            location: e.location || '',
            startDate: new Date(),
            description: e.description,
            current: true,
          })
        }
      })
    }
    if (Object.keys(patch).length) {
      store.updateCandidate(candidateId, patch)
      setPersonal((p) => ({ ...p, ...patch }))
    }
    toast.success('Resume saved')
  }

  const previewResume = async (resumeId: string, name: string) => {
    const blob = await store.getResumeFile(resumeId)
    if (!blob) {
      toast.error('File not found in local storage')
      return
    }
    const url = URL.createObjectURL(blob)
    if (name.toLowerCase().endsWith('.pdf') || blob.type === 'application/pdf') {
      window.open(url, '_blank')
    } else {
      const a = document.createElement('a')
      a.href = url
      a.download = name
      a.click()
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="My Profile"
        description={`Profile ${completion}% complete — apply anytime, even if incomplete`}
      />

      <div className="space-y-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Basic information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full name</Label>
                <Input
                  value={personal.fullName}
                  onChange={(e) =>
                    setPersonal({ ...personal, fullName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={personal.phone}
                  onChange={(e) =>
                    setPersonal({ ...personal, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={personal.email}
                  onChange={(e) =>
                    setPersonal({ ...personal, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={personal.location}
                  onChange={(e) =>
                    setPersonal({ ...personal, location: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Headline</Label>
                <Input
                  value={personal.headline}
                  onChange={(e) =>
                    setPersonal({ ...personal, headline: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Bio</Label>
                <Textarea
                  rows={4}
                  value={personal.bio}
                  onChange={(e) =>
                    setPersonal({ ...personal, bio: e.target.value })
                  }
                />
              </div>
            </div>
            <Button onClick={savePersonal}>Save</Button>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Education</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setEduForm({
                  degree: '',
                  field: '',
                  institution: '',
                  year: new Date().getFullYear(),
                })
              }
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {candidate.education.length === 0 && (
              <p className="text-sm text-foreground-muted">No education added</p>
            )}
            {candidate.education.map((edu) => (
              <div
                key={edu.id}
                className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {edu.degree}
                    {edu.field ? ` · ${edu.field}` : ''}
                  </p>
                  <p className="text-sm text-foreground-muted">
                    {edu.institution} · {edu.year}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => store.removeEducation(candidateId, edu.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {eduForm && (
              <div className="space-y-3 rounded-md border border-border p-4">
                <Input
                  placeholder="Degree"
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                />
                <Input
                  placeholder="Field"
                  value={eduForm.field}
                  onChange={(e) => setEduForm({ ...eduForm, field: e.target.value })}
                />
                <Input
                  placeholder="Institution"
                  value={eduForm.institution}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, institution: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Year"
                  value={eduForm.year}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, year: Number(e.target.value) })
                  }
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      store.addEducation(candidateId, eduForm)
                      setEduForm(null)
                    }}
                  >
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEduForm(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Experience</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setExpForm({
                  title: '',
                  company: '',
                  location: '',
                  description: '',
                  startDate: '',
                  endDate: '',
                  current: true,
                })
              }
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {candidate.experience.length === 0 && (
              <p className="text-sm text-foreground-muted">No experience added</p>
            )}
            {candidate.experience.map((exp) => (
              <div
                key={exp.id}
                className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground">{exp.title}</p>
                  <p className="text-sm text-foreground-muted">
                    {exp.company} · {exp.location}
                  </p>
                  {exp.description && (
                    <p className="mt-1 text-sm text-foreground-subtle">{exp.description}</p>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => store.removeExperience(candidateId, exp.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {expForm && (
              <div className="space-y-3 rounded-md border border-border p-4">
                <Input
                  placeholder="Title"
                  value={expForm.title}
                  onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                />
                <Input
                  placeholder="Company"
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                />
                <Input
                  placeholder="Location"
                  value={expForm.location}
                  onChange={(e) =>
                    setExpForm({ ...expForm, location: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Description"
                  value={expForm.description}
                  onChange={(e) =>
                    setExpForm({ ...expForm, description: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      store.addExperience(candidateId, {
                        title: expForm.title,
                        company: expForm.company,
                        location: expForm.location,
                        description: expForm.description,
                        startDate: expForm.startDate
                          ? new Date(expForm.startDate)
                          : new Date(),
                        endDate: expForm.endDate
                          ? new Date(expForm.endDate)
                          : undefined,
                        current: expForm.current,
                      })
                      setExpForm(null)
                    }}
                  >
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setExpForm(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Skills, certifications & preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Skills</Label>
              <Input
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="GCP, ICH, SAS"
              />
            </div>
            <div className="space-y-2">
              <Label>Certifications</Label>
              <Input
                value={certsText}
                onChange={(e) => setCertsText(e.target.value)}
                placeholder="GCP Certification"
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred roles</Label>
              <Input
                value={prefs.roles}
                onChange={(e) => setPrefs({ ...prefs, roles: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred locations</Label>
              <Input
                value={prefs.locations}
                onChange={(e) => setPrefs({ ...prefs, locations: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Career interests</Label>
              <Input
                value={prefs.interests}
                onChange={(e) => setPrefs({ ...prefs, interests: e.target.value })}
              />
            </div>
            <Button onClick={saveSkillsPrefs}>Save</Button>
          </CardContent>
        </Card>

        <Card className="shadow-none" id="resumes">
          <CardHeader>
            <CardTitle>Resumes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {candidate.resumes.length === 0 && (
              <p className="text-sm text-foreground-muted">No resumes uploaded yet</p>
            )}
            <ul className="space-y-3">
              {candidate.resumes.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-col gap-2 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {r.name}
                      {r.isDefault && (
                        <span className="ml-2 text-xs text-primary">Default</span>
                      )}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      {formatFileSize(r.size)} · {formatDate(r.uploadedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => previewResume(r.id, r.name)}
                    >
                      Preview
                    </Button>
                    {!r.isDefault && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => store.setDefaultResume(candidateId, r.id)}
                      >
                        <Star className="h-4 w-4" />
                        Default
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        const name = window.prompt('Rename resume', r.name)
                        if (name?.trim()) {
                          store.updateResume(candidateId, r.id, { name: name.trim() })
                        }
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => store.deleteResume(candidateId, r.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <ResumeParseReview onConfirm={handleParsed} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
