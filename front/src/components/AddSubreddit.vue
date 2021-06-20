<template>
    <form @submit="onSubmit" class="add-form">
        <div class="container">
            <div class="form-control">
                <label>Subreddit name</label>
                <input type="text" v-model="subName" name="subName" placeholder="Add name" />
            </div>
            <div class="form-control">
                <label>Description</label>
                <input type="text" v-model="subDescription" name="subDescription" placeholder="Add description" />
            </div>
            <input type="submit" value="Confirm" class="btn subButton" />
            <div id="error-message" v-if="errorMessage.isVisible" >
                {{ errorMessage.content }}
            </div>
        </div>
    </form>
</template>

<script>
import socket from '../socketConnection'

export default {
    name: 'AddSubreddit',
    props:['subreddits'],
    data() {
        return {
            subName: '',
            subDescription: '',
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
            if (!this.subName) {
                this.showErrorMessage('Please add subreddit name')
                //alert('Please add subreddit name')
                return
            }
            if (!this.subDescription) {
                this.showErrorMessage('Please add subreddit description')
                //alert('Please add subreddit description')
                return
            }

            let isRepeated = false
            this.subreddits.forEach(el => {
                if(el.name === this.subName) {
                    isRepeated = true;
                }

            });

            if(isRepeated === true) {
                this.showErrorMessage('Subreddit already exists')
                //alert('Subreddit already exists')
                return
            }



            const newSubreddit = {
                name: this.subName,
                description: this.subDescription,
                nickname: sessionStorage.getItem("nickname"),
                //nickname: localStorage.getItem("nickname"),
            }
            socket.emit('addSubreddit', newSubreddit);
            this.subName = '';
            this.subDescription = '';
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

.subButton {
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
