'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/mock-auth'
import { useRecruitmentStore } from '@/lib/recruitment-store'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Candidate } from '@/types'

export default function HRCandidatesPage() {
  const { user } = useAuth()
  const store = useRecruitmentStore()
  const hrId = user?.hrId ?? user?.id ?? ''
  const [query, setQuery] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [selected, setSelected] = useState<Candidate | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [noteInput, setNoteInput] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const skill = skillFilter.trim().toLowerCase()
    const loc = locationFilter.trim().toLowerCase()
    return store.candidates.filter((c) => {
      if (q) {
        const hay = `${c.fullName} ${c.email} ${c.headline ?? ''} ${c.skills
          .map((s) => s.name)
          .join(' ')}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (skill && !c.skills.some((s) => s.name.toLowerCase().includes(skill))) {
        return false
      }
      if (loc && !(c.location ?? '').toLowerCase().includes(loc)) return false
      return true
    })
  }, [store.candidates, query, skillFilter, locationFilter])

  const mySave = selected
    ? store.getTalentForHr(hrId).find((t) => t.candidateId === selected.id)
    : undefined
  const savers = selected ? store.getTalentSavers(selected.id) : []

  const openCandidate = (c: Candidate) => {
    setSelected(c)
    const save = store.getTalentForHr(hrId).find((t) => t.candidateId === c.id)
    setTagInput(save?.tags.join(', ') ?? '')
    setNoteInput(save?.note ?? '')
  }

  const pastApps = selected
    ? store
        .getApplicationsWithDetails()
        .filter((a) => a.candidateId === selected.id)
    : []

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Candidates
          </h1>
          <p className="text-foreground-muted">
            Talent database — save privately to your pool
          </p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <Input
            placeholder="Search name, email, skills…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-surface"
          />
          <Input
            placeholder="Filter by skill"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="bg-surface"
          />
          <Input
            placeholder="Filter by location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-surface"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const savedByMe = store.isTalentSavedBy(hrId, c.id)
            const others = store
              .getTalentSavers(c.id)
              .filter((t) => t.hrId !== hrId).length
            const apps = store.applications.filter((a) => a.candidateId === c.id)
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => openCandidate(c)}
                className="text-left rounded-lg border border-border bg-surface p-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{c.fullName}</p>
                    <p className="text-sm text-foreground-muted line-clamp-1">
                      {c.headline || c.email}
                    </p>
                  </div>
                  <Star
                    className={cn(
                      'h-4 w-4 shrink-0',
                      savedByMe ? 'fill-primary text-primary' : 'text-foreground-muted'
                    )}
                  />
                </div>
                <p className="text-xs text-foreground-muted mt-2">
                  {c.location || 'Location n/a'} · {apps.length} application
                  {apps.length === 1 ? '' : 's'}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {c.skills.slice(0, 4).map((s) => (
                    <Badge key={s.id} variant="outline" className="text-xs font-normal">
                      {s.name}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 flex gap-2 text-xs">
                  {savedByMe && (
                    <span className="text-primary">Saved by you</span>
                  )}
                  {others > 0 && (
                    <span className="text-foreground-muted">
                      Saved by {others} other{others === 1 ? '' : 's'}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-foreground-muted py-16">
            No candidates match your filters.
          </p>
        )}
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-surface">
          {selected && (
            <div className="space-y-6">
              <SheetHeader>
                <SheetTitle className="text-left">{selected.fullName}</SheetTitle>
                <p className="text-sm text-foreground-muted text-left">
                  {selected.email}
                </p>
              </SheetHeader>

              <div className="flex flex-wrap gap-2 text-xs text-foreground-muted">
                {savers.map((t) => {
                  const hr = store.getHrUser(t.hrId)
                  return (
                    <Badge key={t.id} variant="secondary" className="font-normal">
                      {t.hrId === hrId
                        ? 'Saved by you'
                        : `Saved by ${hr?.fullName ?? 'HR'}`}
                    </Badge>
                  )
                })}
              </div>

              <div className="space-y-3">
                <Button
                  variant={mySave ? 'outline' : 'default'}
                  className="w-full"
                  onClick={() => {
                    if (mySave) {
                      store.removeTalent(hrId, selected.id)
                      toast.success('Removed from your talent pool')
                    } else {
                      store.saveTalent(hrId, selected.id, {
                        tags: tagInput
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean),
                        note: noteInput || undefined,
                      })
                      toast.success('Saved to your talent pool')
                    }
                  }}
                >
                  <Star className={cn('h-4 w-4 mr-2', mySave && 'fill-current')} />
                  {mySave ? 'Remove from talent pool' : 'Save to talent pool'}
                </Button>

                <div className="space-y-2">
                  <Label>Your tags (comma-separated)</Label>
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="bg-background"
                    placeholder="strong CRA, Boston"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Private note</Label>
                  <Textarea
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="bg-background"
                    rows={3}
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    store.saveTalent(hrId, selected.id, {
                      tags: tagInput
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                      note: noteInput || undefined,
                    })
                    toast.success('Talent notes updated')
                  }}
                >
                  Save notes & tags
                </Button>
              </div>

              {selected.skills.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.skills.map((s) => (
                      <Badge key={s.id} variant="outline" className="font-normal">
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h3 className="text-sm font-semibold mb-2">Past applications</h3>
                {pastApps.length === 0 ? (
                  <p className="text-sm text-foreground-muted">None yet</p>
                ) : (
                  <ul className="space-y-2">
                    {pastApps.map((a) => (
                      <li key={a.id} className="text-sm border-b border-border pb-2">
                        <p className="font-medium">{a.job.title}</p>
                        <p className="text-foreground-muted capitalize">
                          {a.status.replace(/_/g, ' ')}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </main>
  )
}
