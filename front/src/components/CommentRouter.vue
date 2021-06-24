<template>
    <div class="comment-container">
        <div id="placeholder"></div>
        <div id="content"><a style="color:whitesmoke;">{{this.content}}</a></div>
        <div id="user_id"><a style="color:whitesmoke;">u/{{this.nickname}} said:</a></div>
        <button @click="deleteComment()" v-if="isOwner() || isModerator()" id="deleteCommentButton" class="btn btn-danger"><a style="color:whitesmoke;">Delete</a></button>
    </div>
</template>

<script>
import socket from '../socketConnection'

export default {
    name: 'CommentRouter',
    props:['id', 'content', 'user_id', 'subreddit_name', 'post_id', 'nickname'],
    data() {
        {
            return {}
        }
    },
    methods: {
        isOwner() {
            console.log("sesja: ", sessionStorage.getItem("nickname"));
            console.log("zapytanie: ", this.nickname);
            if (sessionStorage.getItem("nickname") == this.nickname)
                return true;
            else
                return false;
        },
        deleteComment() {
            socket.emit(
                "deleteComment",
                {
                    id: this.id,
                    post_id: this.post_id,
                }
            );
        },
        isModerator() {
            return sessionStorage.getItem("isModerator");
        },
    },
}
</script>

<style lang="scss">
.comment-container {
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
    grid-template-columns: 1fr, 2fr, 1fr;
    grid-template-rows: 1fr, 1fr;
    grid-template-areas:"user_id placeholder deleteCommentButton"
                        "content content content"
                        "content content content"
}

.comment-container > #user_id {
    grid-area: user_id;
    text-align: center;
}

.comment-container > #deleteCommentButton {
    grid-area: deleteCommentButton;
    text-align: center;
    // background-color: red;
}

.comment-container > #content {
    grid-area: content;
    display:flex;
    justify-content: center;
    align-items: center;
}

.comment-container > #placeholder {
    grid-area: placeholder;
    display:flex;
    justify-content: center;
    align-items: center;
}
</style>
