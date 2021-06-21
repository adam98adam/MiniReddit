<template>
    <form @submit="onSubmit" class="change-form">
        <div class="change-container">
            <div class="change-form-control">
                <label>Name</label>
                <input type="text" v-model="changeName" name="changeName" placeholder="Change name" />
            </div>
            <div class="change-form-control">
                <label>Description</label>
                <input type="text" v-model="changeDescription" name="changeDescription" placeholder="Change description" />
            </div>
            <input type="submit" value="Confirm" class="btn changeButton" />
            <div id="error-message" v-if="errorMessage.isVisible" >
                {{ errorMessage.content }}
            </div>
        </div>
    </form>
</template>

<script>
import socket from '../socketConnection'

export default {
    name: 'ChangeSubreddit',
    props:['id'],
    data() {
        return {
            changeName: '',
            changeDescription: '',
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
        onSubmit(e) {
            e.preventDefault()
            
            if (!this.changeName) {
                this.showErrorMessage('Please add subreddit name')
                //alert('Please add subreddit name')
                return
            }

            if (!this.changeDescription) {
                this.showErrorMessage('Please add subreddit description')
                //alert('Please add subreddit description')
                return
            }

            // let isRepeated = false
            // this.subreddits.forEach(el => {
            //     if(el.name === this.changeName) {
            //         isRepeated = true;
            //     }
            // });

            // if (isRepeated === true) {
            //     this.showErrorMessage('Subreddit already exists')
            //     //alert('Subreddit already exists')
            //     return
            // }

            const changeSubreddit = {
                id: this.id,
                name: this.changeName,
                description: this.changeDescription,
                // nickname: sessionStorage.getItem("nickname"),
                //nickname: localStorage.getItem("nickname"),
            }

            socket.emit('changeSubreddit', changeSubreddit);
            this.changeName = '';
            this.changeDescription = '';
        },
    },
}
</script>

<style scoped>
.change-container {
    width: 25rem;
    display: flex;
    flex-flow: column;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0rem;
    margin-top: 0rem;
}

.change-form-control {
    margin-top: 3rem;
    border: none;
}

.change-form-control label {
    border: none;
}

.change-form-control input {
    width: 100%;
    height: 3rem;
    padding: 0.5rem 0.5rem;
    /* font-size: 17px; */
}

.changeButton {
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
