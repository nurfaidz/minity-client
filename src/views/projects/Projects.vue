<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import ProjectCard from '../../components/ui/ProjectCard.vue'

const router = useRouter()

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
    },
])

// Reactive data
const selectedFilter = ref<'all' | 'development' | 'maintenance'>('all')
const selectedStatus = ref<'all' | 'active' | 'completed' | 'on-hold'>('all')
const searchQuery = ref('')
const sortBy = ref<'name' | 'progress' | 'dueDate'>('name')

// --- Moda & Form State ---
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

// Form default value
const defaultForm = {
    name: '',
    type: 'development' as const,
    status: 'active' as const,
    dueDate: new Date().toISOString().split('T')[0],
}

const formData = reactive({...defaultForm})

// Computed properties
const filteredProjects = computed(() => {
    let filtered = projects.value

    // Filter by type
    if (selectedFilter.value !== 'all') {
        filtered = filtered.filter(p => p.type === selectedFilter.value)
    }

    // Filter by status
    if (selectedStatus.value !== 'all') {
        filtered = filtered.filter(p => p.status === selectedStatus.value)
    }

    // Filter by search query
    if (searchQuery.value) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    }

    // Sort
    return filtered.sort((a, b) => {
        if (sortBy.value === 'name') return a.name.localeCompare(b.name)
        if (sortBy.value === 'progress') return b.progress - a.progress
        if (sortBy.value === 'dueDate') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        return 0
    })
})

const projectStats = computed(() => {
    const all = projects.value.length
    const development = projects.value.filter(p => p.type === 'development').length
    const maintenance = projects.value.filter(p => p.type === 'maintenance').length
    const active = projects.value.filter(p => p.status === 'active').length
    const completed = projects.value.filter(p => p.status === 'completed').length
    const onHold = projects.value.filter(p => p.status === 'on-hold').length

    return { all, development, maintenance, active, completed, onHold }
})

// Methods
const resetForm = () => {
    Object.assign(formData, defaultForm)
    isEditing.value = false
    editingId.value = null
}

const openCreateModal = () => {
    resetForm()
    showModal.value = true
}

const openEditModal = (project: Project) => {
    Object.assign(formData, {
        name: project.name,
        type: project.type,
        status: project.status,
        dueDate: project.dueDate
    })
    isEditing.value = true
    editingId.value = project.id
    showModal.value = true
}

const handleSubmit = () => {
    if (!formData.name) return alert('Project name is required.')

    if (isEditing.value && editingId.value !== null) {
        const index = projects.value.findIndex(p => p.id === editingId.value)
        if (index !== -1) {
            projects.value[index] = {
                ...projects.value[index],
                name: formData.name,
                type: formData.type,
                status: formData.status,
                dueDate: formData.dueDate
            }
        }
    } else {
        const newId = projects.value.length > 0 ? Math.max(...projects.value.map(p => p.id)) + 1 : 1
        projects.value.push({
            id: newId,
            ...formData,
            progress: 0, // Default 0
            tasksCount: { todo: 0, inProgress: 0, review: 0, done: 0 } // Default empty
        })
    }
    
    closeModal()
}

const deleteProject = (id: number) => {
    if(confirm('Are you sure you want to delete this project?')) {
        projects.value = projects.value.filter(p => p.id !== id)
    }
}

const closeModal = () => {
    showModal.value = false
    resetForm()
}

const goToDetail = (id: number) => {
    router.push({ name: 'project-detail', params: { id } })
}

const handleCardAction = (action: string, project: Project) => {
    if (action === 'edit') openEditModal(project)
    if (action === 'delete') deleteProject(project.id)
    if (action === 'view') goToDetail(project.id)
}
</script>

<template>
    <div class="space-y-8">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <div class="text-2xl font-bold text-gray-900">{{ projectStats.all }}</div>
                <div class="text-sm text-gray-600">Total Projects</div>
            </div>
             <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <div class="text-2xl font-bold text-green-600">{{ projectStats.active }}</div>
                <div class="text-sm text-gray-600">Active</div>
            </div>
            </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div class="relative">
                        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input v-model="searchQuery" type="text" placeholder="Search projects..." class="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64">
                    </div>

                    <select v-model="selectedFilter" class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">All Types</option>
                        <option value="development">Development</option>
                        <option value="maintenance">Maintenance</option>
                    </select>

                     <select v-model="sortBy" class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="name">Sort by Name</option>
                        <option value="progress">Sort by Progress</option>
                        <option value="dueDate">Sort by Due Date</option>
                    </select>
                </div>

                <div class="flex items-center space-x-3">
                    <button @click="resetForm" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                        Reset
                    </button>
                    <button @click="openCreateModal" class="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg">
                        <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        New Project
                    </button>
                </div>
            </div>
        </div>

        <div v-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="project in filteredProjects" :key="project.id" class="relative group">
                <div class="absolute top-4 right-4 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click.stop="openEditModal(project)" class="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-gray-600" title="Edit">
                        ✏️
                    </button>
                    <button @click.stop="deleteProject(project.id)" class="p-2 bg-white rounded-lg shadow-sm hover:bg-red-50 text-red-600" title="Delete">
                        🗑️
                    </button>
                </div>

                <div @click="goToDetail(project.id)" class="cursor-pointer">
                    <ProjectCard :project="project" />
                </div>
            </div>
        </div>

        <div v-else class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div class="text-6xl mb-4">📋</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
        </div>

        <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="closeModal">
            <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all" @click.stop>
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-gray-900">
                        {{ isEditing ? 'Edit Project' : 'Create New Project' }}
                    </h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        ✕
                    </button>
                </div>
                
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                        <input v-model="formData.name" required type="text" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="Enter project name">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                            <select v-model="formData.type" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                                <option value="development">Development</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select v-model="formData.status" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                                <option value="active">Active</option>
                                <option value="on-hold">On Hold</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input v-model="formData.dueDate" required type="date" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-600">
                    </div>

                    <div class="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
                        <button type="button" @click="closeModal" class="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                            {{ isEditing ? 'Save Changes' : 'Create Project' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>