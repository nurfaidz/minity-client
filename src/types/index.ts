export interface Task {
    id: number
    title: string
    projectId: number
    projectName: string
    status: 'todo' | 'in-progress' | 'review' | 'done'
    priority: 'low' | 'medium' | 'high'
    dueDate: string
    assignee?: string
}

export interface Project {
    id: number
    name: string
    type: 'development' | 'maintenance'
    status: 'active' | 'completed' | 'on-hold'
    progress: number
    dueDate: string
    description?: string 
    client?: string      
    team?: any[]         
    tasksCount: {
        todo: number
        inProgress: number
        review: number
        done: number
    }
}