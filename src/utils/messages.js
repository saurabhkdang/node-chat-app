const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationmessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

const generateImageMessage = (username, image) => {
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