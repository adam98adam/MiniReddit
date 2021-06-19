<template>
    <div>
       <LoginButton/>
        <LogoutButton/>
        <button  class="btn btn-primary"  @click="$router.push('/')">Back</button>
        <div v-if="edit">
            <br>
            <label for="post">Edit Post : </label>
            <input v-model="post" type="text">
            <button @click="changePost"> Edit </button>
        </div>
        <PostRouter v-for="post in posts" :key="post.id" :id="post.id" :content="post.content" :checked="post.checked" :editable="editable" @editPost="editPost" @deletePost="deletePost"/>
    </div>
</template>

<script>
//NIE KORZYSTAM
import PostRouter from '../components/PostRouter'
import LoginButton from '../components/LoginButton'
import LogoutButton from '../components/LogoutButton'
import socket from '../socketConnection'

export default {
  name: 'ListPost',
  data() {
    {
      return {
        post:"",
        postId:"",
        checked:"",
        posts:[],
        port:3000,
        editable: true,
        edit:false
      }
    
    } 
  },
  components: {
      PostRouter,
      LoginButton,
      LogoutButton
  },
  methods: {
    async getAll() {
      socket.emit('getData')
    },
       isLogged() {
      return localStorage.getItem("isLogged");
    },
    async editPost(data) {
        this.postId = data.id
        this.checked = data.checked
        this.edit = !this.edit

    },
    async deletePost(id) {
        console.log(id)
        socket.emit('deletePost',id)
    },
    async changePost() {
        socket.emit('editPost',{
            "id": this.postId,
            "content": this.post,
            "checked": this.checked
        })
        this.edit = !this.edit
    }
  },
  computed: {
  
  },
    created() {
        this.getAll();
        socket.on('getData',async (posts) => {
            console.log(posts.rows)
            this.posts = posts.rows
            this.posts.sort((a,b)=>a.id-b.id)
            console.log(this.posts)
        })
    },
}
</script>
