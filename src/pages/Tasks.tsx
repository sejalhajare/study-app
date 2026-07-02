import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { 
  Plus, Search, Calendar, GripVertical, 
  CheckCircle2, Circle, Clock, Tag, Trash2, Pencil
} from 'lucide-react'
import { useTaskStore } from '@/store/taskStore'
import { GlassCard } from '@/components/shared/GlassCard'
import { AnimatedButton } from '@/components/shared/AnimatedButton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Modal } from '@/components/shared/Modal'
import { TASK_CATEGORIES, PRIORITY_CONFIG } from '@/data/constants'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/components/shared/Toast'
import type { Task } from '@/types'

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'medium' as Task['priority'],
  category: 'Study',
  deadline: '',
  isRecurring: false,
  recurringDays: [] as string[],
}

export default function Tasks() {
  const { tasks, toggleComplete, deleteTask, reorderTasks, addTask, updateTask } = useTaskStore()
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filterMode, setFilterMode] = useState<'all' | 'incomplete' | 'completed'>('incomplete')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory
    const matchesStatus = filterMode === 'all' 
      ? true 
      : filterMode === 'completed' ? t.completed : !t.completed
    return matchesSearch && matchesCategory && matchesStatus
  })

  const openCreate = () => {
    setEditingTask(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      category: task.category,
      deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : '',
      isRecurring: task.isRecurring,
      recurringDays: task.recurringDays || [],
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          ...form,
          deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
        })
        toast.success('Task updated!')
      } else {
        await addTask({
          ...form,
          completed: false,
          deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
        })
        toast.success('Task added!')
      }
      setModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteTask(id)
    toast.success('Task deleted!')
  }

  const handleToggle = async (id: string) => {
    await toggleComplete(id)
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    if (searchTerm || selectedCategory !== 'All' || filterMode !== 'all') return
    const newTasks = Array.from(tasks)
    const [removed] = newTasks.splice(result.source.index, 1)
    newTasks.splice(result.destination.index, 0, removed)
    reorderTasks(newTasks)
  }

  const completionPercentage = tasks.length === 0 ? 0 : Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">To-Do List ✅</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your tasks and stay organized</p>
        </div>
        <AnimatedButton icon={<Plus size={18} />} onClick={openCreate}>
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
          action={!searchTerm && <AnimatedButton icon={<Plus size={16} />} onClick={openCreate}>Create Task</AnimatedButton>}
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
                          <div 
                            {...provided.dragHandleProps} 
                            className="text-muted-foreground/30 hover:text-pink-400 cursor-grab active:cursor-grabbing p-1"
                          >
                            <GripVertical size={16} />
                          </div>

                          <button 
                            onClick={() => handleToggle(task.id)}
                            className={`shrink-0 transition-colors ${task.completed ? 'text-pink-500' : 'text-muted-foreground hover:text-pink-400'}`}
                          >
                            {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                          </button>

                          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className={`font-semibold text-sm truncate transition-all ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-xs text-muted-foreground truncate mt-0.5">{task.description}</p>
                              )}
                            </div>
                            
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
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => openEdit(task)}
                              className="p-2 rounded-xl text-muted-foreground/50 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              onClick={() => handleDelete(task.id)}
                              className="p-2 rounded-xl text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Add Task'}
        emoji="✅"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Task Title *</label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl border border-pink-100 bg-pink-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Description</label>
            <textarea
              placeholder="Add details..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-pink-100 bg-pink-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as Task['priority'] }))}
                className="w-full px-4 py-2.5 rounded-2xl border border-pink-100 bg-pink-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-2xl border border-pink-100 bg-pink-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                {TASK_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              min={new Date().toISOString().slice(0, 10)}
              onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-2xl border border-pink-100 bg-pink-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isRecurring}
                onChange={e => setForm(f => ({ ...f, isRecurring: e.target.checked }))}
                className="w-4 h-4 rounded accent-pink-400"
              />
              <span className="text-sm font-medium text-foreground">Recurring task</span>
            </label>
          </div>

          {form.isRecurring && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">Repeat on days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const days = form.recurringDays.includes(day)
                        ? form.recurringDays.filter(d => d !== day)
                        : [...form.recurringDays, day]
                      setForm(f => ({ ...f, recurringDays: days }))
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      form.recurringDays.includes(day)
                        ? 'bg-pink-400 text-white'
                        : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 py-3 rounded-2xl border border-pink-100 text-sm font-semibold text-muted-foreground hover:bg-pink-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-300 to-lavender-300 text-white font-bold text-sm shadow-pink hover:shadow-glass transition-all flex items-center justify-center gap-2"
            >
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
