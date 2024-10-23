const express = require('express')
// const auth = require('../middleware/auth')
const Room = require('../models/room')
const router = new express.Router()

router.get('/rooms', async (req, res) => {
   
    try {
        // Approach One
        const rooms = await Room.find()
        res.send(rooms)
        
        // Approach Two

        /* const match = {}
        const sort = {} */

        /* if(req.query.completed) {
            match.completed = req.query.completed === 'true'
        } */

        /* if(req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1]
        } */

        /* await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                // skip: parseInt(req.query.skip)*parseInt(req.query.limit)
                skip: parseInt(req.query.skip),
                sort
            }
        })  //to get the relationship triggered
        res.send(req.user.tasks)*/
    } catch (error) {
        res.status(500).send(error.message)
    }

})

module.exports = router