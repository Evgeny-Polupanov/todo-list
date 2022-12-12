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
    
    mutation postTodo($todoInput: TodoInput!) {
        postTodo(todoInput: $todoInput) {
            _id
        }
    }
    
    mutation toggleTodo($todoId: ID!) {
        toggleTodo(todoId: $todoId) {
            isDone
        }
    }
    
    mutation deleteTodo($todoId: ID!) {
        deleteTodo(todoId: $todoId)
    }
`
