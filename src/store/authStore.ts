import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { generateId } from '@/lib/utils'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, _password: string, name?: string) => Promise<boolean>
  signup: (name: string, email: string, _password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  addXP: (amount: number) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string, name?: string) => {
        set({ isLoading: true })
        await new Promise(r => setTimeout(r, 800))
        const user: User = {
          id: generateId(),
          name: name || email.split('@')[0],
          email,
          level: 1,
          xp: 0,
          streak: 0,
          joinDate: new Date().toISOString(),
          bio: 'Passionate learner 📚',
        }
        set({ user, isAuthenticated: true, isLoading: false })
        return true
      },

      signup: async (name: string, email: string, _password: string) => {
        set({ isLoading: true })
        await new Promise(r => setTimeout(r, 1000))
        const user: User = {
          id: generateId(),
          name,
          email,
          level: 1,
          xp: 0,
          streak: 0,
          joinDate: new Date().toISOString(),
          bio: 'Passionate learner 📚',
        }
        set({ user, isAuthenticated: true, isLoading: false })
        return true
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateUser: (updates) => {
        const { user } = get()
        if (user) set({ user: { ...user, ...updates } })
      },

      addXP: (amount) => {
        const { user } = get()
        if (!user) return
        const newXP = user.xp + amount
        const newLevel = Math.floor(newXP / 100) + 1
        set({ user: { ...user, xp: newXP, level: newLevel } })
      },
    }),
    { name: 'study-planner-auth' }
  )
)
