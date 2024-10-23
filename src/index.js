const http = require('http')
const app = require('./app')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationmessage, generateImageMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const server = http.createServer(app) // express is already doing this behind the scene, but added this for below line, as socketio method needs it
const io = socketio(server)

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', async (options, cb) => {

        const {error, user} = await addUser({ connection_id: socket.id, ...options })
        
        if(error){
            return cb(error)
        }

        const usersInRoom = await getUsersInRoom(user.room._id)

        const room = user.room.name;
        socket.join(room)

        const messageObject = await generateMessage({_id: 0, username:'Admin', room: user.room},`Welcome ${user.username}!`)
        socket.emit('message', messageObject)

        const otherObject = await generateMessage({_id: 0, username:'Admin', room: user.room}, `${user.username} has joined!`)
        socket.broadcast.to(room).emit('message', otherObject)
        io.to(room).emit('roomData', {
            room: room,
            users: usersInRoom
        })
        cb()
    })

    socket.on('sendMessage', async (n, cb) => {

        const user = await getUser(socket.id)
        
        const room = user.room.name
        const filter = new Filter()

        if(filter.isProfane(n)) {
            return cb('Profanity is not allowed!')
        }

        const messageObject = await generateMessage(user, n)
        io.to(room).emit('message', messageObject)
        cb()

    })

    socket.on('disconnect', async () => {
        const user = await removeUser(socket.id)
        
        const room = user.room.name
        if(user) {
            const messageObject = await generateMessage({_id: 0, username:'Admin', room: user.room},`${user.username} has left!`)
            io.to(room).emit('message', messageObject)
            const usersInRoom = await getUsersInRoom(user.room._id)
            io.to(room).emit('roomData', {
                room: room,
                users: usersInRoom
            })
        }

    })

    socket.on('sendLocation', async (coords, cb) => {
        const user = await getUser(socket.id)
        const room = user.room.name
        const messageObject = await generateLocationmessage(user, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        io.to(room).emit('locationMessage', messageObject)
        cb()
    })

    socket.on('sendImage', async (image, cb) => {
        const user = await getUser(socket.id)
        const room = user.room.name
        const messageObject = await generateImageMessage(user, image)
        io.to(room).emit('imageMessage', messageObject)
        cb()
    })
})

server.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}! `)
})