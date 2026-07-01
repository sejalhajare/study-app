import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Notification } from '@/types'
import { generateId } from '@/lib/utils'

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
  searchOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
  setSearchOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      theme: 'light',
      notifications: [
        {
          id: '1', title: '🎉 Welcome!', message: 'Your study planner is ready. Start adding subjects!',
          type: 'info', read: false, createdAt: new Date().toISOString(),
        },
        {
          id: '2', title: '📚 Study Reminder', message: 'You have an assignment due tomorrow!',
          type: 'reminder', read: false, createdAt: new Date().toISOString(),
        },
      ],
      searchOpen: false,

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setTheme: (theme) => {
        set({ theme })
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      toggleTheme: () => {
        const { theme, setTheme } = get()
        setTheme(theme === 'light' ? 'dark' : 'light')
      },

      addNotification: (notification) => set((state) => ({
        notifications: [{
          ...notification,
          id: generateId(),
          read: false,
          createdAt: new Date().toISOString(),
        }, ...state.notifications]
      })),

      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),

      clearNotifications: () => set({ notifications: [] }),

      setSearchOpen: (open) => set({ searchOpen: open }),
    }),
    { name: 'study-planner-ui' }
  )
)
