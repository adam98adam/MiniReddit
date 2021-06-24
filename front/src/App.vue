<template>
    <div>
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        {
            return {
                port:3000,
            }
        }
    },
    components: {},
    methods: {},
}
</script>

<style lang="scss">
html {
    background: rgb(5,55,23);
    background: linear-gradient(90deg, rgba(5,55,23,1) 0%, rgba(6,69,25,1) 50%, rgba(19,140,27,1) 100%);
}

h1 {
    color: whitesmoke;
}

a {
    color: whitesmoke;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0px;
    background: rgb(5,55,23);
    background: linear-gradient(90deg, rgba(5,55,23,1) 0%, rgba(6,69,25,1) 50%, rgba(19,140,27,1) 100%);
}
</style>
