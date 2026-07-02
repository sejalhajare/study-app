import { create } from 'zustand'
import type { Assignment, Exam, FlashCard, Habit, MoodEntry, WaterEntry, SleepEntry, GPAEntry, CalendarEvent, QuizQuestion, Achievement } from '@/types'
import { auth, db } from '@/lib/firebase'
import { collection, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { DEFAULT_ACHIEVEMENTS, DAILY_WATER_GOAL } from '@/data/constants'

interface StudyState {
  assignments: Assignment[]
  exams: Exam[]
  flashcards: FlashCard[]
  habits: Habit[]
  moods: MoodEntry[]
  water: WaterEntry[]
  sleep: SleepEntry[]
  gpaEntries: GPAEntry[]
  events: CalendarEvent[]
  quizQuestions: QuizQuestion[]
  achievements: Achievement[]
  dailyWaterGoal: number
  dailySleepGoal: number

  setAssignments: (data: Assignment[]) => void
  setExams: (data: Exam[]) => void
  setFlashcards: (data: FlashCard[]) => void
  setHabits: (data: Habit[]) => void
  setMoods: (data: MoodEntry[]) => void
  setWater: (data: WaterEntry[]) => void
  setSleep: (data: SleepEntry[]) => void
  setGpaEntries: (data: GPAEntry[]) => void
  setEvents: (data: CalendarEvent[]) => void
  setQuizQuestions: (data: QuizQuestion[]) => void
  setAchievements: (data: Achievement[]) => void
  setGoals: (water: number, sleep: number) => void

  addAssignment: (a: Omit<Assignment, 'id' | 'createdAt'>) => Promise<void>
  updateAssignment: (id: string, updates: Partial<Assignment>) => Promise<void>
  deleteAssignment: (id: string) => Promise<void>

  addExam: (e: Omit<Exam, 'id' | 'createdAt'>) => Promise<void>
  updateExam: (id: string, updates: Partial<Exam>) => Promise<void>
  deleteExam: (id: string) => Promise<void>

  addFlashcard: (f: Omit<FlashCard, 'id' | 'createdAt'>) => Promise<void>
  updateFlashcard: (id: string, updates: Partial<FlashCard>) => Promise<void>
  deleteFlashcard: (id: string) => Promise<void>
  toggleFlashcardFavorite: (id: string) => Promise<void>

  addHabit: (h: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  toggleHabitDate: (id: string, date: string) => Promise<void>

  addMood: (m: Omit<MoodEntry, 'id'>) => Promise<void>
  deleteMood: (id: string) => Promise<void>

  addWater: (amount: number) => Promise<void>
  deleteWaterEntry: (id: string) => Promise<void>

  addSleep: (s: Omit<SleepEntry, 'id'>) => Promise<void>
  deleteSleep: (id: string) => Promise<void>

  addGPAEntry: (g: Omit<GPAEntry, 'id'>) => Promise<void>
  updateGPAEntry: (id: string, updates: Partial<GPAEntry>) => Promise<void>
  deleteGPAEntry: (id: string) => Promise<void>

  addEvent: (e: Omit<CalendarEvent, 'id'>) => Promise<void>
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>

  addQuizQuestion: (q: Omit<QuizQuestion, 'id'>) => Promise<void>
  deleteQuizQuestion: (id: string) => Promise<void>

  updateAchievement: (id: string, current: number) => Promise<void>

  setDailyWaterGoal: (goal: number) => Promise<void>
  setDailySleepGoal: (goal: number) => Promise<void>
}

export const useStudyStore = create<StudyState>()((set, get) => ({
  assignments: [],
  exams: [],
  flashcards: [],
  habits: [],
  moods: [],
  water: [],
  sleep: [],
  gpaEntries: [],
  events: [],
  quizQuestions: [],
  achievements: DEFAULT_ACHIEVEMENTS,
  dailyWaterGoal: DAILY_WATER_GOAL,
  dailySleepGoal: 8,

  setAssignments: (data) => set({ assignments: data }),
  setExams: (data) => set({ exams: data }),
  setFlashcards: (data) => set({ flashcards: data }),
  setHabits: (data) => set({ habits: data }),
  setMoods: (data) => set({ moods: data }),
  setWater: (data) => set({ water: data }),
  setSleep: (data) => set({ sleep: data }),
  setGpaEntries: (data) => set({ gpaEntries: data }),
  setEvents: (data) => set({ events: data }),
  setQuizQuestions: (data) => set({ quizQuestions: data }),
  setAchievements: (data) => set({ achievements: data }),
  setGoals: (water, sleep) => set({ dailyWaterGoal: water, dailySleepGoal: sleep }),

  addAssignment: async (a) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    const ref = doc(collection(db, 'users', userId, 'assignments'))
    const item = { ...a, id: ref.id, createdAt: new Date().toISOString() }
    set(s => ({ assignments: [item, ...s.assignments] }))
    try { await setDoc(ref, item) } catch (e) { console.error(e) }
  },
  updateAssignment: async (id, updates) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    set(s => ({ assignments: s.assignments.map(x => x.id === id ? { ...x, ...updates } : x) }))
    try { await updateDoc(doc(db, 'users', userId, 'assignments', id), updates) } catch (e) { console.error(e) }
  },
  deleteAssignment: async (id) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    set(s => ({ assignments: s.assignments.filter(x => x.id !== id) }))
    try { await deleteDoc(doc(db, 'users', userId, 'assignments', id)) } catch (e) { console.error(e) }
  },

  addExam: async (e) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    const ref = doc(collection(db, 'users', userId, 'exams'))
    const item = { ...e, id: ref.id, createdAt: new Date().toISOString() }
    set(s => ({ exams: [item, ...s.exams] }))
    try { await setDoc(ref, item) } catch (err) { console.error(err) }
  },
  updateExam: async (id, updates) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    set(s => ({ exams: s.exams.map(x => x.id === id ? { ...x, ...updates } : x) }))
    try { await updateDoc(doc(db, 'users', userId, 'exams', id), updates) } catch (e) { console.error(e) }
  },
  deleteExam: async (id) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    set(s => ({ exams: s.exams.filter(x => x.id !== id) }))
    try { await deleteDoc(doc(db, 'users', userId, 'exams', id)) } catch (e) { console.error(e) }
  },

  addFlashcard: async (f) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    const ref = doc(collection(db, 'users', userId, 'flashcards'))
    const item = { ...f, id: ref.id, createdAt: new Date().toISOString() }
    set(s => ({ flashcards: [item, ...s.flashcards] }))
    try { await setDoc(ref, item) } catch (e) { console.error(e) }
  },
  updateFlashcard: async (id, updates) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    set(s => ({ flashcards: s.flashcards.map(x => x.id === id ? { ...x, ...updates } : x) }))
    try { await updateDoc(doc(db, 'users', userId, 'flashcards', id), updates) } catch (e) { console.error(e) }
  },
  deleteFlashcard: async (id) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    set(s => ({ flashcards: s.flashcards.filter(x => x.id !== id) }))
    try { await deleteDoc(doc(db, 'users', userId, 'flashcards', id)) } catch (e) { console.error(e) }
  },
  toggleFlashcardFavorite: async (id) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    const item = get().flashcards.find(f => f.id === id); if(!item) return;
    const state = !item.isFavorite;
    set(s => ({ flashcards: s.flashcards.map(x => x.id === id ? { ...x, isFavorite: state } : x) }))
    try { await updateDoc(doc(db, 'users', userId, 'flashcards', id), { isFavorite: state }) } catch (e) { console.error(e) }
  },

  addHabit: async (h) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    const ref = doc(collection(db, 'users', userId, 'habits'))
    const item = { ...h, id: ref.id, createdAt: new Date().toISOString() }
    set(s => ({ habits: [...s.habits, item] }))
    try { await setDoc(ref, item) } catch (e) { console.error(e) }
  },
  deleteHabit: async (id) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    set(s => ({ habits: s.habits.filter(x => x.id !== id) }))
    try { await deleteDoc(doc(db, 'users', userId, 'habits', id)) } catch (e) { console.error(e) }
  },
  toggleHabitDate: async (id, date) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    const habit = get().habits.find(h => h.id === id); if(!habit) return;
    const completed = habit.completedDates.includes(date)
      ? habit.completedDates.filter(d => d !== date)
      : [...habit.completedDates, date]
    set(s => ({ habits: s.habits.map(h => h.id === id ? { ...h, completedDates: completed } : h) }))
    try { await updateDoc(doc(db, 'users', userId, 'habits', id), { completedDates: completed }) } catch (e) { console.error(e) }
  },

  addMood: async (m) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    const ref = doc(collection(db, 'users', userId, 'moods'))
    const item = { ...m, id: ref.id }
    set(s => ({ moods: [item, ...s.moods] }))
    try { await setDoc(ref, item) } catch (e) { console.error(e) }
  },
  deleteMood: async (id) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    set(s => ({ moods: s.moods.filter(x => x.id !== id) }))
    try { await deleteDoc(doc(db, 'users', userId, 'moods', id)) } catch (e) { console.error(e) }
  },

  addWater: async (amount) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    const ref = doc(collection(db, 'users', userId, 'water'))
    const item = {
      id: ref.id,
      amount,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
    }
    set(s => ({ water: [item, ...s.water] }))
    try { await setDoc(ref, item) } catch (e) { console.error(e) }
  },
  deleteWaterEntry: async (id) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    set(s => ({ water: s.water.filter(x => x.id !== id) }))
    try { await deleteDoc(doc(db, 'users', userId, 'water', id)) } catch (e) { console.error(e) }
  },

  addSleep: async (s) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    const ref = doc(collection(db, 'users', userId, 'sleep'))
    const item = { ...s, id: ref.id }
    set(state => ({ sleep: [item, ...state.sleep] }))
    try { await setDoc(ref, item) } catch (e) { console.error(e) }
  },
  deleteSleep: async (id) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    set(s => ({ sleep: s.sleep.filter(x => x.id !== id) }))
    try { await deleteDoc(doc(db, 'users', userId, 'sleep', id)) } catch (e) { console.error(e) }
  },

  addGPAEntry: async (g) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    const ref = doc(collection(db, 'users', userId, 'gpa'))
    const item = { ...g, id: ref.id }
    set(s => ({ gpaEntries: [...s.gpaEntries, item] }))
    try { await setDoc(ref, item) } catch (e) { console.error(e) }
  },
  updateGPAEntry: async (id, updates) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    set(s => ({ gpaEntries: s.gpaEntries.map(x => x.id === id ? { ...x, ...updates } : x) }))
    try { await updateDoc(doc(db, 'users', userId, 'gpa', id), updates) } catch (e) { console.error(e) }
  },
  deleteGPAEntry: async (id) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    set(s => ({ gpaEntries: s.gpaEntries.filter(x => x.id !== id) }))
    try { await deleteDoc(doc(db, 'users', userId, 'gpa', id)) } catch (e) { console.error(e) }
  },

  addEvent: async (e) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    const ref = doc(collection(db, 'users', userId, 'events'))
    const item = { ...e, id: ref.id }
    set(s => ({ events: [...s.events, item] }))
    try { await setDoc(ref, item) } catch (err) { console.error(err) }
  },
  updateEvent: async (id, updates) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    set(s => ({ events: s.events.map(x => x.id === id ? { ...x, ...updates } : x) }))
    try { await updateDoc(doc(db, 'users', userId, 'events', id), updates) } catch (e) { console.error(e) }
  },
  deleteEvent: async (id) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    set(s => ({ events: s.events.filter(x => x.id !== id) }))
    try { await deleteDoc(doc(db, 'users', userId, 'events', id)) } catch (e) { console.error(e) }
  },

  addQuizQuestion: async (q) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    const ref = doc(collection(db, 'users', userId, 'quizzes'))
    const item = { ...q, id: ref.id }
    set(s => ({ quizQuestions: [...s.quizQuestions, item] }))
    try { await setDoc(ref, item) } catch (e) { console.error(e) }
  },
  deleteQuizQuestion: async (id) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    set(s => ({ quizQuestions: s.quizQuestions.filter(x => x.id !== id) }))
    try { await deleteDoc(doc(db, 'users', userId, 'quizzes', id)) } catch (e) { console.error(e) }
  },

  updateAchievement: async (id, current) => {
    const userId = auth.currentUser?.uid; if (!userId) return;
    const item = get().achievements.find(a => a.id === id); if(!item) return;
    const earnedAt = current >= item.requirement ? new Date().toISOString() : item.earnedAt;
    set(s => ({ achievements: s.achievements.map(a => a.id === id ? { ...a, current, earnedAt } : a) }))
    try { await updateDoc(doc(db, 'users', userId, 'achievements', id), { current, earnedAt }) } catch (e) { console.error(e) }
  },

  updateWaterGoal: async (userId: string, goal: number) => {
    if (!userId) return;
    try { await updateDoc(doc(db, 'users', userId, 'settings', 'study'), { dailyWaterGoal: goal }) } catch(_e) {}
  },
  
  updateSleepGoal: async (userId: string, goal: number) => {
    if (!userId) return;
    try { await updateDoc(doc(db, 'users', userId, 'settings', 'study'), { dailySleepGoal: goal }) } catch(_e) {}
  },
}))
