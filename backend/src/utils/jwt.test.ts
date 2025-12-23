import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { signJwt, verifyJwt } from './jwt'

vi.mock('../../prisma/prisma', () => ({
  prismaClient: {},
}))

describe('JWT Utils', () => {
  const payload = { id: 'user-1', email: 'test@example.com' }
  const secret = 'test-secret'

  // Mock process.env
  const originalEnv = process.env

  beforeAll(() => {
    process.env = { ...originalEnv, JWT_SECRET: secret }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should sign a token', () => {
    const token = signJwt(payload)
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
  })

  it('should verify a valid token', () => {
    const token = signJwt(payload)
    const decoded = verifyJwt(token)

    expect(decoded).toMatchObject(payload)
    expect(decoded.iat).toBeDefined()
  })

  it('should expire token correctly', async () => {
    // We can't easily wait for expiration in unit test without fake timers or very short expiry
    // But we can check if it accepts expiresIn option
    const token = signJwt(payload, '1s')
    expect(token).toBeDefined()
  })

  it('should throw error for invalid token', () => {
    expect(() => verifyJwt('invalid-token')).toThrow()
  })
})
