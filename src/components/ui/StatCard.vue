<script setup lang="ts">
interface Props {
    label: string
    value: string
    icon: string
    gradient: string
}

defineProps<Props>()
</script>

<template>
    <div class="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
        <!-- Background gradient on hover -->
        <div :class="['absolute inset-0 bg-gradient-to-r', gradient, 'rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300']"></div>
        
        <div class="relative flex items-center justify-between">
            <div class="flex-1">
                <div class="text-3xl font-bold text-gray-900 mb-1">{{ value }}</div>
                <div class="text-sm font-medium text-gray-600">{{ label }}</div>
            </div>
            <div :class="['w-12 h-12 bg-gradient-to-r', gradient, 'rounded-xl flex items-center justify-center text-white text-xl shadow-lg']">
                {{ icon }}
            </div>
        </div>
        
        <!-- Animated progress bar -->
        <div class="mt-4">
            <div class="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div :class="['h-full bg-gradient-to-r', gradient, 'rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out']"></div>
            </div>
        </div>
    </div>
</template>