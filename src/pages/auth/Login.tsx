import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields'); return }
    if (!email.includes('@')) { setError('Please enter a valid email'); return }
    await login(email, password)
    navigate('/')
  }

  const handleGoogleLogin = async () => {
    await login('demo@studybloom.app', 'demo', 'Demo Student')
    navigate('/')
  }

  const floatingItems = ['📚', '🌸', '✨', '🎓', '💡', '🌙', '⭐', '🦋']

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating decorations */}
      {floatingItems.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl select-none pointer-events-none"
          style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 3) * 25}%` }}
          animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        >
          {item}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="glass rounded-[2rem] p-8 shadow-glass-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-300 to-lavender-300 items-center justify-center text-3xl shadow-pink mb-4"
            >
              🌸
            </motion.div>
            <h1 className="text-2xl font-bold text-gradient">Welcome Back!</h1>
            <p className="text-sm text-muted-foreground mt-1">Your study journey continues here ✨</p>
          </div>

          {/* Google Login */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2 border-pink-100 bg-white/80 hover:bg-pink-50 transition-all duration-200 mb-6 font-medium text-sm text-foreground shadow-soft"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </motion.button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pink-100" />
            </div>
            <div className="relative text-center">
              <span className="px-3 bg-white/60 text-xs text-muted-foreground rounded-full">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-pink-100 bg-white/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3.5 rounded-2xl border border-pink-100 bg-white/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300 hover:text-pink-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-pink-400"
                />
                <span className="text-xs text-muted-foreground">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-pink-500 hover:text-pink-600 font-medium">
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-300 to-lavender-300 text-white font-bold text-sm shadow-pink hover:shadow-glass transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles size={16} />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-pink-500 font-semibold hover:text-pink-600">
              Sign up free ✨
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
