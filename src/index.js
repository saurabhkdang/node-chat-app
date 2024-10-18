const path = require('path')
const http = require('http')
const express =require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationmessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app) // express is already doing this behind the scene, but added this for below line, as socketio method needs it
const io = socketio(server)

const PORT = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options, cb) => {

        const {error, user} = addUser({ id: socket.id, ...options })
        if(error){
            return cb(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin',`Welcome ${user.username}!`))
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        cb()
    })

    socket.on('sendMessage', (n, cb) => {

        const user = getUser(socket.id)
        const filter = new Filter()

        if(filter.isProfane(n)) {
            return cb('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, n))
        cb()

    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })

    socket.on('sendLocation', (coords, cb) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationmessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        cb()
    })
})

server.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}! `)
})