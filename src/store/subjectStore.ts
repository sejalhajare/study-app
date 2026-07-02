import { create } from 'zustand'
import type { Subject } from '@/types'
import { auth, db } from '@/lib/firebase'
import { collection, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'

interface SubjectState {
  subjects: Subject[]
  setSubjects: (subjects: Subject[]) => void
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => Promise<void>
  updateSubject: (id: string, updates: Partial<Subject>) => Promise<void>
  deleteSubject: (id: string) => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
  addStudyHours: (id: string, hours: number) => Promise<void>
  markAttendance: (id: string, type: 'present' | 'absent' | 'late') => Promise<void>
}

export const useSubjectStore = create<SubjectState>()((set, get) => ({
  subjects: [],

  setSubjects: (subjects) => set({ subjects }),

  addSubject: async (subjectData) => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const subjectRef = doc(collection(db, 'users', userId, 'subjects'))
    const newSubject: Subject = {
      ...subjectData,
      id: subjectRef.id,
      createdAt: new Date().toISOString()
    }
    
    set((state) => ({ subjects: [...state.subjects, newSubject] }))
    
    try {
      await setDoc(subjectRef, newSubject)
    } catch (error) {
      console.error("Failed to add subject:", error)
      set((state) => ({ subjects: state.subjects.filter(s => s.id !== newSubject.id) }))
    }
  },

  updateSubject: async (id, updates) => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    set((state) => ({
      subjects: state.subjects.map(s => s.id === id ? { ...s, ...updates } : s)
    }))

    try {
      const subjectRef = doc(db, 'users', userId, 'subjects', id)
      await updateDoc(subjectRef, updates)
    } catch (error) {
      console.error("Failed to update subject:", error)
    }
  },

  deleteSubject: async (id) => {
    const userId = auth.currentUser?.uid
    if (!userId) return
    
    const { subjects } = get()
    const subjectToDelete = subjects.find(s => s.id === id)

    set((state) => ({ subjects: state.subjects.filter(s => s.id !== id) }))

    try {
      const subjectRef = doc(db, 'users', userId, 'subjects', id)
      await deleteDoc(subjectRef)
    } catch (error) {
      console.error("Failed to delete subject:", error)
      if (subjectToDelete) {
        set((state) => ({ subjects: [...state.subjects, subjectToDelete] }))
      }
    }
  },

  toggleFavorite: async (id) => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const { subjects } = get()
    const subject = subjects.find(s => s.id === id)
    if (!subject) return
    
    const newFavoriteState = !subject.isFavorite

    set((state) => ({
      subjects: state.subjects.map(s => s.id === id ? { ...s, isFavorite: newFavoriteState } : s)
    }))

    try {
      const subjectRef = doc(db, 'users', userId, 'subjects', id)
      await updateDoc(subjectRef, { isFavorite: newFavoriteState })
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
      set((state) => ({
        subjects: state.subjects.map(s => s.id === id ? { ...s, isFavorite: !newFavoriteState } : s)
      }))
    }
  },

  addStudyHours: async (id, hours) => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const { subjects } = get()
    const subject = subjects.find(s => s.id === id)
    if (!subject) return
    
    const newHours = subject.studyHours + hours

    set((state) => ({
      subjects: state.subjects.map(s => s.id === id ? { ...s, studyHours: newHours } : s)
    }))

    try {
      const subjectRef = doc(db, 'users', userId, 'subjects', id)
      await updateDoc(subjectRef, { studyHours: newHours })
    } catch (error) {
      console.error("Failed to add study hours:", error)
      set((state) => ({
        subjects: state.subjects.map(s => s.id === id ? { ...s, studyHours: subject.studyHours } : s)
      }))
    }
  },

  markAttendance: async (id, type) => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const { subjects } = get()
    const subject = subjects.find(s => s.id === id)
    if (!subject) return

    const newAttendance = { ...subject.attendance, [type]: subject.attendance[type] + 1 }

    set((state) => ({
      subjects: state.subjects.map(s => {
        if (s.id !== id) return s
        return { ...s, attendance: newAttendance }
      })
    }))

    try {
      const subjectRef = doc(db, 'users', userId, 'subjects', id)
      await updateDoc(subjectRef, { attendance: newAttendance })
    } catch (error) {
      console.error("Failed to mark attendance:", error)
      set((state) => ({
        subjects: state.subjects.map(s => {
          if (s.id !== id) return s
          return { ...s, attendance: subject.attendance }
        })
      }))
    }
  },
}))
