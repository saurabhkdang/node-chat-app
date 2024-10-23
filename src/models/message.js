const mongoose = require('mongoose')
const validator = require('validator')

require('../db/mongoose')

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    }
}, {
    timestamps: true
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message