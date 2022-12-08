import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    todos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Todo',
        },
    ],
})

export default model('User', userSchema)
