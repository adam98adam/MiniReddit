<template>
    <div class="container">
		<form>
			<div class="form-group">
				<h2>Change Password</h2>
			</div>
			<div class="form-group">
				<label  for="nickname"><a style="color:whitesmoke;">Old Password</a></label><br>
				<input  v-model="oldPassword" id="oldPassword" type="password" class="form-control">
			</div>
			<div class="form-group">
          <label  for="newPassword"><a style="color:whitesmoke;">New Password</a></label><br>
          <input v-model="newPassword" id="newPassword" type="password" class="form-control">
			</div>
      <div class="form-group">
          <label  for="confirmPassword"><a style="color:whitesmoke;">Confirm Password</a></label><br>
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
import ngrok from '../ngrok'

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
      await axios.put(`${ngrok}/user`, {
          OldPassword: this.oldPassword,
          NewPassword: this.newPassword,
          ConfirmPassword:this.confirmPassword,
      }).then((res) => {
          console.log(res);
          this.$router.push("/");
      }).catch((error) => {
          console.log(error)
          this.showErrorMessage(error.response.data)
      })
    },
  },
  computed: {},
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
