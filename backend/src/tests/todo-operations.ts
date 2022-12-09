import { expect } from 'chai'
import request from 'supertest'
import { app, httpServer } from '../app'
import mongoose from 'mongoose'

interface Todo {
    _id: string;
    content: string;
    isDone: boolean;
    creator: string;
}

describe('Todos queries and mutations', () => {
    let supertest = request(app)
    let token: string
    let userId: string

    before((done) => {
        const signupMutation = `
            mutation {
                signup(userInput: {
                    email: "test@test.com"
                    name: "Test"
                    password: "testtest"
                })
            }
        `
        const loginQuery = `
            {
                login(userInput: {
                    email: "test@test.com"
                    password: "testtest"
                }) {
                    _id
                    token
                }
            }
        `
        mongoose.disconnect()
            .then(() => {
                return mongoose.connect('mongodb://localhost:27017/todos-test')
            })
            .then(() => {
                supertest.post('/graphql')
                    .send({ query: signupMutation })
                    .expect(200)
                    .end((error) => {
                        if (error) {
                            throw new Error(error)
                        }
                        supertest.post('/graphql')
                            .send({ query: loginQuery })
                            .expect(200)
                            .end((error, result) => {
                                if (error) {
                                    throw new Error(error)
                                }
                                token = JSON.parse(result.text).data.login.token
                                userId = JSON.parse(result.text).data.login._id
                                done()
                            })
                    })
            })
    })

    after((done) => {
        const deleteUserMutation = `
            mutation {
                deleteUser
            }
        `
        supertest.post('/graphql')
            .auth(token, { type: 'bearer' })
            .send({ query: deleteUserMutation })
            .expect(200)
            .end((error) => {
                if (error) {
                    throw new Error(error)
                }
                httpServer.close()
                mongoose.disconnect()
                done()
            })
    })

    it('should return the array of todos', (done) => {
        const getTodosQuery = `
            {
                getTodos { _id }
            }
        `
        supertest.post('/graphql')
            .send({ query: getTodosQuery })
            .auth(token, { type: 'bearer' })
            .expect(200)
            .end((error, response) => {
                expect(JSON.parse(response.text).data.getTodos).to.be.length(0)
                done()
            })
    })

    it('should add a todo and assign it to the respective user', (done) => {
        const postTodoMutation = `
            mutation {
                postTodo(todoInput: { content: "test" }) {
                    _id
                    content
                    creator
                }
            }
        `
        supertest.post('/graphql')
            .send({ query: postTodoMutation })
            .auth(token, { type: 'bearer' })
            .expect(200)
            .end((error, response) => {
                expect(JSON.parse(response.text).data.postTodo._id).to.exist
                expect(JSON.parse(response.text).data.postTodo.content).to.exist
                expect(JSON.parse(response.text).data.postTodo.creator).to.be.equal(userId)
                done()
            })
    })

    it('should throw an error when trying to add a todo content of which is already present in the user\'s todos', (done) => {
        const postTodoMutation = `
            mutation {
                postTodo(todoInput: { content: "test" }) {
                    _id
                    content
                    creator
                }
            }
        `
        supertest.post('/graphql')
            .send({ query: postTodoMutation })
            .auth(token, { type: 'bearer' })
            .expect(200)
            .end((error, response) => {
                expect(JSON.parse(response.text)).to.have.property('errors')
                done()
            })
    })

    it('should toggle a todo', (done) => {
        const postTodoMutation = `
            mutation {
                postTodo(todoInput: { content: "toggleTest" }) {
                    _id
                    content
                    isDone
                    creator
                }
            }
        `
        const getToggleTodoMutation = (todoId: string) => `
            mutation {
                toggleTodo(todoId: "${todoId}") {
                    isDone
                    creator
                }
            }
        `
        supertest.post('/graphql')
            .send({ query: postTodoMutation })
            .auth(token, { type: 'bearer' })
            .expect(200)
            .end((error, response) => {
                const todoId = JSON.parse(response.text).data.postTodo._id
                const isDone = JSON.parse(response.text).data.postTodo.isDone
                const creator = JSON.parse(response.text).data.postTodo.creator
                supertest.post('/graphql')
                    .send({ query: getToggleTodoMutation(todoId) })
                    .auth(token, { type: 'bearer' })
                    .expect(200)
                    .end((error, response) => {
                        expect(JSON.parse(response.text).data.toggleTodo.creator).to.be.equal(creator)
                        expect(JSON.parse(response.text).data.toggleTodo.isDone).to.be.equal(!isDone)
                        done()
                    })
            })
    })

    it('should get the todos made only by the current user', (done) => {
        const getTodosQuery = `
            {
                getTodos { _id creator }
            }
        `
        supertest.post('/graphql')
            .send({ query: getTodosQuery })
            .auth(token, { type: 'bearer' })
            .expect(200)
            .end((error, response) => {
                expect(JSON.parse(response.text).data.getTodos.every((todo: Todo) => todo.creator === userId)).to.be.true
                done()
            })
    })

    it('should delete a todo and remove it from the user\'s todos', (done) => {
        const postTodoMutation = `
            mutation {
                postTodo(todoInput: { content: "deleteTest" }) {
                    _id
                    content
                    isDone
                    creator
                }
            }
        `
        const getDeleteTodoMutation = (todoId: string) => `
            mutation {
                deleteTodo(todoId: "${todoId}")
            }
        `
        const getUserQuery = `
            {
                getUser {
                    todos
                }
            }
        `
        supertest.post('/graphql')
            .send({ query: postTodoMutation })
            .auth(token, { type: 'bearer' })
            .expect(200)
            .end((error, response) => {
                const todoId = JSON.parse(response.text).data.postTodo._id
                supertest.post('/graphql')
                    .send({ query: getDeleteTodoMutation(todoId) })
                    .auth(token, { type: 'bearer' })
                    .expect(200)
                    .end((error, response) => {
                        expect(JSON.parse(response.text).data.deleteTodo).to.be.true
                        supertest.post('/graphql')
                            .send({ query: getUserQuery })
                            .auth(token, { type: 'bearer' })
                            .expect(200)
                            .end((error, response) => {
                                expect(
                                    JSON.parse(response.text)
                                        .data
                                        .getUser
                                        .todos
                                        .some((existingId: string) => existingId === todoId),
                                ).to.be.false
                                done()
                            })
                    })
            })
    })
})
