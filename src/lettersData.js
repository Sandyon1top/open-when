export const letters = [
  {
    id: 'stressful-day',
    title: "Open when you're having a stressful day",
    themeColor: '#F8C8DC',
    flapColor: '#F3AFC8',
    bodyColor: '#FDECF3',
    waxColor: '#C9A27C',
    accentClass: 'from-rose-100 via-pink-50 to-cream',
    message:
      "Hey love. Put the to-do list down for a minute and breathe with me. You do not have to hold the whole world today. I am so proud of how you keep showing up, even when it feels heavy. Let this be your pause: you are safe, you are capable, and you are deeply loved. Come home to my arms in your mind for a second — I've got you. Drink some water, stretch your shoulders, and remember that this day cannot take away how wonderful you are.",
    gifUrl: 'https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
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
      "If you ever wonder whether my love has a limit, it does not. I love the way you laugh when you try not to, the way you care for people, the quiet courage you think nobody notices. You are my favorite place. Not because everything is perfect, but because it is us. I choose you on the easy days and the tangled ones. Consider this a little love note folded into your pocket: you are my always.",
    gifUrl: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
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
      "It's Friday, the lights are soft, and this hour belongs to us. Imagine I just walked in with something sweet and a playlist already queued. No rush, no proving anything — just us, a little silly, a little close. If we cannot be in the same room, we can still share this pocket of night. Put your phone on the table, press play, and pretend I am sitting across from you, grinning because I get to love you into the weekend.",
    gifUrl: 'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
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
      "I miss you too — in the small, ordinary ways. I miss your voice in the next room and the way the day feels warmer when you are nearby. Until we are together again, borrow this: I am thinking of you right now. The distance is only geography. You can close your eyes, picture my hand in yours, and know I would cross it all just to make you smile. I am already on my way back to you, in every way that counts.",
    gifUrl: 'https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
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

export const STORAGE_KEY = 'open-when:opened-ids'
