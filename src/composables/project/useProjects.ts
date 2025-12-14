import { reactive, ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { projectService } from '../../services/projectService'
import type { Project } from '../../types'

export function useProjects() {
    const queryClient = useQueryClient()

    const { data: rawProjects, isLoading, isError } = useQuery({
        queryKey: ['projects'],
        queryFn: projectService.getProjects,
        initialData: [] 
    })

    const filters = reactive({
        search: '',
        type: 'all',
        status: 'all'
    })
    
    const sortBy = ref<'name' | 'progress' | 'dueDate'>('name')

    const filteredProjects = computed(() => {
        let result = rawProjects.value || []

        if (filters.type !== 'all') {
            result = result.filter(p => p.type === filters.type)
        }
        if (filters.status !== 'all') {
            result = result.filter(p => p.status === filters.status)
        }
        if (filters.search) {
            const query = filters.search.toLowerCase()
            result = result.filter(p => p.name.toLowerCase().includes(query))
        }

        return result.sort((a, b) => {
            if (sortBy.value === 'name') return a.name.localeCompare(b.name)
            if (sortBy.value === 'progress') return b.progress - a.progress
            if (sortBy.value === 'dueDate') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            return 0
        })
    })

    const projectStats = computed(() => {
        const list = rawProjects.value || []
        return {
            all: list.length,
            development: list.filter(p => p.type === 'development').length,
            maintenance: list.filter(p => p.type === 'maintenance').length,
            active: list.filter(p => p.status === 'active').length,
            completed: list.filter(p => p.status === 'completed').length,
            onHold: list.filter(p => p.status === 'on-hold').length
        }
    })

    const createMutation = useMutation({
        mutationFn: projectService.createProject,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: any }) => projectService.updateProject(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
    })

    const deleteMutation = useMutation({
        mutationFn: projectService.deleteProject,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
    })

    const resetFilters = () => {
        filters.search = ''
        filters.type = 'all'
        filters.status = 'all'
        sortBy.value = 'name'
    }

    return {
        // Data Processed
        filteredProjects,
        projectStats,
        isLoading,
        isError,
        
        // State
        filters,
        sortBy,
        
        // Actions
        createProject: createMutation.mutate,
        updateProject: updateMutation.mutate,
        deleteProject: deleteMutation.mutate,
        resetFilters,
        
        // Loading States
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending
    }
}