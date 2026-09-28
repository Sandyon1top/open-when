import confetti from 'canvas-confetti'
import {
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Edit2,
  Gamepad2,
  Globe2,
  Heart,
  Lock,
  MessageCircleHeart,
  Mic,
  Moon,
  Music,
  Plane,
  Plus,
  Radio,
  RefreshCw,
  Share2,
  Sparkles,
  Sun,
  Trash2,
  Unlock,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  DAILY_LDR_QUESTIONS,
  LDR_DATE_IDEAS,
  WORLD_CITIES,
  calculateDistanceKm,
} from '../data/ldrData.js'
import LocketPolaroid from './LocketPolaroid.jsx'
import LdrMiniGames from './LdrMiniGames.jsx'
import ReunionFlightTracker from './ReunionFlightTracker.jsx'
import VoiceAndSoundtrack from './VoiceAndSoundtrack.jsx'

const STORAGE_LDR_CONFIG = 'open_when_ldr_config_v1'
const STORAGE_LDR_QA = 'open_when_ldr_qa_answers_v1'
const STORAGE_LDR_TRIP = 'open_when_ldr_trip_v1'

export default function LdrCommandCenter({ recipient = 'My Love', sender = 'Me' }) {
  // Cities & Timezones state
  const [senderCity, setSenderCity] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_LDR_CONFIG) || '{}')
      return saved.senderCity || WORLD_CITIES[0] // New York
    } catch {
      return WORLD_CITIES[0]
    }
  })

  const [recipientCity, setRecipientCity] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_LDR_CONFIG) || '{}')
      return saved.recipientCity || WORLD_CITIES[1] // London
    } catch {
      return WORLD_CITIES[1]
    }
  })

  // Live clocks ticking
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isCityModalOpen, setIsCityModalOpen] = useState(false)

  // Heartbeat pulse state
  const [isPulsing, setIsPulsing] = useState(false)
  const [pulseCount, setPulseCount] = useState(0)

  // Reunion Countdown State
  const [tripData, setTripData] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_LDR_TRIP) || '{}')
      // Default reunion date: 14 days in the future
      const defaultDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
      return {
        targetDate: saved.targetDate || defaultDate,
        destination: saved.destination || 'Airport Terminal & Cozy Hugs 🫂',
        checklist: saved.checklist || [
          { id: '1', text: 'Pack favorite hoodie that smells like me', done: false },
          { id: '2', text: 'Download shared offline playlist for the flight', done: false },
          { id: '3', text: 'Get fresh flowers for the arrivals gate', done: false },
        ],
      }
    } catch {
      return {
        targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        destination: 'Airport Terminal & Cozy Hugs 🫂',
        checklist: [],
      }
    }
  })
  const [isTripEditOpen, setIsTripEditOpen] = useState(false)
  const [newCheckItem, setNewCheckItem] = useState('')

  // Daily Blind Q&A state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [myAnswer, setMyAnswer] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [copiedQA, setCopiedQA] = useState(false)
  const [qaHistory, setQaHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_LDR_QA) || '{}')
    } catch {
      return {}
    }
  })

  // Random Date Idea State
  const [currentDateIdeaIndex, setCurrentDateIdeaIndex] = useState(0)

  // Sub-Navigation Tab State
  const [ldrSubTab, setLdrSubTab] = useState('all')

  // Tick clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Save city changes
  useEffect(() => {
    localStorage.setItem(
      STORAGE_LDR_CONFIG,
      JSON.stringify({ senderCity, recipientCity })
    )
  }, [senderCity, recipientCity])

  // Save trip changes
  useEffect(() => {
    localStorage.setItem(STORAGE_LDR_TRIP, JSON.stringify(tripData))
  }, [tripData])

  // Calculate distance between partners
  const distanceKm = useMemo(() => {
    return calculateDistanceKm(
      senderCity.lat,
      senderCity.lng,
      recipientCity.lat,
      recipientCity.lng
    )
  }, [senderCity, recipientCity])
  const distanceMiles = Math.round(distanceKm * 0.621371)

  // Format time for a given timezone
  const formatTimeForZone = (tz) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(currentTime)
    } catch {
      return currentTime.toLocaleTimeString()
    }
  }

  const getHourForZone = (tz) => {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        hour12: false,
      }).formatToParts(currentTime)
      const hourVal = parts.find((p) => p.type === 'hour')?.value
      return parseInt(hourVal, 10) || 12
    } catch {
      return 12
    }
  }

  const getActivityStatus = (hour) => {
    if (hour >= 23 || hour < 7) {
      return { label: 'Sleeping / Dreamland', icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-950/60' }
    }
    if (hour >= 7 && hour < 12) {
      return { label: 'Morning & Coffee ☕', icon: Sun, color: 'text-amber-400', bg: 'bg-amber-950/40' }
    }
    if (hour >= 12 && hour < 18) {
      return { label: 'Afternoon & Active 💼', icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-950/40' }
    }
    return { label: 'Evening Relaxation 🌆', icon: Moon, color: 'text-rose-400', bg: 'bg-rose-950/40' }
  }

  // Calculate Countdown to Reunion
  const countdown = useMemo(() => {
    const diff = new Date(tripData.targetDate).getTime() - currentTime.getTime()
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isNow: true }
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / 1000 / 60) % 60)
    const seconds = Math.floor((diff / 1000) % 60)
    return { days, hours, minutes, seconds, isNow: false }
  }, [tripData.targetDate, currentTime])

  // Heartbeat pulse trigger
  const handleHeartbeat = () => {
    setIsPulsing(true)
    setPulseCount((c) => c + 1)
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#ec4899', '#fbcfe8'],
    })
    setTimeout(() => setIsPulsing(false), 1200)
  }

  const activeQuestion = DAILY_LDR_QUESTIONS[currentQuestionIndex]

  // Load existing answer for current question
  useEffect(() => {
    const saved = qaHistory[activeQuestion.id]
    if (saved) {
      setMyAnswer(saved.myAnswer || '')
      setIsUnlocked(true)
    } else {
      setMyAnswer('')
      setIsUnlocked(false)
    }
  }, [currentQuestionIndex, qaHistory, activeQuestion.id])

  const handleUnlockAnswer = () => {
    if (!myAnswer.trim()) return
    setIsUnlocked(true)
    const updated = {
      ...qaHistory,
      [activeQuestion.id]: {
        myAnswer,
        unlockedAt: new Date().toISOString(),
      },
    }
    setQaHistory(updated)
    localStorage.setItem(STORAGE_LDR_QA, JSON.stringify(updated))

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#a855f7', '#fbbf24'],
    })
  }

  const handleShareAnswerWhatsApp = () => {
    const text = encodeURIComponent(
      `💌 LDR Daily Question for ${recipient} & ${sender}:\n\n` +
        `❓ "${activeQuestion.question}"\n\n` +
        `💖 ${sender}'s Answer: "${myAnswer}"\n\n` +
        `Now unlock yours in our Open When LDR Hub! 🌍✨`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const handleToggleChecklist = (id) => {
    setTripData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      ),
    }))
  }

  const handleAddChecklist = (e) => {
    e.preventDefault()
    if (!newCheckItem.trim()) return
    setTripData((prev) => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        { id: Date.now().toString(), text: newCheckItem.trim(), done: false },
      ],
    }))
    setNewCheckItem('')
  }

  const handleDeleteChecklist = (id) => {
    setTripData((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((item) => item.id !== id),
    }))
  }

  const senderHour = getHourForZone(senderCity.timezone)
  const recipientHour = getHourForZone(recipientCity.timezone)
  const senderStatus = getActivityStatus(senderHour)
  const recipientStatus = getActivityStatus(recipientHour)

  const SenderIcon = senderStatus.icon
  const RecipientIcon = recipientStatus.icon

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Sub-Navigation Switcher Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-3xl bg-white/80 dark:bg-gray-800/80 p-2 shadow-lg border border-purple-100 dark:border-gray-700 backdrop-blur-md">
        {[
          { id: 'all', label: '🌟 Full LDR Suite', icon: Sparkles },
          { id: 'clocks', label: '🌐 Radar & Clocks', icon: Globe2 },
          { id: 'locket', label: '📸 Live Locket & Photos', icon: Camera },
          { id: 'voice', label: '🎙️ Voice & Jam', icon: Mic },
          { id: 'games', label: '🎲 Mini-Games Studio', icon: Gamepad2 },
          { id: 'flight', label: '✈️ Reunion & Flight Arc', icon: Plane },
        ].map((tab) => {
          const TabIcon = tab.icon
          const isActive = ldrSubTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setLdrSubTab(tab.id)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${
                isActive
                  ? 'bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white shadow-md scale-105'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              <TabIcon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 🌍 1. DUAL TIMEZONE & DISTANCE BRIDGE */}
      {(ldrSubTab === 'all' || ldrSubTab === 'clocks') && (
        <>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6 sm:p-8 text-white shadow-2xl border border-purple-500/30">
            <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

            {/* Top Header & Settings */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 text-white shadow-lg">
                  <Globe2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-rose-300">
                      LDR Command Bridge
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold text-rose-200 border border-rose-400/30">
                      <Radio className="h-2.5 w-2.5 animate-pulse text-rose-400" /> Live Sync
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold">
                    {sender} & {recipient}
                  </h3>
                </div>
              </div>

          <button
            type="button"
            onClick={() => setIsCityModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-semibold text-purple-100 border border-purple-300/30 backdrop-blur-md transition shadow"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Change Cities / Timezones
          </button>
        </div>

        {/* Clocks & Distance Radar */}
        <div className="relative z-10 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Sender Time Clock */}
          <div className="rounded-2xl bg-white/5 p-5 border border-white/10 backdrop-blur-md space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                {senderCity.flag} {senderCity.city} ({sender})
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${senderStatus.bg} ${senderStatus.color}`}>
                <SenderIcon className="h-3 w-3" />
                {senderStatus.label}
              </span>
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-black text-white tracking-tight">
              {formatTimeForZone(senderCity.timezone)}
            </div>
            <p className="text-[11px] text-gray-400">{senderCity.country} • {senderCity.timezone}</p>
          </div>

          {/* Central Heartbeat & Distance Bridge */}
          <div className="flex flex-col items-center justify-center text-center space-y-3 py-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3.5 py-1 text-xs font-bold text-rose-200 border border-rose-500/30">
              <Plane className="h-3.5 w-3.5 text-rose-300" />
              <span>{distanceMiles.toLocaleString()} Miles</span>
              <span className="text-rose-400">({distanceKm.toLocaleString()} km)</span>
            </div>

            {/* Heartbeat Touch Button */}
            <button
              type="button"
              onClick={handleHeartbeat}
              className={`group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-600 shadow-xl transition-all duration-300 ${
                isPulsing ? 'scale-125 shadow-rose-500/80 ring-4 ring-rose-400' : 'hover:scale-110'
              }`}
            >
              <div className="absolute -inset-2 rounded-full bg-rose-500/30 blur-md animate-pulse" />
              <Heart
                className={`h-8 w-8 text-white fill-white transition-transform ${
                  isPulsing ? 'scale-125' : 'group-hover:scale-110'
                }`}
              />
            </button>

            <div className="text-[11px] text-rose-200/90 font-medium">
              {isPulsing ? '💖 Heartbeat Pulse Sent!' : 'Tap heart to send instant love pulse'}
            </div>
          </div>

          {/* Recipient Time Clock */}
          <div className="rounded-2xl bg-white/5 p-5 border border-white/10 backdrop-blur-md space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-200 uppercase tracking-wider">
                {recipientCity.flag} {recipientCity.city} ({recipient})
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${recipientStatus.bg} ${recipientStatus.color}`}>
                <RecipientIcon className="h-3 w-3" />
                {recipientStatus.label}
              </span>
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-black text-pink-100 tracking-tight">
              {formatTimeForZone(recipientCity.timezone)}
            </div>
            <p className="text-[11px] text-gray-400">{recipientCity.country} • {recipientCity.timezone}</p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-6 rounded-2xl bg-white/5 px-4 py-2.5 text-center text-xs text-purple-200/80 border border-white/5">
          ✨ <em>"Distance means so little when someone means so much. Sharing the exact same moon tonight."</em>
        </div>
      </div>

      {/* ✈️ 2. REUNION COUNTDOWN & TRIP CHECKLIST */}
      <div className="rounded-3xl bg-white/80 dark:bg-gray-800/80 p-6 sm:p-8 shadow-xl border border-rose-100/60 dark:border-gray-700 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 text-white shadow-md">
              <Plane className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 dark:text-rose-400">
                Next Visit Milestone
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-100">
                {tripData.destination}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsTripEditOpen(!isTripEditOpen)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 dark:bg-gray-700 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-300 hover:bg-rose-100 transition"
          >
            <Calendar className="h-3.5 w-3.5" />
            {isTripEditOpen ? 'Close Settings' : 'Edit Reunion Date'}
          </button>
        </div>

        {/* Date Edit Form */}
        {isTripEditOpen && (
          <div className="rounded-2xl bg-rose-50/70 dark:bg-gray-900/60 p-5 border border-rose-200 dark:border-gray-700 space-y-4 animate-fadeIn">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
              Update Reunion Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trip Title / Destination
                </label>
                <input
                  type="text"
                  value={tripData.destination}
                  onChange={(e) =>
                    setTripData((prev) => ({ ...prev, destination: e.target.value }))
                  }
                  placeholder="e.g. Airport Reunion & Cozy Hugs 🫂"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reunion Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={tripData.targetDate}
                  onChange={(e) =>
                    setTripData((prev) => ({ ...prev, targetDate: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Live Countdown Ticker */}
        {countdown.isNow ? (
          <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white text-center shadow-lg space-y-3">
            <span className="text-4xl">🎉🫂✈️</span>
            <h4 className="font-serif text-3xl font-extrabold">It's Reunion Time!</h4>
            <p className="text-sm text-emerald-100">
              The wait is over! Hug each other tightly and cherish every single second.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Days', value: countdown.days },
              { label: 'Hours', value: countdown.hours },
              { label: 'Minutes', value: countdown.minutes },
              { label: 'Seconds', value: countdown.seconds },
            ].map((unit) => (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-rose-50/80 to-pink-100/60 dark:from-gray-700/80 dark:to-gray-800/80 p-4 border border-rose-200/60 dark:border-gray-600 shadow-sm"
              >
                <span className="font-mono text-3xl sm:text-5xl font-black text-rose-600 dark:text-rose-400">
                  {unit.value.toString().padStart(2, '0')}
                </span>
                <span className="mt-1 text-xs font-bold uppercase tracking-wider text-[#7a6570] dark:text-gray-300">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Visit Packing & Bucket Checklist */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5c4a55] dark:text-gray-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Reunion Checklist & Bucket List ({tripData.checklist.filter((i) => i.done).length}/{tripData.checklist.length})
            </h4>
          </div>

          <div className="space-y-2">
            {tripData.checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleChecklist(item.id)}
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer border transition ${
                  item.done
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 text-gray-500 line-through'
                    : 'bg-white/70 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-rose-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-lg border ${
                      item.done
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-gray-400'
                    }`}
                  >
                    {item.done && <Check className="h-3.5 w-3.5" />}
                  </div>
                  <span className="text-xs font-medium">{item.text}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteChecklist(item.id)
                  }}
                  className="text-gray-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddChecklist} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newCheckItem}
              onChange={(e) => setNewCheckItem(e.target.value)}
              placeholder="Add packing item or reunion activity..."
              className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-900/90 px-3.5 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 px-4 py-2 text-xs font-bold text-white shadow hover:opacity-95"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </form>
        </div>
      </div>

      {/* 💬 3. PAIRED-STYLE DAILY BLIND Q&A */}
      <div className="rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 dark:from-gray-800 dark:via-purple-950/30 dark:to-gray-800 p-6 sm:p-8 shadow-xl border border-purple-200/60 dark:border-gray-700 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-200/60 dark:border-gray-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md">
              <MessageCircleHeart className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                  Daily Blind Q&A ({activeQuestion.badge})
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                "{activeQuestion.question}"
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const nextIndex = (currentQuestionIndex + 1) % DAILY_LDR_QUESTIONS.length
              setCurrentQuestionIndex(nextIndex)
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white dark:bg-gray-700 px-3.5 py-2 text-xs font-semibold text-purple-600 dark:text-purple-300 shadow-sm border border-purple-200 dark:border-gray-600 hover:bg-purple-50 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Next Question ({currentQuestionIndex + 1}/{DAILY_LDR_QUESTIONS.length})
          </button>
        </div>

        {/* Double-Blind Answers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User's Input / Answer Card */}
          <div className="rounded-2xl bg-white/90 dark:bg-gray-900/80 p-5 shadow-sm border border-rose-100 dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Your Answer ({sender})
              </span>
              {isUnlocked && (
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Answered ✓
                </span>
              )}
            </div>

            {!isUnlocked ? (
              <div className="space-y-3">
                <textarea
                  rows={3}
                  value={myAnswer}
                  onChange={(e) => setMyAnswer(e.target.value)}
                  placeholder={`Write your honest answer here, ${sender}... (This stays hidden until you submit!)`}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-rose-50/40 dark:bg-gray-800 p-3 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400 transition resize-none"
                />
                <button
                  type="button"
                  disabled={!myAnswer.trim()}
                  onClick={handleUnlockAnswer}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 disabled:opacity-50 transition"
                >
                  <Unlock className="h-3.5 w-3.5" /> Submit & Unlock Partner's Answer!
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-gray-800 text-xs text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                "{myAnswer}"
              </div>
            )}
          </div>

          {/* Partner's Blind Answer Card */}
          <div className="rounded-2xl bg-white/90 dark:bg-gray-900/80 p-5 shadow-sm border border-purple-100 dark:border-gray-700 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {recipient}'s Secret Answer
              </span>
              <span className="text-[10px] text-gray-400">Double-Blind Vault</span>
            </div>

            {!isUnlocked ? (
              /* Locked Frosted Glass Overlay */
              <div className="h-28 rounded-xl bg-purple-100/50 dark:bg-purple-950/40 border border-purple-300/40 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white shadow">
                  <Lock className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-purple-900 dark:text-purple-200">
                  Partner's answer is locked!
                </p>
                <p className="text-[11px] text-purple-700/80 dark:text-purple-300/80">
                  Submit your own response on the left to reveal what {recipient} thinks!
                </p>
              </div>
            ) : (
              /* Revealed Partner Answer */
              <div className="space-y-3 animate-fadeIn">
                <div className="p-3 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 text-xs text-purple-900 dark:text-purple-100 leading-relaxed font-medium border border-purple-200/50">
                  "{activeQuestion.partnerPlaceholderAnswer}"
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleShareAnswerWhatsApp}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow transition"
                  >
                    <Share2 className="h-3 w-3" /> Share via WhatsApp
                  </button>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Unlocked together ✨
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🍿 4. VIRTUAL DATE NIGHT GENERATOR */}
      <div className="rounded-3xl bg-white/80 dark:bg-gray-800/80 p-6 sm:p-8 shadow-xl border border-rose-100/60 dark:border-gray-700 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-400 to-amber-400 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500">
                LDR Intimacy Activity
              </span>
              <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-gray-100">
                Virtual Date Night Generator
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = (currentDateIdeaIndex + 1) % LDR_DATE_IDEAS.length
              setCurrentDateIdeaIndex(next)
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-100 dark:bg-gray-700 px-3.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-300 hover:bg-rose-200 transition"
          >
            <Zap className="h-3.5 w-3.5" /> Spin Another Date Idea
          </button>
        </div>

        {/* Date Idea Showcase */}
        {(() => {
          const idea = LDR_DATE_IDEAS[currentDateIdeaIndex]
          return (
            <div className="rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-gray-900/60 dark:to-gray-900/40 p-5 border border-rose-200/80 dark:border-gray-700 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-gray-100">
                  {idea.title}
                </h4>
                <span className="rounded-full bg-rose-200 dark:bg-rose-950/60 px-2.5 py-0.5 text-[10px] font-bold text-rose-800 dark:text-rose-300">
                  {idea.tag}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {idea.description}
              </p>
            </div>
          )
        })()}
      </div>
        </>
      )}

      {/* 📸 2. LIVE LOCKET & POLAROID MEMORIES */}
      {(ldrSubTab === 'all' || ldrSubTab === 'locket') && (
        <LocketPolaroid sender={sender} recipient={recipient} senderCity={senderCity} />
      )}

      {/* 🎙️ 3. VOICE CAPSULES & COUPLE SOUNDTRACK */}
      {(ldrSubTab === 'all' || ldrSubTab === 'voice') && (
        <VoiceAndSoundtrack sender={sender} recipient={recipient} senderCity={senderCity} />
      )}

      {/* 🎲 4. LDR MINI-GAMES STUDIO */}
      {(ldrSubTab === 'all' || ldrSubTab === 'games') && (
        <LdrMiniGames sender={sender} recipient={recipient} />
      )}

      {/* ✈️ 5. REUNION & FLIGHT ARC TRACKER */}
      {(ldrSubTab === 'all' || ldrSubTab === 'flight') && (
        <ReunionFlightTracker
          sender={sender}
          recipient={recipient}
          senderCity={senderCity}
          recipientCity={recipientCity}
        />
      )}

      {/* MODAL: TIMEZONE & CITY PICKER */}
      {isCityModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsCityModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-2xl border border-purple-200 dark:border-gray-700 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-100">
                Choose Cities & Timezones
              </h3>
              <button
                type="button"
                onClick={() => setIsCityModalOpen(false)}
                className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">
                  {sender}'s City / Timezone
                </label>
                <select
                  value={senderCity.city}
                  onChange={(e) => {
                    const found = WORLD_CITIES.find((c) => c.city === e.target.value)
                    if (found) setSenderCity(found)
                  }}
                  className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 text-xs text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400"
                >
                  {WORLD_CITIES.map((c) => (
                    <option key={c.city} value={c.city}>
                      {c.flag} {c.city}, {c.country} • {c.label || c.timezone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-2">
                  {recipient}'s City / Timezone
                </label>
                <select
                  value={recipientCity.city}
                  onChange={(e) => {
                    const found = WORLD_CITIES.find((c) => c.city === e.target.value)
                    if (found) setRecipientCity(found)
                  }}
                  className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 text-xs text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400"
                >
                  {WORLD_CITIES.map((c) => (
                    <option key={c.city} value={c.city}>
                      {c.flag} {c.city}, {c.country} • {c.label || c.timezone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setIsCityModalOpen(false)}
                className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-xs font-bold text-white shadow"
              >
                Save & Update Bridge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
