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

apiClient.interceptors.request.use(config => config)

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (router.currentRoute.value.name !== 'login') {
                router.push({ name: 'login' })
            }
        }
        return Promise.reject(error)
    }
)

export default apiClient