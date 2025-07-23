import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import { authRoutes } from './auth';

const routes: RouteRecordRaw[] = [
    ... authRoutes,
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home/Index.vue'),
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router