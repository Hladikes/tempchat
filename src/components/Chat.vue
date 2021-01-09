<template>
  <div class="flex-1 flex flex-col">
    <header class="border-b flex  items-center border-white border-opacity-10 z-10 shadow-md">
      <div class="max-w-xs w-full border-r border-gray-200">
        <h1 class="text-blue-700 font-semibold text-3xl p-6">Temp<span class="font-normal text-blue-400">chat</span></h1>
      </div>
      <h1 class="ml-6 text-gray-500 font-semibold text-2xl">{{ roomName || '-' }}</h1>
    </header>

    <main class="flex-1 flex overflow-x-hidden">
      <aside class="max-w-xs bg-gray-100 space-y-2 py-3 border-r border-gray-300 flex flex-col overflow-y-auto overflow-x-hidden">
        <p v-for="(user, i) in users" :key="i" class="whitespace-nowrap font-normal select-none py-1 px-3 mx-2 text-xl border-gray-300">{{ user.name }}</p>
        <!-- <p class="font-normal select-none py-1 px-3 mx-2 text-xl border-gray-300">Username</p> -->
        <!-- <p class="font-normal select-none py-1 px-3 mx-2 text-xl border-gray-300 flex justify-between">Player342<span class="animate-bounce">✍️</span></p> -->
      </aside>

      <section class="flex-1 flex flex-col">
        <div class="relative flex-1 flex overflow-y-hidden">
          <div class="flex-1 flex flex-col-reverse overflow-y-auto py-4">
            <div v-for="(message, i) in messages" :key="i">
              <!-- {{ message }} -->
              <p v-if="message.type === 'user_join' || message.type === 'user_leave'" class="text-center text-gray-400">
                <span class="text-blue-900 font-medium">{{ message.user.name }}</span>
                <span class="font-normal"> {{ message.text }}</span>
              </p>

              <template v-else-if="message.type === 'user_message'">
                <div v-if="isFromAuthor(message.author.name)" class="py-2 px-4 flex flex-col items-end">
                  <p class="mx-2 font-semibold text-blue-900">{{ message.author.name }}</p>
                  <p class="p-2 px-3 text-xl rounded-xl bg-blue-100 text-blue-900 max-w-md">{{ message.text }}</p>
                </div>

                <div v-else class="py-2 px-4 flex flex-col items-start">
                  <p class="mx-2 font-semibold">{{ message.author.name }}</p>
                  <p class="p-2 px-3 text-xl rounded-xl bg-gray-100 max-w-md">{{ message.text }}</p>
                </div>
              </template>
            </div>
          </div>
          <!-- <div class="absolute bottom-0 h-7 w-full bg-gradient-to-t from-white to-transparent z-30"></div> -->
        </div>
        <div class="p-4 pt-1 flex flex-row">
          <input 
            autofocus 
            v-model.trim="newMessage" 
            @keydown.enter="send" 
            ref="input" 
            class="focusable appearance-none flex-1 rounded-lg border bg-gray-100 p-3 focus:outline-none" 
            type="text" 
            placeholder="Aa">
            
          <button @click="send" class="focusable mr-2 p-3 font-medium focus:outline-none rounded-lg px-4  ml-3 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700">Send</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
  import SocketService from '../services/SocketService'

  export default {
    data() {
      return {
        users: SocketService.users,
        messages: SocketService.messages,
        roomName: SocketService.room,
        newMessage: ''
      }
    },

    methods: {
      isFromAuthor(username) {
        return username === SocketService.username
      },

      async send() {
        if (!this.newMessage) return

        try {
          await SocketService.sendMessage(this.newMessage)
          this.newMessage = ''
          this.$nextTick(() => this.$refs.input.focus())
        } catch (err) {
          this.messages.unshift({
            type: 'error',
            text: 'Unnable to send message'
          })
        }
      }
    },

    mounted() {
      SocketService.onUserJoin(user => {
        this.users.unshift(user)
      })

      SocketService.onMessageReceived(message => {
        this.messages.unshift(message)
      })
      
      SocketService.onUserLeave(user => {
        const userIndex = this.users.findIndex(u => u.uid === user.uid)
        this.users.splice(userIndex, 1)
      })
    }
  }
</script>

<style>

</style>