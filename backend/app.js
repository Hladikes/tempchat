const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const { v4: uuidv4 } = require('uuid')

app.use(express.static(__dirname.replace('backend', 'dist')))

const rooms = new Map()
const allUsers = new Map()

io.on('connect', socket => {
  socket.on('join', ({ username, room }, callback) => {
    socket.join(room)
    const uuid = uuidv4()
    const newUser = { uid: uuid, name: username }
    
    if (!rooms.has(room)) {
      rooms.set(room, {
        messages: [],
        users: []
      })
    }

    rooms.get(room).users.push(newUser)
    io.to(room).emit('user join', { newUser })
    
    sendMessage(room, 'user_join', {
      type: 'user_join',
      user: newUser,
      text: 'has joined the chat 🔥'
    })

    allUsers.set(socket, {
      uid: newUser.uid,
      room
    })

    callback(uuid, rooms.get(room))
  })

  socket.on('user message', ({ room, message }, callback) => {
    sendMessage(room, 'user_message', message)
    callback(true)
  })

  socket.on('disconnect', () => {
    if (!allUsers.has(socket)) return

    const userReference = allUsers.get(socket)
    const room = userReference.room
    const userIndex = rooms.get(room).users.findIndex(u => u.uid === userReference.uid)
    const user = rooms.get(room).users[userIndex]
    
    allUsers.delete(socket)
    rooms.get(room).users.splice(userIndex, 1)
    const leftUsers = rooms.get(room).users.length
    
    if (leftUsers === 0) {
      console.log(`[ROOM_CLEANUP:${room}] Room data has been cleaned`)
      rooms.delete(room)
      return
    }

    sendMessage(room, 'user_leave', {
      user, text: 'has left the chat 👋'
    })
    
    io.to(room).emit('user leave', user)
  })
})

function sendMessage(room, flag, message) {
  message.type = flag
  rooms.get(room).messages.unshift(message)
  io.to(room).emit('room message', message)

  console.log(`[MSG:${room}:${flag}]`, message)
}

http.listen(port, () => {
  console.log(`[i] Server running at port ${port}`)
})