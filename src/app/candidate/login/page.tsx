import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { LoginForm } from './login-form'

export default function CandidateLoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-sm text-foreground-muted">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
