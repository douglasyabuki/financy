import { User } from '@prisma/client'
import 'reflect-metadata'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../dtos/input/category.input'
import { CategoryColor } from '../models/category.model'
import { CategoryService } from '../services/category.service'
import { TransactionService } from '../services/transaction.service'
import { UserService } from '../services/user.service'
import { CategoryResolver } from './category.resolver'

vi.mock('../services/category.service')
vi.mock('../services/transaction.service')
vi.mock('../services/user.service')

describe('CategoryResolver', () => {
  let resolver: CategoryResolver
  const categoryServiceMock = mockDeep<CategoryService>()
  const transactionServiceMock = mockDeep<TransactionService>()
  const userServiceMock = mockDeep<UserService>()

  const mockUser = { id: 'user-1', email: 'test@test.com' } as User
  const mockCategory = {
    id: 'cat-1',
    title: 'Test Category',
    userId: 'user-1',
    description: 'desc',
    icon: 'icon',
    color: 'red',
  } as any

  beforeEach(() => {
    mockReset(categoryServiceMock)
    mockReset(transactionServiceMock)
    mockReset(userServiceMock)

    vi.mocked(CategoryService).mockImplementation(
      () => categoryServiceMock as any
    )
    vi.mocked(TransactionService).mockImplementation(
      () => transactionServiceMock as any
    )
    vi.mocked(UserService).mockImplementation(() => userServiceMock as any)

    resolver = new CategoryResolver()
  })

  it('should create a category', async () => {
    const input: CreateCategoryInput = {
      title: 'Test Category',
      description: 'desc',
      icon: 'icon',
      color: CategoryColor.RED,
    }
    categoryServiceMock.createCategory.mockResolvedValue(mockCategory)

    const result = await resolver.createCategory(input, mockUser)

    expect(categoryServiceMock.createCategory).toHaveBeenCalledWith(
      input,
      mockUser.id
    )
    expect(result).toEqual(mockCategory)
  })

  it('should update a category', async () => {
    const input: UpdateCategoryInput = { title: 'Updated Category' }
    const categoryId = 'cat-1'
    categoryServiceMock.updateCategory.mockResolvedValue({
      ...mockCategory,
      title: 'Updated Category',
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
    const categoryId = 'cat-1'
    categoryServiceMock.deleteCategory.mockResolvedValue(mockCategory)

    const result = await resolver.deleteCategory(categoryId, mockUser)

    expect(categoryServiceMock.deleteCategory).toHaveBeenCalledWith(
      categoryId,
      mockUser.id
    )
    expect(result).toBe(true)
  })

  it('should list categories', async () => {
    categoryServiceMock.listCategories.mockResolvedValue([mockCategory])

    const result = await resolver.listCategories(mockUser)

    expect(categoryServiceMock.listCategories).toHaveBeenCalledWith(mockUser.id)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(mockCategory)
  })

  it('should get a category', async () => {
    const categoryId = 'cat-1'
    categoryServiceMock.getCategory.mockResolvedValue(mockCategory)

    const result = await resolver.getCategory(categoryId, mockUser)

    expect(categoryServiceMock.getCategory).toHaveBeenCalledWith(
      categoryId,
      mockUser.id
    )
    expect(result).toEqual(mockCategory)
  })

  it('should resolve user field', async () => {
    userServiceMock.findUser.mockResolvedValue(mockUser as any)

    const result = await resolver.user(mockCategory)

    expect(userServiceMock.findUser).toHaveBeenCalledWith(mockCategory.userId)
    expect(result).toEqual(mockUser)
  })

  it('should resolve transactions field', async () => {
    const mockTransactions: any[] = [{ id: 'tx-1' }]
    transactionServiceMock.listTransactionsByCategory.mockResolvedValue(
      mockTransactions
    )

    const result = await resolver.transactions(mockCategory, mockUser)

    expect(
      transactionServiceMock.listTransactionsByCategory
    ).toHaveBeenCalledWith(mockCategory.id, mockUser.id)
    expect(result).toEqual(mockTransactions)
  })

  it('should resolve transactionCount field', async () => {
    transactionServiceMock.countTransactionsByCategory.mockResolvedValue(5)

    const result = await resolver.transactionCount(mockCategory, mockUser)

    expect(
      transactionServiceMock.countTransactionsByCategory
    ).toHaveBeenCalledWith(mockCategory.id, mockUser.id)
    expect(result).toBe(5)
  })
})
