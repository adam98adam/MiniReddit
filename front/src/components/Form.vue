<template>
    <div>
        <label for="post">Post : </label>
        <input v-model="post" type="text" @change="$emit('changePostValue',sendPost())">
        <button @click = "$emit('addPost',sendPost())"> Add post</button>
    </div>
</template>

<script>
    export default {
        name: 'Form',
        data() {
            {
                return {
                    post: ""
                }
            }
        },
        methods: {
            sendPost() {
                return this.post;
            }
        }
    }
</script>
