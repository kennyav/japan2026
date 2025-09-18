import { Navigation } from "~/components/navigation"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import Link from "next/link"
import { Search, AlertTriangle, RefreshCw, CheckCircle, Clock, Shield } from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="px-6 py-16 text-center bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Comprehensive Trademark Services
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            From initial searches to ongoing protection, we provide complete trademark services to safeguard your brand
            at every stage of its journey.
          </p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/contact">Start Your Protection Today</Link>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Trademark Clearance Search */}
            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-card-foreground">Trademark Clearance Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Before filing your trademark application, ensure your mark is available with our comprehensive
                  clearance search service. We conduct thorough searches across federal, state, and common law
                  databases.
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-card-foreground">What's Included:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Federal trademark database search
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      State trademark registrations
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Common law trademark search
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Domain name availability check
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Detailed written report with recommendations
                    </li>
                  </ul>
                </div>

                <div className="bg-secondary/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-card-foreground">Turnaround Time</span>
                  </div>
                  <p className="text-sm text-muted-foreground">3-5 business days</p>
                </div>

                <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/contact">Request Search</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Trademark Office Actions */}
            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-card-foreground">Trademark Office Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Received an office action from the USPTO? Don't panic. Our experienced attorneys will analyze the
                  issues and craft a strategic response to overcome any objections and move your application forward.
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-card-foreground">Our Response Services:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Substantive refusal responses
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Procedural requirement responses
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Likelihood of confusion arguments
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Descriptiveness and distinctiveness arguments
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Amendment of identification of goods/services
                    </li>
                  </ul>
                </div>

                <div className="bg-secondary/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-card-foreground">Success Rate</span>
                  </div>
                  <p className="text-sm text-muted-foreground">95% of office actions successfully resolved</p>
                </div>

                <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/contact">Get Help Now</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Post-Registration Renewal */}
            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-card-foreground">
                  Post-Registration Renewal & Declaration of Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Maintain your trademark protection with our renewal and declaration of use filing services. We ensure
                  your trademark remains active and enforceable by meeting all USPTO deadlines and requirements.
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-card-foreground">Renewal Services:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Section 8 Declaration of Use (Years 5-6)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Section 9 Renewal Application (Years 9-10)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Combined Section 8 & 9 filings
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Deadline monitoring and reminders
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Specimen preparation and filing
                    </li>
                  </ul>
                </div>

                <div className="bg-secondary/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-card-foreground">Never Miss a Deadline</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Automated tracking and advance notifications</p>
                </div>

                <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/contact">Protect Your Mark</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="px-6 py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">Our Simple Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold text-foreground">Consultation</h3>
              <p className="text-muted-foreground text-sm">
                We discuss your needs and provide expert guidance on the best approach for your trademark protection.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold text-foreground">Action</h3>
              <p className="text-muted-foreground text-sm">
                Our experienced team handles all the paperwork, filings, and communications with the USPTO on your
                behalf.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold text-foreground">Protection</h3>
              <p className="text-muted-foreground text-sm">
                Your trademark is secured and protected, giving you the exclusive rights to use your mark in commerce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Don't let trademark issues derail your business. Contact us today for a free consultation and learn how we
            can protect your brand.
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
            <p>&copy; 2024 Trademarktopia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
