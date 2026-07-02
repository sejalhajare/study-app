import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  CheckSquare, Timer, 
  Flame, Calendar, ArrowRight, BookMarked
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useSubjectStore } from '@/store/subjectStore'
import { useTaskStore } from '@/store/taskStore'
import { useStudyStore } from '@/store/studyStore'
import { GlassCard } from '@/components/shared/GlassCard'
import { StatCard } from '@/components/shared/StatCard'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { MOTIVATIONAL_QUOTES } from '@/data/constants'
import { getGreeting, formatDate, getRandomItem } from '@/lib/utils'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { subjects } = useSubjectStore()
  const { tasks } = useTaskStore()
  const { events, achievements } = useStudyStore()
  
  const [quote] = useState(() => getRandomItem(MOTIVATIONAL_QUOTES))
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 3)
  const todayEvents = events.filter(e => new Date(e.date).toDateString() === new Date().toDateString())
  const recentSubjects = subjects.slice(0, 3)
  
  const xpProgress = (user?.xp || 0) % 100

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6"
    >
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row gap-6">
        <GlassCard gradient className="flex-1 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div>
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 backdrop-blur-md border border-pink-100 text-pink-600 text-xs font-semibold mb-4">
                <Flame size={14} className="text-orange-500" />
                {user?.streak} Day Streak
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {getGreeting()}, <span className="text-gradient-pink">{user?.name?.split(' ')[0]}!</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-muted-foreground">
                "{quote.text}" — <span className="italic">{quote.author}</span>
              </motion.p>
            </div>
            
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-2">
              <div className="text-3xl font-bold text-gradient-pink">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {formatDate(currentTime)}
              </p>
            </motion.div>
          </div>
          
          {/* Decorative blobs */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-200/50 rounded-full mix-blend-multiply filter blur-2xl animate-float" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-lavender-200/50 rounded-full mix-blend-multiply filter blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        </GlassCard>

        {/* Level Card */}
        <GlassCard className="w-full md:w-64 flex flex-col items-center justify-center text-center">
          <ProgressRing value={xpProgress} size={100} strokeWidth={8} color="#f472b6">
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-pink-500">{user?.level}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Level</span>
            </div>
          </ProgressRing>
          <div className="mt-4 w-full">
            <div className="flex justify-between text-xs mb-1 font-medium text-muted-foreground">
              <span>XP</span>
              <span>{user?.xp} / {(user?.level || 1) * 100}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Subjects" value={subjects.length} icon="📚" color="#F8BBD0" delay={0.1} />
        <StatCard title="Pending Tasks" value={pendingTasks.length} icon="📝" color="#FFE0B2" delay={0.2} />
        <StatCard title="Study Hours" value="24.5" subtitle="This week" icon="⏱️" color="#E1BEE7" trend={{ value: 12, positive: true }} delay={0.3} />
        <StatCard title="Achievements" value={achievements.filter(a => a.earnedAt).length} icon="🏆" color="#C8E6C9" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/pomodoro">
                <GlassCard hover padding="p-4" className="flex flex-col items-center justify-center gap-2 text-center h-28">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500"><Timer size={20} /></div>
                  <span className="text-xs font-semibold">Pomodoro</span>
                </GlassCard>
              </Link>
              <Link to="/tasks">
                <GlassCard hover padding="p-4" className="flex flex-col items-center justify-center gap-2 text-center h-28">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><CheckSquare size={20} /></div>
                  <span className="text-xs font-semibold">Add Task</span>
                </GlassCard>
              </Link>
              <Link to="/notes">
                <GlassCard hover padding="p-4" className="flex flex-col items-center justify-center gap-2 text-center h-28">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500"><BookMarked size={20} /></div>
                  <span className="text-xs font-semibold">New Note</span>
                </GlassCard>
              </Link>
              <Link to="/ai">
                <GlassCard hover padding="p-4" className="flex flex-col items-center justify-center gap-2 text-center h-28">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500"><Sparkles size={20} /></div>
                  <span className="text-xs font-semibold">Ask AI</span>
                </GlassCard>
              </Link>
            </div>
          </motion.div>

          {/* Recent Subjects */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Recent Subjects</h2>
              <Link to="/subjects" className="text-xs font-semibold text-pink-500 hover:text-pink-600 flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentSubjects.map((subject) => (
                <GlassCard key={subject.id} hover padding="p-4" className="relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-20 transition-transform group-hover:scale-150" style={{ backgroundColor: subject.color }} />
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{subject.icon}</span>
                    <h3 className="font-semibold text-sm truncate">{subject.name}</h3>
                  </div>
                  <div className="progress-bar mb-2">
                    <div className="progress-fill" style={{ width: `${subject.progress}%`, background: subject.color }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-right">{subject.progress}% Complete</p>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          
          {/* Today's Tasks */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Pending Tasks</h2>
              <Link to="/tasks" className="text-xs text-muted-foreground hover:text-pink-500">See All</Link>
            </div>
            <GlassCard padding="p-2">
              {pendingTasks.length > 0 ? (
                <div className="space-y-1">
                  {pendingTasks.map(task => (
                    <div key={task.id} className="flex items-start gap-3 p-3 hover:bg-pink-50/50 rounded-2xl transition-colors">
                      <div className="mt-0.5 w-4 h-4 rounded border-2 border-pink-300 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{task.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-3xl mb-2">🎉</p>
                  <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Today's Schedule */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Today's Schedule</h2>
              <Link to="/calendar" className="text-xs text-muted-foreground hover:text-pink-500">Calendar</Link>
            </div>
            <GlassCard padding="p-4" className="space-y-4">
              {todayEvents.length > 0 ? (
                todayEvents.map(event => (
                  <div key={event.id} className="flex gap-4 items-center">
                    <div className="text-xs font-semibold text-muted-foreground w-12 text-right shrink-0">
                      {event.time}
                    </div>
                    <div className="w-1 rounded-full h-8" style={{ backgroundColor: event.color }} />
                    <div>
                      <p className="text-sm font-semibold">{event.title}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{event.type}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center">
                  <Calendar className="mx-auto text-pink-200 mb-2" size={32} />
                  <p className="text-sm font-medium text-muted-foreground">No events today</p>
                </div>
              )}
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </motion.div>
  )
}

function Sparkles(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  )
}
