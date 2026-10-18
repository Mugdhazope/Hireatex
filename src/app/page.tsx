import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { JobCard } from '@/components/jobs/job-card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { jobs } from '@/data/jobs'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function Home() {
  const featuredJobs = jobs.slice(0, 6)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-background py-16 sm:py-24 md:py-36">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-4 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-primary sm:mb-5 sm:text-xs">
                Pharma · Healthcare · Life Sciences
              </p>
              <h1 className="mb-4 text-[2rem] font-semibold leading-[1.1] tracking-tight text-foreground sm:mb-5 sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                Find your next opportunity
              </h1>
              <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-foreground-muted sm:mb-10 sm:text-base md:text-lg">
                Roles in clinical research, regulatory, and life sciences — apply in minutes.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/jobs">
                    Explore Jobs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href="/for-candidates">For Candidates</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why HiretaX */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
                Why HiretaX
              </h2>
              <p className="text-foreground-muted max-w-2xl mx-auto">
                We specialize in connecting talent with opportunities in clinical research and life sciences.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Specialized Focus</h3>
                </div>
                <p className="text-foreground-muted">
                  We focus exclusively on pharma, healthcare, and life sciences roles.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Trusted Partners</h3>
                </div>
                <p className="text-foreground-muted">
                  Work with leading pharmaceutical and biotech companies.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Simple Process</h3>
                </div>
                <p className="text-foreground-muted">
                  Apply in minutes. Get matched quickly. Start your career.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-foreground-muted max-w-2xl mx-auto">
                Getting started is simple.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary-subtle text-primary flex items-center justify-center text-xl font-semibold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-foreground">Browse Jobs</h3>
                <p className="text-foreground-muted">
                  Explore opportunities that match your skills and interests.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary-subtle text-primary flex items-center justify-center text-xl font-semibold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-foreground">Apply</h3>
                <p className="text-foreground-muted">
                  Submit your application with just your resume and basic info.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary-subtle text-primary flex items-center justify-center text-xl font-semibold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-foreground">Get Hired</h3>
                <p className="text-foreground-muted">
                  We connect you directly with hiring companies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
                  Featured Jobs
                </h2>
                <p className="text-foreground-muted">
                  Explore opportunities from leading companies.
                </p>
              </div>
              <Button variant="outline" asChild className="hidden sm:flex">
                <Link href="/jobs">View All</Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild className="w-full">
                <Link href="/jobs">View All Jobs</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-primary-subtle rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
                Ready to apply?
              </h2>
              <p className="text-foreground-muted mb-8 max-w-2xl mx-auto">
                Start your journey in clinical research and life sciences today.
              </p>
              <Button size="lg" asChild>
                <Link href="/jobs">
                  Explore Opportunities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
