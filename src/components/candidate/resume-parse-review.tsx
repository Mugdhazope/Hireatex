'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { parseResumeFile, validateResumeFile } from '@/lib/resume-parse'
import type { ParsedResumeData } from '@/types'
import { toast } from 'sonner'

interface ResumeParseReviewProps {
  onConfirm: (data: ParsedResumeData, file: File) => Promise<void> | void
  onCancel?: () => void
}

export function ResumeParseReview({ onConfirm, onCancel }: ResumeParseReviewProps) {
  const [phase, setPhase] = useState<'idle' | 'parsing' | 'review' | 'saving'>('idle')
  const [progress, setProgress] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [parsed, setParsed] = useState<ParsedResumeData | null>(null)
  const [draft, setDraft] = useState({
    fullName: '',
    email: '',
    phone: '',
    skills: '',
  })

  const handleFile = async (selected: File | null) => {
    if (!selected) return
    const error = validateResumeFile(selected)
    if (error) {
      toast.error(error)
      return
    }
    setFile(selected)
    setPhase('parsing')
    setProgress(20)
    const timer = setInterval(() => {
      setProgress((p) => Math.min(p + 15, 85))
    }, 200)

    const result = await parseResumeFile(selected)
    clearInterval(timer)
    setProgress(100)
    setParsed(result)
    setDraft({
      fullName: result.fullName || '',
      email: result.email || '',
      phone: result.phone || '',
      skills: result.skills.join(', '),
    })
    setPhase('review')

    if (result.warnings.length) {
      result.warnings.forEach((w) => toast.message(w))
    }
  }

  const confirm = async () => {
    if (!file || !parsed) return
    setPhase('saving')
    const merged: ParsedResumeData = {
      ...parsed,
      fullName: draft.fullName || parsed.fullName,
      email: draft.email || parsed.email,
      phone: draft.phone || parsed.phone,
      skills: draft.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }
    await onConfirm(merged, file)
    setPhase('idle')
    setFile(null)
    setParsed(null)
    setProgress(0)
  }

  if (phase === 'idle') {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <p className="mb-3 text-sm text-foreground-muted">
          Upload PDF or DOCX to extract details. Legacy .DOC can be stored but not parsed.
        </p>
        <Input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
        />
      </div>
    )
  }

  if (phase === 'parsing') {
    return (
      <div className="space-y-3 rounded-lg border border-border p-6">
        <p className="text-sm font-medium text-foreground">Extracting text…</p>
        <div className="h-2 overflow-hidden rounded-full bg-background-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-surface p-6">
      <div>
        <h3 className="font-semibold text-foreground">Review extracted details</h3>
        <p className="text-sm text-foreground-muted">
          Edit anything before saving to your profile. File: {file?.name}
        </p>
      </div>

      {parsed?.warnings.map((w) => (
        <p key={w} className="rounded-md bg-warning-bg px-3 py-2 text-xs text-warning">
          {w}
        </p>
      ))}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={draft.fullName}
            onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={draft.phone}
            onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Skills (comma-separated)</Label>
          <Input
            value={draft.skills}
            onChange={(e) => setDraft({ ...draft, skills: e.target.value })}
          />
        </div>
      </div>

      {parsed?.rawText ? (
        <div className="space-y-2">
          <Label>Extracted text preview</Label>
          <Textarea readOnly rows={4} value={parsed.rawText.slice(0, 1200)} />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button onClick={confirm} disabled={phase === 'saving'}>
          {phase === 'saving' ? 'Saving…' : 'Save resume & update profile'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setPhase('idle')
            setParsed(null)
            setFile(null)
            onCancel?.()
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
