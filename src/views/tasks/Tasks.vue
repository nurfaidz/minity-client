<script setup lang="ts">
import { ref, computed } from 'vue'
import TaskCard from '../../components/ui/TaskCard.vue'

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

// Reactive data
const selectedStatus = ref<'all' | 'todo' | 'in-progress' | 'review' | 'done'>('all')
const selectedPriority = ref<'all' | 'low' | 'medium' | 'high'>('all')
const selectedProject = ref<'all' | number>('all')
const searchQuery = ref('')
const sortBy = ref<'title' | 'priority' | 'dueDate' | 'status'>('dueDate')
const viewMode = ref<'grid' | 'list'>('grid')
const showCreateModal = ref(false)

// Mock data
const tasks = ref<Task[]>([
    {
        id: 1,
        title: 'Implement payment gateway',
        projectId: 1,
        projectName: 'E-Commerce Platform',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2025-08-10',
        assignee: 'John Doe'
    },
    {
        id: 2,
        title: 'Fix mobile responsive issues',
        projectId: 2,
        projectName: 'Mobile App Update',
        status: 'review',
        priority: 'medium',
        dueDate: '2025-08-12',
        assignee: 'Jane Smith'
    },
    {
        id: 3,
        title: 'Update documentation',
        projectId: 1,
        projectName: 'E-Commerce Platform',
        status: 'todo',
        priority: 'low',
        dueDate: '2025-08-15'
    },
    {
        id: 4,
        title: 'Database optimization',
        projectId: 2,
        projectName: 'Mobile App Update',
        status: 'todo',
        priority: 'high',
        dueDate: '2025-08-08',
        assignee: 'Mike Johnson'
    },
    {
        id: 5,
        title: 'Security audit implementation',
        projectId: 3,
        projectName: 'Website Redesign',
        status: 'done',
        priority: 'high',
        dueDate: '2025-07-25',
        assignee: 'Sarah Wilson'
    },
    {
        id: 6,
        title: 'API endpoint testing',
        projectId: 4,
        projectName: 'API Integration',
        status: 'in-progress',
        priority: 'medium',
        dueDate: '2025-08-20',
        assignee: 'David Brown'
    },
    {
        id: 7,
        title: 'User interface improvements',
        projectId: 1,
        projectName: 'E-Commerce Platform',
        status: 'review',
        priority: 'medium',
        dueDate: '2025-08-18'
    },
    {
        id: 8,
        title: 'Performance optimization',
        projectId: 2,
        projectName: 'Mobile App Update',
        status: 'todo',
        priority: 'low',
        dueDate: '2025-08-25',
        assignee: 'Emily Davis'
    }
])

const projects = ref([
    { id: 1, name: 'E-Commerce Platform' },
    { id: 2, name: 'Mobile App Update' },
    { id: 3, name: 'Website Redesign' },
    { id: 4, name: 'API Integration' }
])

// Computed properties
const filteredTasks = computed(() => {
    let filtered = tasks.value

    // Filter by status
    if (selectedStatus.value !== 'all') {
        filtered = filtered.filter(t => t.status === selectedStatus.value)
    }

    // Filter by priority
    if (selectedPriority.value !== 'all') {
        filtered = filtered.filter(t => t.priority === selectedPriority.value)
    }

    // Filter by project
    if (selectedProject.value !== 'all') {
        filtered = filtered.filter(t => t.projectId === selectedProject.value)
    }

    // Filter by search query
    if (searchQuery.value) {
        filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            t.projectName.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    }

    // Sort
    switch (sortBy.value) {
        case 'title':
            filtered.sort((a, b) => a.title.localeCompare(b.title))
            break
        case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
            break
        case 'dueDate':
            filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            break
        case 'status':
            const statusOrder = { 'todo': 1, 'in-progress': 2, 'review': 3, 'done': 4 }
            filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
            break
    }

    return filtered
})

const taskStats = computed(() => {
    const all = tasks.value.length
    const todo = tasks.value.filter(t => t.status === 'todo').length
    const inProgress = tasks.value.filter(t => t.status === 'in-progress').length
    const review = tasks.value.filter(t => t.status === 'review').length
    const done = tasks.value.filter(t => t.status === 'done').length
    const highPriority = tasks.value.filter(t => t.priority === 'high').length
    const overdue = tasks.value.filter(t => 
        new Date(t.dueDate) < new Date() && t.status !== 'done'
    ).length

    return { all, todo, inProgress, review, done, highPriority, overdue }
})

const tasksByStatus = computed(() => {
    return {
        todo: tasks.value.filter(t => t.status === 'todo'),
        'in-progress': tasks.value.filter(t => t.status === 'in-progress'),
        review: tasks.value.filter(t => t.status === 'review'),
        done: tasks.value.filter(t => t.status === 'done')
    }
})

// Methods
const clearFilters = () => {
    selectedStatus.value = 'all'
    selectedPriority.value = 'all'
    selectedProject.value = 'all'
    searchQuery.value = ''
    sortBy.value = 'dueDate'
}

const openCreateModal = () => {
    showCreateModal.value = true
}

const closeCreateModal = () => {
    showCreateModal.value = false
}

const getStatusColor = (status: string) => {
    const colors = {
        'todo': 'bg-gray-100 text-gray-700 border-gray-200',
        'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
        'review': 'bg-amber-100 text-amber-700 border-amber-200',
        'done': 'bg-emerald-100 text-emerald-700 border-emerald-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
}

const getStatusIcon = (status: string) => {
    const icons = {
        'todo': '⏳',
        'in-progress': '🔄',
        'review': '👀',
        'done': '✅'
    }
    return icons[status] || '⏳'
}
</script>

<template>
    <div class="space-y-8">
        <!-- Page Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <div class="text-2xl font-bold text-gray-900">{{ taskStats.all }}</div>
                <div class="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <div class="text-2xl font-bold text-gray-600">{{ taskStats.todo }}</div>
                <div class="text-sm text-gray-600">Todo</div>
            </div>
            <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <div class="text-2xl font-bold text-blue-600">{{ taskStats.inProgress }}</div>
                <div class="text-sm text-gray-600">In Progress</div>
            </div>
            <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <div class="text-2xl font-bold text-amber-600">{{ taskStats.review }}</div>
                <div class="text-sm text-gray-600">Review</div>
            </div>
            <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <div class="text-2xl font-bold text-emerald-600">{{ taskStats.done }}</div>
                <div class="text-sm text-gray-600">Completed</div>
            </div>
            <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <div class="text-2xl font-bold text-red-600">{{ taskStats.highPriority }}</div>
                <div class="text-sm text-gray-600">High Priority</div>
            </div>
            <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <div class="text-2xl font-bold text-orange-600">{{ taskStats.overdue }}</div>
                <div class="text-sm text-gray-600">Overdue</div>
            </div>
        </div>

        <!-- Filters and Controls -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between space-y-4 xl:space-y-0">
                <div class="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                    <!-- Search -->
                    <div class="relative">
                        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input v-model="searchQuery" 
                               type="text" 
                               placeholder="Search tasks..." 
                               class="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-64">
                    </div>

                    <!-- Status Filter -->
                    <select v-model="selectedStatus" 
                            class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">All Status</option>
                        <option value="todo">Todo</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                    </select>

                    <!-- Priority Filter -->
                    <select v-model="selectedPriority" 
                            class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">All Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    <!-- Project Filter -->
                    <select v-model="selectedProject" 
                            class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">All Projects</option>
                        <option v-for="project in projects" :key="project.id" :value="project.id">
                            {{ project.name }}
                        </option>
                    </select>

                    <!-- Sort -->
                    <select v-model="sortBy" 
                            class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="dueDate">Sort by Due Date</option>
                        <option value="title">Sort by Title</option>
                        <option value="priority">Sort by Priority</option>
                        <option value="status">Sort by Status</option>
                    </select>
                </div>

                <div class="flex items-center space-x-3">
                    <!-- View Mode Toggle -->
                    <div class="flex bg-gray-100 rounded-lg p-1">
                        <button @click="viewMode = 'grid'" 
                                :class="['px-3 py-1 rounded-md text-sm font-medium transition-colors', 
                                         viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button @click="viewMode = 'list'" 
                                :class="['px-3 py-1 rounded-md text-sm font-medium transition-colors', 
                                         viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    <button @click="clearFilters" 
                            class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                        Clear Filters
                    </button>
                    <button @click="openCreateModal" 
                            class="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg">
                        <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Task
                    </button>
                </div>
            </div>
        </div>

        <!-- Tasks Content -->
        <div v-if="viewMode === 'grid'">
            <!-- Grid View -->
            <div v-if="filteredTasks.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <TaskCard v-for="task in filteredTasks" :key="task.id" :task="task" />
            </div>
        </div>

        <div v-else>
            <!-- Kanban Board View -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div v-for="(statusTasks, status) in tasksByStatus" :key="status" 
                     class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <span class="text-xl mr-2">{{ getStatusIcon(status) }}</span>
                            <h3 class="font-semibold text-gray-900 capitalize">
                                {{ status.replace('-', ' ') }}
                            </h3>
                        </div>
                        <span :class="['px-2 py-1 rounded-full text-xs font-medium border', getStatusColor(status)]">
                            {{ statusTasks.length }}
                        </span>
                    </div>
                    <div class="space-y-3">
                        <TaskCard v-for="task in statusTasks.filter(task => {
                            const matchesSearch = !searchQuery || task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.projectName.toLowerCase().includes(searchQuery.toLowerCase())
                            const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority
                            const matchesProject = selectedProject === 'all' || task.projectId === selectedProject
                            return matchesSearch && matchesPriority && matchesProject
                        })" :key="task.id" :task="task" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredTasks.length === 0" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div class="text-6xl mb-4">📝</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p class="text-gray-600 mb-6">
                {{ searchQuery || selectedStatus !== 'all' || selectedPriority !== 'all' || selectedProject !== 'all'
                   ? 'Try adjusting your filters or search terms.' 
                   : 'Get started by creating your first task.' }}
            </p>
            <div class="flex justify-center space-x-4">
                <button v-if="searchQuery || selectedStatus !== 'all' || selectedPriority !== 'all' || selectedProject !== 'all'" 
                        @click="clearFilters" 
                        class="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                    Clear Filters
                </button>
                <button @click="openCreateModal" 
                        class="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg">
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Task
                </button>
            </div>
        </div>

        <!-- Create Task Modal (Placeholder) -->
        <div v-if="showCreateModal" 
             class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
             @click="closeCreateModal">
            <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4" @click.stop>
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-gray-900">Create New Task</h3>
                    <button @click="closeCreateModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                        <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Enter task title">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Project</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <option v-for="project in projects" :key="project.id" :value="project.id">
                                {{ project.name }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    </div>
                </div>
                <div class="flex justify-end space-x-3 mt-6">
                    <button @click="closeCreateModal" 
                            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button class="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200">
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>