import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Subject } from '@/types'
import { generateId } from '@/lib/utils'

interface SubjectState {
  subjects: Subject[]
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => void
  updateSubject: (id: string, updates: Partial<Subject>) => void
  deleteSubject: (id: string) => void
  toggleFavorite: (id: string) => void
  addStudyHours: (id: string, hours: number) => void
  markAttendance: (id: string, type: 'present' | 'absent' | 'late') => void
}

export const useSubjectStore = create<SubjectState>()(
  persist(
    (set) => ({
      subjects: [
        {
          id: '1', name: 'Mathematics', color: '#F8BBD0', icon: '🧮',
          teacher: 'Dr. Smith', credits: 4, semester: 'Semester 3',
          attendance: { present: 18, absent: 2, late: 1 },
          progress: 72, studyHours: 24, isFavorite: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2', name: 'Physics', color: '#E1BEE7', icon: '⚗️',
          teacher: 'Prof. Johnson', credits: 3, semester: 'Semester 3',
          attendance: { present: 15, absent: 3, late: 2 },
          progress: 58, studyHours: 18, isFavorite: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3', name: 'Computer Science', color: '#B3E5FC', icon: '💻',
          teacher: 'Ms. Parker', credits: 4, semester: 'Semester 3',
          attendance: { present: 20, absent: 0, late: 1 },
          progress: 85, studyHours: 32, isFavorite: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '4', name: 'English Literature', color: '#C8E6C9', icon: '📚',
          teacher: 'Mrs. Davis', credits: 2, semester: 'Semester 3',
          attendance: { present: 16, absent: 4, late: 0 },
          progress: 64, studyHours: 12, isFavorite: false,
          createdAt: new Date().toISOString(),
        },
      ],

      addSubject: (subject) => set((state) => ({
        subjects: [...state.subjects, { ...subject, id: generateId(), createdAt: new Date().toISOString() }]
      })),

      updateSubject: (id, updates) => set((state) => ({
        subjects: state.subjects.map(s => s.id === id ? { ...s, ...updates } : s)
      })),

      deleteSubject: (id) => set((state) => ({
        subjects: state.subjects.filter(s => s.id !== id)
      })),

      toggleFavorite: (id) => set((state) => ({
        subjects: state.subjects.map(s => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s)
      })),

      addStudyHours: (id, hours) => set((state) => ({
        subjects: state.subjects.map(s => s.id === id ? { ...s, studyHours: s.studyHours + hours } : s)
      })),

      markAttendance: (id, type) => set((state) => ({
        subjects: state.subjects.map(s => {
          if (s.id !== id) return s
          return { ...s, attendance: { ...s.attendance, [type]: s.attendance[type] + 1 } }
        })
      })),
    }),
    { name: 'study-planner-subjects' }
  )
)
