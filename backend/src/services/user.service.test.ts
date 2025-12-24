import { Prisma, User } from '@prisma/client'
import 'reflect-metadata'
import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest'
import { prismaClient } from '../../prisma/prisma'
import { UserService } from './user.service'

// Mock Prisma Client
vi.mock('../../prisma/prisma', () => ({
  prismaClient: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

const prismaMock = prismaClient as unknown as {
  user: {
    findUnique: MockInstance<
      (args: Prisma.UserFindUniqueArgs) => Promise<User | null>
    >
    update: MockInstance<(args: Prisma.UserUpdateArgs) => Promise<User>>
  }
}

describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
    vi.clearAllMocks()
  })

  describe('findUser', () => {
    it('should return user if id exists', async () => {
      const mockUser: User = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        resetCode: null,
        resetCodeExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.user.findUnique.mockResolvedValue(mockUser)

      const result = await userService.findUser('user-1')

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      })
      expect(result).toEqual(mockUser)
    })

    it('should throw error if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)

      await expect(userService.findUser('user-1')).rejects.toThrow(
        'User not found'
      )
    })
  })

  describe('updateUser', () => {
    it('should update user', async () => {
      const mockUser: User = {
        id: 'user-1',
        name: 'Updated Name',
        email: 'test@example.com',
        password: 'hashed-password',
        resetCode: null,
        resetCodeExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.user.findUnique.mockResolvedValue(mockUser)
      prismaMock.user.update.mockResolvedValue(mockUser)

      const result = await userService.updateUser('user-1', {
        name: 'Updated Name',
      })

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { name: 'Updated Name' },
      })
      expect(result).toEqual(mockUser)
    })
  })
})
