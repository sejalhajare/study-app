import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Assignment, Exam, FlashCard, Habit, MoodEntry, WaterEntry, SleepEntry, GPAEntry, CalendarEvent, QuizQuestion, Achievement } from '@/types'
import { generateId } from '@/lib/utils'
import { DEFAULT_ACHIEVEMENTS, HABIT_DEFAULTS, DAILY_WATER_GOAL } from '@/data/constants'

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

  // Assignments
  addAssignment: (a: Omit<Assignment, 'id' | 'createdAt'>) => void
  updateAssignment: (id: string, updates: Partial<Assignment>) => void
  deleteAssignment: (id: string) => void

  // Exams
  addExam: (e: Omit<Exam, 'id' | 'createdAt'>) => void
  updateExam: (id: string, updates: Partial<Exam>) => void
  deleteExam: (id: string) => void

  // Flashcards
  addFlashcard: (f: Omit<FlashCard, 'id' | 'createdAt'>) => void
  updateFlashcard: (id: string, updates: Partial<FlashCard>) => void
  deleteFlashcard: (id: string) => void
  toggleFlashcardFavorite: (id: string) => void

  // Habits
  addHabit: (h: Omit<Habit, 'id' | 'createdAt'>) => void
  deleteHabit: (id: string) => void
  toggleHabitDate: (id: string, date: string) => void

  // Mood
  addMood: (m: Omit<MoodEntry, 'id'>) => void
  deleteMood: (id: string) => void

  // Water
  addWater: (amount: number) => void
  deleteWaterEntry: (id: string) => void

  // Sleep
  addSleep: (s: Omit<SleepEntry, 'id'>) => void
  deleteSleep: (id: string) => void

  // GPA
  addGPAEntry: (g: Omit<GPAEntry, 'id'>) => void
  updateGPAEntry: (id: string, updates: Partial<GPAEntry>) => void
  deleteGPAEntry: (id: string) => void

  // Events
  addEvent: (e: Omit<CalendarEvent, 'id'>) => void
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void

  // Quiz
  addQuizQuestion: (q: Omit<QuizQuestion, 'id'>) => void
  deleteQuizQuestion: (id: string) => void

  // Achievements
  updateAchievement: (id: string, current: number) => void

  setDailyWaterGoal: (goal: number) => void
  setDailySleepGoal: (goal: number) => void
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      assignments: [
        {
          id: '1', name: 'Physics Lab Report', subjectId: '2', subjectName: 'Physics',
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
          priority: 'high', status: 'in-progress', progress: 60,
          description: 'Write up the results of the pendulum experiment',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2', name: 'Math Problem Set', subjectId: '1', subjectName: 'Mathematics',
          dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
          priority: 'medium', status: 'pending', progress: 20,
          description: 'Chapter 5 exercises 1-30',
          createdAt: new Date().toISOString(),
        },
      ],
      exams: [
        {
          id: '1', name: 'Calculus Mid-Term', subjectId: '1', subjectName: 'Mathematics',
          date: new Date(Date.now() + 86400000 * 14).toISOString(),
          duration: 120, priority: 'high', difficulty: 'hard',
          preparationProgress: 45,
          revisionChecklist: [
            { id: 'r1', text: 'Review derivatives', completed: true },
            { id: 'r2', text: 'Practice integration problems', completed: false },
            { id: 'r3', text: 'Study limits and continuity', completed: false },
          ],
          createdAt: new Date().toISOString(),
        },
      ],
      flashcards: [
        {
          id: '1', question: 'What is Newton\'s Second Law?', answer: 'F = ma (Force equals mass times acceleration)',
          category: 'Physics', difficulty: 'easy', isFavorite: true, reviewCount: 5,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2', question: 'What is the derivative of sin(x)?', answer: 'cos(x)',
          category: 'Mathematics', difficulty: 'medium', isFavorite: false, reviewCount: 3,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3', question: 'What is Ohm\'s Law?', answer: 'V = IR (Voltage = Current × Resistance)',
          category: 'Physics', difficulty: 'easy', isFavorite: false, reviewCount: 2,
          createdAt: new Date().toISOString(),
        },
      ],
      habits: HABIT_DEFAULTS.map((h, i) => ({
        id: String(i + 1),
        ...h,
        targetDays: 7,
        completedDates: [],
        createdAt: new Date().toISOString(),
      })),
      moods: [],
      water: [],
      sleep: [],
      gpaEntries: [
        { id: '1', courseName: 'Mathematics', credits: 4, grade: 'A', semester: 'Semester 1' },
        { id: '2', courseName: 'Physics', credits: 3, grade: 'B+', semester: 'Semester 1' },
        { id: '3', courseName: 'English', credits: 2, grade: 'A+', semester: 'Semester 1' },
      ],
      events: [
        {
          id: '1', title: 'Physics Exam', date: new Date(Date.now() + 86400000 * 14).toISOString(),
          type: 'exam', color: '#FFCDD2', time: '10:00 AM',
        },
        {
          id: '2', title: 'Math Assignment Due', date: new Date(Date.now() + 86400000 * 4).toISOString(),
          type: 'assignment', color: '#F8BBD0', time: '11:59 PM',
        },
        {
          id: '3', title: 'Study Group', date: new Date(Date.now() + 86400000 * 2).toISOString(),
          type: 'study', color: '#C8E6C9', time: '3:00 PM',
        },
      ],
      quizQuestions: [
        {
          id: '1', question: 'What is the chemical symbol for water?',
          type: 'mcq', options: ['H2O', 'CO2', 'NaCl', 'O2'],
          correctAnswer: 'H2O', difficulty: 'easy',
        },
        {
          id: '2', question: 'The Earth revolves around the Sun.',
          type: 'true-false', correctAnswer: 'true', difficulty: 'easy',
        },
        {
          id: '3', question: 'The speed of light is approximately ______ km/s.',
          type: 'fill-blank', correctAnswer: '300,000', difficulty: 'medium',
        },
      ],
      achievements: DEFAULT_ACHIEVEMENTS,
      dailyWaterGoal: DAILY_WATER_GOAL,
      dailySleepGoal: 8,

      addAssignment: (a) => set((state) => ({
        assignments: [{ ...a, id: generateId(), createdAt: new Date().toISOString() }, ...state.assignments]
      })),
      updateAssignment: (id, updates) => set((state) => ({
        assignments: state.assignments.map(a => a.id === id ? { ...a, ...updates } : a)
      })),
      deleteAssignment: (id) => set((state) => ({
        assignments: state.assignments.filter(a => a.id !== id)
      })),

      addExam: (e) => set((state) => ({
        exams: [{ ...e, id: generateId(), createdAt: new Date().toISOString() }, ...state.exams]
      })),
      updateExam: (id, updates) => set((state) => ({
        exams: state.exams.map(e => e.id === id ? { ...e, ...updates } : e)
      })),
      deleteExam: (id) => set((state) => ({
        exams: state.exams.filter(e => e.id !== id)
      })),

      addFlashcard: (f) => set((state) => ({
        flashcards: [{ ...f, id: generateId(), createdAt: new Date().toISOString() }, ...state.flashcards]
      })),
      updateFlashcard: (id, updates) => set((state) => ({
        flashcards: state.flashcards.map(f => f.id === id ? { ...f, ...updates } : f)
      })),
      deleteFlashcard: (id) => set((state) => ({
        flashcards: state.flashcards.filter(f => f.id !== id)
      })),
      toggleFlashcardFavorite: (id) => set((state) => ({
        flashcards: state.flashcards.map(f => f.id === id ? { ...f, isFavorite: !f.isFavorite } : f)
      })),

      addHabit: (h) => set((state) => ({
        habits: [...state.habits, { ...h, id: generateId(), createdAt: new Date().toISOString() }]
      })),
      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter(h => h.id !== id)
      })),
      toggleHabitDate: (id, date) => set((state) => ({
        habits: state.habits.map(h => {
          if (h.id !== id) return h
          const completed = h.completedDates.includes(date)
            ? h.completedDates.filter(d => d !== date)
            : [...h.completedDates, date]
          return { ...h, completedDates: completed }
        })
      })),

      addMood: (m) => set((state) => ({
        moods: [{ ...m, id: generateId() }, ...state.moods]
      })),
      deleteMood: (id) => set((state) => ({
        moods: state.moods.filter(m => m.id !== id)
      })),

      addWater: (amount) => set((state) => ({
        water: [{
          id: generateId(),
          amount,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(),
        }, ...state.water]
      })),
      deleteWaterEntry: (id) => set((state) => ({
        water: state.water.filter(w => w.id !== id)
      })),

      addSleep: (s) => set((state) => ({
        sleep: [{ ...s, id: generateId() }, ...state.sleep]
      })),
      deleteSleep: (id) => set((state) => ({
        sleep: state.sleep.filter(s => s.id !== id)
      })),

      addGPAEntry: (g) => set((state) => ({
        gpaEntries: [...state.gpaEntries, { ...g, id: generateId() }]
      })),
      updateGPAEntry: (id, updates) => set((state) => ({
        gpaEntries: state.gpaEntries.map(g => g.id === id ? { ...g, ...updates } : g)
      })),
      deleteGPAEntry: (id) => set((state) => ({
        gpaEntries: state.gpaEntries.filter(g => g.id !== id)
      })),

      addEvent: (e) => set((state) => ({
        events: [...state.events, { ...e, id: generateId() }]
      })),
      updateEvent: (id, updates) => set((state) => ({
        events: state.events.map(e => e.id === id ? { ...e, ...updates } : e)
      })),
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter(e => e.id !== id)
      })),

      addQuizQuestion: (q) => set((state) => ({
        quizQuestions: [...state.quizQuestions, { ...q, id: generateId() }]
      })),
      deleteQuizQuestion: (id) => set((state) => ({
        quizQuestions: state.quizQuestions.filter(q => q.id !== id)
      })),

      updateAchievement: (id, current) => set((state) => ({
        achievements: state.achievements.map(a => {
          if (a.id !== id) return a
          return { ...a, current, earnedAt: current >= a.requirement ? new Date().toISOString() : a.earnedAt }
        })
      })),

      setDailyWaterGoal: (goal) => set({ dailyWaterGoal: goal }),
      setDailySleepGoal: (goal) => set({ dailySleepGoal: goal }),
    }),
    { name: 'study-planner-study' }
  )
)
