'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Home, Briefcase, FileText, Users, User, Menu, LogOut } from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/hr', icon: Home },
  { name: 'Jobs', href: '/hr/jobs', icon: Briefcase },
  { name: 'Applications', href: '/hr/applications', icon: FileText },
  { name: 'Candidates', href: '/hr/candidates', icon: Users },
  { name: 'Profile', href: '/hr/profile', icon: User },
]

export function HRSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-border bg-surface">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6">
            <Link href="/hr">
              <span className="text-xl font-semibold text-foreground">
                Hire<span className="text-primary">taX</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary-subtle text-primary'
                      : 'text-foreground-muted hover:bg-background-muted hover:text-foreground'
                  )}
                >
                  <item.icon className={cn('mr-3 h-5 w-5 flex-shrink-0')} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="px-3 mt-auto">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/">
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-surface px-4 sm:gap-x-6 sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center h-16 px-6 border-b border-border">
                <Link href="/hr">
                  <span className="text-xl font-semibold text-foreground">
                    Hire<span className="text-primary">taX</span>
                  </span>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-primary-subtle text-primary'
                          : 'text-foreground-muted hover:bg-background-muted hover:text-foreground'
                      )}
                    >
                      <item.icon className={cn('mr-3 h-5 w-5 flex-shrink-0')} />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              {/* Logout */}
              <div className="p-3 border-t border-border">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/">
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex-1">
          <span className="text-lg font-semibold text-foreground">
            Hire<span className="text-primary">taX</span>
          </span>
        </div>
      </div>
    </>
  )
}
