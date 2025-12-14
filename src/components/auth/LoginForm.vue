<script setup lang="ts">
import { ref, reactive } from 'vue';
import InputField from '../ui/InputField.vue';
import Button from '../ui/Button.vue';
import { useAuth } from '../../composables/auth/useAuth';

// Props and Emits
const emit = defineEmits<{
    loginSuccess: [];
}>()

// Composables
const { login, loading, isSubmitting } = useAuth();

// reactive data
const showPassword = ref(false);
const rememberMe = ref(false);

const formData = reactive({
    username: '', 
    password: ''
})

const errors = reactive({
    username: '', 
    password: '',
    general: ''
})

// Methods
const validateForm = (): boolean => {
    errors.username = '';
    errors.password = '';
    errors.general = '';

    let isValid = true;

    if (!formData.username) {
        errors.username = 'Username or email is required';
        isValid = false;
    }

    if (!formData.password) {
        errors.password = 'Password is required';
        isValid = false;
    } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
        isValid = false;
    }

    return isValid;
}

const handleSubmit = async (event: Event) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    try {
        await login(formData);
        emit('loginSuccess');
    } catch (error: any) {
        errors.general = error.message || 'Login failed. Please try again.';
    }
}

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
}
</script>

<template>
    <form @submit="handleSubmit" class="space-y-6">
        <div v-if="errors.general" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
            {{ errors.general }}
        </div>

        <InputField 
            v-model="formData.username" 
            type="text" 
            label="Username" 
            placeholder="Enter your username"
            :error="errors.username" 
            required
        >
            <template #icon>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </template>
        </InputField>

        <InputField 
            label="Password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Enter your password"
            v-model="formData.password" 
            :error="errors.password" 
            required
        >
            <template #icon>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </template>
            <template #suffix>
                <button type="button" @click="togglePasswordVisibility"
                    class="text-gray-400 hover:text-gray-600 focus:outline-none">
                    <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.415 1.415M14.12 14.12L9.878 9.878" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
            </template>
        </InputField>

        <div class="flex items-center justify-between">
            <label class="flex items-center">
                <input type="checkbox" v-model="rememberMe"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2">
                <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <button type="button" class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Forgot password?
            </button>
        </div>

        <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            :loading="loading || isSubmitting" 
            :disabled="loading || isSubmitting" 
            class="w-full"
        >
            {{ (loading || isSubmitting) ? 'Signing in...' : 'Sign In' }}
        </Button>
    </form>
</template>