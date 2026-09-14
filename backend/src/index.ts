import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import cors from 'cors'
import express from 'express'
import { graphqlUploadExpress } from 'graphql-upload-ts'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { buildSchema } from 'type-graphql'
import { env } from './env'
import { buildContext } from './graphql/context'
import { AuthResolver } from './resolvers/auth.resolver'
import { CategoryResolver } from './resolvers/category.resolver'
import { TransactionResolver } from './resolvers/transaction.resolver'
import { UserResolver } from './resolvers/user.resolver'

async function bootstrap() {
  const app = express()

  const allowedOrigins = env.CORS_ORIGINS.split(',')

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true)

        if (env.NODE_ENV === 'development') {
          return callback(null, true)
        }

        if (allowedOrigins.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      credentials: true,
    })
  )

  const schema = await buildSchema({
    resolvers: [
      AuthResolver,
      UserResolver,
      CategoryResolver,
      TransactionResolver,
    ],
    emitSchemaFile: './schema.graphql',
    container: { get: cls => container.resolve(cls) },
  })

  const server = new ApolloServer({
    schema,
    csrfPrevention: false, // Required for graphql-upload-ts
  })

  await server.start()

  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }),
    express.json(),
    expressMiddleware(server, {
      context: buildContext,
    })
  )

  const port = env.PORT

  app.listen(
    {
      port,
    },
    () => {
      console.log(`🚀 Server initialized on port ${port}`)
      console.log(`Graphql server running at http://localhost:${port}/graphql`)
    }
  )
}

bootstrap()
