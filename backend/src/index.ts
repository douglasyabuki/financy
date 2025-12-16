import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import express from 'express'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { buildContext } from './graphql/context'
import { AuthResolver } from './resolvers/auth.resolver'
import { UserResolver } from './resolvers/user.resolver'

async function bootstrap() {
  const app = express()

  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver],
    validate: false,
    emitSchemaFile: './schema.graphql',
  })

  const server = new ApolloServer({
    schema,
  })

  await server.start()

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: buildContext,
    })
  )

  app.listen(
    {
      port: 4000,
    },
    () => {
      console.log('🚀 Server initialized on port 4000')
      console.log('Graphql server running at http://localhost:4000/graphql')
    }
  )
}

bootstrap()
