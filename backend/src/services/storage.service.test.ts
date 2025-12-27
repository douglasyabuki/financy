import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { FileUpload } from 'graphql-upload-ts'
import 'reflect-metadata'
import { Stream } from 'stream'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StorageService } from './storage.service'

// Mock dependencies
vi.mock('@aws-sdk/client-s3')
vi.mock('@aws-sdk/lib-storage')
vi.mock('../env', () => ({
  env: {
    R2_ACCOUNT_ID: 'test-account',
    R2_ACCESS_KEY_ID: 'test-key',
    R2_SECRET_ACCESS_KEY: 'test-secret',
    R2_BUCKET_NAME: 'test-bucket',
    R2_PUBLIC_URL: 'https://cdn.example.com',
  },
}))
vi.mock('node:crypto', () => ({
  randomUUID: () => '1234-5678',
}))

describe('StorageService', () => {
  let sut: StorageService
  const uploadDoneMock = vi.fn()

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Mock Upload implementation
    vi.mocked(Upload).mockImplementation(() => {
      return {
        done: uploadDoneMock.mockResolvedValue({}),
        on: vi.fn(),
      } as any
    })

    sut = new StorageService()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should instantiate S3Client with correct config', () => {
    expect(S3Client).toHaveBeenCalledWith({
      region: 'auto',
      endpoint: 'https://test-account.r2.cloudflarestorage.com',
      credentials: {
        accessKeyId: 'test-key',
        secretAccessKey: 'test-secret',
      },
    })
  })

  it('should upload a file and return the public URL', async () => {
    const fileMock: FileUpload = {
      filename: 'my-avatar.png',
      mimetype: 'image/png',
      encoding: '7bit',
      createReadStream: () => new Stream() as any,
    } as any

    const result = await sut.uploadFile(fileMock)

    // Verify Upload was created with correct params
    expect(Upload).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          Bucket: 'test-bucket',
          ContentType: 'image/png',
          // Key should contain folder and sanitized filename
        }),
      })
    )

    // Check if the filename in the key is correct (folder/uuid-sanitized.ext)
    const uploadCallArgs = vi.mocked(Upload).mock.calls[0][0]
    expect(uploadCallArgs.params.Key).toBe('avatars/1234-5678-myavatar.png')

    // Verify upload.done() was called
    expect(uploadDoneMock).toHaveBeenCalled()

    // Verify returned URL matches R2_PUBLIC_URL + Key
    expect(result).toBe(
      'https://cdn.example.com/avatars/1234-5678-myavatar.png'
    )
  })

  it('should sanitize filenames correctly', async () => {
    const fileMock: FileUpload = {
      filename: 'bad @#$ file name.jpg',
      mimetype: 'image/jpeg',
      encoding: '7bit',
      createReadStream: () => new Stream() as any,
    } as any

    await sut.uploadFile(fileMock)

    const uploadCallArgs = vi.mocked(Upload).mock.calls[0][0]
    expect(uploadCallArgs.params.Key).toBe('avatars/1234-5678-badfilename.jpg')
  })
})
