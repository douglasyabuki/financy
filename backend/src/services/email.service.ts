import { Resend } from 'resend'
import { env } from '../env'

const resend = new Resend(env.RESEND_API_KEY)

export class EmailService {
  async sendForgotPasswordEmail(email: string, code: string) {
    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset Password',
      html: `<strong>Reset code: ${code}</strong>`,
    })

    if (error) {
      return console.error(error)
    }

    return true
  }
}
