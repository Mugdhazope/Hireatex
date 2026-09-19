import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminSettingsPage() {
  return (
    <>
      <AdminSidebar />
      <div className="lg:pl-64">
        <main className="py-8">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <PageHeader title="Settings" description="Platform configuration" />

            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground-muted">
                  System configuration options will be available here.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  )
}
