import type { Candidate } from '@/types'

type SeedCandidate = Omit<
  Candidate,
  | 'certifications'
  | 'careerInterests'
  | 'preferredRoles'
  | 'preferredLocations'
  | 'resumes'
  | 'emailVerified'
  | 'onboardingComplete'
> &
  Partial<
    Pick<
      Candidate,
      | 'certifications'
      | 'careerInterests'
      | 'preferredRoles'
      | 'preferredLocations'
      | 'resumes'
      | 'emailVerified'
      | 'onboardingComplete'
      | 'location'
      | 'headline'
      | 'bio'
      | 'avatarUrl'
    >
  >

export function normalizeCandidate(c: SeedCandidate): Candidate {
  const resumes = c.resumes ?? []
  return {
    ...c,
    location: c.location ?? '',
    headline: c.headline ?? '',
    bio: c.bio ?? '',
    avatarUrl: c.avatarUrl,
    certifications: c.certifications ?? [],
    careerInterests: c.careerInterests ?? [],
    preferredRoles: c.preferredRoles ?? [],
    preferredLocations: c.preferredLocations ?? [],
    resumes,
    emailVerified: c.emailVerified ?? true,
    onboardingComplete: c.onboardingComplete ?? c.profileComplete,
    createdAt: c.createdAt instanceof Date ? c.createdAt : new Date(c.createdAt),
    education: c.education.map((e) => ({ ...e })),
    experience: c.experience.map((e) => ({
      ...e,
      startDate: e.startDate instanceof Date ? e.startDate : new Date(e.startDate),
      endDate: e.endDate
        ? e.endDate instanceof Date
          ? e.endDate
          : new Date(e.endDate)
        : undefined,
    })),
    skills: c.skills.map((s) => ({ ...s })),
  }
}

export function reviveCandidate(raw: Candidate): Candidate {
  return normalizeCandidate({
    ...raw,
    createdAt: new Date(raw.createdAt),
    experience: raw.experience.map((e) => ({
      ...e,
      startDate: new Date(e.startDate),
      endDate: e.endDate ? new Date(e.endDate) : undefined,
    })),
    resumes: (raw.resumes ?? []).map((r) => ({
      ...r,
      uploadedAt: new Date(r.uploadedAt),
    })),
  })
}
