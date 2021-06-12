<template>
    <div class="block">
            <p>Id : {{ id }}   Content :  {{content}}  
            <label> Done : </label>         
            <input type="checkbox" :checked="this.checked" @input="this.checkedLocal = !this.checkedLocal"> 
            <button v-if="this.editable && isLogged()" @click="$emit('editPost',getData())">Edit</button>
            <button v-if="this.editable && isLogged()" @click="$emit('deletePost',getId())">Delete</button>
            </p>    
    </div>
</template>


<script>
    export default {
        name: 'PostRouter',
        props:['id','content','checked','editable'],
        data() {
            {
                return {
                    checkedLocal: this.checked
                }
            }
        },
        methods: {
            getId() {
                return this.id
            },
            getData() {
                return {"id": this.id,"checked": this.checkedLocal}
            },
            isLogged() {
                return localStorage.getItem("isLogged");
            }
        },

        
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
