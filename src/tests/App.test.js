import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import App from '../App'
import vocabulary from '../data/vocabulary.json'
import { recordDailyReview, saveDailyLimit } from '../shared/utils/dailySession'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(globalThis, 'speechSynthesis', {
      configurable: true,
      value: {
        cancel: vi.fn(),
        getVoices: () => [],
        speak: vi.fn(),
      },
    })
    Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: class SpeechSynthesisUtterance {
        constructor(text) {
          this.text = text
        }
      },
    })
  })

  it('plays the English pronunciation for the current word', () => {
    render(createElement(App, { vocabulary }))

    fireEvent.click(screen.getByRole('button', { name: 'Listen to serendipity' }))

    expect(globalThis.speechSynthesis.speak).toHaveBeenCalledOnce()
    expect(globalThis.speechSynthesis.speak.mock.calls[0][0].text).toBe('serendipity')
  })

  it('uses a production-facing label for the word library', () => {
    render(createElement(App, { vocabulary }))

    fireEvent.click(screen.getByRole('button', { name: 'Open word library' }))

    expect(screen.getByText('Word library')).toBeInTheDocument()
    expect(screen.queryByText('JSON library')).not.toBeInTheDocument()
  })

  it('shows a due word and saves progress when its translation is selected', () => {
    saveDailyLimit(2)
    render(createElement(App, { vocabulary }))

    expect(screen.getByRole('heading', { name: 'serendipity' })).toBeInTheDocument()
    expect(screen.getByText('0 of 2 reviews today')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: vocabulary[0].translation }))

    expect(screen.getByText('Correct')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('rsr_progress'))['1'].rating).toBe('good')
    expect(screen.getByText('1 of 2 reviews today')).toBeInTheDocument()
  })

  it('stops at the daily limit and lets the user increase it in settings', () => {
    saveDailyLimit(2)
    recordDailyReview(1)
    recordDailyReview(2)
    render(createElement(App, { vocabulary }))

    expect(screen.getByRole('heading', { name: 'Daily goal complete' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }))
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Daily review limit' }), {
      target: { value: '3' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save settings' }))

    expect(screen.getByRole('heading', { name: 'resilience' })).toBeInTheDocument()
    expect(screen.getByText('2 of 3 reviews today')).toBeInTheDocument()
  })

  it('shows an empty state when every word is scheduled for later', () => {
    const progress = Object.fromEntries(
      vocabulary.map((item) => [
        item.id,
        {
          itemId: item.id,
          repetition: 1,
          ease: 2.6,
          interval: 1,
          lastReview: new Date().toISOString(),
          rating: 'good',
        },
      ]),
    )
    localStorage.setItem('rsr_progress', JSON.stringify(progress))

    render(createElement(App, { vocabulary }))

    expect(screen.getByRole('heading', { name: 'You’re all caught up' })).toBeInTheDocument()
    expect(screen.getByText(/No words are due for practice/)).toBeInTheDocument()
  })
})
