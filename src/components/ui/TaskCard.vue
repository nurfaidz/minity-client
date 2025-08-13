<script setup lang="ts">
interface Task {
    id: number
    title: string
    projectId: number
    projectName: string
    status: 'todo' | 'in-progress' | 'review' | 'done'
    priority: 'low' | 'medium' | 'high'
    dueDate: string
    assignee?: string
}

interface Props {
    task: Task
}

defineProps<Props>()

// Methods
const getStatusColor = (status: string) => {
    const colors = {
        'todo': 'bg-gray-100 text-gray-700 border-gray-200',
        'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
        'review': 'bg-amber-100 text-amber-700 border-amber-200',
        'done': 'bg-emerald-100 text-emerald-700 border-emerald-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
}

const getPriorityColor = (priority: string) => {
    const colors = {
        'low': 'bg-green-100 text-green-700 border-green-200',
        'medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'high': 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[priority] || 'bg-gray-100 text-gray-700 border-gray-200'
}

const getPriorityIcon = (priority: string) => {
    const icons = {
        'low': '⬇️',
        'medium': '➡️',
        'high': '⬆️'
    }
    return icons[priority] || '➡️'
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    return `${diffDays} days left`
}

const isOverdue = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    return date < today
}

const isDueToday = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    return date.toDateString() === today.toDateString()
}
</script>

<template>
    <div class="group p-4 bg-gray-50/50 rounded-xl hover:bg-white hover:shadow-md border border-gray-100 hover:border-gray-200 transition-all duration-300">
        <div class="flex items-start justify-between mb-3">
            <div class="flex-1 mr-3">
                <div class="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors mb-1">
                    {{ task.title }}
                </div>
                <div class="text-sm text-gray-500">{{ task.projectName }}</div>
            </div>
            
            <!-- Priority Indicator -->
            <div class="flex items-center space-x-2">
                <div :class="['px-2 py-1 rounded-lg text-xs font-medium border flex items-center', getPriorityColor(task.priority)]">
                    <span class="mr-1">{{ getPriorityIcon(task.priority) }}</span>
                    {{ task.priority }}
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between">
            <!-- Status Badge -->
            <div :class="['px-3 py-1 rounded-full text-xs font-medium border', getStatusColor(task.status)]">
                {{ task.status.replace('-', ' ') }}
            </div>
            
            <!-- Due Date -->
            <div :class="[
                'text-xs font-medium',
                isOverdue(task.dueDate) ? 'text-red-600' : 
                isDueToday(task.dueDate) ? 'text-amber-600' : 'text-gray-500'
            ]">
                {{ formatDate(task.dueDate) }}
            </div>
        </div>

        <!-- Progress indicator for in-progress tasks -->
        <div v-if="task.status === 'in-progress'" class="mt-3">
            <div class="w-full bg-gray-200 rounded-full h-1">
                <div class="bg-gradient-to-r from-blue-500 to-indigo-500 h-1 rounded-full animate-pulse" style="width: 60%"></div>
            </div>
        </div>
    </div>
</template>