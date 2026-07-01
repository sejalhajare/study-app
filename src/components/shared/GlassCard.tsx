import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  gradient?: boolean
  padding?: string
}

export function GlassCard({ children, className, hover = false, onClick, gradient = false, padding = 'p-6' }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        'rounded-3xl border transition-all duration-300',
        gradient
          ? 'bg-gradient-to-br from-pink-50/80 via-white/60 to-lavender-50/80'
          : 'bg-white/70 dark:bg-gray-800/60',
        'backdrop-blur-xl border-pink-100/50 dark:border-gray-700/50',
        'shadow-card',
        hover && 'cursor-pointer hover:shadow-glass',
        padding,
        className
      )}
    >
      {children}
    </motion.div>
  )
}
