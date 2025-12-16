import { User } from '@prisma/client'
import { createParameterDecorator, ResolverData } from 'type-graphql'
import { prismaClient } from '../../../prisma/prisma'
import { GraphqlContext } from '../context'

export const GraphqlUser = () => {
  return createParameterDecorator(
    async ({ context }: ResolverData<GraphqlContext>): Promise<User | null> => {
      if (!context || !context.user) return null

      try {
        const user = await prismaClient.user.findUnique({
          where: {
            id: context.user,
          },
        })
        if (!user) throw new Error('User not found')
        return user
      } catch (error) {
        console.error('Failed to instantiate Graphql user')
      }
    }
  )
}
