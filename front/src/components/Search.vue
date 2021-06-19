<template>
    <div class="main">
        <input @click="this.data.subreddit=true" type="radio" id="subreddit" name="search" value="subreddit">
        <label for="subreddit">Subreddit</label>
        <input @click="this.data.subreddit=false" type="radio" id="content" name="search" value="content">
        <label for="content">Content</label>
        <input v-model="this.data.content" type="text" id="conent">
        <div class="button">
            <button @click="$emit('searchPosts',this.data)" id="search" class="btn btn-danger">Search</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Search',
    props:[],
    data() {
        {
            return {
                data:{
                    subreddit: false,
                    content: ''
                }

            }
        }
    },
    methods: {},
    async created() {}
}
</script>

<style>
.main {
    margin-top:90px;
}

.button {

}
</style>
