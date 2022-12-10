import { Resolvers } from '../generated/graphql'
import User from '../models/user'
import Todo from '../models/todo'
import bcrypt from 'bcrypt'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'bson'

const resolvers: Resolvers = {
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
            return { token, _id: user._id.toString() }
        },
        getTodos: async (source, args, context) => {
            if (!context.isAuth || !context.userId) {
                throw new Error('Not authenticated.')
            }
            const user = await User.findById(context.userId)
            if (!user) {
                throw new Error('User not found.')
            }
            const todos = await Todo.find({ creator: new ObjectId(context.userId) })
            return todos.map(({ _id, content, isDone, creator }) => ({
                _id: _id.toString(),
                content,
                isDone,
                creator: creator!.toString(),
            }))
        },
        getUser: async (_, args, context) => {
            if (!context.isAuth || !context.userId) {
                throw new Error('Not authenticated.')
            }
            const user = await User.findById(context.userId)
            if (!user) {
                throw new Error('User not found.')
            }
            return {
                _id: user._id.toString(),
                email: user.email,
                name: user.name,
                todos: user.todos.map((todo) => todo.toString()),
            }
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
            return savedUser._id.toString()
        },
        postTodo: async (_, args, context) => {
            if (!context.isAuth || !context.userId) {
                throw new Error('Not authenticated.')
            }
            const { content } = args.todoInput
            const user = await User.findById(context.userId)
            if (!user) {
                throw new Error('User not found.')
            }
            const existingTodo = await Todo.findOne({ creator: new ObjectId(context.userId), content })
            if (existingTodo) {
                throw new Error('This todo is already present in your list.')
            }
            const todo = new Todo({ content, creator: new ObjectId(context.userId) })
            const savedTodo = await todo.save()
            await User.updateOne({ _id: new ObjectId(context.userId) }, { $push: { todos: savedTodo } })
            return {
                _id: savedTodo._id.toString(),
                content: savedTodo.content,
                isDone: savedTodo.isDone,
                creator: user._id.toString(),
            }
        },
        toggleTodo: async (_, args, context) => {
            if (!context.isAuth || !context.userId) {
                throw new Error('Not authenticated.')
            }
            const { todoId } = args
            const user = await User.findById(new ObjectId(context.userId))
            if (!user) {
                throw new Error('User not found.')
            }
            const todoFilter = { _id: new ObjectId(todoId), creator: new ObjectId(context.userId) }
            const todo = await Todo.findOne(todoFilter)
            if (!todo) {
                throw new Error('The todo is not found.')
            }
            await Todo.updateOne(todoFilter, { $set: { isDone: !todo.isDone } })
            return {
                _id: todo._id.toString(),
                content: todo.content,
                isDone: !todo.isDone,
                creator: user._id.toString(),
            }
        },
        deleteTodo: async (_, args, context) => {
            if (!context.isAuth || !context.userId) {
                throw new Error('Not authenticated.')
            }
            const { todoId } = args
            const user = await User.findById(context.userId)
            if (!user) {
                throw new Error('User not found.')
            }
            const todoFilter = { _id: new ObjectId(todoId), creator: new ObjectId(context.userId) }
            const todo = await Todo.findOne(todoFilter)
            if (!todo) {
                throw new Error('The todo is not found.')
            }
            await Todo.deleteOne(todoFilter)
            await User.updateOne(
                { _id: new ObjectId(context.userId) },
                { $pull: { todos: new ObjectId(todoId) } },
            )
            return true
        },
        deleteUser: async (_, args, context) => {
            if (!context.isAuth || !context.userId) {
                throw new Error('Not authenticated.')
            }
            const user = await User.findById(context.userId)
            if (!user) {
                throw new Error('User not found.')
            }
            await Todo.deleteMany({ creator: new ObjectId(context.userId) })
            await User.findByIdAndDelete(context.userId)
            return true
        },
    },
}

export default resolvers
