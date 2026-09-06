import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Copy, Gift, Heart, Send, Sparkles, User, X } from 'lucide-react'
import { useState } from 'react'
import { PERSONALIZE_KEY, getShareableLink, updateUrlWithPersonalization } from '../lettersData.js'

export default function CreateGiftWizardModal({ isOpen, onClose, initialRecipient, initialSender, onComplete }) {
  const [step, setStep] = useState(1)
  const [recInput, setRecInput] = useState(initialRecipient === 'My Love' ? '' : initialRecipient || '')
  const [sendInput, setSendInput] = useState(initialSender === 'Me' ? '' : initialSender || '')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleStep1Next = (e) => {
    e.preventDefault()
    if (!recInput.trim() || !sendInput.trim()) {
      alert('Please fill in both names!')
      return
    }
    const updated = {
      recipient: recInput.trim(),
      sender: sendInput.trim(),
    }
    localStorage.setItem(PERSONALIZE_KEY, JSON.stringify(updated))
    updateUrlWithPersonalization(updated.recipient, updated.sender)
    onComplete(updated)
    setStep(2)
  }

  const generatedLink = getShareableLink(recInput.trim() || 'My Love', sendInput.trim() || 'Me')

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      alert('Your Link: ' + generatedLink)
    }
  }

  const shareToWhatsapp = () => {
    const message = `Hey ${recInput.trim()}! 💖 I created a special "Open When" romantic gift box for you! Open it here: ${generatedLink}`
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5c4a55]/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close wizard" />
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative z-10 w-full max-w-lg rounded-3xl bg-[#fffaf6] dark:bg-gray-800 p-6 shadow-2xl border border-rose-100 dark:border-gray-700"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-rose-100 dark:border-gray-700 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-rose-500 animate-bounce" />
              <h2 className="font-serif text-xl font-bold text-[#5c4a55] dark:text-gray-100">
                Gift Package Wizard
              </h2>
            </div>
            <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-rose-50 dark:hover:bg-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className={`h-2.5 rounded-full transition-all ${step >= 1 ? 'w-8 bg-rose-500' : 'w-2.5 bg-gray-200 dark:bg-gray-700'}`} />
            <span className={`h-2.5 rounded-full transition-all ${step >= 2 ? 'w-8 bg-rose-500' : 'w-2.5 bg-gray-200 dark:bg-gray-700'}`} />
            <span className={`h-2.5 rounded-full transition-all ${step >= 3 ? 'w-8 bg-rose-500' : 'w-2.5 bg-gray-200 dark:bg-gray-700'}`} />
          </div>

          {/* STEP 1: SET NAMES */}
          {step === 1 && (
            <form onSubmit={handleStep1Next} className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#5c4a55] dark:text-gray-100">
                  Step 1: Who is this Gift Box for?
                </h3>
                <p className="text-xs text-[#7a6570] dark:text-gray-300">
                  Type your partner's name and your name to personalize the entire app!
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a6570] dark:text-gray-300 mb-1">
                  Recipient Name (Who receives this gift?)
                </label>
                <div className="relative">
                  <Heart className="absolute left-3 top-3 h-4 w-4 text-rose-400" />
                  <input
                    type="text"
                    required
                    value={recInput}
                    onChange={(e) => setRecInput(e.target.value)}
                    placeholder="e.g. Dipesh, Priya, Alex"
                    className="w-full rounded-xl border border-rose-200 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 pr-4 py-2.5 text-sm text-[#5c4a55] dark:text-gray-100 focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a6570] dark:text-gray-300 mb-1">
                  Your Name (Sender)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-rose-400" />
                  <input
                    type="text"
                    required
                    value={sendInput}
                    onChange={(e) => setSendInput(e.target.value)}
                    placeholder="e.g. Sandhya, Rahul, Sam"
                    className="w-full rounded-xl border border-rose-200 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 pr-4 py-2.5 text-sm text-[#5c4a55] dark:text-gray-100 focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 py-3.5 text-sm font-bold text-white shadow-md hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                Next: Customize Gift Box <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* STEP 2: PREVIEW & CUSTOMIZE */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#5c4a55] dark:text-gray-100">
                  Step 2: Custom Gift Box Ready! ✨
                </h3>
                <p className="text-xs text-[#7a6570] dark:text-gray-300">
                  The app is now personalized for <strong className="text-rose-500">{recInput}</strong> from <strong className="text-rose-500">{sendInput}</strong>!
                </p>
              </div>

              <div className="rounded-2xl bg-rose-50/70 dark:bg-gray-700/60 p-4 space-y-2 border border-rose-100 dark:border-gray-600 text-xs">
                <p className="font-bold text-[#5c4a55] dark:text-gray-200">What {recInput} will see:</p>
                <ul className="list-disc list-inside text-[#7a6570] dark:text-gray-300 space-y-1">
                  <li>Header: <em>"A little box of letters for {recInput}"</em></li>
                  <li>Letters: <em>Addressing {recInput} throughout all envelopes</em></li>
                  <li>Signatures: <em>"With love, {sendInput} ♥"</em></li>
                  <li>Quiz: <em>"How well do you know {recInput}?"</em></li>
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-2xl bg-gray-100 dark:bg-gray-700 py-3 text-xs font-semibold text-gray-600 dark:text-gray-200 hover:bg-gray-200"
                >
                  <ArrowLeft className="h-4 w-4 inline mr-1" /> Edit Names
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 py-3 text-xs font-bold text-white shadow hover:opacity-95 flex items-center justify-center gap-1"
                >
                  Get Share Link <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SHARE LINK & WHATSAPP */}
          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-500">
                <Sparkles className="h-8 w-8 animate-spin" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-[#5c4a55] dark:text-gray-100">
                  Send Your Gift Box to {recInput}! 💌
                </h3>
                <p className="mt-1 text-xs text-[#7a6570] dark:text-gray-300">
                  Send this link directly to {recInput}. When opened on their phone, the entire app will greet them by name!
                </p>
              </div>

              <div className="rounded-2xl bg-white dark:bg-gray-700 p-4 border border-rose-200 dark:border-gray-600 shadow-sm space-y-3">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="w-full truncate rounded-xl bg-rose-50/60 dark:bg-gray-800 p-3 text-xs font-mono text-[#5c4a55] dark:text-gray-200 border border-rose-100 dark:border-gray-600 text-center"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={shareToWhatsapp}
                    className="w-full rounded-xl bg-emerald-500 py-3 text-xs font-bold text-white shadow hover:bg-emerald-600 transition flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Share on WhatsApp 💚
                  </button>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="w-full rounded-xl bg-rose-500 py-3 text-xs font-bold text-white shadow hover:bg-rose-600 transition flex items-center justify-center gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Link Copied!' : 'Copy Link 📋'}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-xs text-rose-400 font-semibold underline hover:text-rose-500"
              >
                Close & View App
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
