const Message = require('../models/message')

const generateMessage = async (user, text) => {
    const {_id, username, room } = user
    
    if(_id!=0) {
        const message = new Message({user: _id, room, type: 'text', message: text})
        await message.save()
    }

    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationmessage = async (user, url) => {
    const {_id, username, room } = user
    const message = new Message({user: _id, room, type: 'location', message: url})
    await message.save()

    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

const generateImageMessage = async (user, image) => {

    const {_id, username, room } = user
    const message = new Message({user: _id, room, type: 'image', message: image})
    await message.save()

    return {
        username,
        image,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationmessage,
    generateImageMessage
}