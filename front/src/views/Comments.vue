<template>
    <div>
        <Navbar/>
        <div class="header">
            <h1>Single Post</h1>
        </div>
        <PostRouter v-for="post in posts" :key="post.id" :id="post.id" :title="post.title" :content="post.content" :image_path="post.image_path" :video_url="post.video_url" :creation_date="post.creation_date" :subreddit_name="post.name" :user_nickname="post.nickname" :post_votes="post.votes"/>
        <!-- <button v-if="isLogged()" @click="expand" class="btn createComment">{{addCommentText}}</button>
        <div v-if="showAddComment">
            <AddComment :comments="this.comments"/>
        </div>
        <div>
            <button @click="getHome()" type="button" class="btn btn-secondary">Home</button>
        </div> -->
        <div class="comments">
            <CommentRouter v-for="comment in comments" :key="comment.id" :id="comment.id" :content="comment.content" :user_id="comment.user_id"/>
        </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import PostRouter from '../components/PostRouter'
import CommentRouter from '../components/CommentRouter'
// import AddComment from '../components/AddComment'
import socket from '../socketConnection'
import axios from '../services/axios'

export default {
    name: 'Comments',
    data() {
        {
            return {
                posts: [],
                comments: [],
                port: 3000,
                editable: false,
                // showAddComment: false,
                // addCommentText: "Add Comment",
            }
        }
    },
    components: {
        Navbar,
        PostRouter,
        CommentRouter,
        // AddComment,
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
        getHome() {
            this.$router.push("/");
        },
        // expand() {
        //     this.showAddComment = !this.showAddComment;
        //     if (this.showAddComment) {
        //         this.addCommentText = "Cancel";
        //     }
        //     else {
        //         this.addCommentText = "Add Comment";
        //     }
        // },
    },
    computed: {},
    async created() { 
        console.log(await axios.get("http://localhost:3000/user/"));
        this.getAll();
        socket.on('getComments', async (comments) => {
            console.log(comments.rows);
            this.comments = comments.rows;
        });
        socket.on('getSinglePost', async (posts) => {
            console.log(posts.rows);
            this.posts = posts.rows;
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
</style>
