import type { Task } from '../types'

let mockTasks: Task[] = [
    {
        id: 1, title: 'Implement payment gateway', projectId: 1, projectName: 'E-Commerce Platform',
        status: 'in-progress', priority: 'high', dueDate: '2025-08-10', assignee: 'John Doe'
    },
    {
        id: 2, title: 'Fix mobile responsive issues', projectId: 2, projectName: 'Mobile App Update',
        status: 'review', priority: 'medium', dueDate: '2025-08-12', assignee: 'Jane Smith'
    },
    {
        id: 3, title: 'Update documentation', projectId: 1, projectName: 'E-Commerce Platform',
        status: 'todo', priority: 'low', dueDate: '2025-08-15'
    },
    {
        id: 4, title: 'Database optimization', projectId: 2, projectName: 'Mobile App Update',
        status: 'todo', priority: 'high', dueDate: '2025-08-08', assignee: 'Mike Johnson'
    }
]

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

export const taskService = {
    async getTasks(): Promise<Task[]> {
        await delay(500)
        return [...mockTasks]
    },

    async createTask(data: Omit<Task, 'id'>): Promise<Task> {
        await delay(500)
        const newTask = { id: Math.random(), ...data }
        mockTasks.push(newTask)
        return newTask
    },

    async updateTask(id: number, data: Partial<Task>): Promise<Task> {
        await delay(300) 
        const idx = mockTasks.findIndex(t => t.id === id)
        if (idx !== -1) mockTasks[idx] = { ...mockTasks[idx], ...data }
        return mockTasks[idx]
    },

    async deleteTask(id: number): Promise<void> {
        await delay(500)
        mockTasks = mockTasks.filter(t => t.id !== id)
    }
}