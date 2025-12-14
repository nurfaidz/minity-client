import type { RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
    {
        path: '/auth',
        name: 'auth',
        redirect: { name: 'login' }, 
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import('../views/auth/Login.vue'),
                meta: {
                    title: 'Login',
                    guest: true 
                }
            },
            // {
            //     path: 'signup',
            //     name: 'signup',
            //     component: () => import('../views/auth/Signup.vue'), 
            //     meta: {
            //         title: 'Sign Up',
            //         guest: true
            //     }
            // }
        ]
    }
];