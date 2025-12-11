export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-6 py-16 text-center bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 text-muted-foreground">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
              <p className="leading-relaxed">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Contact us through our website or contact forms</li>
                <li>Request a consultation or quote for our services</li>
                <li>Subscribe to our newsletter or communications</li>
                <li>Interact with our services</li>
              </ul>
              <p className="leading-relaxed mt-4">
                The types of information we may collect include your name, email address, phone number, company name, and any other information you choose to provide.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
              <p className="leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Respond to your inquiries and provide customer service</li>
                <li>Process and manage your trademark service requests</li>
                <li>Send you information about our services and updates</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Information Sharing and Disclosure</h2>
              <p className="leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or respond to legal requests</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>With service providers who assist us in operating our business (under strict confidentiality agreements)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Your Rights</h2>
              <p className="leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Access and receive a copy of your personal information</li>
                <li>Request correction of inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to or restrict processing of your information</li>
                <li>Withdraw consent at any time where we rely on consent</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="leading-relaxed">
                Our website may use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can control cookie preferences through your browser settings.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Third-Party Links</h2>
              <p className="leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Children's Privacy</h2>
              <p className="leading-relaxed">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Changes to This Privacy Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="mt-4 space-y-2">
                <p className="leading-relaxed">
                  <strong className="text-foreground">Email:</strong> tami@serogerslaw.com
                </p>
                <p className="leading-relaxed">
                  <strong className="text-foreground">Phone:</strong> (310) 600-5050
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
