<template>
    <div>
        <Navbar/>
        <div class="header">
            <h1>Subreddit list</h1>
            <button v-if="isLogged()" @click="expand" class="btn createSubreddit">{{addSubredditText}}</button>
            <div v-if="showAddSubreddit">
                <AddSubreddit :subreddits="this.subreddits"/>
            </div>
        </div>
        <div class="subreddits">
            <SubredditRouter v-for="subreddit in subreddits" :key="subreddit.id"
            :id="subreddit.id" :name="subreddit.name" :description="subreddit.description"/>
        </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import SubredditRouter from '../components/SubredditRouter'
import AddSubreddit from '../components/AddSubreddit'
import socket from '../socketConnection'

export default {
    name: 'Subreddits',
    data() {
        {
            return {
                subreddits: [],
                port: 3000,
                editable: false,
                showAddSubreddit: false,
                addSubredditText: "Create Subreddit",
            }
        }
    },
    components: {
        Navbar,
        SubredditRouter,
        AddSubreddit,
    },
    methods: {
        async getAll() {
            socket.emit('getSubreddits');
        },
        isLogged() {
            return sessionStorage.getItem("isLogged");
        },
        expand() {
            this.showAddSubreddit = !this.showAddSubreddit;
            if (this.showAddSubreddit) {
                this.addSubredditText = "Cancel";
            } else {
                this.addSubredditText = "Create Subreddit";
            }
        },
    },
    computed: {},
    async created() {
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

.header {
    margin-top: 6rem;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
}

.addPost {
    margin: 1rem;
}

.createSubreddit {
    margin-top: 2rem;
    background: cadetblue !important;
    border: 3px black solid !important;
}
</style>
