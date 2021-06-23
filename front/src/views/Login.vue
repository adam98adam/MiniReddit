<template>
    <div class="container">
        <form>
            <div class="form-group">
                <h2>Login</h2>
            </div>
            <div class="form-group">
                <label  for="nickname">Nickname</label><br>
                <input  v-model="nickname" id="nickname" type="text" class="form-control">
            </div>
            <div class="form-group">
                <label  for="password">Password</label><br>
                <input v-model="password" id="password" type="password" class="form-control">
            </div>
            <div class="form-group">
            <button @click="login()" id="signupSubmit" class="btn btn-info">Log in</button>
            </div>
            <HomeButton/>
            <div id="error-message" v-if="errorMessage.isVisible" >
                {{ errorMessage.content }}
            </div> 
            <hr>
            <p>Don't have an account? <button @click="$router.push('/register')" id="button" type="button"  class="btn btn-danger">Register</button></p>
        </form>
	</div>
</template>

<script>
import HomeButton from '../components/HomeButton.vue'
import axios from '../services/axios'
import ngrok from '../ngrok'

export default {
    name: 'Login',
    data() {
        {
            return {
                nickname: "",
                password: "",
                errorMessage: {
                    isVisible: false,
                    content: "",
                },
            }
        }
    },
    components: {
        HomeButton
    },
    methods: {
        showErrorMessage(message) {
            this.errorMessage.content = message;
            this.errorMessage.isVisible = true;
            setTimeout(() => {
                this.errorMessage.isVisible = false;
            }, 6000);
        },
        login() {
            axios.post(`${ngrok}/auth/login`, {
                username: this.nickname, 
                password: this.password,
            }).then(async (res) => {
                console.log(res);
                sessionStorage.setItem("nickname", this.nickname);
                sessionStorage.setItem("isLogged","true");
                await axios.get(`${ngrok}/user/isModerator/nickname=${this.nickname}`)
                .then((data) => {
                    console.log(data);
                    sessionStorage.setItem("isModerator","true");
                }).catch((error) => console.log(error))
                console.log("LOGIN");
                this.$router.push("/");
            }).catch((error) => {
                console.log(error);
                this.showErrorMessage("Wrong Credentials");
            });
        },
        //async getAll() {
        //    socket.emit('getData')
        //},
        //async dis() {
        // socket.disconnect();
        //}
    },
    computed: {},
    /*
    created(){ 
        this.getAll();
            socket.on('getData',async (posts) => {
                console.log(posts.rows)
                this.posts = posts.rows
                this.posts.sort((a,b)=>a.id-b.id)
                this.posts = this.posts.filter(x => x.checked === false)
                console.log(this.posts)
            })
        }
    }
    */
}
</script>

<style scoped lang="scss">
form {
	margin: 0px 10px;
}
h2 {
	color: rgb(241, 8, 66);
	margin-top: 2px;
	margin-bottom: 2px;
}
.container {
	background-color: greenyellow;
	border: 3px solid black;
    margin-top: 20px;
	max-width: 400px;
}
.divider {
	text-align: center;
	margin-top: 20px;
	margin-bottom: 5px;
	hr {
		margin: 7px 0px;
		width: 35%;
	}
}
.left {
	float: left;
}
.right {
	float: right;
}
#error-message {
	text-align: center;
	color: red;
	margin-top: 12px;
}
</style>
