import { AnimatePresence, motion } from 'framer-motion'
import { Music, X } from 'lucide-react'
import { useEffect } from 'react'
import { getYouTubeEmbedUrl, interpolateText } from './lettersData.js'

function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

export default function LetterModal({ letter, onClose, recipient, sender }) {
  useEffect(() => {
    if (!letter) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [letter])

  if (!letter) return null

  const title = interpolateText(letter.title, recipient, sender)
  const message = interpolateText(letter.message, recipient, sender)
  const embedUrl = getYouTubeEmbedUrl(letter.youtubeUrl)

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button
          type="button"
          aria-label="Close letter"
          className="absolute inset-0 bg-[#5c4a55]/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="letter-title"
          initial={{ y: 48, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 32, opacity: 0, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[#fffaf6] shadow-2xl border border-rose-100"
        >
          <div className={`bg-gradient-to-br ${letter.accentClass} px-6 pb-6 pt-6`}>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-script text-3xl text-rose-400">For {recipient}</span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white/80 p-2 text-[#7a6570] shadow-md transition hover:scale-105"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <h2
              id="letter-title"
              className="font-serif text-3xl font-semibold leading-tight text-[#5c4a55]"
            >
              {title}
            </h2>
          </div>

          <div className="space-y-6 px-6 py-6">
            <p className="font-serif text-lg leading-relaxed text-[#6b5560] whitespace-pre-line">
              {message}
            </p>

            {letter.gifUrl && (
              <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                <img
                  src={letter.gifUrl}
                  alt="A little mood for this letter"
                  className="h-56 w-full object-cover"
                />
              </div>
            )}

            {/* YouTube Song Player */}
            {embedUrl ? (
              <div className="rounded-2xl border border-rose-100 bg-white/90 p-4 shadow-md backdrop-blur-sm space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#5c4a55] flex items-center gap-2">
                    <YoutubeIcon className="h-5 w-5 text-red-500 shrink-0" />
                    {letter.songTitle || 'Special YouTube Song'}
                  </p>
                  <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                    Dedicated Song
                  </span>
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-inner">
                  <iframe
                    src={embedUrl}
                    title={letter.songTitle || 'YouTube Song Player'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              </div>
            ) : letter.youtubeUrl ? (
              <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-md text-center">
                <p className="text-sm font-semibold text-[#5c4a55] mb-2 flex items-center justify-center gap-2">
                  <Music className="h-4 w-4 text-rose-400" />
                  {letter.songTitle || 'Dedicated Song'}
                </p>
                <a
                  href={letter.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-red-600 transition"
                >
                  <YoutubeIcon className="h-4 w-4" /> Listen on YouTube
                </a>
              </div>
            ) : null}

            <div className="text-right font-script text-2xl text-rose-400 pt-2">
              With love, {sender} ♥
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
