import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { AppLayout } from '@/components/layout/AppLayout'

// Auth Pages
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'

// Pages
import Dashboard from '@/pages/Dashboard'
import Subjects from '@/pages/Subjects'
import Notes from '@/pages/Notes'
import Tasks from '@/pages/Tasks'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<div>Forgot Password</div>} />

          {/* Main App Routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/tasks" element={<Tasks />} />
            {/* We will add other routes here as we build them */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
