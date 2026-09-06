import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, X, Lock } from 'lucide-react'

const WHEEL_ITEMS = [
  { label: '💋 Kiss for 30 sec', color: '#E11D48' },
  { label: '🔥 Strip one piece', color: '#9333EA' },
  { label: '👀 Blindfold dare', color: '#DB2777' },
  { label: '🧊 Ice cube trail', color: '#2563EB' },
  { label: '💬 Whisper fantasy', color: '#C026D3' },
  { label: '🍫 Body chocolate', color: '#92400E' },
  { label: '🎭 Role play 5 min', color: '#7C3AED' },
  { label: '💆 Sensual massage', color: '#E11D48' },
  { label: '🫦 Neck kisses only', color: '#BE123C' },
  { label: '🔥 Lap dance dare', color: '#9333EA' },
  { label: '👅 Truth or spicy', color: '#DB2777' },
  { label: '⛓️ BDSM lite dare', color: '#4338CA' },
]

export default function NaughtyWheel({ isOpen, onClose, recipient, sender }) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const canvasRef = useRef(null)

  const segmentAngle = 360 / WHEEL_ITEMS.length

  const handleSpin = () => {
    if (spinning) return
    setSpinning(true)
    setResult(null)

    const extraSpins = 5 + Math.random() * 5
    const randomAngle = Math.random() * 360
    const totalRotation = rotation + extraSpins * 360 + randomAngle

    setRotation(totalRotation)

    setTimeout(() => {
      const normalizedAngle = totalRotation % 360
      const pointerAngle = (360 - normalizedAngle + 90) % 360
      const index = Math.floor(pointerAngle / segmentAngle) % WHEEL_ITEMS.length
      setResult(WHEEL_ITEMS[index])
      setSpinning(false)
    }, 4000)
  }

  const handleUnlock = (e) => {
    e.preventDefault()
    if (pin === '6969' || pin === '1234') {
      setIsUnlocked(true)
    } else {
      alert('Wrong PIN! Hint: try 6969 😏')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative z-10 w-full max-w-md rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6 shadow-2xl border border-pink-500/20 overflow-hidden"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-rose-500/5 pointer-events-none" />

          {/* Close button */}
          <button onClick={onClose} className="absolute right-4 top-4 z-20 rounded-full bg-gray-800 p-1.5 text-gray-400 hover:text-white transition">
            <X className="h-4 w-4" />
          </button>

          {!isUnlocked ? (
            /* PIN Lock Screen */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 text-center space-y-6 py-8"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/30">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">🔞 Naughty Zone</h2>
                <p className="mt-2 text-sm text-gray-400">Enter the secret PIN to unlock the Spicy Wheel</p>
                <p className="mt-1 text-xs text-pink-400/60">Hint: 6969 😏</p>
              </div>
              <form onSubmit={handleUnlock} className="max-w-xs mx-auto space-y-3">
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4-digit PIN"
                  className="w-full rounded-2xl bg-gray-800 border border-pink-500/30 px-4 py-3 text-center text-2xl tracking-[0.5em] text-white font-mono focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/25 hover:opacity-90 transition"
                >
                  Unlock 🔓
                </button>
              </form>
            </motion.div>
          ) : (
            /* Wheel Content */
            <div className="relative z-10 space-y-5">
              <div className="text-center">
                <h2 className="font-serif text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <Flame className="h-6 w-6 text-orange-400 animate-pulse" /> Spicy Wheel
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Spin the wheel and do whatever it lands on 😈
                </p>
              </div>

              {/* Wheel */}
              <div className="relative mx-auto" style={{ width: 280, height: 280 }}>
                {/* Pointer triangle */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-yellow-400 drop-shadow-lg" />
                </div>

                {/* SVG Wheel */}
                <motion.svg
                  viewBox="0 0 300 300"
                  className="w-full h-full drop-shadow-2xl"
                  animate={{ rotate: rotation }}
                  transition={{ duration: 4, ease: [0.2, 0.8, 0.3, 1] }}
                  style={{ transformOrigin: 'center' }}
                >
                  {WHEEL_ITEMS.map((item, i) => {
                    const startAngle = i * segmentAngle
                    const endAngle = (i + 1) * segmentAngle
                    const startRad = (startAngle - 90) * Math.PI / 180
                    const endRad = (endAngle - 90) * Math.PI / 180
                    const x1 = 150 + 140 * Math.cos(startRad)
                    const y1 = 150 + 140 * Math.sin(startRad)
                    const x2 = 150 + 140 * Math.cos(endRad)
                    const y2 = 150 + 140 * Math.sin(endRad)
                    const largeArc = segmentAngle > 180 ? 1 : 0
                    const midAngle = ((startAngle + endAngle) / 2 - 90) * Math.PI / 180
                    const textX = 150 + 90 * Math.cos(midAngle)
                    const textY = 150 + 90 * Math.sin(midAngle)
                    const textRotation = (startAngle + endAngle) / 2

                    return (
                      <g key={i}>
                        <path
                          d={`M150,150 L${x1},${y1} A140,140 0 ${largeArc},1 ${x2},${y2} Z`}
                          fill={item.color}
                          stroke="rgba(0,0,0,0.3)"
                          strokeWidth="1"
                        />
                        <text
                          x={textX}
                          y={textY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="7"
                          fontWeight="bold"
                          transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                        >
                          {item.label}
                        </text>
                      </g>
                    )
                  })}
                  {/* Center circle */}
                  <circle cx="150" cy="150" r="20" fill="#1a1a2e" stroke="#f472b6" strokeWidth="3" />
                  <text x="150" y="150" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14">🔥</text>
                </motion.svg>
              </div>

              {/* Spin Button */}
              <button
                onClick={handleSpin}
                disabled={spinning}
                className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 py-4 text-sm font-bold text-white shadow-lg shadow-pink-500/30 hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                <Flame className="h-5 w-5" />
                {spinning ? 'Spinning... 🌀' : 'SPIN THE WHEEL 🎰'}
              </button>

              {/* Result */}
              <AnimatePresence>
                {result && !spinning && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 p-5 text-center space-y-2"
                  >
                    <p className="text-xs uppercase tracking-widest text-pink-300 font-semibold">You landed on...</p>
                    <p className="font-serif text-2xl font-bold text-white">{result.label}</p>
                    <p className="text-xs text-gray-400">
                      {sender} must do this for {recipient} right now! 😈🔥
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
