import type { Achievement } from '@/types'

export const MOTIVATIONAL_QUOTES = [
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Education is the most powerful weapon you can use to change the world.", author: "Nelson Mandela" },
  { text: "Learning is not attained by chance; it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { text: "Study hard, for the well is deep, and our brains are shallow.", author: "Richard Baxter" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
]

export const NOTE_COLORS = [
  { name: 'Pink', value: '#FFF0F5', dark: '#F8BBD0' },
  { name: 'Lavender', value: '#F5F0FF', dark: '#E1BEE7' },
  { name: 'Peach', value: '#FFF5ED', dark: '#FFE0B2' },
  { name: 'Mint', value: '#F0FFF4', dark: '#C8E6C9' },
  { name: 'Sky', value: '#F0F8FF', dark: '#B3E5FC' },
  { name: 'Yellow', value: '#FFFDE7', dark: '#FFF9C4' },
  { name: 'Rose', value: '#FFF0F0', dark: '#FFCDD2' },
  { name: 'White', value: '#FFFFFF', dark: '#F5F5F5' },
]

export const SUBJECT_COLORS = [
  '#F8BBD0', '#E1BEE7', '#FFE0B2', '#C8E6C9',
  '#B3E5FC', '#FFF9C4', '#FFCCBC', '#D1C4E9',
  '#B2DFDB', '#F0F4C3', '#FFCDD2', '#CFD8DC',
]

export const SUBJECT_ICONS = [
  '📚', '🔬', '🧮', '🎨', '🌍', '💻', '🏛️', '🎵',
  '⚗️', '📐', '🦠', '📊', '🎭', '🌿', '🔭', '📜',
  '🧠', '💡', '🎯', '🏆', '🌸', '⭐', '🦋', '🌙',
]

export const HABIT_DEFAULTS = [
  { name: 'Wake Up Early', icon: '🌅', color: '#FFE0B2', category: 'lifestyle' as const },
  { name: 'Study', icon: '📚', color: '#F8BBD0', category: 'study' as const },
  { name: 'Reading', icon: '📖', color: '#E1BEE7', category: 'study' as const },
  { name: 'Workout', icon: '💪', color: '#C8E6C9', category: 'health' as const },
  { name: 'Water Intake', icon: '💧', color: '#B3E5FC', category: 'health' as const },
  { name: 'Sleep 8hrs', icon: '😴', color: '#D1C4E9', category: 'health' as const },
  { name: 'Meditation', icon: '🧘', color: '#FFF9C4', category: 'lifestyle' as const },
  { name: 'No Social Media', icon: '🚫', color: '#FFCDD2', category: 'lifestyle' as const },
]

export const MOOD_OPTIONS = [
  { mood: 'happy' as const, emoji: '😊', label: 'Happy', color: '#FFE0B2' },
  { mood: 'excited' as const, emoji: '🤩', label: 'Excited', color: '#F8BBD0' },
  { mood: 'normal' as const, emoji: '😐', label: 'Normal', color: '#E1BEE7' },
  { mood: 'sad' as const, emoji: '😢', label: 'Sad', color: '#B3E5FC' },
  { mood: 'stressed' as const, emoji: '😰', label: 'Stressed', color: '#FFCDD2' },
]

export const PRIORITY_CONFIG = {
  high: { label: 'High', color: 'bg-red-100 text-red-600 border-red-200' },
  medium: { label: 'Medium', color: 'bg-orange-100 text-orange-600 border-orange-200' },
  low: { label: 'Low', color: 'bg-green-100 text-green-600 border-green-200' },
}

export const GRADE_POINTS: Record<string, number> = {
  'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0,
}

export const TASK_CATEGORIES = [
  'Study', 'Assignment', 'Personal', 'Health', 'Project', 'Revision', 'Other'
]

export const NOTE_CATEGORIES = [
  'All', 'Lecture', 'Personal', 'Ideas', 'Important', 'Reference'
]

export const WATER_AMOUNTS = [150, 200, 250, 300, 350, 500]

export const POMODORO_PRESETS = [
  { label: '25 min', focus: 25, shortBreak: 5, longBreak: 15 },
  { label: '50 min', focus: 50, shortBreak: 10, longBreak: 30 },
  { label: 'Custom', focus: 0, shortBreak: 0, longBreak: 0 },
]

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: '1', name: 'First Step', description: 'Complete your first task', icon: '🌟', color: '#FFE0B2', type: 'tasks', requirement: 1, current: 0 },
  { id: '2', name: 'Note Taker', description: 'Create 10 notes', icon: '📝', color: '#F8BBD0', type: 'notes', requirement: 10, current: 0 },
  { id: '3', name: 'Scholar', description: 'Earn 500 XP', icon: '🎓', color: '#E1BEE7', type: 'xp', requirement: 500, current: 0 },
  { id: '4', name: 'Streak Master', description: 'Maintain a 7-day streak', icon: '🔥', color: '#FFCDD2', type: 'streak', requirement: 7, current: 0 },
  { id: '5', name: 'Study Pro', description: 'Study for 10 hours total', icon: '💪', color: '#C8E6C9', type: 'study', requirement: 600, current: 0 },
  { id: '6', name: 'Quiz Champion', description: 'Score 100% on a quiz', icon: '🏆', color: '#FFF9C4', type: 'quiz', requirement: 100, current: 0 },
]

export const AI_SUGGESTIONS = [
  "Explain photosynthesis in simple terms",
  "Create a study plan for my exams",
  "Generate flashcards for Chapter 3",
  "Give me study tips for memorization",
  "What are the key topics in calculus?",
  "Help me understand Newton's laws",
  "Quiz me on history",
  "Summarize my notes",
]

export const AI_RESPONSES: Record<string, string> = {
  default: "I'm here to help you study! Ask me anything about your subjects, and I'll do my best to explain concepts, create study plans, generate quizzes, or provide study tips. 🌸",
  quiz: "Let's quiz you! Here's a question:\n\n**What is the powerhouse of the cell?**\n\nA) Nucleus\nB) Mitochondria ✓\nC) Golgi Body\nD) Ribosome\n\nThe mitochondria generates most of the cell's ATP through cellular respiration!",
  study_tips: "Here are some proven study techniques:\n\n🍅 **Pomodoro Technique** – Study 25 mins, break 5 mins\n🗺️ **Mind Mapping** – Connect ideas visually\n📖 **Active Recall** – Test yourself instead of re-reading\n🔁 **Spaced Repetition** – Review at increasing intervals\n✍️ **Feynman Technique** – Teach the concept to learn it better",
  flashcards: "I've created some flashcards for you! Here's a preview:\n\n**Q:** What is photosynthesis?\n**A:** The process by which plants convert sunlight into chemical energy (glucose) using CO₂ and water.\n\nWould you like me to generate more flashcards? Just tell me the topic!",
}

export const XP_PER_LEVEL = 100
export const DAILY_WATER_GOAL = 2000 // ml
export const DEFAULT_SLEEP_GOAL = 8 // hours
