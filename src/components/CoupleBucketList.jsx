import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Circle, Compass, Heart, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

const BUCKET_KEY = 'open-when:bucket-list'

const DEFAULT_BUCKET_ITEMS = [
  { id: 'b1', text: 'Stargazing under a clear night sky 🌌', completed: true },
  { id: 'b2', text: 'Spontaneous midnight ice cream run 🍦', completed: true },
  { id: 'b3', text: 'Take a pottery or painting workshop together 🎨', completed: false },
  { id: 'b4', text: 'Build a giant blanket fort in the living room 🏰', completed: false },
  { id: 'b5', text: 'Cook a fancy 3-course dinner from scratch 🍳', completed: false },
  { id: 'b6', text: 'Watch the sunrise together from a hilltop 🌅', completed: false },
  { id: 'b7', text: 'Take a weekend road trip with no set destination 🚗', completed: false },
  { id: 'b8', text: 'Slow dance in the living room with no music 💃', completed: false },
  { id: 'b9', text: 'Write love letters to open in 5 years ⏳', completed: false },
  { id: 'b10', text: 'Have a romantic picnic in a quiet botanical garden 🧺', completed: false },
  { id: 'b11', text: 'Have a completely phone-free 24-hour date 📵', completed: false },
  { id: 'b12', text: 'Recreate our very first date 💖', completed: false },
]

export default function CoupleBucketList({ recipient, sender }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(BUCKET_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return DEFAULT_BUCKET_ITEMS
  })

  const [newItemText, setNewItemText] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(BUCKET_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.completed
          if (nextState) {
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#F8C8DC', '#E4D4F4', '#F3AFC8'],
            })
          }
          return { ...item, completed: nextState }
        }
        return item
      })
    )
  }

  const addItem = (e) => {
    e.preventDefault()
    if (!newItemText.trim()) return
    const newItem = {
      id: 'b-' + Date.now(),
      text: newItemText.trim(),
      completed: false,
    }
    setItems((prev) => [...prev, newItem])
    setNewItemText('')
  }

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const completedCount = items.filter((i) => i.completed).length
  const percent = items.length ? Math.round((completedCount / items.length) * 100) : 0

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
      {/* Header Card */}
      <div className="rounded-3xl bg-[#fffaf6] dark:bg-gray-800 p-6 shadow-xl border border-rose-100 dark:border-gray-700 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-500">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#5c4a55] dark:text-gray-100">
                {recipient} & {sender}'s Bucket List
              </h2>
              <p className="text-xs text-[#7a6570] dark:text-gray-300">
                Romantic goals & adventures to conquer together!
              </p>
            </div>
          </div>
          <span className="font-serif text-2xl font-extrabold text-rose-500">
            {percent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-[#5c4a55] dark:text-gray-300">
            <span>{completedCount} of {items.length} Adventures Completed</span>
            <span>{completedCount === items.length ? 'All Completed! 🎉' : `${items.length - completedCount} Remaining`}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-rose-100 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Add New Goal Form */}
        <form onSubmit={addItem} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add a new romantic goal (e.g. Visit Paris together)..."
            className="flex-1 rounded-2xl border border-rose-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-[#5c4a55] dark:text-gray-100 focus:border-rose-400 focus:outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-1 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 px-4 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 transition shrink-0"
          >
            <Plus className="h-4 w-4" /> Add Goal
          </button>
        </form>
      </div>

      {/* Bucket List Items Grid */}
      <div className="space-y-3">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
                item.completed
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-white dark:bg-gray-800 border-rose-100 dark:border-gray-700 text-[#5c4a55] dark:text-gray-200 hover:border-rose-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="flex items-center gap-3 text-left min-w-0 flex-1 pr-3"
              >
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600 shrink-0 hover:text-rose-400" />
                )}
                <span className={`text-sm font-medium ${item.completed ? 'line-through opacity-85' : ''}`}>
                  {item.text}
                </span>
              </button>

              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                className="rounded-lg p-1 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-gray-700 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
