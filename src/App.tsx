import React, { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { AppLayout } from '@/components/layout/AppLayout'
import { useFirebaseSync } from '@/hooks/useFirebaseSync'
import { useAuthStore } from '@/store/authStore'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'

// Auth Pages
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'

// Eagerly loaded core pages
import Dashboard from '@/pages/Dashboard'

// Lazy-loaded pages
const Subjects = lazy(() => import('@/pages/Subjects'))
const Notes = lazy(() => import('@/pages/Notes'))
const Tasks = lazy(() => import('@/pages/Tasks'))
const Calendar = lazy(() => import('@/pages/Calendar'))
const Pomodoro = lazy(() => import('@/pages/Pomodoro'))
const AIAssistant = lazy(() => import('@/pages/AIAssistant'))
const Flashcards = lazy(() => import('@/pages/Flashcards'))
const Quiz = lazy(() => import('@/pages/Quiz'))
const Assignments = lazy(() => import('@/pages/Assignments'))
const Attendance = lazy(() => import('@/pages/Attendance'))
const ExamPlanner = lazy(() => import('@/pages/ExamPlanner'))
const GPACalculator = lazy(() => import('@/pages/GPACalculator'))
const Habits = lazy(() => import('@/pages/Habits'))
const MoodTracker = lazy(() => import('@/pages/MoodTracker'))
const WaterTracker = lazy(() => import('@/pages/WaterTracker'))
const SleepTracker = lazy(() => import('@/pages/SleepTracker'))
const Statistics = lazy(() => import('@/pages/Statistics'))
const Rewards = lazy(() => import('@/pages/Rewards'))
const Motivation = lazy(() => import('@/pages/Motivation'))
const Settings = lazy(() => import('@/pages/Settings'))
const Profile = lazy(() => import('@/pages/Profile'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

function PageLoader() {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <LoadingSkeleton />
    </div>
  )
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initializeAuth, isInitialized } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-hero-gradient">
        <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}

function App() {
  useFirebaseSync()

  return (
    <ErrorBoundary>
      <AuthInitializer>
        <Router>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense></PublicRoute>} />

            {/* Protected App Routes */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/subjects" element={<Suspense fallback={<PageLoader />}><Subjects /></Suspense>} />
              <Route path="/notes" element={<Suspense fallback={<PageLoader />}><Notes /></Suspense>} />
              <Route path="/tasks" element={<Suspense fallback={<PageLoader />}><Tasks /></Suspense>} />
              <Route path="/calendar" element={<Suspense fallback={<PageLoader />}><Calendar /></Suspense>} />
              <Route path="/pomodoro" element={<Suspense fallback={<PageLoader />}><Pomodoro /></Suspense>} />
              <Route path="/ai" element={<Suspense fallback={<PageLoader />}><AIAssistant /></Suspense>} />
              <Route path="/flashcards" element={<Suspense fallback={<PageLoader />}><Flashcards /></Suspense>} />
              <Route path="/quiz" element={<Suspense fallback={<PageLoader />}><Quiz /></Suspense>} />
              <Route path="/assignments" element={<Suspense fallback={<PageLoader />}><Assignments /></Suspense>} />
              <Route path="/attendance" element={<Suspense fallback={<PageLoader />}><Attendance /></Suspense>} />
              <Route path="/exams" element={<Suspense fallback={<PageLoader />}><ExamPlanner /></Suspense>} />
              <Route path="/gpa" element={<Suspense fallback={<PageLoader />}><GPACalculator /></Suspense>} />
              <Route path="/habits" element={<Suspense fallback={<PageLoader />}><Habits /></Suspense>} />
              <Route path="/mood" element={<Suspense fallback={<PageLoader />}><MoodTracker /></Suspense>} />
              <Route path="/water" element={<Suspense fallback={<PageLoader />}><WaterTracker /></Suspense>} />
              <Route path="/sleep" element={<Suspense fallback={<PageLoader />}><SleepTracker /></Suspense>} />
              <Route path="/statistics" element={<Suspense fallback={<PageLoader />}><Statistics /></Suspense>} />
              <Route path="/rewards" element={<Suspense fallback={<PageLoader />}><Rewards /></Suspense>} />
              <Route path="/motivation" element={<Suspense fallback={<PageLoader />}><Motivation /></Suspense>} />
              <Route path="/settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
              <Route path="/profile" element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthInitializer>
    </ErrorBoundary>
  )
}

export default App
