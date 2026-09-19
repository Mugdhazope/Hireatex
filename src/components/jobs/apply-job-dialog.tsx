'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { CheckCircle, Upload } from 'lucide-react'
import type { Job } from '@/types'

interface ApplyJobDialogProps {
  job: Job
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApplyJobDialog({ job, open, onOpenChange }: ApplyJobDialogProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    verificationCode: '',
    resume: null as File | null,
  })

  const handleSubmit = () => {
    // Mock submission
    setStep(4)
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const content = (
    <div className="space-y-6">
      {step === 1 && (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1-555-0123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
          </div>
          <Button onClick={() => setStep(2)} className="w-full">
            Continue
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="space-y-4">
            <p className="text-sm text-foreground-muted">
              We've sent a verification code to {formData.email}
            </p>
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                value={formData.verificationCode}
                onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                placeholder="123456"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              Resend Code
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
            <Button onClick={() => setStep(3)} className="flex-1">
              Verify
            </Button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Resume</Label>
              <div className="border-2 border-dashed border-border rounded-md p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-foreground-muted" />
                <p className="text-sm text-foreground-muted mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-foreground-subtle">
                  PDF, DOC, or DOCX (max 5MB)
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setFormData({ ...formData, resume: file })
                  }}
                />
              </div>
              {formData.resume && (
                <p className="text-sm text-foreground-muted">
                  Selected: {formData.resume.name}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
              Back
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Submit Application
            </Button>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div className="text-center py-4">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              You're all set
            </h3>
            <p className="text-sm text-foreground-muted mb-6">
              Your application has been submitted.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => onOpenChange(false)} className="w-full">
                View Application
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
                Explore More Jobs
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>
              {step === 4 ? 'Application Submitted' : `Apply for ${job.title}`}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">{content}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === 4 ? 'Application Submitted' : `Apply for ${job.title}`}
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
