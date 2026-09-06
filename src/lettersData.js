export const DEFAULT_RECIPIENT = 'My Love'
export const DEFAULT_SENDER = 'Me'

export const STORAGE_KEY = 'open-when:opened-ids'
export const PERSONALIZE_KEY = 'open-when:personalize'
export const CUSTOM_LETTERS_KEY = 'open-when:custom-letters'
export const QUIZ_ANSWERS_KEY = 'open-when:quiz-answers'

export function encodeShareData(obj) {
  try {
    const jsonStr = JSON.stringify(obj)
    return btoa(encodeURIComponent(jsonStr))
  } catch {
    return ''
  }
}

export function decodeShareData(str) {
  if (!str) return null
  try {
    const jsonStr = decodeURIComponent(atob(str))
    return JSON.parse(jsonStr)
  } catch {
    return null
  }
}

export function getInitialPersonalization() {
  if (typeof window === 'undefined') {
    return { recipient: DEFAULT_RECIPIENT, sender: DEFAULT_SENDER, incomingQuizResult: null, incomingReplyLetter: null }
  }

  const urlParams = new URLSearchParams(window.location.search)
  const urlTo = urlParams.get('to') || urlParams.get('recipient')
  const urlFrom = urlParams.get('from') || urlParams.get('sender')
  const quizParam = urlParams.get('quizResult')
  const replyParam = urlParams.get('replyLetter')

  let incomingQuizResult = null
  let incomingReplyLetter = null

  if (quizParam) {
    incomingQuizResult = decodeShareData(quizParam)
  }
  if (replyParam) {
    incomingReplyLetter = decodeShareData(replyParam)
  }

  if (urlTo || urlFrom) {
    const data = {
      recipient: urlTo || DEFAULT_RECIPIENT,
      sender: urlFrom || DEFAULT_SENDER,
    }
    try {
      localStorage.setItem(PERSONALIZE_KEY, JSON.stringify(data))
    } catch {}
    return { ...data, incomingQuizResult, incomingReplyLetter }
  }

  try {
    const raw = localStorage.getItem(PERSONALIZE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        recipient: parsed.recipient || DEFAULT_RECIPIENT,
        sender: parsed.sender || DEFAULT_SENDER,
        incomingQuizResult,
        incomingReplyLetter,
      }
    }
  } catch {}

  return { recipient: DEFAULT_RECIPIENT, sender: DEFAULT_SENDER, incomingQuizResult, incomingReplyLetter }
}

export function updateUrlWithPersonalization(recipient, sender) {
  if (typeof window === 'undefined') return
  try {
    const url = new URL(window.location.href)
    if (recipient && recipient !== DEFAULT_RECIPIENT) {
      url.searchParams.set('to', recipient)
    } else {
      url.searchParams.delete('to')
    }
    if (sender && sender !== DEFAULT_SENDER) {
      url.searchParams.set('from', sender)
    } else {
      url.searchParams.delete('from')
    }
    window.history.replaceState({}, '', url.toString())
  } catch {}
}

export function getShareableLink(recipient, sender, extraParams = {}) {
  if (typeof window === 'undefined') return ''
  const url = new URL(window.location.origin + window.location.pathname)
  if (recipient && recipient !== DEFAULT_RECIPIENT) {
    url.searchParams.set('to', recipient)
  }
  if (sender && sender !== DEFAULT_SENDER) {
    url.searchParams.set('from', sender)
  }
  Object.keys(extraParams).forEach((key) => {
    if (extraParams[key]) {
      url.searchParams.set(key, extraParams[key])
    }
  })
  return url.toString()
}

export function interpolateText(text, recipient = DEFAULT_RECIPIENT, sender = DEFAULT_SENDER) {
  if (!text) return ''
  return text
    .replace(/\{recipient\}/g, recipient)
    .replace(/\{sender\}/g, sender)
}

export function getYouTubeEmbedUrl(url) {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|music\.youtube\.com\/watch\?v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=0`
    : null
}

export function getCountdownRemaining(targetDateStr) {
  if (!targetDateStr) return null
  const target = new Date(targetDateStr).getTime()
  const now = new Date().getTime()
  const diff = target - now
  if (diff <= 0) return null

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

export const defaultLetters = [
  {
    id: 'stressful-day',
    title: "Open when you're having a stressful day",
    themeColor: '#F8C8DC',
    flapColor: '#F3AFC8',
    bodyColor: '#FDECF3',
    waxColor: '#C9A27C',
    accentClass: 'from-rose-100 via-pink-50 to-cream',
    message:
      "Hey {recipient}. Put the to-do list down for a minute and breathe with me. You do not have to hold the whole world today. I am so proud of how you keep showing up, even when it feels heavy. Let this be your pause: you are safe, you are capable, and you are deeply loved by {sender}. Come home to my arms in your mind for a second — I've got you. Drink some water, stretch your shoulders, and remember that this day cannot take away how wonderful you are.",
    gifUrl: 'https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif',
    photos: [
      { url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600', caption: 'Cozy moments together ☕' },
      { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600', caption: 'Always holding your hand 🤝' }
    ],
    songTitle: 'Perfect - Ed Sheeran',
    youtubeUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
  },
  {
    id: 'love-reminder',
    title: 'Open when you need a reminder of how much I love you',
    themeColor: '#E8B4B8',
    flapColor: '#E09AA3',
    bodyColor: '#FBE9EB',
    waxColor: '#C9A27C',
    accentClass: 'from-rose-200 via-cream to-pink-100',
    message:
      "Dearest {recipient}, if you ever wonder whether my love for you has a limit, it does not. I love the way you laugh when you try not to, the way you care for people, the quiet courage you think nobody notices. You are my favorite place. Not because everything is perfect, but because it is us. I choose you on the easy days and the tangled ones. Consider this a little love note from {sender} folded into your pocket: you are my always.",
    gifUrl: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
    photos: [
      { url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600', caption: 'Our favorite sunset date 🌅' },
      { url: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=600', caption: 'Pure happiness with you ✨' }
    ],
    songTitle: 'Until I Found You - Stephen Sanchez',
    youtubeUrl: 'https://www.youtube.com/watch?v=GxldQ9eX2fc',
    pinCode: '0412',
  },
  {
    id: 'anniversary-countdown',
    title: 'Open on our upcoming Anniversary 🎉',
    themeColor: '#E4D4F4',
    flapColor: '#D4BEEA',
    bodyColor: '#F4ECFB',
    waxColor: '#C9A27C',
    accentClass: 'from-violet-100 via-cream to-fuchsia-50',
    message:
      "Happy Anniversary, {recipient}! Another year of laughter, silly jokes, late-night talks, and growing together. Thank you for being my rock, my best friend, and my greatest adventure. Here is to a lifetime more with {sender}!",
    gifUrl: 'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif',
    songTitle: 'Lover - Taylor Swift',
    youtubeUrl: 'https://www.youtube.com/watch?v=-BjZmE2gtdo',
    unlockDate: '2026-12-25T00:00:00',
  },
  {
    id: 'miss-me',
    title: 'Open when you miss me',
    themeColor: '#CFE8D8',
    flapColor: '#B7DCC8',
    bodyColor: '#EAF6EF',
    waxColor: '#C9A27C',
    accentClass: 'from-emerald-50 via-cream to-teal-50',
    message:
      "I miss you too, {recipient} — in the small, ordinary ways. I miss your voice in the next room and the way the day feels warmer when you are nearby. Until we are together again, borrow this: {sender} is thinking of you right now. The distance is only geography. Close your eyes, picture my hand in yours, and know I would cross it all just to make you smile. I am already on my way back to you, in every way that counts.",
    gifUrl: 'https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif',
    songTitle: 'Die With A Smile - Lady Gaga & Bruno Mars',
    youtubeUrl: 'https://www.youtube.com/watch?v=kPa7bsKwL-c',
  },
]

export const defaultQuizQuestions = [
  {
    id: 'q1',
    question: "What is {recipient}'s favorite color?",
    options: ['Soft Pink / Rose 💖', 'Ocean Blue 🌊', 'Lavender Purple 💜', 'Emerald Green 🌿'],
    correctIndex: 0,
  },
  {
    id: 'q2',
    question: "What is {recipient}'s ultimate comfort food?",
    options: ['Warm Pizza 🍕', 'Creamy Pasta 🍝', 'Sweet Ice Cream 🍦', 'Spicy Ramen / Noodles 🍜'],
    correctIndex: 1,
  },
  {
    id: 'q3',
    question: "Where is {recipient}'s dream romantic vacation?",
    options: ['Paris, France 🗼', 'Cozy Mountain Cabin 🏔️', 'Tropical Beach Resort 🏝️', 'Kyoto, Japan 🌸'],
    correctIndex: 2,
  },
  {
    id: 'q4',
    question: "Who said 'I love you' first?",
    options: ['{sender} said it first 💕', '{recipient} said it first 💖', 'We both said it together! ✨', 'Still waiting to say it official 😉'],
    correctIndex: 0,
  },
  {
    id: 'q5',
    question: "What is {recipient}'s primary Love Language?",
    options: ['Quality Time ⏳', 'Words of Affirmation 💌', 'Physical Touch 🫂', 'Receiving Gifts 🎁'],
    correctIndex: 0,
  },
  {
    id: 'q6',
    question: "What is {recipient}'s favorite way to spend a lazy Sunday?",
    options: ['Cuddling & Bingeing Movies 🎬', 'Exploring cute cafes ☕', 'Sleeping in & Relaxing 😴', 'Going on an Outdoor Adventure 🌳'],
    correctIndex: 0,
  },
  {
    id: 'q7',
    question: "Who is more likely to initiate a random surprise hug?",
    options: ['{sender} 🙈', '{recipient} 🥰', 'Both of us equally! 🤗', 'Whoever is feeling extra clingy 😋'],
    correctIndex: 0,
  },
  {
    id: 'q8',
    question: "What is {recipient}'s go-to movie night snack?",
    options: ['Butter Popcorn 🍿', 'Chocolates & Candy 🍫', 'Nachos & Cheese 🧀', 'Chips & Cold Drinks 🥤'],
    correctIndex: 0,
  },
  {
    id: 'q9',
    question: "Who takes longer to get ready before going on a date?",
    options: ['{recipient} takes forever! 💅', '{sender} takes forever! 👔', 'We both take equal time ⌛', 'Neither, we are super fast! ⚡'],
    correctIndex: 0,
  },
  {
    id: 'q10',
    question: "How would you describe your relationship in one word?",
    options: ['Soulmates ✨', 'Best Friends 👭', 'Pure Magic 🪄', 'Home 🏡'],
    correctIndex: 0,
  },
]

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function isLetterUnlocked(letter, now = new Date()) {
  if (letter.unlockDate) {
    return new Date(letter.unlockDate).getTime() <= now.getTime()
  }
  if (!letter.unlockedWhen) return true
  const { weekday, hour, minute = 0 } = letter.unlockedWhen
  const day = now.getDay()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const unlockMinutes = hour * 60 + minute
  if (day === weekday && nowMinutes >= unlockMinutes) return true
  if (weekday === 5 && (day === 6 || day === 0)) return true
  return false
}

export function getUnlockHint(letter) {
  if (letter.unlockDate) {
    return `unlocks on ${new Date(letter.unlockDate).toLocaleDateString()}`
  }
  if (!letter.unlockedWhen) return null
  const { weekday, hour, minute = 0 } = letter.unlockedWhen
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const padded = String(minute).padStart(2, '0')
  return `${WEEKDAY_NAMES[weekday]} at ${hour12}:${padded} ${ampm}`
}
