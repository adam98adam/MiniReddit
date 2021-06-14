<template>
    <div>
        <!-- <Navbar/> -->
        <LoginButton :logged="isLogged()"/>
        <LogoutButton/>
          <div class="buttons">
              <button @click="$router.push('/list')">All posts</button>
              <button v-if="isLogged()" @click="$router.push('/new')">Add new posts</button>
              <!-- <button @click="dis()">Disconnect</button> -->
        </div>
        <PostRouter v-for="post in posts" :key="post.id" :id="post.id" :content="post.content" :checked="post.checked" :editable="editable"/>
    </div>
</template>

<script>
import LoginButton from '../components/LoginButton.vue'
import LogoutButton from '../components/LogoutButton.vue'
import PostRouter from '../components/PostRouter'
import socket from '../socketConnection'
import axios from '../services/axios'



export default {
  name: 'Home',
  data() {
    {
      return {
        posts:[],
        port:3000,
        editable:false

      }
    
    } 
  },
  components: {
    LoginButton,
    LogoutButton,
    PostRouter
  },
  methods: {
    async getAll() {
        socket.emit('getData')
    },
    isLogged() {
      return localStorage.getItem("isLogged");
    }
  //  async dis() {
   //     socket.disconnect();
    //}
  },
  computed: {

  },
  async created(){ 
    console.log(await axios.get("http://localhost:3000/user/"))
        this.getAll();
            socket.on('getData',async (posts) => {
                console.log(posts.rows)
                this.posts = posts.rows
                this.posts.sort((a,b)=>a.id-b.id)
                this.posts = this.posts.filter(x => x.checked === false)
                console.log(this.posts)
            })
  
        }
        
}
      



</script>

<style>

.buttons {
    display: flex;
    justify-content: center;
}

.buttons > router-link {
    margin: 6px;
}
</style>