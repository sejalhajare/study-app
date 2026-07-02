import { useEffect } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore'
import { useAuthStore } from '@/store/authStore'
import { useTaskStore } from '@/store/taskStore'
import { useNoteStore } from '@/store/noteStore'
import { useSubjectStore } from '@/store/subjectStore'
import { useStudyStore } from '@/store/studyStore'
import { useCalendarStore } from '@/store/calendarStore'
import { DEFAULT_ACHIEVEMENTS, HABIT_DEFAULTS } from '@/data/constants'

export function useFirebaseSync() {
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user doc
        await useAuthStore.getState().syncUser()

        const studyStore = useStudyStore.getState()

        // Set up snapshot listeners
        const collections = [
          { name: 'tasks', setter: useTaskStore.getState().setTasks },
          { name: 'notes', setter: useNoteStore.getState().setNotes },
          { name: 'subjects', setter: useSubjectStore.getState().setSubjects },
          { name: 'events', setter: useCalendarStore.getState().setEvents },
          { name: 'assignments', setter: studyStore.setAssignments },
          { name: 'exams', setter: studyStore.setExams },
          { name: 'flashcards', setter: studyStore.setFlashcards },
          { name: 'habits', setter: studyStore.setHabits },
          { name: 'moods', setter: studyStore.setMoods },
          { name: 'water', setter: studyStore.setWater },
          { name: 'sleep', setter: studyStore.setSleep },
          { name: 'gpa', setter: studyStore.setGpaEntries },
          { name: 'quizzes', setter: studyStore.setQuizQuestions },
          { name: 'achievements', setter: studyStore.setAchievements },
        ]

        const unsubs = collections.map(col => {
          return onSnapshot(collection(db, 'users', user.uid, col.name), (snapshot) => {
            const data = snapshot.docs.map(doc => doc.data())
            
            // If achievements or habits are empty, initialize them
            if (col.name === 'achievements' && data.length === 0) {
              DEFAULT_ACHIEVEMENTS.forEach(a => {
                setDoc(doc(db, 'users', user.uid, 'achievements', a.id), a)
              })
              col.setter(DEFAULT_ACHIEVEMENTS as any)
            } else if (col.name === 'habits' && data.length === 0) {
              const defaultHabits = HABIT_DEFAULTS.map((h, i) => ({
                id: String(i + 1),
                ...h,
                targetDays: 7,
                completedDates: [],
                createdAt: new Date().toISOString(),
              }))
              defaultHabits.forEach(h => {
                setDoc(doc(db, 'users', user.uid, 'habits', h.id), h)
              })
              col.setter(defaultHabits as any)
            } else {
              col.setter(data as any)
            }
          })
        })

        // Also fetch settings
        const unsubsSettings = onSnapshot(doc(db, 'users', user.uid, 'settings', 'study'), (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data()
            if (data.dailyWaterGoal && data.dailySleepGoal) {
              useStudyStore.getState().setGoals(data.dailyWaterGoal, data.dailySleepGoal)
            }
          } else {
             setDoc(doc(db, 'users', user.uid, 'settings', 'study'), {
                dailyWaterGoal: useStudyStore.getState().dailyWaterGoal,
                dailySleepGoal: useStudyStore.getState().dailySleepGoal
             })
          }
        })

        return () => {
          unsubs.forEach(unsub => unsub())
          unsubsSettings()
        }
      } else {
        // Clear all stores
        useAuthStore.setState({ user: null, isAuthenticated: false })
        useTaskStore.getState().setTasks([])
        useNoteStore.getState().setNotes([])
        useSubjectStore.getState().setSubjects([])
        
        useStudyStore.getState().setAssignments([])
        useStudyStore.getState().setExams([])
        useStudyStore.getState().setFlashcards([])
        useStudyStore.getState().setHabits([])
        useStudyStore.getState().setMoods([])
        useStudyStore.getState().setWater([])
        useStudyStore.getState().setSleep([])
        useStudyStore.getState().setGpaEntries([])
        useStudyStore.getState().setQuizQuestions([])
        useStudyStore.getState().setAchievements(DEFAULT_ACHIEVEMENTS)
        useCalendarStore.getState().setEvents([])
      }
    })

    return () => unsubAuth()
  }, [])
}
