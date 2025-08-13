import { ref } from 'vue'
import { useToast } from '../useToast'
import authApi from '../../services/auth'
import Cookies from 'js-cookie'
import router from '../../routes'

export interface Auth {
    username: string
    password: string
}

export const useAuth = () => {
    const { success, error: showError } = useToast()
    const isAuthenticated = ref(false)
    const loading = ref(false)
    const isSubmitting = ref(false)

    const login = async (formData: Auth) => {
        loading.value = true
        isSubmitting.value = true

        try {
            const response = await authApi.login(formData);

            // Set cookies
            Cookies.set('token', response.data.token);
            Cookies.set('user', JSON.stringify(response.data.user));

            isAuthenticated.value = true
            success('Login berhasil! Selamat datang, ' + response.data.user.name);

            if (Cookies.get('token')) {
                setTimeout(() => {
                    router.push({ name: 'dashboard' });
                }, 1500)
            }
        } catch (err: any) {
            console.log('Login error:', err);
            let errorMessage = 'Terjadi kesalahan saat login';

            if (err.response?.status === 401) {
                errorMessage = 'Username atau password salah';
            } else if (err.response?.status === 422) {
                errorMessage = 'Data tidak valid';
            } else if (err.response?.status === 429) {
                errorMessage = 'Terlalu banyak permintaan, silakan coba lagi nanti';
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (!navigator.onLine) {
                errorMessage = 'Tidak ada koneksi internet';
            }

            // Show error toast
            showError(errorMessage, 'Login Error');
            throw new Error(errorMessage);
        } finally {
            loading.value = false
            isSubmitting.value = false
        }
    }

    const logout = async () => {
        try {
            await authApi.logout();
            isAuthenticated.value = false
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout API fails, clear local state
            isAuthenticated.value = false
        }
    }

    return {
        isAuthenticated,
        loading,
        isSubmitting,
        login,
        logout,
    }
}