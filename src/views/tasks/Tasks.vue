<script setup lang="ts">
import { ref, reactive } from 'vue'
import TaskCard from '../../components/ui/TaskCard.vue'
import { useTasks } from '../../composables/task/useTasks'
import { getStatusColor, getStatusIcon } from '../../utils/taskUtils'

const { 
    filteredTasks, 
    groupedTasks, 
    taskStats, 
    filters, 
    sortBy, 
    isLoading,
    createTask, 
    updateTask, 
    deleteTask,
    resetFilters,
    isCreating
} = useTasks()

// --- UI State Lokal ---
const viewMode = ref<'grid' | 'kanban'>('kanban')
const showCreateModal = ref(false)

const projectsList = [
    { id: 1, name: 'E-Commerce Platform' },
    { id: 2, name: 'Mobile App Update' },
    { id: 3, name: 'Website Redesign' },
    { id: 4, name: 'API Integration' }
]

// --- Modal & Form Logic ---
const defaultForm = {
    title: '',
    projectId: 1, 
    projectName: 'E-Commerce Platform',
    status: 'todo' as const,
    priority: 'medium' as const,
    dueDate: new Date().toISOString().split('T')[0],
}
const formData = reactive({ ...defaultForm })

const openCreateModal = () => {
    Object.assign(formData, defaultForm)
    showCreateModal.value = true
}

const handleSubmit = () => {
    if (!formData.title) return
    createTask(formData)
    showCreateModal.value = false
}

const moveTaskTo = (task: any, newStatus: string) => {
    updateTask({ id: task.id, data: { status: newStatus as any } })
}
</script>

<template>
    <div class="space-y-8">
        
        <div v-if="isLoading" class="py-12 text-center text-gray-500 animate-pulse">
            Loading Tasks...
        </div>

        <div v-else class="space-y-8">
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                    <div class="text-2xl font-bold text-gray-900">{{ taskStats.all }}</div>
                    <div class="text-sm text-gray-600">Total Tasks</div>
                </div>
                <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                    <div class="text-2xl font-bold text-emerald-600">{{ taskStats.done }}</div>
                    <div class="text-sm text-gray-600">Done</div>
                </div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
                <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between space-y-4 xl:space-y-0">
                    <div class="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                        
                        <div class="relative">
                            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input v-model="filters.search" type="text" placeholder="Search tasks..." class="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 w-full lg:w-64">
                        </div>

                        <select v-model="filters.status" class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                            <option value="all">All Status</option>
                            <option value="todo">Todo</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                        </select>

                        <select v-model="filters.priority" class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                            <option value="all">All Priority</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>

                        <select v-model="filters.project" class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                            <option value="all">All Projects</option>
                            <option v-for="p in projectsList" :key="p.id" :value="p.id">{{ p.name }}</option>
                        </select>
                    </div>

                    <div class="flex items-center space-x-3">
                        <div class="flex bg-gray-100 rounded-lg p-1">
                            <button @click="viewMode = 'grid'" :class="['px-3 py-1 rounded-md text-sm font-medium transition-colors', viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']">Grid</button>
                            <button @click="viewMode = 'kanban'" :class="['px-3 py-1 rounded-md text-sm font-medium transition-colors', viewMode === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']">Kanban</button>
                        </div>

                        <button @click="resetFilters" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Clear</button>
                        <button @click="openCreateModal" class="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-600 shadow-lg">
                            + New Task
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="viewMode === 'grid'">
                <div v-if="filteredTasks.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <TaskCard v-for="task in filteredTasks" :key="task.id" :task="task" />
                </div>
                 <div v-else class="text-center p-12 text-gray-500">No tasks found.</div>
            </div>

            <div v-else class="overflow-x-auto pb-4">
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 min-w-[1000px] lg:min-w-0">
                    <div v-for="(tasks, status) in groupedTasks" :key="status" 
                         class="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 p-4 flex flex-col h-full min-h-[500px]">
                        
                        <div class="flex items-center justify-between mb-4 p-2 bg-white rounded-xl shadow-sm">
                            <div class="flex items-center">
                                <span class="text-xl mr-2">{{ getStatusIcon(status) }}</span>
                                <h3 class="font-bold text-gray-800 capitalize">{{ status.replace('-', ' ') }}</h3>
                            </div>
                            <span :class="['px-2.5 py-0.5 rounded-full text-xs font-bold border', getStatusColor(status)]">
                                {{ tasks.length }}
                            </span>
                        </div>

                        <div class="flex-1 space-y-3">
                            <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
                            <div v-if="tasks.length === 0" class="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                                No tasks
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                <h3 class="text-xl font-bold mb-6">Create New Task</h3>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input v-model="formData.title" class="w-full px-4 py-2 border rounded-xl" required />
                    </div>
                     <div class="flex justify-end gap-3 mt-6">
                        <button type="button" @click="showCreateModal = false" class="px-4 py-2 text-gray-600">Cancel</button>
                        <button type="submit" :disabled="isCreating" class="px-6 py-2 bg-purple-600 text-white rounded-xl">
                            {{ isCreating ? 'Creating...' : 'Create' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</template>