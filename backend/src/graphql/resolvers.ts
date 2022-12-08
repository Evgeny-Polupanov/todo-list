import { IResolvers } from '@graphql-tools/utils'
import User from '../models/user'
import Todo from '../models/todo'
import bcrypt from 'bcrypt'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'bson'

const resolvers: IResolvers = {
    Query: {
        login: async (_, args) => {
            const { email, password } = args.userInput

            const error = new Error('Invalid credentials.')

            const user = await User.findOne({ email })
            if (!user) {
                throw error
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                throw error
            }
            const token = jwt.sign({
                id: user._id.toString(),
                email: user.email,
            }, 'secret', { expiresIn: '1h' })
            return { token, _id: user._id }
        },
        getTodos: async (source, args, context) => {
            if (!context.isAuth || !context.userId) {
                throw new Error('Not authenticated')
            }
            return Todo.find({ creator: new ObjectId(context.userId) })
        },
    },
    Mutation: {
        signup: async (_, args) => {
            const { email, name, password } = args.userInput
            if (!validator.isEmail(email)) {
                throw new Error('The email is not valid.')
            }
            if (validator.isEmpty(name)) {
                throw new Error('The name should not be empty.')
            }
            if (
                !validator.isAlphanumeric(password) ||
                validator.isEmpty(password) ||
                !validator.isLength(password, { min: 6 })
            ) {
                throw new Error('The password is invalid.')
            }
            const existingUser = await User.findOne({ email })
            if (existingUser) {
                throw new Error('This email is already taken.')
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({ email, name, password: hashedPassword })
            const savedUser = await user.save()
            return savedUser._id
        },
    }
}

export default resolvers
