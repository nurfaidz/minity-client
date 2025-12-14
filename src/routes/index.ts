import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { authRoutes } from './auth';
import { useAuth } from '../composables/auth/useAuth'; 
import { authService } from '../services/authService'; 

import AppLayout from '../components/layout/AppLayout.vue';
import Index from '../views/home/Index.vue';

const routes: RouteRecordRaw[] = [
    ...authRoutes,
    {
        path: '/',
        name: 'home',
        component: Index,
    },
    {
        path: '/dashboard',
        component: AppLayout,
        meta: { requiresAuth: true }, 
        children: [
            { 
                path: '', 
                name: 'dashboard', 
                component: () => import('../views/dashboard/Dashboard.vue') 
            },
            { 
                path: 'projects', 
                name: 'projects', 
                component: () => import('../views/projects/Projects.vue') 
            },
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
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const { user } = useAuth(); 
    
    const checkUserSession = async () => {
        if (user.value) return true;
        try {
            const userData = await authService.getUser(); 
            user.value = userData; 
            return true;
        } catch (error) {
            return false; 
        }
    };

    if (to.meta.requiresAuth) {
        const isValid = await checkUserSession();
        if (!isValid) {
            return next({ name: 'login' });
        }
    }

    if (to.meta.guest) {
        const isValid = await checkUserSession();
        if (isValid) {
            return next({ name: 'dashboard' });
        }
    }

    next();
});

export default router