import { User } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import 'reflect-metadata'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from '../dtos/input/transaction.input'
import { BalanceSummary } from '../dtos/output/balance-summary.dto'
import { CategorySummary } from '../dtos/output/category-summary.dto'
import { CategoryColor, CategoryModel } from '../models/category.model'
import { CategoryService } from '../services/category.service'
import { TransactionService } from '../services/transaction.service'
import { UserService } from '../services/user.service'
import { TransactionResolver } from './transaction.resolver'

vi.mock('../services/transaction.service')
vi.mock('../services/category.service')
vi.mock('../services/user.service')

describe('TransactionResolver', () => {
  let resolver: TransactionResolver
  const transactionServiceMock = mockDeep<TransactionService>()
  const categoryServiceMock = mockDeep<CategoryService>()
  const userServiceMock = mockDeep<UserService>()

  const mockUser = { id: 'user-1', email: 'test@test.com' } as User
  const mockTransaction = {
    id: 'tx-1',
    description: 'Groceries',
    amount: '100.00',
    type: 'EXPENSE',
    date: new Date(),
    userId: 'user-1',
    categoryId: 'cat-1',
  } as any

  beforeEach(() => {
    mockReset(transactionServiceMock)
    mockReset(categoryServiceMock)
    mockReset(userServiceMock)

    vi.mocked(TransactionService).mockImplementation(
      () => transactionServiceMock as any
    )
    vi.mocked(CategoryService).mockImplementation(
      () => categoryServiceMock as any
    )
    vi.mocked(UserService).mockImplementation(() => userServiceMock as any)

    resolver = new TransactionResolver()
  })

  it('should create a transaction', async () => {
    const input: CreateTransactionInput = {
      description: 'Groceries',
      amount: '100.00',
      type: 'EXPENSE',
      date: '2023-01-01',
    }
    const categoryId = 'cat-1'
    transactionServiceMock.createTransaction.mockResolvedValue(mockTransaction)

    const result = await resolver.createTransaction(input, categoryId, mockUser)

    expect(transactionServiceMock.createTransaction).toHaveBeenCalledWith(
      input,
      mockUser.id,
      categoryId,
      'expense'
    )
    expect(result).toEqual(mockTransaction)
  })

  it('should update a transaction', async () => {
    const input: UpdateTransactionInput = { description: 'Updated' }
    const txId = 'tx-1'
    transactionServiceMock.updateTransaction.mockResolvedValue({
      ...mockTransaction,
      description: 'Updated',
    })

    const result = await resolver.updateTransaction(txId, input, mockUser)

    expect(transactionServiceMock.updateTransaction).toHaveBeenCalledWith(
      txId,
      input,
      'expense', // Default if not provided in input, though mutation logic checks input
      mockUser.id
    )
    expect(result.description).toBe('Updated')
  })

  it('should delete a transaction', async () => {
    const txId = 'tx-1'
    transactionServiceMock.deleteTransaction.mockResolvedValue(mockTransaction)

    const result = await resolver.deleteTransaction(txId, mockUser)

    expect(transactionServiceMock.deleteTransaction).toHaveBeenCalledWith(
      txId,
      mockUser.id
    )
    expect(result).toEqual(mockTransaction)
  })

  it('should list transactions', async () => {
    const output = { items: [mockTransaction], totalCount: 1 } as any
    transactionServiceMock.listTransactions.mockResolvedValue(output)

    const result = await resolver.listTransactions(mockUser, 10, 0)

    expect(transactionServiceMock.listTransactions).toHaveBeenCalledWith(
      mockUser.id,
      10,
      0,
      undefined
    )
    expect(result).toEqual(output)
  })

  it('should get balance summary', async () => {
    const summary: BalanceSummary = {
      balance: new Decimal(50),
      monthIncome: new Decimal(100),
      monthExpense: new Decimal(50),
    }
    transactionServiceMock.getBalanceSummary.mockResolvedValue(summary)

    const result = await resolver.balanceSummary(mockUser)

    expect(transactionServiceMock.getBalanceSummary).toHaveBeenCalledWith(
      mockUser.id
    )
    expect(result).toEqual(summary)
  })

  it('should get category summary', async () => {
    const categoryModel: CategoryModel = {
      id: 'cat-1',
      title: 'Food',
      description: 'Food expenses',
      icon: 'Utensils',
      color: CategoryColor.GREEN,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: mockUser.id,
    }

    const summary: CategorySummary[] = [
      {
        category: categoryModel,
        count: 5,
        totalAmount: new Decimal(100),
      },
    ]
    transactionServiceMock.getCategorySummary.mockResolvedValue(summary)

    const result = await resolver.categorySummary(mockUser)

    expect(transactionServiceMock.getCategorySummary).toHaveBeenCalledWith(
      mockUser.id
    )
    expect(result).toEqual(summary)
  })

  it('should resolve user field', async () => {
    userServiceMock.findUser.mockResolvedValue(mockUser as any)

    const result = await resolver.user(mockTransaction)

    expect(userServiceMock.findUser).toHaveBeenCalledWith(
      mockTransaction.userId
    )
    expect(result).toEqual(mockUser)
  })

  it('should resolve category field', async () => {
    const mockCategory = { id: 'cat-1' }
    categoryServiceMock.getCategory.mockResolvedValue(mockCategory as any)

    const result = await resolver.category(mockTransaction)

    expect(categoryServiceMock.getCategory).toHaveBeenCalledWith(
      mockTransaction.categoryId,
      mockTransaction.userId
    )
    expect(result).toEqual(mockCategory)
  })
})
