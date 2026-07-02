import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Sparkles } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.includes('@')) { setError('Please enter a valid email'); return }
    setIsLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err: any) {
      const code = err?.code || ''
      if (code === 'auth/user-not-found') {
        setError('Account does not exist')
      } else {
        setError(err.message || 'Failed to send reset email')
      }
    } finally {
      setIsLoading(false)
    }
  }

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
            <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-300 to-lavender-300 items-center justify-center text-3xl shadow-pink mb-4">
              🔑
            </div>
            <h1 className="text-2xl font-bold text-gradient">Reset Password</h1>
            <p className="text-sm text-muted-foreground mt-1">We'll send you a reset link ✨</p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">📧</div>
              <p className="font-semibold text-foreground">Email sent!</p>
              <p className="text-sm text-muted-foreground">Check your inbox for the password reset link.</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-300 to-lavender-300 text-white font-bold text-sm shadow-pink"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-center">
                  {error}
                </div>
              )}
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-pink-100 bg-white/60 text-sm focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all"
                />
              </div>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-300 to-lavender-300 text-white font-bold text-sm shadow-pink flex items-center justify-center gap-2"
              >
                {isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Sparkles size={16} /> Send Reset Email</>}
              </motion.button>
            </form>
          )}

          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link to="/login" className="text-pink-500 font-semibold hover:text-pink-600 flex items-center justify-center gap-1">
              <ArrowLeft size={12} /> Back to Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
