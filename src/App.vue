<template>
  <div class="h-screen flex justify-center bg-gray-300">
    <div class="xl:max-w-6xl w-full flex xl:my-20 flex-1 shadow-2xl xl:rounded-xl overflow-hidden bg-white">
      <auth-box v-if="!isJoined" @onJoin="isJoined = true" />
      <chat v-else />
    </div>
  </div>
</template>

<script>
  import Chat from './components/Chat'
  import AuthBox from './components/AuthBox'
  
  export default {
    components: {
      Chat,
      AuthBox
    },

    data() {
      return {
        isJoined: false
      }
    }
  }
</script>

<style>

</style>