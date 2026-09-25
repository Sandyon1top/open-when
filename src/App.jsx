import confetti from 'canvas-confetti'
import { Compass, Gift, Globe2, Heart, Moon, Send, Sparkles, Sun, Trophy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import EnvelopeCard from './EnvelopeCard.jsx'
import LetterModal from './LetterModal.jsx'
import AmbiencePlayer from './components/AmbiencePlayer.jsx'
import CoupleBucketList from './components/CoupleBucketList.jsx'
import CoupleQuiz from './components/CoupleQuiz.jsx'
import CreateGiftWizardModal from './components/CreateGiftWizardModal.jsx'
import PersonalizeModal from './components/PersonalizeModal.jsx'
import PinModal from './components/PinModal.jsx'
import WriteReplyModal from './components/WriteReplyModal.jsx'
import NaughtyWheel from './components/NaughtyWheel.jsx'
import TarotReading from './components/TarotReading.jsx'
import LdrCommandCenter from './components/LdrCommandCenter.jsx'
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
}

export default function App() {
  const [activeTab, setActiveTab] = useState('letters')
  const [darkMode, setDarkMode] = useState(false)
  const [openedIds, setOpenedIds] = useState(loadOpenedIds)
  const [activeLetter, setActiveLetter] = useState(null)
  const [pinLetter, setPinLetter] = useState(null)
  const [personalization, setPersonalization] = useState(getInitialPersonalization)
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false)
  const [isWriteReplyOpen, setIsWriteReplyOpen] = useState(false)
  const [isNaughtyWheelOpen, setIsNaughtyWheelOpen] = useState(false)
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const { recipient, sender, incomingQuizResult, incomingReplyLetter } = personalization

  const currentLetters = useMemo(() => {
    let list = [...defaultLetters]
    if (incomingReplyLetter) {
      list.unshift(incomingReplyLetter)
    }
    return list
  }, [incomingReplyLetter])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

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
    if (letter.pinCode && !openedIds.includes(letter.id)) {
      setPinLetter(letter)
      return
    }
    const alreadyOpened = openedIds.includes(letter.id)
    if (!alreadyOpened) {
      setOpenedIds((current) => [...current, letter.id])
    }
    celebrate([letter.themeColor || '#F8C8DC', letter.flapColor || '#F3AFC8', '#FBF6F0', '#C9A27C', '#E4D4F4'])
    setActiveLetter(letter)
  }

  const handlePinSuccess = (letter) => {
    setOpenedIds((current) => [...current, letter.id])
    setPinLetter(null)
    celebrate(['#F8C8DC', '#E4D4F4', '#C9A27C'])
    setActiveLetter(letter)
  }

  return (
    <div className={`mx-auto min-h-svh max-w-5xl px-4 pb-16 pt-6 sm:px-6 transition-colors duration-300 ${darkMode ? 'dark text-gray-100' : 'text-[#5c4a55]'}`}>
      {/* Premium Sticky Navbar */}
      <div className="sticky top-4 z-40 mb-10 flex flex-col gap-4 rounded-3xl bg-white/70 dark:bg-gray-900/70 p-4 shadow-xl backdrop-blur-md border border-white/50 dark:border-gray-700/50 sm:flex-row sm:items-center sm:justify-between">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap rounded-full bg-white/90 dark:bg-gray-800/90 p-1.5 shadow-md border border-rose-100/80 dark:border-gray-700 backdrop-blur-sm self-center sm:self-auto justify-center">
          <button
            type="button"
            onClick={() => setActiveTab('letters')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === 'letters'
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow'
                : 'text-[#7a6570] dark:text-gray-300 hover:text-[#5c4a55]'
            }`}
          >
            <Heart className="h-3.5 w-3.5 fill-current" /> Letters
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ldr')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === 'ldr'
                ? 'bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white shadow'
                : 'text-[#7a6570] dark:text-gray-300 hover:text-[#5c4a55]'
            }`}
          >
            <Globe2 className="h-3.5 w-3.5" /> LDR Hub 🌍
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tarot')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === 'tarot'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow'
                : 'text-[#7a6570] dark:text-gray-300 hover:text-[#5c4a55]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" /> Tarot Oracle 🔮
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow'
                : 'text-[#7a6570] dark:text-gray-300 hover:text-[#5c4a55]'
            }`}
          >
            <Trophy className="h-3.5 w-3.5" /> Couple Quiz
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bucket')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === 'bucket'
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow'
                : 'text-[#7a6570] dark:text-gray-300 hover:text-[#5c4a55]'
            }`}
          >
            <Compass className="h-3.5 w-3.5" /> Bucket List
          </button>
        </div>

        {/* Right Utilities & Gift Wizard Button */}
        <div className="flex items-center justify-center gap-2 flex-wrap self-center sm:self-auto">
          <AmbiencePlayer />

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-gray-800 text-gray-600 dark:text-amber-300 shadow-sm border border-rose-100 dark:border-gray-700 hover:scale-105 transition"
            aria-label="Toggle Dark Theme"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>



          <button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:opacity-95 animate-pulse"
          >
            <Gift className="h-3.5 w-3.5" /> Make Gift Box 🎁
          </button>

          <button
            type="button"
            onClick={() => setIsWriteReplyOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-rose-100 dark:bg-gray-800 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-300 shadow-sm border border-rose-200 dark:border-gray-700"
          >
            <Send className="h-3.5 w-3.5" /> Reply ✉️
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
          <header className="mb-12 text-center">
            <h1 className="font-serif text-5xl font-extrabold tracking-tight sm:text-7xl">
              <span className="bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
                Open When...
              </span>
              <br />
              <span className="text-[#5c4a55] dark:text-gray-100 text-4xl sm:text-5xl">for {recipient}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-[#7a6570] dark:text-gray-300 leading-relaxed">
              Whenever the day asks too much, or too little, these envelopes are waiting for you.
              Open the one that fits this moment.
            </p>
            <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 px-4 py-3 shadow-md border border-rose-100/50 dark:border-gray-700">
              <Heart className="h-5 w-5 fill-rose-300 text-rose-300 shrink-0" />
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-semibold text-[#5c4a55] dark:text-gray-200 truncate">{progressLabel}</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-rose-100 dark:bg-gray-700">
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
      ) : activeTab === 'ldr' ? (
        <LdrCommandCenter recipient={recipient} sender={sender} />
      ) : activeTab === 'tarot' ? (
        <TarotReading recipient={recipient} sender={sender} />
      ) : activeTab === 'quiz' ? (
        <CoupleQuiz
          recipient={recipient}
          sender={sender}
          incomingQuizResult={incomingQuizResult}
        />
      ) : (
        <CoupleBucketList recipient={recipient} sender={sender} />
      )}

      <footer className="mt-12 text-center text-sm text-[#8a7380] dark:text-gray-400 space-y-3">
        <div>Made with love by {sender} for {recipient}. Ready to deploy anywhere!</div>
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 px-4 py-2 text-xs font-bold text-white shadow"
          >
            <Gift className="h-3.5 w-3.5" /> Make a Gift Box for Someone 🎁
          </button>
          <button
            type="button"
            onClick={() => setIsWriteReplyOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-100 dark:bg-gray-800 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-300 hover:bg-rose-200 transition"
          >
            <Send className="h-3.5 w-3.5" /> Write a Love Letter Back to {sender} ✉️
          </button>
        </div>
      </footer>


      {/* Floating Action Button for Spicy Wheel */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsNaughtyWheelOpen(true)}
          className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-pink-500/50"
        >
          <div className="absolute -inset-2 animate-pulse rounded-full bg-pink-500/30 opacity-75 blur-md" />
          <span className="relative z-10 text-2xl drop-shadow-md">🔥</span>
          
          {/* Tooltip */}
          <span className="absolute -top-12 right-0 w-32 scale-0 rounded-xl bg-gray-900 px-3 py-2 text-center text-xs font-bold text-white shadow-xl transition-all duration-200 group-hover:scale-100 dark:bg-white dark:text-gray-900">
            Play Spicy Wheel
          </span>
        </button>
      </div>

      <LetterModal
        letter={activeLetter}
        onClose={() => setActiveLetter(null)}
        recipient={recipient}
        sender={sender}
      />

      <PinModal
        isOpen={!!pinLetter}
        onClose={() => setPinLetter(null)}
        letter={pinLetter}
        onSuccess={handlePinSuccess}
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
        recipient={sender}
        sender={recipient}
      />

      <CreateGiftWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        initialRecipient={recipient}
        initialSender={sender}
        onComplete={(data) => {
          setPersonalization((prev) => ({ ...prev, ...data }))
          updateUrlWithPersonalization(data.recipient, data.sender)
        }}
      />
      <NaughtyWheel
        isOpen={isNaughtyWheelOpen}
        onClose={() => setIsNaughtyWheelOpen(false)}
        recipient={recipient}
        sender={sender}
      />
    </div>
  )
}
