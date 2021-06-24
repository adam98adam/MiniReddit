<template>
    <div class="sort">
       <button @click="$emit('sortPosts', sortPosts())" type="button" class="btn"><a style="color:#fae8e8;">Sort by {{order}}</a></button>
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

<style scoped>
.sort {
    margin-top: 2rem;
}

.btn {
    background-color: #121212;
}
</style>
