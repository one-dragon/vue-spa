

import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: () => import ( /* webpackChunkName: "index" */ '~/pages/index')
    }
];

const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
})

export default router;
