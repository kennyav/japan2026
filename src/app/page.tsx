import { Navigation } from "~/components/navigation"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import Link from "next/link"
import { Shield, Search, FileText, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm mb-8">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            Protecting Your Brand Since 2010
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Trademark Protection
            <br />
            <span className="text-primary">Made Simple</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            Secure your brand with expert trademark services. From clearance searches to registration and renewal, we
            guide you through every step of protecting your intellectual property.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/contact">Get Free Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">View Our Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Trademarktopia</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We provide comprehensive trademark services with the expertise and personal attention your brand deserves.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 border-border bg-card">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">Comprehensive Searches</h3>
                <p className="text-muted-foreground text-sm">
                  Thorough trademark clearance searches to ensure your mark is available for registration.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-border bg-card">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">Expert Protection</h3>
                <p className="text-muted-foreground text-sm">
                  Professional handling of office actions and trademark disputes to protect your rights.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-border bg-card">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">Renewal Services</h3>
                <p className="text-muted-foreground text-sm">
                  Timely renewal and declaration of use filings to maintain your trademark protection.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-border bg-card">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">Personal Service</h3>
                <p className="text-muted-foreground text-sm">
                  Dedicated support throughout your trademark journey with personalized attention.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-secondary/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Protect Your Brand?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Don't wait until it's too late. Start your trademark protection journey today with a free consultation from
            our experts.
          </p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/contact">Schedule Free Consultation</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-foreground mb-4">Trademarktopia</h3>
              <p className="text-muted-foreground text-sm">
                Your trusted partner in trademark protection and intellectual property services.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/services" className="hover:text-primary transition-colors">
                    Trademark Search
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-primary transition-colors">
                    Office Actions
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-primary transition-colors">
                    Renewals
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Free Consultation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">
                Ready to protect your brand?
                <br />
                <Link href="/contact" className="text-primary hover:underline">
                  Get started today
                </Link>
              </p>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Trademarktopia™ also known as TMTopia™. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
