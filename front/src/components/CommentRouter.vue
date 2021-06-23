<template>
    <div class="comment-container">
        <!-- <div id="subreddit">r/{{this.subreddit_name}}</div>
        <div id="nickname">Posted by u/{{this.user_nickname}}</div>
        <div id="created">{{this.time}}</div>
        <div id="counter">{{this.counter}}</div>
        <div id="title">Title : {{this.title}}</div> -->
        <!-- <div id="error" v-if="errorMessage.isVisible">{{ errorMessage.content }}</div> -->
        <div id="id">{{this.id}}</div>
        <div id="content">{{this.content}}</div>
        <div id="user_id">{{this.user_id}}</div>
        <button @click="deleteComment()" v-if="this.isModerator" id="deleteCommentButton">Delete</button>
    </div>
</template>

<script>
// import axios from '../services/axios'
import socket from '../socketConnection'
import ngrok from '../ngrok'
// import moment from 'moment'
// import axios from 'axios'

export default {
    name: 'CommentRouter',
    props:['id', 'content', 'user_id', 'subreddit_name', 'post_id'],
    data() {
        {
            return {
                isModerator: false,
                //subreddit_name:'',
                //nickname:'',
                // time:'',
                // counter:0,
                // errorMessage: {
                //     isVisible: false,
                //     content:""
                // }
            }
        }
    },
    methods: {
        deleteComment() {
            // console.log("Usuwam: ", this.id);
            socket.emit(
                "deleteComment",
                {
                    id: this.id,
                    post_id: this.post_id,
                }
            );
        },
        async getAll() {
            let isNickname = ''
            if(sessionStorage.getItem("nickname"))
                isNickname = sessionStorage.getItem("nickname")
    

            await fetch(
                `${ngrok}/post/isModerator/${this.subreddit_name}/${isNickname}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            ).then((data) => {
                console.log("Data: ", data.ok);
                this.isModerator = data.ok;
                console.log(this.isModerator)
            });
        },
        // showErrorMessage(message) {
        //     this.errorMessage.content = message;
        //     this.errorMessage.isVisible = true;
        //     setTimeout(() => {
        //         this.errorMessage.isVisible = false;
        //     }, 6000);
        // },
        // async giveLike() {
        //     if(sessionStorage.getItem("isLogged")) {
        //         console.log("giveLike")
        //         await axios.get(`http://localhost:3000/post_vote/post_id=${this.id}/vote=1`)
        //     } else {
        //         this.showErrorMessage("Log in to vote");
        //     }
        // },
        // async giveDislike() {
        //     if(sessionStorage.getItem("isLogged")) {
        //         console.log("giveDislake")
        //         await axios.get(`http://localhost:3000/post_vote/post_id=${this.id}/vote=-1`)
        //     } else {
        //         this.showErrorMessage("Log in to vote");
        //     }
        // }
    },
    async created() {
        // const subreddit = await axios.get(`http://localhost:3000/subreddit/id=${this.subreddit_id}`)
        //const user = await axios.get(`http://localhost:3000/user/id=${this.user_id}`)
        //const count = await axios.get(`http://localhost:3000/post_vote/counter/post_id=${this.id}`)
        // this.time = moment(String(this.creation_date)).format('DD/MM/YYYY hh:mm');
        // this.counter = this.post_votes;
        //console.log(subreddit.data)
        //console.log(user.data)
        //this.counter = count.data.count
        //this.subreddit_name = subreddit.data.name
        //this.nickname = user.data.nickname
        this.getAll();
    }
}
</script>

<style>
.comment-container {
    box-shadow: 2px 2px 2px red;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 50px;
    margin-right: 50px;
    border: 3px solid black;
    background-color: greenyellow;
    display:grid;
    grid-template-columns: 1fr, 1fr, 1fr;
    grid-template-rows: 1fr, 1fr, 1fr;
    grid-template-areas:"id user_id deleteCommentButton"
                        "content content content"
                        "content content content"
}

.comment-container > #id {
    grid-area: id;
    text-align: center;
}

.comment-container > #user_id {
    grid-area: user_id;
    text-align: center;
}

.comment-container > #deleteCommentButton {
    grid-area: deleteCommentButton;
    text-align: center;
    background-color: red;
}

.comment-container > #content {
    grid-area: content;
    display:flex;
    justify-content: center;
    align-items: center;
}
</style>
