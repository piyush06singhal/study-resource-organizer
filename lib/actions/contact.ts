'use client'

import emailjs from '@emailjs/browser'

export async function submitContactForm(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    // Get environment variables
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      console.error('EmailJS configuration missing')
      return { 
        success: false, 
        message: 'Email service is not configured. Please contact support.' 
      }
    }

    // Send email using EmailJS
    const templateParams = {
      name: formData.name,
      email: formData.email,
      title: formData.subject,
      message: formData.message,
    }

    await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    )

    return { 
      success: true, 
      message: 'Thank you for your message! We\'ll get back to you soon.' 
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return { 
      success: false, 
      message: 'Failed to send message. Please try again or contact us directly at piyush.singhal.2004@gmail.com' 
    }
  }
}
