export const WORLD_CITIES = [
  { city: 'New York', country: 'USA', timezone: 'America/New_York', flag: '🇺🇸', lat: 40.7128, lng: -74.006 },
  { city: 'London', country: 'UK', timezone: 'Europe/London', flag: '🇬🇧', lat: 51.5074, lng: -0.1278 },
  { city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles', flag: '🇺🇸', lat: 34.0522, lng: -118.2437 },
  { city: 'Toronto', country: 'Canada', timezone: 'America/Toronto', flag: '🇨🇦', lat: 43.6532, lng: -79.3832 },
  { city: 'Paris', country: 'France', timezone: 'Europe/Paris', flag: '🇫🇷', lat: 48.8566, lng: 2.3522 },
  { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪', lat: 52.52, lng: 13.405 },
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵', lat: 35.6762, lng: 139.6503 },
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺', lat: -33.8688, lng: 151.2093 },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬', lat: 1.3521, lng: 103.8198 },
  { city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', flag: '🇦🇪', lat: 25.2048, lng: 55.2708 },
  { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳', lat: 19.076, lng: 72.8777 },
  { city: 'Kathmandu', country: 'Nepal', timezone: 'Asia/Kathmandu', flag: '🇳🇵', lat: 27.7172, lng: 85.324 },
  { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', flag: '🇰🇷', lat: 37.5665, lng: 126.978 },
  { city: 'Rome', country: 'Italy', timezone: 'Europe/Rome', flag: '🇮🇹', lat: 41.9028, lng: 12.4964 },
  { city: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid', flag: '🇪🇸', lat: 41.3851, lng: 2.1734 },
  { city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', flag: '🇧🇷', lat: -23.5505, lng: -46.6333 },
  { city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', flag: '🇲🇽', lat: 19.4326, lng: -99.1332 },
  { city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', flag: '🇳🇿', lat: -36.8485, lng: 174.7633 },
]

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

export const DAILY_LDR_QUESTIONS = [
  {
    id: 'q1',
    category: 'Intimacy & Heart',
    badge: 'Romantic',
    question: 'What is the very first physical thing you want to do the second we hug at the airport?',
    partnerPlaceholderAnswer: 'Hold you so tightly, bury my face in your neck, and not let go for 5 straight minutes.',
  },
  {
    id: 'q2',
    category: 'Vulnerability & Feelings',
    badge: 'Deep',
    question: 'At what exact moment of the day do you miss me the most intensely?',
    partnerPlaceholderAnswer: 'Right when I get into bed at night and the room gets completely quiet.',
  },
  {
    id: 'q3',
    category: 'Future & Dreams',
    badge: 'Future Us',
    question: 'When we finally close the distance and move in together, what morning routine do you look forward to most?',
    partnerPlaceholderAnswer: 'Making breakfast together on lazy Sunday mornings without having to say goodbye.',
  },
  {
    id: 'q4',
    category: 'Playful & Spicy',
    badge: 'Spicy 🔥',
    question: 'What is your favorite outfit of mine that you can’t wait to take off me in person?',
    partnerPlaceholderAnswer: 'That oversized shirt you wear when we FaceTime, and your cute smile.',
  },
  {
    id: 'q5',
    category: 'Gratitude & Bonding',
    badge: 'Heartfelt',
    question: 'What is something I did recently over call or text that made your entire day so much better?',
    partnerPlaceholderAnswer: 'When you sent me a surprise voice note just to say you were proud of me.',
  },
  {
    id: 'q6',
    category: 'Memories',
    badge: 'Nostalgia',
    question: 'What is one hilarious or chaotic moment from our last time together that you still laugh about?',
    partnerPlaceholderAnswer: 'When we got totally lost trying to find that food spot in the rain and ate under the bridge.',
  },
  {
    id: 'q7',
    category: 'Reunion Bucket List',
    badge: 'Next Trip',
    question: 'If we could only do ONE dream date during our next visit, what would you choose?',
    partnerPlaceholderAnswer: 'A late-night drive to an overlook with our favorite playlist and blankets.',
  },
  {
    id: 'q8',
    category: 'Deep Connection',
    badge: 'Soulmate',
    question: 'How has being long-distance made our love stronger and more intentional?',
    partnerPlaceholderAnswer: 'It forced us to truly learn how to communicate and appreciate every single second together.',
  },
]

export const LDR_DATE_IDEAS = [
  {
    id: 'd1',
    title: '🍿 Sync Teleparty Movie Night',
    tag: 'Cozy',
    description: 'Order each other delivery snacks (UberEats secret surprise) and sync a movie on Teleparty/Netflix with FaceTime on mute.',
  },
  {
    id: 'd2',
    title: '🍝 Sync-Cook The Same Recipe',
    tag: 'Foodie',
    description: 'Pick an Italian pasta or sushi recipe, prep ingredients together on video call, and light candles for a virtual candlelight dinner.',
  },
  {
    id: 'd3',
    title: '🗺️ Google Street View World Tour',
    tag: 'Adventure',
    description: 'Drop into Paris, Tokyo, or your hometown on Google Earth and walk each other through secret favorite spots.',
  },
  {
    id: 'd4',
    title: '🎨 Paint & Sip FaceTime Night',
    tag: 'Creative',
    description: 'Get two cheap watercolor sets or canvas boards, pick a theme (e.g. paint each other), and reveal your masterworks at the end.',
  },
  {
    id: 'd5',
    title: '🎙️ Open When Voice Capsule Drop',
    tag: 'Intimate',
    description: 'Record 5-minute audio letters and trade them to listen right before falling asleep.',
  },
]
