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
    name: 'Subreddit',
    data() {
        {
            return {
                name:this.$route.params.name,
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
            // console.log(this.$route.params.name);
            socket.emit('getSubredditData', this.$route.params.name);
        },
        isLogged() {
            return localStorage.getItem("isLogged");
        },
    },
    computed: {},
    async created() { 
        console.log(await axios.get("http://localhost:3000/user/"));
        console.log(this.$route.params.name);
        this.getAll();
        socket.on('getSubredditData', async (posts) => {
            console.log(posts.rows);
            this.posts = posts.rows;
        });
    }
}
</script>

<style>
.subreddits {
    margin-top: 50px;
}
</style>