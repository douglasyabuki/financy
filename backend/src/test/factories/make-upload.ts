import { faker } from '@faker-js/faker'
import { FileUpload } from 'graphql-upload-ts'
import { Readable } from 'stream'

export const makeUpload = (overrides: Partial<FileUpload> = {}): FileUpload => {
  return {
    filename: faker.system.fileName(),
    fieldName: 'file',
    mimetype: faker.system.mimeType(),
    encoding: '7bit',
    createReadStream: () => Readable.from(['check']) as any,
    ...overrides,
  } as FileUpload
}
