// ============================================================
// All TypeScript interfaces for the Study Planner App
// ============================================================

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  level: number
  xp: number
  streak: number
  joinDate: string
  bio?: string
}

export interface Subject {
  id: string
  name: string
  subjectCode: string
  color: string
  icon: string
  teacher?: string
  credits: number
  semester: string
  description?: string
  attendance: { present: number; absent: number; late: number }
  progress: number
  totalTasks: number
  completedTasks: number
  totalNotes: number
  studyHours: number
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface Note {
  id: string
  title: string
  content: string
  color: string
  tags: string[]
  category: string
  subjectId?: string
  isPinned: boolean
  isFavorite: boolean
  isChecklist: boolean
  checklistItems?: ChecklistItem[]
  createdAt: string
  updatedAt: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: 'high' | 'medium' | 'low'
  category: string
  deadline?: string
  reminder?: string
  completed: boolean
  isRecurring: boolean
  recurringDays?: string[]
  subjectId?: string
  createdAt: string
}

export interface Assignment {
  id: string
  name: string
  subjectId: string
  subjectName: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed' | 'late'
  progress: number
  description?: string
  reminder?: string
  createdAt: string
}

export interface Exam {
  id: string
  name: string
  subjectId: string
  subjectName: string
  date: string
  duration: number
  location?: string
  priority: 'high' | 'medium' | 'low'
  difficulty: 'easy' | 'medium' | 'hard'
  preparationProgress: number
  revisionChecklist: { id: string; text: string; completed: boolean }[]
  studyPlan?: string
  createdAt: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  endDate?: string
  time?: string
  endTime?: string
  type: 'exam' | 'assignment' | 'holiday' | 'study' | 'personal' | 'class' | 'meeting' | 'reminder' | 'lecture'
  color: string
  description?: string
  subject?: string
  subjectId?: string
  priority?: 'high' | 'medium' | 'low'
  reminder?: string
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly'
  location?: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface FlashCard {
  id: string
  question: string
  answer: string
  subjectId?: string
  category: string
  isFavorite: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  reviewCount: number
  lastReviewed?: string
  createdAt: string
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'mcq' | 'true-false' | 'fill-blank'
  options?: string[]
  correctAnswer: string
  explanation?: string
  subjectId?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface QuizResult {
  id: string
  quizId: string
  score: number
  total: number
  timeTaken: number
  date: string
  answers: { questionId: string; answer: string; correct: boolean }[]
}

export interface Habit {
  id: string
  name: string
  icon: string
  color: string
  targetDays: number
  unit?: string
  dailyGoal?: number
  completedDates: string[]
  category: 'health' | 'study' | 'lifestyle' | 'custom'
  createdAt: string
}

export interface MoodEntry {
  id: string
  mood: 'happy' | 'excited' | 'normal' | 'sad' | 'stressed'
  emoji: string
  note?: string
  date: string
  time: string
}

export interface WaterEntry {
  id: string
  amount: number
  date: string
  time: string
}

export interface SleepEntry {
  id: string
  sleepTime: string
  wakeTime: string
  duration: number
  quality: 1 | 2 | 3 | 4 | 5
  notes?: string
  date: string
}

export interface PomodoroSession {
  id: string
  duration: number
  type: 'focus' | 'short-break' | 'long-break'
  subjectId?: string
  completedAt: string
}

export interface StudySession {
  id: string
  subjectId: string
  duration: number
  date: string
  notes?: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  color: string
  earnedAt?: string
  requirement: number
  current: number
  type: 'streak' | 'xp' | 'study' | 'tasks' | 'notes' | 'quiz'
}

export interface GPAEntry {
  id: string
  courseName: string
  credits: number
  grade: string
  semester: string
}

export interface NavItem {
  icon: string
  label: string
  path: string
  badge?: number
}

export interface Theme {
  mode: 'light' | 'dark'
  accent: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'reminder' | 'achievement' | 'info' | 'warning'
  read: boolean
  createdAt: string
}
