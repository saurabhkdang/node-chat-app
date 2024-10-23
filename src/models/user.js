const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    /* id: {
        type: String,
        required: true,
        trim: true
    }, */
    username: {
        type: String,
        required: true
    },
    connection_id: {
        type: String,
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    }
}, {
    timestamps: true
})

userSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'user'
})

const User = mongoose.model('User', userSchema)

/* const newUser = new User({
    id: 'adfa23rwrwer',
    username: "Saurabh Dang",
    room: "67151e2efed8c149d76b78d2"
})

newUser.save()
.then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error.message)
}) */

module.exports = User