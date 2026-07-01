import { motion } from 'framer-motion'
import { GlassCard } from './GlassCard'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: string
  color?: string
  trend?: { value: number; positive: boolean }
  delay?: number
}

export function StatCard({ title, value, subtitle, icon, color = '#F8BBD0', trend, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    >
      <GlassCard hover className="relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-8 translate-x-8"
          style={{ background: color }}
        />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            {trend && (
              <p className={`text-xs font-medium mt-1 ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% this week
              </p>
            )}
          </div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `${color}40` }}
          >
            {icon}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
