import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Contact Us"
            description="Have questions? We'd love to hear from you"
          />

          <div className="bg-surface border border-border rounded-lg p-6 md:p-8">
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  rows={6} 
                  placeholder="Tell us more about your inquiry..." 
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto">
                Send Message
              </Button>
            </form>
          </div>

          <div className="mt-8 text-center text-sm text-foreground-muted">
            <p>You can also reach us at <a href="mailto:hello@hiretaex.com" className="text-primary hover:underline">hello@hiretaex.com</a></p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
