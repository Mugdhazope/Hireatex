import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/common/page-header'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="About HiretaX"
            description="We connect exceptional talent with leading pharmaceutical and healthcare companies"
          />

          <div className="prose prose-slate max-w-none space-y-6 text-foreground-muted">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
              <p>
                HiretaX is a specialized clinical research talent acquisition organization dedicated to connecting 
                skilled professionals with opportunities in pharma, healthcare, and life sciences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">What We Do</h2>
              <p>
                We work closely with leading pharmaceutical and biotech companies to identify their hiring needs 
                and match them with qualified candidates. Our focus is exclusively on clinical research and 
                related fields, allowing us to provide specialized expertise and deep industry knowledge.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Choose HiretaX</h2>
              <p>
                Unlike general recruitment platforms, HiretaX specializes solely in clinical research talent. 
                We understand the unique requirements of the pharmaceutical and healthcare industries, and we're 
                committed to making the application process as simple and efficient as possible for candidates.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
