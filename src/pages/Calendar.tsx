import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Plus, Search, Calendar,
  Clock, MapPin, Tag, Trash2, Edit3, X, Check,
  BookOpen, Zap, Bell, Filter, ChevronDown
} from 'lucide-react'
import { useCalendarStore } from '@/store/calendarStore'
import { useSubjectStore } from '@/store/subjectStore'
import { useStudyStore } from '@/store/studyStore'
import { Modal } from '@/components/shared/Modal'
import { AnimatedButton } from '@/components/shared/AnimatedButton'
import type { CalendarEvent } from '@/types'

// ── Constants ───────────────────────────────────────────────────────────────
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

const EVENT_TYPES = [
  { value: 'assignment', label: 'Assignment', color: '#ff9bce', emoji: '📝' },
  { value: 'exam',       label: 'Exam',       color: '#ff7b72', emoji: '📋' },
  { value: 'study',      label: 'Study Session', color: '#79c0ff', emoji: '📚' },
  { value: 'lecture',    label: 'Lecture',    color: '#ffa657', emoji: '🎓' },
  { value: 'meeting',    label: 'Meeting',    color: '#d2a8ff', emoji: '🤝' },
  { value: 'reminder',   label: 'Reminder',   color: '#56d364', emoji: '🔔' },
  { value: 'holiday',    label: 'Holiday',    color: '#b9fbc0', emoji: '🌸' },
  { value: 'personal',   label: 'Personal',   color: '#ce93d8', emoji: '💖' },
  { value: 'class',      label: 'Class',      color: '#f0883e', emoji: '🏫' },
]

const REMINDER_OPTIONS = [
  { value: 'none',    label: 'No reminder' },
  { value: '10min',   label: '10 minutes before' },
  { value: '30min',   label: '30 minutes before' },
  { value: '1hour',   label: '1 hour before' },
  { value: '1day',    label: '1 day before' },
]

const PRIORITY_COLORS: Record<string, string> = {
  high: '#ff7b72', medium: '#ffa657', low: '#56d364'
}

const PRESET_COLORS = ['#ff9bce','#ff7b72','#79c0ff','#d2a8ff','#56d364','#ffa657','#b9fbc0','#ce93d8','#f0883e']

function getTypeInfo(type: string) {
  return EVENT_TYPES.find(t => t.value === type) ?? EVENT_TYPES[0]
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function startDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}
function today() {
  const n = new Date()
  return toDateStr(n.getFullYear(), n.getMonth(), n.getDate())
}

// ── EventFormModal ────────────────────────────────────────────────────────────
interface EventFormProps {
  isOpen: boolean
  onClose: () => void
  initialDate?: string
  eventToEdit?: CalendarEvent
}

function EventFormModal({ isOpen, onClose, initialDate, eventToEdit }: EventFormProps) {
  const { addEvent, updateEvent } = useCalendarStore()
  const { subjects } = useSubjectStore()

  const blank = {
    title: '', date: initialDate ?? today(), endDate: '',
    time: '', endTime: '', type: 'study' as const,
    color: '#79c0ff', description: '', subject: '',
    priority: 'medium' as const, reminder: 'none',
    repeat: 'none' as const, location: '',
  }

  const [form, setForm] = useState(blank)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Reset when open changes
  useMemo(() => {
    if (!isOpen) return
    if (eventToEdit) {
      setForm({
        title: eventToEdit.title,
        date: eventToEdit.date,
        endDate: eventToEdit.endDate ?? '',
        time: eventToEdit.time ?? '',
        endTime: eventToEdit.endTime ?? '',
        type: eventToEdit.type as any,
        color: eventToEdit.color,
        description: eventToEdit.description ?? '',
        subject: eventToEdit.subject ?? '',
        priority: (eventToEdit.priority ?? 'medium') as any,
        reminder: eventToEdit.reminder ?? 'none',
        repeat: (eventToEdit.repeat ?? 'none') as any,
        location: eventToEdit.location ?? '',
      })
    } else {
      setForm({ ...blank, date: initialDate ?? today() })
    }
    setError('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, eventToEdit, initialDate])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required'); return }
    if (!form.date) { setError('Date is required'); return }
    setLoading(true)
    try {
      if (eventToEdit) {
        await updateEvent(eventToEdit.id, form)
      } else {
        await addEvent(form)
      }
      onClose()
    } catch (err: any) {
      setError(err.message ?? 'Failed to save event')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'
  const labelCls = 'block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={eventToEdit ? 'Edit Event' : 'Add Event'} emoji="✨" size="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">{error}</div>}

        {/* Title */}
        <div>
          <label className={labelCls}>Event Title *</label>
          <input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Math Final Exam" required />
        </div>

        {/* Type + Color */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Event Type</label>
            <select className={inputCls} value={form.type} onChange={e => {
              const info = getTypeInfo(e.target.value)
              setForm(f => ({ ...f, type: e.target.value as any, color: info.color }))
            }}>
              {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Subject</label>
            <select className={inputCls} value={form.subject} onChange={e => set('subject', e.target.value)}>
              <option value="">— No subject —</option>
              {subjects.map(s => <option key={s.id} value={s.name}>{s.icon} {s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Date *</label>
            <input type="date" className={inputCls} value={form.date} onChange={e => set('date', e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>End Date</label>
            <input type="date" className={inputCls} value={form.endDate} onChange={e => set('endDate', e.target.value)} />
          </div>
        </div>

        {/* Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Start Time</label>
            <input type="time" className={inputCls} value={form.time} onChange={e => set('time', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>End Time</label>
            <input type="time" className={inputCls} value={form.endTime} onChange={e => set('endTime', e.target.value)} />
          </div>
        </div>

        {/* Priority + Reminder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Priority</label>
            <select className={inputCls} value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Reminder</label>
            <select className={inputCls} value={form.reminder} onChange={e => set('reminder', e.target.value)}>
              {REMINDER_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
        </div>

        {/* Repeat + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Repeat</label>
            <select className={inputCls} value={form.repeat} onChange={e => set('repeat', e.target.value)}>
              <option value="none">No Repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Location (Optional)</label>
            <input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Room 201" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelCls}>Description</label>
          <textarea className={`${inputCls} min-h-[70px] resize-none`} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Optional notes..." />
        </div>

        {/* Color */}
        <div>
          <label className={labelCls}>Color</label>
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map(c => (
              <button key={c} type="button" onClick={() => set('color', c)}
                className={`w-8 h-8 rounded-full transition-transform ${form.color === c ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors" disabled={loading}>Cancel</button>
          <AnimatedButton type="submit" loading={loading} disabled={loading}>
            {eventToEdit ? 'Save Changes' : 'Add Event'}
          </AnimatedButton>
        </div>
      </form>
    </Modal>
  )
}

// ── EventDetailModal ──────────────────────────────────────────────────────────
interface DetailProps {
  event: CalendarEvent | null
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
}
function EventDetailModal({ event, onClose, onEdit, onDelete, onToggle }: DetailProps) {
  if (!event) return null
  const info = getTypeInfo(event.type)
  return (
    <Modal isOpen={!!event} onClose={onClose} title={event.title} emoji={info.emoji} size="md">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: event.color }}>{info.label}</span>
          {event.priority && (
            <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: PRIORITY_COLORS[event.priority] ?? '#ccc' }}>
              {event.priority.toUpperCase()}
            </span>
          )}
          {event.completed && <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">✅ Done</span>}
        </div>

        <div className="space-y-2 text-sm">
          {event.subject && <div className="flex items-center gap-2 text-muted-foreground"><BookOpen size={14} /><span>{event.subject}</span></div>}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={14} />
            <span>{event.date}{event.endDate && event.endDate !== event.date ? ` → ${event.endDate}` : ''}</span>
          </div>
          {event.time && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock size={14} />
              <span>{event.time}{event.endTime ? ` – ${event.endTime}` : ''}</span>
            </div>
          )}
          {event.location && <div className="flex items-center gap-2 text-muted-foreground"><MapPin size={14} /><span>{event.location}</span></div>}
          {event.reminder && event.reminder !== 'none' && <div className="flex items-center gap-2 text-muted-foreground"><Bell size={14} /><span>Reminder: {REMINDER_OPTIONS.find(r => r.value === event.reminder)?.label}</span></div>}
          {event.repeat && event.repeat !== 'none' && <div className="flex items-center gap-2 text-muted-foreground"><Zap size={14} /><span>Repeats: {event.repeat}</span></div>}
        </div>

        {event.description && (
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">{event.description}</div>
        )}

        <div className="flex justify-between items-center gap-2 pt-2 border-t border-gray-100">
          <div className="flex gap-2">
            <button onClick={onDelete} className="px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 text-sm flex items-center gap-1.5 font-medium transition-colors"><Trash2 size={14} /> Delete</button>
            <button onClick={onToggle} className={`px-3 py-2 rounded-xl text-sm flex items-center gap-1.5 font-medium transition-colors ${event.completed ? 'text-orange-500 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}>
              <Check size={14} /> {event.completed ? 'Mark Pending' : 'Mark Done'}
            </button>
          </div>
          <AnimatedButton size="sm" onClick={onEdit} icon={<Edit3 size={14} />}>Edit</AnimatedButton>
        </div>
      </div>
    </Modal>
  )
}

// ── Main Calendar Component ────────────────────────────────────────────────────
export default function CalendarPage() {
  const { events, deleteEvent, toggleEventComplete } = useCalendarStore()
  const { assignments } = useStudyStore()

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [selectedDate, setSelectedDate] = useState<string>(today())
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formInitialDate, setFormInitialDate] = useState<string>()
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | undefined>()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Merge assignment deadlines into calendar events view
  const allEvents = useMemo(() => {
    const assignmentEvents: CalendarEvent[] = assignments
      .filter(a => a.dueDate)
      .map(a => ({
        id: `asgn-${a.id}`,
        title: a.name,
        date: a.dueDate,
        type: 'assignment' as const,
        color: '#ff9bce',
        description: a.description ?? '',
        subject: a.subjectName,
        priority: a.priority,
        completed: a.status === 'completed',
        createdAt: a.createdAt,
        updatedAt: a.createdAt,
      }))
    return [...events, ...assignmentEvents]
  }, [events, assignments])

  const filteredEvents = useMemo(() => {
    return allEvents.filter(e => {
      const matchesSearch = !searchTerm ||
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.subject ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.description ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || e.type === filterType ||
        (filterType === 'completed' && e.completed) ||
        (filterType === 'pending' && !e.completed)
      return matchesSearch && matchesType
    })
  }, [allEvents, searchTerm, filterType])

  const getEventsForDate = useCallback((dateStr: string) => {
    return filteredEvents.filter(e => e.date === dateStr)
  }, [filteredEvents])

  const nav = (dir: number) => {
    const d = new Date(year, month + dir)
    setYear(d.getFullYear())
    setMonth(d.getMonth())
  }

  const openAdd = (date?: string) => {
    setEventToEdit(undefined)
    setFormInitialDate(date ?? today())
    setIsFormOpen(true)
  }
  const openEdit = (event: CalendarEvent) => {
    setSelectedEvent(null)
    setEventToEdit(event)
    setIsFormOpen(true)
  }
  const handleDelete = async (event: CalendarEvent) => {
    if (!event.id.startsWith('asgn-') && window.confirm(`Delete "${event.title}"?`)) {
      setSelectedEvent(null)
      await deleteEvent(event.id)
    }
  }

  // ── Stats for header ───
  const todayStr = today()
  const todayEvents = getEventsForDate(todayStr)
  const upcomingExams = allEvents.filter(e => e.type === 'exam' && e.date >= todayStr && !e.completed).length
  const dueSoon = allEvents.filter(e => e.type === 'assignment' && e.date >= todayStr && !e.completed).length

  // ── Month grid ─────────────────────────────────────────────────────────────
  const totalDays = daysInMonth(year, month)
  const startDay = startDayOfMonth(year, month)
  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  const weeks = Math.ceil(cells.length / 7)
  while (cells.length < weeks * 7) cells.push(null)

  // ── Week view helpers ──────────────────────────────────────────────────────
  const getWeekDates = () => {
    const base = new Date(selectedDate)
    const day = base.getDay()
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base)
      d.setDate(base.getDate() - day + i)
      return toDateStr(d.getFullYear(), d.getMonth(), d.getDate())
    })
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-5">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar 📅</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your schedule & never miss a deadline</p>
        </div>
        <AnimatedButton icon={<Plus size={18} />} onClick={() => openAdd()}>Add Event</AnimatedButton>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Today's Events", value: todayEvents.length, emoji: '📆', color: 'from-pink-100 to-pink-50' },
          { label: 'Upcoming Exams', value: upcomingExams, emoji: '📋', color: 'from-red-100 to-red-50' },
          { label: 'Due Soon', value: dueSoon, emoji: '⏰', color: 'from-orange-100 to-orange-50' },
          { label: 'Total Events', value: allEvents.length, emoji: '✨', color: 'from-purple-100 to-purple-50' },
        ].map(stat => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 border border-white/50`}>
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-white/60 backdrop-blur-md rounded-2xl p-3 border border-pink-100/60">
        {/* Nav */}
        <div className="flex items-center gap-2">
          <button onClick={() => nav(-1)} className="p-2 rounded-xl hover:bg-pink-100 transition-colors"><ChevronLeft size={18} /></button>
          <button onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()) }}
            className="px-3 py-1.5 rounded-xl bg-pink-100 text-pink-700 text-sm font-semibold hover:bg-pink-200 transition-colors">Today</button>
          <button onClick={() => nav(1)} className="p-2 rounded-xl hover:bg-pink-100 transition-colors"><ChevronRight size={18} /></button>
          <h2 className="text-lg font-bold text-foreground ml-2">{MONTHS[month]} {year}</h2>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-52">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/80 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Search events..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 border border-gray-200 text-sm font-medium hover:bg-pink-50 transition-colors">
              <Filter size={14} /><span className="hidden sm:inline">Filter</span><ChevronDown size={12} />
            </button>
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-pink-100 z-40 min-w-48 p-2">
                  {[{ value: 'all', label: '🌈 All Events' }, { value: 'completed', label: '✅ Completed' }, { value: 'pending', label: '⏳ Pending' },
                    ...EVENT_TYPES.map(t => ({ value: t.value, label: `${t.emoji} ${t.label}` }))
                  ].map(f => (
                    <button key={f.value} onClick={() => { setFilterType(f.value); setShowFilters(false) }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-xl transition-colors ${filterType === f.value ? 'bg-pink-100 text-pink-700 font-semibold' : 'hover:bg-gray-50'}`}>
                      {f.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {(['month', 'week', 'day'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${view === v ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Calendar Body ── */}
      <AnimatePresence mode="wait">
        {/* MONTH VIEW */}
        {view === 'month' && (
          <motion.div key="month" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl border border-pink-100/60 overflow-hidden shadow-sm">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-pink-100">
              {DAYS.map(d => (
                <div key={d} className="py-3 text-center text-xs font-bold text-pink-500 uppercase tracking-wide">{d}</div>
              ))}
            </div>
            {/* Cells */}
            <div className="grid grid-cols-7" style={{ gridAutoRows: 'minmax(100px, auto)' }}>
              {cells.map((day, idx) => {
                const dateStr = day ? toDateStr(year, month, day) : ''
                const dayEvents = day ? getEventsForDate(dateStr) : []
                const isToday = dateStr === today()
                const isSelected = dateStr === selectedDate
                const isWeekend = idx % 7 === 0 || idx % 7 === 6

                return (
                  <div key={idx}
                    onClick={() => { if (day) { setSelectedDate(dateStr); setView('day') } }}
                    className={`border-r border-b border-pink-50 p-2 cursor-pointer transition-colors min-h-[100px] group
                      ${!day ? 'bg-gray-50/50' : isWeekend ? 'bg-pink-50/20' : 'hover:bg-pink-50/40'}
                      ${isSelected && day ? 'bg-pink-50' : ''}`}
                  >
                    {day && (
                      <>
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold mb-1 transition-all
                          ${isToday ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md' : 'text-foreground group-hover:bg-pink-100'}`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map(ev => (
                            <div key={ev.id}
                              onClick={e => { e.stopPropagation(); setSelectedEvent(ev) }}
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md truncate cursor-pointer hover:opacity-80 transition-opacity
                                ${ev.completed ? 'line-through opacity-50' : ''}`}
                              style={{ backgroundColor: ev.color + '30', color: ev.color, borderLeft: `2px solid ${ev.color}` }}>
                              {ev.time && <span className="mr-1 opacity-70">{ev.time.slice(0, 5)}</span>}
                              {ev.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-[10px] text-pink-500 font-semibold px-1">+{dayEvents.length - 3} more</div>
                          )}
                        </div>
                        {/* Quick add */}
                        <button onClick={e => { e.stopPropagation(); openAdd(dateStr) }}
                          className="hidden group-hover:flex mt-1 text-[10px] text-pink-400 hover:text-pink-600 items-center gap-0.5 transition-colors">
                          <Plus size={10} /> Add
                        </button>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* WEEK VIEW */}
        {view === 'week' && (
          <motion.div key="week" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl border border-pink-100/60 overflow-hidden shadow-sm">
            <div className="grid grid-cols-7 border-b border-pink-100">
              {getWeekDates().map((date, i) => {
                const d = new Date(date)
                const isToday = date === today()
                return (
                  <div key={date} className={`py-3 text-center cursor-pointer hover:bg-pink-50 transition-colors ${isToday ? 'bg-pink-50' : ''}`}
                    onClick={() => { setSelectedDate(date); setView('day') }}>
                    <div className="text-xs font-bold text-pink-400 uppercase">{DAYS[i]}</div>
                    <div className={`w-8 h-8 mx-auto mt-1 flex items-center justify-center rounded-full text-sm font-bold
                      ${isToday ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md' : 'text-foreground'}`}>
                      {d.getDate()}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="grid grid-cols-7 divide-x divide-pink-50 min-h-[400px] p-1 gap-1">
              {getWeekDates().map(date => {
                const dayEvs = getEventsForDate(date)
                return (
                  <div key={date} className="p-2 space-y-1">
                    {dayEvs.length === 0 && (
                      <button onClick={() => openAdd(date)} className="text-xs text-gray-300 hover:text-pink-400 w-full text-center mt-4 transition-colors">+ Add</button>
                    )}
                    {dayEvs.map(ev => (
                      <div key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        className={`text-[10px] font-semibold px-2 py-1.5 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${ev.completed ? 'opacity-50' : ''}`}
                        style={{ backgroundColor: ev.color + '25', borderLeft: `3px solid ${ev.color}`, color: ev.color }}>
                        {ev.time && <div className="text-[9px] opacity-70 mb-0.5">{ev.time.slice(0, 5)}</div>}
                        <div className="truncate text-gray-700">{ev.title}</div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* DAY VIEW */}
        {view === 'day' && (
          <motion.div key="day" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl border border-pink-100/60 overflow-hidden shadow-sm">
            {/* Day nav */}
            <div className="flex items-center justify-between p-4 border-b border-pink-100">
              <button onClick={() => {
                const d = new Date(selectedDate); d.setDate(d.getDate() - 1)
                setSelectedDate(toDateStr(d.getFullYear(), d.getMonth(), d.getDate()))
              }} className="p-2 rounded-xl hover:bg-pink-100 transition-colors"><ChevronLeft size={18} /></button>
              <div className="text-center">
                <div className="font-bold text-foreground">{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                {selectedDate === today() && <div className="text-xs text-pink-500 font-semibold">Today</div>}
              </div>
              <button onClick={() => {
                const d = new Date(selectedDate); d.setDate(d.getDate() + 1)
                setSelectedDate(toDateStr(d.getFullYear(), d.getMonth(), d.getDate()))
              }} className="p-2 rounded-xl hover:bg-pink-100 transition-colors"><ChevronRight size={18} /></button>
            </div>

            <div className="p-4">
              {(() => {
                const dayEvs = getEventsForDate(selectedDate)
                if (dayEvs.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                      <div className="text-6xl">🌸</div>
                      <p className="text-muted-foreground">No events today. Enjoy your free time!</p>
                      <AnimatedButton size="sm" icon={<Plus size={14} />} onClick={() => openAdd(selectedDate)}>Add Event</AnimatedButton>
                    </div>
                  )
                }
                const sorted = [...dayEvs].sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''))
                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-muted-foreground">{dayEvs.length} event{dayEvs.length !== 1 ? 's' : ''}</span>
                      <AnimatedButton size="sm" icon={<Plus size={14} />} onClick={() => openAdd(selectedDate)}>Add</AnimatedButton>
                    </div>
                    {sorted.map(ev => {
                      const info = getTypeInfo(ev.type)
                      return (
                        <motion.div key={ev.id} layout whileHover={{ scale: 1.01 }}
                          onClick={() => setSelectedEvent(ev)}
                          className={`p-4 rounded-2xl cursor-pointer border transition-all ${ev.completed ? 'opacity-60' : ''}`}
                          style={{ backgroundColor: ev.color + '15', borderColor: ev.color + '40' }}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: ev.color + '30' }}>
                                {info.emoji}
                              </div>
                              <div className="min-w-0">
                                <div className={`font-bold text-foreground truncate ${ev.completed ? 'line-through' : ''}`}>{ev.title}</div>
                                {ev.subject && <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Tag size={10} />{ev.subject}</div>}
                              </div>
                            </div>
                            <div className="text-right text-xs text-muted-foreground flex-shrink-0">
                              {ev.time && <div className="font-semibold">{ev.time.slice(0, 5)}{ev.endTime && ` – ${ev.endTime.slice(0, 5)}`}</div>}
                              {ev.priority && <div className="mt-1 px-2 py-0.5 rounded-full text-[10px] text-white font-bold inline-block" style={{ backgroundColor: PRIORITY_COLORS[ev.priority] }}>{ev.priority}</div>}
                            </div>
                          </div>
                          {ev.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{ev.description}</p>}
                          {ev.location && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin size={10} />{ev.location}</p>}
                        </motion.div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Upcoming Events Sidebar Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl border border-pink-100/60 p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Zap size={16} className="text-pink-400" /> Upcoming (Next 7 Days)</h3>
          <div className="space-y-2">
            {(() => {
              const t = new Date(); t.setHours(0,0,0,0)
              const limit = new Date(t); limit.setDate(t.getDate() + 7)
              const upcoming = filteredEvents
                .filter(e => {
                  const d = new Date(e.date + 'T12:00:00')
                  return d >= t && d <= limit && !e.completed
                })
                .sort((a, b) => a.date.localeCompare(b.date))
                .slice(0, 8)
              if (upcoming.length === 0) return <p className="text-sm text-muted-foreground py-4 text-center">🌸 Nothing scheduled in the next 7 days</p>
              return upcoming.map(ev => {
                const info = getTypeInfo(ev.type)
                return (
                  <div key={ev.id} onClick={() => setSelectedEvent(ev)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50/60 cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ backgroundColor: ev.color + '30' }}>{info.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm text-foreground truncate">{ev.title}</div>
                      <div className="text-xs text-muted-foreground">{ev.date}{ev.time && ` · ${ev.time.slice(0,5)}`}</div>
                    </div>
                    {ev.priority && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PRIORITY_COLORS[ev.priority] }} />}
                  </div>
                )
              })
            })()}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-pink-100/60 p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4">Event Types</h3>
          <div className="space-y-2">
            {EVENT_TYPES.map(t => (
              <button key={t.value} onClick={() => setFilterType(filterType === t.value ? 'all' : t.value)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-sm transition-colors ${filterType === t.value ? 'bg-pink-100' : 'hover:bg-gray-50'}`}>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                <span className="text-foreground">{t.emoji} {t.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{allEvents.filter(e => e.type === t.value).length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <EventFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialDate={formInitialDate}
        eventToEdit={eventToEdit}
      />
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={() => { if (selectedEvent) openEdit(selectedEvent) }}
        onDelete={() => { if (selectedEvent) handleDelete(selectedEvent) }}
        onToggle={async () => { if (selectedEvent && !selectedEvent.id.startsWith('asgn-')) { await toggleEventComplete(selectedEvent.id); setSelectedEvent(null) } }}
      />
    </div>
  )
}
