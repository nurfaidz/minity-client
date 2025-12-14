import { reactive, ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { taskService } from '../../services/taskService'
import type { Task } from '../../types'

export function useTasks() {
    const queryClient = useQueryClient()

    const { data: rawTasks, isLoading, isError } = useQuery({
        queryKey: ['tasks'],
        queryFn: taskService.getTasks,
        initialData: []
    })

    const filters = reactive({
        search: '',
        status: 'all',
        priority: 'all',
        project: 'all' as number | 'all'
    })

    const sortBy = ref<'title' | 'priority' | 'dueDate' | 'status'>('dueDate')

    const filteredTasks = computed(() => {
        let result = rawTasks.value || []
        
        if (filters.status !== 'all') {
            result = result.filter(t => t.status === filters.status)
        }
        if (filters.priority !== 'all') {
            result = result.filter(t => t.priority === filters.priority)
        }
        if (filters.project !== 'all') {
            result = result.filter(t => t.projectId === filters.project)
        }
        if (filters.search) {
            const query = filters.search.toLowerCase()
            result = result.filter(t => 
                t.title.toLowerCase().includes(query) || 
                t.projectName.toLowerCase().includes(query)
            )
        }

        return result.sort((a, b) => {
            switch (sortBy.value) {
                case 'title': return a.title.localeCompare(b.title)
                case 'priority': 
                    const pOrder = { high: 3, medium: 2, low: 1 }
                    return pOrder[b.priority] - pOrder[a.priority]
                case 'status':
                    const sOrder = { 'todo': 1, 'in-progress': 2, 'review': 3, 'done': 4 }
                    return sOrder[a.status] - sOrder[b.status]
                case 'dueDate':
                default:
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            }
        })
    })

    const groupedTasks = computed(() => {
        return {
            todo: filteredTasks.value.filter(t => t.status === 'todo'),
            'in-progress': filteredTasks.value.filter(t => t.status === 'in-progress'),
            review: filteredTasks.value.filter(t => t.status === 'review'),
            done: filteredTasks.value.filter(t => t.status === 'done')
        }
    })

    const taskStats = computed(() => {
        const list = rawTasks.value || []
        return {
            all: list.length,
            todo: list.filter(t => t.status === 'todo').length,
            inProgress: list.filter(t => t.status === 'in-progress').length,
            review: list.filter(t => t.status === 'review').length,
            done: list.filter(t => t.status === 'done').length,
            highPriority: list.filter(t => t.priority === 'high').length,
            overdue: list.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length
        }
    })

    const createMutation = useMutation({
        mutationFn: taskService.createTask,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: Partial<Task> }) => taskService.updateTask(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
    })

    const deleteMutation = useMutation({
        mutationFn: taskService.deleteTask,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
    })

    const resetFilters = () => {
        filters.search = ''
        filters.status = 'all'
        filters.priority = 'all'
        filters.project = 'all'
        sortBy.value = 'dueDate'
    }

    return {
        // Data
        filteredTasks,
        groupedTasks,
        taskStats,
        isLoading,
        
        // State
        filters,
        sortBy,

        // Actions
        createTask: createMutation.mutate,
        updateTask: updateMutation.mutate,
        deleteTask: deleteMutation.mutate,
        resetFilters,

        // Loading States
        isCreating: createMutation.isPending
    }
}