const PREFERRED_VOICE = /samantha|ava|aria|google us english|natural/i

export function selectEnglishVoice(voices = []) {
  const englishVoices = voices.filter((voice) => voice.lang?.toLowerCase().startsWith('en'))

  return englishVoices.sort((first, second) => scoreVoice(second) - scoreVoice(first))[0] ?? null
}

function scoreVoice(voice) {
  let score = 0
  if (voice.lang?.toLowerCase() === 'en-us') score += 100
  if (PREFERRED_VOICE.test(voice.name ?? '')) score += 50
  if (voice.localService) score += 5
  return score
}

export function speakEnglishWord(word, speechApi = {}) {
  const synth = speechApi.synth ?? globalThis.speechSynthesis
  const Utterance = speechApi.Utterance ?? globalThis.SpeechSynthesisUtterance
  const text = typeof word === 'string' ? word.trim() : ''

  if (!text || !synth?.speak || !Utterance) return false

  const utterance = new Utterance(text)
  const voice = selectEnglishVoice(synth.getVoices?.() ?? [])

  utterance.lang = 'en-US'
  utterance.rate = 0.82
  utterance.pitch = 1
  utterance.volume = 1
  if (voice) utterance.voice = voice

  synth.cancel?.()
  synth.speak(utterance)
  return true
}
