<script setup lang="ts">
import { computed, useSlots } from 'vue'

// Props interface
interface Props {
    label?: string
    type?: string
    placeholder?: string
    modelValue?: string | number
    error?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps < Props > (), {
    type: 'text',
    placeholder: '',
    size: 'md',
    required: false,
    disabled: false,
    readonly: false
})

// Emits
const emit = defineEmits < {
    'update:modelValue': [value: string | number]
} > ()

// Slots
const slots = useSlots()

// Computed
const inputClasses = computed(() => {
    const baseClasses = 'w-full border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1'
    const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-4 py-4 text-lg'
    }

    const stateClasses = props.error
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'

    const disabledClasses = props.disabled
        ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
        : 'bg-white'

    return `${baseClasses} ${sizeClasses[props.size]} ${stateClasses} ${disabledClasses}`
})

const hasIcon = computed((): boolean => {
    return !!slots.icon
})

const hasSuffix = computed((): boolean => {
    return !!slots.suffix
})

// Methods
const handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
}
</script>

<template>
    <div class="space-y-2">
        <!-- Label -->
        <label v-if="label" class="block text-sm font-medium text-gray-700">
            {{ label }}
            <span v-if="required" class="text-red-500 ml-1">*</span>
        </label>

        <!-- Input Container -->
        <div class="relative">
            <!-- Icon Slot -->
            <div v-if="hasIcon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <slot name="icon"></slot>
            </div>

            <!-- Input Field -->
            <input :type="type" :placeholder="placeholder" :value="modelValue" :disabled="disabled" :readonly="readonly"
                :required="required" :class="[
                    inputClasses,
                    hasIcon ? 'pl-10' : '',
                    hasSuffix ? 'pr-10' : ''
                ]" @input="handleInput" />

            <!-- Suffix Slot -->
            <div v-if="hasSuffix" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <slot name="suffix"></slot>
            </div>
        </div>

        <!-- Error Message -->
        <p v-if="error" class="text-sm text-red-600 mt-1">
            {{ error }}
        </p>
    </div>
</template>