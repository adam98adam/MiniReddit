<template>
    <div class="main container">
        <div>
            <label for="login">Login : </label>
            <input type="text" id="login" name="login" v-model="login"> 
        </div>
        &nbsp;
        <div>
            <label for="password">Password : </label>
            <input type="password" id="password" name="password" v-model="password"> 
        </div>
        <div class="error" v-if="this.error">
            Wrong credentials
        </div>
        &nbsp;
        <div>   
        <button type="button" class="btn btn-success" @click="log()">Log in</button>
        </div>
    </div>
</template>

<script>
//import socket from '../socketConnection'
import axios from '../services/axios'



export default {
  name: 'Login',
  data() {
    {
      return {
        login:"",
        password:"",
        port:3000,
        error: null


      }
    
    } 
  },
  components: {
  
  },
  methods: {
      log: async function() {
          await axios.post("/auth/login", {
              username: this.login, 
              password: this.password
          }).then((res) => {
              console.log(res);
              this.$router.push("/");
              //document.cookie = "isLogged=true"
              //sessionStorage.setItem("isLogged", "true")
              localStorage.setItem("isLogged", "true")   
          }).catch((error) => {
              console.log(error)
              this.error = true;
          })
      }
    //async getAll() {
    //    socket.emit('getData')
   // },
  //  async dis() {
   //     socket.disconnect();
    //}
  },
  computed: {

  },
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

<style>
.main {
    margin: auto;
    width: 30%;
    border: 5px solid green;
    padding: 10px;
}
.error {
    color: red;
    text-align: center;
}


</style>