import { ApolloClient, createHttpLink, InMemoryCache, from, DefaultOptions } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

const httpLink = createHttpLink({
    uri: 'http://localhost:8080/graphql',
})

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('jwt-token')
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    }
})

const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
        if (
            graphQLErrors.some((error) => error.extensions?.code === 401)
            && !location.href.endsWith('/login')
        ) {
            location.href = '/login'
        }
    }
})

const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
    },
    query: {
        fetchPolicy: 'no-cache',
    },
    mutate: {
        fetchPolicy: 'no-cache',
    },
}

const client = new ApolloClient({
    link: from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
    defaultOptions,
})

export default client
