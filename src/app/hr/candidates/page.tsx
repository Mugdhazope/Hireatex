import { HRSidebar } from '@/components/layout/hr-sidebar'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { candidates } from '@/data/candidates'
import { Search } from 'lucide-react'

export default function HRCandidatesPage() {
  return (
    <>
      <HRSidebar />
      <div className="lg:pl-64">
        <main className="py-8">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PageHeader
              title="Candidates"
              description={`${candidates.length} registered candidates`}
            />

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <Input placeholder="Search candidates..." className="pl-10" />
              </div>
            </div>

            <div className="space-y-3">
              {candidates.map((candidate) => (
                <Card key={candidate.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{candidate.fullName}</h3>
                        <p className="text-sm text-foreground-muted mb-2">{candidate.email}</p>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.slice(0, 4).map((skill) => (
                            <span key={skill.id} className="text-xs px-2 py-1 bg-background-muted rounded text-foreground-muted">
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Profile</Button>
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
