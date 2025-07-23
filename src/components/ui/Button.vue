<script setup lang="ts">
import { computed } from 'vue';

// Props interface
interface Props {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    block?: boolean;
}

const props = withDefaults(defineProps < Props > (), {
    variant: 'primary',
    size: 'md',
    type: 'button',
    loading: false,
    disabled: false,
    block: false
})

// Computed
const buttonClasses = computed(() => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 disabled:opcity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
        ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm'
    }

    const sizeClasses = {
        sm: 'px-3 py-3 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-5 py-4 text-lg',
    }

    const blockClass = props.block ? 'w-full' : '';

    return `${baseClasses} ${variantClasses[props.variant]} ${sizeClasses[props.size]} ${blockClass}`;
})

const isDisabled = computed(() => {
    return props.disabled || props.loading;
})
</script>

<template>
    <button :type="type" :class="buttonClasses" :disabled="isDisabled">
        <!-- Loading Spinner -->
        <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
        </svg>

        <slot></slot>

    </button>
</template>