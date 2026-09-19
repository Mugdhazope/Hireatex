import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <span className="text-lg font-semibold text-foreground">
                Hire<span className="text-primary">taX</span>
              </span>
            </Link>
            <p className="text-sm text-foreground-muted">
              Clinical research talent acquisition for pharma, healthcare, and life sciences.
            </p>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">For Candidates</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/candidate/register" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/for-candidates" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-foreground-muted text-center">
            © {new Date().getFullYear()} HiretaX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
