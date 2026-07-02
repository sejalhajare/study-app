import { create } from 'zustand'
import type { CalendarEvent } from '@/types'
import { auth, db } from '@/lib/firebase'
import { collection, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'

interface CalendarState {
  events: CalendarEvent[]
  setEvents: (events: CalendarEvent[]) => void
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => Promise<void>
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  toggleEventComplete: (id: string) => Promise<void>
}

export const useCalendarStore = create<CalendarState>()((set, get) => ({
  events: [],

  setEvents: (events) => set({ events }),

  addEvent: async (eventData) => {
    const userId = auth.currentUser?.uid
    if (!userId) throw new Error('Not authenticated')

    const ref = doc(collection(db, 'users', userId, 'events'))
    const now = new Date().toISOString()
    const newEvent: CalendarEvent = {
      ...eventData,
      id: ref.id,
      completed: false,
      createdAt: now,
      updatedAt: now,
    }

    set((state) => ({ events: [...state.events, newEvent] }))

    try {
      await setDoc(ref, newEvent)
    } catch (error) {
      set((state) => ({ events: state.events.filter(e => e.id !== newEvent.id) }))
      throw error
    }
  },

  updateEvent: async (id, updates) => {
    const userId = auth.currentUser?.uid
    if (!userId) throw new Error('Not authenticated')

    const updatedData = { ...updates, updatedAt: new Date().toISOString() }

    set((state) => ({
      events: state.events.map(e => e.id === id ? { ...e, ...updatedData } : e)
    }))

    try {
      await updateDoc(doc(db, 'users', userId, 'events', id), updatedData)
    } catch (error) {
      throw error
    }
  },

  deleteEvent: async (id) => {
    const userId = auth.currentUser?.uid
    if (!userId) throw new Error('Not authenticated')

    const backup = get().events.find(e => e.id === id)
    set((state) => ({ events: state.events.filter(e => e.id !== id) }))

    try {
      await deleteDoc(doc(db, 'users', userId, 'events', id))
    } catch (error) {
      if (backup) set((state) => ({ events: [...state.events, backup] }))
      throw error
    }
  },

  toggleEventComplete: async (id) => {
    const event = get().events.find(e => e.id === id)
    if (!event) return
    await get().updateEvent(id, { completed: !event.completed })
  },
}))
