import express from 'express'
import * as mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import compression from 'compression'
import schema from './schema'
import authContext from './contexts/auth'

export const app = express()
const server = new ApolloServer({
    schema,
    context: authContext,
})

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})
app.use(compression())
server.start()
    .then(() => {
        server.applyMiddleware({ app, path: '/graphql' })
    })

export const httpServer = createServer(app)

mongoose.connect('mongodb://mongodb:27017/todos')
    .then(() => {
        httpServer.listen(8080, () => console.log('The server is running!'))
    })
    .catch((error) => console.error(error))
