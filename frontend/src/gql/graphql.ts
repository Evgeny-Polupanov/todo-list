/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteTodo: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  postTodo: Todo;
  signup: Scalars['ID'];
  toggleTodo: Todo;
};


export type MutationDeleteTodoArgs = {
  todoId: Scalars['ID'];
};


export type MutationPostTodoArgs = {
  todoInput: TodoInput;
};


export type MutationSignupArgs = {
  userInput: SignupInput;
};


export type MutationToggleTodoArgs = {
  todoId: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  getTodos?: Maybe<Array<Todo>>;
  getUser: User;
  login: UserData;
};


export type QueryLoginArgs = {
  userInput: LoginInput;
};

export type SignupInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type Todo = {
  __typename?: 'Todo';
  _id: Scalars['ID'];
  content: Scalars['String'];
  creator: Scalars['ID'];
  isDone: Scalars['Boolean'];
};

export type TodoInput = {
  content: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  email: Scalars['String'];
  name: Scalars['String'];
  todos?: Maybe<Array<Scalars['ID']>>;
};

export type UserData = {
  __typename?: 'UserData';
  _id: Scalars['ID'];
  token: Scalars['String'];
};

export type SignupMutationVariables = Exact<{
  userInput: SignupInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: string };

export type LoginQueryVariables = Exact<{
  userInput: LoginInput;
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'UserData', _id: string, token: string } };


export const SignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userInput"}}}]}]}}]} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<LoginQuery, LoginQueryVariables>;