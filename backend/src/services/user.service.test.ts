import { PrismaClient, User } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import { prismaClient } from '../../prisma/prisma'
import { UserService } from './user.service'

// Mock Prisma Client
vi.mock('../../prisma/prisma', () => ({
  prismaClient: mockDeep<PrismaClient>(),
}))

const prismaMock = prismaClient as any

describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
    mockReset(prismaMock)
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
