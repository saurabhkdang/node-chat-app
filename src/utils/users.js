const User = require('../models/user')
let users = []

const addUser = async ({ connection_id, username, room }) => {
    // clean the data
    try {
        username = username.trim().toLowerCase()
        room = room.trim().toLowerCase()
    
        // Validate the data
        if(!username || !room) {
            return {
                error: 'Username and room are required'
            }
        }
    
        // check for existing user
        const existingUser = await User.find({ username, room })
        //Validate username
        if(existingUser.length) {
            return {
                error: 'Username is in use!'
            }
        }
    
        const u = new User({username, room, connection_id})
        const result = await u.save()
        const savedUser = await User.findById(u._id).populate('room', 'name')
        users.push({username, room, connection_id})
        return {user: savedUser }
    } catch (error) {
        return {
            error: error.message
        }
    }
}

const removeUser = async (connection_id) => {
    const user = await User.findOne({connection_id}).populate('room', 'name')
    await User.findOneAndDelete({connection_id})
    return user
}

const getUser = async (connection_id) => {
    return await User.findOne({connection_id}).populate('room', 'name')
}

const getUsersInRoom = async (room) => {
    users = await User.find({room}).populate('room', 'name')
    return users
}

module.exports = {
    addUser, 
    removeUser, 
    getUser, 
    getUsersInRoom
}