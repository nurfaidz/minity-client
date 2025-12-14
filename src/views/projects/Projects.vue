<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import ProjectCard from '../../components/ui/ProjectCard.vue'
import { useProjects } from '../../composables/project/useProjects'

const router = useRouter()

const { 
    filteredProjects, 
    projectStats, 
    filters, 
    sortBy, 
    isLoading,
    createProject, 
    updateProject, 
    deleteProject,
    resetFilters,
    isCreating 
} = useProjects()

// --- UI Logic (Modal & Form) ---
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const defaultForm = {
    name: '',
    type: 'development' as const,
    status: 'active' as const,
    dueDate: new Date().toISOString().split('T')[0],
}
const formData = reactive({ ...defaultForm })

const openCreateModal = () => {
    Object.assign(formData, defaultForm)
    isEditing.value = false
    showModal.value = true
}

const openEditModal = (project: any) => {
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
    if (!formData.name) return

    if (isEditing.value && editingId.value) {
        updateProject({ id: editingId.value, data: formData })
    } else {
        createProject(formData)
    }
    showModal.value = false
}

const handleDelete = (id: number) => {
    if (confirm('Delete project?')) deleteProject(id)
}

const goToDetail = (id: number) => router.push({ name: 'project-detail', params: { id } })
</script>

<template>
    <div class="space-y-8">
        
        <div v-if="isLoading" class="py-12 text-center text-gray-500 animate-pulse">
            Loading Projects Data...
        </div>

        <div v-else class="space-y-8">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                    <div class="text-2xl font-bold text-gray-900">{{ projectStats.all }}</div>
                    <div class="text-sm text-gray-600">Total</div>
                </div>
                 </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div class="relative">
                            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input v-model="filters.search" type="text" placeholder="Search projects..." class="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 w-full sm:w-64">
                        </div>

                        <select v-model="filters.type" class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                            <option value="all">All Types</option>
                            <option value="development">Development</option>
                            <option value="maintenance">Maintenance</option>
                        </select>

                        <select v-model="sortBy" class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                            <option value="name">Name</option>
                            <option value="progress">Progress</option>
                            <option value="dueDate">Due Date</option>
                        </select>
                    </div>

                    <div class="flex items-center space-x-3">
                        <button @click="resetFilters" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Reset</button>
                        <button @click="openCreateModal" class="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 shadow-lg">
                            New Project
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div v-for="project in filteredProjects" :key="project.id" class="relative group">
                    <div class="absolute top-4 right-4 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button @click.stop="openEditModal(project)" class="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-gray-600">✏️</button>
                        <button @click.stop="handleDelete(project.id)" class="p-2 bg-white rounded-lg shadow-sm hover:bg-red-50 text-red-600">🗑️</button>
                    </div>
                    <div @click="goToDetail(project.id)" class="cursor-pointer">
                        <ProjectCard :project="project" />
                    </div>
                </div>
            </div>

            <div v-else class="text-center p-12 bg-white/80 rounded-2xl border border-gray-100">
                <div class="text-6xl mb-4">📋</div>
                <h3 class="text-xl font-semibold text-gray-900">No projects found</h3>
            </div>
        </div>

        <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                <h3 class="text-xl font-bold mb-6">{{ isEditing ? 'Edit Project' : 'New Project' }}</h3>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <input v-model="formData.name" placeholder="Project Name" class="w-full px-4 py-2 border rounded-xl" required />
                    <div class="flex justify-end gap-3 mt-6">
                        <button type="button" @click="showModal = false" class="px-4 py-2 text-gray-600">Cancel</button>
                        <button type="submit" :disabled="isCreating" class="px-6 py-2 bg-blue-600 text-white rounded-xl">
                            {{ isCreating ? 'Saving...' : 'Save' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</template>