<template>
    <div>
        <Navbar/>
        <h1>Home - all posts</h1>
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
                editable:false,
            }
        }
    },
    components: {
        Navbar,
        PostRouter,
    },
    methods: {
        async getAll() {
            socket.emit('getData');
        },
        isLogged() {
            return localStorage.getItem("isLogged");
        },
    },
    computed: {},
    async created() { 
        console.log(await axios.get("http://localhost:3000/user/"));
        this.getAll();
        socket.on('getData', async (posts) => {
            console.log(posts.rows);
            this.posts = posts.rows;
        });
    }
}
</script>

<style>
.posts {
    margin-top: 50px;
}
</style>
