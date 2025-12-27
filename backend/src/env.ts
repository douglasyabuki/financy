import { config } from 'dotenv'
import { z } from 'zod'

config()

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z
    .string()
    .refine(url => url.startsWith('postgresql://') || url.startsWith('file:'), {
      message: 'DATABASE_URL must start with postgresql:// or file: for SQLite',
    }),
  JWT_SECRET: z.string(),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  RESEND_API_KEY: z.string().default('re_1234'),
  R2_ACCOUNT_ID: z.string().default('dummy'),
  R2_ACCESS_KEY_ID: z.string().default('dummy'),
  R2_SECRET_ACCESS_KEY: z.string().default('dummy'),
  R2_BUCKET_NAME: z.string().default('dummy'),
  R2_PUBLIC_URL: z.string().default(''),
})

export const env = envSchema.parse(process.env)
