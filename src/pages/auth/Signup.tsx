import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function Signup() {
  const navigate = useNavigate()
  const { signup, isLoading } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!email.includes('@')) e.email = 'Valid email required'
    if (password.length < 6) e.password = 'Password must be at least 6 characters'
    if (password !== confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await signup(name, email, password)
    navigate('/')
  }

  const FloatingField = ({ error, children }: { error?: string; children: React.ReactNode }) => (
    <div>
      {children}
      {error && <p className="text-xs text-red-500 mt-1 pl-2">{error}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-[2rem] p-8 shadow-glass-lg">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-300 to-lavender-300 items-center justify-center text-3xl shadow-pink mb-4"
            >
              🎓
            </motion.div>
            <h1 className="text-2xl font-bold text-gradient">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Start your beautiful study journey 🌸</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FloatingField error={errors.name}>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                <input
                  type="text" placeholder="Full Name"
                  value={name} onChange={e => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3.5 rounded-2xl border bg-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all ${errors.name ? 'border-red-300' : 'border-pink-100 focus:border-pink-300'}`}
                />
              </div>
            </FloatingField>

            <FloatingField error={errors.email}>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                <input
                  type="email" placeholder="Email address"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3.5 rounded-2xl border bg-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all ${errors.email ? 'border-red-300' : 'border-pink-100 focus:border-pink-300'}`}
                />
              </div>
            </FloatingField>

            <FloatingField error={errors.password}>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                <input
                  type={showPassword ? 'text' : 'password'} placeholder="Password (min. 6 chars)"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3.5 rounded-2xl border bg-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all ${errors.password ? 'border-red-300' : 'border-pink-100 focus:border-pink-300'}`}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300 hover:text-pink-500">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FloatingField>

            <FloatingField error={errors.confirm}>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                <input
                  type="password" placeholder="Confirm password"
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3.5 rounded-2xl border bg-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all ${errors.confirm ? 'border-red-300' : 'border-pink-100 focus:border-pink-300'}`}
                />
              </div>
            </FloatingField>

            <motion.button
              type="submit" disabled={isLoading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-300 to-lavender-300 text-white font-bold text-sm shadow-pink hover:shadow-glass transition-all flex items-center justify-center gap-2"
            >
              {isLoading
                ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Sparkles size={16} /> Create Account</>}
            </motion.button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-500 font-semibold hover:text-pink-600">Sign in ✨</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
