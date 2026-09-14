import { describe, expect, it, vi } from 'vitest'
import { selectEnglishVoice, speakEnglishWord } from '../shared/utils/pronunciation'

describe('selectEnglishVoice', () => {
  it('prefers a natural US English voice for clear pronunciation', () => {
    const voices = [
      { name: 'French Voice', lang: 'fr-FR' },
      { name: 'Daniel', lang: 'en-GB' },
      { name: 'Samantha', lang: 'en-US' },
    ]

    expect(selectEnglishVoice(voices)).toEqual(voices[2])
  })
})

describe('speakEnglishWord', () => {
  it('cancels old speech and speaks slowly with an English voice', () => {
    const voice = { name: 'Samantha', lang: 'en-US' }
    const synth = {
      cancel: vi.fn(),
      speak: vi.fn(),
      getVoices: () => [voice],
    }
    class Utterance {
      constructor(text) {
        this.text = text
      }
    }

    const didSpeak = speakEnglishWord('serendipity', { synth, Utterance })

    expect(didSpeak).toBe(true)
    expect(synth.cancel).toHaveBeenCalledOnce()
    expect(synth.speak).toHaveBeenCalledOnce()
    expect(synth.speak.mock.calls[0][0]).toMatchObject({
      text: 'serendipity',
      lang: 'en-US',
      rate: 0.82,
      pitch: 1,
      voice,
    })
  })

  it('returns false when speech synthesis is unavailable', () => {
    expect(speakEnglishWord('serendipity', { synth: null, Utterance: null })).toBe(false)
  })
})
