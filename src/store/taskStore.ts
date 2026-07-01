import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '@/types'
import { generateId } from '@/lib/utils'

interface TaskState {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleComplete: (id: string) => void
  reorderTasks: (tasks: Task[]) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [
        {
          id: '1', title: 'Complete Physics Assignment', description: 'Chapter 4 problems 1-20',
          priority: 'high', category: 'Assignment',
          deadline: new Date(Date.now() + 86400000).toISOString(),
          completed: false, isRecurring: false, createdAt: new Date().toISOString(),
        },
        {
          id: '2', title: 'Read Math Textbook Chapter 5', description: 'Pages 120-145',
          priority: 'medium', category: 'Study',
          deadline: new Date(Date.now() + 172800000).toISOString(),
          completed: false, isRecurring: false, createdAt: new Date().toISOString(),
        },
        {
          id: '3', title: 'Morning Exercise', description: '30 minutes cardio',
          priority: 'low', category: 'Health',
          completed: true, isRecurring: true,
          recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          createdAt: new Date().toISOString(),
        },
        {
          id: '4', title: 'Submit Lab Report', description: 'Chemistry lab experiment results',
          priority: 'high', category: 'Assignment',
          deadline: new Date(Date.now() + 259200000).toISOString(),
          completed: false, isRecurring: false, createdAt: new Date().toISOString(),
        },
      ],

      addTask: (task) => set((state) => ({
        tasks: [{ ...task, id: generateId(), createdAt: new Date().toISOString() }, ...state.tasks]
      })),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),

      toggleComplete: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      })),

      reorderTasks: (tasks) => set({ tasks }),
    }),
    { name: 'study-planner-tasks' }
  )
)
