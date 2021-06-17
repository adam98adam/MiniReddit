<template>
    <div class="block">
            <p>Id: {{ id }} Name: {{ name }} Description: {{ description }}</p> 
    </div>
</template>

<script>
export default {
    name: 'SubredditRouter',
    props: ['id', 'name', 'description'],
    data() {
        {
            return {};
        }
    },
    methods: {
        getId() {
            return this.id;
        },
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
