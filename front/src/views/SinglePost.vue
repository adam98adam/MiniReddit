<template>
    <div>
        <Navbar/>
        <div class="header">
            <h1>Single Post</h1>
        </div>
        <div v-if="checkPost()">
            <PostRouter  v-for="post in posts" :key="post.id" :id="post.id" :title="post.title" :content="post.content" :image_path="post.image_path" :video_url="post.video_url" :creation_date="post.creation_date" :subreddit_name="post.name" :user_nickname="post.nickname" :post_votes="post.votes" :single_post="false"/>
            <div v-if="checkCommets()" class="comments">
                <CommentRouter v-for="comment in comments" :key="comment.id" :id="comment.id" :content="comment.content" :user_id="comment.user_id" :subreddit_name="this.$route.params.name" :post_id="this.$route.params.id"/>
            </div>
            <div v-if="!checkCommets()" class="err">
                <h2>{{this.error_message}}</h2>
            </div>
            <button v-if="isLogged()" @click="expand" class="btn createComment">{{addCommentText}}</button>
            <div v-if="showAddComment">
                <AddComment :post_id="posts[0].id"/>
            </div>
        </div>
        <div v-if="!checkPost()" class="err">
            <h2>{{this.error_message}}</h2>
        </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import PostRouter from '../components/PostRouter'
import CommentRouter from '../components/CommentRouter'
import AddComment from '../components/AddComment'
import socket from '../socketConnection'
//import axios from '../services/axios'

export default {
    name: 'SinglePost',
    data() {
        {
            return {
                posts: [],
                comments: [],
                error_message:'',
                showAddComment: false,
                addCommentText: "Add Comment",
            }
        }
    },
    components: {
        Navbar,
        PostRouter,
        CommentRouter,
        AddComment,
    },
    methods: {
        async getAll() {
            socket.emit('getComments', this.$route.params.id);
            socket.emit(
                'getSinglePost',
                {
                    name: this.$route.params.name,
                    id: this.$route.params.id,
                });
        },
        isLogged() {
            return sessionStorage.getItem("isLogged");
            //return localStorage.getItem("isLogged");
        },
        // getHome() {
        //     this.$router.push("/");
        // },
        checkPost() {
            if(this.posts.length > 0)
                return true
            else
                return false
        },
        checkCommets() {
            if(this.comments.length > 0)
                return true
            else {
                this.error_message = "No Comments !!"
                return false
            }
        },
        expand() {
            this.showAddComment = !this.showAddComment;
            if (this.showAddComment) {
                this.addCommentText = "Cancel";
            }
            else {
                this.addCommentText = "Add Comment";
            }
        },
    },
    computed: {},
    async created() { 
        //console.log(await axios.get("http://localhost:3000/user/"));
        this.getAll();
        socket.on('getComments', async (comments) => {
            console.log(comments.rows);
            this.comments = comments.rows;
        });
        socket.on('getSinglePost', async (posts) => {
            if(typeof posts.post_count !== 'undefined') {
                this.posts = []
                this.error_message = posts.error_message
            }
            else {    
                console.log(posts.rows);
                this.posts = posts.rows;
            }
        });
        socket.on('allComments', async (data) => {
            console.log("BŁAGAM");
            console.log("comments: " + data.comments);
            console.log("post_id: " + data.post_id);
            console.log("this.$route.params.id: " + this.$route.params.id);
            if (data.post_id == this.$route.params.id) {
                this.comments = data.comments;
            }
        });
    }
}
</script>

<style>
.comments {
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

.createComment {
    margin-top: 2rem;
    background: cadetblue !important;
    border: 3px black solid !important;
}

.err {
    margin-top:5rem;
    color: red;
}
</style>
