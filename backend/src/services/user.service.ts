import { singleton } from 'tsyringe'
import { prismaClient } from '../../prisma/prisma'
import { UpdateUserInput } from '../dtos/input/user.input'

@singleton()
export class UserService {
  async findUser(id: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    })
    if (!user) throw new Error('User not found')
    return user
  }

  async listUsers() {
    return prismaClient.user.findMany()
  }

  async updateUser(
    id: string,
    data: UpdateUserInput,
    avatarUrl?: string | null
  ) {
    const user = await prismaClient.user.findUnique({
      where: { id },
    })
    if (!user) throw new Error('User not found')

    return prismaClient.user.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        avatarUrl: avatarUrl,
      },
    })
  }
}
