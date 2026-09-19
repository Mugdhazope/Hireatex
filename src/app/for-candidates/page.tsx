import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function ForCandidatesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="For Candidates"
            description="Everything you need to know about applying for opportunities through HiretaX"
          />

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Apply Through HiretaX</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-foreground">Quick Application</h3>
                  </div>
                  <p className="text-sm text-foreground-muted">
                    Apply in minutes with just your resume and basic information.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-foreground">Direct Connection</h3>
                  </div>
                  <p className="text-sm text-foreground-muted">
                    We connect you directly with hiring companies when you're a match.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-foreground">Industry Focus</h3>
                  </div>
                  <p className="text-sm text-foreground-muted">
                    Specialized opportunities in pharma, healthcare, and life sciences.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-foreground">No Hidden Fees</h3>
                  </div>
                  <p className="text-sm text-foreground-muted">
                    Our service is completely free for candidates.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">How It Works</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-subtle text-primary flex items-center justify-center font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Browse & Apply</h3>
                    <p className="text-sm text-foreground-muted">
                      Explore our job listings and apply to positions that match your skills and experience.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-subtle text-primary flex items-center justify-center font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">We Review</h3>
                    <p className="text-sm text-foreground-muted">
                      Our team reviews your application and matches you with relevant opportunities.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-subtle text-primary flex items-center justify-center font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Get Connected</h3>
                    <p className="text-sm text-foreground-muted">
                      When you're shortlisted, we forward your profile to the hiring company.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-subtle text-primary flex items-center justify-center font-semibold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Interview & Hire</h3>
                    <p className="text-sm text-foreground-muted">
                      The company reaches out directly to schedule interviews and extend offers.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-primary-subtle rounded-lg p-6 text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Ready to Get Started?</h2>
              <p className="text-foreground-muted mb-6">
                Browse open positions and apply today.
              </p>
              <Button size="lg" asChild>
                <Link href="/jobs">Explore Jobs</Link>
              </Button>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
