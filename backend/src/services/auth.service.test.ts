import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prismaClient } from '../../prisma/prisma'
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

// Mock hash utils
vi.mock('../utils/hash', () => ({
  hashPassword: vi.fn(),
  comparePassword: vi.fn(),
}))

describe('AuthService', () => {
  let authService: AuthService

  beforeEach(() => {
    authService = new AuthService()
    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should create a new user and return token + user', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
      }

      ;(prismaClient.user.findUnique as any).mockResolvedValue(null)
      ;(hashPassword as any).mockResolvedValue('hashed-password')
      ;(prismaClient.user.create as any).mockResolvedValue(mockUser)

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
      ;(prismaClient.user.findUnique as any).mockResolvedValue({
        id: 'existing-user',
      })

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
        email: 'test@example.com',
        password: 'hashed-password',
      }

      ;(prismaClient.user.findUnique as any).mockResolvedValue(mockUser)
      ;(comparePassword as any).mockResolvedValue(true)
      ;(prismaClient.user.update as any).mockResolvedValue(mockUser)

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
      ;(prismaClient.user.findUnique as any).mockResolvedValue(null)

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
        email: 'test@example.com',
        password: 'hashed-password',
      }

      ;(prismaClient.user.findUnique as any).mockResolvedValue(mockUser)
      ;(comparePassword as any).mockResolvedValue(false)

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid password')
    })
  })
})
