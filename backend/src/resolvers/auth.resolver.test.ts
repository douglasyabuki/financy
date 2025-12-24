import 'reflect-metadata'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ForgotPasswordInput,
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
  ResetPasswordInput,
} from '../dtos/input/auth.input'
import { AuthService } from '../services/auth.service'
import { makeUser } from '../test/factories/make-user'
import { AuthResolver } from './auth.resolver'

vi.mock('../services/auth.service')

describe('AuthResolver', () => {
  let resolver: AuthResolver
  const authServiceMock = {
    login: vi.fn(),
    register: vi.fn(),
    refreshToken: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    resolver = new AuthResolver(authServiceMock as unknown as AuthService)
  })

  it('should call authService.login', async () => {
    const input: LoginInput = {
      email: 'test@example.com',
      password: 'password',
    }
    const output = {
      token: 'token',
      refreshToken: 'refresh-token',
      user: await makeUser({ email: 'test@example.com' }),
    }
    authServiceMock.login.mockResolvedValue(output)

    const result = await resolver.login(input)

    expect(authServiceMock.login).toHaveBeenCalledWith(input)
    expect(result).toEqual(output)
  })

  it('should call authService.register', async () => {
    const input: RegisterInput = {
      email: 'test@example.com',
      password: 'password',
      name: 'Test',
    }
    const output = {
      token: 'token',
      refreshToken: 'refresh-token',
      user: await makeUser({ email: 'test@example.com', name: 'Test' }),
    }
    authServiceMock.register.mockResolvedValue(output)

    const result = await resolver.register(input)

    expect(authServiceMock.register).toHaveBeenCalledWith(input)
    expect(result).toEqual(output)
  })

  it('should call authService.refreshToken', async () => {
    const input: RefreshTokenInput = { refreshToken: 'refresh-token' }
    const output = {
      token: 'new-token',
      refreshToken: 'new-refresh-token',
      user: await makeUser({ email: 'test@example.com' }),
    }
    authServiceMock.refreshToken.mockResolvedValue(output)

    const result = await resolver.refreshToken(input)

    expect(authServiceMock.refreshToken).toHaveBeenCalledWith(
      input.refreshToken
    )
    expect(result).toEqual(output)
  })

  it('should call authService.forgotPassword', async () => {
    const input: ForgotPasswordInput = { email: 'test@example.com' }
    authServiceMock.forgotPassword.mockResolvedValue(true)

    const result = await resolver.forgotPassword(input)

    expect(authServiceMock.forgotPassword).toHaveBeenCalledWith(input.email)
    expect(result).toBe(true)
  })

  it('should call authService.resetPassword', async () => {
    const input: ResetPasswordInput = {
      email: 'test@example.com',
      code: '123456',
      password: 'newpassword',
      confirmPassword: 'newpassword',
    }
    authServiceMock.resetPassword.mockResolvedValue(true)

    const result = await resolver.resetPassword(input)

    expect(authServiceMock.resetPassword).toHaveBeenCalledWith(
      input.email,
      input.code,
      input.password,
      input.confirmPassword
    )
    expect(result).toBe(true)
  })
})
