const socket = io()

// Elements
const messageForm = document.querySelector('form#message-form')
const messageFormInput = messageForm.querySelector('input')
const messageFormButton = messageForm.querySelector('button')

const sendLocationButton = document.querySelector('#send-location')
const sendImageButton = document.querySelector('#send-image')
const messages = document.querySelector("#messages")

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML
const imageMessagetemplate = document.querySelector('#image-message-template').innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

// Options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New Message Element
    const newMessage = messages.lastElementChild
    // Height of the last message
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    // Visible Height
    const visibleHeight = messages.offsetHeight
    
    // Height of Messages Container
    const containerHeight = messages.scrollHeight
    
    // How far have I scrolled?
    const scrollOffset = messages.scrollTop + visibleHeight
    // console.log(scrollOffset, newMessageHeight)

    if(Math.round(containerHeight - newMessageHeight - 1) <= scrollOffset) {
        messages.scrollTop = messages.scrollHeight
        console.log('m here')
    }

}

const loadImages = () => {
    const imageElements = document.querySelectorAll('img'); // Select all images
    imageElements.forEach(img => {
        img.addEventListener('load', () => {
            autoscroll(); // Call autoscroll after image is fully loaded
        });
    });
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('imageMessage', (message) => {
    console.log(message)
    const html = Mustache.render(imageMessagetemplate, {
        username: message.username,
        image: message.image,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    loadImages()
})

socket.on('roomData', ({room, users}) => {
    console.log(room)
    console.log(users)
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector("#sidebar").innerHTML = html
})

messageForm.addEventListener('submit', (event) => {
    event.preventDefault()
    
    messageFormButton.setAttribute('disabled', 'disabled')

    const msg = event.target.elements.msg.value
    socket.emit('sendMessage', msg, (error) => { //here callback function is to acknowledge that the message has delivered
        
        messageFormButton.removeAttribute('disabled')
        messageFormInput.value = ""
        messageFormInput.focus()

        if(error) {
            return console.log(error)
        }

        console.log('Message Delivered!')
    })
})

sendImageButton.addEventListener('change', (event) => {

    const file = event.target.files[0]

    if(file) {
        const reader = new FileReader()

        reader.readAsDataURL(file)
        reader.onload = function() {
            sendImageButton.setAttribute('disabled', 'disabled')
            socket.emit('sendImage', reader.result, () => {
                console.log('Image Shared!')
                sendImageButton.removeAttribute('disabled')
            })
        }
    }

})

sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        }, 
        () => {
            console.log('Location Shared!')
            sendLocationButton.removeAttribute('disabled')
        })
    })
})

socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})