export const authRoutes = [
    {
        name: 'auth',
        path: '/auth',
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import('../views/auth/Login.vue'),
                meta: {
                    title: 'Login',
                    requiresAuth: false
                }
            }
        ]
    }
];

