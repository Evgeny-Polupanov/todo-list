import express, { Express } from 'express'
import * as mongoose from 'mongoose'
import bodyParser from 'body-parser'

const app: Express = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/todos')
    .then(() => {
        app.listen(8080, () => console.log('The server is running!'))
    })
    .catch((error) => console.error(error))
