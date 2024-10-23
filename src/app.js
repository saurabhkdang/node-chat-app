const express =require('express')
const path = require('path')
require('./db/mongoose')
const roomRouter = require('./routers/room')
const userRouter = require('./routers/user')

const app = express()

const publicDirPath = path.join(__dirname, '../public')
app.use(express.static(publicDirPath))

app.use(express.json())

app.use(roomRouter)
app.use(userRouter)

module.exports = app