import { User } from '@prisma/client'
import crypto from 'node:crypto'
import { inject, singleton } from 'tsyringe'
import { prismaClient } from '../../prisma/prisma'
import { LoginInput, RegisterInput } from '../dtos/input/auth.input'
import { EmailService } from '../services/email.service'
import { comparePassword, hashPassword } from '../utils/hash'
import { signJwt, verifyJwt } from '../utils/jwt'

@singleton()
export class AuthService {
  constructor(@inject(EmailService) private emailService: EmailService) {}

  async login(data: LoginInput) {
    const user = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    })

    if (!user) throw new Error('User not found')

    const isPasswordValid = await comparePassword(data.password, user.password)

    if (!isPasswordValid) throw new Error('Invalid password')

    return this.generateTokens(user)
  }

  async register(data: RegisterInput) {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    })

    if (existingUser) throw new Error('User already exists')

    const hash = await hashPassword(data.password)

    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash,
      },
    })

    return this.generateTokens(user)
  }

  generateTokens(user: User) {
    const token = signJwt(
      {
        id: user.id,
        email: user.email,
      },
      '15m'
    )

    const refreshToken = signJwt(
      {
        id: user.id,
        email: user.email,
      },
      '1d'
    )

    return {
      token,
      refreshToken,
      user,
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = verifyJwt(refreshToken)
      const user = await prismaClient.user.findUnique({
        where: { id: payload.id },
      })

      if (!user) throw new Error('User not found')

      const token = signJwt(
        {
          id: user.id,
          email: user.email,
        },
        '15m'
      )

      return {
        token,
        refreshToken,
        user,
      }
    } catch (e) {
      throw new Error('Invalid refresh token')
    }
  }

  async forgotPassword(email: string) {
    const user = await prismaClient.user.findUnique({
      where: { email },
    })

    if (!user) {
      return true
    }

    const code = crypto.randomInt(100000, 999999).toString()
    const expiry = new Date(Date.now() + 1000 * 60 * 15)

    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        resetCode: code,
        resetCodeExpiry: expiry,
      },
    })

    await this.emailService.sendForgotPasswordEmail(email, code)

    return true
  }

  async resetPassword(
    email: string,
    code: string,
    password: string,
    confirmPassword: string
  ) {
    const user = await prismaClient.user.findUnique({
      where: { email },
    })

    if (
      !user ||
      !user.resetCode ||
      !user.resetCodeExpiry ||
      user.resetCode !== code ||
      user.resetCodeExpiry < new Date() ||
      password !== confirmPassword
    ) {
      throw new Error('Invalid or expired code')
    }

    const hash = await hashPassword(password)

    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        password: hash,
        resetCode: null,
        resetCodeExpiry: null,
      },
    })

    return true
  }
}
