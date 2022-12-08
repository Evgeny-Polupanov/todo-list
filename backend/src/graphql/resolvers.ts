import { IResolvers } from '@graphql-tools/utils'

const resolvers: IResolvers = {
    Query: {
        helloWorld: (): string => {
            return 'Hello World!!!'
        },
    },
}

export default resolvers
