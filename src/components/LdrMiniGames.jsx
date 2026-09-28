import confetti from 'canvas-confetti'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Eraser,
  Gamepad2,
  RefreshCw,
  Shuffle,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { DOODLE_PROMPTS, WOULD_YOU_RATHER_QUESTIONS } from '../data/ldrGamesData.js'

export default function LdrMiniGames({ recipient = 'My Love', sender = 'Me' }) {
  const [activeGame, setActiveGame] = useState('wyr') // 'wyr' | 'doodle' | 'tictactoe'

  // --- 1. Would You Rather State ---
  const [wyrIndex, setWyrIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [wyrHistory, setWyrHistory] = useState({})
  const [copiedWYR, setCopiedWYR] = useState(false)

  const currentWYR = WOULD_YOU_RATHER_QUESTIONS[wyrIndex]

  const handleSelectWYR = (option) => {
    setSelectedOption(option)
    setWyrHistory((prev) => ({
      ...prev,
      [currentWYR.id]: option,
    }))
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } })
  }

  const handleNextWYR = () => {
    const nextIdx = (wyrIndex + 1) % WOULD_YOU_RATHER_QUESTIONS.length
    setWyrIndex(nextIdx)
    setSelectedOption(wyrHistory[WOULD_YOU_RATHER_QUESTIONS[nextIdx].id] || null)
  }

  const handlePrevWYR = () => {
    const prevIdx = (wyrIndex - 1 + WOULD_YOU_RATHER_QUESTIONS.length) % WOULD_YOU_RATHER_QUESTIONS.length
    setWyrIndex(prevIdx)
    setSelectedOption(wyrHistory[WOULD_YOU_RATHER_QUESTIONS[prevIdx].id] || null)
  }

  const handleCopyWYR = () => {
    const text = `💑 LDR "Would You Rather" Question:\n\nOption A: ${currentWYR.optionA}\nOption B: ${currentWYR.optionB}\n\nMy pick: ${
      selectedOption === 'A' ? currentWYR.optionA : currentWYR.optionB
    } 💕\nWhat would you choose, ${recipient}?`
    navigator.clipboard.writeText(text)
    setCopiedWYR(true)
    setTimeout(() => setCopiedWYR(false), 2000)
  }

  // --- 2. Canvas Love Doodle State ---
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushColor, setBrushColor] = useState('#ff4d6d')
  const [brushSize, setBrushSize] = useState(4)
  const [isEraser, setIsEraser] = useState(false)
  const [doodlePrompt, setDoodlePrompt] = useState(DOODLE_PROMPTS[0])

  useEffect(() => {
    if (activeGame === 'doodle' && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }, [activeGame])

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top

    ctx.strokeStyle = isEraser ? '#ffffff' : brushColor
    ctx.lineWidth = brushSize
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const downloadDoodle = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `love-doodle-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
    confetti({ particleCount: 40, spread: 60 })
  }

  const newPrompt = () => {
    const filtered = DOODLE_PROMPTS.filter((p) => p !== doodlePrompt)
    const random = filtered[Math.floor(Math.random() * filtered.length)]
    setDoodlePrompt(random)
  }

  // --- 3. Tic-Tac-Toe State ---
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [tokenSet, setTokenSet] = useState({ x: '💖', o: '💍' })
  const [scores, setScores] = useState({ p1: 0, p2: 0, ties: 0 })
  const [vsAI, setVsAI] = useState(false)

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    if (squares.every((sq) => sq !== null)) return 'tie'
    return null
  }

  const winner = checkWinner(board)

  const handleSquareClick = (index) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = isXNext ? tokenSet.x : tokenSet.o
    setBoard(newBoard)
    setIsXNext(!isXNext)

    const win = checkWinner(newBoard)
    if (win) {
      if (win === tokenSet.x) {
        setScores((s) => ({ ...s, p1: s.p1 + 1 }))
        confetti({ particleCount: 70, spread: 70 })
      } else if (win === tokenSet.o) {
        setScores((s) => ({ ...s, p2: s.p2 + 1 }))
        confetti({ particleCount: 70, spread: 70 })
      } else {
        setScores((s) => ({ ...s, ties: s.ties + 1 }))
      }
    } else if (vsAI && isXNext) {
      // AI Move
      setTimeout(() => {
        const emptyIndices = newBoard
          .map((val, idx) => (val === null ? idx : null))
          .filter((val) => val !== null)
        if (emptyIndices.length > 0) {
          const aiChoice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
          newBoard[aiChoice] = tokenSet.o
          setBoard(newBoard)
          setIsXNext(true)
          const aiWin = checkWinner(newBoard)
          if (aiWin === tokenSet.o) {
            setScores((s) => ({ ...s, p2: s.p2 + 1 }))
          }
        }
      }, 400)
    }
  }

  const resetBoard = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
  }

  return (
    <div className="rounded-3xl border border-pink-200/70 bg-gradient-to-br from-pink-50/80 via-white/90 to-purple-50/80 p-6 shadow-xl backdrop-blur-md dark:border-gray-700/60 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-purple-950/40">
      {/* Header & Game Switcher Tabs */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white shadow-md shadow-pink-200/50 dark:shadow-none">
            <Gamepad2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-xl font-bold text-gray-800 dark:text-gray-100">
                LDR Mini-Games Studio 🎲✨
              </h3>
              <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-[10px] font-bold text-pink-700 dark:bg-pink-950/60 dark:text-pink-300">
                Play Across Miles
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cozy interactive games to play while on calls or asynchronously.
            </p>
          </div>
        </div>

        {/* Game Switcher Tabs */}
        <div className="flex rounded-2xl bg-gray-100 p-1 dark:bg-gray-800 self-center sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveGame('wyr')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeGame === 'wyr'
                ? 'bg-white text-pink-600 shadow dark:bg-gray-700 dark:text-pink-300'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
            }`}
          >
            🤔 Would You Rather
          </button>
          <button
            type="button"
            onClick={() => setActiveGame('doodle')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeGame === 'doodle'
                ? 'bg-white text-pink-600 shadow dark:bg-gray-700 dark:text-pink-300'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
            }`}
          >
            🎨 Love Doodle
          </button>
          <button
            type="button"
            onClick={() => setActiveGame('tictactoe')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeGame === 'tictactoe'
                ? 'bg-white text-pink-600 shadow dark:bg-gray-700 dark:text-pink-300'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
            }`}
          >
            💖 Love Tic-Tac-Toe
          </button>
        </div>
      </div>

      {/* GAME 1: WOULD YOU RATHER */}
      {activeGame === 'wyr' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Question Category & Counter */}
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              {currentWYR.category} • {currentWYR.tag}
            </span>
            <span className="text-xs text-gray-400">
              Dilemma {wyrIndex + 1} of {WOULD_YOU_RATHER_QUESTIONS.length}
            </span>
          </div>

          {/* Option A vs Option B Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option A */}
            <button
              type="button"
              onClick={() => handleSelectWYR('A')}
              className={`relative overflow-hidden rounded-3xl p-6 text-left transition transform duration-200 border-2 ${
                selectedOption === 'A'
                  ? 'border-pink-500 bg-pink-50/90 shadow-lg scale-[1.02] dark:bg-pink-950/40 dark:border-pink-500'
                  : 'border-white/80 bg-white/90 hover:border-pink-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/90'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 font-bold text-pink-700 dark:bg-pink-900/60 dark:text-pink-200">
                  A
                </span>
                {selectedOption === 'A' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-pink-600 dark:text-pink-400">
                    <Check className="h-4 w-4" /> Your Pick
                  </span>
                )}
              </div>
              <p className="font-serif text-sm font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
                {currentWYR.optionA}
              </p>

              {/* Reveal community/couple percentage */}
              {selectedOption && (
                <div className="mt-4 pt-3 border-t border-pink-200/60 dark:border-gray-700">
                  <div className="flex justify-between text-xs font-bold text-pink-700 dark:text-pink-300 mb-1">
                    <span>Couples Agrees</span>
                    <span>{currentWYR.votesA}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-pink-100 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
                      style={{ width: `${currentWYR.votesA}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </button>

            {/* Option B */}
            <button
              type="button"
              onClick={() => handleSelectWYR('B')}
              className={`relative overflow-hidden rounded-3xl p-6 text-left transition transform duration-200 border-2 ${
                selectedOption === 'B'
                  ? 'border-purple-500 bg-purple-50/90 shadow-lg scale-[1.02] dark:bg-purple-950/40 dark:border-purple-500'
                  : 'border-white/80 bg-white/90 hover:border-purple-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/90'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700 dark:bg-purple-900/60 dark:text-purple-200">
                  B
                </span>
                {selectedOption === 'B' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400">
                    <Check className="h-4 w-4" /> Your Pick
                  </span>
                )}
              </div>
              <p className="font-serif text-sm font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
                {currentWYR.optionB}
              </p>

              {/* Reveal community/couple percentage */}
              {selectedOption && (
                <div className="mt-4 pt-3 border-t border-purple-200/60 dark:border-gray-700">
                  <div className="flex justify-between text-xs font-bold text-purple-700 dark:text-purple-300 mb-1">
                    <span>Couples Agrees</span>
                    <span>{currentWYR.votesB}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-purple-100 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${currentWYR.votesB}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Navigation & Share */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrevWYR}
              className="flex items-center gap-1 rounded-2xl bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>

            {selectedOption && (
              <button
                type="button"
                onClick={handleCopyWYR}
                className="flex items-center gap-1.5 rounded-2xl bg-rose-100 px-4 py-2 text-xs font-bold text-rose-700 shadow-sm transition hover:bg-rose-200 dark:bg-rose-950/60 dark:text-rose-300"
              >
                {copiedWYR ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedWYR ? 'Copied to Clipboard!' : 'Share Pick with Partner'}
              </button>
            )}

            <button
              type="button"
              onClick={handleNextWYR}
              className="flex items-center gap-1 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:scale-105"
            >
              Next Dilemma <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* GAME 2: LOVE DOODLE CANVAS */}
      {activeGame === 'doodle' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Prompt banner */}
          <div className="flex items-center justify-between rounded-2xl bg-pink-100/80 p-3.5 dark:bg-pink-950/50">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 dark:text-pink-300">
                Secret Drawing Prompt:
              </span>
              <p className="font-serif text-base font-bold text-gray-900 dark:text-gray-100">
                ✨ "{doodlePrompt}"
              </p>
            </div>
            <button
              type="button"
              onClick={newPrompt}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-pink-700 shadow-sm hover:bg-pink-50 dark:bg-gray-800 dark:text-pink-300"
            >
              <Shuffle className="h-3.5 w-3.5" /> New Prompt
            </button>
          </div>

          {/* Canvas Box */}
          <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-200 dark:bg-gray-100 dark:border-gray-300">
            <canvas
              ref={canvasRef}
              width={540}
              height={320}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-80 touch-none cursor-crosshair"
            />
          </div>

          {/* Drawing Tools Palette */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/80 p-3 shadow-sm dark:bg-gray-800/80">
            {/* Color Palette */}
            <div className="flex items-center gap-1.5">
              {['#ff4d6d', '#8338ec', '#3a86ff', '#38b000', '#fb5607', '#000000'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setBrushColor(color)
                    setIsEraser(false)
                  }}
                  className={`h-7 w-7 rounded-full shadow-sm transition hover:scale-110 ${
                    brushColor === color && !isEraser ? 'ring-2 ring-offset-2 ring-gray-600 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <button
                type="button"
                onClick={() => setIsEraser(!isEraser)}
                className={`flex h-7 items-center gap-1 rounded-full px-2.5 text-xs font-bold transition ${
                  isEraser
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                <Eraser className="h-3.5 w-3.5" /> Eraser
              </button>
            </div>

            {/* Brush Size Slider */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
              <span>Size:</span>
              <input
                type="range"
                min="2"
                max="16"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20 accent-pink-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearCanvas}
                className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={downloadDoodle}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:scale-105"
              >
                <Download className="h-3.5 w-3.5" /> Save Drawing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME 3: TIC-TAC-TOE */}
      {activeGame === 'tictactoe' && (
        <div className="space-y-4 animate-fadeIn max-w-md mx-auto text-center">
          {/* Score & Mode Controls */}
          <div className="flex items-center justify-between rounded-2xl bg-white/90 p-3 shadow-sm dark:bg-gray-800/90">
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-pink-600 dark:text-pink-400">
                {sender} ({tokenSet.x})
              </p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{scores.p1} Wins</p>
            </div>
            <button
              type="button"
              onClick={() => setVsAI(!vsAI)}
              className="rounded-full bg-pink-50 px-3 py-1 text-[11px] font-bold text-pink-700 dark:bg-gray-700 dark:text-pink-300"
            >
              Mode: {vsAI ? '🤖 vs AI Partner' : '👥 Pass & Play'}
            </button>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">
                {recipient} ({tokenSet.o})
              </p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{scores.p2} Wins</p>
            </div>
          </div>

          {/* Status Message */}
          <div className="py-1">
            {winner ? (
              <p className="text-base font-bold text-pink-600 dark:text-pink-400 animate-bounce">
                {winner === 'tie' ? "It's a cozy tie! 🫂" : `🎉 Winner: ${winner === tokenSet.x ? sender : recipient}!`}
              </p>
            ) : (
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                Turn: {isXNext ? `${sender} (${tokenSet.x})` : `${recipient} (${tokenSet.o})`}
              </p>
            )}
          </div>

          {/* 3x3 Game Grid */}
          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
            {board.map((square, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSquareClick(idx)}
                className="aspect-square rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl border border-pink-100 hover:bg-pink-50 transition transform active:scale-90 dark:bg-gray-800 dark:border-gray-700"
              >
                {square}
              </button>
            ))}
          </div>

          {/* Token Selector & Reset */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-1">
              {[
                { x: '💖', o: '💍' },
                { x: '🌸', o: '🌙' },
                { x: '🐱', o: '🐶' },
              ].map((pair, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTokenSet(pair)}
                  className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                    tokenSet.x === pair.x ? 'bg-pink-500 text-white shadow' : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  {pair.x} vs {pair.o}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={resetBoard}
              className="flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Restart Round
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
