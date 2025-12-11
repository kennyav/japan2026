import Link from "next/link"
import React from 'react'

export default function footer() {
  return (
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
                  Trademark Filings
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
                    Book Free Consultation
                  </Link>
                </li>
                <li>
                  <Link href="/privacyPolicy" className="hover:text-primary transition-colors">
                    Privacy Policy
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
  )
}
