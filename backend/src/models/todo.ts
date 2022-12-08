import { Schema, model } from 'mongoose'

const todoSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    isDone: {
        type: Boolean,
        default: false,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
})

export default model('Todo', todoSchema)
