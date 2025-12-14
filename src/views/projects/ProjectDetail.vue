<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const projectId = route.params.id as string;

const project = ref({
    id: Number(projectId),
    name: 'E-Commerce Platform',
    description: 'Developing a full-featured e-commerce platform with payment gateway integration and inventory management.',
    status: 'active',
    progress: 75,
    dueDate: '2025-09-15',
    client: 'Acme Corp',
    team: [
        { id: 1, name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
        { id: 2, name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
        { id: 3, name: 'Bob Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
    ]
})

// -- Tabs Management --
const activeTab = ref('tasks');
const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks & Kanban' },
    { id: 'files', label: 'Files' },
    { id: 'team', label: 'Team Members' },
]

// -- Methods --
const goBack = () => {
    router.push({name:'projects'});
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

const statusColor = computed(() => {
    switch(project.value.status) {
        case 'active': return 'bg-green-100 text-green-700 border-green-200'
        case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200'
        case 'on-hold': return 'bg-amber-100 text-amber-700 border-amber-200'
        default: return 'bg-gray-100 text-gray-700'
    }
})

</script>

<template>
    <div class="space-y-6">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-sm">
            <button @click="goBack" class="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors group">
                <svg class="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                Back to Projects
            </button>

            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div class="flex-1">
                    <div class="flex items-center gap-4 mb-3">
                        <h1 class="text-3xl font-bold text-gray-900">{{ project.name }}</h1>
                        <span :class="['px-3 py-1 rounded-full text-xs font-semibold border capitalize', statusColor]">
                            {{ project.status }}
                        </span>
                    </div>
                    <p class="text-gray-600 max-w-2xl text-lg leading-relaxed">
                        {{ project.description }}
                    </p>
                    
                    <div class="flex items-center gap-6 mt-6 text-sm text-gray-500">
                        <div class="flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Due: {{ formatDate(project.dueDate) }}
                        </div>
                        <div class="flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            Client: {{ project.client }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col items-end min-w-[200px]">
                    <div class="text-right mb-2">
                        <span class="text-3xl font-bold text-blue-600">{{ project.progress }}%</span>
                        <span class="text-gray-500 text-sm ml-1">Complete</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" :style="`width: ${project.progress}%`"></div>
                    </div>
                    
                    <div class="flex -space-x-2 overflow-hidden">
                        <img v-for="member in project.team" :key="member.id" 
                            class="inline-block h-8 w-8 rounded-full ring-2 ring-white" 
                            :src="member.avatar" 
                            :alt="member.name"
                            :title="member.name"
                        />
                        <button class="h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center text-xs text-gray-500 hover:bg-gray-200">
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="border-b border-gray-200">
            <nav class="flex space-x-8" aria-label="Tabs">
                <button 
                    v-for="tab in tabs" 
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="[
                        activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
                    ]"
                >
                    {{ tab.label }}
                </button>
            </nav>
        </div>

        <div class="min-h-[400px]">
            <div v-if="activeTab === 'overview'" class="animate-fade-in">
                <div class="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 class="font-semibold text-lg mb-4">Project Summary</h3>
                    <p class="text-gray-600">Overview content goes here. You can add charts, recent activity logs, or detailed specs.</p>
                </div>
            </div>

            <div v-if="activeTab === 'tasks'" class="animate-fade-in">
                <div class="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
                    <div class="text-4xl mb-4">📊</div>
                    <h3 class="text-lg font-medium text-gray-900">Task Board</h3>
                    <p class="text-gray-500 mb-6">Kanban board or task list component will be placed here.</p>
                    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        Add First Task
                    </button>
                </div>
            </div>

            <div v-if="activeTab === 'team'" class="animate-fade-in">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div v-for="member in project.team" :key="member.id" class="flex items-center p-4 bg-white border border-gray-100 rounded-xl">
                        <img :src="member.avatar" class="w-12 h-12 rounded-full mr-4">
                        <div>
                            <div class="font-medium text-gray-900">{{ member.name }}</div>
                            <div class="text-sm text-gray-500">Developer</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div v-if="activeTab === 'files'" class="animate-fade-in">
                <p class="text-gray-500">File management placeholder.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>