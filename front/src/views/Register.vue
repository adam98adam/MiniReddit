<template>
    <div class="register">
        <h2>Register</h2>
        <div class="inside-register">
            <form class="container">
                    <table>
                        <tr>
                            <td>
                                <label  for="nickname">Nickname:</label>
                            </td>
                            <td>
                                <input v-model="nickname" type="text" id="nickname" name="nickname">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label  for="email">Email:</label>
                            </td>
                            <td>
                                <input v-model="email" type="text" id="email" name="email">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="password">Password:</label>
                            </td>
                            <td>
                                <input v-model="password1" type="password"  id="password" name="password">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="password">Confirm Password:</label>
                            </td>
                            <td>
                                <input v-model="password2" type="password"  id="password" name="password">
                            </td>
                        </tr>
                    </table>
                <button type="button" class="btn btn-primary" @click="register()">Register</button>
            </form>
        </div>
        <div v-if="errorMessage.isVisible">
        {{ errorMessage.content }}
      </div>     
    </div>    
</template>

<script>
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
  
  methods: {
      isNicknameValid(nickname) {
          //eslint-disable-next-line
          const nicknameRegex = /^[A-Za-z][a-z]{3,15}$/
          return nickname.match(nicknameRegex) !== null
      },
      isEmailValid(str) {
          //eslint-disable-next-line
          const emailRegex = /^[^@]+@[^@]+\.[^@]+$/
          return str.match(emailRegex) !== null
      },
      isPasswordValid(password1,password2) {
        //eslint-disable-next-line  
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})$/
        return  password1.match(passwordRegex) && (password1 === password2)
      },
      showErrorMessage(message) {
        this.errorMessage.content = message;
        this.errorMessage.isVisible = true;
        setTimeout(() => {
            this.errorMessage.isVisible = false;
        }, 6000);
      },
      async register() {
          if(this.isNicknameValid(this.nickname)) {
            if(this.isEmailValid(this.email)) {
                if(this.isPasswordValid(this.password1,this.password2)) {
                    await axios.post("/user", {
                        Nickname: this.nickname, 
                        Password: this.password1,
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
                } else {
                    this.showErrorMessage("Invalid Password")
                }
            }else {
                this.showErrorMessage("Invalid Email")
            }
        } else {
            this.showErrorMessage("Invalid Nickname")
            }
    }
  }
}

</script>


<style>
.register {
    width: 30%;
    height: 60%;
    margin: auto;
    background-color: aquamarine;
    border:3px solid black;
}
.inside-register {


}
.label{
    
}
</style>
