import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Edit3, HelpCircle, Lock, RefreshCw, Sparkles, Trophy, XCircle } from 'lucide-react'
import { useState } from 'react'
import { QUIZ_ANSWERS_KEY, defaultQuizQuestions, interpolateText } from '../lettersData.js'

export default function CoupleQuiz({ recipient, sender }) {
  const [questions, setQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem(QUIZ_ANSWERS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return defaultQuizQuestions.map((q) => {
          if (parsed[q.id] !== undefined) {
            return { ...q, correctIndex: parsed[q.id] }
          }
          return q
        })
      }
    } catch {}
    return defaultQuizQuestions
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [userGuesses, setUserGuesses] = useState({}) // { [qId]: selectedIndex }
  const [isRevealed, setIsRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const currentQ = questions[currentIndex]

  const handleSelectGuess = (index) => {
    if (isRevealed) return
    setUserGuesses((prev) => ({ ...prev, [currentQ.id]: index }))
  }

  const handleLockInGuess = () => {
    const selected = userGuesses[currentQ.id]
    if (selected === undefined) return
    setIsRevealed(true)
    const isCorrect = selected === currentQ.correctIndex
    if (isCorrect) {
      setScore((s) => s + 1)
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#F8C8DC', '#E4D4F4', '#F3AFC8', '#FFD1DC'],
      })
    }
  }

  const handleNextQuestion = () => {
    setIsRevealed(false)
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1)
    } else {
      setQuizFinished(true)
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      })
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setUserGuesses({})
    setIsRevealed(false)
    setScore(0)
    setQuizFinished(false)
  }

  const handleSaveAnswers = (newCorrectMap) => {
    localStorage.setItem(QUIZ_ANSWERS_KEY, JSON.stringify(newCorrectMap))
    setQuestions((prev) =>
      prev.map((q) => ({
        ...q,
        correctIndex: newCorrectMap[q.id] !== undefined ? newCorrectMap[q.id] : q.correctIndex,
      }))
    )
    setIsEditModalOpen(false)
  }

  const getEvaluation = () => {
    const total = questions.length
    const pct = (score / total) * 100
    if (pct === 100) return { title: "Soulmates Bound By Destiny! 💍", desc: `Incredible! You know ${recipient} like the back of your hand!` }
    if (pct >= 70) return { title: "Deeply in Sync & Connected! 💞", desc: "Amazing score! You two share a super special bond." }
    if (pct >= 50) return { title: "Cute Lovebirds! 🐣", desc: `You know a lot about ${recipient}, with a few fun surprises left to discover!` }
    return { title: "Learning Each Other's Heart! 🌸", desc: "A sweet effort! Time for a romantic date night to catch up on each other's secrets." }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Quiz Top Header Bar */}
      <div className="mb-6 flex items-center justify-between rounded-2xl bg-white/80 p-4 shadow-sm border border-rose-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-500">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-[#5c4a55]">
              How Well Do You Know {recipient}?
            </h2>
            <p className="text-xs text-[#7a6570]">
              Guess first before the true answer is revealed!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-100 border border-rose-200"
        >
          <Edit3 className="h-3.5 w-3.5" /> Setup True Answers
        </button>
      </div>

      {!quizFinished ? (
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="rounded-3xl bg-[#fffaf6] p-6 shadow-xl border border-rose-100/80 space-y-6"
        >
          {/* Progress Pill */}
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-500 uppercase tracking-wider">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-xs font-semibold text-[#7a6570]">
              Score: <strong className="text-rose-500 font-bold">{score}</strong> / {questions.length}
            </span>
          </div>

          {/* Question Text */}
          <h3 className="font-serif text-2xl font-semibold leading-snug text-[#5c4a55]">
            {interpolateText(currentQ.question, recipient, sender)}
          </h3>

          <p className="text-xs text-[#7a6570] flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-rose-400 shrink-0" />
            Pick your guess first! Once locked in, {recipient}'s true answer will be revealed.
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {currentQ.options.map((opt, idx) => {
              const text = interpolateText(opt, recipient, sender)
              const isSelected = userGuesses[currentQ.id] === idx
              const isCorrectAnswer = idx === currentQ.correctIndex

              let btnStyle = 'bg-white border-rose-100 text-[#5c4a55] hover:border-rose-300'
              if (isSelected && !isRevealed) {
                btnStyle = 'bg-rose-50 border-rose-400 text-rose-600 ring-2 ring-rose-200'
              } else if (isRevealed) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-700 font-semibold shadow-sm'
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'bg-rose-50/80 border-rose-300 text-rose-700 line-through opacity-80'
                } else {
                  btnStyle = 'bg-white/60 border-gray-100 text-gray-400 opacity-60'
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectGuess(idx)}
                  disabled={isRevealed}
                  className={`flex items-center justify-between rounded-2xl border p-4 text-left text-sm font-medium transition-all ${btnStyle}`}
                >
                  <span>{text}</span>
                  {isRevealed && isCorrectAnswer && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 ml-2" />
                  )}
                  {isRevealed && isSelected && !isCorrectAnswer && (
                    <XCircle className="h-5 w-5 text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Reveal & Lock In Action */}
          <div className="pt-2">
            {!isRevealed ? (
              <button
                type="button"
                onClick={handleLockInGuess}
                disabled={userGuesses[currentQ.id] === undefined}
                className="w-full rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 py-3.5 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                <Lock className="h-4 w-4" /> Lock In My Guess & Reveal Answer
              </button>
            ) : (
              <div className="space-y-3">
                <div className={`rounded-2xl p-4 text-center ${userGuesses[currentQ.id] === currentQ.correctIndex ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                  <p className="font-serif text-lg font-semibold">
                    {userGuesses[currentQ.id] === currentQ.correctIndex ? '🎉 Spot on! You guessed correctly!' : `Aww! ${recipient}'s real answer is:`}
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    {interpolateText(currentQ.options[currentQ.correctIndex], recipient, sender)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full rounded-2xl bg-[#5c4a55] py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#4a3b45] transition"
                >
                  {currentIndex + 1 < questions.length ? 'Next Question →' : 'See Final Compatibility Score 🏆'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        /* Final Score Card */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl bg-[#fffaf6] p-8 text-center shadow-2xl border border-rose-100 space-y-6"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-500 shadow-inner">
            <Trophy className="h-10 w-10 animate-bounce" />
          </div>

          <div>
            <span className="rounded-full bg-rose-100 px-4 py-1 text-xs font-bold text-rose-500 uppercase tracking-widest">
              Quiz Completed!
            </span>
            <h3 className="mt-3 font-serif text-3xl font-bold text-[#5c4a55]">
              {getEvaluation().title}
            </h3>
            <p className="mt-2 text-sm text-[#7a6570]">
              {getEvaluation().desc}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-rose-100 max-w-sm mx-auto">
            <p className="text-xs uppercase tracking-wider text-[#7a6570] font-semibold">Your Final Score</p>
            <p className="mt-1 font-serif text-5xl font-extrabold text-rose-500">
              {score} <span className="text-2xl text-gray-400 font-normal">/ {questions.length}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row justify-center pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:opacity-95 transition"
            >
              <RefreshCw className="h-4 w-4" /> Retake Quiz
            </button>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-[#5c4a55] border border-rose-200 shadow-sm hover:bg-rose-50 transition"
            >
              <Edit3 className="h-4 w-4 text-rose-400" /> Customize True Answers
            </button>
          </div>
        </motion.div>
      )}

      {/* Answer Setup Modal */}
      {isEditModalOpen && (
        <QuizSetupModal
          questions={questions}
          recipient={recipient}
          sender={sender}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveAnswers}
        />
      )}
    </div>
  )
}

function QuizSetupModal({ questions, recipient, sender, onClose, onSave }) {
  const [answersMap, setAnswersMap] = useState(() => {
    const map = {}
    questions.forEach((q) => {
      map[q.id] = q.correctIndex
    })
    return map
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(answersMap)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5c4a55]/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close" />
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#fffaf6] p-6 shadow-2xl border border-rose-100"
        >
          <div className="flex items-center justify-between border-b border-rose-100 pb-3 mb-4">
            <h3 className="font-serif text-xl font-semibold text-[#5c4a55] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-400" /> Set {recipient}'s Real Answers
            </h3>
            <button onClick={onClose} className="rounded-full p-1 text-[#7a6570] hover:bg-rose-50">
              <XCircle className="h-5 w-5" />
            </button>
          </div>

          <p className="text-xs text-[#7a6570] mb-4">
            Select the true answer for each question so when {recipient} or you play, the score accurately reflects reality!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="rounded-2xl border border-rose-100 bg-white p-4 space-y-2">
                <p className="text-xs font-semibold text-[#5c4a55]">
                  {idx + 1}. {interpolateText(q.question, recipient, sender)}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => setAnswersMap((prev) => ({ ...prev, [q.id]: optIdx }))}
                      className={`text-left px-3 py-2 text-xs rounded-xl border transition ${
                        answersMap[q.id] === optIdx
                          ? 'bg-rose-100 border-rose-400 font-bold text-rose-700'
                          : 'bg-rose-50/40 border-gray-100 text-gray-600 hover:bg-rose-50'
                      }`}
                    >
                      {interpolateText(opt, recipient, sender)}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 py-3.5 text-sm font-semibold text-white shadow-md hover:opacity-95 transition"
            >
              Save True Answers
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
