/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n    query getTodos {\n        getTodos {\n            _id\n            content\n            isDone\n            creator\n        }\n    }\n    \n    mutation postTodo($todoInput: TodoInput!) {\n        postTodo(todoInput: $todoInput) {\n            _id\n        }\n    }\n    \n    mutation toggleTodo($todoId: ID!) {\n        toggleTodo(todoId: $todoId) {\n            isDone\n        }\n    }\n    \n    mutation deleteTodo($todoId: ID!) {\n        deleteTodo(todoId: $todoId)\n    }\n": types.GetTodosDocument,
    "\n    mutation signup($userInput: SignupInput!) {\n        signup(userInput: $userInput)\n    }\n    \n    query login($userInput: LoginInput!) {\n        login(userInput: $userInput) {\n            _id\n            token\n        }\n    }\n    \n    query getUserForHome {\n        getUser {\n            name\n        }\n    }\n    \n    mutation deleteUser {\n        deleteUser\n    }\n": types.SignupDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getTodos {\n        getTodos {\n            _id\n            content\n            isDone\n            creator\n        }\n    }\n    \n    mutation postTodo($todoInput: TodoInput!) {\n        postTodo(todoInput: $todoInput) {\n            _id\n        }\n    }\n    \n    mutation toggleTodo($todoId: ID!) {\n        toggleTodo(todoId: $todoId) {\n            isDone\n        }\n    }\n    \n    mutation deleteTodo($todoId: ID!) {\n        deleteTodo(todoId: $todoId)\n    }\n"): (typeof documents)["\n    query getTodos {\n        getTodos {\n            _id\n            content\n            isDone\n            creator\n        }\n    }\n    \n    mutation postTodo($todoInput: TodoInput!) {\n        postTodo(todoInput: $todoInput) {\n            _id\n        }\n    }\n    \n    mutation toggleTodo($todoId: ID!) {\n        toggleTodo(todoId: $todoId) {\n            isDone\n        }\n    }\n    \n    mutation deleteTodo($todoId: ID!) {\n        deleteTodo(todoId: $todoId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation signup($userInput: SignupInput!) {\n        signup(userInput: $userInput)\n    }\n    \n    query login($userInput: LoginInput!) {\n        login(userInput: $userInput) {\n            _id\n            token\n        }\n    }\n    \n    query getUserForHome {\n        getUser {\n            name\n        }\n    }\n    \n    mutation deleteUser {\n        deleteUser\n    }\n"): (typeof documents)["\n    mutation signup($userInput: SignupInput!) {\n        signup(userInput: $userInput)\n    }\n    \n    query login($userInput: LoginInput!) {\n        login(userInput: $userInput) {\n            _id\n            token\n        }\n    }\n    \n    query getUserForHome {\n        getUser {\n            name\n        }\n    }\n    \n    mutation deleteUser {\n        deleteUser\n    }\n"];

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function graphql(source: string): unknown;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;