<template>
    <div class="block" v-if="!this.checked">
        <h2>Id : {{ id }}   Content :  {{content}}</h2>
        <label> Done : </label>         
        <input type="checkbox" :checked="this.checkedLocal" @input="this.checkedLocal = !this.checkedLocal"> 
        <button @click="$emit('updatePost',getData())">Edit</button>
        <button @click="$emit('deletePost',getId())">Delete</button>
    </div>
</template>

<script>
export default {
    name: 'Post',
    props:['id','content','checked'],
    data() {
        {
            return {
                post: "",
                checkedLocal: this.checked
            }
        }
    },
    methods: {
        getId() {
            console.log(this.id)
            return this.id
        },
        getData() {
            console.log(this.checkedLocal)
            return {id: this.getId(), checked: this.checkedLocal}
        }
    }
}
</script>

<style>
.block {
    display: flex;
    margin: 6px;
    background-color: lawngreen;
}
</style>
