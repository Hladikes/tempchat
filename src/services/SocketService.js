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
  }

  onMessageReceived(cb) { this._onMessageReceived = cb }
  onUserJoin(cb) { this._onUserJoin = cb }
  onUserLeave(cb) { this._onUserLeave = cb }
}
const socketService = new SocketService()

window.socketService = socketService
export default socketService