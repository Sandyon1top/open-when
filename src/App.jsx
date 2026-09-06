import confetti from 'canvas-confetti'
import { Heart, Send, Sparkles, Trophy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import EnvelopeCard from './EnvelopeCard.jsx'
import LetterModal from './LetterModal.jsx'
import CoupleQuiz from './components/CoupleQuiz.jsx'
import PersonalizeModal from './components/PersonalizeModal.jsx'
import WriteReplyModal from './components/WriteReplyModal.jsx'
import {
  STORAGE_KEY,
  defaultLetters,
  getInitialPersonalization,
  isLetterUnlocked,
  updateUrlWithPersonalization,
} from './lettersData.js'

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
  const [activeTab, setActiveTab] = useState('letters') // 'letters' | 'quiz'
  const [openedIds, setOpenedIds] = useState(loadOpenedIds)
  const [activeLetter, setActiveLetter] = useState(null)
  const [personalization, setPersonalization] = useState(getInitialPersonalization)
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false)
  const [isWriteReplyOpen, setIsWriteReplyOpen] = useState(false)

  const { recipient, sender, incomingQuizResult, incomingReplyLetter } = personalization

  const currentLetters = useMemo(() => {
    let list = [...defaultLetters]
    if (incomingReplyLetter) {
      list.unshift(incomingReplyLetter)
    }
    return list
  }, [incomingReplyLetter])

  useEffect(() => {
    updateUrlWithPersonalization(recipient, sender)
  }, [recipient, sender])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(openedIds))
  }, [openedIds])

  const openedCount = openedIds.filter((id) =>
    currentLetters.some((letter) => letter.id === id)
  ).length

  const progressLabel = useMemo(() => {
    if (openedCount === 0) return `None opened yet — start with whichever your heart needs, ${recipient}.`
    if (openedCount === currentLetters.length)
      return `Every envelope has been unsealed. ${sender} is right here.`
    return `${openedCount} of ${currentLetters.length} envelopes unsealed for ${recipient}`
  }, [openedCount, currentLetters.length, recipient, sender])

  const handleOpen = (letter) => {
    if (!isLetterUnlocked(letter)) return
    const alreadyOpened = openedIds.includes(letter.id)
    if (!alreadyOpened) {
      setOpenedIds((current) => [...current, letter.id])
    }
    celebrate([letter.themeColor || '#F8C8DC', letter.flapColor || '#F3AFC8', '#FBF6F0', '#C9A27C', '#E4D4F4'])
    setActiveLetter(letter)
  }

  return (
    <div className="mx-auto min-h-svh max-w-5xl px-4 pb-16 pt-6 sm:px-6">
      {/* Navigation & Personalization Top Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Main Tab Switcher */}
        <div className="flex rounded-full bg-white/90 p-1.5 shadow-md border border-rose-100/80 backdrop-blur-sm self-center sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('letters')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition ${
              activeTab === 'letters'
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow'
                : 'text-[#7a6570] hover:text-[#5c4a55]'
            }`}
          >
            <Heart className="h-4 w-4 fill-current" /> Open When Letters
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow'
                : 'text-[#7a6570] hover:text-[#5c4a55]'
            }`}
          >
            <Trophy className="h-4 w-4" /> Couple Quiz
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 self-center sm:self-auto">
          <button
            type="button"
            onClick={() => setIsWriteReplyOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-rose-600"
          >
            <Send className="h-3.5 w-3.5" /> Write Letter Back ✉️
          </button>
          <button
            type="button"
            onClick={() => setIsPersonalizeOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-rose-500 shadow-md backdrop-blur-sm transition hover:bg-rose-50 border border-rose-100"
          >
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            Personalize 💌
          </button>
        </div>
      </div>

      {/* Shared Incoming Letter Alert Banner */}
      {incomingReplyLetter && (
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-rose-400 via-pink-400 to-pink-500 p-6 text-white shadow-xl text-center space-y-2">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest">
            💌 Special Letter Received!
          </span>
          <h3 className="font-serif text-3xl font-bold">
            {incomingReplyLetter.sender || 'Your Partner'} wrote a personal letter for {recipient}!
          </h3>
          <p className="text-xs text-rose-100">
            A new sealed envelope has been placed right at the top of your letters below. Tap it to unseal!
          </p>
        </div>
      )}

      {activeTab === 'letters' ? (
        <>
          <header className="mb-10 text-center">
            <p className="font-script text-4xl text-rose-400 sm:text-5xl">
              Open when... {recipient !== 'My Love' ? `For ${recipient}` : ''}
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-[#5c4a55] sm:text-5xl">
              A little box of letters for {recipient}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[#7a6570] leading-relaxed">
              Whenever the day asks too much, or too little, these envelopes are waiting for you.
              Open the one that fits this moment.
            </p>
            <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-md border border-rose-100/50">
              <Heart className="h-5 w-5 fill-rose-300 text-rose-300 shrink-0" />
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-semibold text-[#5c4a55] truncate">{progressLabel}</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-rose-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-300 via-pink-300 to-violet-300 transition-all duration-500"
                    style={{ width: `${(openedCount / currentLetters.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </header>

          <main className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {currentLetters.map((letter) => (
              <EnvelopeCard
                key={letter.id}
                letter={letter}
                opened={openedIds.includes(letter.id)}
                onOpen={handleOpen}
                recipient={recipient}
                sender={sender}
              />
            ))}
          </main>
        </>
      ) : (
        <CoupleQuiz
          recipient={recipient}
          sender={sender}
          incomingQuizResult={incomingQuizResult}
        />
      )}

      <footer className="mt-12 text-center text-sm text-[#8a7380] space-y-3">
        <div>Made with love by {sender} for {recipient}. Ready to deploy anywhere!</div>
        <div>
          <button
            type="button"
            onClick={() => setIsWriteReplyOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-100 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-200 transition"
          >
            <Send className="h-3.5 w-3.5" /> Write a Love Letter Back to {sender} ✉️
          </button>
        </div>
      </footer>

      <LetterModal
        letter={activeLetter}
        onClose={() => setActiveLetter(null)}
        recipient={recipient}
        sender={sender}
      />

      <PersonalizeModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        recipient={recipient}
        sender={sender}
        onSave={(data) => {
          setPersonalization((prev) => ({ ...prev, ...data }))
          updateUrlWithPersonalization(data.recipient, data.sender)
          setIsPersonalizeOpen(false)
        }}
        letters={currentLetters}
        onUpdateLetters={() => {}}
      />

      <WriteReplyModal
        isOpen={isWriteReplyOpen}
        onClose={() => setIsWriteReplyOpen(false)}
        recipient={sender} // When you write a letter back, recipient is the original sender!
        sender={recipient}
      />
    </div>
  )
}
