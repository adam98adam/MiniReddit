<template>
    <div>
        <Navbar/>
        <div class="header">
            <h1>Home - all posts</h1>
        </div>
        <Search @searchPosts="searchPosts"/>
        <Sort @sortPosts="sortPosts"/>
        <div class="posts">
          <PostRouter v-for="post in posts" :key="post.id" :id="post.id" :title="post.title" :content="post.content" :image_path="post.image_path" :video_url="post.video_url" :creation_date="post.creation_date" :subreddit_name="post.name" :user_nickname="post.nickname" :post_votes="post.votes"/>
      </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Search from '../components/Search.vue'
import Sort from '../components/Sort.vue'
import PostRouter from '../components/PostRouter'
import socket from '../socketConnection'
import axios from '../services/axios'

export default {
  name: 'Home',
  data() {
    {
      return {
        orginalPosts:[],
        posts:[],
      }
    
    } 
  },
  components: {
    Navbar,
    Search,
    Sort,
    PostRouter,
  },
  methods: {
    async getAll() {
        socket.emit('getData')
    },
    isLogged() {
      return sessionStorage.getItem("isLogged");
      //return localStorage.getItem("isLogged");
    },
    sortPosts(sort){
      console.log("Sort");
      if(sort) {
        this.posts = this.posts.sort((a, b) =>
          a.creation_date > b.creation_date ? -1 : 1
          );
      } else {
        this.posts = this.posts.sort((a, b) =>
          a.creation_date > b.creation_date ? 1 : -1
          );
      }
    },
    async searchPosts(content){
      if(content.subreddit)
      {
        //const data = await axios.get(`http://localhost:3000/post/subreddit=${content.content}`)
        //this.posts = data.data
        const reg = new RegExp(".*" + content.content +".*")
        this.posts = this.orginalPosts.filter(post => {
          return post.name.match(reg)
        })
      }
      else{
        //const data = await axios.get(`http://localhost:3000/post/content=${content.content}`)
        //this.posts = data.data
        const reg = new RegExp(".*" + content.content +".*")
        this.posts = this.orginalPosts.filter(post => {
         return  post.content.match(reg)
        })
      }
    },
  },
  async created(){ 
    //console.log(await axios.get("http://localhost:3000/user/"))
        const data = await axios.get("http://localhost:3000/post/")
        //console.log(data.data)
        this.posts = data.data
        this.orginalPosts = data.data
        //console.log(posts)
        //this.posts = data.rows
        //console.log(this.posts)
        //this.getAll();
        //socket.on('getData',async (posts) => {
        //console.log(posts.rows)
        //this.posts = posts.rows
        //this.posts.sort((a,b)=>a.id-b.id)
        //this.posts = this.posts.filter(x => x.checked === false)
        //this.posts.forEach(element => {
        // console.log(element)                 
        //});
        //})
    }
}
</script>

<style>
.posts{
  margin-top: 20px;
}

.header {
  margin-top: 100px;
}
</style>
