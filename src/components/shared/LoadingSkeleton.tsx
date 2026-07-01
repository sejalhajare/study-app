import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  count?: number
  height?: string
}

export function LoadingSkeleton({ className, count = 1, height = 'h-20' }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-3xl shimmer',
            'bg-gradient-to-r from-pink-50 via-pink-100/50 to-pink-50',
            height,
            className
          )}
        />
      ))}
    </>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-3xl bg-white/70 p-6 shadow-card space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl shimmer bg-pink-50" />
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded-full shimmer bg-pink-50 w-2/3" />
          <div className="h-3 rounded-full shimmer bg-pink-50 w-1/2" />
        </div>
      </div>
      <div className="h-3 rounded-full shimmer bg-pink-50" />
      <div className="h-3 rounded-full shimmer bg-pink-50 w-4/5" />
    </div>
  )
}
