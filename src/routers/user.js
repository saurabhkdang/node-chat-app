const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/user', async (req, res) => {
    // const user = new User(req.body)

    let { username, room, connection_id } = req.body

    try {

        username = username.trim().toLowerCase()
        room = room.trim().toLowerCase()

        // Validate the data
        if(!username || !room) {
            return res.status(400).send({
                error: 'Username and room are required'
            })
        }

        const existingUser = await User.find({ username, room })
        
        if(existingUser.length) {
            return res.status(400).send({
                error: 'Username is in use!'
            })
        }

        const user = new User({username, room, connection_id})
        const result = await user.save()
        res.status(201).send({result})
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

module.exports = router