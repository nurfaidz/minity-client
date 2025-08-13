import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import { authRoutes } from './auth';
import Index from '../views/home/Index.vue';
import Dashboard from '../views/dashboard/Dashboard.vue';

const routes: RouteRecordRaw[] = [
    ... authRoutes,
    {
        path: '/',
        name: 'home',
        component: Index,
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => DashboardPage
            },
            {
                path: 'projects',
                name: 'projects',
                component: () => ProjectPage,
            },
            {
                path: 'tasks',
                name: 'tasks',
                component: () => TaskPage
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router