<template>
    <div>
        <Navbar/>
        <div class="header">
            <h1>r/{{ name }}</h1>
            <div v-if="isLogged()">
                <div v-if="!isSubredditUser" id="joinDiv">
                    <p>Want to post in r/{{ name }} ?</p>
                    <button @click="joinSubreddit" class="btn joinSubreddit">Join now!</button>
                </div>
                <button v-if="isSubredditUser" @click="expand" class="btn createPost">{{addPostText}}</button>
                <div v-if="showAddPost">
                    <AddPost :name="this.name" :posts="this.posts"/>
                </div>
            </div>
        </div>
        <div id="error-message" v-if="errorMessage.isVisible" >
            {{ errorMessage.content }}
        </div>
        <div class="posts">
            <PostRouter v-for="post in posts" :key="post.id" :id="post.id" :title="post.title" :content="post.content" :image_path="post.image_path" :video_url="post.video_url" :creation_date="post.creation_date" :subreddit_name="post.name" :user_nickname="post.nickname" :post_votes="post.votes" :single_post="true"/>
        </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import PostRouter from '../components/PostRouter'
import AddPost from '../components/AddPost'
import socket from '../socketConnection'
//import axios from '../services/axios'

export default {
    name: 'Subreddit',
    data() {
        {
            return {
                name:this.$route.params.name,
                posts:[],
                showAddPost: false,
                addPostText: "Create Post",
                isSubredditUser: false,
                errorMessage: {
                    isVisible: false,
                    content:""
                }
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
            if (this.isLogged())
                socket.emit(
                    'getSubredditUser',
                    {
                        userName: sessionStorage.getItem("nickname"),
                        subredditName: this.$route.params.name,
                    }
                );
            // if (sessionStorage.getItem("nickname") != null)
            //     this.isSubredditUser = true;
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
        joinSubreddit() {
            socket.emit(
                'joinSubreddit',
                {
                    userName: sessionStorage.getItem("nickname"),
                    subredditName: this.$route.params.name,
                }
            );
        },
        showErrorMessage(message) {
            this.errorMessage.content = message;
            this.errorMessage.isVisible = true;
            setTimeout(() => {
                this.errorMessage.isVisible = false;
            }, 6000);
        },
    },
    async created() { 
        //console.log(await axios.get("http://localhost:3000/user/"));
        console.log(this.$route.params.name);
        this.getAll();
        socket.on('getSubredditData', async (posts) => {
            if(posts === 0)
                this.showErrorMessage('Post title already exists in this subreddit')
            else {
                this.posts = posts.rows
            }
        });
        socket.on('getSubredditUser', async (response) => {
            // console.log(response);
            this.isSubredditUser = response;
        });
        socket.on('activated', async () => {
            this.getAll();
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

.joinSubreddit {
    margin-top: 0.5rem;
    background: cadetblue !important;
    border: 3px black solid !important;
}

#error-message {
	text-align: center;
	color: red;
	margin-top: 12px;
}

#joinDiv {
    margin-top: 2rem;
}

#joinDiv > p {
    color: red;
    font-size: 1.5rem;
}
</style>
