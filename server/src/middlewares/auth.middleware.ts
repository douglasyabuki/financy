import { MiddlewareFn } from 'type-graphql'
import { GraphqlContext } from '../graphql/context'

export const IsAuthenticated: MiddlewareFn<GraphqlContext> = async (
  { context },
  next
) => {
  if (!context.user) throw new Error('Unauthenticated')
  return next()
}
