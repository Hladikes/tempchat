import { io } from "socket.io-client"

class SocketService {

  socket = null
  username = null
  room = null
  uid = null
  users = []
  messages = []

  _onMessageReceived = null
  _onUserJoin = null
  _onUserLeave = null
  _onUserStartTyping = null
  _onUserEndTyping = null

  connect() {
    return new Promise((resolve, reject) => {
      const url = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000'
      this.socket = io(url)
      this.socket.on('connect', () => { resolve() })
      this.socket.on('connect_failed', () => { reject() })
    })
  }

  joinRoom(username, room) {
    return new Promise((resolve, reject) => {
      this.socket.emit('join', { username, room }, (uid, { messages, users }) => {
        if (uid) {
          this.username = username
          this.room = room
          this.uid = uid
          this.messages = messages
          this.users = users

          this._initSocketListeners()
          resolve()
        } else {
          reject('Username or room does not match')
        }
      })
    })
  }

  sendMessage(message) {
    return new Promise((resolve, reject) => {
      this.socket.emit('user message', {
        message: {
          text: message,
          author: {
            uid: this.uid,
            name: this.username
          }
        },
        room: this.room
      }, response => {
        if (response) {
          resolve()
        } else {
          reject('Unable to send message')
        }
      })
    })
  }

  startTyping() {
    console.log('startTyping()')
    this.socket.emit('user start typing', {
      room: this.room,
      user: {
        name: this.username,
        uid: this.uid
      }
    })
  }

  endTyping() {
    console.log('endTyping()')
    this.socket.emit('user end typing', {
      room: this.room,
      user: {
        name: this.username,
        uid: this.uid
      }
    })
  }

  _initSocketListeners() {
    this.socket.on('user join', ({ newUser, users }) => {
      if (this._onUserJoin) this._onUserJoin(newUser)
    })
    
    this.socket.on('user leave', (user) => {
      if (this._onUserLeave) this._onUserLeave(user)
    })
    
    this.socket.on('room message', (message) => {
      if (this._onMessageReceived) this._onMessageReceived(message)
    })

    this.socket.on('user start typing', (user) => {
      if (this._onUserStartTyping) this._onUserStartTyping(user)
    })

    this.socket.on('user end typing', (user) => {
      if (this._onUserEndTyping) this._onUserEndTyping(user)
    })
  }

  onMessageReceived(cb) { this._onMessageReceived = cb }
  onUserJoin(cb) { this._onUserJoin = cb }
  onUserLeave(cb) { this._onUserLeave = cb }
  onUserStartTyping(cb) { this._onUserStartTyping = cb }
  onUserEndTyping(cb) { this._onUserEndTyping = cb }
}
const socketService = new SocketService()

window.socketService = socketService
export default socketService