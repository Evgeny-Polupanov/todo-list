import { expect } from 'chai'
import request from 'supertest'
import { app, httpServer } from '../app'
import mongoose from 'mongoose'

describe('Queries', () => {
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
                    .end((error, result) => {
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

    it('should return a token on login', () => {
        expect(token).to.exist
    })

    it('should delete user', (done) => {
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
        let localToken
        let localUserId
        supertest.post('/graphql')
            .send({ query: signupMutation })
            .expect(200)
            .end((error, result) => {
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
                            .auth(localToken, { type: 'bearer' })
                            .send({ query: deleteUserMutation })
                            .expect(200)
                            .end((error, response) => {
                                if (error) {
                                    throw new Error(error)
                                }
                                expect(JSON.parse(response.text).data.deleteUser).to.be.true
                                done()
                            })
                    })
            })
    })
})
