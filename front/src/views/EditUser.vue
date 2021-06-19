<template>
    <div class="container">
		<form>
			<div class="form-group">
				<h2>Change Password</h2>
			</div>
			<div class="form-group">
				<label  for="nickname">Old Password</label><br>
				<input  v-model="oldPassword" id="oldPassword" type="password" class="form-control">
			</div>
			<div class="form-group">
          <label  for="newPassword">New Password</label><br>
          <input v-model="newPassword" id="newPassword" type="password" class="form-control">
			</div>
      <div class="form-group">
          <label  for="confirmPassword">Confirm Password</label><br>
          <input v-model="confirmPassword" id="confrimPassword" type="password" class="form-control">
			</div>
      <div class="form-group">
        <button @click="changePassword()" id="changePassword" class="btn btn-info">Change Password</button>
      </div>
      <HomeButton/>
      <div id="error-message" v-if="errorMessage.isVisible" >
        {{ errorMessage.content }}
      </div> 
		</form>
	</div>
</template>

<script>
import HomeButton from '../components/HomeButton.vue'
import axios from '../services/axios'

export default {
  name: 'EditUser',
  data() {
    {
      return {
        oldPassword:"",
        newPassword:"",
        confirmPassword:"",
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
    async changePassword() {
      await axios.put("/user", {
          OldPassword: this.oldPassword,
          NewPassword: this.newPassword,
          ConfirmPassword:this.confirmPassword
      }).then((res) => {
          console.log(res);
          this.$router.push("/");
          //document.cookie = "isLogged=true"
          //sessionStorage.setItem("isLogged", "true")
          //localStorage.setItem("isLogged", "true")   
      }).catch((error) => {
          console.log(error)
          this.showErrorMessage(error.response.data)
      })
    }
    //async getAll() {
    //    socket.emit('getData')
   // },
  //  async dis() {
   //     socket.disconnect();
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
