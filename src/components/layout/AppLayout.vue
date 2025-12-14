<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

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

// Reactive data
const isSidebarCollapsed = ref(false)
const isUserDropdownOpen = ref(false)

const user = ref({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
})

// Mock data for sidebar
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
    }
])

// Computed properties
const developmentProjects = computed(() => {
    return projects.value.filter(p => p.type === 'development')
})

const maintenanceProjects = computed(() => {
    return projects.value.filter(p => p.type === 'maintenance')
})

const currentPageTitle = computed(() => {
    switch (route.name) {
        case 'dashboard':
            return 'Dashboard Overview'
        case 'projects':
            return 'Projects'
        case 'tasks':
            return 'Tasks'
        default:
            return 'Dashboard'
    }
})

const currentPageSubtitle = computed(() => {
    switch (route.name) {
        case 'dashboard':
            return "Here's what's happening with your projects today."
        case 'projects':
            return 'Manage and track all your projects'
        case 'tasks':
            return 'View and manage all tasks across projects'
        default:
            return 'Welcome back!'
    }
})

// Methods
const getTypeIcon = (type: string) => {
    return type === 'development' ? '⚡' : '🔧'
}

const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleUserDropdown = () => {
    isUserDropdownOpen.value = !isUserDropdownOpen.value
}

const navigateTo = (routeName: string) => {
    router.push({ name: routeName })
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
                    <!-- Main Navigation -->
                    <div class="space-y-2">
                        <button @click="navigateTo('dashboard')"
                            :class="[
                                'w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                                route.name === 'dashboard'
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25' 
                                    : 'text-gray-700 hover:bg-gray-50'
                            ]">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <span v-show="!isSidebarCollapsed">Dashboard</span>
                        </button>

                        <button @click="navigateTo('projects')"
                            :class="[
                                'w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                                route.name === 'projects'
                                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25' 
                                    : 'text-gray-700 hover:bg-gray-50'
                            ]">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span v-show="!isSidebarCollapsed">Projects</span>
                        </button>

                        <button @click="navigateTo('tasks')"
                            :class="[
                                'w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                                route.name === 'tasks'
                                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25' 
                                    : 'text-gray-700 hover:bg-gray-50'
                            ]">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            <span v-show="!isSidebarCollapsed">Tasks</span>
                        </button>
                    </div>

                    <!-- Quick Projects (if not collapsed) -->
                    <div v-show="!isSidebarCollapsed">
                        <h3 class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Quick Access
                        </h3>
                        <div class="space-y-2 mt-3">
                            <div v-for="project in projects.slice(0, 3)" :key="project.id"
                                class="group p-3 rounded-lg hover:bg-gray-50 transition-all duration-200">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 mr-3">
                                        <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
                                            {{ getTypeIcon(project.type) }}
                                        </div>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="font-medium text-gray-900 truncate text-sm">
                                            {{ project.name }}
                                        </div>
                                        <div class="flex items-center mt-1">
                                            <div class="w-12 bg-gray-200 rounded-full h-1 mr-2">
                                                <div :class="['h-1 rounded-full', project.type === 'development' ? 'bg-blue-500' : 'bg-emerald-500']" 
                                                     :style="`width: ${project.progress}%`"></div>
                                            </div>
                                            <span class="text-xs text-gray-500">{{ project.progress }}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                            {{ currentPageTitle }}
                        </h1>
                        <p class="text-gray-600 mt-2 text-lg">
                            {{ currentPageSubtitle }}
                        </p>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button class="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg">
                            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add New
                        </button>
                    </div>
                </div>
            </header>

            <!-- Router View - Content of each page -->
            <main class="flex-1 p-8 overflow-y-auto">
                <router-view />
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