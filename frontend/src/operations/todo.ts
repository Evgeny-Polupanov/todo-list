import { gql } from '@apollo/client'

gql`
    query getTodos {
        getTodos {
            _id
            content
            isDone
            creator
        }
    }
`
