import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { 
  Plus, Search, Calendar, Bell, GripVertical, 
  CheckCircle2, Circle, Clock, Tag
} from 'lucide-react'
import { useTaskStore } from '@/store/taskStore'
import { GlassCard } from '@/components/shared/GlassCard'
import { AnimatedButton } from '@/components/shared/AnimatedButton'
import { EmptyState } from '@/components/shared/EmptyState'
import { TASK_CATEGORIES, PRIORITY_CONFIG } from '@/data/constants'
import { formatDate } from '@/lib/utils'

export default function Tasks() {
  const { tasks, toggleComplete, deleteTask, reorderTasks } = useTaskStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filterMode, setFilterMode] = useState<'all' | 'incomplete' | 'completed'>('incomplete')

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory
    const matchesStatus = filterMode === 'all' 
      ? true 
      : filterMode === 'completed' ? t.completed : !t.completed
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const sourceIndex = result.source.index
    const destIndex = result.destination.index

    if (sourceIndex === destIndex) return

    const newTasks = Array.from(tasks)
    
    // We need to map the filtered index back to the real tasks array index
    // For simplicity in this demo, if they are filtering, we disable drag and drop
    // or we only reorder if viewing "all" and no search. 
    // In a real app, we'd map indices properly.
    if (searchTerm || selectedCategory !== 'All' || filterMode !== 'all') {
      alert("Sorting is only available when viewing All Tasks without filters.")
      return
    }

    const [removed] = newTasks.splice(sourceIndex, 1)
    newTasks.splice(destIndex, 0, removed)
    reorderTasks(newTasks)
  }

  const completionPercentage = tasks.length === 0 ? 0 : Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">To-Do List ✅</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your tasks and stay organized</p>
        </div>
        <AnimatedButton icon={<Plus size={18} />}>
          Add Task
        </AnimatedButton>
      </div>

      {/* Progress Bar */}
      <GlassCard padding="p-4">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-xs font-semibold text-pink-500 uppercase tracking-wider">Overall Progress</p>
            <p className="text-sm font-medium text-foreground">{tasks.filter(t => t.completed).length} of {tasks.length} tasks completed</p>
          </div>
          <p className="text-2xl font-bold text-gradient-pink">{completionPercentage}%</p>
        </div>
        <div className="progress-bar h-3 bg-pink-100/50">
          <div className="progress-fill shadow-sm" style={{ width: `${completionPercentage}%` }} />
        </div>
      </GlassCard>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white/40 p-2 rounded-2xl border border-pink-100/50 backdrop-blur-md">
        
        {/* Status Filters */}
        <div className="flex gap-2 w-full md:w-auto p-1 bg-white/40 rounded-xl">
          {(['incomplete', 'completed', 'all'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterMode === mode ? 'bg-white shadow-sm text-pink-600' : 'text-muted-foreground hover:bg-white/50'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Categories Scrollable */}
        <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 w-full md:w-auto no-scrollbar flex-1 border-l border-pink-100/50 pl-2">
          {['All', ...TASK_CATEGORIES].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === category 
                  ? 'bg-pink-100 text-pink-700' 
                  : 'text-muted-foreground hover:bg-white/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-48 shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/60 border border-pink-100 text-xs focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
          />
        </div>
      </div>

      {/* List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon="✨"
          title="You're all caught up!"
          description={searchTerm ? "No tasks match your search criteria" : "Take a break or add a new task to your list."}
          action={!searchTerm && <AnimatedButton icon={<Plus size={16} />}>Create Task</AnimatedButton>}
        />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="space-y-3"
              >
                <AnimatePresence>
                  {filteredTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`group flex items-center gap-3 p-3 sm:p-4 rounded-2xl border bg-white/70 backdrop-blur-md transition-all ${
                            snapshot.isDragging ? 'shadow-glass-lg scale-[1.02] border-pink-300 z-50' : 'shadow-sm border-pink-100/50 hover:border-pink-200'
                          } ${task.completed ? 'opacity-60' : ''}`}
                        >
                          {/* Drag Handle */}
                          <div 
                            {...provided.dragHandleProps} 
                            className="text-muted-foreground/30 hover:text-pink-400 cursor-grab active:cursor-grabbing p-1"
                          >
                            <GripVertical size={16} />
                          </div>

                          {/* Checkbox */}
                          <button 
                            onClick={() => toggleComplete(task.id)}
                            className={`shrink-0 transition-colors ${task.completed ? 'text-pink-500' : 'text-muted-foreground hover:text-pink-400'}`}
                          >
                            {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                          </button>

                          {/* Content */}
                          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className={`font-semibold text-sm truncate transition-all ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-xs text-muted-foreground truncate mt-0.5">{task.description}</p>
                              )}
                            </div>
                            
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${PRIORITY_CONFIG[task.priority].color}`}>
                                {task.priority}
                              </span>
                              
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-medium text-muted-foreground">
                                <Tag size={10} /> {task.category}
                              </span>

                              {task.deadline && (
                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${
                                  new Date(task.deadline) < new Date() && !task.completed 
                                    ? 'bg-red-50 text-red-600' 
                                    : 'bg-lavender-50 text-lavender-700'
                                }`}>
                                  <Calendar size={10} /> {formatDate(task.deadline)}
                                </span>
                              )}
                              
                              {task.isRecurring && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-medium">
                                  <Clock size={10} /> Recurring
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="shrink-0 p-2 rounded-xl text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  )
}
