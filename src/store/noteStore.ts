import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Note } from '@/types'
import { generateId } from '@/lib/utils'

interface NoteState {
  notes: Note[]
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  togglePin: (id: string) => void
  toggleFavorite: (id: string) => void
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      notes: [
        {
          id: '1', title: 'Newton\'s Laws of Motion', content: '1st Law: An object at rest stays at rest...\n2nd Law: F = ma\n3rd Law: Every action has an equal and opposite reaction.',
          color: '#FFF0F5', tags: ['physics', 'important'], category: 'Lecture',
          isPinned: true, isFavorite: true, isChecklist: false,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        },
        {
          id: '2', title: 'Study Goals This Week', content: '',
          color: '#F5F0FF', tags: ['goals'], category: 'Personal',
          isPinned: false, isFavorite: false, isChecklist: true,
          checklistItems: [
            { id: 'c1', text: 'Complete Math Chapter 5', completed: true },
            { id: 'c2', text: 'Read Physics textbook pg 120-140', completed: false },
            { id: 'c3', text: 'Practice 20 coding problems', completed: false },
          ],
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        },
        {
          id: '3', title: 'Calculus Formulas', content: 'Derivative of xⁿ = nxⁿ⁻¹\nIntegral of xⁿ = xⁿ⁺¹/(n+1) + C\nChain Rule: d/dx[f(g(x))] = f\'(g(x))·g\'(x)',
          color: '#FFF5ED', tags: ['math', 'formulas'], category: 'Reference',
          isPinned: true, isFavorite: false, isChecklist: false,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        },
      ],

      addNote: (note) => set((state) => ({
        notes: [{
          ...note,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, ...state.notes]
      })),

      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map(n => n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n)
      })),

      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id)
      })),

      togglePin: (id) => set((state) => ({
        notes: state.notes.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n)
      })),

      toggleFavorite: (id) => set((state) => ({
        notes: state.notes.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n)
      })),
    }),
    { name: 'study-planner-notes' }
  )
)
