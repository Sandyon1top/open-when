import { AnimatePresence, motion } from 'framer-motion'
import { Pause, Play, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function LetterModal({ letter, onClose }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    setIsPlaying(false)
    setProgress(0)
    setDuration(0)

    const audio = audioRef.current
    if (!audio) return undefined

    audio.pause()
    audio.currentTime = 0

    const onTime = () => {
      setProgress(audio.currentTime)
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    }
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onTime)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.pause()
      audio.currentTime = 0
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onTime)
      audio.removeEventListener('ended', onEnded)
    }
  }, [letter?.id])

  const handleClose = () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    setIsPlaying(false)
    setProgress(0)
    onClose()
  }

  useEffect(() => {
    if (!letter) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [letter])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }
    try {
      await audio.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  const seek = (event) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const next = Number(event.target.value)
    audio.currentTime = next
    setProgress(next)
  }

  const percent = duration ? (progress / duration) * 100 : 0

  return (
    <AnimatePresence>
      {letter ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close letter"
            className="absolute inset-0 bg-[#5c4a55]/40 backdrop-blur-[3px]"
            onClick={handleClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="letter-title"
            initial={{ y: 48, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 32, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[#fffaf6] shadow-md"
          >
            <div
              className={`bg-gradient-to-br ${letter.accentClass} px-6 pb-5 pt-6`}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <p className="font-script text-3xl text-rose-400">For you</p>
                <button
                  type="button"
                  onClick={handleClose}
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
                {letter.title}
              </h2>
            </div>

            <div className="space-y-5 px-6 py-6">
              <p className="font-serif text-lg leading-relaxed text-[#6b5560]">
                {letter.message}
              </p>

              <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                <img
                  src={letter.gifUrl}
                  alt="A little mood for this letter"
                  className="h-52 w-full object-cover"
                />
              </div>

              <audio key={letter.id} ref={audioRef} src={letter.audioUrl} preload="metadata" />

              <div
                className="rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-md"
                style={{ borderColor: letter.themeColor }}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-md transition hover:scale-105"
                    style={{ background: letter.flapColor }}
                    aria-label={isPlaying ? 'Pause song' : 'Play song'}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 fill-white" />
                    ) : (
                      <Play className="ml-0.5 h-5 w-5 fill-white" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#5c4a55]">
                      A song for this moment
                    </p>
                    <p className="text-xs text-[#8a7380]">
                      {formatTime(progress)} / {formatTime(duration)}
                    </p>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      step="0.1"
                      value={progress}
                      onChange={seek}
                      className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-rose-100"
                      style={{
                        background: `linear-gradient(to right, ${letter.flapColor} ${percent}%, #f8e8ee ${percent}%)`,
                      }}
                      aria-label="Song progress"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
