import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, FileText, CheckSquare, Calendar,
  Timer, MessageSquare, Layers, HelpCircle, ClipboardList,
  BookMarked, GraduationCap, Calculator, Activity, SmilePlus,
  Droplets, Moon, BarChart3, Trophy, Star, Settings, ChevronLeft,
  ChevronRight, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'

const navGroups = [
  {
    label: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
      { icon: BookOpen, label: 'Subjects', path: '/subjects' },
      { icon: FileText, label: 'Notes', path: '/notes' },
      { icon: CheckSquare, label: 'To-Do', path: '/tasks' },
      { icon: Calendar, label: 'Calendar', path: '/calendar' },
    ]
  },
  {
    label: 'Study Tools',
    items: [
      { icon: Timer, label: 'Pomodoro', path: '/pomodoro' },
      { icon: MessageSquare, label: 'AI Assistant', path: '/ai' },
      { icon: Layers, label: 'Flashcards', path: '/flashcards' },
      { icon: HelpCircle, label: 'Quiz', path: '/quiz' },
    ]
  },
  {
    label: 'Academic',
    items: [
      { icon: ClipboardList, label: 'Assignments', path: '/assignments' },
      { icon: BookMarked, label: 'Attendance', path: '/attendance' },
      { icon: GraduationCap, label: 'Exam Planner', path: '/exams' },
      { icon: Calculator, label: 'GPA Calculator', path: '/gpa' },
    ]
  },
  {
    label: 'Wellness',
    items: [
      { icon: Activity, label: 'Habits', path: '/habits' },
      { icon: SmilePlus, label: 'Mood Tracker', path: '/mood' },
      { icon: Droplets, label: 'Water Tracker', path: '/water' },
      { icon: Moon, label: 'Sleep Tracker', path: '/sleep' },
    ]
  },
  {
    label: 'Insights',
    items: [
      { icon: BarChart3, label: 'Statistics', path: '/statistics' },
      { icon: Trophy, label: 'Rewards', path: '/rewards' },
      { icon: Star, label: 'Motivation', path: '/motivation' },
      { icon: Settings, label: 'Settings', path: '/settings' },
    ]
  },
]

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { user } = useAuthStore()
  const location = useLocation()
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 h-full z-40',
          'bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl',
          'border-r border-pink-100/50 dark:border-gray-700/50',
          'shadow-[4px_0_24px_rgba(248,187,208,0.15)]',
          'flex flex-col overflow-hidden',
          'lg:relative lg:translate-x-0',
          !sidebarOpen && 'lg:block',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-pink-100/50 flex-shrink-0">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-300 to-lavender-300 flex items-center justify-center text-xl shadow-pink">
                  🌸
                </div>
                <div>
                  <p className="font-bold text-sm text-gradient leading-tight">StudyBloom</p>
                  <p className="text-[10px] text-muted-foreground">Your Study Partner</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="logo-mini"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-300 to-lavender-300 flex items-center justify-center text-xl shadow-pink"
              >
                🌸
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-xl hover:bg-pink-50 transition-colors text-muted-foreground hidden lg:flex"
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-xl hover:bg-pink-50 transition-colors text-muted-foreground lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 no-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              {sidebarOpen && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2"
                >
                  {group.label}
                </motion.p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onMouseEnter={() => setHoveredPath(item.path)}
                      onMouseLeave={() => setHoveredPath(null)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 relative group',
                        isActive
                          ? 'bg-gradient-to-r from-pink-200 to-lavender-200 text-pink-700 shadow-sm'
                          : 'text-muted-foreground hover:bg-pink-50 hover:text-pink-600'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-200/80 to-lavender-200/80"
                          transition={{ duration: 0.2 }}
                        />
                      )}
                      <item.icon
                        size={18}
                        className={cn(
                          'relative z-10 flex-shrink-0 transition-transform duration-200',
                          (isActive || hoveredPath === item.path) && 'scale-110'
                        )}
                      />
                      <AnimatePresence mode="wait">
                        {sidebarOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.15 }}
                            className="relative z-10 text-sm font-medium whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Tooltip for collapsed state */}
                      {!sidebarOpen && (
                        <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-xl
                          opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User profile at bottom */}
        <div className="flex-shrink-0 border-t border-pink-100/50 p-3">
          <NavLink
            to="/profile"
            className={cn(
              'flex items-center gap-3 p-2 rounded-2xl transition-all duration-200',
              'hover:bg-pink-50 cursor-pointer',
              location.pathname === '/profile' && 'bg-pink-50'
            )}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-300 to-lavender-300 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-pink">
              {user?.name?.charAt(0) || '🌸'}
            </div>
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-w-0"
                >
                  <p className="text-xs font-semibold text-foreground truncate">{user?.name}</p>
                  <p className="text-[10px] text-muted-foreground">Level {user?.level} ⭐</p>
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
        </div>
      </motion.aside>
    </>
  )
}
