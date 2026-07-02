import { create } from 'zustand'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { generateId } from '@/lib/utils'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
}

interface ToastState {
  toasts: Toast[]
  show: (toast: Omit<Toast, 'id'>) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  remove: (id: string) => void
}

export const useToast = create<ToastState>()((set) => ({
  toasts: [],
  show: (toast) => {
    const id = generateId()
    set(s => ({ toasts: [...s.toasts, { ...toast, id }] }))
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 4000)
  },
  success: (title, message) => {
    const id = generateId()
    set(s => ({ toasts: [...s.toasts, { id, type: 'success', title, message }] }))
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 4000)
  },
  error: (title, message) => {
    const id = generateId()
    set(s => ({ toasts: [...s.toasts, { id, type: 'error', title, message }] }))
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 5000)
  },
  info: (title, message) => {
    const id = generateId()
    set(s => ({ toasts: [...s.toasts, { id, type: 'info', title, message }] }))
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 4000)
  },
  remove: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))

const icons = {
  success: <CheckCircle2 size={18} className="text-green-500" />,
  error: <XCircle size={18} className="text-red-500" />,
  info: <Info size={18} className="text-blue-500" />,
  warning: <AlertTriangle size={18} className="text-orange-500" />,
}

const colors = {
  success: 'border-green-100 bg-green-50/90',
  error: 'border-red-100 bg-red-50/90',
  info: 'border-blue-100 bg-blue-50/90',
  warning: 'border-orange-100 bg-orange-50/90',
}

export function ToastProvider() {
  const { toasts, remove } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-[200] space-y-2 max-w-xs w-full">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            className={`flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-lg ${colors[toast.type]}`}
          >
            <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{toast.title}</p>
              {toast.message && <p className="text-xs text-muted-foreground mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => remove(toast.id)}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 text-muted-foreground"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
