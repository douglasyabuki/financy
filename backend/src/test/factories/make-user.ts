import { faker } from '@faker-js/faker'
import { User } from '@prisma/client'

export const makeUser = async (
  overrides: Partial<User> = {}
): Promise<User> => {
  return Promise.resolve({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: new Date(),
    updatedAt: new Date(),
    resetCode: null,
    resetCodeExpiry: null,
    ...overrides,
  })
}
