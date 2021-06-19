<template>
    <div>
        <label for="post">Post : </label>
        <input v-model="post" type="text">
        <button @click = "addPost"> Add post</button>
    </div>
</template>

<script>
//DO Sprawdzenia
import socket from '../socketConnection'

export default {
  name: 'AddPost',
  data() {
    {
      return {
        post:"",
        port:3000,
      }
    } 
  },
  components: {},
  methods: {
    async addPost() {
        await socket.emit('addPost',{content: this.post})
        this.$router.push('/list') 
    }
  },
  created: async function() {}
}
</script>

<style>
</style>
