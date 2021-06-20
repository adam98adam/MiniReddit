<template>
    <div class="main">
       <button @click="$emit('sortPosts',sortPosts())" type="button" class="btn btn-danger">Sort by {{order}}</button>
    </div>
</template>

<script>
export default {
    name: 'Sort',
    data() {
        {
            return {
                sort: false,
                order: "newest",
            }
        }
    },
    methods: {
        sortPosts() {
            this.sort = !this.sort;
            if (this.sort)
                this.order = "oldest";
            else
                this.order = "newest";
            return this.sort;
        }
    },
    async created() {}
}
</script>

<style>
.main{
    margin-top: 2rem;
}
</style>
