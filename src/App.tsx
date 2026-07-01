import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { AppLayout } from '@/components/layout/AppLayout'

// Auth Pages
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'

// Placeholder for Dashboard
function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gradient mb-6">Dashboard coming soon! 🌸</h1>
    </div>
  )
}

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
            {/* We will add other routes here as we build them */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
