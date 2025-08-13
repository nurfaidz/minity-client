<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Interfaces
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
const selectedProjectId = ref<number | null>(null)
const isSidebarCollapsed = ref(false)
const isUserDropdownOpen = ref(false)

const user = ref({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
})

// Mock data
const projects = ref<Project[]>([
    {
        id: 1,
        name: 'E-Commerce Platform',
        type: 'development',
        status: 'active',
        progress: 75,
        dueDate: '2025-09-15',
        tasksCount: { todo: 5, inProgress: 3, review: 2, done: 12 }
    },
    {
        id: 2,
        name: 'Mobile App Update',
        type: 'maintenance',
        status: 'active',
        progress: 45,
        dueDate: '2025-08-30',
        tasksCount: { todo: 8, inProgress: 2, review: 1, done: 6 }
    },
    {
        id: 3,
        name: 'Website Redesign',
        type: 'development',
        status: 'completed',
        progress: 100,
        dueDate: '2025-07-20',
        tasksCount: { todo: 0, inProgress: 0, review: 0, done: 18 }
    },
    {
        id: 4,
        name: 'API Integration',
        type: 'development',
        status: 'active',
        progress: 30,
        dueDate: '2025-10-01',
        tasksCount: { todo: 12, inProgress: 4, review: 0, done: 3 }
    },
    {
        id: 5,
        name: 'Server Maintenance',
        type: 'maintenance',
        status: 'on-hold',
        progress: 20,
        dueDate: '2025-08-25',
        tasksCount: { todo: 6, inProgress: 1, review: 0, done: 2 }
    }
])

const tasks = ref<Task[]>([
    {
        id: 1,
        title: 'Implement payment gateway',
        projectId: 1,
        projectName: 'E-Commerce Platform',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2025-08-10'
    },
    {
        id: 2,
        title: 'Fix mobile responsive issues',
        projectId: 2,
        projectName: 'Mobile App Update',
        status: 'review',
        priority: 'medium',
        dueDate: '2025-08-12'
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
        dueDate: '2025-08-08'
    }
])

// Computed properties
const dashboardStats = computed(() => {
    const totalProjects = projects.value.length
    const activeProjects = projects.value.filter(p => p.status === 'active').length
    const totalTasks = tasks.value.length
    const completedTasks = tasks.value.filter(t => t.status === 'done').length
    
    return [
        { 
            label: 'Total Projects', 
            value: totalProjects.toString(), 
            icon: '📊',
            gradient: 'from-blue-500 to-blue-600'
        },
        { 
            label: 'Active Projects', 
            value: activeProjects.toString(), 
            icon: '🚀',
            gradient: 'from-emerald-500 to-emerald-600'
        },
        { 
            label: 'Total Tasks', 
            value: totalTasks.toString(), 
            icon: '📋',
            gradient: 'from-purple-500 to-purple-600'
        },
        { 
            label: 'Completed Tasks', 
            value: completedTasks.toString(), 
            icon: '✅',
            gradient: 'from-orange-500 to-orange-600'
        }
    ]
})

const developmentProjects = computed(() => {
    return projects.value.filter(p => p.type === 'development')
})

const maintenanceProjects = computed(() => {
    return projects.value.filter(p => p.type === 'maintenance')
})

const activeProjects = computed(() => {
    return projects.value.filter(p => p.status === 'active').slice(0, 4)
})

const recentTasks = computed(() => {
    return tasks.value
        .filter(task => task.status !== 'done')
        .sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
        })
        .slice(0, 5)
})

const selectedProject = computed(() => {
    return selectedProjectId.value 
        ? projects.value.find(p => p.id === selectedProjectId.value)
        : null
})

const selectedProjectTasks = computed(() => {
    return selectedProjectId.value 
        ? tasks.value.filter(task => task.projectId === selectedProjectId.value)
        : []
})

// Methods
const getStatusColor = (status: string) => {
    const colors = {
        'todo': 'bg-gray-100 text-gray-700 border-gray-200',
        'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
        'review': 'bg-amber-100 text-amber-700 border-amber-200',
        'done': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'active': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'completed': 'bg-blue-100 text-blue-700 border-blue-200',
        'on-hold': 'bg-amber-100 text-amber-700 border-amber-200'
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

const formatTaskDate = (dateString: string) => {
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

const getPriorityIcon = (priority: string) => {
    const icons = {
        'low': '⬇️',
        'medium': '➡️',
        'high': '⬆️'
    }
    return icons[priority] || '➡️'
}

const getTaskStatusIcon = (status: string) => {
    const icons = {
        'todo': '⏳',
        'in-progress': '🔄',
        'review': '👀',
        'done': '✅'
    }
    return icons[status] || '⏳'
}

const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleUserDropdown = () => {
    isUserDropdownOpen.value = !isUserDropdownOpen.value
}

const selectProject = (projectId: number | null) => {
    selectedProjectId.value = projectId
}

const backToOverview = () => {
    selectedProjectId.value = null
}

const logout = () => {
    router.push({ name: 'login' })
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (!target.closest('.user-dropdown')) {
        isUserDropdownOpen.value = false
    }
}

// Lifecycle
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex">
        <!-- Sidebar -->
        <div :class="[
            'bg-white/90 backdrop-blur-md shadow-xl border-r border-gray-100 flex flex-col transition-all duration-300',
            isSidebarCollapsed ? 'w-20' : 'w-80'
        ]">
            <!-- Sidebar Header -->
            <div class="p-6 border-b border-gray-100">
                <div class="flex items-center justify-between">
                    <div v-show="!isSidebarCollapsed" class="flex items-center">
                        <div class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Minity
                        </div>
                        <span class="ml-3 text-sm text-gray-500 font-medium">PM</span>
                    </div>
                    <button @click="toggleSidebar" 
                        class="p-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                        <svg class="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path v-if="isSidebarCollapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Navigation Menu -->
            <div class="flex-1 overflow-y-auto scrollbar-hide">
                <nav class="p-6 space-y-6">
                    <!-- Dashboard -->
                    <div>
                        <button @click="selectProject(null)"
                            :class="[
                                'w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                                !selectedProjectId 
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25' 
                                    : 'text-gray-700 hover:bg-gray-50'
                            ]">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <span v-show="!isSidebarCollapsed">Dashboard</span>
                        </button>
                    </div>

                    <!-- Development Projects -->
                    <div v-show="!isSidebarCollapsed">
                        <h3 class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Development
                        </h3>
                        <div class="space-y-2 mt-3">
                            <button v-for="project in developmentProjects" :key="`dev-${project.id}`"
                                @click="selectProject(project.id)"
                                :class="[
                                    'w-full group p-4 rounded-xl transition-all duration-200 hover:shadow-sm',
                                    selectedProjectId === project.id 
                                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' 
                                        : 'hover:bg-gray-50'
                                ]">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 mr-4">
                                        <div :class="[
                                            'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
                                            selectedProjectId === project.id 
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                                                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                                        ]">
                                            {{ getTypeIcon(project.type) }}
                                        </div>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="font-semibold text-gray-900 truncate text-left">
                                            {{ project.name }}
                                        </div>
                                        <div class="flex items-center mt-1">
                                            <div class="w-16 bg-gray-200 rounded-full h-1.5 mr-3">
                                                <div class="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full" 
                                                     :style="`width: ${project.progress}%`"></div>
                                            </div>
                                            <span class="text-xs font-medium text-gray-500">{{ project.progress }}%</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Maintenance Projects -->
                    <div v-show="!isSidebarCollapsed">
                        <h3 class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Maintenance
                        </h3>
                        <div class="space-y-2 mt-3">
                            <button v-for="project in maintenanceProjects" :key="`main-${project.id}`"
                                @click="selectProject(project.id)"
                                :class="[
                                    'w-full group p-4 rounded-xl transition-all duration-200 hover:shadow-sm',
                                    selectedProjectId === project.id 
                                        ? 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200' 
                                        : 'hover:bg-gray-50'
                                ]">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 mr-4">
                                        <div :class="[
                                            'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
                                            selectedProjectId === project.id 
                                                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                                                : 'bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                                        ]">
                                            {{ getTypeIcon(project.type) }}
                                        </div>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="font-semibold text-gray-900 truncate text-left">
                                            {{ project.name }}
                                        </div>
                                        <div class="flex items-center mt-1">
                                            <div class="w-16 bg-gray-200 rounded-full h-1.5 mr-3">
                                                <div class="bg-gradient-to-r from-emerald-500 to-green-500 h-1.5 rounded-full" 
                                                     :style="`width: ${project.progress}%`"></div>
                                            </div>
                                            <span class="text-xs font-medium text-gray-500">{{ project.progress }}%</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div v-show="!isSidebarCollapsed" class="pt-6 border-t border-gray-100">
                        <div class="space-y-2">
                            <button class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200">
                                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Team</span>
                            </button>
                            <button class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200">
                                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Settings</span>
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            <!-- User Profile -->
            <div class="border-t border-gray-100 p-6">
                <div class="relative user-dropdown">
                    <button @click="toggleUserDropdown" 
                        :class="[
                            'w-full flex items-center p-3 rounded-xl hover:bg-gray-50 transition-all duration-200',
                            isUserDropdownOpen ? 'bg-gray-50' : ''
                        ]">
                        <img :src="user.avatar" :alt="user.name" class="w-10 h-10 rounded-xl mr-3 ring-2 ring-gray-100">
                        <div v-show="!isSidebarCollapsed" class="flex-1 text-left">
                            <div class="text-sm font-semibold text-gray-900">{{ user.name }}</div>
                            <div class="text-xs text-gray-500">{{ user.email }}</div>
                        </div>
                        <svg v-show="!isSidebarCollapsed" 
                             :class="['w-4 h-4 text-gray-400 transition-transform duration-200', isUserDropdownOpen ? 'rotate-180' : '']" 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <!-- Dropdown Menu -->
                    <div v-show="isUserDropdownOpen && !isSidebarCollapsed" 
                        class="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                        <button class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
                        </button>
                        <button class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                        </button>
                        <hr class="my-1 border-gray-100">
                        <button @click="logout" 
                            class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center">
                            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-h-screen">
            <!-- Top Header -->
            <header class="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 px-8 py-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            {{ selectedProject ? selectedProject.name : 'Dashboard Overview' }}
                        </h1>
                        <p class="text-gray-600 mt-2 text-lg">
                            {{ selectedProject ? 'Project Tasks & Details' : "Here's what's happening with your projects today." }}
                        </p>
                    </div>
                    <div v-if="selectedProject" class="flex items-center space-x-4">
                        <button @click="backToOverview" 
                            class="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm">
                            ← Back to Overview
                        </button>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main class="flex-1 p-8 overflow-y-auto">
                <!-- Dashboard Overview -->
                <div v-if="!selectedProject" class="space-y-8">
                    <!-- Stats Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <div v-for="stat in dashboardStats" :key="stat.label"
                            class="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
                            <!-- Background gradient on hover -->
                            <div :class="['absolute inset-0 bg-gradient-to-r', stat.gradient, 'rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300']"></div>
                            
                            <div class="relative flex items-center justify-between">
                                <div class="flex-1">
                                    <div class="text-3xl font-bold text-gray-900 mb-1">{{ stat.value }}</div>
                                    <div class="text-sm font-medium text-gray-600">{{ stat.label }}</div>
                                </div>
                                <div :class="['w-12 h-12 bg-gradient-to-r', stat.gradient, 'rounded-xl flex items-center justify-center text-white text-xl shadow-lg']">
                                    {{ stat.icon }}
                                </div>
                            </div>
                            
                            <!-- Animated progress bar -->
                            <div class="mt-4">
                                <div class="h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div :class="['h-full bg-gradient-to-r', stat.gradient, 'rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out']"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Projects and Tasks Section -->
                    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <!-- Recent Active Projects -->
                        <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-xl font-bold text-gray-900">Active Projects</h3>
                                <span class="text-sm text-gray-500">{{ activeProjects.length }} projects</span>
                            </div>
                            <div class="space-y-4">
                                <div v-for="project in activeProjects" :key="project.id"
                                    @click="selectProject(project.id)"
                                    class="group p-5 bg-gray-50/50 rounded-xl hover:bg-white hover:shadow-md border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer">
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
                            </div>
                        </div>

                        <!-- High Priority Tasks -->
                        <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-xl font-bold text-gray-900">Priority Tasks</h3>
                                <span class="text-sm text-gray-500">{{ recentTasks.length }} tasks</span>
                            </div>
                            <div class="space-y-3">
                                <div v-for="task in recentTasks" :key="task.id"
                                    class="group p-4 bg-gray-50/50 rounded-xl hover:bg-white hover:shadow-md border border-gray-100 hover:border-gray-200 transition-all duration-300">
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
                                            {{ formatTaskDate(task.dueDate) }}
                                        </div>
                                    </div>

                                    <!-- Progress indicator for in-progress tasks -->
                                    <div v-if="task.status === 'in-progress'" class="mt-3">
                                        <div class="w-full bg-gray-200 rounded-full h-1">
                                            <div class="bg-gradient-to-r from-blue-500 to-indigo-500 h-1 rounded-full animate-pulse" style="width: 60%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project Detail View -->
                <div v-if="selectedProject" class="space-y-8">
                    <!-- Project Header -->
                    <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div class="flex items-start justify-between mb-8">
                            <div class="flex items-center">
                                <div :class="['w-16 h-16 bg-gradient-to-r', getTypeGradient(selectedProject.type), 'rounded-2xl flex items-center justify-center text-white text-2xl mr-6 shadow-lg']">
                                    {{ getTypeIcon(selectedProject.type) }}
                                </div>
                                <div>
                                    <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ selectedProject.name }}</h2>
                                    <div class="flex items-center space-x-4">
                                        <span class="text-gray-600 capitalize font-medium">{{ selectedProject.type }} Project</span>
                                        <div :class="['px-3 py-1 rounded-full text-sm font-medium border', getStatusColor(selectedProject.status)]">
                                            {{ selectedProject.status.replace('-', ' ') }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                                    {{ selectedProject.progress }}%
                                </div>
                                <div class="w-40 bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                                    <div :class="['h-full bg-gradient-to-r', getTypeGradient(selectedProject.type), 'rounded-full transition-all duration-700 ease-out']" 
                                         :style="`width: ${selectedProject.progress}%`"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Task Stats Cards -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <div class="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                <div class="text-3xl font-bold text-gray-800 mb-2">{{ selectedProject.tasksCount.todo }}</div>
                                <div class="text-sm font-medium text-gray-600">Todo Tasks</div>
                                <div class="mt-2 text-lg">⏳</div>
                            </div>
                            <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                <div class="text-3xl font-bold text-blue-700 mb-2">{{ selectedProject.tasksCount.inProgress }}</div>
                                <div class="text-sm font-medium text-blue-600">In Progress</div>
                                <div class="mt-2 text-lg">🔄</div>
                            </div>
                            <div class="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                                <div class="text-3xl font-bold text-amber-700 mb-2">{{ selectedProject.tasksCount.review }}</div>
                                <div class="text-sm font-medium text-amber-600">In Review</div>
                                <div class="mt-2 text-lg">👀</div>
                            </div>
                            <div class="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                                <div class="text-3xl font-bold text-emerald-700 mb-2">{{ selectedProject.tasksCount.done }}</div>
                                <div class="text-sm font-medium text-emerald-600">Completed</div>
                                <div class="mt-2 text-lg">✅</div>
                            </div>
                        </div>

                        <!-- Project Info -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-500 uppercase tracking-wider">Status</label>
                                <div :class="['inline-flex px-4 py-2 rounded-xl text-sm font-semibold border', getStatusColor(selectedProject.status)]">
                                    {{ selectedProject.status.replace('-', ' ') }}
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-500 uppercase tracking-wider">Due Date</label>
                                <div class="text-lg font-semibold text-gray-900">{{ formatDate(selectedProject.dueDate) }}</div>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Tasks</label>
                                <div class="text-lg font-semibold text-gray-900">
                                    {{ selectedProject.tasksCount.todo + selectedProject.tasksCount.inProgress + selectedProject.tasksCount.review + selectedProject.tasksCount.done }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Project Tasks -->
                    <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h3 class="text-xl font-bold text-gray-900">Project Tasks</h3>
                                    <p class="text-gray-600 mt-1">Manage and track all tasks for this project</p>
                                </div>
                                <button class="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add New Task
                                </button>
                            </div>
                        </div>

                        <!-- Tasks List -->
                        <div v-if="selectedProjectTasks.length > 0" class="divide-y divide-gray-100">
                            <div v-for="task in selectedProjectTasks" :key="task.id" 
                                 class="px-8 py-6 hover:bg-gray-50/50 transition-colors duration-200 group">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-4 flex-1">
                                        <div class="text-2xl">{{ getTaskStatusIcon(task.status) }}</div>
                                        <div class="flex-1">
                                            <div class="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                                                {{ task.title }}
                                            </div>
                                            <div class="flex items-center space-x-4 mt-2">
                                                <div :class="['px-3 py-1 rounded-full text-xs font-medium border', getStatusColor(task.status)]">
                                                    {{ task.status.replace('-', ' ') }}
                                                </div>
                                                <div class="flex items-center space-x-1">
                                                    <span class="text-sm">{{ getPriorityIcon(task.priority) }}</span>
                                                    <span :class="['px-2 py-1 rounded-lg text-xs font-medium border', getPriorityColor(task.priority)]">
                                                        {{ task.priority }}
                                                    </span>
                                                </div>
                                                <div class="text-sm text-gray-500">
                                                    Due: {{ formatDate(task.dueDate) }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Task Actions -->
                                    <div class="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button class="text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm px-3 py-1 rounded-lg hover:bg-blue-50">
                                            Edit
                                        </button>
                                        <button class="text-red-600 hover:text-red-800 font-medium transition-colors text-sm px-3 py-1 rounded-lg hover:bg-red-50">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-else class="px-8 py-12 text-center">
                            <div class="text-6xl mb-4">📝</div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h3>
                            <p class="text-gray-600 mb-6">Get started by creating your first task for this project.</p>
                            <button class="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create First Task
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<style scoped>
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>