import axios, { type AxiosInstance } from 'axios'
import router from '../routes'

const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true 
})

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const requestUrl = error.config?.url || '';
        const isAuthCheck = requestUrl.includes('/me'); 

        if (error.response && error.response.status === 401 && !isAuthCheck) {
            const { useAuth } = await import('../composables/auth/useAuth');
            const { user } = useAuth();
            
            user.value = null;
            
            if (router.currentRoute.value.name !== 'login') {
                router.push({ 
                    name: 'login',
                    query: { redirect: router.currentRoute.value.fullPath }
                });
            }
        }
        
        return Promise.reject(error)
    }
)

export default apiClient