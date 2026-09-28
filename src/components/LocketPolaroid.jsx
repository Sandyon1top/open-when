import confetti from 'canvas-confetti'
import {
  Camera,
  Check,
  Clock,
  Copy,
  Download,
  Flame,
  Heart,
  Image as ImageIcon,
  MapPin,
  Maximize2,
  Minimize2,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const STORAGE_LOCKET_PHOTOS = 'open_when_locket_photos_v1'

const MOODS = [
  { id: 'miss_you', label: 'Missing You', emoji: '🥺' },
  { id: 'thinking', label: 'Thinking of You', emoji: '💭' },
  { id: 'coffee', label: 'Morning Coffee', emoji: '☕' },
  { id: 'study', label: 'Work & Hustle', emoji: '💻' },
  { id: 'hug', label: 'Sending Hugs', emoji: '🫂' },
  { id: 'sleepy', label: 'Goodnight Sleepy', emoji: '🌙' },
  { id: 'smiling', label: 'Just Wanted to Smile', emoji: '✨' },
]

export default function LocketPolaroid({
  sender = 'Me',
  recipient = 'My Love',
  senderCity = { city: 'Kathmandu', country: 'Nepal', flag: '🇳🇵', timezone: 'Asia/Kathmandu' },
}) {
  const [photos, setPhotos] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_LOCKET_PHOTOS) || '[]')
      if (saved.length > 0) return saved
      // Default initial welcome polaroid
      return [
        {
          id: 'initial-polaroid',
          image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
          caption: 'Thinking of you across the miles... Can’t wait for our next hug! ☕✨',
          sender: 'Me',
          city: 'Kathmandu',
          country: 'Nepal',
          flag: '🇳🇵',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
          mood: 'Missing You 🥺',
          likes: 12,
          isSample: true,
        },
      ]
    } catch {
      return []
    }
  })

  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [captionInput, setCaptionInput] = useState('')
  const [selectedMood, setSelectedMood] = useState(MOODS[0])
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const videoRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_LOCKET_PHOTOS, JSON.stringify(photos))
  }, [photos])

  // Stop camera when closing capture mode
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    setIsCapturing(false)
  }

  // Start live webcam/phone camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      })
      setCameraStream(stream)
      setIsCapturing(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      alert('Camera access could not be started. You can also upload a photo from your files!')
      console.error(err)
    }
  }

  // Snap photo from stream
  const takeSnapshot = () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth || 640
    canvas.height = videoRef.current.videoHeight || 640
    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    setCapturedImage(dataUrl)
    stopCamera()
  }

  // Upload photo from device
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCapturedImage(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Save polaroid to scrapbook
  const handleSavePolaroid = () => {
    if (!capturedImage) return
    const now = new Date()
    const newPolaroid = {
      id: 'locket-' + Date.now(),
      image: capturedImage,
      caption: captionInput.trim() || 'A little piece of my day sent with love ❤️',
      sender,
      city: senderCity.city || 'Kathmandu',
      country: senderCity.country || 'Nepal',
      flag: senderCity.flag || '🇳🇵',
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      mood: `${selectedMood.label} ${selectedMood.emoji}`,
      likes: 1,
    }

    setPhotos((prev) => [newPolaroid, ...prev])
    setActivePhotoIndex(0)
    setCapturedImage(null)
    setCaptionInput('')
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } })
  }

  // Like / React to polaroid
  const handleLike = (id, e) => {
    e.stopPropagation()
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p))
    )
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { x: 0.5, y: 0.7 },
      colors: ['#ff4d6d', '#ff758f', '#ff85a1', '#f72585'],
    })
  }

  // Delete polaroid
  const handleDelete = (id, e) => {
    e.stopPropagation()
    if (confirm('Delete this polaroid memory?')) {
      const updated = photos.filter((p) => p.id !== id)
      setPhotos(updated)
      if (activePhotoIndex >= updated.length) {
        setActivePhotoIndex(Math.max(0, updated.length - 1))
      }
    }
  }

  const currentPhoto = photos[activePhotoIndex] || null

  return (
    <div className="rounded-3xl border border-rose-200/70 bg-gradient-to-br from-rose-50/70 via-white/80 to-purple-50/70 p-6 shadow-xl backdrop-blur-md dark:border-gray-700/60 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-purple-950/40">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200/50 dark:shadow-none">
            <Camera className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-xl font-bold text-gray-800 dark:text-gray-100">
                Live Locket & Polaroid 📸
              </h3>
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
                Live Presence
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Snap & send live photo updates across time zones directly to {recipient}'s screen.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={startCamera}
            className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:scale-105 active:scale-95"
          >
            <Camera className="h-4 w-4" /> Snap Live
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-rose-700 shadow-sm transition hover:bg-rose-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Upload className="h-4 w-4" /> Upload
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Live Camera Stream Modal */}
      {isCapturing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-gray-900 p-5 text-white shadow-2xl border border-gray-700">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold flex items-center gap-2 text-rose-400">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping"></span>
                Live Camera
              </span>
              <button
                type="button"
                onClick={stopCamera}
                className="rounded-full bg-gray-800 p-2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-black aspect-square flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
                onLoadedMetadata={() => videoRef.current?.play()}
              />
            </div>

            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={stopCamera}
                className="rounded-xl bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={takeSnapshot}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-3 font-bold text-white shadow-lg hover:scale-105 active:scale-95"
              >
                <Camera className="h-5 w-5" /> Snap Photo!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Polaroid Preview / Caption Editor */}
      {capturedImage && (
        <div className="mb-8 rounded-3xl border-2 border-dashed border-rose-300 bg-white/90 p-5 shadow-lg backdrop-blur-sm dark:border-rose-800/60 dark:bg-gray-800/90 animate-fadeIn">
          <div className="mb-4 flex items-center justify-between border-b border-rose-100 pb-2 dark:border-gray-700">
            <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> New Polaroid Note for {recipient}
            </h4>
            <button
              type="button"
              onClick={() => setCapturedImage(null)}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              Discard
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Polaroid Graphic */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-60 rounded-2xl bg-white p-3 shadow-xl border border-gray-200 dark:bg-gray-100 dark:border-gray-300 transform -rotate-1">
                <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                  <img src={capturedImage} alt="Captured" className="h-full w-full object-cover" />
                </div>
                <div className="pt-3 pb-1 text-center font-handwriting text-xs text-gray-700 italic">
                  {captionInput || 'Your caption here... ✨'}
                </div>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="md:col-span-7 space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Pick Your Mood Sticker:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MOODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMood(m)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        selectedMood.id === m.id
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {m.emoji} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1">
                  Handwritten Caption / Love Note:
                </label>
                <textarea
                  rows="2"
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  placeholder="e.g., Just had lunch and saw this cute sky, wishing you were walking next to me 💖"
                  className="w-full rounded-2xl border border-gray-300 bg-white p-3 text-xs text-gray-800 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handleSavePolaroid}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 py-3 text-xs font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-95"
              >
                <Check className="h-4 w-4" /> Pin Polaroid to Locket Scrapbook!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Display: Polaroid & Scrapbook Carousel */}
      {currentPhoto ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Large Polaroid */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative group w-full max-w-sm rounded-3xl bg-white p-4 pb-6 shadow-2xl border border-rose-100 transition duration-300 hover:shadow-rose-200/50 dark:bg-gray-800 dark:border-gray-700">
              {/* Top Pin/Tape graphic */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-md bg-amber-200/80 px-4 py-0.5 text-[10px] font-bold text-amber-900 shadow-sm rotate-2">
                📌 {currentPhoto.flag} {currentPhoto.city}
              </div>

              {/* Photo Frame */}
              <div className="relative mt-2 aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900">
                <img
                  src={currentPhoto.image}
                  alt="Polaroid"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Mood Tag Overlay */}
                <div className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                  {currentPhoto.mood || '❤️ Love'}
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(currentPhoto.id, e)}
                  className="absolute top-3 right-3 rounded-full bg-black/40 p-2 text-white/80 opacity-0 transition hover:bg-rose-600 hover:text-white group-hover:opacity-100"
                  title="Delete memory"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Handwritten Note Body */}
              <div className="mt-4 px-2 text-center">
                <p className="font-serif text-sm font-medium text-gray-800 dark:text-gray-100 italic leading-relaxed">
                  "{currentPhoto.caption}"
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-[11px] text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {currentPhoto.time} • {currentPhoto.date}
                  </span>
                  <span className="font-semibold text-rose-500">From {currentPhoto.sender}</span>
                </div>
              </div>

              {/* Interactive Reaction Bar */}
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-rose-50/80 px-3 py-2 dark:bg-gray-700/60">
                <button
                  type="button"
                  onClick={(e) => handleLike(currentPhoto.id, e)}
                  className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-rose-600 shadow-sm transition hover:scale-110 active:scale-90 dark:bg-gray-800"
                >
                  <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                  <span>{currentPhoto.likes || 1}</span>
                </button>

                <span className="text-[11px] font-medium text-rose-700 dark:text-rose-300">
                  Send partner a heart! 💌
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Scrapbook History & Mini Thumbnails */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-sm font-bold text-gray-800 dark:text-gray-200">
                Shared Memory Scrapbook ({photos.length} moments)
              </h4>
              <span className="text-xs text-rose-500 font-semibold">Tap to view</span>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1 p-1">
              {photos.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`group relative aspect-square overflow-hidden rounded-2xl border-2 transition ${
                    activePhotoIndex === idx
                      ? 'border-rose-500 ring-2 ring-rose-200 scale-105 shadow-md'
                      : 'border-white/80 opacity-70 hover:opacity-100 dark:border-gray-700'
                  }`}
                >
                  <img src={p.image} alt="Thumbnail" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 flex items-end p-1.5">
                    <span className="text-[10px] text-white font-medium truncate">{p.time}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-white/60 p-3.5 text-xs text-gray-600 shadow-sm dark:bg-gray-800/60 dark:text-gray-300 border border-rose-100/50 dark:border-gray-700">
              <p className="flex items-center gap-2 font-medium">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>
                  <strong>Tip:</strong> Take live snaps during your daily commute, lunch, or sunset to keep your presence alive on your partner’s screen!
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="mt-2 text-sm text-gray-500">No polaroids yet. Snap or upload your first photo!</p>
        </div>
      )}
    </div>
  )
}
