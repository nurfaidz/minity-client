<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

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
    projects: Project[]
    selectedProjectId: number | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
    selectProject: [projectId: number | null]
}>()

const router = useRouter()

// Reactive data
const user = ref({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
})

const isSidebarCollapsed = ref(false)
const isUserDropdownOpen = ref(false)

// Computed properties
const developmentProjects = computed(() => {
    return props.projects.filter(p => p.type === 'development')
})

const maintenanceProjects = computed(() => {
    return props.projects.filter(p => p.type === 'maintenance')
})

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

const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleUserDropdown = () => {
    isUserDropdownOpen.value = !isUserDropdownOpen.value
}

const selectProject = (projectId: number | null) => {
    emit('selectProject', projectId)
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
                            !props.selectedProjectId 
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
                                props.selectedProjectId === project.id 
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' 
                                    : 'hover:bg-gray-50'
                            ]">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 mr-4">
                                    <div :class="[
                                        'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
                                        props.selectedProjectId === project.id 
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
                                props.selectedProjectId === project.id 
                                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200' 
                                    : 'hover:bg-gray-50'
                            ]">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 mr-4">
                                    <div :class="[
                                        'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
                                        props.selectedProjectId === project.id 
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