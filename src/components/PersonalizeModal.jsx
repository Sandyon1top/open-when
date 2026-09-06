import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Heart, Link, Music, Sparkles, User, X } from 'lucide-react'
import { useState } from 'react'
import { PERSONALIZE_KEY, getShareableLink, updateUrlWithPersonalization } from '../lettersData.js'

function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

export default function PersonalizeModal({ isOpen, onClose, recipient, sender, onSave, letters, onUpdateLetters }) {
  const [recInput, setRecInput] = useState(recipient)
  const [sendInput, setSendInput] = useState(sender)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('names') // 'names' | 'youtube'
  const [youtubeLinks, setYoutubeLinks] = useState(() => {
    const map = {}
    letters.forEach((l) => {
      map[l.id] = { title: l.songTitle || '', url: l.youtubeUrl || '' }
    })
    return map
  })

  if (!isOpen) return null

  const handleSaveNames = (e) => {
    e.preventDefault()
    const r = recInput.trim() || 'My Love'
    const s = sendInput.trim() || 'Me'
    const updated = { recipient: r, sender: s }
    localStorage.setItem(PERSONALIZE_KEY, JSON.stringify(updated))
    updateUrlWithPersonalization(r, s)
    onSave(updated)
  }

  const handleCopyLink = async () => {
    const r = recInput.trim() || 'My Love'
    const s = sendInput.trim() || 'Me'
    const shareableUrl = getShareableLink(r, s)
    try {
      await navigator.clipboard.writeText(shareableUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      alert('Your personalized link: ' + shareableUrl)
    }
  }

  const handleYoutubeChange = (id, field, value) => {
    setYoutubeLinks((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }))
  }

  const handleSaveYoutube = () => {
    const updatedLetters = letters.map((l) => {
      const custom = youtubeLinks[l.id]
      if (custom) {
        return {
          ...l,
          songTitle: custom.title || l.songTitle,
          youtubeUrl: custom.url || l.youtubeUrl,
        }
      }
      return l
    })
    onUpdateLetters(updatedLetters)
    alert('YouTube songs updated successfully!')
  }

  const currentShareLink = getShareableLink(recInput.trim() || 'My Love', sendInput.trim() || 'Me')

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
          className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-[#fffaf6] p-6 shadow-2xl border border-rose-100"
        >
          <div className="flex items-center justify-between border-b border-rose-100 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-400" />
              <h2 className="font-serif text-2xl font-semibold text-[#5c4a55]">Personalize Your Gift</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-[#7a6570] hover:bg-rose-50 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex rounded-xl bg-rose-50/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('names')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
                activeTab === 'names' ? 'bg-white text-rose-500 shadow-sm' : 'text-[#7a6570] hover:text-[#5c4a55]'
              }`}
            >
              <User className="h-4 w-4" /> Recipient & Share Link
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('youtube')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
                activeTab === 'youtube' ? 'bg-white text-rose-500 shadow-sm' : 'text-[#7a6570] hover:text-[#5c4a55]'
              }`}
            >
              <YoutubeIcon className="h-4 w-4 text-red-500" /> YouTube Songs
            </button>
          </div>

          {activeTab === 'names' && (
            <form onSubmit={handleSaveNames} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a6570] mb-1">
                  Recipient Name (Who is this for?)
                </label>
                <div className="relative">
                  <Heart className="absolute left-3 top-3 h-4 w-4 text-rose-300" />
                  <input
                    type="text"
                    value={recInput}
                    onChange={(e) => setRecInput(e.target.value)}
                    placeholder="e.g. Sandhya, Dipesh, My Love"
                    className="w-full rounded-xl border border-rose-200 bg-white pl-10 pr-4 py-2.5 text-sm text-[#5c4a55] focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a6570] mb-1">
                  Your Name (Sender)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-rose-300" />
                  <input
                    type="text"
                    value={sendInput}
                    onChange={(e) => setSendInput(e.target.value)}
                    placeholder="e.g. Sandip, Secret Admirer"
                    className="w-full rounded-xl border border-rose-200 bg-white pl-10 pr-4 py-2.5 text-sm text-[#5c4a55] focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 transition"
                >
                  Save Local Preferences
                </button>
              </div>

              {/* Prominent Copy Personalized Link Box */}
              <div className="mt-5 rounded-2xl bg-white p-4 border border-rose-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#5c4a55]">
                    <Link className="h-4 w-4 text-rose-400" /> Copy Personalized Share Link
                  </span>
                  {copied && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <Check className="h-3.5 w-3.5" /> Link Copied!
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#7a6570]">
                  Send this link to <strong>{recInput || 'them'}</strong>. When opened on their phone or browser, it will automatically greet them by name!
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    readOnly
                    value={currentShareLink}
                    className="flex-1 truncate rounded-xl bg-rose-50/60 px-3 py-2 text-xs font-mono text-[#5c4a55] border border-rose-100"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white hover:bg-rose-600 transition shrink-0 shadow-sm"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy Link
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'youtube' && (
            <div className="mt-5 space-y-4">
              <p className="text-xs text-[#7a6570]">
                Paste any YouTube song link for each envelope. The exact song will play directly inside the letter modal!
              </p>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {letters.map((letter) => {
                  const info = youtubeLinks[letter.id] || { title: '', url: '' }
                  return (
                    <div key={letter.id} className="rounded-xl border border-rose-100 bg-white p-3 space-y-2">
                      <p className="text-xs font-semibold text-[#5c4a55]">
                        {letter.title}
                      </p>
                      <input
                        type="text"
                        placeholder="Song Name (e.g. Perfect - Ed Sheeran)"
                        value={info.title}
                        onChange={(e) => handleYoutubeChange(letter.id, 'title', e.target.value)}
                        className="w-full rounded-lg border border-rose-100 px-2.5 py-1.5 text-xs text-[#5c4a55] focus:outline-none focus:border-rose-300 mb-1"
                      />
                      <div className="relative">
                        <YoutubeIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-red-400" />
                        <input
                          type="url"
                          placeholder="Paste YouTube Link (https://www.youtube.com/watch?v=...)"
                          value={info.url}
                          onChange={(e) => handleYoutubeChange(letter.id, 'url', e.target.value)}
                          className="w-full rounded-lg border border-rose-100 pl-8 pr-2.5 py-1.5 text-xs font-mono text-[#5c4a55] focus:outline-none focus:border-rose-300"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={handleSaveYoutube}
                className="w-full rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                <Music className="h-4 w-4" /> Save YouTube Songs
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
