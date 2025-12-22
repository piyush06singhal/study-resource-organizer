'use client'

import emailjs from '@emailjs/browser'

export async function submitContactForm(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    // EmailJS configuration - these are public keys, safe to use on client side
    const serviceId = 'service_1xdy7vg'
    const templateId = 'template_4p4oor6'
    const publicKey = 'DX7ndiXrd375jiXYG'

    // Send email using EmailJS
    const templateParams = {
      name: formData.name,
      email: formData.email,
      title: formData.subject,
      message: formData.message,
    }

    console.log('Sending email with params:', templateParams)

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    )

    console.log('Email sent successfully:', response)

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
