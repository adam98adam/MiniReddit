<template>

    <div class="container">
        <form>
            <div class="form-group">
                <h2>Register</h2>
            </div>
            <div class="form-group">
                <label  for="nickname">Nickname</label><br>
                <input  v-model="nickname" id="nickname" type="text" class="form-control">
            </div>
            <div class="form-group">
                <label  for="email">Email</label><br>
                <input v-model="email" id="email" type="email" class="form-control">
            </div>
            <div class="form-group">
                <label  for="password">Password</label><br>
                <input v-model="password1" id="password" type="password" class="form-control">
            </div>
            <div class="form-group">
                <label  for="signupPassword">Confirm Password</label><br>
                <input v-model="password2" id="signupPassword" type="password" class="form-control">
            </div>
            <div class="form-group">
                <button @click="register()" id="signupSubmit" type="button" class="btn btn-info">Register</button>
            </div>
            <HomeButton/>
                <div id="error-message" v-if="errorMessage.isVisible" >
                {{ errorMessage.content }}
            </div> 
            <hr>
            <p>Already have an account? <button @click="$router.push('/login')" id="button" type="button"  class="btn btn-danger">Sign in</button></p>
        </form>
	</div>
</template>

<script>
import HomeButton from '../components/HomeButton.vue'
import axios from '../services/axios'

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
            content:""
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
        await axios.post("/user", {
            Nickname: this.nickname, 
            Password: this.password1,
            ConfirmPassword: this.password2,
            Email: this.email
        }).then((res) => {
            console.log(res);
            this.$router.push("/login");
            //document.cookie = "isLogged=true"
            //sessionStorage.setItem("isLogged", "true")
            //localStorage.setItem("isLogged", "true")   
        }).catch((error) => {
            //console.log(error.response.data)
            this.showErrorMessage(error.response.data)
        }) 
      }
    }
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
