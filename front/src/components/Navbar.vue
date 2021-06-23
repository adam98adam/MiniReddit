<template>
     <nav>
        <ul class="nav-list">
            <li @click="miniReddit()" class="nav-item"><a class="color">Mini Reddit</a></li>
            <li v-if="showItem()" class="nav-item" id="nickname"><a class="color">Welcome : {{ showNickname()}} </a></li>
            <li @click="allSubreddits()" class="nav-item"><a class="color">Subreddits</a></li>
            <li v-if="showItem()"  @click="editUser()" class="nav-item"><a class="color">Edit User</a></li>
            <li v-if="!showItem()" @click="register()" class="nav-item"><a class="color"> Register</a></li>
            <li v-if="!showItem()" @click="login()" class="nav-item"><a class="color">Login</a></li>
            <li v-if="showItem()" @click="logout()" class="nav-item"><a class="color">Logout</a></li>
        </ul>
    </nav>
</template>

<script>
import axios from '../services/axios'
import ngrok from '../ngrok'

export default {
  name: 'Navbar',
  data() {
    {
      return {
     
      }
    } 
  },
  methods: {
      miniReddit(){
          this.$router.push("/");
      },
      allSubreddits() {
          this.$router.push("/subreddits");
      },
      editUser() {
          this.$router.push("/editUser");
      },
      register() {
          this.$router.push("/register");
      },
      login() {
          this.$router.push("/login");
      },
      async logout() {
           await axios.post(`${ngrok}/auth/logout`)
           .then((data) => console.log(data))
           .catch((err) => console.log(err));
           sessionStorage.removeItem("nickname");
           sessionStorage.removeItem("isLogged");
           sessionStorage.removeItem("isModerator");
           this.$router.go(0);
      },
      showItem() {
          return sessionStorage.getItem("isLogged");
          //return localStorage.getItem("isLogged");
      },
      showNickname() {
          if(sessionStorage.getItem("nickname") !== null)
            return sessionStorage.getItem("nickname")
          //if(localStorage.getItem("nickname") !== null)
            //return localStorage.getItem("nickname")
      }
  },
}
</script>

<style scoped lang="scss">
ul.nav-list {
	background-color: rgba(27, 25, 25, 1);
	box-shadow: 2px 2px 2px 1px rgb(243, 10, 2);
	margin: 0px;
	top: 0px;
	width: 100%;
	padding: 1rem 0;
	position: fixed;
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

 li.nav-item {
	list-style: none;
	margin-right: 2rem;
	&:first-child {
		margin-right: auto;
		margin-left: 2rem;
	}
}

li.nav-item#nickname {
    margin-right: auto;
    margin-left: 10.0rem;
}

a {
    text-decoration: none;
    color: red;
}

a:hover {
  color:whitesmoke;
  text-decoration: none;
}
</style>
