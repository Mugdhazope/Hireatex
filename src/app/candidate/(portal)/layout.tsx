import { RequireCandidate } from '@/components/auth/require-candidate'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function CandidatePortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <RequireCandidate>
        <main className="flex-1">{children}</main>
      </RequireCandidate>
      <Footer />
    </div>
  )
}
