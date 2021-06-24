<template>
    <div class="container" style="padding:0; min-width:fit-content; width:50%; margin:auto;">
        <form @submit="onSubmit" class="add-form" style="margin:auto; width:fit-content;">
            <div class="form-control" style="background-color: #247022; border:none;">
                <label for="subName" style="background-color: #247022; border:none;"><a style="color:whitesmoke;">Subreddit name</a></label><br>
                <input type="text" v-model="subName" name="subName" placeholder="Add name" />
            </div>
            <div class="form-control" style="background-color: #247022; border:none;">
                <label for="subDescription" style="background-color: #247022; border:none;"><a style="color:whitesmoke;">Description</a></label><br>
                <input type="text" v-model="subDescription" name="subDescription" placeholder="Add description" />
            </div>
            <input type="submit" value="Confirm" class="btn" style="margin-top:4.5rem; margin-bottom:1.5rem;"/>
            <div id="error-message" v-if="errorMessage.isVisible" >
                {{ errorMessage.content }}
            </div>
        </form>
    </div>
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
                this.showErrorMessage('Please add subreddit name');
                //alert('Please add subreddit name');
                return
            }

            if (!this.subDescription) {
                this.showErrorMessage('Please add subreddit description');
                //alert('Please add subreddit description');
                return
            }

            let isRepeated = false;
            this.subreddits.forEach(el => {
                if (el.name === this.subName) {
                    isRepeated = true;
                    return
                }
            });

            if (isRepeated === true) {
                this.showErrorMessage('Subreddit already exists');
                //alert('Subreddit already exists');
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
}

#error-message {
	text-align: center;
	color: red;
	margin-top: 12px;
}

input[type=submit] {
    color: whitesmoke;
}
</style>
