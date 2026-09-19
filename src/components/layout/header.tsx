'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface backdrop-blur supports-[backdrop-filter]:bg-surface/95">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold text-foreground">
            Hire<span className="text-primary">taX</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link 
            href="/jobs" 
            className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
          >
            Jobs
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link 
            href="/for-candidates" 
            className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
          >
            For Candidates
          </Link>
          <Link 
            href="/contact" 
            className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center space-x-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/candidate/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/jobs">Explore Jobs</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col space-y-4 mt-8">
              <Link 
                href="/jobs" 
                className="text-base font-medium text-foreground transition-colors hover:text-primary"
              >
                Jobs
              </Link>
              <Link 
                href="/about" 
                className="text-base font-medium text-foreground transition-colors hover:text-primary"
              >
                About
              </Link>
              <Link 
                href="/for-candidates" 
                className="text-base font-medium text-foreground transition-colors hover:text-primary"
              >
                For Candidates
              </Link>
              <Link 
                href="/contact" 
                className="text-base font-medium text-foreground transition-colors hover:text-primary"
              >
                Contact
              </Link>
              <div className="pt-4 space-y-2 border-t border-border">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/candidate/login">Sign In</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/jobs">Explore Jobs</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
