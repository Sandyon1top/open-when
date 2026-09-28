import confetti from 'canvas-confetti'
import {
  Calendar,
  Check,
  Clock,
  Compass,
  Luggage,
  MapPin,
  Plane,
  Plus,
  Sparkles,
  Ticket,
  Trash2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { calculateDistanceKm } from '../data/ldrData.js'

const STORAGE_FLIGHT_DATA = 'open_when_reunion_flight_v1'

export default function ReunionFlightTracker({
  sender = 'Me',
  recipient = 'My Love',
  senderCity = { city: 'Kathmandu', country: 'Nepal', timezone: 'Asia/Kathmandu', flag: '🇳🇵', lat: 27.7172, lng: 85.324 },
  recipientCity = { city: 'New York', country: 'USA', timezone: 'America/New_York', flag: '🇺🇸', lat: 40.7128, lng: -74.006 },
}) {
  const [flightState, setFlightState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_FLIGHT_DATA) || '{}')
      const defaultDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
      return {
        flightNumber: saved.flightNumber || 'LOVE-777',
        airline: saved.airline || 'Starlight Airways ✈️',
        targetDate: saved.targetDate || defaultDate,
        notes: saved.notes || 'Counting every heartbeat until the gate doors slide open!',
        checklist: saved.checklist || [
          { id: '1', text: 'Passport & Visa checked', done: true },
          { id: '2', text: 'Pack cozy hoodie that smells like me', done: false },
          { id: '3', text: 'Download offline movies for the flight', done: true },
          { id: '4', text: 'Get fresh flowers for the arrival gate', done: false },
          { id: '5', text: 'Prepare the longest hug of my life 🫂', done: false },
        ],
      }
    } catch {
      return {
        flightNumber: 'LOVE-777',
        airline: 'Starlight Airways ✈️',
        targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        notes: 'Counting every heartbeat!',
        checklist: [],
      }
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [newItemText, setNewItemText] = useState('')
  const [now, setNow] = useState(new Date())

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_FLIGHT_DATA, JSON.stringify(flightState))
  }, [flightState])

  // Distance Calculation
  const distanceKm = useMemo(() => {
    return calculateDistanceKm(
      senderCity.lat || 27.7172,
      senderCity.lng || 85.324,
      recipientCity.lat || 40.7128,
      recipientCity.lng || -74.006
    )
  }, [senderCity, recipientCity])

  const distanceMiles = Math.round(distanceKm * 0.621371)
  const estFlightHours = Math.round((distanceKm / 850) * 10) / 10

  // Countdown timer
  const timeLeft = useMemo(() => {
    const diff = new Date(flightState.targetDate).getTime() - now.getTime()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isReunited: true }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isReunited: false,
    }
  }, [flightState.targetDate, now])

  // Map coordinates projection for SVG (Equirectangular projection)
  const getSvgCoords = (lat, lng) => {
    const x = ((lng + 180) / 360) * 600
    const y = ((90 - lat) / 180) * 280
    return { x, y }
  }

  const p1 = getSvgCoords(senderCity.lat || 27.7172, senderCity.lng || 85.324)
  const p2 = getSvgCoords(recipientCity.lat || 40.7128, recipientCity.lng || -74.006)

  // Curvature arc control point
  const midX = (p1.x + p2.x) / 2
  const midY = Math.min(p1.y, p2.y) - 60
  const pathD = `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`

  const toggleCheck = (id) => {
    setFlightState((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      ),
    }))
  }

  const addCheckItem = (e) => {
    e.preventDefault()
    if (!newItemText.trim()) return
    setFlightState((prev) => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        { id: 'item-' + Date.now(), text: newItemText.trim(), done: false },
      ],
    }))
    setNewItemText('')
  }

  const deleteCheckItem = (id) => {
    setFlightState((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((item) => item.id !== id),
    }))
  }

  return (
    <div className="rounded-3xl border border-sky-200/70 bg-gradient-to-br from-sky-50/80 via-white/90 to-indigo-50/80 p-6 shadow-xl backdrop-blur-md dark:border-gray-700/60 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-sky-950/40">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-200/50 dark:shadow-none">
            <Plane className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-xl font-bold text-gray-800 dark:text-gray-100">
                Live Flight & Reunion Bridge ✈️🗺️
              </h3>
              <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                Closing the Distance
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Interactive flight trajectory from {senderCity.flag} {senderCity.city} to {recipientCity.flag} {recipientCity.city}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-2xl border border-sky-200 bg-white px-4 py-2 text-xs font-bold text-sky-700 shadow-sm transition hover:bg-sky-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        >
          {isEditing ? 'Close Details' : '✈️ Edit Flight Date'}
        </button>
      </div>

      {/* Edit Flight Form */}
      {isEditing && (
        <div className="mb-6 rounded-2xl bg-sky-100/60 p-4 dark:bg-gray-800/80 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-sky-900 dark:text-sky-200 mb-1">
                Reunion Date & Time:
              </label>
              <input
                type="datetime-local"
                value={flightState.targetDate}
                onChange={(e) =>
                  setFlightState((prev) => ({ ...prev, targetDate: e.target.value }))
                }
                className="w-full rounded-xl border border-sky-300 bg-white p-2.5 text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-sky-900 dark:text-sky-200 mb-1">
                Airline / Flight Code:
              </label>
              <input
                type="text"
                value={flightState.flightNumber}
                onChange={(e) =>
                  setFlightState((prev) => ({ ...prev, flightNumber: e.target.value }))
                }
                placeholder="e.g., QR-645 / LOVE-101"
                className="w-full rounded-xl border border-sky-300 bg-white p-2.5 text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Countdown Card Banner */}
      <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-200">
              <Ticket className="h-4 w-4" /> Boarding Pass • {flightState.flightNumber}
            </span>
            <h4 className="mt-1 font-serif text-2xl font-bold">
              {senderCity.city} ✈️ {recipientCity.city}
            </h4>
            <p className="mt-1 text-xs text-sky-100">
              Direct Flight Distance: <strong>{distanceKm.toLocaleString()} km</strong> ({distanceMiles.toLocaleString()} miles) • Approx ~{estFlightHours}h flight
            </p>
          </div>

          {/* Countdown timer blocks */}
          <div className="flex items-center gap-2 sm:gap-3">
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Mins', val: timeLeft.minutes },
              { label: 'Secs', val: timeLeft.seconds },
            ].map((unit) => (
              <div
                key={unit.label}
                className="flex flex-col items-center rounded-2xl bg-white/20 px-3 py-2 sm:px-4 sm:py-3 backdrop-blur-md shadow"
              >
                <span className="font-mono text-xl sm:text-2xl font-bold">{unit.val}</span>
                <span className="text-[10px] uppercase font-bold text-sky-200">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Geodesic Flight Map */}
      <div className="mb-6 overflow-hidden rounded-3xl bg-slate-950 p-4 shadow-2xl border border-slate-800">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-semibold text-sky-400">
            <Compass className="h-4 w-4" /> Great Circle Flight Path Arc
          </span>
          <span>Live Coordinates Connected</span>
        </div>

        <div className="relative aspect-[2.1/1] w-full overflow-hidden rounded-2xl bg-[#090d16]">
          <svg viewBox="0 0 600 280" className="h-full w-full">
            {/* World Grid Lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            <rect width="600" height="280" fill="url(#grid)" />

            {/* Flight Path Curve */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="3"
              strokeDasharray="6 4"
              className="animate-pulse"
            />

            {/* City 1 (Sender) */}
            <g transform={`translate(${p1.x}, ${p1.y})`}>
              <circle r="8" fill="#38bdf8" fillOpacity="0.3" className="animate-ping" />
              <circle r="5" fill="#38bdf8" />
              <text x="10" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                {senderCity.flag} {senderCity.city}
              </text>
            </g>

            {/* City 2 (Recipient) */}
            <g transform={`translate(${p2.x}, ${p2.y})`}>
              <circle r="8" fill="#ec4899" fillOpacity="0.3" className="animate-ping" />
              <circle r="5" fill="#ec4899" />
              <text x="10" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                {recipientCity.flag} {recipientCity.city}
              </text>
            </g>

            {/* Animated Plane along path */}
            <g transform={`translate(${midX}, ${midY})`}>
              <circle r="12" fill="#ffffff" fillOpacity="0.1" />
              <text x="-6" y="5" fontSize="14">
                ✈️
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Packing Checklist & Flight Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Packing Checklist */}
        <div className="rounded-2xl bg-white/90 p-4 shadow-md border border-sky-100 dark:bg-gray-800/90 dark:border-gray-700">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
              <Luggage className="h-4 w-4" /> Reunion Packing Checklist
            </h4>
            <span className="text-[11px] font-semibold text-gray-500">
              {flightState.checklist.filter((i) => i.done).length} / {flightState.checklist.length} Packed
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {flightState.checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`flex items-center justify-between rounded-xl p-2 text-xs transition cursor-pointer ${
                  item.done
                    ? 'bg-sky-50 text-sky-900 line-through opacity-70 dark:bg-gray-700 dark:text-gray-400'
                    : 'bg-gray-50 text-gray-800 hover:bg-sky-50/50 dark:bg-gray-700/50 dark:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md border text-[10px] ${
                      item.done
                        ? 'border-sky-500 bg-sky-500 text-white'
                        : 'border-gray-300 bg-white dark:bg-gray-800'
                    }`}
                  >
                    {item.done && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span>{item.text}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteCheckItem(item.id)
                  }}
                  className="text-gray-400 hover:text-rose-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={addCheckItem} className="mt-3 flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Add packing item..."
              className="flex-1 rounded-xl border border-gray-300 bg-white p-2 text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="flex items-center gap-1 rounded-xl bg-sky-600 px-3 py-2 text-xs font-bold text-white shadow hover:bg-sky-700"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </form>
        </div>

        {/* Reunion Milestones */}
        <div className="rounded-2xl bg-white/90 p-4 shadow-md border border-indigo-100 dark:bg-gray-800/90 dark:border-gray-700 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> Journey Milestones
          </h4>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-3 rounded-xl bg-sky-50 p-2.5 dark:bg-gray-700/50">
              <span className="text-base">🎟️</span>
              <div>
                <p className="font-bold text-sky-900 dark:text-sky-200">Countdown Active</p>
                <p className="text-[10px] text-gray-500">Every second brings us closer.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-purple-50 p-2.5 dark:bg-gray-700/50">
              <span className="text-base">🛫</span>
              <div>
                <p className="font-bold text-purple-900 dark:text-purple-200">Departing {senderCity.city}</p>
                <p className="text-[10px] text-gray-500">Boarding with butterflies in stomach.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-rose-50 p-2.5 dark:bg-gray-700/50">
              <span className="text-base">🫂</span>
              <div>
                <p className="font-bold text-rose-900 dark:text-rose-200">Terminal Gate Hug</p>
                <p className="text-[10px] text-gray-500">Dropping luggage and holding tight.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
