import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { authRoutes } from './auth';
import { useAuth } from '../composables/auth/useAuth'; 

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

router.beforeEach(async (to, _from, next) => {
    const { checkAuth } = useAuth(); 
    
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isGuestRoute = to.matched.some(record => record.meta.guest);

    if (requiresAuth) {
        const isAuthenticated = await checkAuth();
        
        if (!isAuthenticated) {
            return next({ 
                name: 'login', 
                query: { redirect: to.fullPath } 
            });
        }
    }

    if (isGuestRoute) {
        const isAuthenticated = await checkAuth();
        
        if (isAuthenticated) {
            const redirectPath = to.query.redirect as string || '/dashboard';
            return next(redirectPath);
        }
    }

    next();
});

export default router