import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MoreVertical, BookOpen, Clock, Calendar, CheckCircle2 } from 'lucide-react'
import { useSubjectStore } from '@/store/subjectStore'
import { GlassCard } from '@/components/shared/GlassCard'
import { AnimatedButton } from '@/components/shared/AnimatedButton'
import { EmptyState } from '@/components/shared/EmptyState'
import { SubjectModal } from '@/components/subjects/SubjectModal'
import { Subject } from '@/types'

export default function Subjects() {
  const { subjects, toggleFavorite, deleteSubject } = useSubjectStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | undefined>(undefined)

  const handleEdit = (subject: Subject) => {
    setSubjectToEdit(subject)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteSubject(id)
      } catch (error) {
        alert('Failed to delete subject')
      }
    }
  }

  const filteredSubjects = subjects.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || (filter === 'favorites' && s.isFavorite)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subjects 📚</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your classes and track your progress</p>
        </div>
        <AnimatedButton 
          icon={<Plus size={18} />} 
          onClick={() => { setSubjectToEdit(undefined); setIsModalOpen(true); }}
        >
          Add Subject
        </AnimatedButton>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40 p-2 rounded-2xl border border-pink-100/50 backdrop-blur-md">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-1 sm:flex-none ${filter === 'all' ? 'bg-white shadow-sm text-pink-600' : 'text-muted-foreground hover:bg-white/50'}`}
          >
            All Subjects
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-1 sm:flex-none ${filter === 'favorites' ? 'bg-white shadow-sm text-pink-600' : 'text-muted-foreground hover:bg-white/50'}`}
          >
            Favorites ⭐
          </button>
        </div>
        <input
          type="text"
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded-xl bg-white/60 border border-pink-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
        />
      </div>

      {/* Grid */}
      {filteredSubjects.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No Subjects Found"
          description={searchTerm ? "Try a different search term" : "You haven't added any subjects yet. Let's get started!"}
          action={!searchTerm && <AnimatedButton onClick={() => { setSubjectToEdit(undefined); setIsModalOpen(true); }} variant="secondary" icon={<Plus size={16} />}>Add Your First Subject</AnimatedButton>}
        />
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSubjects.map(subject => {
              const totalAttendance = subject.attendance?.present + subject.attendance?.absent + subject.attendance?.late || 0
              const attendancePercent = totalAttendance > 0 ? Math.round((subject.attendance.present / totalAttendance) * 100) : 0

              return (
                <motion.div
                  key={subject.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlassCard hover className="h-full flex flex-col relative overflow-hidden group">
                    <div 
                      className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500" 
                      style={{ backgroundColor: subject.color }} 
                    />
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                          style={{ backgroundColor: `${subject.color}40` }}
                        >
                          {subject.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-lg">{subject.name}</h3>
                          <p className="text-xs text-muted-foreground">{subject.teacher || 'No teacher assigned'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => toggleFavorite(subject.id)}
                          className="p-1.5 rounded-lg hover:bg-pink-50 transition-colors"
                        >
                          {subject.isFavorite ? '⭐' : <StarIcon />}
                        </button>
                        <button 
                          onClick={() => handleEdit(subject)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(subject.id, subject.name)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                      <div className="bg-white/50 rounded-xl p-3 border border-pink-50">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                          <CheckCircle2 size={12} className="text-pink-400" /> Tasks
                        </div>
                        <p className="font-semibold text-foreground">{subject.completedTasks || 0} / {subject.totalTasks || 0}</p>
                      </div>
                      <div className="bg-white/50 rounded-xl p-3 border border-pink-50">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                          <BookOpen size={12} className="text-lavender-400" /> Notes
                        </div>
                        <p className="font-semibold text-foreground">{subject.totalNotes || 0} Saved</p>
                      </div>
                    </div>

                    <div className="mt-auto space-y-4 relative z-10">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><BookOpen size={12} /> {subject.credits} Credits</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {subject.semester}</span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs font-medium mb-1.5">
                          <span>Course Progress</span>
                          <span>{subject.progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill shadow-sm" 
                            style={{ width: `${subject.progress}%`, backgroundColor: subject.color }} 
                          />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}

      <SubjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        subjectToEdit={subjectToEdit} 
      />
    </div>
  )
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
