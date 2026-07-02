import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { auth, db, googleProvider } from '@/lib/firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  login: (email: string, password: string, rememberMe: boolean) => Promise<{success: boolean, error?: string}>
  signup: (name: string, email: string, password: string) => Promise<{success: boolean, error?: string}>
  loginWithGoogle: () => Promise<{success: boolean, error?: string}>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
  addXP: (amount: number) => Promise<void>
  syncUser: () => Promise<void>
  initializeAuth: () => void
}

const mapAuthError = (error: any) => {
  const code = error?.code || ''
  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') return 'Incorrect password'
  if (code === 'auth/user-not-found') return 'Account does not exist'
  if (code === 'auth/email-already-in-use') return 'Email already exists'
  if (code === 'auth/weak-password') return 'Password is too weak'
  if (code === 'auth/popup-closed-by-user') return 'Google login was cancelled'
  if (code === 'auth/network-request-failed') return 'Network error. Please check your connection.'
  return error?.message || 'An unexpected error occurred'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      initializeAuth: () => {
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
              if (userDoc.exists()) {
                set({ user: userDoc.data() as User, isAuthenticated: true, isInitialized: true })
              } else {
                // User exists in Auth but not Firestore (edge case)
                set({ user: null, isAuthenticated: false, isInitialized: true })
              }
            } catch (error) {
              console.error("Error fetching user data:", error)
              set({ user: null, isAuthenticated: false, isInitialized: true })
            }
          } else {
            set({ user: null, isAuthenticated: false, isInitialized: true })
          }
        })
      },

      login: async (email, password, rememberMe) => {
        set({ isLoading: true })
        try {
          await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)
          const userCred = await signInWithEmailAndPassword(auth, email, password)
          const userDoc = await getDoc(doc(db, 'users', userCred.user.uid))
          
          if (userDoc.exists()) {
            // Update lastLogin if you want, but simple read is fine here
            set({ user: userDoc.data() as User, isAuthenticated: true })
            return { success: true }
          }
          return { success: false, error: 'Account does not exist in database' }
        } catch (error: any) {
          console.error("Login failed:", error)
          return { success: false, error: mapAuthError(error) }
        } finally {
          set({ isLoading: false })
        }
      },

      signup: async (name, email, password) => {
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
          return { success: true }
        } catch (error: any) {
          console.error("Signup failed:", error)
          return { success: false, error: mapAuthError(error) }
        } finally {
          set({ isLoading: false })
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true })
        try {
          const userCred = await signInWithPopup(auth, googleProvider)
          const userRef = doc(db, 'users', userCred.user.uid)
          const userDoc = await getDoc(userRef)

          if (!userDoc.exists()) {
            // Create new user if they don't exist
            const newUser: User = {
              id: userCred.user.uid,
              name: userCred.user.displayName || 'Student',
              email: userCred.user.email || '',
              level: 1,
              xp: 0,
              streak: 0,
              joinDate: new Date().toISOString(),
              bio: 'Passionate learner 📚',
            }
            await setDoc(userRef, newUser)
            set({ user: newUser, isAuthenticated: true })
          } else {
            // Existing user
            set({ user: userDoc.data() as User, isAuthenticated: true })
          }
          return { success: true }
        } catch (error: any) {
          console.error("Google login failed:", error)
          return { success: false, error: mapAuthError(error) }
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        try {
          await signOut(auth)
          set({ user: null, isAuthenticated: false })
        } catch (error) {
          console.error("Logout error:", error)
        }
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
    { 
      name: 'study-planner-auth',
      // We only persist the user state partially, but it's better to let Firebase handle the real auth persistence.
      // This helps with immediate UI renders before Firebase onAuthStateChanged fires.
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
)
