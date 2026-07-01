import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Pin, Star, MoreVertical, FileText, 
  CheckSquare, Tag as TagIcon, Image as ImageIcon, 
  Mic, FileUp, X
} from 'lucide-react'
import { useNoteStore } from '@/store/noteStore'
import { GlassCard } from '@/components/shared/GlassCard'
import { AnimatedButton } from '@/components/shared/AnimatedButton'
import { EmptyState } from '@/components/shared/EmptyState'
import { NOTE_CATEGORIES, NOTE_COLORS } from '@/data/constants'
import { formatDate } from '@/lib/utils'

export default function Notes() {
  const { notes, togglePin, toggleFavorite, deleteNote } = useNoteStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [view, setView] = useState<'grid' | 'masonry'>('grid')

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort: Pinned first, then by date descending
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notes 📝</h1>
          <p className="text-sm text-muted-foreground mt-1">Capture your thoughts and study materials</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <AnimatedButton icon={<Mic size={18} />} variant="secondary" className="flex-1 sm:flex-none">
            Voice Note
          </AnimatedButton>
          <AnimatedButton icon={<Plus size={18} />} className="flex-1 sm:flex-none">
            New Note
          </AnimatedButton>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white/40 p-2 rounded-2xl border border-pink-100/50 backdrop-blur-md">
        
        {/* Categories Scrollable */}
        <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          {NOTE_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category 
                  ? 'bg-gradient-to-r from-pink-300 to-lavender-300 text-white shadow-pink' 
                  : 'text-muted-foreground hover:bg-white/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/60 border border-pink-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {sortedNotes.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No Notes Found"
          description={searchTerm ? "Try a different search term or category" : "You haven't created any notes yet."}
          action={!searchTerm && <AnimatedButton icon={<Plus size={16} />}>Create Note</AnimatedButton>}
        />
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {sortedNotes.map(note => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <GlassCard 
                  hover 
                  padding="p-0"
                  className="h-full flex flex-col relative overflow-hidden group border-2 transition-all duration-300"
                  style={{ backgroundColor: note.color, borderColor: note.isPinned ? '#F8BBD0' : 'transparent' }}
                >
                  {/* Note Header */}
                  <div className="p-4 pb-2 flex justify-between items-start gap-2">
                    <h3 className="font-bold text-foreground line-clamp-2 text-sm leading-tight flex-1">
                      {note.title || 'Untitled'}
                    </h3>
                    <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); togglePin(note.id); }}
                        className={`p-1.5 rounded-lg transition-colors ${note.isPinned ? 'text-pink-500 bg-pink-100/50' : 'text-muted-foreground hover:bg-black/5'}`}
                      >
                        <Pin size={14} className={note.isPinned ? 'fill-current' : ''} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {/* Always visible pin if pinned */}
                    {note.isPinned && <div className="absolute top-4 right-4 text-pink-500 group-hover:hidden"><Pin size={14} className="fill-current" /></div>}
                  </div>

                  {/* Note Content */}
                  <div className="px-4 py-2 flex-1 cursor-pointer">
                    {note.isChecklist ? (
                      <div className="space-y-1.5">
                        {note.checklistItems?.slice(0, 4).map(item => (
                          <div key={item.id} className="flex items-start gap-2">
                            <CheckSquare size={14} className={`shrink-0 mt-0.5 ${item.completed ? 'text-pink-400' : 'text-muted-foreground'}`} />
                            <span className={`text-xs line-clamp-1 ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                        {(note.checklistItems?.length || 0) > 4 && (
                          <p className="text-xs text-muted-foreground italic pl-6">+ {(note.checklistItems?.length || 0) - 4} more items</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground line-clamp-6 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    )}
                  </div>

                  {/* Note Footer */}
                  <div className="p-4 pt-2 mt-auto border-t border-black/5">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-black/5 text-[10px] font-medium text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md bg-black/5 text-[10px] font-medium text-muted-foreground">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                      <span>{formatDate(note.updatedAt)}</span>
                      <div className="flex gap-2">
                        {note.category && <span className="flex items-center gap-1"><TagIcon size={10} /> {note.category}</span>}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
