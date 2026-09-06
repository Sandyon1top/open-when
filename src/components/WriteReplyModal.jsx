import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Heart, Link, Music, Send, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { encodeShareData, getShareableLink } from '../lettersData.js'

function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

const THEME_OPTIONS = [
  { name: 'Rose Romance', themeColor: '#F8C8DC', flapColor: '#F3AFC8', bodyColor: '#FDECF3', waxColor: '#C9A27C', accentClass: 'from-rose-100 via-pink-50 to-cream' },
  { name: 'Sweet Lavender', themeColor: '#E4D4F4', flapColor: '#D4BEEA', bodyColor: '#F4ECFB', waxColor: '#C9A27C', accentClass: 'from-violet-100 via-cream to-fuchsia-50' },
  { name: 'Warm Sunset', themeColor: '#E8B4B8', flapColor: '#E09AA3', bodyColor: '#FBE9EB', waxColor: '#C9A27C', accentClass: 'from-rose-200 via-cream to-pink-100' },
  { name: 'Mint Meadow', themeColor: '#CFE8D8', flapColor: '#B7DCC8', bodyColor: '#EAF6EF', waxColor: '#C9A27C', accentClass: 'from-emerald-50 via-cream to-teal-50' },
]

export default function WriteReplyModal({ isOpen, onClose, recipient, sender }) {
  const [title, setTitle] = useState("Open when you need my love")
  const [message, setMessage] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [songTitle, setSongTitle] = useState('')
  const [selectedTheme, setSelectedTheme] = useState(THEME_OPTIONS[0])
  const [copiedLink, setCopiedLink] = useState('')

  if (!isOpen) return null

  const handleGenerateLink = (e) => {
    e.preventDefault()
    if (!message.trim()) {
      alert('Please write a message for your letter!')
      return
    }

    const letterPayload = {
      id: 'reply-' + Date.now(),
      title: title.trim() || 'Open when you read this',
      message: message.trim(),
      youtubeUrl: youtubeUrl.trim(),
      songTitle: songTitle.trim() || 'Special Dedicated Song',
      themeColor: selectedTheme.themeColor,
      flapColor: selectedTheme.flapColor,
      bodyColor: selectedTheme.bodyColor,
      waxColor: selectedTheme.waxColor,
      accentClass: selectedTheme.accentClass,
      sender: sender,
      recipient: recipient,
      createdAt: new Date().toLocaleDateString(),
    }

    const encoded = encodeShareData(letterPayload)
    // Send to partner: so recipient becomes partner's name, sender becomes your name
    const shareableUrl = getShareableLink(recipient, sender, { replyLetter: encoded })
    setCopiedLink(shareableUrl)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(copiedLink)
      alert('Letter Link Copied! Send this link to ' + recipient + ' so they can open your letter!')
    } catch {
      alert('Your Letter Link: ' + copiedLink)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5c4a55]/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close modal" />
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative z-10 w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-3xl bg-[#fffaf6] p-6 shadow-2xl border border-rose-100"
        >
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-rose-400" />
              <h2 className="font-serif text-2xl font-semibold text-[#5c4a55]">
                Write a Letter to {recipient}
              </h2>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-[#7a6570] hover:bg-rose-50 transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          {!copiedLink ? (
            <form onSubmit={handleGenerateLink} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a6570] mb-1">
                  Envelope Title (e.g. Open when...)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Open when you miss my voice..."
                  className="w-full rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm text-[#5c4a55] focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a6570] mb-1">
                  Your Personal Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your heart out here... Tell them how much they mean to you."
                  className="w-full rounded-xl border border-rose-200 bg-white p-3 text-sm text-[#5c4a55] focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a6570] mb-1 flex items-center justify-between">
                  <span>Dedicate a YouTube Song (Optional)</span>
                  <YoutubeIcon className="h-3.5 w-3.5 text-red-500" />
                </label>
                <input
                  type="text"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="Song Name (e.g. Lover - Taylor Swift)"
                  className="w-full rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs text-[#5c4a55] focus:border-rose-400 focus:outline-none mb-2"
                />
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Paste YouTube Link (https://www.youtube.com/watch?v=...)"
                  className="w-full rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-mono text-[#5c4a55] focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a6570] mb-2">
                  Choose Envelope Color Palette
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {THEME_OPTIONS.map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedTheme(t)}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition ${
                        selectedTheme.name === t.name
                          ? 'border-rose-400 bg-rose-50 text-rose-600 ring-2 ring-rose-200'
                          : 'border-rose-100 bg-white text-[#5c4a55] hover:border-rose-200'
                      }`}
                    >
                      <span className="h-4 w-4 rounded-full border border-white shadow-sm" style={{ background: t.themeColor }} />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 py-3.5 text-sm font-semibold text-white shadow-md hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" /> Create & Generate Letter Link
                </button>
              </div>
            </form>
          ) : (
            /* Created Link Box */
            <div className="mt-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500 shadow-inner">
                <Heart className="h-8 w-8 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#5c4a55]">
                  Your Letter for {recipient} is Ready! 💌
                </h3>
                <p className="mt-1 text-xs text-[#7a6570]">
                  Copy the link below and send it to {recipient}. When they open it, your sealed envelope will appear right at the top of their app!
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 border border-rose-200 shadow-sm space-y-3">
                <input
                  type="text"
                  readOnly
                  value={copiedLink}
                  className="w-full truncate rounded-xl bg-rose-50/60 p-3 text-xs font-mono text-[#5c4a55] border border-rose-100 text-center"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="w-full rounded-xl bg-rose-500 py-3 text-xs font-bold text-white shadow hover:bg-rose-600 transition flex items-center justify-center gap-2"
                >
                  <Copy className="h-4 w-4" /> Copy Letter Link to Send
                </button>
              </div>

              <button
                type="button"
                onClick={() => setCopiedLink('')}
                className="text-xs text-rose-400 font-semibold underline hover:text-rose-500"
              >
                ← Write Another Letter
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
