import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/authService'

const user = ref<any>(null)
const isCheckingAuth = ref(false)

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
            } else {
                error.value = res.message || 'Login failed'
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
        } catch (err) {
            console.error("Logout Error:", err)
        } finally {
            user.value = null
            router.push({ name: 'login' })
        }
    }

    const checkAuth = async () => {
        if (isCheckingAuth.value) {
            return user.value !== null
        }

        if (user.value) {
            return true
        }

        isCheckingAuth.value = true
        try {
            const userData = await authService.getUser()
            user.value = userData
            return true
        } catch (err) {
            console.error("Auth check failed:", err)
            user.value = null
            return false
        } finally {
            isCheckingAuth.value = false
        }
    }

    return { user, loading, error, isCheckingAuth, login, logout, checkAuth }
}