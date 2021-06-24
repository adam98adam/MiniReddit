<template>
    <form @submit="onSubmit" class="add-form">
        <div class="container">
            <div class="form-control" style="background-color: #247022; border:none; margin-top:0rem;">
                <label><a style="color:whitesmoke;">Content</a></label>
                <input type="text" v-model="content" name="content" placeholder="Add content" />
            </div>
            <input type="submit" value="Confirm" class="btn" style="margin-top:4.5rem; margin-bottom:0rem;"/>
            <div id="error-message" v-if="errorMessage.isVisible" >
                {{ errorMessage.content }}
            </div>
        </div>
    </form>
</template>

<script>
import socket from '../socketConnection'
//import axios from '../services/axios'

export default {
    name: 'AddComment',
    props:['post_id'],
    data() {
        return {
            content: '',
            errorMessage: {
                isVisible: false,
                content:""
            }
        }
    },
    methods: {
        showErrorMessage(message) {
            this.errorMessage.content = message;
            this.errorMessage.isVisible = true;
            setTimeout(() => {
                this.errorMessage.isVisible = false;
            }, 6000);
        },
        async onSubmit(e) {
            e.preventDefault()
            if (!this.content) {
                this.showErrorMessage('Please add text');
                //alert('Please add text')
                return
            }

            const newComment = {
                content: this.content,
                nickname: sessionStorage.getItem("nickname"),
                post_id: this.post_id,
                // name: this.name,
                // nickname: sessionStorage.getItem("nickname")
            }

            // console.log("??????? ", newComment.image_path);
            // const formdata = new FormData()
            // formdata.append("subredditName",newComment.subredditName)
            // formdata.append("title",newComment.title)
            // formdata.append("content",newComment.content)
            // formdata.append("file",newComment.image_path)
            // formdata.append("video_url",newComment.video_url)
            // formdata.append("name",newComment.name)
            
            // await fetch(
            //     "http://localhost:3000/post/",
            //     {
            //         method: "POST",
            //         credentials: "include",
            //         body: formdata,
            //     }
            // );
            
            socket.emit('addComment', newComment);
            this.content = '';
        },
    },
}
</script>

<style scoped>
.container {
    width: 25rem;
    display: flex;
    flex-flow: column;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0rem;
}

.form-control {
    margin-top: 3rem;
    border: none;
}

.form-control label {
    border: none;
}

.form-control input {
    width: 100%;
    height: 3rem;
    padding: 0.5rem 0.5rem;
    /* font-size: 17px; */
}

#error-message {
	text-align: center;
	color: red;
	margin-top: 12px;
}

input[type=submit] {
    color: whitesmoke;
}

input[type=text] {
    color: whitesmoke;
}
</style>
