<template>
    <div>
        <div>All Subreddits</div>
        <button @click="getBack()" type="button" class="btn btn-secondary">Back</button>
        <div class="subreddits">
            <AllSubreddits v-for="subreddit in subreddits" :key="subreddit.id" :id="subreddit.id" :name="subreddit.name" :description="subreddit.description"/>
        </div>
    </div>
</template>


<script>
import AllSubreddits from '../components/AllSubreddits.vue'
import axios from 'axios';
    export default {
        name: 'Subreddits',
        components:{
            AllSubreddits
        },
        data() {
            {
                return {
                    subreddits:[],
                    errorMessage: {
                        isVisible: false,
                        content:""
                    }
                }
            }
        },
        methods: {
            showErrorMessage(message) {
                this.errorMessage.content = message;
                this.errorMessage.isVisible = true;
                setTimeout(() => {
                    this.errorMessage.isVisible = false;
                }, 6000);
            },
             getBack() {
                this.$router.push("/");
            },
        },
        async created() {
            const subreddits = await axios.get(`http://localhost:3000/subreddit/`)
            this.subreddits = subreddits.data
           
        }  
    }
    
</script>
<style>



</style>
