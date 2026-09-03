import confetti from 'canvas-confetti'
import { Heart } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import EnvelopeCard from './EnvelopeCard.jsx'
import LetterModal from './LetterModal.jsx'
import { STORAGE_KEY, isLetterUnlocked, letters } from './lettersData.js'

function loadOpenedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function celebrate(colors) {
  confetti({
    particleCount: 110,
    spread: 78,
    origin: { y: 0.62 },
    colors,
    scalar: 0.95,
  })
  window.setTimeout(() => {
    confetti({
      particleCount: 55,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    })
    confetti({
      particleCount: 55,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    })
  }, 180)
}

export default function App() {
  const [openedIds, setOpenedIds] = useState(loadOpenedIds)
  const [activeLetter, setActiveLetter] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(openedIds))
  }, [openedIds])

  const openedCount = openedIds.filter((id) => letters.some((letter) => letter.id === id)).length

  const progressLabel = useMemo(() => {
    if (openedCount === 0) return 'None opened yet — start with whichever your heart needs.'
    if (openedCount === letters.length) return 'Every envelope has been unsealed. I am still right here.'
    return `${openedCount} of ${letters.length} envelopes unsealed`
  }, [openedCount])

  const handleOpen = (letter) => {
    if (!isLetterUnlocked(letter)) return
    const alreadyOpened = openedIds.includes(letter.id)
    if (!alreadyOpened) {
      setOpenedIds((current) => [...current, letter.id])
    }
    celebrate([letter.themeColor, letter.flapColor, '#FBF6F0', '#C9A27C', '#E4D4F4'])
    setActiveLetter(letter)
  }

  return (
    <div className="mx-auto min-h-svh max-w-5xl px-4 pb-16 pt-10 sm:px-6">
      <header className="mb-10 text-center">
        <p className="font-script text-4xl text-rose-400 sm:text-5xl">Open when…</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-[#5c4a55] sm:text-5xl">
          A little box of letters for you
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[#7a6570]">
          Whenever the day asks too much, or too little, these envelopes are waiting.
          Open the one that fits this moment.
        </p>
        <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-md">
          <Heart className="h-5 w-5 fill-rose-300 text-rose-300" />
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-semibold text-[#5c4a55]">{progressLabel}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-rose-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-300 via-amber-200 to-violet-300 transition-all duration-500"
                style={{ width: `${(openedCount / letters.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {letters.map((letter) => (
          <EnvelopeCard
            key={letter.id}
            letter={letter}
            opened={openedIds.includes(letter.id)}
            onOpen={handleOpen}
          />
        ))}
      </main>

      <footer className="mt-12 text-center text-sm text-[#8a7380]">
        Made with a soft heart. Your opened letters stay saved on this device.
      </footer>

      <LetterModal letter={activeLetter} onClose={() => setActiveLetter(null)} />
    </div>
  )
}
