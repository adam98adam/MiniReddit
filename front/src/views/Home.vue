<template>
    <div>
        <Navbar/>
        <div class="header">
            <h1>Reddit Clone Homepage</h1>
        </div>
        <Search @searchPosts="searchPosts"/>
        <Sort @sortPosts="sortPosts"/>
        <div class="posts">
            <PostRouter v-for="post in posts" :key="post.id" :id="post.id" :title="post.title" :content="post.content"
            :image_path="post.image_path" :video_url="post.video_url" :creation_date="post.creation_date"
            :subreddit_name="post.name" :user_nickname="post.nickname" :post_votes="post.votes" :single_post="true"/>
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
import ngrok from '../ngrok'

export default {
    name: 'Home',
    data() {
        {
            return {
                orginalPosts: [],
                posts: [],
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
            socket.emit('getData');
        },
        isLogged() {
            return sessionStorage.getItem("isLogged");
        },
        sortPosts(sort) {
            if (sort) {
                this.posts = this.posts.sort((a, b) =>
                    a.creation_date > b.creation_date ? -1 : 1
                );
            } else {
                this.posts = this.posts.reverse();
            }
        },
        async searchPosts(content) {
            if (content.subreddit) {
                const reg = new RegExp(".*" + content.content +".*");
                this.posts = this.orginalPosts.filter(post => {
                    return post.name.match(reg);
                });
            } else {
                const reg = new RegExp(".*" + content.content +".*");
                this.posts = this.orginalPosts.filter(post => {
                    return  post.content.match(reg);
                });
            }
        },
    },
    async created() {
        const data = await axios.get(`${ngrok}/post/`);
        this.posts = data.data;
        this.orginalPosts = data.data;
        socket.on('allPosts', async (posts) => {
            console.log(posts.rows);
            this.posts = posts.rows;
        });
    }
}
</script>

<style scoped lang="scss">
.posts {
    margin-top: 1.5rem;
}
</style>
