<template>
    <div>
        <Navbar/>
        <div class="posts">
          <PostRouter v-for="post in posts" :key="post.id" :id="post.id" :content="post.content"/>
      </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
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
    Navbar,
    PostRouter,
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
                //this.posts.sort((a,b)=>a.id-b.id)
                //this.posts = this.posts.filter(x => x.checked === false)
                //this.posts.forEach(element => {
                 // console.log(element)                 
                //});
            })
  
        }
        
}
      



</script>

<style>

.posts{
  margin-top: 50px;
}


</style>