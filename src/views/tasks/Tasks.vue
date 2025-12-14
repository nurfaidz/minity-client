<script setup lang="ts">
import { ref } from 'vue'
import TaskCard from '../../components/ui/TaskCard.vue'
import { useTask } from '../../composables/tasks/useTask'
import { getStatusColor, getStatusIcon } from '../../utils/styleHelpers'

// -- Composables --
const { 
    filters, 
    sortBy, 
    filteredTasks, 
    groupedTasks, 
    taskStats, 
    clearFilters 
} = useTask()

const viewMode = ref<'grid' | 'kanban'>('kanban') // Default ke kanban biar keren
const showCreateModal = ref(false)


// -- Filters --
const projects = [
    { id: 1, name: 'E-Commerce Platform' },
    { id: 2, name: 'Mobile App Update' },
    { id: 3, name: 'Website Redesign' },
    { id: 4, name: 'API Integration' }
]

const openCreateModal = () => showCreateModal.value = true
const closeCreateModal = () => showCreateModal.value = false
</script>

<template>
    <div class="space-y-8">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
             <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <div class="text-2xl font-bold text-gray-900">{{ taskStats.all }}</div>
                <div class="text-sm text-gray-600">Total Tasks</div>
            </div>
            </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between space-y-4 xl:space-y-0">
                <div class="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                    
                    <div class="relative">
                        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input v-model="filters.search" type="text" placeholder="Search tasks..." class="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full lg:w-64">
                    </div>

                    <select v-model="filters.status" class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">All Status</option>
                        <option value="todo">Todo</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                    </select>

                    <select v-model="filters.priority" class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">All Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    <select v-model="filters.project" class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">All Projects</option>
                        <option v-for="project in projects" :key="project.id" :value="project.id">
                            {{ project.name }}
                        </option>
                    </select>

                    <select v-model="sortBy" class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="dueDate">Sort by Due Date</option>
                        <option value="title">Sort by Title</option>
                        <option value="priority">Sort by Priority</option>
                    </select>
                </div>

                <div class="flex items-center space-x-3">
                    <div class="flex bg-gray-100 rounded-lg p-1">
                        <button @click="viewMode = 'grid'" :class="['px-3 py-1 rounded-md text-sm font-medium transition-colors', viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']">
                            Grid
                        </button>
                        <button @click="viewMode = 'kanban'" :class="['px-3 py-1 rounded-md text-sm font-medium transition-colors', viewMode === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']">
                            Kanban
                        </button>
                    </div>

                    <button @click="clearFilters" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                        Clear
                    </button>
                    <button @click="openCreateModal" class="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg">
                        + New Task
                    </button>
                </div>
            </div>
        </div>

        <div v-if="viewMode === 'grid'">
            <div v-if="filteredTasks.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <TaskCard v-for="task in filteredTasks" :key="task.id" :task="task" />
            </div>
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

        <div v-if="filteredTasks.length === 0" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-12 text-center mt-8">
            <div class="text-6xl mb-4">📝</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p class="text-gray-600 mb-6">Try adjusting your filters.</p>
            <button @click="clearFilters" class="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                Clear Filters
            </button>
        </div>

        </div>
</template>