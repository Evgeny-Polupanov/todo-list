import 'graphql-import-node'
import * as typeDefs from './graphql/schema.graphql'
import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './graphql/resolvers'
import { GraphQLSchema } from 'graphql'

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
})

export default schema
