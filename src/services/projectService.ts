import { Project } from "../types";

let mockProjects: Project[] = [
    {
        id: 1, name: 'E-Commerce Platform', type: 'development', status: 'active',
        progress: 75, dueDate: '2025-09-15',
        tasksCount: { todo: 5, inProgress: 3, review: 2, done: 12 }
    },
    {
        id: 2, name: 'Mobile App Update', type: 'maintenance', status: 'active',
        progress: 45, dueDate: '2025-08-30',
        tasksCount: { todo: 8, inProgress: 2, review: 1, done: 6 }
    },
]

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const projectService = {
    async getProjects(): Promise<Project[]> {
        await delay(500);
        return [...mockProjects];
    },
    async createProject(data: any): Promise<Project> {
        await delay(500);
        const newProject = { id: Math.random(), ...data, progress: 0, tasksCount: { todo: 0, inProgress: 0, review: 0, done: 0 } }
        mockProjects.push(newProject)
        return newProject
    },
    async updateProject(id: number, data: any): Promise<Project> {
        await delay(500)
        const idx = mockProjects.findIndex(p => p.id === id)
        if (idx !== -1) mockProjects[idx] = { ...mockProjects[idx], ...data }
        return mockProjects[idx]
    },
    async deleteProject(id: number): Promise<void> {
        await delay(500)
        mockProjects = mockProjects.filter(p => p.id !== id)
    }
}