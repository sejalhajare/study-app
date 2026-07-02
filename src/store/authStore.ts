import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { auth, db } from '@/lib/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
  addXP: (amount: number) => Promise<void>
  syncUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const userCred = await signInWithEmailAndPassword(auth, email, password)
          const userDoc = await getDoc(doc(db, 'users', userCred.user.uid))
          
          if (userDoc.exists()) {
            set({ user: userDoc.data() as User, isAuthenticated: true })
            return true
          }
          return false
        } catch (error) {
          console.error("Login failed:", error)
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true })
        try {
          const userCred = await createUserWithEmailAndPassword(auth, email, password)
          const newUser: User = {
            id: userCred.user.uid,
            name,
            email,
            level: 1,
            xp: 0,
            streak: 0,
            joinDate: new Date().toISOString(),
            bio: 'Passionate learner 📚',
          }
          await setDoc(doc(db, 'users', userCred.user.uid), newUser)
          set({ user: newUser, isAuthenticated: true })
          return true
        } catch (error) {
          console.error("Signup failed:", error)
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        await signOut(auth)
        set({ user: null, isAuthenticated: false })
      },

      updateUser: async (updates) => {
        const { user } = get()
        if (!user) return
        
        try {
          await updateDoc(doc(db, 'users', user.id), updates)
          set({ user: { ...user, ...updates } })
        } catch (error) {
          console.error("Failed to update user:", error)
        }
      },

      addXP: async (amount) => {
        const { user } = get()
        if (!user) return
        
        const newXP = user.xp + amount
        const newLevel = Math.floor(newXP / 100) + 1
        
        try {
          await updateDoc(doc(db, 'users', user.id), { xp: newXP, level: newLevel })
          set({ user: { ...user, xp: newXP, level: newLevel } })
        } catch (error) {
          console.error("Failed to add XP:", error)
        }
      },
      
      syncUser: async () => {
        const { user } = get()
        if (!user) return
        try {
          const userDoc = await getDoc(doc(db, 'users', user.id))
          if (userDoc.exists()) {
            set({ user: userDoc.data() as User })
          }
        } catch (error) {
          console.error("Failed to sync user:", error)
        }
      }
    }),
    { name: 'study-planner-auth' }
  )
)
