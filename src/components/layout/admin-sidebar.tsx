'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/lib/mock-auth'
import {
  Home,
  Users,
  Briefcase,
  FileText,
  Settings,
  Menu,
  LogOut,
  ScrollText,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'HR Users', href: '/admin/hr-users', icon: Users },
  { name: 'Candidates', href: '/admin/candidates', icon: Users },
  { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { name: 'Applications', href: '/admin/applications', icon: FileText },
  { name: 'Audit Log', href: '/admin/audit', icon: ScrollText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex-1 px-3 space-y-1">
      {navigation.map((item) => {
        const isActive =
          item.href === '/admin'
            ? pathname === '/admin'
            : pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
              isActive
                ? 'bg-primary-subtle text-primary'
                : 'text-foreground-muted hover:bg-background-muted hover:text-foreground'
            )}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}

function LogoutButton() {
  const { logout, user } = useAuth()
  const router = useRouter()
  return (
    <div className="px-3 mt-auto space-y-2">
      {user && (
        <p className="px-3 text-xs text-foreground-muted truncate">{user.name}</p>
      )}
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => {
          logout()
          router.push('/admin/login')
        }}
      >
        <LogOut className="mr-3 h-5 w-5" />
        Logout
      </Button>
    </div>
  )
}

export function AdminSidebar() {
  return (
    <>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-border bg-surface">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6">
            <Link href="/admin">
              <span className="text-xl font-semibold text-foreground">
                Hire<span className="text-primary">taX</span>
              </span>
            </Link>
          </div>
          <div className="px-6 mt-4">
            <div className="px-3 py-1 bg-primary-subtle text-primary text-xs font-medium rounded-md inline-block">
              Admin
            </div>
          </div>
          <div className="mt-6 flex flex-col flex-1">
            <NavLinks />
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="lg:hidden sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-surface px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex flex-col h-full py-4">
              <div className="flex items-center gap-2 h-12 px-6 mb-4">
                <Link href="/admin">
                  <span className="text-xl font-semibold text-foreground">
                    Hire<span className="text-primary">taX</span>
                  </span>
                </Link>
                <span className="px-2 py-0.5 bg-primary-subtle text-primary text-xs font-medium rounded">
                  Admin
                </span>
              </div>
              <NavLinks />
              <LogoutButton />
            </div>
          </SheetContent>
        </Sheet>
        <span className="text-lg font-semibold text-foreground">
          Hire<span className="text-primary">taX</span>
        </span>
      </div>
    </>
  )
}
