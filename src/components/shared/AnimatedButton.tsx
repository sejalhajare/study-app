import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

export function AnimatedButton({
  children, variant = 'primary', size = 'md', loading = false,
  icon, className, disabled, ...props
}: AnimatedButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-pink-300 to-lavender-300 text-white shadow-pink hover:shadow-glass',
    secondary: 'bg-white/80 text-pink-600 border border-pink-200 hover:bg-pink-50',
    ghost: 'bg-transparent text-pink-500 hover:bg-pink-50',
    danger: 'bg-red-100 text-red-600 border border-red-200 hover:bg-red-50',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center gap-2 font-semibold rounded-2xl transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </motion.button>
  )
}
