import { RequireHr } from '@/components/auth/require-hr'
import { HRSidebar } from '@/components/layout/hr-sidebar'

export default function HRPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireHr>
      <HRSidebar />
      <div className="lg:pl-64 min-h-screen bg-background">{children}</div>
    </RequireHr>
  )
}
