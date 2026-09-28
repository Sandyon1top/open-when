import confetti from 'canvas-confetti'
import {
  Download,
  Heart,
  Mic,
  MicOff,
  Music,
  Pause,
  Play,
  Plus,
  Radio,
  Sparkles,
  Square,
  Trash2,
  Volume2,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { DEFAULT_SOUNDTRACKS } from '../data/ldrGamesData.js'

const STORAGE_VOICE_MEMOS = 'open_when_voice_memos_v1'
const STORAGE_CUSTOM_SPOTIFY = 'open_when_custom_spotify_v1'

export default function VoiceAndSoundtrack({
  sender = 'Me',
  recipient = 'My Love',
  senderCity = { city: 'Kathmandu', country: 'Nepal', flag: '🇳🇵' },
}) {
  // Voice Memo Recording State
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setCapturedAudioUrl] = useState(null)
  const [memoTitle, setMemoTitle] = useState('')
  const [memos, setMemos] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_VOICE_MEMOS) || '[]')
      return saved
    } catch {
      return []
    }
  })

  // Audio Playback State
  const [playingId, setPlayingId] = useState(null)
  const [audioProgress, setAudioProgress] = useState(0)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)
  const audioElementRef = useRef(null)

  // Spotify Playlist State
  const [soundtracks, setSoundtracks] = useState(DEFAULT_SOUNDTRACKS)
  const [activeSoundtrackIndex, setActiveSoundtrackIndex] = useState(0)
  const [customEmbedUrl, setCustomEmbedUrl] = useState(() => {
    return localStorage.getItem(STORAGE_CUSTOM_SPOTIFY) || ''
  })
  const [isAddingCustomMusic, setIsAddingCustomMusic] = useState(false)

  // Save voice memos to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_VOICE_MEMOS, JSON.stringify(memos))
  }, [memos])

  // Recording Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
      setRecordingTime(0)
    }
    return () => clearInterval(timerRef.current)
  }, [isRecording])

  // Start Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = () => {
          setCapturedAudioUrl(reader.result)
        }
        reader.readAsDataURL(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      alert('Microphone permission is needed to record voice notes.')
      console.error(err)
    }
  }

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Save Voice Memo to list
  const handleSaveMemo = () => {
    if (!audioUrl) return
    const newMemo = {
      id: 'voice-' + Date.now(),
      title: memoTitle.trim() || `Whisper from ${senderCity.city || 'Kathmandu'} 🎙️`,
      audioData: audioUrl,
      sender,
      city: senderCity.city || 'Kathmandu',
      flag: senderCity.flag || '🇳🇵',
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: recordingTime > 0 ? `${recordingTime}s` : 'Voice Note',
    }

    setMemos([newMemo, ...memos])
    setCapturedAudioUrl(null)
    setMemoTitle('')
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } })
  }

  // Play a voice memo
  const handleTogglePlay = (id, audioData) => {
    if (playingId === id) {
      if (audioElementRef.current) {
        audioElementRef.current.pause()
      }
      setPlayingId(null)
      return
    }

    if (audioElementRef.current) {
      audioElementRef.current.pause()
    }

    const audio = new Audio(audioData)
    audioElementRef.current = audio
    setPlayingId(id)

    audio.onended = () => {
      setPlayingId(null)
      setAudioProgress(0)
    }

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    audio.play().catch(console.error)
  }

  // Delete voice memo
  const handleDeleteMemo = (id) => {
    if (confirm('Delete this voice memo?')) {
      if (playingId === id && audioElementRef.current) {
        audioElementRef.current.pause()
        setPlayingId(null)
      }
      setMemos(memos.filter((m) => m.id !== id))
    }
  }

  // Save custom Spotify embed
  const handleSaveCustomMusic = (url) => {
    let embed = url.trim()
    if (embed.includes('open.spotify.com/track/') || embed.includes('open.spotify.com/playlist/') || embed.includes('open.spotify.com/album/')) {
      if (!embed.includes('/embed/')) {
        embed = embed.replace('open.spotify.com/', 'open.spotify.com/embed/')
      }
    }
    setCustomEmbedUrl(embed)
    localStorage.setItem(STORAGE_CUSTOM_SPOTIFY, embed)
    setIsAddingCustomMusic(false)
  }

  const activeSoundtrack = soundtracks[activeSoundtrackIndex]
  const currentEmbed = customEmbedUrl || activeSoundtrack?.embedUrl

  return (
    <div className="rounded-3xl border border-purple-200/70 bg-gradient-to-br from-purple-50/80 via-white/90 to-indigo-50/80 p-6 shadow-xl backdrop-blur-md dark:border-gray-700/60 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-indigo-950/40">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200/50 dark:shadow-none">
            <Radio className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-xl font-bold text-gray-800 dark:text-gray-100">
                Voice Capsule & Couple Soundtrack 🎙️🎵
              </h3>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                Shared Audio
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Leave sweet audio notes for {recipient} to wake up to, and listen to synced music together.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Voice Note Recorder & History */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl bg-white/90 p-5 shadow-md border border-purple-100 dark:bg-gray-800/90 dark:border-gray-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
              <Mic className="h-4 w-4" /> Record a Voice Whisper
            </h4>

            {/* Recorder Controls */}
            {!audioUrl ? (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                {isRecording ? (
                  <div className="space-y-4">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute h-24 w-24 rounded-full bg-rose-500/20 animate-ping"></div>
                      <div className="h-16 w-16 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg">
                        <Mic className="h-8 w-8 animate-bounce" />
                      </div>
                    </div>
                    <div>
                      <span className="text-2xl font-mono font-bold text-rose-600 dark:text-rose-400">
                        00:{recordingTime.toString().padStart(2, '0')}
                      </span>
                      <p className="text-xs text-gray-500">Recording live audio... Speak to {recipient}</p>
                    </div>
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-700 active:scale-95"
                    >
                      <Square className="h-4 w-4 fill-white" /> Stop & Review
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={startRecording}
                      className="group flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg transition hover:scale-110 active:scale-95 mx-auto"
                    >
                      <Mic className="h-7 w-7 transition group-hover:scale-110" />
                    </button>
                    <div>
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        Tap microphone to start recording
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Say "Good morning", record a bedtime story, or sing a song!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Review & Save recorded audio */
              <div className="space-y-3">
                <div className="rounded-2xl bg-purple-50 p-3.5 dark:bg-gray-700/60 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleTogglePlay('preview', audioUrl)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white shadow"
                  >
                    {playingId === 'preview' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-purple-900 dark:text-purple-200">Preview Voice Note</p>
                    <p className="text-[11px] text-gray-500">Ready to save</p>
                  </div>
                </div>

                <input
                  type="text"
                  value={memoTitle}
                  onChange={(e) => setMemoTitle(e.target.value)}
                  placeholder="Memo title (e.g., 'Wake up sleepyhead ☕', 'Goodnight whisper 🌙')"
                  className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs text-gray-800 focus:border-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCapturedAudioUrl(null)}
                    className="flex-1 rounded-xl bg-gray-100 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveMemo}
                    className="flex-[2] rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-2 text-xs font-bold text-white shadow hover:scale-[1.02] active:scale-95"
                  >
                    Save Voice Note 💌
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Voice Memo History */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Saved Voice Capsules ({memos.length})
            </h4>

            {memos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400 dark:border-gray-700">
                No voice memos recorded yet. Record the first one above!
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {memos.map((memo) => (
                  <div
                    key={memo.id}
                    className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm border border-purple-100 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleTogglePlay(memo.id, memo.audioData)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm transition hover:scale-105 ${
                          playingId === memo.id ? 'bg-rose-500 animate-pulse' : 'bg-purple-600'
                        }`}
                      >
                        {playingId === memo.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                      </button>
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-100">{memo.title}</p>
                        <p className="text-[10px] text-gray-400">
                          {memo.flag} {memo.city} • {memo.date} at {memo.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteMemo(memo.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400"
                        title="Delete memo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Shared Spotify Soundtrack */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl bg-white/90 p-5 shadow-md border border-indigo-100 dark:bg-gray-800/90 dark:border-gray-700">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                <Music className="h-4 w-4" /> Shared Couple Jam
              </h4>
              <button
                type="button"
                onClick={() => setIsAddingCustomMusic(!isAddingCustomMusic)}
                className="text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {isAddingCustomMusic ? 'Cancel' : '+ Custom Playlist'}
              </button>
            </div>

            {/* Custom Spotify URL Input */}
            {isAddingCustomMusic && (
              <div className="mb-3 rounded-xl bg-indigo-50 p-3 dark:bg-gray-700/60 space-y-2">
                <label className="block text-[11px] font-semibold text-indigo-900 dark:text-indigo-200">
                  Paste Spotify Playlist or Track URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={customEmbedUrl}
                    placeholder="https://open.spotify.com/playlist/..."
                    id="spotify-url-input"
                    className="flex-1 rounded-lg border border-indigo-200 bg-white p-2 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('spotify-url-input')
                      if (input) handleSaveCustomMusic(input.value)
                    }}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow"
                  >
                    Set
                  </button>
                </div>
              </div>
            )}

            {/* Soundtrack Presets */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {soundtracks.map((st, idx) => (
                <button
                  key={st.title}
                  type="button"
                  onClick={() => {
                    setActiveSoundtrackIndex(idx)
                    setCustomEmbedUrl('')
                    localStorage.removeItem(STORAGE_CUSTOM_SPOTIFY)
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    activeSoundtrackIndex === idx && !customEmbedUrl
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {st.badge}
                </button>
              ))}
            </div>

            {/* Embedded Player */}
            <div className="overflow-hidden rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700">
              <iframe
                style={{ borderRadius: '16px' }}
                src={currentEmbed}
                width="100%"
                height="230"
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Couple Soundtrack"
              ></iframe>
            </div>

            <p className="mt-2 text-center text-[11px] text-gray-400">
              {customEmbedUrl ? 'Your Custom Playlist 🎶' : activeSoundtrack?.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
