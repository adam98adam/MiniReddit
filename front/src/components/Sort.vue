<template>
    <div class="main">
       <button @click="$emit('sortPosts',sortPosts())" type="button" class="btn btn-danger">Sort</button>
    </div>
</template>


<script>
    export default {
        name: 'Sort',
        data() {
            {
                return {
                    sort:false
                    }
  
                }
            },
    
        methods: {
            sortPosts() {
                this.sort = !this.sort
                return this.sort
            }
      
        },
        async created() {

        }

        
    }
    
</script>
<style>
.main{
    margin-top:110px;
}


</style>
