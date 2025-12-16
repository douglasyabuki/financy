import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

async function bootstrap() {
  const server = new ApolloServer({
    typeDefs: 'type Query { helloWorld: String }',
    resolvers: { Query: { helloWorld: () => 'Hello World!' } },
  })
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  })
  console.log(`🚀 Server ready at: ${url}`)
}

bootstrap()
