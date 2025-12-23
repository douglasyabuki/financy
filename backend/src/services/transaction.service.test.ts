import { PrismaClient, Transaction, TransactionType } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import { prismaClient } from '../../prisma/prisma'
import { TransactionService } from './transaction.service'

// Mock Prisma Client
vi.mock('../../prisma/prisma', () => ({
  prismaClient: mockDeep<PrismaClient>(),
}))

const prismaMock = prismaClient as any

describe('TransactionService', () => {
  let transactionService: TransactionService

  beforeEach(() => {
    transactionService = new TransactionService()
    mockReset(prismaMock)
  })

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const mockTx: Transaction = {
        id: 'tx-1',
        description: 'Test Tx',
        amount: new Decimal(100),
        type: TransactionType.expense,
        date: new Date(),
        categoryId: 'cat-1',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.transaction.create.mockResolvedValue(mockTx)

      const result = await transactionService.createTransaction(
        {
          description: 'Test Tx',
          amount: '100',
          date: new Date().toISOString(),
          type: 'expense',
        },
        'user-1',
        'cat-1',
        TransactionType.expense
      )

      expect(prismaMock.transaction.create).toHaveBeenCalled()
      expect(result).toEqual(mockTx)
    })
  })

  describe('updateTransaction', () => {
    it('should update transaction if user owns it', async () => {
      const mockTx: Transaction = {
        id: 'tx-1',
        userId: 'user-1',
        description: 'Updated Tx',
        amount: new Decimal(200),
        type: TransactionType.expense,
        date: new Date(),
        categoryId: 'cat-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.transaction.findUnique.mockResolvedValue(mockTx)
      prismaMock.transaction.update.mockResolvedValue(mockTx)

      const result = await transactionService.updateTransaction(
        'tx-1',
        {
          description: 'Updated Tx',
          amount: '200',
          date: new Date().toISOString(),
          categoryId: 'cat-1',
          type: 'expense',
        },
        TransactionType.expense,
        'user-1'
      )

      expect(prismaMock.transaction.update).toHaveBeenCalledWith({
        where: { id: 'tx-1' },
        data: expect.any(Object),
      })
      expect(result).toEqual(mockTx)
    })

    it('should throw error if transaction not found', async () => {
      prismaMock.transaction.findUnique.mockResolvedValue(null)

      await expect(
        transactionService.updateTransaction(
          'tx-1',
          {
            description: 'Desc',
            amount: '10',
            date: new Date().toISOString(),
            categoryId: 'cat-1',
          },
          TransactionType.expense,
          'user-1'
        )
      ).rejects.toThrow('Transaction not found')
    })

    it('should throw error if user does not own transaction', async () => {
      const mockTx: Transaction = {
        id: 'tx-1',
        userId: 'other-user',
        description: 'Tx',
        amount: new Decimal(100),
        type: TransactionType.expense,
        date: new Date(),
        categoryId: 'cat-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      prismaMock.transaction.findUnique.mockResolvedValue(mockTx)

      await expect(
        transactionService.updateTransaction(
          'tx-1',
          {
            description: 'Desc',
            amount: '10',
            date: new Date().toISOString(),
            categoryId: 'cat-1',
          },
          TransactionType.expense,
          'user-1'
        )
      ).rejects.toThrow('Unauthorized')
    })
  })

  describe('deleteTransaction', () => {
    it('should delete transaction if user owns it', async () => {
      const mockTx: Transaction = {
        id: 'tx-1',
        userId: 'user-1',
        description: 'Tx',
        amount: new Decimal(100),
        type: TransactionType.expense,
        date: new Date(),
        categoryId: 'cat-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      prismaMock.transaction.findUnique.mockResolvedValue(mockTx)
      prismaMock.transaction.delete.mockResolvedValue(mockTx)

      await transactionService.deleteTransaction('tx-1', 'user-1')

      expect(prismaMock.transaction.delete).toHaveBeenCalledWith({
        where: { id: 'tx-1' },
      })
    })

    it('should throw error if transaction not found', async () => {
      prismaMock.transaction.findUnique.mockResolvedValue(null)

      await expect(
        transactionService.deleteTransaction('tx-1', 'user-1')
      ).rejects.toThrow('Transaction not found')
    })

    it('should throw error if user does not own transaction (IDOR Check)', async () => {
      const mockTx: Transaction = {
        id: 'tx-1',
        userId: 'other-user',
        description: 'Tx',
        amount: new Decimal(100),
        type: TransactionType.expense,
        date: new Date(),
        categoryId: 'cat-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      prismaMock.transaction.findUnique.mockResolvedValue(mockTx)

      await expect(
        transactionService.deleteTransaction('tx-1', 'user-1')
      ).rejects.toThrow('Unauthorized')
    })
  })

  describe('listTransactions', () => {
    it('should return paginated transactions', async () => {
      const mockTx: Transaction = {
        id: 'tx-1',
        userId: 'user-1',
        description: 'Tx',
        amount: new Decimal(100),
        type: TransactionType.expense,
        date: new Date(),
        categoryId: 'cat-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      prismaMock.transaction.findMany.mockResolvedValue([mockTx])
      prismaMock.transaction.count.mockResolvedValue(1)

      const result = await transactionService.listTransactions('user-1', 10, 0)

      expect(result.items).toEqual([mockTx])
      expect(result.totalCount).toBe(1)
    })

    it('should apply filters correctly', async () => {
      prismaMock.transaction.findMany.mockResolvedValue([])
      prismaMock.transaction.count.mockResolvedValue(0)

      await transactionService.listTransactions('user-1', 10, 0, {
        description: 'test',
        type: 'expense',
      })

      expect(prismaMock.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            description: expect.objectContaining({ contains: 'test' }),
            type: TransactionType.expense,
          }),
        })
      )
    })
  })

  describe('getCategorySummary', () => {
    it('should aggregate data correctly', async () => {
      // Mock groupBy result
      const mockAggregations = [
        {
          categoryId: 'cat-1',
          type: TransactionType.expense,
          _count: { id: 5 },
          _sum: { amount: new Decimal(500) },
        },
      ]
      prismaMock.transaction.groupBy.mockResolvedValue(mockAggregations as any)

      // Mock categories result
      const mockCategories = [
        {
          id: 'cat-1',
          title: 'Food',
          description: 'Desc',
          color: 'red',
          icon: 'utensils',
          userId: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      prismaMock.category.findMany.mockResolvedValue(mockCategories)

      const result = await transactionService.getCategorySummary('user-1')

      expect(result).toHaveLength(1)
      expect(result[0].count).toBe(5)
      expect(result[0].totalAmount.toNumber()).toBe(-500) // Expense is subtracted
      expect(result[0].category.title).toBe('Food')
    })
  })

  describe('getBalanceSummary', () => {
    it('should calculate balance correctly', async () => {
      prismaMock.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { amount: new Decimal(1000) } } as any) // Total Income
        .mockResolvedValueOnce({ _sum: { amount: new Decimal(500) } } as any) // Total Expense
        .mockResolvedValueOnce({ _sum: { amount: new Decimal(200) } } as any) // Month Income
        .mockResolvedValueOnce({ _sum: { amount: new Decimal(100) } } as any) // Month Expense

      const result = await transactionService.getBalanceSummary('user-1')

      expect(result.balance.toNumber()).toBe(500) // 1000 - 500
      expect(result.monthIncome.toNumber()).toBe(200)
      expect(result.monthExpense.toNumber()).toBe(100)
    })
  })
})
