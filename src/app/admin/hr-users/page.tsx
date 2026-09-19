import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { hrUsers } from '@/data/hr-users'
import { Plus } from 'lucide-react'

export default function AdminHRUsersPage() {
  return (
    <>
      <AdminSidebar />
      <div className="lg:pl-64">
        <main className="py-8">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PageHeader
              title="HR Users"
              description="Manage HR team members"
              actions={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add HR User
                </Button>
              }
            />

            <div className="space-y-3">
              {hrUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{user.fullName}</h3>
                          {user.role === 'admin' && (
                            <Badge variant="default">Admin</Badge>
                          )}
                        </div>
                        <p className="text-sm text-foreground-muted mb-1">{user.email}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.active ? 'default' : 'secondary'}>
                            {user.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">
                          {user.active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
