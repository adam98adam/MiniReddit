<template>
    <div>
        <Navbar/>
        <div class="subreddits">
            <SubredditRouter v-for="subreddit in subreddits" :key="subreddit.id" :id="subreddit.id" :name="subreddit.name" :description="subreddit.description"/>
        </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import SubredditRouter from '../components/SubredditRouter'
import socket from '../socketConnection'
import axios from '../services/axios'

export default {
    name: 'Subreddits',
    data() {
        {
            return {
                subreddits:[],
                port:3000,
                editable:false,
            }
        }
    },
    components: {
        Navbar,
        SubredditRouter,
    },
    methods: {
        async getAll() {
            socket.emit('getSubreddits');
        },
        isLogged() {
            return localStorage.getItem("isLogged");
        },
    },
    computed: {},
    async created() { 
        console.log(await axios.get("http://localhost:3000/user/"));
        this.getAll();
        socket.on('getSubreddits', async (subreddits) => {
            console.log(subreddits.rows);
            this.subreddits = subreddits.rows;
        });
    }
}
</script>

<style>
.subreddits {
    margin-top: 50px;
}
</style>