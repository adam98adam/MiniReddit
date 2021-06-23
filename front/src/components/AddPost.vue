<template>
    <form @submit="onSubmit" class="add-form">
        <div class="container">
            <div class="form-control">
                <label>Title</label>
                <input type="text" v-model="title" name="title" placeholder="Add title" />
            </div>
            <div class="form-control">
                <label>Content</label>
                <input type="text" v-model="content" name="content" placeholder="Add content" />
            </div>
            <div class="form-control">
                <label>Image path</label>
                <input type="file" @change="uploadFile($event)" name="image_path" placeholder="Add image path" />
            </div>
            <div class="form-control">
                <label>Video url</label>
                <input type="text" v-model="video_url" name="video_url" placeholder="Add video url" />
            </div>
            <input type="submit" value="Confirm" class="btn postButton" />
            <div id="error-message" v-if="errorMessage.isVisible" >
                {{ errorMessage.content }}
            </div>
        </div>
    </form>
</template>

<script>
 import socket from '../socketConnection'
 import ngrok from '../ngrok'
//import axios from '../services/axios'

export default {
    name: 'AddPost',
    props:['name', 'posts'],
    data() {
        return {
            subredditName: this.$route.params.name,
            title: '',
            content: '',
            image_path: '',
            video_url: '',
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
            if (!this.title) {
                this.showErrorMessage('Please add post title');
                //alert('Please add post title');
                return
            }
            if (!this.content) {
                this.showErrorMessage('Please add post content');
                //alert('Please add post content');
                return
            }

            let isRepeated = false;
            this.posts.forEach(el => {
                if (el.title === this.title) {
                    isRepeated = true;
                    return
                }
            });

            if (isRepeated === true) {
                this.showErrorMessage('Post with this title already exists');
                //alert('Post with this title already exists');
                return
            }

            const newPost = {
                subredditName: this.$route.params.name,
                title: this.title,
                content: this.content,
                image_path: this.image_path,
                video_url: this.video_url,
                name: this.name,
                nickname: sessionStorage.getItem("nickname")
            }

            // console.log("??????? ", newPost.image_path);
            const formdata = new FormData()
            formdata.append("subredditName",newPost.subredditName)
            formdata.append("title",newPost.title)
            formdata.append("content",newPost.content)
            formdata.append("file",newPost.image_path)
            formdata.append("video_url",newPost.video_url)
            formdata.append("name",newPost.name)
            
            await fetch(
                `${ngrok}/post/`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formdata,
                }
            );
            
            socket.emit('addPost',this.subredditName);
            this.title = '';
            this.content = '';
            this.image_path = '';
            this.video_url = '';
        },
        uploadFile(event) {
            this.image_path = event.target.files[0];
            // console.log("BŁAGAM");
            console.log(event.target.files[0]);
            console.log(this.image_path);
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

.postButton {
    margin-top: 4rem;
    margin-left: 1rem;
    margin-right: 1rem;
    background: greenyellow;
}

#error-message {
	text-align: center;
	color: red;
	margin-top: 12px;
}
</style>
