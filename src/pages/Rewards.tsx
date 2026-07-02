import { EmptyState } from '@/components/shared/EmptyState'

export default function Rewards() {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Rewards</h1>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm">
        <EmptyState
          icon="??"
          title="Coming Soon"
          description="The Rewards feature is currently under development."
        />
      </div>
    </div>
  )
}
