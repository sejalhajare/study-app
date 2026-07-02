import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Pin, Star, X, FileText, 
  CheckSquare, Tag as TagIcon, Pencil, Trash2
} from 'lucide-react'
import { useNoteStore } from '@/store/noteStore'
import { GlassCard } from '@/components/shared/GlassCard'
import { AnimatedButton } from '@/components/shared/AnimatedButton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Modal } from '@/components/shared/Modal'
import { NOTE_CATEGORIES, NOTE_COLORS } from '@/data/constants'
import { formatDate, generateId } from '@/lib/utils'
import { useToast } from '@/components/shared/Toast'
import type { Note, ChecklistItem } from '@/types'

const EMPTY_FORM = {
  title: '',
  content: '',
  color: '#FFF0F5',
  tags: [] as string[],
  category: 'Lecture',
  isPinned: false,
  isFavorite: false,
  isChecklist: false,
  checklistItems: [] as ChecklistItem[],
}

export default function Notes() {
  const { notes, togglePin, toggleFavorite, deleteNote, addNote, updateNote } = useNoteStore()
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  const openCreate = () => {
    setEditingNote(null)
    setForm(EMPTY_FORM)
    setTagInput('')
    setModalOpen(true)
  }

  const openEdit = (note: Note) => {
    setEditingNote(note)
    setForm({
      title: note.title,
      content: note.content,
      color: note.color,
      tags: [...note.tags],
      category: note.category,
      isPinned: note.isPinned,
      isFavorite: note.isFavorite,
      isChecklist: note.isChecklist,
      checklistItems: note.checklistItems ? [...note.checklistItems] : [],
    })
    setTagInput('')
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    try {
      if (editingNote) {
        await updateNote(editingNote.id, form)
        toast.success('Note updated!')
      } else {
        await addNote(form)
        toast.success('Note created!')
      }
      setModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteNote(id)
    toast.success('Note deleted!')
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }))
    }
    setTagInput('')
  }

  const addChecklistItem = () => {
    setForm(f => ({
      ...f,
      checklistItems: [...f.checklistItems, { id: generateId(), text: '', completed: false }]
    }))
  }

  const updateChecklistItem = (id: string, text: string) => {
    setForm(f => ({
      ...f,
      checklistItems: f.checklistItems.map(item => item.id === id ? { ...item, text } : item)
    }))
  }

  const toggleChecklistItem = (id: string) => {
    setForm(f => ({
      ...f,
      checklistItems: f.checklistItems.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    }))
  }

  const removeChecklistItem = (id: string) => {
    setForm(f => ({
      ...f,
      checklistItems: f.checklistItems.filter(item => item.id !== id)
    }))
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notes 📝</h1>
          <p className="text-sm text-muted-foreground mt-1">Capture your thoughts and study materials</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <AnimatedButton icon={<Plus size={18} />} onClick={openCreate} className="flex-1 sm:flex-none">
            New Note
          </AnimatedButton>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white/40 p-2 rounded-2xl border border-pink-100/50 backdrop-blur-md">
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
          action={!searchTerm && <AnimatedButton icon={<Plus size={16} />} onClick={openCreate}>Create Note</AnimatedButton>}
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
                        onClick={(e) => { e.stopPropagation(); openEdit(note) }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); togglePin(note.id) }}
                        className={`p-1.5 rounded-lg transition-colors ${note.isPinned ? 'text-pink-500 bg-pink-100/50' : 'text-muted-foreground hover:bg-black/5'}`}
                      >
                        <Pin size={14} className={note.isPinned ? 'fill-current' : ''} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(note.id) }}
                        className={`p-1.5 rounded-lg transition-colors ${note.isFavorite ? 'text-yellow-500 bg-yellow-50' : 'text-muted-foreground hover:bg-black/5'}`}
                      >
                        <Star size={14} className={note.isFavorite ? 'fill-current' : ''} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(note.id) }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {note.isPinned && <div className="absolute top-4 right-4 text-pink-500 group-hover:hidden"><Pin size={14} className="fill-current" /></div>}
                  </div>

                  {/* Note Content */}
                  <div className="px-4 py-2 flex-1 cursor-pointer" onClick={() => openEdit(note)}>
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
                        {note.isFavorite && <Star size={10} className="text-yellow-400 fill-current" />}
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

      {/* Create/Edit Note Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingNote ? 'Edit Note' : 'New Note'}
        emoji="📝"
        size="lg"
      >
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Title *</label>
            <input
              type="text"
              placeholder="Note title..."
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl border border-pink-100 bg-pink-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              autoFocus
            />
          </div>

          {/* Type toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, isChecklist: false }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!form.isChecklist ? 'bg-pink-100 text-pink-700' : 'text-muted-foreground hover:bg-pink-50'}`}
            >
              <FileText size={14} /> Text Note
            </button>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, isChecklist: true }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${form.isChecklist ? 'bg-pink-100 text-pink-700' : 'text-muted-foreground hover:bg-pink-50'}`}
            >
              <CheckSquare size={14} /> Checklist
            </button>
          </div>

          {/* Content */}
          {!form.isChecklist ? (
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Content</label>
              <textarea
                placeholder="Write your note here..."
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={8}
                className="w-full px-4 py-3 rounded-2xl border border-pink-100 bg-pink-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Checklist Items</label>
              <div className="space-y-2">
                {form.checklistItems.map(item => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="w-4 h-4 rounded accent-pink-400 shrink-0"
                    />
                    <input
                      type="text"
                      placeholder="List item..."
                      value={item.text}
                      onChange={e => updateChecklistItem(item.id, e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-xl border border-pink-100 bg-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                    />
                    <button onClick={() => removeChecklistItem(item.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addChecklistItem}
                  className="w-full py-2 rounded-xl border-2 border-dashed border-pink-200 text-sm text-pink-400 hover:bg-pink-50 transition-colors"
                >
                  + Add Item
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-2xl border border-pink-100 bg-pink-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                {NOTE_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Color</label>
              <div className="flex flex-wrap gap-2">
                {NOTE_COLORS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, color: c.value }))}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${form.color === c.value ? 'border-pink-500 scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-100 text-pink-700 text-xs">
                  {tag}
                  <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 rounded-xl border border-pink-100 bg-pink-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <button onClick={addTag} className="px-3 py-2 rounded-xl bg-pink-100 text-pink-700 text-sm font-semibold hover:bg-pink-200 transition-colors">Add</button>
            </div>
          </div>

          {/* Pin & Favorite */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPinned} onChange={e => setForm(f => ({ ...f, isPinned: e.target.checked }))} className="w-4 h-4 rounded accent-pink-400" />
              <span className="text-sm font-medium text-foreground">📌 Pin note</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFavorite} onChange={e => setForm(f => ({ ...f, isFavorite: e.target.checked }))} className="w-4 h-4 rounded accent-yellow-400" />
              <span className="text-sm font-medium text-foreground">⭐ Favorite</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-2xl border border-pink-100 text-sm font-semibold text-muted-foreground hover:bg-pink-50 transition-all">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-300 to-lavender-300 text-white font-bold text-sm shadow-pink hover:shadow-glass transition-all flex items-center justify-center gap-2"
            >
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {editingNote ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
