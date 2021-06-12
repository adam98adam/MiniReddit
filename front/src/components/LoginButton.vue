<template>
    <div>
        <button  v-if="!this.logged" @click="$router.push('/login')">Log in</button>
    </div>
</template>

<script>

export default {
  name: 'LoginButton',
  props: ['logged'],
  data() {
    {
      return {
     
      }
    } 
  },
  methods: {
    isLogged() {
      return localStorage.getItem("isLogged");
    }
  },
}
      



</script>



