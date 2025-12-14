export const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        'todo': 'bg-gray-100 text-gray-700 border-gray-200',
        'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
        'review': 'bg-amber-100 text-amber-700 border-amber-200',
        'done': 'bg-emerald-100 text-emerald-700 border-emerald-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
}

export const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
        'todo': '⏳',
        'in-progress': '🔄',
        'review': '👀',
        'done': '✅'
    }
    return icons[status] || '⏳'
}