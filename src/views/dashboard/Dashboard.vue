<!-- views/dashboard/DashboardPage.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ProjectCard from '../../components/ui/ProjectCard.vue'
import TaskCard from '../../components/ui/TaskCard.vue'

const router = useRouter()

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

// Methods
const navigateToProjects = () => {
    router.push({ name: 'projects' })
}

const navigateToTasks = () => {
    router.push({ name: 'tasks' })
}
</script>

<template>
    <div class="space-y-8">
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
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-500">{{ activeProjects.length }} projects</span>
                        <button @click="navigateToProjects" 
                            class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                            View All →
                        </button>
                    </div>
                </div>
                <div class="space-y-4">
                    <ProjectCard v-for="project in activeProjects" :key="project.id" :project="project" />
                </div>
            </div>

            <!-- High Priority Tasks -->
            <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-gray-900">Priority Tasks</h3>
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-500">{{ recentTasks.length }} tasks</span>
                        <button @click="navigateToTasks" 
                            class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                            View All →
                        </button>
                    </div>
                </div>
                <div class="space-y-3">
                    <TaskCard v-for="task in recentTasks" :key="task.id" :task="task" />
                </div>
            </div>
        </div>

        <!-- Quick Stats Overview -->
        <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6">Project Progress Overview</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="project in projects.slice(0, 6)" :key="project.id" 
                     class="p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-semibold text-gray-900 truncate">{{ project.name }}</h4>
                        <span class="text-2xl font-bold text-gray-700">{{ project.progress }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div :class="[
                            'h-2 rounded-full transition-all duration-500',
                            project.type === 'development' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-emerald-500 to-green-500'
                        ]" :style="`width: ${project.progress}%`"></div>
                    </div>
                    <div class="flex items-center justify-between mt-3 text-sm text-gray-600">
                        <span class="capitalize">{{ project.type }}</span>
                        <span class="font-medium">{{ project.tasksCount.done + project.tasksCount.inProgress + project.tasksCount.review + project.tasksCount.todo }} tasks</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>