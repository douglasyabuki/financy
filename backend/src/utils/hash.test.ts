import { describe, expect, it } from 'vitest'
import { comparePassword, hashPassword } from './hash'

describe('Hash Utils', () => {
  it('should hash a password correctly', async () => {
    const password = 'mySuperSecretPassword'
    const hash = await hashPassword(password)

    expect(hash).toBeDefined()
    expect(hash).not.toBe(password)
    expect(hash.length).toBeGreaterThan(0)
  })

  it('should verify a correct password', async () => {
    const password = 'mySuperSecretPassword'
    const hash = await hashPassword(password)

    const isValid = await comparePassword(password, hash)
    expect(isValid).toBe(true)
  })

  it('should reject an incorrect password', async () => {
    const password = 'mySuperSecretPassword'
    const hash = await hashPassword(password)

    const isValid = await comparePassword('wrongPassword', hash)
    expect(isValid).toBe(false)
  })
})
