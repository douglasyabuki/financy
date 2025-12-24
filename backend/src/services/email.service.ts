import { Resend } from 'resend'
import { env } from '../env'

const resend = new Resend(env.RESEND_API_KEY)

export class EmailService {
  generateEmailTemplate(content: string) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Password</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #4b5563;">
          ${content}
        </body>
      </html>
    `
  }
  async sendForgotPasswordEmail(email: string, code: string) {
    const { error } = await resend.emails.send({
      from: 'financy@resend.dev',
      to: email,
      subject: 'Reset Password',
      html: this.generateEmailTemplate(
        `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;     background-color: #f9fafb;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <!-- Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; overflow: hidden; max-width: 100%;">
                <!-- Header -->
                <tr>
                  <td align="center" style="background-color: #1f6f43; padding: 24px;">
                    <h1 style="color: #ffffff; margin: 0; font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 700;">Financy</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 32px;">
                    <h2 style="margin: 0 0 24px; color: #111827; font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 600;">Reset Your Password</h2>
                    <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.5;">Hello,</p>
                    <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.5;">We received a request to reset the password for your Financy account. Use the code below to complete the process:</p>
                    
                    <div style="background-color: #f3f4f6; border-radius: 6px; padding: 20px; margin: 24px 0; text-align: center;">
                      <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; letter-spacing: 4px; color: #111827;">${code}</span>
                    </div>

                    <p style="margin: 24px 0 8px; color: #4b5563; font-size: 14px;">This code will expire in 15 minutes.</p>
                    <p style="margin: 0; color: #4b5563; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                        
                    <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                      © ${new Date().getFullYear()} Financy. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`
      ),
    })

    if (error) {
      return console.error(error)
    }

    return true
  }
}
