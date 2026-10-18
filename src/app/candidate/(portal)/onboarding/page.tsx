'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/mock-auth'
import { useCandidateStore } from '@/lib/candidate-store'
import { toast } from 'sonner'

const STEPS = ['Personal', 'Education', 'Experience', 'Preferences'] as const

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const store = useCandidateStore()
  const candidateId = user?.candidateId || user?.id || ''
  const candidate = store.getCandidate(candidateId)
  const [step, setStep] = useState(0)
  const [personal, setPersonal] = useState({
    location: candidate?.location || '',
    headline: candidate?.headline || '',
    bio: candidate?.bio || '',
  })
  const [education, setEducation] = useState({
    degree: '',
    field: '',
    institution: '',
    year: new Date().getFullYear(),
  })
  const [experience, setExperience] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
  })
  const [preferences, setPreferences] = useState({
    roles: candidate?.preferredRoles.join(', ') || '',
    locations: candidate?.preferredLocations.join(', ') || '',
    interests: candidate?.careerInterests.join(', ') || '',
  })

  const finish = (skipped = false) => {
    if (!candidateId) return
    store.updateCandidate(candidateId, {
      onboardingComplete: true,
      ...(skipped
        ? {}
        : {
            location: personal.location,
            headline: personal.headline,
            bio: personal.bio,
            preferredRoles: preferences.roles
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
            preferredLocations: preferences.locations
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
            careerInterests: preferences.interests
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
          }),
    })
    toast.success(skipped ? 'You can finish your profile anytime' : 'Profile ready')
    router.push('/candidate')
  }

  const next = () => {
    if (step === 0 && candidateId) {
      store.updateCandidate(candidateId, personal)
    }
    if (step === 1 && candidateId && education.degree && education.institution) {
      store.addEducation(candidateId, education)
    }
    if (step === 2 && candidateId && experience.title && experience.company) {
      store.addExperience(candidateId, {
        ...experience,
        startDate: new Date(),
        current: true,
      })
    }
    if (step === STEPS.length - 1) {
      finish(false)
      return
    }
    setStep((s) => s + 1)
  }

  return (
    <div className="container mx-auto max-w-xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary mb-2">
          Step {step + 1} of {STEPS.length}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {STEPS[step]}
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Optional — you can skip and apply to jobs anytime.
        </p>
      </div>

      <div className="mb-6 flex gap-1">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i <= step ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
        {step === 0 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={personal.location}
                onChange={(e) =>
                  setPersonal({ ...personal, location: e.target.value })
                }
                placeholder="Boston, MA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={personal.headline}
                onChange={(e) =>
                  setPersonal({ ...personal, headline: e.target.value })
                }
                placeholder="Clinical Research Associate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                value={personal.bio}
                onChange={(e) => setPersonal({ ...personal, bio: e.target.value })}
                placeholder="A short summary of your background"
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="space-y-2">
              <Label>Degree</Label>
              <Input
                value={education.degree}
                onChange={(e) =>
                  setEducation({ ...education, degree: e.target.value })
                }
                placeholder="Master of Science"
              />
            </div>
            <div className="space-y-2">
              <Label>Field</Label>
              <Input
                value={education.field}
                onChange={(e) =>
                  setEducation({ ...education, field: e.target.value })
                }
                placeholder="Clinical Research"
              />
            </div>
            <div className="space-y-2">
              <Label>Institution</Label>
              <Input
                value={education.institution}
                onChange={(e) =>
                  setEducation({ ...education, institution: e.target.value })
                }
                placeholder="Boston University"
              />
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Input
                type="number"
                value={education.year}
                onChange={(e) =>
                  setEducation({ ...education, year: Number(e.target.value) })
                }
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={experience.title}
                onChange={(e) =>
                  setExperience({ ...experience, title: e.target.value })
                }
                placeholder="Clinical Research Coordinator"
              />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                value={experience.company}
                onChange={(e) =>
                  setExperience({ ...experience, company: e.target.value })
                }
                placeholder="Company name"
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={experience.location}
                onChange={(e) =>
                  setExperience({ ...experience, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={experience.description}
                onChange={(e) =>
                  setExperience({ ...experience, description: e.target.value })
                }
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-2">
              <Label>Preferred roles (comma-separated)</Label>
              <Input
                value={preferences.roles}
                onChange={(e) =>
                  setPreferences({ ...preferences, roles: e.target.value })
                }
                placeholder="CRA, CRC"
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred locations</Label>
              <Input
                value={preferences.locations}
                onChange={(e) =>
                  setPreferences({ ...preferences, locations: e.target.value })
                }
                placeholder="Boston, Remote"
              />
            </div>
            <div className="space-y-2">
              <Label>Career interests</Label>
              <Input
                value={preferences.interests}
                onChange={(e) =>
                  setPreferences({ ...preferences, interests: e.target.value })
                }
                placeholder="Oncology, Regulatory"
              />
            </div>
          </>
        )}

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={() => finish(true)}>
            Skip for now
          </Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            <Button onClick={next}>
              {step === STEPS.length - 1 ? 'Finish' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
