import { motion } from 'framer-motion'
import { Clock, Heart, KeyRound, Lock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCountdownRemaining, getUnlockHint, interpolateText, isLetterUnlocked } from './lettersData.js'

export default function EnvelopeCard({ letter, opened, onOpen, recipient, sender }) {
  const [countdown, setCountdown] = useState(() => getCountdownRemaining(letter.unlockDate))
  const unlocked = isLetterUnlocked(letter)
  const hint = getUnlockHint(letter)
  const title = interpolateText(letter.title, recipient, sender)

  useEffect(() => {
    if (!letter.unlockDate || unlocked) return undefined
    const timer = setInterval(() => {
      setCountdown(getCountdownRemaining(letter.unlockDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [letter.unlockDate, unlocked])

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(letter)}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative w-full text-left transition-all duration-300 ${
        unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-90'
      }`}
    >
      <article className="overflow-hidden rounded-3xl bg-[#fffaf6] dark:bg-gray-800 shadow-md transition-shadow duration-300 group-hover:shadow-xl border border-rose-100/60 dark:border-gray-700">
        <div
          className="relative h-44 w-full p-4 overflow-hidden"
          style={{ background: letter.bodyColor }}
        >
          {/* Envelope flap aesthetic */}
          <div
            className="absolute left-1/2 top-0 h-28 w-4/5 -translate-x-1/2 rounded-b-[48px] shadow-sm transition-transform duration-300 group-hover:translate-y-1"
            style={{ background: letter.flapColor }}
          />

          {/* Envelope seal icon */}
          <div
            className="absolute left-1/2 top-20 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full shadow-md transition-transform duration-300 group-hover:scale-110"
            style={{ background: letter.waxColor }}
          >
            {letter.pinCode ? (
              <KeyRound className="h-6 w-6 text-white" />
            ) : unlocked ? (
              <Heart className="h-6 w-6 fill-white text-white" />
            ) : (
              <Lock className="h-5 w-5 text-white" />
            )}
          </div>
        </div>

        <div className="space-y-3 px-6 pb-6 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-serif text-xl font-semibold leading-snug text-[#5c4a55] dark:text-gray-100 md:text-[1.3rem]">
              {title}
            </h2>
            {letter.pinCode ? (
              <span className="shrink-0 rounded-full bg-purple-100 dark:bg-purple-900/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300 flex items-center gap-1">
                <KeyRound className="h-3 w-3" /> PIN Locked
              </span>
            ) : opened ? (
              <span className="shrink-0 rounded-full bg-rose-100 dark:bg-rose-900/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-300">
                Unsealed
              </span>
            ) : unlocked ? (
              <span className="shrink-0 rounded-full bg-emerald-50 dark:bg-emerald-900/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                Sealed
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-violet-50 dark:bg-violet-900/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-violet-500 dark:text-violet-300">
                Wait
              </span>
            )}
          </div>

          {/* Live Countdown Badge */}
          {letter.unlockDate && !unlocked && countdown && (
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 px-3 py-1 text-xs font-mono font-bold text-violet-600 dark:text-violet-300">
              <Clock className="h-3.5 w-3.5 animate-spin" /> Unlocks in: {countdown}
            </div>
          )}

          <p className="text-sm text-[#7a6570] dark:text-gray-300 leading-relaxed">
            {letter.pinCode
              ? `Secret PIN protected letter for ${recipient}. Tap to enter PIN.`
              : unlocked
                ? opened
                  ? 'Already opened — tap to read it again whenever you need it.'
                  : `Tap to open this letter for ${recipient}. A little surprise is waiting inside.`
                : `This one is meant for ${hint}. Come back then, ${recipient}.`}
          </p>
        </div>
      </article>
    </motion.button>
  )
}
