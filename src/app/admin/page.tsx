import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { hrUsers } from '@/data/hr-users'
import { candidates } from '@/data/candidates'
import { jobs } from '@/data/jobs'
import { applications } from '@/data/applications'
import { Users, Briefcase, FileText, UserCheck } from 'lucide-react'

export default function AdminDashboard() {
  const activeHR = hrUsers.filter(u => u.active).length
  const totalCandidates = candidates.length
  const activeJobs = jobs.filter(j => j.status === 'active').length
  const totalApplications = applications.length

  return (
    <>
      <AdminSidebar />
      <div className="lg:pl-64">
        <main className="py-8">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-foreground-muted">
                System overview and management
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-foreground-muted">HR Users</CardTitle>
                  <Users className="h-4 w-4 text-foreground-muted" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-foreground">{activeHR}</div>
                  <p className="text-xs text-foreground-subtle mt-1">Active users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-foreground-muted">Candidates</CardTitle>
                  <UserCheck className="h-4 w-4 text-foreground-muted" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-foreground">{totalCandidates}</div>
                  <p className="text-xs text-foreground-subtle mt-1">Registered</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-foreground-muted">Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-foreground-muted" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-foreground">{activeJobs}</div>
                  <p className="text-xs text-foreground-subtle mt-1">Active postings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-foreground-muted">Applications</CardTitle>
                  <FileText className="h-4 w-4 text-foreground-muted" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-foreground">{totalApplications}</div>
                  <p className="text-xs text-foreground-subtle mt-1">Total received</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
