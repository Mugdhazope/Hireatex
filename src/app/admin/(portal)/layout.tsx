import { RequireAdmin } from '@/components/auth/require-admin'
import { AdminSidebar } from '@/components/layout/admin-sidebar'

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAdmin>
      <AdminSidebar />
      <div className="lg:pl-64 min-h-screen bg-background">{children}</div>
    </RequireAdmin>
  )
}
