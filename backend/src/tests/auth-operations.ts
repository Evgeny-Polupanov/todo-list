import { expect } from 'chai'
import request from 'supertest'
import { app, httpServer } from '../app'
import mongoose from 'mongoose'
import Todo from '../models/todo'
import { ObjectId } from 'bson'
import { config } from 'dotenv'

config()

describe('Auth queries and mutations', () => {
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
                return mongoose.connect(`mongodb://${process.env.MONGO_HOST}:27017/todos-test`)
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

    it('should throw an error when trying to sign up with a taken email', (done) => {
        const signupMutation = `
            mutation {
                signup(userInput: {
                    email: "test@test.com"
                    name: "Test"
                    password: "testtest"
                })
            }
        `
        supertest.post('/graphql')
            .send({ query: signupMutation })
            .expect(200)
            .end((error, result) => {
                if (error) {
                    throw new Error(error)
                }
                expect(JSON.parse(result.text)).to.have.property('errors')
                done()
            })
    })

    it('should return a token on login', () => {
        expect(token).to.exist
    })

    it('should return the current user', (done) => {
        const getUserQuery = `
            {
                getUser {
                    _id
                    email
                    name
                    todos
                }
            }
        `
        supertest.post('/graphql')
            .send({ query: getUserQuery })
            .auth(token, { type: 'bearer' })
            .expect(200)
            .end((error, response) => {
                expect(JSON.parse(response.text).data.getUser).to.exist
                done()
            })
    })

    it('should delete user and therefore his/her respective todos', (done) => {
        const signupMutation = `
            mutation {
                signup(userInput: {
                    email: "deleteTest@test.com"
                    name: "Test"
                    password: "testtest"
                })
            }
        `
        const loginQuery = `
            {
                login(userInput: {
                    email: "deleteTest@test.com"
                    password: "testtest"
                }) {
                    _id
                    token
                }
            }
        `
        const deleteUserMutation = `
            mutation {
                deleteUser
            }
        `
        const postTodoMutation = `
            mutation {
                postTodo(todoInput: { content: "test" }) {
                    _id
                    content
                    creator
                }
            }
        `
        let localToken: string
        let localUserId: string
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
                        localToken = JSON.parse(result.text).data.login.token
                        localUserId = JSON.parse(result.text).data.login._id
                        supertest.post('/graphql')
                            .send({ query: postTodoMutation })
                            .auth(token, { type: 'bearer' })
                            .expect(200)
                            .end((error, response) => {
                                expect(JSON.parse(response.text).data.postTodo._id).to.exist
                                expect(JSON.parse(response.text).data.postTodo.content).to.exist
                                expect(JSON.parse(response.text).data.postTodo.creator).to.be.equal(userId)
                                supertest.post('/graphql')
                                    .auth(localToken, { type: 'bearer' })
                                    .send({ query: deleteUserMutation })
                                    .expect(200)
                                    .end((error, response) => {
                                        if (error) {
                                            throw new Error(error)
                                        }
                                        expect(JSON.parse(response.text).data.deleteUser).to.be.true
                                        return Todo.find({ creator: new ObjectId(localUserId) })
                                            .then((todos) => {
                                                expect(todos).to.exist
                                                expect(todos).to.be.length(0)
                                            })
                                            .catch((error) => console.error(error))
                                            .finally(() => {
                                                done()
                                            })
                                    })
                            })
                    })
            })
    })

    it('should throw an error if the user in not authenticated', (done) => {
        const getTodosQuery = `
            {
                getTodos { _id }
            }
        `
        supertest.post('/graphql')
            .send({ query: getTodosQuery })
            .expect(200)
            .end((error, response) => {
                expect(JSON.parse(response.text)).to.have.property('errors')
                done()
            })
    })
})
