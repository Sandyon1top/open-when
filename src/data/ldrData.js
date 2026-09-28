export const WORLD_CITIES = [
  // Nepal Time (NPT / UTC+5:45)
  { id: 'kathmandu', city: 'Kathmandu', country: 'Nepal', timezone: 'Asia/Kathmandu', label: 'Nepal Time (NPT +5:45)', flag: '🇳🇵', lat: 27.7172, lng: 85.324 },
  { id: 'pokhara', city: 'Pokhara', country: 'Nepal', timezone: 'Asia/Kathmandu', label: 'Nepal Time (NPT +5:45)', flag: '🇳🇵', lat: 28.2096, lng: 83.9856 },
  { id: 'lalitpur', city: 'Lalitpur (Patan)', country: 'Nepal', timezone: 'Asia/Kathmandu', label: 'Nepal Time (NPT +5:45)', flag: '🇳🇵', lat: 27.6710, lng: 85.3240 },
  { id: 'chitwan', city: 'Chitwan (Bharatpur)', country: 'Nepal', timezone: 'Asia/Kathmandu', label: 'Nepal Time (NPT +5:45)', flag: '🇳🇵', lat: 27.6833, lng: 84.4333 },
  { id: 'biratnagar', city: 'Biratnagar', country: 'Nepal', timezone: 'Asia/Kathmandu', label: 'Nepal Time (NPT +5:45)', flag: '🇳🇵', lat: 26.4525, lng: 87.2718 },

  // International Hubs
  { id: 'new_york', city: 'New York', country: 'USA (EST/EDT)', timezone: 'America/New_York', label: 'EST/EDT', flag: '🇺🇸', lat: 40.7128, lng: -74.006 },
  { id: 'los_angeles', city: 'Los Angeles', country: 'USA (PST/PDT)', timezone: 'America/Los_Angeles', label: 'PST/PDT', flag: '🇺🇸', lat: 34.0522, lng: -118.2437 },
  { id: 'chicago', city: 'Chicago', country: 'USA (CST/CDT)', timezone: 'America/Chicago', label: 'CST/CDT', flag: '🇺🇸', lat: 41.8781, lng: -87.6298 },
  { id: 'dallas', city: 'Dallas / Texas', country: 'USA (CST)', timezone: 'America/Chicago', label: 'CST/CDT', flag: '🇺🇸', lat: 32.7767, lng: -96.7970 },
  { id: 'london', city: 'London', country: 'UK (GMT/BST)', timezone: 'Europe/London', label: 'GMT/BST', flag: '🇬🇧', lat: 51.5074, lng: -0.1278 },
  { id: 'toronto', city: 'Toronto', country: 'Canada (EST)', timezone: 'America/Toronto', label: 'EST/EDT', flag: '🇨🇦', lat: 43.6532, lng: -79.3832 },
  { id: 'vancouver', city: 'Vancouver', country: 'Canada (PST)', timezone: 'America/Vancouver', label: 'PST/PDT', flag: '🇨🇦', lat: 49.2827, lng: -123.1207 },
  { id: 'sydney', city: 'Sydney', country: 'Australia (AEST)', timezone: 'Australia/Sydney', label: 'AEST/AEDT', flag: '🇦🇺', lat: -33.8688, lng: 151.2093 },
  { id: 'melbourne', city: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne', label: 'AEST/AEDT', flag: '🇦🇺', lat: -37.8136, lng: 144.9631 },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan (JST)', timezone: 'Asia/Tokyo', label: 'JST (+9)', flag: '🇯🇵', lat: 35.6762, lng: 139.6503 },
  { id: 'singapore', city: 'Singapore', country: 'Singapore (SGT)', timezone: 'Asia/Singapore', label: 'SGT (+8)', flag: '🇸🇬', lat: 1.3521, lng: 103.8198 },
  { id: 'dubai', city: 'Dubai', country: 'UAE (GST)', timezone: 'Asia/Dubai', label: 'GST (+4)', flag: '🇦🇪', lat: 25.2048, lng: 55.2708 },
  { id: 'mumbai', city: 'Mumbai / Delhi', country: 'India (IST)', timezone: 'Asia/Kolkata', label: 'IST (+5:30)', flag: '🇮🇳', lat: 19.076, lng: 72.8777 },
  { id: 'paris', city: 'Paris', country: 'France (CET)', timezone: 'Europe/Paris', label: 'CET/CEST', flag: '🇫🇷', lat: 48.8566, lng: 2.3522 },
  { id: 'berlin', city: 'Berlin', country: 'Germany (CET)', timezone: 'Europe/Berlin', label: 'CET/CEST', flag: '🇩🇪', lat: 52.52, lng: 13.405 },
  { id: 'seoul', city: 'Seoul', country: 'South Korea (KST)', timezone: 'Asia/Seoul', label: 'KST (+9)', flag: '🇰🇷', lat: 37.5665, lng: 126.978 },
  { id: 'rome', city: 'Rome', country: 'Italy (CET)', timezone: 'Europe/Rome', label: 'CET/CEST', flag: '🇮🇹', lat: 41.9028, lng: 12.4964 },
  { id: 'madrid', city: 'Madrid / Barcelona', country: 'Spain (CET)', timezone: 'Europe/Madrid', label: 'CET/CEST', flag: '🇪🇸', lat: 40.4168, lng: -3.7038 },
  { id: 'sao_paulo', city: 'São Paulo', country: 'Brazil (BRT)', timezone: 'America/Sao_Paulo', label: 'BRT (-3)', flag: '🇧🇷', lat: -23.5505, lng: -46.6333 },
  { id: 'mexico_city', city: 'Mexico City', country: 'Mexico (CST)', timezone: 'America/Mexico_City', label: 'CST (-6)', flag: '🇲🇽', lat: 19.4326, lng: -99.1332 },
  { id: 'auckland', city: 'Auckland', country: 'New Zealand (NZST)', timezone: 'Pacific/Auckland', label: 'NZST/NZDT', flag: '🇳🇿', lat: -36.8485, lng: 174.7633 },
  { id: 'bangkok', city: 'Bangkok', country: 'Thailand (ICT)', timezone: 'Asia/Bangkok', label: 'ICT (+7)', flag: '🇹🇭', lat: 13.7563, lng: 100.5018 },
  { id: 'kuala_lumpur', city: 'Kuala Lumpur', country: 'Malaysia (MYT)', timezone: 'Asia/Kuala_Lumpur', label: 'MYT (+8)', flag: '🇲🇾', lat: 3.1390, lng: 101.6869 },
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
