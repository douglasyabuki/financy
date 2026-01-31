import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { FileUpload } from 'graphql-upload-ts'
import { randomUUID } from 'node:crypto'
import { basename, extname } from 'node:path'
import { injectable } from 'tsyringe'
import { env } from '../env'

@injectable()
export class StorageService {
  private client: S3Client

  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    })
  }

  async uploadFile(
    file: FileUpload,
    folder: string = 'avatars'
  ): Promise<string> {
    const { filename, mimetype, createReadStream } = file
    const stream = createReadStream()

    const fileExtension = extname(filename)
    const fileNameWithoutExtension = basename(filename, fileExtension)
    const sanitizedFileName = fileNameWithoutExtension.replace(
      /[^a-zA-Z0-9]/g,
      ''
    )
    const uniqueFileName = `${folder}/${randomUUID()}-${sanitizedFileName}${fileExtension}`

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: env.R2_BUCKET_NAME,
        Key: uniqueFileName,
        Body: stream,
        ContentType: mimetype,
      },
    })

    await upload.done()

    if (env.R2_PUBLIC_URL) {
      return `${env.R2_PUBLIC_URL}/${uniqueFileName}`
    }

    return uniqueFileName
  }
}
