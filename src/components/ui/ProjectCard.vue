<script setup lang="ts">
interface Project {
    id: number
    name: string
    type: 'development' | 'maintenance'
    status: 'active' | 'completed' | 'on-hold'
    progress: number
    dueDate: string
    tasksCount: {
        todo: number
        inProgress: number
        review: number
        done: number
    }
}

interface Props {
    project: Project
}

defineProps<Props>()

// Methods
const getStatusColor = (status: string) => {
    const colors = {
        'active': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'completed': 'bg-blue-100 text-blue-700 border-blue-200',
        'on-hold': 'bg-amber-100 text-amber-700 border-amber-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
}

const getTypeIcon = (type: string) => {
    return type === 'development' ? '⚡' : '🔧'
}

const getTypeGradient = (type: string) => {
    return type === 'development' 
        ? 'from-blue-500 to-indigo-500' 
        : 'from-emerald-500 to-green-500'
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}
</script>

<template>
    <div class="group p-5 bg-gray-50/50 rounded-xl hover:bg-white hover:shadow-md border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer">
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
                <div :class="['w-10 h-10 bg-gradient-to-r', getTypeGradient(project.type), 'rounded-lg flex items-center justify-center text-white text-lg mr-3 group-hover:scale-110 transition-transform duration-300']">
                    {{ getTypeIcon(project.type) }}
                </div>
                <div>
                    <div class="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                        {{ project.name }}
                    </div>
                    <div class="text-sm text-gray-500 capitalize">{{ project.type }}</div>
                </div>
            </div>
            <div :class="['px-3 py-1 rounded-full text-xs font-medium border', getStatusColor(project.status)]">
                {{ project.status.replace('-', ' ') }}
            </div>
        </div>

        <!-- Progress Section -->
        <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-600">Progress</span>
                <span class="text-sm font-bold text-gray-900">{{ project.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div :class="['h-full bg-gradient-to-r', getTypeGradient(project.type), 'rounded-full transition-all duration-500 ease-out']" 
                     :style="`width: ${project.progress}%`"></div>
            </div>
        </div>

        <!-- Task Summary -->
        <div class="flex items-center justify-between text-xs">
            <div class="flex items-center space-x-4">
                <div class="flex items-center">
                    <div class="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
                    <span class="text-gray-600">{{ project.tasksCount.inProgress }} active</span>
                </div>
                <div class="flex items-center">
                    <div class="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                    <span class="text-gray-600">{{ project.tasksCount.done }} done</span>
                </div>
            </div>
            <div class="text-gray-500">Due {{ formatDate(project.dueDate) }}</div>
        </div>
    </div>
</template>