import { AnimatePresence, motion } from 'framer-motion'
import { KeyRound, Lock, X } from 'lucide-react'
import { useState } from 'react'

export default function PinModal({ isOpen, onClose, letter, onSuccess }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  if (!isOpen || !letter) return null

  const handleDigit = (digit) => {
    if (pin.length >= 4) return
    const nextPin = pin + digit
    setPin(nextPin)
    setError(false)

    if (nextPin.length === 4) {
      if (nextPin === letter.pinCode) {
        onSuccess(letter)
        setPin('')
      } else {
        setError(true)
        setTimeout(() => setPin(''), 600)
      }
    }
  }

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1))
    setError(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5c4a55]/50 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close modal" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-full max-w-sm rounded-3xl bg-[#fffaf6] dark:bg-gray-800 p-6 shadow-2xl border border-rose-100 dark:border-gray-700 text-center space-y-5"
        >
          <div className="flex items-center justify-between border-b border-rose-100 dark:border-gray-700 pb-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-rose-500 uppercase tracking-widest">
              <Lock className="h-4 w-4" /> Confidential Letter
            </span>
            <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-rose-50 dark:hover:bg-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-500">
            <KeyRound className="h-8 w-8" />
          </div>

          <div>
            <h3 className="font-serif text-xl font-bold text-[#5c4a55] dark:text-gray-100">
              Enter Secret 4-Digit PIN
            </h3>
            <p className="mt-1 text-xs text-[#7a6570] dark:text-gray-300">
              This letter is protected. Ask your partner for the 4-digit code!
            </p>
          </div>

          {/* PIN Indicators */}
          <div className={`flex justify-center gap-3 py-2 ${error ? 'animate-bounce' : ''}`}>
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`h-4 w-4 rounded-full border-2 transition-all ${
                  pin.length > idx
                    ? 'bg-rose-500 border-rose-500 scale-110'
                    : 'border-rose-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-500">
              Incorrect PIN! Try again.
            </p>
          )}

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleDigit(String(num))}
                className="flex h-12 w-12 items-center justify-center mx-auto rounded-full bg-white dark:bg-gray-700 text-lg font-bold text-[#5c4a55] dark:text-gray-100 border border-rose-100 dark:border-gray-600 shadow-sm hover:bg-rose-50 dark:hover:bg-gray-600 transition"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBackspace}
              className="col-span-1 flex h-12 w-12 items-center justify-center mx-auto rounded-full bg-gray-100 dark:bg-gray-600 text-xs font-semibold text-gray-500 dark:text-gray-200"
            >
              ⌫
            </button>
            <button
              type="button"
              onClick={() => handleDigit('0')}
              className="flex h-12 w-12 items-center justify-center mx-auto rounded-full bg-white dark:bg-gray-700 text-lg font-bold text-[#5c4a55] dark:text-gray-100 border border-rose-100 dark:border-gray-600 shadow-sm hover:bg-rose-50 dark:hover:bg-gray-600 transition"
            >
              0
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
