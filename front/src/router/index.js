import {createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AddPost from '../views/AddPost.vue'
import ListPost from '../views/ListPost.vue'
import Login from '../views/Login.vue'


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home

    },
    {
        path: '/login',
        name: 'Login',
        component: Login

    },
    {
        path: '/new',
        name: 'AddPost',
        component: AddPost

    },
    {
        path: '/list',
        name: 'ListPost',
        component: ListPost
    }

]


const router = createRouter({
    history: createWebHashHistory(),
    routes
})


export default router