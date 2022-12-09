import { expect } from 'chai'
import request from 'supertest'
import { app, httpServer } from '../app'
import mongoose from 'mongoose'

describe('Queries', () => {
    let supertest = request(app)
    let token: string

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
            .end((error, result) => {
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
})
