import { TransactionType } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { prismaClient } from '../../prisma/prisma'
import {
  CreateTransactionInput,
  GetTransactionsFilterInput,
  UpdateTransactionInput,
} from '../dtos/input/transaction.input'
import { CategoryColor } from '../models/category.model'

export class TransactionService {
  async createTransaction(
    data: CreateTransactionInput,
    userId: string,
    categoryId: string,
    type: TransactionType
  ) {
    return prismaClient.transaction.create({
      data: {
        description: data.description,
        type,
        amount: data.amount,
        date: data.date,
        categoryId,
        userId,
      },
    })
  }

  async deleteTransaction(id: string) {
    const transaction = await prismaClient.transaction.findUnique({
      where: {
        id,
      },
    })
    if (!transaction) throw new Error('Transaction not found')
    return prismaClient.transaction.delete({
      where: {
        id,
      },
    })
  }

  async getCategorySummary(userId: string) {
    const aggregations = await prismaClient.transaction.groupBy({
      by: ['categoryId', 'type'],
      where: {
        userId,
      },
      _count: {
        id: true,
      },
      _sum: {
        amount: true,
      },
    })

    const categories = await prismaClient.category.findMany({
      where: {
        id: {
          in: aggregations.map(a => a.categoryId),
        },
      },
    })

    const categoryMap = new Map<
      string,
      { title: string; count: number; netAmount: Decimal; category: any }
    >()

    for (const agg of aggregations) {
      if (!categoryMap.has(agg.categoryId)) {
        const category = categories.find(c => c.id === agg.categoryId)
        if (!category) continue

        categoryMap.set(agg.categoryId, {
          title: category.title,
          category,
          count: 0,
          netAmount: new Decimal(0),
        })
      }

      const entry = categoryMap.get(agg.categoryId)!
      entry.count += agg._count.id

      const amount = agg._sum.amount ?? new Decimal(0)
      if (agg.type === TransactionType.income) {
        entry.netAmount = entry.netAmount.plus(amount)
      } else {
        entry.netAmount = entry.netAmount.minus(amount)
      }
    }

    return Array.from(categoryMap.values()).map(entry => ({
      category: {
        ...entry.category,
        color: entry.category.color as CategoryColor,
      },
      count: entry.count,
      totalAmount: entry.netAmount,
    }))
  }

  async getBalanceSummary(userId: string) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const totalIncome = await prismaClient.transaction.aggregate({
      where: {
        userId,
        type: TransactionType.income,
      },
      _sum: {
        amount: true,
      },
    })

    const totalExpense = await prismaClient.transaction.aggregate({
      where: {
        userId,
        type: TransactionType.expense,
      },
      _sum: {
        amount: true,
      },
    })

    const monthIncome = await prismaClient.transaction.aggregate({
      where: {
        userId,
        type: TransactionType.income,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    })

    const monthExpense = await prismaClient.transaction.aggregate({
      where: {
        userId,
        type: TransactionType.expense,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    })

    const income = totalIncome._sum.amount ?? new Decimal(0)
    const expense = totalExpense._sum.amount ?? new Decimal(0)

    return {
      balance: income.minus(expense),
      monthIncome: monthIncome._sum.amount ?? new Decimal(0),
      monthExpense: monthExpense._sum.amount ?? new Decimal(0),
    }
  }

  async listTransactions(
    userId: string,
    limit: number,
    offset: number,
    filters?: GetTransactionsFilterInput
  ) {
    const where: any = {
      userId,
    }

    if (filters) {
      if (filters.type) {
        where.type = filters.type.toLowerCase() as TransactionType
      }
      if (filters.categoryId && filters.categoryId !== 'all') {
        where.categoryId = filters.categoryId
      }
      if (filters.description) {
        where.description = {
          contains: filters.description,
          mode: 'insensitive',
        }
      }
      if (filters.month && filters.year) {
        const startOfMonth = new Date(filters.year, filters.month, 1)
        const endOfMonth = new Date(filters.year, filters.month + 1, 0)
        where.date = {
          gte: startOfMonth,
          lte: endOfMonth,
        }
      }

      if (filters.startDate && filters.endDate) {
        where.date = {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate),
        }
      }
    }

    const [items, totalCount] = await Promise.all([
      prismaClient.transaction.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: {
          date: 'desc',
        },
      }),
      prismaClient.transaction.count({
        where,
      }),
    ])

    return {
      items,
      totalCount,
    }
  }

  async updateTransaction(
    id: string,
    data: UpdateTransactionInput,
    type: TransactionType
  ) {
    const transaction = await prismaClient.transaction.findUnique({
      where: {
        id,
      },
    })
    if (!transaction) throw new Error('Transaction not found')
    return prismaClient.transaction.update({
      where: {
        id,
      },
      data: {
        description: data.description,
        type,
        amount: data.amount,
        date: data.date,
        categoryId: data.categoryId,
      },
    })
  }

  async countTransactionsByCategory(categoryId: string, userId: string) {
    return prismaClient.transaction.count({
      where: {
        categoryId,
        userId,
      },
    })
  }

  async listTransactionsByCategory(categoryId: string, userId: string) {
    return prismaClient.transaction.findMany({
      where: {
        categoryId,
        userId,
      },
    })
  }
}
