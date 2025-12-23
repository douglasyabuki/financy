import jwt, { Secret, SignOptions } from 'jsonwebtoken'

export type JwtPayload = {
  id: string
  email: string
  iat?: number
  exp?: number
}

export const signJwt = (payload: JwtPayload, expiresIn?: string) => {
  const secret: Secret = process.env.JWT_SECRET as unknown as Secret
  let options: SignOptions
  const expiration = expiresIn
  if (expiresIn) {
    options = {
      expiresIn: expiration as unknown as NonNullable<SignOptions['expiresIn']>,
    }
  }
  return jwt.sign(payload, secret, options)
}

export const verifyJwt = (token: string) => {
  const secret: Secret = process.env.JWT_SECRET as unknown as Secret
  return jwt.verify(token, secret) as JwtPayload
}
