'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Menu,
  Bookmark,
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Settings,
} from 'lucide-react'
import { useAuth } from '@/lib/mock-auth'
import { useCandidateStore } from '@/lib/candidate-store'
import { cn } from '@/lib/utils'

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function Header() {
  const { user, ready, logout } = useAuth()
  const store = useCandidateStore()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const isCandidate = ready && user?.role === 'candidate'
  const candidate =
    isCandidate && user.candidateId
      ? store.getCandidate(user.candidateId)
      : undefined

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    router.push('/')
  }

  const guestLinks = [
    { href: '/jobs', label: 'Jobs' },
    { href: '/about', label: 'About' },
    { href: '/for-candidates', label: 'For Candidates' },
    { href: '/contact', label: 'Contact' },
  ]

  const candidateLinks = [
    { href: '/jobs', label: 'Jobs' },
    { href: '/candidate', label: 'Dashboard' },
    { href: '/candidate/applications', label: 'My Applications' },
    { href: '/candidate/saved', label: 'Saved' },
  ]

  const links = isCandidate ? candidateLinks : guestLinks

  const avatarMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Account menu"
        >
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary-subtle text-xs font-semibold text-primary">
              {initials(candidate?.fullName || user?.name || 'U')}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-0.5">
            <span className="font-medium">{candidate?.fullName || user?.name}</span>
            <span className="truncate text-xs font-normal text-foreground-muted">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/candidate">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/candidate/profile">
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/candidate/applications">
            <FileText className="mr-2 h-4 w-4" />
            My Applications
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/candidate/saved">
            <Bookmark className="mr-2 h-4 w-4" />
            Saved Jobs
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/candidate/profile">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/90">
      <div className="container mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <span className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Hire<span className="text-primary">taX</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-5 lg:ml-8 lg:flex xl:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'whitespace-nowrap text-sm font-medium transition-colors hover:text-foreground',
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? 'text-foreground'
                  : 'text-foreground-muted'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {!ready ? (
            <div className="h-9 w-16 animate-pulse rounded-md bg-background-muted sm:w-20" />
          ) : isCandidate ? (
            <div className="hidden sm:block">{avatarMenu}</div>
          ) : (
            <Button asChild size="sm" className="sm:h-9 sm:px-4 sm:text-sm">
              <Link href="/candidate/login">Sign In</Link>
            </Button>
          )}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[min(100%,20rem)] flex-col">
              <div className="mt-6 flex items-center gap-3 border-b border-border pb-4">
                {isCandidate ? (
                  <>
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarFallback className="bg-primary-subtle text-sm font-semibold text-primary">
                        {initials(candidate?.fullName || user?.name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {candidate?.fullName || user?.name}
                      </p>
                      <p className="truncate text-xs text-foreground-muted">
                        {user?.email}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-foreground-muted">Browse and apply</p>
                )}
              </div>

              <nav className="mt-4 flex flex-1 flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-background-muted',
                      pathname === link.href
                        ? 'bg-primary-subtle text-primary'
                        : 'text-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {isCandidate && (
                  <Link
                    href="/candidate/profile"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-background-muted"
                  >
                    My Profile
                  </Link>
                )}
              </nav>

              <div className="mt-auto space-y-2 border-t border-border pt-4">
                {isCandidate ? (
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    Log Out
                  </Button>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href="/candidate/login" onClick={() => setMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
