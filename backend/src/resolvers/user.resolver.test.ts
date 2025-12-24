import { User } from '@prisma/client'
import 'reflect-metadata'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UpdateUserInput } from '../dtos/input/user.input'
import { UserService } from '../services/user.service'
import { makeUser } from '../test/factories/make-user'
import { UserResolver } from './user.resolver'

vi.mock('../services/user.service')

describe('UserResolver', () => {
  let resolver: UserResolver
  const userServiceMock = {
    findUser: vi.fn(),
    updateUser: vi.fn(),
  }

  let mockUser: User

  beforeEach(async () => {
    vi.clearAllMocks()
    mockUser = await makeUser()

    vi.mocked(UserService).mockImplementation(
      () => userServiceMock as unknown as UserService
    )
    resolver = new UserResolver()
  })

  it('should get a user', async () => {
    userServiceMock.findUser.mockResolvedValue(mockUser)
    const result = await resolver.getUser(mockUser.id)
    expect(userServiceMock.findUser).toHaveBeenCalledWith(mockUser.id)
    expect(result).toEqual(mockUser)
  })

  it('should update a user', async () => {
    const input: UpdateUserInput = { name: 'Updated Name' }
    userServiceMock.updateUser.mockResolvedValue({
      ...mockUser,
      name: 'Updated Name',
    })

    const result = await resolver.updateUser(mockUser.id, input)

    expect(userServiceMock.updateUser).toHaveBeenCalledWith(mockUser.id, input)
    expect(result.name).toBe('Updated Name')
  })

  it('should update profile', async () => {
    const input: UpdateUserInput = { name: 'Profile Name' }
    userServiceMock.updateUser.mockResolvedValue({
      ...mockUser,
      name: 'Profile Name',
    })

    const result = await resolver.updateProfile(mockUser, input)

    expect(userServiceMock.updateUser).toHaveBeenCalledWith(mockUser.id, input)
    expect(result.user.name).toBe('Profile Name')
  })

  it('should throw error if user not authenticated for updateProfile', async () => {
    const input: UpdateUserInput = { name: 'Profile Name' }
    await expect(resolver.updateProfile(null, input)).rejects.toThrow(
      'User not authenticated'
    )
  })
})
