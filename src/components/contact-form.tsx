"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { MessageSquare, CheckCircle, AlertCircle } from "lucide-react"
import { submitContactForm } from "~/app/actions/contact"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [selectedService, setSelectedService] = useState("")

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    // Add the selected service to form data
    formData.set("service", selectedService)

    const result = await submitContactForm(formData)

    setSubmitStatus({
      type: result.success ? "success" : "error",
      message: result.message,
    })

    setIsSubmitting(false)

    // Reset form on success
    if (result.success) {
      const form = document.getElementById("contact-form") as HTMLFormElement
      form?.reset()
      setSelectedService("")
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-2xl text-card-foreground flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          Request Free Consultation
        </CardTitle>
        <p className="text-muted-foreground">
          Fill out the form below and we'll get back to you within 24 hours to schedule your free consultation.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {submitStatus.type && (
          <div
            className={`p-4 rounded-md flex items-center gap-2 ${
              submitStatus.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {submitStatus.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm">{submitStatus.message}</span>
          </div>
        )}

        <form id="contact-form" action={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-card-foreground">
                First Name *
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                className="border-border bg-background text-foreground"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-card-foreground">
                Last Name *
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                className="border-border bg-background text-foreground"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-card-foreground">
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              className="border-border bg-background text-foreground"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-card-foreground">
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              className="border-border bg-background text-foreground"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-card-foreground">
              Company/Organization
            </Label>
            <Input
              id="company"
              name="company"
              placeholder="Enter your company name"
              className="border-border bg-background text-foreground"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service" className="text-card-foreground">
              Service Needed *
            </Label>
            <Select value={selectedService} onValueChange={setSelectedService} required disabled={isSubmitting}>
              <SelectTrigger className="border-border bg-background text-foreground">
                <SelectValue placeholder="Select the service you need" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clearance-search">Trademark Clearance Search</SelectItem>
                <SelectItem value="office-action">Trademark Office Action Response</SelectItem>
                <SelectItem value="renewal">Post-Registration Renewal & Declaration of Use</SelectItem>
                <SelectItem value="consultation">General Consultation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trademark" className="text-card-foreground">
              Trademark/Brand Name
            </Label>
            <Input
              id="trademark"
              name="trademark"
              placeholder="Enter the trademark or brand name"
              className="border-border bg-background text-foreground"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-card-foreground">
              Additional Details
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us more about your trademark needs, timeline, or any specific questions you have..."
              className="border-border bg-background text-foreground min-h-[120px]"
              rows={5}
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Request Free Consultation"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            By submitting this form, you agree to our privacy policy and consent to be contacted about our services.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
