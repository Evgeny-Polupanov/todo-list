import { gql } from '@apollo/client'

gql`
    mutation signup($userInput: SignupInput!) {
        signup(userInput: $userInput)
    }
`
