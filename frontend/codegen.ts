import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: 'http://localhost:8080/graphql',
    documents: ['src/**/*.ts'],
    generates: {
        './src/gql/': {
            preset: 'client',
            plugins: [],
        },
    },
}

export default config
