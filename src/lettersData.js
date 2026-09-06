export const DEFAULT_RECIPIENT = 'My Love'
export const DEFAULT_SENDER = 'Me'

export const STORAGE_KEY = 'open-when:opened-ids'
export const PERSONALIZE_KEY = 'open-when:personalize'
export const CUSTOM_LETTERS_KEY = 'open-when:custom-letters'
export const QUIZ_ANSWERS_KEY = 'open-when:quiz-answers'

export function getInitialPersonalization() {
  if (typeof window === 'undefined') {
    return { recipient: DEFAULT_RECIPIENT, sender: DEFAULT_SENDER }
  }

  const urlParams = new URLSearchParams(window.location.search)
  const urlTo = urlParams.get('to') || urlParams.get('recipient')
  const urlFrom = urlParams.get('from') || urlParams.get('sender')

  if (urlTo || urlFrom) {
    const data = {
      recipient: urlTo || DEFAULT_RECIPIENT,
      sender: urlFrom || DEFAULT_SENDER,
    }
    try {
      localStorage.setItem(PERSONALIZE_KEY, JSON.stringify(data))
    } catch {}
    return data
  }

  try {
    const raw = localStorage.getItem(PERSONALIZE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        recipient: parsed.recipient || DEFAULT_RECIPIENT,
        sender: parsed.sender || DEFAULT_SENDER,
      }
    }
  } catch {}

  return { recipient: DEFAULT_RECIPIENT, sender: DEFAULT_SENDER }
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

export function getShareableLink(recipient, sender) {
  if (typeof window === 'undefined') return ''
  const url = new URL(window.location.href)
  if (recipient && recipient !== DEFAULT_RECIPIENT) {
    url.searchParams.set('to', recipient)
  }
  if (sender && sender !== DEFAULT_SENDER) {
    url.searchParams.set('from', sender)
  }
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
    songTitle: 'Until I Found You - Stephen Sanchez',
    youtubeUrl: 'https://www.youtube.com/watch?v=GxldQ9eX2fc',
  },
  {
    id: 'friday-night',
    title: 'Open on Friday night at 8 PM',
    themeColor: '#E4D4F4',
    flapColor: '#D4BEEA',
    bodyColor: '#F4ECFB',
    waxColor: '#C9A27C',
    accentClass: 'from-violet-100 via-cream to-fuchsia-50',
    message:
      "Happy Friday, {recipient}! The lights are soft, and this hour belongs to us. Imagine {sender} just walked in with something sweet and a romantic playlist already queued. No rush, no proving anything — just us, a little silly, a little close. Put your phone on the table, press play, and pretend I am sitting right across from you, grinning because I get to love you into the weekend.",
    gifUrl: 'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif',
    songTitle: 'Lover - Taylor Swift',
    youtubeUrl: 'https://www.youtube.com/watch?v=-BjZmE2gtdo',
    unlockedWhen: { weekday: 5, hour: 20, minute: 0 },
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
  if (!letter.unlockedWhen) return null
  const { weekday, hour, minute = 0 } = letter.unlockedWhen
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const padded = String(minute).padStart(2, '0')
  return `${WEEKDAY_NAMES[weekday]} at ${hour12}:${padded} ${ampm}`
}
