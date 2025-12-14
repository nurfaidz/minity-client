import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/authService'

const user = ref<any>(null)

export function useAuth() {
    const router = useRouter()
    const loading = ref(false)
    const error = ref('')

    const login = async (formData: any) => {
        loading.value = true
        error.value = ''

        try {
            const res = await authService.login(formData)

            if (res.success) {
                user.value = res.data 
                
                router.push({ name: 'dashboard' })
            }
        } catch (err: any) {
            console.error("Login Error:", err)
            error.value = err.response?.data?.message || 'Login Failed'
        } finally {
            loading.value = false
        }
    }

    const logout = async () => {
        try {
            await authService.logout() 
        } finally {
            user.value = null
            router.push({ name: 'login' })
        }
    }

    return { user, loading, error, login, logout }
}