import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import { authRoutes } from './auth';
import Index from '../views/home/Index.vue';
import AppLayout from '../components/layout/AppLayout.vue';

const routes: RouteRecordRaw[] = [
    ... authRoutes,
    {
        path: '/',
        name: 'home',
        component: Index,
    },
    {
        path: '/dashboard',
        component: AppLayout,
        children: [
        { 
            path: '', 
            name: 'dashboard', 
            component: () => import('../views/dashboard/Dashboard.vue') },
        { 
            path: 'projects', 
            name: 'projects', 
            component: () => import('../views/projects/Projects.vue') },
        { 
            path: 'projects/:id',
            name: 'project-detail', 
            component: () => import('../views/projects/ProjectDetail.vue'),
            props: true
        },
        { 
            path: 'tasks', 
            name: 'tasks', 
            component: () => import('../views/tasks/Tasks.vue') 
        }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router