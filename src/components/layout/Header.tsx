import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Search, Bell, Sun, Moon, LogOut, User } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { formatDate, getGreeting } from '@/lib/utils'

export function Header() {
  const { toggleSidebar, theme, toggleTheme, notifications, markNotificationRead } = useUIStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border-b border-pink-100/50 dark:border-gray-700/50 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">

        {/* Left: hamburger + greeting */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-pink-50 transition-colors text-muted-foreground lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="hidden sm:block">
            <p className="text-xs text-muted-foreground">{formatDate(new Date())}</p>
            <p className="text-sm font-semibold text-foreground">
              {getGreeting()}, <span className="text-gradient">{user?.name?.split(' ')[0]} ✨</span>
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Link
            to="/search"
            className="p-2 rounded-xl hover:bg-pink-50 transition-colors text-muted-foreground"
          >
            <Search size={18} />
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-pink-50 transition-colors text-muted-foreground"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(v => !v); setShowUserMenu(false) }}
              className="relative p-2 rounded-xl hover:bg-pink-50 transition-colors text-muted-foreground"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-lavender-400 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-glass border border-pink-100/50 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-pink-100/50">
                    <p className="font-bold text-sm text-gradient">Notifications 🔔</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-8">All caught up! 🌸</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-4 border-b border-pink-50 cursor-pointer hover:bg-pink-50/50 transition-colors ${!n.read ? 'bg-pink-50/30' : ''}`}
                        >
                          <p className="text-sm font-semibold text-foreground">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                          {!n.read && <div className="w-2 h-2 bg-pink-400 rounded-full mt-2" />}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User avatar */}
          <div className="relative">
            <button
              onClick={() => { setShowUserMenu(v => !v); setShowNotifications(false) }}
              className="flex items-center gap-2 p-1 rounded-2xl hover:bg-pink-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-lavender-300 flex items-center justify-center text-sm font-bold text-white shadow-pink">
                {user?.name?.charAt(0) || '🌸'}
              </div>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-48 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-glass border border-pink-100/50 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-pink-100/50 text-center">
                    <p className="font-semibold text-sm text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">Level {user?.level} ⭐</p>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-pink-50 text-sm text-foreground transition-colors"
                    >
                      <User size={15} /> Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-pink-50 text-sm text-foreground transition-colors"
                    >
                      ⚙️ Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 text-sm text-red-500 transition-colors"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowNotifications(false); setShowUserMenu(false) }} />
      )}
    </header>
  )
}
