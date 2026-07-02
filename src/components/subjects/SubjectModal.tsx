import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/shared/Modal'
import { AnimatedButton } from '@/components/shared/AnimatedButton'
import { useSubjectStore } from '@/store/subjectStore'
import { Subject } from '@/types'

interface SubjectModalProps {
  isOpen: boolean
  onClose: () => void
  subjectToEdit?: Subject
}

const PRESET_COLORS = ['#ff7b72', '#79c0ff', '#d2a8ff', '#56d364', '#ffa657', '#f0883e', '#ff9bce', '#b9fbc0']
const PRESET_ICONS = ['📚', '🔬', '💻', '🧮', '🌍', '🎨', '🎵', '⚽', '📝', '🧠', '⚙️', '🧬']

export function SubjectModal({ isOpen, onClose, subjectToEdit }: SubjectModalProps) {
  const { addSubject, updateSubject, subjects } = useSubjectStore()
  
  const [formData, setFormData] = useState({
    name: '',
    subjectCode: '',
    teacher: '',
    semester: '',
    credits: 3,
    color: PRESET_COLORS[0],
    icon: PRESET_ICONS[0],
    description: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (subjectToEdit && isOpen) {
      setFormData({
        name: subjectToEdit.name,
        subjectCode: subjectToEdit.subjectCode || '',
        teacher: subjectToEdit.teacher || '',
        semester: subjectToEdit.semester,
        credits: subjectToEdit.credits,
        color: subjectToEdit.color,
        icon: subjectToEdit.icon,
        description: subjectToEdit.description || ''
      })
    } else if (isOpen) {
      setFormData({
        name: '',
        subjectCode: '',
        teacher: '',
        semester: '',
        credits: 3,
        color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
        icon: PRESET_ICONS[Math.floor(Math.random() * PRESET_ICONS.length)],
        description: ''
      })
    }
    setError('')
  }, [isOpen, subjectToEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.name || !formData.subjectCode || !formData.teacher || !formData.semester || formData.credits === undefined) {
      setError('Please fill in all required fields')
      return
    }

    const isDuplicate = subjects.some(s => s.name.toLowerCase() === formData.name.toLowerCase() && s.id !== subjectToEdit?.id)
    if (isDuplicate) {
      setError('A subject with this name already exists')
      return
    }

    setIsLoading(true)
    try {
      if (subjectToEdit) {
        await updateSubject(subjectToEdit.id, formData)
      } else {
        await addSubject(formData)
      }
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to save subject')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subjectToEdit ? 'Edit Subject' : 'Add Subject'}
      emoji="📚"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Subject Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="e.g. Mathematics"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Subject Code *</label>
            <input
              type="text"
              value={formData.subjectCode}
              onChange={e => setFormData({ ...formData, subjectCode: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="e.g. MAT101"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Teacher Name *</label>
            <input
              type="text"
              value={formData.teacher}
              onChange={e => setFormData({ ...formData, teacher: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="e.g. Prof. Smith"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Semester *</label>
            <input
              type="text"
              value={formData.semester}
              onChange={e => setFormData({ ...formData, semester: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="e.g. Fall 2026"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Credits *</label>
            <input
              type="number"
              value={formData.credits}
              onChange={e => setFormData({ ...formData, credits: Number(e.target.value) })}
              className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="e.g. 3"
              min="0"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Description (Optional)</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 min-h-[80px]"
            placeholder="What is this course about?"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Color Theme *</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-8 h-8 rounded-full transition-transform ${formData.color === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Icon *</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_ICONS.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData({ ...formData, icon })}
                className={`w-10 h-10 flex items-center justify-center text-xl rounded-xl transition-all ${formData.icon === icon ? 'bg-pink-100 scale-110 border border-pink-300' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <AnimatedButton
            type="submit"
            disabled={isLoading}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-xl"
          >
            {subjectToEdit ? 'Save Changes' : 'Add Subject'}
          </AnimatedButton>
        </div>
      </form>
    </Modal>
  )
}
