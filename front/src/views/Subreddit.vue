<template>
    <div>
        <Navbar/>
        <div class="header">
            <h1>r/{{ name }}</h1>
        </div>
        <div class="posts">
            <PostRouter v-for="post in posts" :key="post.id" :id="post.id" :title="post.title" :content="post.content" :image_path="post.image_path" :video_url="post.video_url" :creation_date="post.creation_date" :subreddit_name="post.name" :user_nickname="post.nickname" :post_votes="post.votes"/>
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
                name: this.$route.params.name,
                posts: [],
                port: 3000,
                editable: false,
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
            // socket.emit('getSubredditData', this.$route.params.name);
            socket.emit('getData');
        },
        isLogged() {
            return localStorage.getItem("isLogged");
        },
    },
    computed: {},
    async created() { 
        console.log(await axios.get("http://localhost:3000/user/"));
        const data = await axios.get("http://localhost:3000/post/subreddit="+this.$route.params.name);
        //console.log(data.data)
        this.posts = data.data;
        // console.log(this.$route.params.name);
        // this.getAll();
        // socket.on('getSubredditData', async (posts) => {
        //     console.log(posts.rows);
        //     this.posts = posts.rows;
        // });
    }
}
</script>

<style>
.header {
    margin-top: 6rem;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
}

.posts {
    margin-top: 4rem;
}
</style>
