<template>
  <div class="flex-1 flex flex-col items-center bg-gray-100 justify-center">
    <div class="border rounded-lg bg-white space-y-2 shadow-md p-4 w-full max-w-sm flex flex-col">
      <h1 class="text-4xl ml-2 mb-4">Join room</h1>

      <input
        autofocus
        v-model.trim="username"
        type="text" 
        class="text-lg focusable font-medium bg-gray-100 p-3 focus:outline-none px-4 rounded-lg" 
        placeholder="Username">

      <input
        v-model.trim="room"
        type="text"
        class="text-lg focusable font-medium bg-gray-100 p-3 focus:outline-none px-4 rounded-lg" 
        placeholder="Room">

      <button 
        :disabled="!(username && room)"
        class="bg-blue-100 focusable text-blue-500 hover:bg-blue-600 hover:text-white text-lg py-3 focus:outline-none font-medium tracking-wide rounded-lg"
        @click="connect">Join</button>
    </div>
  </div>
</template>

<script>
  import SocketService from '../services/SocketService'

  export default {
    data() {
      return {
        username: 'Bot',
        room: 'room1',
        isError: ''
      }
    },

    methods: {
      async connect() {
        try {
          await SocketService.connect()
          await SocketService.joinRoom(this.username, this.room)
          this.$emit('onJoin')
        } catch (err) {
          this.isError = err
        }
      }
    }
  }
</script>

<style scoped>
  
</style>