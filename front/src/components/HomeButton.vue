<template>
    <button @click="backToHome()" id="backToHome" type="button" class="btn btn-secondary">Back</button>
</template>

<script>
//DO ZMIANY
export default {
    name: 'HomeButton',
    data() {
        {
            return {}
        }
    },
    methods: {
        backToHome() {
            this.$router.push("/");
        }
    }
}
</script>
