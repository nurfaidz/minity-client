import { ref, computed, reactive } from 'vue';
import type { Task } from '../../types';

export function useTask() {
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
    ]);

    const filters = reactive({
        status: 'all',
        priority: 'all',
        project: 'all',
        search: ''
    })

    const sortBy = ref<'title' | 'priority' | 'dueDate' | 'status'>('dueDate')

    const filteredTasks = computed(() => {
        let result = tasks.value;

        if (filters.status !== 'all') {
            result = result.filter(t => t.status === filters.status);
        }

       if (filters.priority !== 'all') {
            result = result.filter(t => t.priority === filters.priority)
        }

        if (filters.project !== 'all') {
            result = result.filter(t => t.projectId === filters.project)
        }
        // 4. Search
        if (filters.search) {
            const query = filters.search.toLowerCase()
            result = result.filter(t => 
                t.title.toLowerCase().includes(query) ||
                t.projectName.toLowerCase().includes(query)
            )
        }

        return result.sort((a,b) => {
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
        const list = tasks.value 
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

    const clearFilters = () => {
        filters.status = 'all'
        filters.priority = 'all'
        filters.project = 'all'
        filters.search = ''
        sortBy.value = 'dueDate'
    }

    return {
        tasks,
        filters,
        sortBy,
        filteredTasks,
        groupedTasks,
        taskStats,
        clearFilters
    }
}