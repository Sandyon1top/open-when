import { motion } from 'framer-motion'
import { Heart, Lock } from 'lucide-react'
import { getUnlockHint, interpolateText, isLetterUnlocked } from './lettersData.js'

export default function EnvelopeCard({ letter, opened, onOpen, recipient, sender }) {
  const unlocked = isLetterUnlocked(letter)
  const hint = getUnlockHint(letter)
  const title = interpolateText(letter.title, recipient, sender)

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
      <article className="overflow-hidden rounded-3xl bg-[#fffaf6] shadow-md transition-shadow duration-300 group-hover:shadow-xl border border-rose-100/60">
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
            {unlocked ? (
              <Heart className="h-6 w-6 fill-white text-white" />
            ) : (
              <Lock className="h-5 w-5 text-white" />
            )}
          </div>
        </div>

        <div className="space-y-3 px-6 pb-6 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-serif text-xl font-semibold leading-snug text-[#5c4a55] md:text-[1.3rem]">
              {title}
            </h2>
            {opened ? (
              <span className="shrink-0 rounded-full bg-rose-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-500">
                Unsealed
              </span>
            ) : unlocked ? (
              <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                Sealed
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-violet-500">
                Wait
              </span>
            )}
          </div>
          <p className="text-sm text-[#7a6570] leading-relaxed">
            {unlocked
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
