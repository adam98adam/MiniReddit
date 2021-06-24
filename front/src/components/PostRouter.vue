<template>
    <div class="grid-container">
        <div id="up-arrow">
            <a @click="giveLike()"><i class="fas fa-arrow-up"></i></a>
        </div>
        <div id="subreddit"><a style="color:whitesmoke;">r/{{this.subreddit_name}}</a></div>
        <div id="nickname"><a style="color:whitesmoke;">Posted by u/{{this.user_nickname}}</a></div>
        <div id="creation-date">
            <button @click="deletePost()" v-if="isModerator() || postOwner()" id="deleteButton" class="btn btn-dark"><a style="color:whitesmoke;">Delete</a></button>
            <br/>
            <a style="color:whitesmoke;">{{this.time}}</a>
        </div>
        <div id="counter"><a style="color:whitesmoke;">{{this.counter}}</a></div>
        <!-- <div id="counter">{{this.votes}}</div> -->
        <div id="title"><a style="color:#000000;">Title : {{this.title}}</a></div>
        <div id="error" v-if="errorMessage.isVisible"><a>{{ errorMessage.content }}</a></div>
        <div id="content"><a style="color:whitesmoke;">{{this.content}}</a></div>
        <div id="video"><iframe v-if="this.video_url!== null" :src="changeLink()" title="description"></iframe></div>
        <div id="image"><img class="img" v-if="this.image_path!== null" :src="getImagePath()" title="description"/></div>
        <button v-if="this.single_post" @click="goToComments()" id="comments" type="button" class="btn btn-dark"><a style="color:whitesmoke;">Comments</a></button>
        <div id="bottom-arrow">
            <a @click="giveDislike()"><i class="fas fa-arrow-down"></i></a>
        </div>
    </div>
</template>

<script>
import socket from '../socketConnection'
import moment from 'moment'
import axios from 'axios'
import ngrok from '../ngrok'

export default {
    name: 'PostRouter',
    props:['id','title','content','image_path','video_url','creation_date','subreddit_name','user_nickname','post_votes','single_post'],
    data() {
        {
            return {
                video_url_local: this.video_url,
                time:'',
                counter:0,
                // votes: this.post_votes,
                errorMessage: {
                    isVisible: false,
                    content:""
                }
            }
        }
    },
    methods: {
        getImagePath() {
            return this.image_path.replace(
                "http://localhost:3000",
                ngrok,
            );
        },
        isLogged() {
            return sessionStorage.getItem("isLogged");
        },
        isModerator() {
            return sessionStorage.getItem("isModerator");
        },
        deletePost() {
            socket.emit("deletePost", {postId: this.id,subreddit_name: this.subreddit_name,nickname : sessionStorage.getItem("nickname")});
        },
        postOwner() {
            if (sessionStorage.getItem("nickname") !== null && sessionStorage.getItem("nickname") === this.user_nickname) {
                return true;
            } else {
                return false;
            }
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
                await axios.get(`${ngrok}/post_vote/post_id=${this.id}/vote=1`)
            } else {
                this.showErrorMessage("Log in to vote");
            }
        },
        async giveDislike() {
            if(sessionStorage.getItem("isLogged")) {
                console.log("giveDislake")
                await axios.get(`${ngrok}/post_vote/post_id=${this.id}/vote=-1`)
            } else {
                this.showErrorMessage("Log in to vote");
            }
        },
        // async giveLike() {
        //     if(sessionStorage.getItem("isLogged")) {
        //         console.log("giveLike")
        //         //socket post like
        //         socket.emit("postLikes",{post_id: this.id, vote: 1, subreddit_name: this.subreddit_name, nickname: sessionStorage.getItem("nickname")})
        //         //await axios.get(`${ngrok}/post_vote/post_id=${this.id}/vote=1`)
        //     } else {
        //         this.showErrorMessage("Log in to vote");
        //     }
        // },
        // async giveDislike() {
        //     if(sessionStorage.getItem("isLogged")) {
        //         console.log("giveDislake")
        //         //socket post dislike
        //         socket.emit("postLikes",{post_id: this.id, vote: -1, subreddit_name: this.subreddit_name ,nickname: sessionStorage.getItem("nickname")})
        //         // await axios.get(`${ngrok}/post_vote/post_id=${this.id}/vote=-1`)
        //     } else {
        //         this.showErrorMessage("Log in to vote");
        //     }
        // },
        async goToComments() {
            console.log();
            this.$router.push(`/r/${this.subreddit_name}/${this.id}`);
        },
    },
    async created() {
        this.time = moment(String(this.creation_date)).format('DD/MM/YYYY hh:mm');
        this.counter = this.post_votes;

        // this.time = moment(String(this.creation_date)).format('DD/MM/YYYY hh:mm');
        // this.votes = this.post_votes;
        // socket.on("getVotes",(data) => {
        //     if(this.id === data.post_id) {
        //         this.votes = data.votes;
        //         this.showErrorMessage(data.error_message);
        //     }
        // });
    }
}
</script>

<style lang="scss">
.grid-container {
    width: 80%;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: auto;
    margin-right: auto;
    padding: 3rem;
    border: 3px solid black;
    border-radius: 1rem;
    background-color: #247022;
    display:grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr), 2fr, 1fr, 4fr, 4fr, 1fr;
    grid-template-areas: "up-arrow subreddit nickname creation-date"
                        "ac as title xd"
                        "counter content content content"
                        "error content content content"
                        "bottom-arrow content content content"
                        "image image video video"
                        "image image video video"
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
    display:flex;
    justify-content: center;
    align-items: center;
}

.grid-container > #nickname {
    grid-area: nickname;
    text-align: center;
    display:flex;
    justify-content: center;
    align-items: center;
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

.grid-container > #image {
    grid-area: image;
    display:flex;
    justify-content: center;
    align-items: center;
}

.grid-container > #video {
    grid-area: video;
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
