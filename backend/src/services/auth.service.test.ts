import { Prisma, User } from '@prisma/client'
import 'reflect-metadata'
import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest'
import { prismaClient } from '../../prisma/prisma'
import { EmailService } from '../services/email.service'
import { comparePassword, hashPassword } from '../utils/hash'
import { AuthService } from './auth.service'

// Mock Prisma Client
vi.mock('../../prisma/prisma', () => ({
  prismaClient: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}))

const prismaMock = prismaClient as unknown as {
  user: {
    findUnique: MockInstance<
      (args: Prisma.UserFindUniqueArgs) => Promise<User | null>
    >
    create: MockInstance<(args: Prisma.UserCreateArgs) => Promise<User>>
    update: MockInstance<(args: Prisma.UserUpdateArgs) => Promise<User>>
  }
}

// Mock hash utils
vi.mock('../utils/hash', () => ({
  hashPassword: vi.fn(),
  comparePassword: vi.fn(),
}))

vi.mock('../services/email.service')

describe('AuthService', () => {
  let authService: AuthService
  let emailServiceMock: EmailService

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret'
    emailServiceMock = {
      sendForgotPasswordEmail: vi.fn(),
    } as unknown as EmailService
    authService = new AuthService(emailServiceMock)
    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should create a new user and return token + user', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
        resetCode: null,
        resetCodeExpiry: null,
      }

      prismaMock.user.findUnique.mockResolvedValue(null)
      vi.mocked(hashPassword).mockResolvedValue('hashed-password')
      prismaMock.user.create.mockResolvedValue(mockUser as unknown as User)

      // Pass object as expected by the service
      const result = await authService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })

      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
      expect(hashPassword).toHaveBeenCalledWith('password123')
      expect(prismaClient.user.create).toHaveBeenCalled()
      expect(result).toHaveProperty('token')
      expect(result.user).toEqual(mockUser)
    })

    it('should throw error if email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'existing-user',
      } as unknown as User)

      // Pass object as expected by the service
      await expect(
        authService.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('User already exists')
    })
  })

  describe('login', () => {
    it('should return token and user for valid credentials', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
        resetCode: null,
        resetCodeExpiry: null,
      }

      prismaMock.user.findUnique.mockResolvedValue(mockUser as unknown as User)
      vi.mocked(comparePassword).mockResolvedValue(true)
      prismaMock.user.update.mockResolvedValue(mockUser as unknown as User)

      // Pass object as expected by the service
      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
      expect(comparePassword).toHaveBeenCalledWith(
        'password123',
        'hashed-password'
      )
      expect(result).toHaveProperty('token')
      expect(result.user).toEqual(mockUser)
    })

    it('should throw error for invalid email', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)

      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('User not found')
    })

    it('should throw error for invalid password', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
        resetCode: null,
        resetCodeExpiry: null,
      }

      prismaMock.user.findUnique.mockResolvedValue(mockUser as unknown as User)
      vi.mocked(comparePassword).mockResolvedValue(false)

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid password')
    })
  })
})
