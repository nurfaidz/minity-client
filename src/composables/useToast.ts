import { ref } from 'vue'

export interface ToastOptions {
    title?: string
    message: string
    type?: 'success' | 'error' | 'warning' | 'info'
    duration?: number
    closable?: boolean
}

// Global toast container reference
const toastContainer = ref<any>(null)

export const useToast = () => {
    const setToastContainer = (container: any) => {
        toastContainer.value = container
    }

    const toast = (options: ToastOptions) => {
        if (!toastContainer.value) {
            console.warn('Toast container not found. Make sure ToastContainer is mounted.')
            return
        }

        return toastContainer.value.addToast({
            type: 'info',
            duration: 5000,
            closable: true,
            ...options
        })
    }

    const success = (message: string, title?: string, options?: Partial<ToastOptions>) => {
        return toast({
            type: 'success',
            message,
            title,
            ...options
        })
    }

    const error = (message: string, title?: string, options?: Partial<ToastOptions>) => {
        return toast({
            type: 'error',
            message,
            title,
            ...options
        })
    }

    const warning = (message: string, title?: string, options?: Partial<ToastOptions>) => {
        return toast({
            type: 'warning',
            message,
            title,
            ...options
        })
    }

    const info = (message: string, title?: string, options?: Partial<ToastOptions>) => {
        return toast({
            type: 'info',
            message,
            title,
            ...options
        })
    }

    const clear = () => {
        if (toastContainer.value) {
            toastContainer.value.clearAll()
        }
    }

    return {
        setToastContainer,
        toast,
        success,
        error,
        warning,
        info,
        clear
    }
}