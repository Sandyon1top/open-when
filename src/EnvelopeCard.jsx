import { motion } from 'framer-motion'
import { Heart, Lock, MailOpen } from 'lucide-react'
import { getUnlockHint, isLetterUnlocked } from './lettersData'

export default function EnvelopeCard({ letter, opened, onOpen }) {
  const unlocked = isLetterUnlocked(letter)
  const hint = getUnlockHint(letter)

  return (
    <motion.button
      type="button"
      layout
      whileHover={unlocked ? { scale: 1.05, y: -4 } : { scale: 1 }}
      whileTap={unlocked ? { scale: 0.98 } : { x: [0, -6, 6, -4, 4, 0] }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      onClick={() => onOpen(letter)}
      aria-disabled={!unlocked}
      className={`group w-full text-left rounded-2xl shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${
        opened ? 'opacity-80' : 'opacity-100'
      }`}
    >
      <article
        className="overflow-hidden rounded-2xl border border-white/70"
        style={{ background: letter.bodyColor }}
      >
        <div className="envelope-scene px-5 pt-5">
          <div className="relative mx-auto h-40 max-w-[240px]">
            <div
              className="absolute inset-x-0 bottom-0 h-[72%] rounded-md shadow-md"
              style={{ background: letter.themeColor }}
            />
            <div
              className="absolute inset-x-3 bottom-8 top-10 rounded-sm bg-[#fffaf6] shadow-sm"
              aria-hidden
            />
            <motion.div
              className="envelope-flap absolute inset-x-0 top-0 h-[48%] origin-top"
              initial={false}
              animate={{ rotateX: opened ? 155 : 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: `linear-gradient(180deg, ${letter.flapColor} 0%, ${letter.themeColor} 100%)`,
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                transformStyle: 'preserve-3d',
              }}
            />
            <div
              className="absolute left-1/2 top-[42%] z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full shadow-md"
              style={{ background: letter.waxColor }}
            >
              {unlocked ? (
                opened ? (
                  <MailOpen className="h-5 w-5 text-white" strokeWidth={2.2} />
                ) : (
                  <Heart className="h-5 w-5 fill-white text-white" />
                )
              ) : (
                <Lock className="h-5 w-5 text-white" />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 px-5 pb-5 pt-3">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-serif text-xl font-semibold leading-snug text-[#5c4a55] md:text-[1.35rem]">
              {letter.title}
            </h2>
            {opened ? (
              <span className="shrink-0 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-rose-400">
                Unsealed
              </span>
            ) : unlocked ? (
              <span className="shrink-0 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600/80">
                Sealed
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-violet-500">
                Wait
              </span>
            )}
          </div>
          <p className="text-sm text-[#7a6570]">
            {unlocked
              ? opened
                ? 'Already opened — tap to read it again whenever you need it.'
                : 'Tap to open this letter. A little surprise is waiting inside.'
              : `This one is meant for ${hint}. Come back then, my love.`}
          </p>
        </div>
      </article>
    </motion.button>
  )
}
