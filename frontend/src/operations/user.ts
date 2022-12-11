import { gql } from '@apollo/client'

gql`
    mutation signup($userInput: SignupInput!) {
        signup(userInput: $userInput)
    }
    
    query login($userInput: LoginInput!) {
        login(userInput: $userInput) {
            _id
            token
        }
    }
    
    query getUserForHome {
        getUser {
            name
        }
    }
`
