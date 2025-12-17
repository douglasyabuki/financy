import { TransactionType } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { prismaClient } from '../../prisma/prisma'
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from '../dtos/input/transaction.input'

export class TransactionService {
  async createTransaction(
    data: CreateTransactionInput,
    userId: string,
    categoryId: string,
    type: TransactionType
  ) {
    return prismaClient.transaction.create({
      data: {
        title: data.title,
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
      by: ['categoryId'],
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

    return aggregations.map(agg => {
      const category = categories.find(c => c.id === agg.categoryId)
      if (!category) throw new Error(`Category ${agg.categoryId} not found`)
      return {
        category,
        count: agg._count.id,
        totalAmount: agg._sum.amount ?? new Decimal(0),
      }
    })
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

  async listTransactions(userId: string) {
    return prismaClient.transaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: 'desc',
      },
    })
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
        title: data.title,
        description: data.description,
        type,
        amount: data.amount,
        date: data.date,
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
