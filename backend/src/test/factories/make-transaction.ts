import { faker } from '@faker-js/faker'
import { Transaction, TransactionType } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export const makeTransaction = async (
  overrides: Partial<Transaction> = {}
): Promise<Transaction> => {
  return Promise.resolve({
    id: faker.string.uuid(),
    description: faker.finance.transactionDescription(),
    date: faker.date.recent(),
    type: faker.helpers.enumValue(TransactionType),
    amount: new Decimal(faker.finance.amount()),
    userId: faker.string.uuid(),
    categoryId: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  })
}
