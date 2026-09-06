import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, Music, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getYouTubeEmbedUrl, interpolateText } from './lettersData.js'

function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

export default function LetterModal({ letter, onClose, recipient, sender }) {
  const [photoIndex, setPhotoIndex] = useState(0)

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
  const photos = letter.photos || []

  const handleSendKiss = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([100, 50, 100, 50, 150])
    }
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#F8C8DC', '#E4D4F4', '#FF1493', '#FF69B4', '#FFB6C1'],
    })
  }

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
          className="absolute inset-0 bg-[#5c4a55]/50 backdrop-blur-sm"
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
          className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[#fffaf6] dark:bg-gray-800 shadow-2xl border border-rose-100 dark:border-gray-700"
        >
          <div className={`bg-gradient-to-br ${letter.accentClass || 'from-rose-100 to-pink-50'} px-6 pb-6 pt-6`}>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-script text-3xl text-rose-500">For {recipient}</span>
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
            <p className="font-serif text-lg leading-relaxed text-[#6b5560] dark:text-gray-200 whitespace-pre-line">
              {message}
            </p>

            {/* Polaroid Photo Scrapbook Carousel */}
            {photos.length > 0 ? (
              <div className="rounded-2xl bg-white dark:bg-gray-700 p-4 shadow-lg border border-rose-100 dark:border-gray-600 text-center space-y-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  <img
                    src={photos[photoIndex].url}
                    alt="Memory polaroid"
                    className="h-full w-full object-cover"
                  />
                  {photos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setPhotoIndex((i) => (i === 0 ? photos.length - 1 : i - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60 transition"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoIndex((i) => (i === photos.length - 1 ? 0 : i + 1))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60 transition"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
                <p className="font-script text-xl text-rose-500 dark:text-rose-300 font-medium">
                  {photos[photoIndex].caption}
                </p>
              </div>
            ) : letter.gifUrl ? (
              <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                <img
                  src={letter.gifUrl}
                  alt="A little mood for this letter"
                  className="h-56 w-full object-cover"
                />
              </div>
            ) : null}

            {/* YouTube Song Player */}
            {embedUrl ? (
              <div className="rounded-2xl border border-rose-100 dark:border-gray-600 bg-white/90 dark:bg-gray-700 p-4 shadow-md backdrop-blur-sm space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#5c4a55] dark:text-gray-100 flex items-center gap-2">
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
            ) : null}

            {/* Digital Hugs & Kisses Interactive Action */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleSendKiss}
                className="w-full rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-pink-500 py-3.5 text-sm font-bold text-white shadow-md hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                <Heart className="h-5 w-5 fill-white animate-pulse" /> Send Warm Hugs & Kisses 💋
              </button>
            </div>

            <div className="text-right font-script text-2xl text-rose-400 pt-2">
              With love, {sender} ♥
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
