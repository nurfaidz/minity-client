import apiClient from './api'

export const authService = {
    async login(credentials: any) {
        const response = await apiClient.post('/login', credentials)
        return response.data
    },

    async logout() {
        await apiClient.post('/logout') 
    },
    
    async getUser() {
        const response = await apiClient.get('/me') 
        return response.data
    }
}