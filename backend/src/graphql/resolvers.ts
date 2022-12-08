import { IResolvers } from '@graphql-tools/utils'
import User from '../models/user'
import Todo from '../models/todo'
import bcrypt from 'bcrypt'
import validator from 'validator'

const resolvers: IResolvers = {
    Query: {
        getTodos: () => {
            return []
        },
    },
    Mutation: {
        signup: async (_, args) => {
            const { email, name, password } = args.userInput
            if (!validator.isEmail(email)) {
                throw 'The email is not valid.'
            }
            if (validator.isEmpty(name)) {
                throw 'The name should not be empty.'
            }
            if (
                !validator.isAlphanumeric(password) ||
                validator.isEmpty(password) ||
                !validator.isLength(password, { min: 6 })
            ) {
                throw 'The password is invalid.'
            }
            const existingUser = await User.findOne({ email })
            if (existingUser) {
                throw 'This email is already taken.'
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({ email, name, password: hashedPassword })
            const savedUser = await user.save()
            return savedUser._id
        },
    }
}

export default resolvers
