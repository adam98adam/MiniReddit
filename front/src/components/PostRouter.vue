<template>
    <div class="grid-container">
        <div id="up-arrow">
            <a @click="giveLike()"><i class="fas fa-arrow-up"></i></a>
        </div>
        <div id="subreddit">r/{{this.subreddit_name}}</div>
        <div id="nickname">Posted by u/{{this.user_nickname}}</div>
        <div id="creation-date">
            <button @click="deletePost()" v-if="this.isModerator" id="deleteButton">Delete</button>
            <br/>
            {{this.time}}
        </div>
        <div id="counter">{{this.counter}}</div>
        <div id="title">Title : {{this.title}}</div>
        <div id="error" v-if="errorMessage.isVisible">{{ errorMessage.content }}</div>
        <div id="content">{{this.content}}</div>
        <button v-if="this.single_post" @click="goToComments()" id="comments" type="button" class="btn btn-dark">Comments</button>
        <div id="bottom-arrow">
            <a @click="giveDislike()"><i class="fas fa-arrow-down"></i></a>
        </div>
        <iframe v-if="this.video_url!== null" :src="changeLink()" title="description"></iframe>
        <img class="img" v-if="this.image_path!== null"   :src="this.image_path" title="description"/>
    </div>
</template>

<script>
//import axios from '../services/axios'
import socket from '../socketConnection'
import moment from 'moment'
import axios from 'axios';

export default {
    name: 'PostRouter',
    props:['id','title','content','image_path','video_url','creation_date','subreddit_name','user_nickname','post_votes','single_post'],
    data() {
        {
            return {
                //subreddit_name:'',
                //nickname:'',
                isModerator: false,
                video_url_local: this.video_url,
                time:'',
                counter:0,
                errorMessage: {
                    isVisible: false,
                    content:""
                }
            }
        }
    },
    methods: {
        isLogged() {
            return sessionStorage.getItem("isLogged");
        },
        deletePost() {
            socket.emit("deletePost", this.id);
        },
        async getAll() {
            await fetch(
                `http://localhost:3000/post/isModerator/${this.subreddit_name}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            ).then((data) => {
                console.log(data.ok);
                this.isModerator = data.ok;
            });
        },
        showErrorMessage(message) {
            this.errorMessage.content = message;
            this.errorMessage.isVisible = true;
            setTimeout(() => {
                this.errorMessage.isVisible = false;
            }, 6000);
        },
        changeLink(){
            this.video_url_local = this.video_url_local.replace(
            "watch?v=",
            "/embed/"        
            )
            return this.video_url_local;
        },
        async giveLike() {
            if(sessionStorage.getItem("isLogged")) {
                console.log("giveLike")
                await axios.get(`http://localhost:3000/post_vote/post_id=${this.id}/vote=1`)
            } else {
                this.showErrorMessage("Log in to vote");
            }
        },
        async giveDislike() {
            if(sessionStorage.getItem("isLogged")) {
                console.log("giveDislake")
                await axios.get(`http://localhost:3000/post_vote/post_id=${this.id}/vote=-1`)
            } else {
                this.showErrorMessage("Log in to vote");
            }
        },
        async goToComments() {
            console.log();
            //TODO
            this.$router.push(`/r/${this.subreddit_name}/${this.id}`);
        },
    },
    async created() {
        // const subreddit = await axios.get(`http://localhost:3000/subreddit/id=${this.subreddit_id}`)
        //const user = await axios.get(`http://localhost:3000/user/id=${this.user_id}`)
        //const count = await axios.get(`http://localhost:3000/post_vote/counter/post_id=${this.id}`)
        this.time = moment(String(this.creation_date)).format('DD/MM/YYYY hh:mm');
        this.counter = this.post_votes;
        this.getAll();
    }
}
</script>

<style>
.grid-container {
    box-shadow: 2px 2px 2px red;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 50px;
    margin-right: 50px;
    border: 3px solid black;
    background-color: greenyellow;
    display:grid;
    grid-template-columns: repeat(4,1fr);
    grid-template-rows: repeat(6,1fr);
    grid-template-areas: "up-arrow subreddit nickname creation-date"
                        "ac as title xd"
                        "counter content content content"
                        "error content content content"
                        "bottom-arrow content content content"
                        "acc comments comments xdc"
}

.grid-container > #up-arrow {
    grid-area: up-arrow;
      display:flex;
    justify-content: center;
    align-items: center;
}

.grid-container > #up-arrow > a:hover {
   color:red;
}

.grid-container > #subreddit {
    grid-area: subreddit;
    text-align: center;
}

.grid-container > #nickname {
    grid-area: nickname;
    text-align: center;
}

.grid-container > #hr1 {
    grid-area: hr1;
    text-align: center;
}

.grid-container > #hr2 {
    grid-area: hr2;
    text-align: center;
}

.grid-container > #title {
    grid-area: title;
    text-align: center;
    color:red;
}

.grid-container > #creation-date {
    grid-area: creation-date;
    text-align: center;
}

.grid-container > #counter {
    grid-area: counter;
    display:flex;
    justify-content: center;
    align-items: center;
}

.grid-container > #error {
    grid-area: error;
    display:flex;
    justify-content: center;
    align-items: center;
    color:red;
}

.grid-container > #content {
    grid-area: content;
    display:flex;
    justify-content: center;
    align-items: center;
}

.grid-container > #comments {
    grid-area: comments;
    align-items: center;
}

.grid-container > #bottom-arrow {
    grid-area: bottom-arrow;
}

.grid-container > #bottom-arrow > a:hover {
   color:blue;
}

.img {
    width: 35vw;
    height: 35vh;
    @media(max-width: 800px) {
        width: 50vw;
        height: 50vh;
    };
}

#deleteButton {
    background-color: red;
}
</style>
