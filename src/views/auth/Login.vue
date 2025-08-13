<script setup lang="ts">
import { useRouter } from 'vue-router';
import LoginForm from '../../components/auth/LoginForm.vue';
import AuthLayout from '../../components/auth/AuthLayout.vue';

const router = useRouter();

const handleLoginSuccess = () => {
    //
};

const goToHome = () => {
    router.push({ name: 'home' });
};

const goToSignup = () => {
    router.push({ name: 'signup' });
};
</script>

<template>
    <AuthLayout>
        <template #header>
            <div class="text-center mb-8">
                <div class="flex justify-center items-center mb-6">
                    <div class="text-3xl font-bold text-blue-600 cursor-pointer" @click="goToHome">
                        Minity
                    </div>
                </div>
                <h2 class="text-3xl font-bold text-gray-900 mb-2">
                    Welcome Back
                </h2>
                <p class="text-gray-600">
                    Sign in to your account to manage your projects.
                </p>
            </div>
        </template>
       
        <LoginForm @login-success="handleLoginSuccess" />
       
        <template #footer>
            <div class="text-center mt-6">
                <p class="text-gray-600">
                    Don't have an account?
                    <button
                        @click="goToSignup"
                        class="text-blue-600 hover:text-blue-700 font-medium ml-1 transition-colors"
                    >
                        Sign up here
                    </button>
                </p>
            </div>
        </template>
    </AuthLayout>
</template>