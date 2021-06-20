<template>
    <div>
        <Navbar/>
        <div class="header">
            <h1>r/{{ name }}</h1>
            <button v-if="isLogged()" @click="expand" class="btn createPost">{{addPostText}}</button>
            <div v-if="showAddPost">
                <AddPost/>
            </div>
        </div>
        <div class="posts">
            <PostRouter v-for="post in posts" :key="post.id" :id="post.id" :title="post.title" :content="post.content" :image_path="post.image_path" :video_url="post.video_url" :creation_date="post.creation_date" :subreddit_name="post.name" :user_nickname="post.nickname" :post_votes="post.votes"/>
        </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import PostRouter from '../components/PostRouter'
import AddPost from '../components/AddPost'
import socket from '../socketConnection'
import axios from '../services/axios'

export default {
    name: 'Subreddit',
    data() {
        {
            return {
                name:this.$route.params.name,
                posts:[],
                showAddPost: false,
                addPostText: "Create Post",
            }
        }
    },
    components: {
        Navbar,
        PostRouter,
        AddPost,
    },
    methods: {
        async getAll() {
            // console.log(this.$route.params.name);
            socket.emit('getSubredditData', this.$route.params.name);
        },
        isLogged() {
            return sessionStorage.getItem("isLogged");
        },
        expand() {
            this.showAddPost = !this.showAddPost;
            if (this.showAddPost) {
                this.addPostText = "Cancel";
            }
            else {
                this.addPostText = "Create Post";
            }
        },
    },
    computed: {},
    async created() { 
        console.log(await axios.get("http://localhost:3000/user/"));
        console.log(this.$route.params.name);
        this.getAll();
        socket.on('getSubredditData', async (posts) => {
            // console.log('hello')
            console.log(posts.rows);
            this.posts = posts.rows;
        });
    }
}
</script>

<style>
h1 {
    margin-top: 100px;
}

.header {
    margin-top: 100px;
}

.createPost {
    margin-top: 2rem;
    background: cadetblue !important;
    border: 3px black solid !important;
}
</style>
