<template>
    <div class="sub">
        <div id="name">r/{{this.name}}</div>
        <div id="hr"><hr></div>
        <div id="description">{{this.description}}</div>
        <button id="button"  type="button" class="btn btn-dark">Click</button>
    </div>
</template>

<script>
export default {
    name: 'AllSubreddits',
    props:['id','name','description'],
    methods: {
        async created() {}
    }
}
</script>

<style>
.sub {
    box-shadow: 2px 2px 2px red;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 50px;
    margin-right: 50px;
    border: 3px solid black;
    background-color: greenyellow;
    display:grid;
    grid-template-columns: repeat(3,1fr);
    grid-template-rows: repeat(5,1fr);
    grid-template-areas:"name name name"
                        "hr hr hr"
                        "description description description"
                        "description description description"
                        "a button abd"
}

.sub > #name {
    grid-area: name;
    text-align: center;
}

.sub > #hr  {
    grid-area: hr;
    text-align: center;
}

.sub > #description {
    grid-area: description;
    text-align: center;
}

.sub > #button {
    grid-area: button;
    text-align: center;
}
</style>
