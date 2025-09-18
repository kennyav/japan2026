"use server"

import { z } from "zod"
import { Resend } from "resend"

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  trademark: z.string().optional(),
  message: z.string().optional(),
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContactForm(formData: FormData) {
  try {
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      service: formData.get("service") as string,
      trademark: formData.get("trademark") as string,
      message: formData.get("message") as string,
    }

    // Validate the form data
    const validatedData = contactSchema.parse(data)

    const emailHtml = `
      <h2>New Consultation Request from Trademarktopia Website</h2>
      
      <h3>Client Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${validatedData.firstName} ${validatedData.lastName}</li>
        <li><strong>Email:</strong> ${validatedData.email}</li>
        <li><strong>Phone:</strong> ${validatedData.phone || "Not provided"}</li>
        <li><strong>Company:</strong> ${validatedData.company || "Not provided"}</li>
      </ul>

      <h3>Service Details:</h3>
      <ul>
        <li><strong>Service Requested:</strong> ${validatedData.service}</li>
        <li><strong>Trademark/Brand:</strong> ${validatedData.trademark || "Not provided"}</li>
      </ul>

      <h3>Additional Details:</h3>
      <p>${validatedData.message || "No additional details provided"}</p>

      <hr>
      <p><em>This request was submitted through the Trademarktopia contact form. Please respond within 24 hours as promised on the website.</em></p>
    `

    await resend.emails.send({
      from: "[Trademarktopia] Consultation Request <noreply@resend.dev>",
      to: ["tami@serogerslaw.com"], // Replace with your actual email
      subject: `New Consultation Request from ${validatedData.firstName} ${validatedData.lastName}`,
      html: emailHtml,
      replyTo: validatedData.email,
    })

    return { success: true, message: "Thank you! We'll contact you within 24 hours." }
  } catch (error) {
    console.error("[v0] Contact form submission error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Please check your form data: " + error.errors.map((e) => e.message).join(", "),
      }
    }

    return {
      success: false,
      message: "Sorry, there was an error submitting your request. Please try again or call us directly.",
    }
  }
}
