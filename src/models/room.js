const mongoose = require('mongoose')
const validator = require('validator')

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

roomSchema.virtual('users', {
    ref: 'User',
    localField: '_id',
    foreignField: 'room'
})

const Room = mongoose.model('Room', roomSchema)

/* const newRoom = new Room({
    room: "React JS"
})

newRoom.save()
.then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error.message)
}) */

module.exports = Room