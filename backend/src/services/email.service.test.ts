import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EmailService } from './email.service'

const { sendMock } = vi.hoisted(() => {
  return {
    sendMock: vi.fn().mockResolvedValue({ id: 'email-id' }),
  }
})

// Mock Resend
vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: sendMock,
      },
    })),
  }
})

describe('EmailService', () => {
  let emailService: EmailService

  beforeEach(() => {
    emailService = new EmailService()
    vi.clearAllMocks()
  })

  it('should send forgot password email', async () => {
    await emailService.sendForgotPasswordEmail('test@example.com', '123456')

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@example.com',
        subject: 'Reset Password',
        html: expect.stringContaining('123456'),
      })
    )
  })
})
