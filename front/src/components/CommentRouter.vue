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
    </div>
</template>

<script>
// import axios from '../services/axios'
// import moment from 'moment'
// import axios from 'axios';

export default {
    name: 'CommentRouter',
    props:['id', 'content', 'user_id'],
    data() {
        {
            return {
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
    grid-template-areas:"id user_id placeholder"
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

.comment-container > #content {
    grid-area: content;
    display:flex;
    justify-content: center;
    align-items: center;
}
</style>
