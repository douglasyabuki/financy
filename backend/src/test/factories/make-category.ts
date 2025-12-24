import { faker } from '@faker-js/faker'
import { Category } from '@prisma/client'

export const makeCategory = async (
  overrides: Partial<Category> = {}
): Promise<Category> => {
  return Promise.resolve({
    id: faker.string.uuid(),
    title: faker.commerce.department(),
    description: faker.lorem.sentence(),
    icon: faker.lorem.word(),
    color: faker.color.human(),
    userId: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  })
}
