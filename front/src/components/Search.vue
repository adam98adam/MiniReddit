<template>
    <div class="search-container">
        <div id="subredditRadio">
            <input @click="this.data.subreddit=true" type="radio" name="search" value="subreddit" checked>
            <label for="subreddit"><a style="color:whitesmoke;"> Subreddit</a></label>
        </div>
        <div id="contentRadio">
            <input @click="this.data.subreddit=false" type="radio" name="search" value="content">
            <label for="content"><a style="color:whitesmoke;"> Content</a></label>
        </div>
        <div id="searchContent">
            <input v-model="this.data.content" type="text">
        </div>
        <div id="searchButton">
            <button @click="$emit('searchPosts',this.data)" id="innerSearchButton" class="btn btn-danger"><a style="color:whitesmoke;"> Search </a></button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Search',
    data() {
        {
            return {
                data: {
                    subreddit: true,
                    content: ''
                }
            }
        }
    },
}
</script>

<style lang="scss">
.btn {
    background-color: #121212;
}

#innerSearchButton {
    margin-right: auto;
    margin-left: auto;
}

.search-container {
    margin-top: 3rem;
    margin-right: auto;
    margin-left: auto;
    padding: 3rem;
    border: 3px solid black;
    border-radius: 1rem;
    background-color: #121212;
    width: fit-content;
    display:grid;
    grid-template-columns: 1fr, 1fr;
    grid-template-rows: 1fr, 1fr, 1fr;
    grid-template-areas:"subredditRadio contentRadio"
                        "searchContent searchContent"
                        "searchButton searchButton"
}

.search-container > #subredditRadio {
    grid-area: subredditRadio;
    text-align: center;
}

.search-container > #contentRadio {
    grid-area: contentRadio;
    text-align: center;
}

.search-container > #searchContent {
    grid-area: searchContent;
    text-align: center;
}

.search-container > #searchButton {
    grid-area: searchButton;
    text-align: center;
    display:flex;
    justify-content: center;
    margin-top: 1.5rem;
}
</style>
