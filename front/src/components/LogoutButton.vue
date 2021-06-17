<template>
    <div>
        <button v-if="isLogged()" @click="logout()" >Log out</button> 
    </div>
</template>

<script>
import axios from '../services/axios'

export default {
  name: 'LogoutButton',
  data() {
    {
      return {
     
      }
    } 
  },
  methods: {
    isLogged() {
      return localStorage.getItem("isLogged");
    },
    async logout() {
      //sessionStorage.removeItem("isLogged")
      localStorage.removeItem("isLogged");
      //document.cookie="isLogged=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      await axios.post("/auth/logout",{},{ withCredentials: true});
      await this.$router.push("/");
    }
  },
}
      
</script>

