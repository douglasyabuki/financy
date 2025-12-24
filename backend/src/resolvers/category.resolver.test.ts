import { Category, User } from '@prisma/client'
import 'reflect-metadata'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../dtos/input/category.input'
import { CategoryColor, CategoryModel } from '../models/category.model'
import { CategoryService } from '../services/category.service'
import { TransactionService } from '../services/transaction.service'
import { UserService } from '../services/user.service'
import { makeCategory } from '../test/factories/make-category'
import { makeTransaction } from '../test/factories/make-transaction'
import { makeUser } from '../test/factories/make-user'
import { CategoryResolver } from './category.resolver'

vi.mock('../services/category.service')
vi.mock('../services/transaction.service')
vi.mock('../services/user.service')

describe('CategoryResolver', () => {
  let resolver: CategoryResolver

  const categoryServiceMock = {
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
    listCategories: vi.fn(),
    getCategory: vi.fn(),
  }
  const transactionServiceMock = {
    listTransactionsByCategory: vi.fn(),
    countTransactionsByCategory: vi.fn(),
  }
  const userServiceMock = {
    findUser: vi.fn(),
  }

  let mockUser: User
  let mockCategory: Category

  beforeEach(async () => {
    vi.clearAllMocks()

    mockUser = await makeUser()
    mockCategory = await makeCategory({
      userId: mockUser.id,
      color: CategoryColor.RED,
    })

    vi.mocked(CategoryService).mockImplementation(
      () => categoryServiceMock as unknown as CategoryService
    )
    vi.mocked(TransactionService).mockImplementation(
      () => transactionServiceMock as unknown as TransactionService
    )
    vi.mocked(UserService).mockImplementation(
      () => userServiceMock as unknown as UserService
    )

    resolver = new CategoryResolver()
  })

  it('should create a category', async () => {
    const input: CreateCategoryInput = {
      title: 'Test Category',
      description: 'desc',
      icon: 'icon',
      color: CategoryColor.RED,
    }
    categoryServiceMock.createCategory.mockResolvedValue({
      ...mockCategory,
      color: mockCategory.color as CategoryColor,
    })

    const result = await resolver.createCategory(input, mockUser)

    expect(categoryServiceMock.createCategory).toHaveBeenCalledWith(
      input,
      mockUser.id
    )
    expect(result).toEqual(mockCategory)
  })

  it('should update a category', async () => {
    const input: UpdateCategoryInput = { title: 'Updated Category' }
    const categoryId = mockCategory.id
    categoryServiceMock.updateCategory.mockResolvedValue({
      ...mockCategory,
      title: 'Updated Category',
      color: mockCategory.color as CategoryColor,
    })

    const result = await resolver.updateCategory(input, categoryId, mockUser)

    expect(categoryServiceMock.updateCategory).toHaveBeenCalledWith(
      categoryId,
      input,
      mockUser.id
    )
    expect(result.title).toBe('Updated Category')
  })

  it('should delete a category', async () => {
    const categoryId = mockCategory.id
    categoryServiceMock.deleteCategory.mockResolvedValue({
      ...mockCategory,
      color: mockCategory.color as CategoryColor,
    })

    const result = await resolver.deleteCategory(categoryId, mockUser)

    expect(categoryServiceMock.deleteCategory).toHaveBeenCalledWith(
      categoryId,
      mockUser.id
    )
    expect(result).toBe(true)
  })

  it('should list categories', async () => {
    categoryServiceMock.listCategories.mockResolvedValue([
      { ...mockCategory, color: mockCategory.color as CategoryColor },
    ])

    const result = await resolver.listCategories(mockUser)

    expect(categoryServiceMock.listCategories).toHaveBeenCalledWith(mockUser.id)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(mockCategory)
  })

  it('should get a category', async () => {
    const categoryId = mockCategory.id
    categoryServiceMock.getCategory.mockResolvedValue({
      ...mockCategory,
      color: mockCategory.color as CategoryColor,
    })

    const result = await resolver.getCategory(categoryId, mockUser)

    expect(categoryServiceMock.getCategory).toHaveBeenCalledWith(
      categoryId,
      mockUser.id
    )
    expect(result).toEqual(mockCategory)
  })

  it('should resolve user field', async () => {
    userServiceMock.findUser.mockResolvedValue(mockUser)

    const result = await resolver.user(mockCategory as unknown as CategoryModel)
    expect(userServiceMock.findUser).toHaveBeenCalledWith(mockCategory.userId)
    expect(result).toEqual(mockUser)
  })

  it('should resolve transactions field', async () => {
    const mockTransactions = [
      await makeTransaction({
        userId: mockUser.id,
        categoryId: mockCategory.id,
      }),
    ]
    transactionServiceMock.listTransactionsByCategory.mockResolvedValue(
      mockTransactions
    )

    const result = await resolver.transactions(
      mockCategory as unknown as CategoryModel,
      mockUser
    )

    expect(
      transactionServiceMock.listTransactionsByCategory
    ).toHaveBeenCalledWith(mockCategory.id, mockUser.id)
    expect(result).toEqual(mockTransactions)
  })

  it('should resolve transactionCount field', async () => {
    transactionServiceMock.countTransactionsByCategory.mockResolvedValue(5)

    const result = await resolver.transactionCount(
      mockCategory as unknown as CategoryModel,
      mockUser
    )

    expect(
      transactionServiceMock.countTransactionsByCategory
    ).toHaveBeenCalledWith(mockCategory.id, mockUser.id)
    expect(result).toBe(5)
  })
})
