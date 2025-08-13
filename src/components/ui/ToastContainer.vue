<script setup lang="ts">
import { ref } from 'vue'
import Toast from './Toast.vue'

export interface ToastItem {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title?: string
    message: string
    duration?: number
    closable?: boolean
}

const toasts = ref<ToastItem[]>([])

const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = Date.now().toString()
    toasts.value.push({
        id,
        ...toast
    })
    return id
}

const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
        toasts.value.splice(index, 1)
    }
}

const clearAll = () => {
    toasts.value = []
}

// Export methods untuk digunakan dari parent
defineExpose({
    addToast,
    removeToast,
    clearAll
})
</script>

<template>
    <div aria-live="assertive"
        class="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
        <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
            <Toast v-for="toast in toasts" :key="toast.id" :show="true" :type="toast.type" :title="toast.title"
                :message="toast.message" :duration="toast.duration" :closable="toast.closable"
                @close="removeToast(toast.id)" />
        </div>
    </div>
</template>