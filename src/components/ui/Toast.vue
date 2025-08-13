<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props {
    show: boolean
    type?: 'success' | 'error' | 'warning' | 'info'
    title?: string
    message: string
    duration?: number
    closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    type: 'info',
    duration: 5000,
    closable: true
})

const emit = defineEmits<{
    close: []
}>()

const isVisible = ref(false)
const timeoutId = ref<number | null>(null)

const typeClasses = {
    success: {
        container: 'bg-green-50 border-green-200',
        icon: 'text-green-400',
        title: 'text-green-800',
        message: 'text-green-700',
        close: 'text-green-500 hover:text-green-600'
    },
    error: {
        container: 'bg-red-50 border-red-200',
        icon: 'text-red-400',
        title: 'text-red-800',
        message: 'text-red-700',
        close: 'text-red-500 hover:text-red-600'
    },
    warning: {
        container: 'bg-yellow-50 border-yellow-200',
        icon: 'text-yellow-400',
        title: 'text-yellow-800',
        message: 'text-yellow-700',
        close: 'text-yellow-500 hover:text-yellow-600'
    },
    info: {
        container: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-400',
        title: 'text-blue-800',
        message: 'text-blue-700',
        close: 'text-blue-500 hover:text-blue-600'
    }
}

const currentClasses = typeClasses[props.type]

const icons = {
    success: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>`,
    error: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>`,
    warning: `<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>`,
    info: `<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>`
}

const closeToast = () => {
    isVisible.value = false
    if (timeoutId.value) {
        clearTimeout(timeoutId.value)
    }
    setTimeout(() => emit('close'), 300) 
}

const startTimer = () => {
    if (props.duration > 0) {
        timeoutId.value = setTimeout(() => {
            closeToast()
        }, props.duration)
    }
}

watch(() => props.show, (newVal) => {
    if (newVal) {
        isVisible.value = true
        startTimer()
    } else {
        isVisible.value = false
    }
})

onMounted(() => {
    if (props.show) {
        isVisible.value = true
        startTimer()
    }
})
</script>

<template>
    <Transition enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="isVisible" :class="[
            'max-w-sm w-full border rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
            currentClasses.container
        ]">
            <div class="p-4">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <svg :class="['h-6 w-6', currentClasses.icon]" fill="currentColor" viewBox="0 0 20 20"
                            v-html="icons[type]" />
                    </div>
                    <div class="ml-3 w-0 flex-1">
                        <p v-if="title" :class="['text-sm font-medium', currentClasses.title]">
                            {{ title }}
                        </p>
                        <p :class="[
                            'text-sm',
                            currentClasses.message,
                            title ? 'mt-1' : ''
                        ]">
                            {{ message }}
                        </p>
                    </div>
                    <div v-if="closable" class="ml-4 flex-shrink-0 flex">
                        <button @click="closeToast" :class="[
                            'inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                            currentClasses.close
                        ]">
                            <span class="sr-only">Close</span>
                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>