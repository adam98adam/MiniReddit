<template>
    <div class="block">
            <p>Id : {{ id }}   Content :  {{content}} SubredditName : {{this.subreddit_name}} Nickname : {{this.nickname}} </p> 
    </div>
</template>


<script>
import axios from '../services/axios'
    export default {
        name: 'PostRouter',
        props:['id','content','image_path','video_url','subreddit_id','user_id'],
        data() {
            {
                return {
                    subreddit_name:'',
                    nickname:''
                }
            }
        },
        methods: {
            getId() {
                return this.id
            },
        },
        async created() {
            const subreddit = await axios.get(`http://localhost:3000/subreddit/id=${this.subreddit_id}`)
            const user = await axios.get(`http://localhost:3000/user/id=${this.user_id}`)
            console.log(subreddit.data)
            console.log(user.data)
            this.subreddit_name = subreddit.data.name
            this.nickname = user.data.nickname
        }

        
    }
    
</script>
<style>

.block {
margin-top: 5px;
margin-bottom: 5px;
margin-left: 300px;
margin-right: 300px;
border: 3px solid green;
background-color: greenyellow;
}
</style>
