import { Navigation } from "~/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { ContactForm } from "~/components/contact-form"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="px-6 py-16 text-center bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Get Your Free Consultation
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            Ready to protect your brand? Contact our trademark experts today for a complimentary consultation and learn
            how we can help secure your intellectual property.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-xl text-card-foreground">Get In Touch</CardTitle>
                  <p className="text-muted-foreground">
                    Prefer to speak directly? Reach out to us using any of the methods below.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground mb-1">Phone</h3>
                      <p className="text-muted-foreground">(310) 600-5050</p>
                      <p className="text-sm text-muted-foreground">Mon-Fri, 9:00 AM - 6:00 PM PST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground mb-1">Email</h3>
                      <p className="text-muted-foreground">tami@serogerslaw.com</p>
                      <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
                    </div>
                  </div>

                  {/* <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground mb-1">Office</h3>
                      <p className="text-muted-foreground">
                        123 Legal Plaza, Suite 456
                        <br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div> */}
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-xl text-card-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-card-foreground">Monday - Friday</span>
                      <span className="text-muted-foreground">9:00 AM - 6:00 PM PST</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-card-foreground">Saturday</span>
                      <span className="text-muted-foreground">10:00 AM - 2:00 PM PST</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-card-foreground">Sunday</span>
                      <span className="text-muted-foreground">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Why Choose Us */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-xl text-card-foreground">Why Choose Trademarktopia?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">
                        <strong className="text-card-foreground">15+ years</strong> of trademark law experience
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">
                        <strong className="text-card-foreground">95% success rate</strong> on office action responses
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">
                        <strong className="text-card-foreground">1000+</strong> trademarks successfully registered
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">
                        <strong className="text-card-foreground">Free consultation</strong> for all new clients
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">How long does the trademark process take?</h3>
                <p className="text-muted-foreground text-sm">
                  The trademark registration process typically takes 8-12 months from filing to registration, depending
                  on the complexity of your application and any office actions received.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">What does the free consultation include?</h3>
                <p className="text-muted-foreground text-sm">
                  Our free consultation includes a review of your trademark needs, discussion of the registration
                  process, timeline expectations, and a customized strategy for protecting your brand.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Do you handle international trademarks?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, we can assist with international trademark protection through the Madrid Protocol and direct
                  foreign filing strategies to protect your brand globally.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">What are your fees?</h3>
                <p className="text-muted-foreground text-sm">
                  Our fees vary depending on the service needed. We provide transparent, upfront pricing with no hidden
                  costs. Contact us for a detailed quote based on your specific needs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Can you help with existing trademark issues?</h3>
                <p className="text-muted-foreground text-sm">
                  Absolutely. We handle office action responses, trademark disputes, oppositions, and enforcement
                  matters to protect your existing trademark rights.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">How do I prepare for my consultation?</h3>
                <p className="text-muted-foreground text-sm">
                  Come prepared with your proposed trademark, description of goods/services, and any questions about the
                  process. We'll handle the rest during our consultation.
                </p>
              </div>
            </div>
          </div>
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
                  <a href="/services" className="hover:text-primary transition-colors">
                    Trademark Search
                  </a>
                </li>
                <li>
                  <a href="/services" className="hover:text-primary transition-colors">
                    Office Actions
                  </a>
                </li>
                <li>
                  <a href="/services" className="hover:text-primary transition-colors">
                    Renewals
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-primary transition-colors">
                    Free Consultation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">
                Ready to protect your brand?
                <br />
                <a href="/contact" className="text-primary hover:underline">
                  Get started today
                </a>
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
