<template>
    <div class="container" style="padding:0;">
        <form @submit="onSubmit" class="change-form">
            <div class="change-container">
                <div class="change-form-control">
                    <label  for="changeName"><a style="color:whitesmoke;">Name</a></label><br>
                    <input v-model="changeName" type="text" name="changeName" placeholder="Change name" />
                </div>
                <div class="change-form-control">
                    <label  for="changeDescription"><a style="color:whitesmoke;">Description</a></label><br>
                    <input v-model="changeDescription" type="text" name="changeDescription" placeholder="Change description" />
                </div>
                <input type="submit" value="Confirm" class="btn" />
                <div id="error-message" v-if="errorMessage.isVisible" >
                    {{ errorMessage.content }}
                </div>
            </div>
        </form>
    </div>
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
            const changeSubreddit = {
                id: this.id,
                name: this.changeName,
                description: this.changeDescription,
            }
            socket.emit('changeSubreddit', changeSubreddit);
            this.changeName = '';
            this.changeDescription = '';
        },
    },
}
</script>

<style scoped lang="scss">
.change-container {
    width: 25rem;
    display: flex;
    flex-flow: column;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 2.5rem;
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
}

#error-message {
	text-align: center;
	color: red;
	margin-top: 12px;
}

.container {
	margin-top: 5px;
    margin-bottom: 5px;
    margin-left: auto;
    margin-right: auto;
    padding: 3rem;
    border: 3px solid black;
    border-radius: 1rem;
    background-color: #247022;
	max-width: 450px;
}

input[type=submit] {
    color: whitesmoke;
}
</style>
