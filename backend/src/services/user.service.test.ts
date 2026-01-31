import 'reflect-metadata'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { prismaClient } from '../../prisma/prisma'
import { UserService } from './user.service'

// Mock Prisma
vi.mock('../../prisma/prisma', () => ({
  prismaClient: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}))

describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    vi.clearAllMocks()
    userService = new UserService()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  // Basic sanity check test + update test
  describe('updateUser', () => {
    it('should update user with avatarUrl when provided', async () => {
      const userId = 'user-1'
      const updateData = { name: 'New Name' }
      const avatarUrl = 'https://cdn.example.com/avatar.png'

      // Mock findUnique to return existing user
      vi.mocked(prismaClient.user.findUnique).mockResolvedValue({
        id: userId,
        name: 'Old Name',
        email: 'test@example.com',
        avatarUrl: null,
        password: null,
        resetCode: null,
        resetCodeExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Mock update
      vi.mocked(prismaClient.user.update).mockResolvedValue({
        id: userId,
        name: 'New Name',
        email: 'test@example.com',
        avatarUrl: avatarUrl,
        password: null,
        resetCode: null,
        resetCodeExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await userService.updateUser(userId, updateData, avatarUrl)

      expect(prismaClient.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          name: 'New Name',
          avatarUrl: avatarUrl,
        },
      })
    })

    it('should update user without avatarUrl when not provided', async () => {
      const userId = 'user-1'
      const updateData = { name: 'New Name' }

      vi.mocked(prismaClient.user.findUnique).mockResolvedValue({
        id: userId,
        name: 'Old Name',
        email: 'test@example.com',
        avatarUrl: null,
        password: null,
        resetCode: null,
        resetCodeExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await userService.updateUser(userId, updateData)

      expect(prismaClient.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          name: 'New Name',
          avatarUrl: undefined, // Should be undefined or not present depending on implementation, checking undefined based on code
        },
      })
    })

    it('should throw error if user not found', async () => {
      vi.mocked(prismaClient.user.findUnique).mockResolvedValue(null)

      await expect(userService.updateUser('non-existent', {})).rejects.toThrow(
        'User not found'
      )
    })
  })
})
