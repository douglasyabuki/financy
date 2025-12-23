import { PrismaClient } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import { prismaClient } from '../../prisma/prisma'
import { CategoryColor } from '../models/category.model'
import { CategoryService } from './category.service'

// Mock Prisma Client
vi.mock('../../prisma/prisma', () => ({
  prismaClient: mockDeep<PrismaClient>(),
}))

const prismaMock = prismaClient as any

describe('CategoryService', () => {
  let categoryService: CategoryService

  beforeEach(() => {
    categoryService = new CategoryService()
    mockReset(prismaMock)
  })

  describe('createCategory', () => {
    it('should create a category', async () => {
      const mockCategory = {
        id: 'cat-1',
        title: 'Food',
        description: 'Food category',
        color: 'red',
        icon: 'utensils',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.category.create.mockResolvedValue(mockCategory)

      const result = await categoryService.createCategory(
        { title: 'Food', color: 'red' as CategoryColor, icon: 'utensils' },
        'user-1'
      )

      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: {
          title: 'Food',
          color: 'red',
          icon: 'utensils',
          userId: 'user-1',
        },
      })
      expect(result).toEqual(mockCategory)
    })
  })

  describe('updateCategory', () => {
    it('should update category if user owns it', async () => {
      const mockCategory = {
        id: 'cat-1',
        title: 'Food',
        description: 'Food category',
        color: 'red',
        icon: 'utensils',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.category.findUnique.mockResolvedValue(mockCategory)
      prismaMock.category.update.mockResolvedValue({
        ...mockCategory,
        title: 'Meals',
      })

      const result = await categoryService.updateCategory(
        'cat-1',
        { title: 'Meals', color: 'blue' as CategoryColor, icon: 'burger' },
        'user-1'
      )

      expect(prismaMock.category.update).toHaveBeenCalled()
      expect(result.title).toBe('Meals')
    })

    it('should throw error if category not found', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null)

      await expect(
        categoryService.updateCategory(
          'cat-1',
          { title: 'Meals' } as any,
          'user-1'
        )
      ).rejects.toThrow('Category not found')
    })

    it('should throw error if user does not own category', async () => {
      const mockCategory = {
        id: 'cat-1',
        userId: 'other-user',
        description: 'desc',
        title: 't',
        color: 'c',
        icon: 'i',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      prismaMock.category.findUnique.mockResolvedValue(mockCategory)

      await expect(
        categoryService.updateCategory(
          'cat-1',
          { title: 'Meals' } as any,
          'user-1'
        )
      ).rejects.toThrow('Unauthorized')
    })
  })

  describe('deleteCategory', () => {
    it('should delete category if user owns it', async () => {
      const mockCategory = {
        id: 'cat-1',
        userId: 'user-1',
        description: 'desc',
        title: 't',
        color: 'c',
        icon: 'i',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      prismaMock.category.findUnique.mockResolvedValue(mockCategory)
      prismaMock.category.delete.mockResolvedValue(mockCategory)

      await categoryService.deleteCategory('cat-1', 'user-1')

      expect(prismaMock.category.delete).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
      })
    })
  })

  describe('listCategories', () => {
    it('should list categories for user', async () => {
      const mockCategories = [
        {
          id: 'cat-1',
          title: 'Food',
          userId: 'user-1',
          description: 'desc',
          color: 'c',
          icon: 'i',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      prismaMock.category.findMany.mockResolvedValue(mockCategories)

      const result = await categoryService.listCategories('user-1')

      expect(prismaMock.category.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      })
      expect(result).toEqual(mockCategories)
    })
  })
})
