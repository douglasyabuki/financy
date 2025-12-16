import { ExpressContextFunctionArgument } from '@as-integrations/express5'
import { verifyJwt } from '../../utils/jwt'

export type GraphqlContext = {
  user: string | undefined
  token: string | undefined
  req: ExpressContextFunctionArgument['req']
  res: ExpressContextFunctionArgument['res']
}

export const buildContext = async ({
  req,
  res,
}: ExpressContextFunctionArgument): Promise<GraphqlContext> => {
  const authHeader = req.headers.authorization
  let user: string | undefined
  let token: string | undefined
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring('Bearer '.length)
    try {
      const payload = verifyJwt(token)
      user = payload.id
    } catch (error) {
      console.error(error)
    }
  }

  return { user, token, req, res }
}
