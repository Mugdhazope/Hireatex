'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JobMeta } from '@/components/jobs/job-meta'
import { ApplyJobDialog } from '@/components/jobs/apply-job-dialog'
import { jobs } from '@/data/jobs'
import { formatDate } from '@/lib/utils'
import { useState } from 'react'

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = use(params)
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  
  const job = jobs.find(j => j.id === id)
  
  if (!job) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3">
              {job.title}
            </h1>
            <p className="text-xl text-foreground-muted mb-4">{job.company}</p>
            <JobMeta job={job} className="mb-4" />
            <p className="text-sm text-foreground-subtle">
              Posted {formatDate(job.postedDate)}
            </p>
          </div>

          {/* Apply CTA - Desktop */}
          <div className="hidden md:block sticky top-20 z-10 bg-surface/95 backdrop-blur border-y border-border py-4 -mx-4 px-4 mb-8">
            <Button size="lg" onClick={() => setApplyDialogOpen(true)} className="w-full md:w-auto">
              Apply Now
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-8 pb-24 md:pb-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">About the role</h2>
              <p className="text-foreground-muted">{job.about}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">What you'll do</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-primary mt-1.5">•</span>
                    <span className="text-foreground-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">What we're looking for</h2>
              <ul className="space-y-2">
                {job.requirements.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-primary mt-1.5">•</span>
                    <span className="text-foreground-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Qualifications</h2>
              <p className="text-foreground-muted mb-3">{job.qualificationDescription}</p>
              <div className="flex flex-wrap gap-2">
                {job.qualifications.map((qual) => (
                  <Badge key={qual} variant="secondary" className="capitalize">
                    {qual.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill.id} variant="outline">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </section>
          </div>

          {/* Mobile Sticky CTA */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-surface p-4">
            <Button size="lg" onClick={() => setApplyDialogOpen(true)} className="w-full">
              Apply Now
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      
      <ApplyJobDialog 
        job={job} 
        open={applyDialogOpen} 
        onOpenChange={setApplyDialogOpen}
      />
    </div>
  )
}
