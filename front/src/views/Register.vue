<template>
    <div class="container">
        <form>
            <div class="form-group">
                <h2>Register</h2>
            </div>
            <div class="form-group">
                <label  for="nickname"><a style="color:whitesmoke;">Nickname</a></label><br>
                <input  v-model="nickname" id="nickname" type="text" class="form-control">
            </div>
            <div class="form-group">
                <label  for="email"><a style="color:whitesmoke;">Email</a></label><br>
                <input v-model="email" id="email" type="email" class="form-control">
            </div>
            <div class="form-group">
                <label  for="password"><a style="color:whitesmoke;">Password</a></label><br>
                <input v-model="password1" id="password" type="password" class="form-control">
            </div>
            <div class="form-group">
                <label  for="signupPassword"><a style="color:whitesmoke;">Confirm Password</a></label><br>
                <input v-model="password2" id="signupPassword" type="password" class="form-control">
            </div>
            <div class="form-group">
                <button @click="register()" id="signupSubmit" type="button" class="btn btn-info"><a style="color:whitesmoke;">Register</a></button>
            </div>
            <HomeButton/>
                <div id="error-message" v-if="errorMessage.isVisible" >
                {{ errorMessage.content }}
            </div> 
            <hr>
            <a style="color:whitesmoke;">Already have an account? <button @click="$router.push('/login')" id="button" type="button"  class="btn btn-danger">Sign In</button></a>
        </form>
	</div>
</template>

<script>
import HomeButton from '../components/HomeButton.vue'
import axios from '../services/axios'
import ngrok from '../ngrok'

export default {
    name: 'Register',
    data() {
        {
            return {
                nickname: "",
                password1: "",
                password2: "",
                email: "",
                errorMessage: {
                    isVisible: false,
                    content: "",
                }
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
        async register() {
            await axios.post(`${ngrok}/user`, {
                Nickname: this.nickname, 
                Password: this.password1,
                ConfirmPassword: this.password2,
                Email: this.email,
            }).then((res) => {
                console.log(res);
                this.$router.push("/login");  
            }).catch((error) => {
                this.showErrorMessage(error.response.data);
            });
        },
    },
}
</script>

<style lang="scss">
form {
	margin: 0px 10px;
}

h2 {
	color: whitesmoke;
	margin-top: 2px;
	margin-bottom: 2px;
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
