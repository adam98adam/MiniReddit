<template>
    <div class="sub">
        <div id="name"><h1 style="color:whitesmoke;">{{this.name}}</h1></div>
        <div id="hr"><hr></div>
        <div id="description"><a style="color:whitesmoke;">{{this.description}}</a></div>
        <div id="change" v-if="isModerator()">
            <button @click="expand" class="btn"><a style="color:whitesmoke;">{{addChangeText}}</a></button>
            <div v-if="showChangeSubreddit">
                <ChangeSubreddit :id="this.id"/>
            </div>
        </div>
        <button @click="goToSubreddit()" id="button" type="button" class="btn"><a style="color:whitesmoke;">See more content</a></button>
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

<style lang="scss">
.sub {
    width: 60%;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: auto;
    margin-right: auto;
    padding: 3rem;
    border: 3px solid black;
    border-radius: 1rem;
    background-color: #247022;
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-template-areas:"name name name"
                        "hr hr hr"
                        "description description description"
                        "cc change cd"
                        "ab button bc";
}

.sub > #name {
    grid-area: name;
    text-align: center;
    display:flex;
    justify-content: center;
    align-items: center;
}

.sub > #hr {
    grid-area: hr;
    text-align: center;
}

.sub > #description {
    grid-area: description;
    text-align: center;
    display:flex;
    justify-content: center;
    align-items: center;
}

.sub > #button {
    grid-area: button;
    text-align: center;
    display:flex;
    justify-content: center;
    align-items: center;
}

.sub > #change {
    grid-area: change;
    text-align: center;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

hr {
    background-color: #4f17b0;
}
</style>
