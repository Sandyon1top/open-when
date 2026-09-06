import { Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function AmbiencePlayer() {
  const [currentTrack, setCurrentTrack] = useState('none') // 'none' | 'rain' | 'fire' | 'lofi'
  const audioCtxRef = useRef(null)
  const activeNodesRef = useRef([])

  const stopAudio = () => {
    activeNodesRef.current.forEach((node) => {
      try {
        if (node.stop) node.stop()
        if (node.disconnect) node.disconnect()
      } catch {}
    })
    activeNodesRef.current = []
  }

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      audioCtxRef.current = new AudioCtx()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  const playRain = () => {
    stopAudio()
    const ctx = getAudioContext()
    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    const whiteNoise = ctx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1000

    const gainNode = ctx.createGain()
    gainNode.gain.value = 0.15

    whiteNoise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    whiteNoise.start()
    activeNodesRef.current = [whiteNoise, filter, gainNode]
  }

  const playFire = () => {
    stopAudio()
    const ctx = getAudioContext()
    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    let lastOut = 0.0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      output[i] = (lastOut + 0.02 * white) / 1.02
      lastOut = output[i]
      output[i] *= 3.5
    }

    const brownNoise = ctx.createBufferSource()
    brownNoise.buffer = noiseBuffer
    brownNoise.loop = true

    const gainNode = ctx.createGain()
    gainNode.gain.value = 0.2

    brownNoise.connect(gainNode)
    gainNode.connect(ctx.destination)

    brownNoise.start()
    activeNodesRef.current = [brownNoise, gainNode]
  }

  const playLofi = () => {
    stopAudio()
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(220, ctx.currentTime) // A3 chord

    gain.gain.setValueAtTime(0.08, ctx.currentTime)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    activeNodesRef.current = [osc, gain]
  }

  useEffect(() => {
    if (currentTrack === 'rain') playRain()
    else if (currentTrack === 'fire') playFire()
    else if (currentTrack === 'lofi') playLofi()
    else stopAudio()

    return () => stopAudio()
  }, [currentTrack])

  return (
    <div className="flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-xs shadow-sm border border-rose-100 dark:border-gray-700 backdrop-blur-sm">
      <span className="text-[#7a6570] dark:text-gray-300 font-medium flex items-center gap-1">
        {currentTrack === 'none' ? <VolumeX className="h-3.5 w-3.5 text-gray-400" /> : <Volume2 className="h-3.5 w-3.5 text-rose-400 animate-pulse" />}
        Ambience:
      </span>

      <button
        type="button"
        onClick={() => setCurrentTrack('none')}
        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition ${currentTrack === 'none' ? 'bg-rose-500 text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-700'}`}
      >
        Mute
      </button>
      <button
        type="button"
        onClick={() => setCurrentTrack('rain')}
        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition ${currentTrack === 'rain' ? 'bg-rose-500 text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-700'}`}
      >
        🌧️ Rain
      </button>
      <button
        type="button"
        onClick={() => setCurrentTrack('fire')}
        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition ${currentTrack === 'fire' ? 'bg-rose-500 text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-700'}`}
      >
        🔥 Fireplace
      </button>
      <button
        type="button"
        onClick={() => setCurrentTrack('lofi')}
        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition ${currentTrack === 'lofi' ? 'bg-rose-500 text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-700'}`}
      >
        🎹 Lo-Fi
      </button>
    </div>
  )
}
