'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useRecruitmentStore } from '@/lib/recruitment-store'
import { DEMO_HR_PASSWORD } from '@/data/hr-users'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

export default function AdminHrUsersPage() {
  const store = useRecruitmentStore()
  const [open, setOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState(DEMO_HR_PASSWORD)

  const create = () => {
    const result = store.createHrUser({
      fullName: fullName.trim(),
      email: email.trim(),
      password: password || DEMO_HR_PASSWORD,
      role: 'hr',
    })
    if ('error' in result) {
      toast.error(result.error)
      return
    }
    toast.success('HR user created')
    setOpen(false)
    setFullName('')
    setEmail('')
    setPassword(DEMO_HR_PASSWORD)
  }

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              HR users
            </h1>
            <p className="text-foreground-muted">Create, activate, and review performance</p>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add HR
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-surface overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="border-b border-border bg-background-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Jobs</th>
                <th className="px-4 py-3 font-medium">Reviews</th>
                <th className="px-4 py-3 font-medium">Shortlists</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {store.hrUsers.map((hr) => {
                const m = store.hrMetrics(hr.id)
                return (
                  <tr key={hr.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{hr.fullName}</p>
                      <p className="text-xs text-foreground-muted">{hr.email}</p>
                    </td>
                    <td className="px-4 py-3 capitalize">{hr.role}</td>
                    <td className="px-4 py-3">
                      <Badge variant={hr.active ? 'default' : 'secondary'}>
                        {hr.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{m.jobsCreated}</td>
                    <td className="px-4 py-3">{m.reviewed}</td>
                    <td className="px-4 py-3">{m.shortlisted}</td>
                    <td className="px-4 py-3 text-foreground-muted">
                      {formatDate(hr.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {hr.role !== 'admin' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              store.setHrActive(hr.id, !hr.active)
                              toast.success(
                                hr.active ? 'Deactivated' : 'Activated'
                              )
                            }}
                          >
                            {hr.active ? 'Deactivate' : 'Activate'}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            store.resetHrPassword(hr.id)
                            toast.success(`Password reset to ${DEMO_HR_PASSWORD}`)
                          }}
                        >
                          Reset pw
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-surface">
          <DialogHeader>
            <DialogTitle>Create HR user</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={create} disabled={!fullName.trim() || !email.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
