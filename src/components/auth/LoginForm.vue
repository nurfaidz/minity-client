<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuth } from '../../composables/auth/useAuth';
import InputField from '../ui/InputField.vue';
import Button from '../ui/Button.vue';

const { login, loading, error } = useAuth();

const showPassword = ref(false);
const rememberMe = ref(false);

const formData = reactive({
    username: '', 
    password: ''
});

const validationError = ref('');

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
}

const handleSubmit = async () => {
    validationError.value = '';
    
    if (!formData.username || !formData.password) {
        validationError.value = 'Username and Password are required.';
        return;
    }
    
    if (formData.password.length < 6) {
        validationError.value = 'Password must be at least 6 characters.';
        return;
    }

    await login(formData); 
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <div v-if="error || validationError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm flex items-start">
            <svg class="w-5 h-5 mr-2 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{{ error || validationError }}</span>
        </div>

        <InputField 
            v-model="formData.username" 
            type="text" 
            label="Username" 
            placeholder="Enter your username"
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
            <label class="flex items-center cursor-pointer">
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
            :loading="loading" 
            :disabled="loading" 
            class="w-full"
        >
            {{ loading ? 'Signing in...' : 'Sign In' }}
        </Button>
    </form>
</template>