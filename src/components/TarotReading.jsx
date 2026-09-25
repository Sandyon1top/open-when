import confetti from 'canvas-confetti'
import {
  Anchor,
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  ChevronRight,
  Coins,
  Compass,
  Copy,
  CupSoda,
  Droplet,
  Eye,
  Flame,
  Flower2,
  GitBranch,
  Globe,
  Heart,
  HeartCrack,
  HeartHandshake,
  Hourglass,
  Lightbulb,
  Moon,
  MoonStar,
  Navigation,
  RefreshCw,
  RotateCw,
  Scale,
  Shield,
  Sparkle,
  Sparkles,
  Stars,
  Sun,
  Wand2,
  Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { INTENTION_CATEGORIES, SPREAD_TYPES, TAROT_DECK } from '../data/tarotData.js'

// Map icon string names to actual Lucide component
const ICON_MAP = {
  Compass,
  Wand2,
  Moon,
  Flower2,
  Shield,
  BookOpen,
  HeartHandshake,
  Zap,
  Flame,
  Lightbulb,
  RotateCw,
  Scale,
  Anchor,
  Sparkle,
  Droplet,
  Stars,
  MoonStar,
  Sun,
  Globe,
  Heart,
  Coins,
  HeartCrack,
  Sparkles,
  Navigation,
  CupSoda,
  Hourglass,
  GitBranch,
}

function getCardIcon(name) {
  const Component = ICON_MAP[name] || Sparkles
  return <Component className="h-7 w-7" />
}

const STORAGE_TAROT_HISTORY = 'open_when_tarot_history_v1'

export default function TarotReading({ recipient = 'You', sender = 'Universe' }) {
  const [selectedSpreadId, setSelectedSpreadId] = useState('daily')
  const [selectedIntentionId, setSelectedIntentionId] = useState('general')
  const [customQuestion, setCustomQuestion] = useState('')
  const [allowReversals, setAllowReversals] = useState(true)

  // Reading Flow State: 'setup' | 'shuffling' | 'picking' | 'reading'
  const [stage, setStage] = useState('setup')
  const [pickedCards, setPickedCards] = useState([])
  const [revealedIndices, setRevealedIndices] = useState([])
  const [activeCardModal, setActiveCardModal] = useState(null)
  const [activeTabSection, setActiveTabSection] = useState('overview') // overview | love | career | growth
  const [copied, setCopied] = useState(false)
  const [savedToHistory, setSavedToHistory] = useState(false)
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_TAROT_HISTORY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  const activeSpread = useMemo(() => {
    return SPREAD_TYPES.find((s) => s.id === selectedSpreadId) || SPREAD_TYPES[0]
  }, [selectedSpreadId])

  const activeIntention = useMemo(() => {
    return INTENTION_CATEGORIES.find((c) => c.id === selectedIntentionId) || INTENTION_CATEGORIES[0]
  }, [selectedIntentionId])

  // Start the ritual: shuffle deck
  const handleStartShuffle = () => {
    setStage('shuffling')
    setPickedCards([])
    setRevealedIndices([])
    setSavedToHistory(false)

    // Simulate authentic shuffling ritual
    setTimeout(() => {
      setStage('picking')
    }, 1800)
  }

  // Draw random card not already picked
  const handleSelectCardFromFan = (cardIndex) => {
    if (pickedCards.length >= activeSpread.cardCount) return

    // Pick a card from TAROT_DECK that hasn't been chosen yet
    const remainingDeck = TAROT_DECK.filter(
      (c) => !pickedCards.some((picked) => picked.card.id === c.id)
    )
    if (remainingDeck.length === 0) return

    const randomCard = remainingDeck[Math.floor(Math.random() * remainingDeck.length)]
    const isReversed = allowReversals ? Math.random() < 0.28 : false

    const newPicked = [
      ...pickedCards,
      {
        card: randomCard,
        isReversed,
        positionTitle: activeSpread.positions[pickedCards.length] || `Card ${pickedCards.length + 1}`,
        deckIndex: cardIndex,
      },
    ]

    setPickedCards(newPicked)

    if (newPicked.length === activeSpread.cardCount) {
      setTimeout(() => {
        setStage('reading')
      }, 700)
    }
  }

  const handleAutoDraw = () => {
    const shuffled = [...TAROT_DECK].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, activeSpread.cardCount).map((card, idx) => ({
      card,
      isReversed: allowReversals ? Math.random() < 0.28 : false,
      positionTitle: activeSpread.positions[idx] || `Card ${idx + 1}`,
      deckIndex: idx,
    }))

    setPickedCards(selected)
    setStage('reading')
  }

  const handleRevealCard = (index) => {
    if (!revealedIndices.includes(index)) {
      const next = [...revealedIndices, index]
      setRevealedIndices(next)

      // When all cards revealed, celebrate with stars
      if (next.length === pickedCards.length) {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#c084fc', '#f472b6', '#fbbf24', '#38bdf8'],
        })
      }
    }
  }

  const handleRevealAll = () => {
    const all = pickedCards.map((_, i) => i)
    setRevealedIndices(all)
    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#c084fc', '#f472b6', '#fbbf24', '#38bdf8', '#34d399'],
    })
  }

  const handleCopyReading = () => {
    if (pickedCards.length === 0) return
    const textLines = [
      `🔮 Tarot Oracle Reading for ${recipient}`,
      `✨ Spread: ${activeSpread.title}`,
      `🎯 Focus: ${activeIntention.label}${customQuestion ? ` ("${customQuestion}")` : ''}`,
      `----------------------------------------`,
      ...pickedCards.map((p, i) => {
        const data = p.isReversed ? p.card.reversed : p.card.upright
        return `[${p.positionTitle}]: ${p.card.name} ${p.isReversed ? '(Reversed 🔄)' : '(Upright ✨)'}\nKey: ${p.card.keywords.join(', ')}\nInsight: ${data.summary}\nAction: ${data.actionStep}\n`
      }),
      `----------------------------------------`,
      `💫 May this guidance bring you profound clarity and peace.`,
    ]

    navigator.clipboard.writeText(textLines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSaveToJournal = () => {
    if (pickedCards.length === 0 || savedToHistory) return
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      spreadTitle: activeSpread.title,
      intention: activeIntention.label,
      question: customQuestion,
      cards: pickedCards.map((p) => ({
        name: p.card.name,
        isReversed: p.isReversed,
        positionTitle: p.positionTitle,
        keywords: p.card.keywords,
        summary: p.isReversed ? p.card.reversed.summary : p.card.upright.summary,
        actionStep: p.isReversed ? p.card.reversed.actionStep : p.card.upright.actionStep,
      })),
    }

    const updated = [newEntry, ...history].slice(0, 30)
    setHistory(updated)
    localStorage.setItem(STORAGE_TAROT_HISTORY, JSON.stringify(updated))
    setSavedToHistory(true)
  }

  const handleDeleteHistory = (id) => {
    const filtered = history.filter((h) => h.id !== id)
    setHistory(filtered)
    localStorage.setItem(STORAGE_TAROT_HISTORY, JSON.stringify(filtered))
  }

  const handleReset = () => {
    setStage('setup')
    setPickedCards([])
    setRevealedIndices([])
    setActiveCardModal(null)
    setSavedToHistory(false)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-8 text-white shadow-2xl border border-purple-500/30">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-3.5 py-1 text-xs font-semibold text-purple-200 border border-purple-400/30 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin" /> Cosmic Guidance for {recipient}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight">
              Tarot Oracle & Sacred Wisdom
            </h2>
            <p className="max-w-xl text-sm sm:text-base text-purple-200/90 leading-relaxed">
              Authentic archetypal insights designed for personal clarity, dating, career moves, healing, and relationships.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-semibold text-purple-100 border border-purple-300/30 transition shadow-sm backdrop-blur-md"
            >
              <Bookmark className="h-4 w-4 text-amber-300" />
              Journal History ({history.length})
            </button>
            {stage !== 'setup' && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-2xl bg-purple-600/80 hover:bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
                New Spread
              </button>
            )}
          </div>
        </div>
      </div>

      {/* STAGE 1: SETUP & INTENTION */}
      {stage === 'setup' && (
        <div className="space-y-8">
          {/* Step 1: Spread Selection */}
          <div className="rounded-3xl bg-white/80 dark:bg-gray-800/80 p-6 sm:p-8 shadow-xl border border-rose-100/60 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/60 text-xs font-bold text-purple-600 dark:text-purple-300">
                1
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-800 dark:text-gray-100">
                Choose Your Spread
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SPREAD_TYPES.map((spread) => {
                const isSelected = selectedSpreadId === spread.id
                const SpreadIcon = ICON_MAP[spread.icon] || Sparkles

                return (
                  <button
                    key={spread.id}
                    type="button"
                    onClick={() => setSelectedSpreadId(spread.id)}
                    className={`relative text-left p-5 rounded-2xl transition-all duration-300 border ${
                      isSelected
                        ? 'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent border-purple-500 shadow-md ring-2 ring-purple-400/40 dark:bg-purple-950/30'
                        : 'bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/80 hover:border-purple-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          isSelected
                            ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md'
                            : 'bg-purple-100 dark:bg-gray-700 text-purple-600 dark:text-purple-300'
                        }`}
                      >
                        <SpreadIcon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-purple-100 dark:bg-purple-900/40 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 dark:text-purple-300">
                        {spread.cardCount} {spread.cardCount === 1 ? 'Card' : 'Cards'}
                      </span>
                    </div>

                    <h4 className="mt-3 font-serif text-lg font-bold text-gray-900 dark:text-gray-100">
                      {spread.title}
                    </h4>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                      {spread.subtitle}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-purple-600 dark:text-purple-400">
                      <span>{spread.badge}</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Intention & Focus Area */}
          <div className="rounded-3xl bg-white/80 dark:bg-gray-800/80 p-6 sm:p-8 shadow-xl border border-rose-100/60 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/60 text-xs font-bold text-purple-600 dark:text-purple-300">
                2
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-800 dark:text-gray-100">
                Set Your Intention & Focus
              </h3>
            </div>

            <div className="flex flex-wrap gap-2.5 mb-6">
              {INTENTION_CATEGORIES.map((cat) => {
                const isSelected = selectedIntentionId === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedIntentionId(cat.id)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md scale-105'
                        : 'bg-white dark:bg-gray-700/70 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:border-purple-300'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="space-y-3">
              <label htmlFor="custom-question-input" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Optional: Ask a Specific Question to the Oracle
              </label>
              <input
                id="custom-question-input"
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g. What should I focus on this week? How can I open my heart safely?"
                className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-900/90 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 shadow-inner focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition"
              />
            </div>

            {/* Reversals Option */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/60">
              <div className="flex items-center gap-2">
                <RotateCw className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    Include Reversed Cards (Authentic Shadow & Growth Guidance)
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Reversals highlight internal blockages, shadow healing, and gentle course corrections.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAllowReversals(!allowReversals)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  allowReversals ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    allowReversals ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Launch */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleStartShuffle}
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 px-8 py-4 text-base font-bold text-white shadow-xl hover:scale-105 hover:shadow-purple-500/40 transition duration-300 animate-pulse"
            >
              <Sparkles className="h-5 w-5" />
              Begin Cosmic Reading ({activeSpread.cardCount} Cards)
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: SHUFFLING RITUAL */}
      {stage === 'shuffling' && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-fadeIn">
          <div className="relative h-44 w-32 flex items-center justify-center">
            {/* Animated deck layers */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-900 shadow-xl border-2 border-purple-400/60 transform rotate-6 animate-bounce" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-800 shadow-xl border-2 border-pink-400/60 transform -rotate-6 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 shadow-2xl border-2 border-amber-300 flex flex-col items-center justify-center p-3 text-amber-200">
              <Stars className="h-10 w-10 animate-spin text-amber-300" />
              <span className="mt-2 text-[10px] font-mono uppercase tracking-widest text-amber-200/80">
                Attuning
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-3xl font-bold text-gray-900 dark:text-gray-100">
              Shuffling the Cosmic Deck...
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Take a slow, grounding breath. Focus your mind on your question for {recipient}.
            </p>
          </div>
        </div>
      )}

      {/* STAGE 3: INTERACTIVE CARD PICKING */}
      {stage === 'picking' && (
        <div className="space-y-8 animate-fadeIn text-center">
          <div className="space-y-2">
            <span className="rounded-full bg-purple-100 dark:bg-purple-900/60 px-3.5 py-1 text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-300/40">
              Pick {activeSpread.cardCount - pickedCards.length} more {activeSpread.cardCount - pickedCards.length === 1 ? 'card' : 'cards'}
            </span>
            <h3 className="font-serif text-3xl font-bold text-gray-900 dark:text-gray-100">
              Trust Your Intuition & Choose
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Hover over the fanned deck and tap the cards that call to your energy.
            </p>
          </div>

          {/* Current picked status */}
          <div className="flex justify-center gap-3 flex-wrap">
            {activeSpread.positions.map((pos, idx) => {
              const isFilled = pickedCards[idx]
              return (
                <div
                  key={pos}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold border transition ${
                    isFilled
                      ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 text-purple-800 dark:text-purple-200 shadow-sm'
                      : 'bg-white/50 dark:bg-gray-800/50 border-dashed border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-800 text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span>{pos}</span>
                  {isFilled && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                </div>
              )
            })}
          </div>

          {/* Interactive Card Fan */}
          <div className="relative py-8 flex justify-center items-center overflow-x-auto min-h-[220px]">
            <div className="flex items-center -space-x-10 sm:-space-x-8 px-8">
              {Array.from({ length: 16 }).map((_, idx) => {
                const isSelected = pickedCards.some((p) => p.deckIndex === idx)
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isSelected}
                    onClick={() => handleSelectCardFromFan(idx)}
                    className={`group relative h-40 w-28 sm:h-48 sm:w-32 rounded-2xl shadow-xl transition-all duration-300 transform ${
                      isSelected
                        ? 'opacity-20 scale-90 translate-y-6 pointer-events-none'
                        : 'hover:-translate-y-8 hover:scale-110 hover:z-30 hover:shadow-2xl hover:border-amber-300'
                    } bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 border-2 border-purple-400/50 flex flex-col items-center justify-center text-amber-200/80 p-2 cursor-pointer`}
                    style={{
                      transformOrigin: 'bottom center',
                      transform: `rotate(${(idx - 7.5) * 3.5}deg)`,
                    }}
                  >
                    <div className="absolute inset-1 rounded-xl border border-dashed border-purple-300/30 flex flex-col items-center justify-center">
                      <Sparkle className="h-6 w-6 text-amber-300/70 group-hover:text-amber-200 group-hover:scale-125 transition" />
                      <span className="text-[8px] font-mono mt-2 tracking-widest text-purple-300">
                        ORACLE
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={handleAutoDraw}
              className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-5 py-2.5 text-xs font-bold text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-gray-700 shadow-sm hover:bg-purple-50 dark:hover:bg-gray-700 transition"
            >
              <Zap className="h-4 w-4 text-amber-500" />
              Draw Remaining Cards Automatically
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: READING REVEAL & DEEP INTERPRETATION */}
      {stage === 'reading' && (
        <div className="space-y-10 animate-fadeIn">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white/70 dark:bg-gray-800/70 p-4 shadow-md border border-purple-100 dark:border-gray-700">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Spread: {activeSpread.title}
              </span>
              <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-gray-100">
                {customQuestion ? `"${customQuestion}"` : `Focus: ${activeIntention.label}`}
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {revealedIndices.length < pickedCards.length ? (
                <button
                  type="button"
                  onClick={handleRevealAll}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-xs font-bold text-white shadow hover:opacity-95 transition"
                >
                  <Eye className="h-4 w-4" /> Reveal All Cards
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCopyReading}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-100 dark:bg-gray-700 px-3.5 py-2 text-xs font-bold text-purple-700 dark:text-purple-200 hover:bg-purple-200 transition"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied to Clipboard!' : 'Copy Reading'}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToJournal}
                    disabled={savedToHistory}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold shadow-sm transition ${
                      savedToHistory
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 cursor-default'
                        : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:opacity-95'
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    {savedToHistory ? 'Saved in Journal ✓' : 'Save to Journal'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Cards Spread Display */}
          <div
            className={`grid gap-6 ${
              pickedCards.length === 1
                ? 'grid-cols-1 max-w-md mx-auto'
                : pickedCards.length === 2
                ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {pickedCards.map((item, idx) => {
              const isRevealed = revealedIndices.includes(idx)
              const cardData = item.isReversed ? item.card.reversed : item.card.upright

              return (
                <div key={item.card.id} className="flex flex-col space-y-3">
                  {/* Position Tag */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                      Position {idx + 1}: {item.positionTitle}
                    </span>
                    {isRevealed && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.isReversed
                            ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {item.isReversed ? 'Reversed 🔄' : 'Upright ✨'}
                      </span>
                    )}
                  </div>

                  {/* 3D Flip Card Container */}
                  <div
                    onClick={() => {
                      if (!isRevealed) handleRevealCard(idx)
                      else setActiveCardModal(item)
                    }}
                    className="group relative h-[380px] w-full rounded-3xl cursor-pointer perspective-1000 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Face Down Back */}
                    {!isRevealed ? (
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950 p-6 flex flex-col items-center justify-between text-amber-200 border-2 border-purple-400/40 shadow-2xl">
                        <div className="flex w-full justify-between items-center text-xs text-purple-300/60 font-mono">
                          <span>✦ TAROT</span>
                          <span>SACRED ✦</span>
                        </div>

                        <div className="flex flex-col items-center space-y-3">
                          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-purple-800/40 border border-amber-300/40 group-hover:scale-110 transition duration-300">
                            <Sparkles className="h-10 w-10 text-amber-300 animate-spin" />
                          </div>
                          <span className="font-serif text-lg font-bold text-amber-100">
                            Tap to Reveal
                          </span>
                          <span className="text-[11px] text-purple-300">
                            {item.positionTitle}
                          </span>
                        </div>

                        <div className="flex w-full justify-between items-center text-xs text-purple-300/60 font-mono">
                          <span>✦ ORACLE</span>
                          <span>WISDOM ✦</span>
                        </div>
                      </div>
                    ) : (
                      /* Revealed Face Up Card */
                      <div
                        className={`absolute inset-0 rounded-3xl p-6 flex flex-col justify-between shadow-2xl border-2 transition-all duration-300 ${
                          item.isReversed ? 'border-amber-400/80' : 'border-purple-400/80'
                        } bg-gradient-to-br ${item.card.themeColor} text-gray-900`}
                      >
                        {/* Top info */}
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="rounded-full bg-black/20 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                              {item.card.arcana} • {item.card.element}
                            </span>
                            <h4 className="mt-1 font-serif text-xl font-black text-white drop-shadow-md">
                              {item.card.name}
                            </h4>
                          </div>

                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/25 text-white backdrop-blur-md shadow-sm">
                            {getCardIcon(item.card.symbolName)}
                          </div>
                        </div>

                        {/* Middle Sacred Art & Keywords */}
                        <div className="my-auto py-2 text-center flex flex-col items-center">
                          <div
                            className={`flex h-20 w-20 items-center justify-center rounded-full bg-white/30 backdrop-blur-md shadow-inner text-white mb-3 ${
                              item.isReversed ? 'rotate-180 transition transform' : ''
                            }`}
                          >
                            {getCardIcon(item.card.symbolName)}
                          </div>

                          <div className="flex flex-wrap justify-center gap-1.5">
                            {item.card.keywords.slice(0, 3).map((kw) => (
                              <span
                                key={kw}
                                className="rounded-full bg-white/40 px-2.5 py-0.5 text-[10px] font-bold text-gray-900 backdrop-blur-sm"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Preview Snippet */}
                        <div className="rounded-2xl bg-black/30 p-3 text-white backdrop-blur-md border border-white/20">
                          <p className="text-xs line-clamp-2 leading-relaxed text-rose-50">
                            {cardData.summary}
                          </p>
                          <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-amber-200">
                            <span>Tap for deep wisdom</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary Card below each card when revealed */}
                  {isRevealed && (
                    <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 p-4 shadow border border-purple-100 dark:border-gray-700 text-xs space-y-2">
                      <div className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                        <span>Core Message:</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {cardData.summary}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveCardModal(item)}
                        className="w-full mt-2 rounded-xl bg-purple-50 dark:bg-gray-700 py-1.5 text-center font-bold text-purple-600 dark:text-purple-300 hover:bg-purple-100 transition"
                      >
                        Read Full Advice (Love • Career • Action) →
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Holistic Spread Synthesis (When all cards revealed) */}
          {revealedIndices.length === pickedCards.length && (
            <div className="rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-purple-500/40 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Stars className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                    Sacred Synthesis
                  </span>
                  <h4 className="font-serif text-2xl font-bold">
                    The Unified Message for {recipient}
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-purple-700/40">
                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                    <Compass className="h-4 w-4 text-pink-400" /> Overarching Trajectory
                  </h5>
                  <p className="text-sm text-purple-100/90 leading-relaxed">
                    {pickedCards.length === 1
                      ? `Today calls for aligning with the archetypal energy of ${pickedCards[0].card.name}. Trust your inner compass and take grounded steps forward.`
                      : `Your journey moves from the grounding foundation of ${pickedCards[0].card.name} into the present dynamics of ${pickedCards[1].card.name}, culminating in the powerful outcome of ${pickedCards[pickedCards.length - 1].card.name}. You are in an active phase of realigning your highest truth.`}
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" /> Grounded Next Steps
                  </h5>
                  <ul className="space-y-2 text-sm text-purple-100/90">
                    {pickedCards.map((p) => {
                      const data = p.isReversed ? p.card.reversed : p.card.upright
                      return (
                        <li key={p.card.id} className="flex items-start gap-2">
                          <span className="text-amber-300 mt-1">✦</span>
                          <span>
                            <strong>{p.card.name}:</strong> {data.actionStep}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>

              {/* Final Affirmation Banner */}
              <div className="rounded-2xl bg-white/10 p-4 border border-purple-300/20 text-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                  Shared Oracle Affirmation
                </span>
                <p className="mt-1 font-serif text-lg font-bold text-purple-100">
                  "{pickedCards[pickedCards.length - 1].isReversed
                    ? pickedCards[pickedCards.length - 1].card.reversed.affirmation
                    : pickedCards[pickedCards.length - 1].card.upright.affirmation}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: DEEP CARD EXPLORATION & ADVICE */}
      {activeCardModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveCardModal(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-2xl border border-purple-200 dark:border-gray-700 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-purple-100 dark:bg-purple-900/60 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:text-purple-300">
                    {activeCardModal.positionTitle}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      activeCardModal.isReversed
                        ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {activeCardModal.isReversed ? 'Reversed (Shadow / Internal Flow)' : 'Upright (Direct Flow)'}
                  </span>
                </div>
                <h3 className="mt-2 font-serif text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                  {activeCardModal.card.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveCardModal(null)}
                className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Sub-Tabs for Domains */}
            <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800 pb-3 overflow-x-auto">
              {[
                { id: 'overview', label: '🔮 Core & Archetype' },
                { id: 'love', label: '💖 Love & Dating' },
                { id: 'career', label: '💼 Career & Money' },
                { id: 'growth', label: '🌿 Healing & Action' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabSection(tab.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition ${
                    activeTabSection === tab.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Based on Active Sub-Tab */}
            {(() => {
              const data = activeCardModal.isReversed
                ? activeCardModal.card.reversed
                : activeCardModal.card.upright

              return (
                <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                  {activeTabSection === 'overview' && (
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-purple-50 dark:bg-gray-800/60 p-4 border border-purple-100 dark:border-gray-700">
                        <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-1">
                          Archetypal Essence
                        </h4>
                        <p className="leading-relaxed">{data.summary}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {activeCardModal.card.keywords.map((kw) => (
                          <span
                            key={kw}
                            className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTabSection === 'love' && (
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/30 p-4 border border-rose-200 dark:border-rose-900/40">
                        <h4 className="font-bold text-rose-900 dark:text-rose-300 mb-1 flex items-center gap-2">
                          <Heart className="h-4 w-4 text-rose-500" />
                          Love, Romance & Relationships
                        </h4>
                        <p className="leading-relaxed">{data.loveAdvice}</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        Tip: Whether you are single or in a partnership, this card reflects the current state of your emotional vulnerability and heart boundaries.
                      </p>
                    </div>
                  )}

                  {activeTabSection === 'career' && (
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-900/40">
                        <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-2">
                          <Compass className="h-4 w-4 text-amber-600" />
                          Career, Projects & Financial Flow
                        </h4>
                        <p className="leading-relaxed">{data.careerAdvice}</p>
                      </div>
                    </div>
                  )}

                  {activeTabSection === 'growth' && (
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 p-4 border border-emerald-200 dark:border-emerald-900/40">
                        <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-1 flex items-center gap-2">
                          <Flower2 className="h-4 w-4 text-emerald-600" />
                          Inner Healing & Mindset
                        </h4>
                        <p className="leading-relaxed">{data.innerGrowthAdvice}</p>
                      </div>

                      <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 p-4 border border-indigo-200 dark:border-indigo-900/40">
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-1 flex items-center gap-2">
                          <Check className="h-4 w-4 text-indigo-600" />
                          Actionable Real Suggestion
                        </h4>
                        <p className="leading-relaxed">{data.actionStep}</p>
                      </div>

                      <div className="rounded-2xl bg-purple-100 dark:bg-purple-900/40 p-4 border border-purple-200 dark:border-purple-800 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 dark:text-purple-300">
                          Affirmation
                        </span>
                        <p className="mt-1 font-serif text-base font-bold text-purple-900 dark:text-purple-100">
                          "{data.affirmation}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setActiveCardModal(null)}
                className="rounded-2xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: JOURNAL HISTORY */}
      {showHistoryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowHistoryModal(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-2xl border border-purple-200 dark:border-gray-700 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Tarot Journal & Reading History
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {history.length === 0 ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400 space-y-2">
                <Sparkles className="h-8 w-8 mx-auto text-purple-400/50" />
                <p className="font-serif text-lg">No saved readings yet.</p>
                <p className="text-xs">
                  Complete a tarot spread and tap "Save to Journal" to keep a record of your cosmic guidance.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4 border border-gray-200 dark:border-gray-700 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                            {entry.spreadTitle}
                          </span>
                          <span className="text-xs text-gray-400">• {entry.date}</span>
                        </div>
                        {entry.question && (
                          <p className="text-sm font-serif italic text-gray-800 dark:text-gray-200 mt-0.5">
                            "{entry.question}"
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteHistory(entry.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {entry.cards.map((c, i) => (
                        <div
                          key={i}
                          className="rounded-xl bg-white dark:bg-gray-900 p-2.5 border border-gray-100 dark:border-gray-700 text-xs"
                        >
                          <span className="text-[10px] text-gray-400 block truncate">
                            {c.positionTitle}
                          </span>
                          <span className="font-bold text-gray-800 dark:text-gray-200 block truncate mt-0.5">
                            {c.name} {c.isReversed ? '(Rev)' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
