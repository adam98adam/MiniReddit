<template>
    <div class="sub">
        <div id="name">{{this.name}}</div>
        <div id="hr"><hr></div>
        <div id="description">{{this.description}}</div>
        <div id="change" v-if="isModerator()">
            <button @click="expand" class="btn btn-dark">{{addChangeText}}</button>
            <div v-if="showChangeSubreddit">
                <ChangeSubreddit :id="this.id"/>
            </div>
        </div>
        <button @click="goToSubreddit()" id="button" type="button" class="btn btn-dark">See more content</button>
    </div>
</template>

<script>
import ChangeSubreddit from '../components/ChangeSubreddit'

export default {
    name: 'SubredditRouter',
    props: ['id', 'name', 'description'],
    data() {
        {
            return {
                showChangeSubreddit: false,
                addChangeText: "Change",
            };
        }
    },
    components: {
        ChangeSubreddit,
    },
    methods: {
        expand() {
            this.showChangeSubreddit = !this.showChangeSubreddit;
            if (this.showChangeSubreddit) {
                this.addChangeText = "Cancel";
            } else {
                this.addChangeText = "Change";
            }
        },
        isModerator() {
            return sessionStorage.getItem("isModerator");
        },
        getId() {
            return this.id;
        },
        goToSubreddit() {
            this.$router.push(`/r/${this.name}`);
        },
    },
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
    grid-template-rows: repeat(4,1fr);
    grid-template-areas:"name name name"
                        "hr hr hr"
                        "description description description"
                        "cc change cd"
                        "ab button bc";
}

.sub > #name {
    grid-area: name;
    text-align: center;
}

.sub > #hr {
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

.sub > #change {
    grid-area: change;
    text-align: center;
}

hr {
    background-color: red;
}
</style>
