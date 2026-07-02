import { create } from 'zustand'
import type { Note } from '@/types'
import { auth, db } from '@/lib/firebase'
import { collection, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'

interface NoteState {
  notes: Note[]
  setNotes: (notes: Note[]) => void
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  togglePin: (id: string) => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
}

export const useNoteStore = create<NoteState>()((set, get) => ({
  notes: [],

  setNotes: (notes) => set({ notes }),

  addNote: async (noteData) => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const noteRef = doc(collection(db, 'users', userId, 'notes'))
    const newNote: Note = {
      ...noteData,
      id: noteRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    set((state) => ({ notes: [newNote, ...state.notes] }))
    
    try {
      await setDoc(noteRef, newNote)
    } catch (error) {
      console.error("Failed to add note:", error)
      set((state) => ({ notes: state.notes.filter(n => n.id !== newNote.id) }))
    }
  },

  updateNote: async (id, updates) => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const updatedAt = new Date().toISOString()

    set((state) => ({
      notes: state.notes.map(n => n.id === id ? { ...n, ...updates, updatedAt } : n)
    }))

    try {
      const noteRef = doc(db, 'users', userId, 'notes', id)
      await updateDoc(noteRef, { ...updates, updatedAt })
    } catch (error) {
      console.error("Failed to update note:", error)
    }
  },

  deleteNote: async (id) => {
    const userId = auth.currentUser?.uid
    if (!userId) return
    
    const { notes } = get()
    const noteToDelete = notes.find(n => n.id === id)

    set((state) => ({ notes: state.notes.filter(n => n.id !== id) }))

    try {
      const noteRef = doc(db, 'users', userId, 'notes', id)
      await deleteDoc(noteRef)
    } catch (error) {
      console.error("Failed to delete note:", error)
      if (noteToDelete) {
        set((state) => ({ notes: [...state.notes, noteToDelete] }))
      }
    }
  },

  togglePin: async (id) => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const { notes } = get()
    const note = notes.find(n => n.id === id)
    if (!note) return
    
    const newPinnedState = !note.isPinned

    set((state) => ({
      notes: state.notes.map(n => n.id === id ? { ...n, isPinned: newPinnedState } : n)
    }))

    try {
      const noteRef = doc(db, 'users', userId, 'notes', id)
      await updateDoc(noteRef, { isPinned: newPinnedState })
    } catch (error) {
      console.error("Failed to toggle pin:", error)
      set((state) => ({
        notes: state.notes.map(n => n.id === id ? { ...n, isPinned: !newPinnedState } : n)
      }))
    }
  },

  toggleFavorite: async (id) => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const { notes } = get()
    const note = notes.find(n => n.id === id)
    if (!note) return
    
    const newFavoriteState = !note.isFavorite

    set((state) => ({
      notes: state.notes.map(n => n.id === id ? { ...n, isFavorite: newFavoriteState } : n)
    }))

    try {
      const noteRef = doc(db, 'users', userId, 'notes', id)
      await updateDoc(noteRef, { isFavorite: newFavoriteState })
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
      set((state) => ({
        notes: state.notes.map(n => n.id === id ? { ...n, isFavorite: !newFavoriteState } : n)
      }))
    }
  },
}))
