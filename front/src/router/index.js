import {createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AddPost from '../views/AddPost.vue'
import ListPost from '../views/ListPost.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register'
import EditUser from '../views/EditUser'
import Subreddits from '../views/Subreddits.vue'
import Subreddit from '../views/Subreddit.vue'
import SinglePost from '../views/SinglePost.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/editUser',
        name: 'EditUser',
        component: EditUser,
    },
    {
        path: '/subreddits',
        name: 'Subreddits',
        component: Subreddits
    },
    {
        path: '/new',
        name: 'AddPost',
        component: AddPost,
    },
    {
        path: '/list',
        name: 'ListPost',
        component: ListPost,
    },
    {
        path: '/subreddits',
        name: 'Subreddits',
        component: Subreddits,
    },
    {
        path: '/r/:name',
        name: 'Subreddit',
        component: Subreddit,
    },
    {
        path: '/r/:name/:id',
        name: 'SinglePost',
        component: SinglePost,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router