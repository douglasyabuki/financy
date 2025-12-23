import 'reflect-metadata'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import { UpdateUserInput } from '../dtos/input/user.input'
import { UserService } from '../services/user.service'
import { UserResolver } from './user.resolver'

vi.mock('../services/user.service')

describe('UserResolver', () => {
  let resolver: UserResolver
  const userServiceMock = mockDeep<UserService>()

  const mockUser = {
    id: 'user-1',
    email: 'test@test.com',
    name: 'Test User',
  } as any

  beforeEach(() => {
    mockReset(userServiceMock)
    vi.mocked(UserService).mockImplementation(() => userServiceMock as any)
    resolver = new UserResolver()
  })

  it('should get a user', async () => {
    userServiceMock.findUser.mockResolvedValue(mockUser)
    const result = await resolver.getUser('user-1')
    expect(userServiceMock.findUser).toHaveBeenCalledWith('user-1')
    expect(result).toEqual(mockUser)
  })

  it('should update a user', async () => {
    const input: UpdateUserInput = { name: 'Updated Name' }
    userServiceMock.updateUser.mockResolvedValue({
      ...mockUser,
      name: 'Updated Name',
    } as any)

    const result = await resolver.updateUser('user-1', input)

    expect(userServiceMock.updateUser).toHaveBeenCalledWith('user-1', input)
    expect(result.name).toBe('Updated Name')
  })

  it('should update profile', async () => {
    const input: UpdateUserInput = { name: 'Profile Name' }
    userServiceMock.updateUser.mockResolvedValue({
      ...mockUser,
      name: 'Profile Name',
    } as any)

    const result = await resolver.updateProfile(mockUser, input)

    expect(userServiceMock.updateUser).toHaveBeenCalledWith(mockUser.id, input)
    expect(result.user.name).toBe('Profile Name')
  })

  it('should throw error if user not authenticated for updateProfile', async () => {
    const input: UpdateUserInput = { name: 'Profile Name' }
    await expect(resolver.updateProfile(null as any, input)).rejects.toThrow(
      'User not authenticated'
    )
  })
})
