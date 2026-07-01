import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimerState {
  mode: 'focus' | 'short-break' | 'long-break'
  isRunning: boolean
  timeLeft: number
  focusDuration: number
  shortBreak: number
  longBreak: number
  sessionsCompleted: number
  totalFocusTime: number
  subjectId: string
  setMode: (mode: 'focus' | 'short-break' | 'long-break') => void
  setTimeLeft: (time: number) => void
  setIsRunning: (running: boolean) => void
  setDurations: (focus: number, short: number, long: number) => void
  completeSession: () => void
  reset: () => void
  setSubject: (id: string) => void
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      mode: 'focus',
      isRunning: false,
      timeLeft: 25 * 60,
      focusDuration: 25,
      shortBreak: 5,
      longBreak: 15,
      sessionsCompleted: 0,
      totalFocusTime: 0,
      subjectId: '',

      setMode: (mode) => {
        const { focusDuration, shortBreak, longBreak } = get()
        const durations = { focus: focusDuration * 60, 'short-break': shortBreak * 60, 'long-break': longBreak * 60 }
        set({ mode, timeLeft: durations[mode], isRunning: false })
      },

      setTimeLeft: (time) => set({ timeLeft: time }),
      setIsRunning: (running) => set({ isRunning: running }),

      setDurations: (focus, short, long) => {
        const { mode } = get()
        const durations = { focus: focus * 60, 'short-break': short * 60, 'long-break': long * 60 }
        set({ focusDuration: focus, shortBreak: short, longBreak: long, timeLeft: durations[mode] })
      },

      completeSession: () => set((state) => ({
        sessionsCompleted: state.sessionsCompleted + 1,
        totalFocusTime: state.totalFocusTime + state.focusDuration,
        isRunning: false,
      })),

      reset: () => {
        const { mode, focusDuration, shortBreak, longBreak } = get()
        const durations = { focus: focusDuration * 60, 'short-break': shortBreak * 60, 'long-break': longBreak * 60 }
        set({ timeLeft: durations[mode], isRunning: false })
      },

      setSubject: (id) => set({ subjectId: id }),
    }),
    { name: 'study-planner-timer' }
  )
)
