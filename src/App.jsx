import { useMemo, useState } from 'react'
import './App.css'
import { Badge, Button } from './shared/components'
import { PopOptionsFromArray } from './shared/utils/Qustion'
import {
  getDailyLimit,
  getDailyPlan,
  recordDailyReview,
  saveDailyLimit,
} from './shared/utils/dailySession'
import { speakEnglishWord } from './shared/utils/pronunciation'
import { getProgress, isMemorized, updateStorage } from './shared/utils/progress'

function getOptions(item, vocabulary) {
  if (!item) return []
  const questionIndex = vocabulary.findIndex((entry) => entry.id === item.id)
  if (questionIndex < 0) return []
  return PopOptionsFromArray(vocabulary, questionIndex).map((index) => vocabulary[index])
}

function App({ vocabulary = [] }) {
  const [limit, setLimit] = useState(getDailyLimit)
  const [session, setSession] = useState(() => getDailyPlan(vocabulary, new Date(), limit))
  const [feedback, setFeedback] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)
  const [limitDraft, setLimitDraft] = useState(limit)
  const [audioError, setAudioError] = useState(false)

  const currentWord = session.items[0] ?? null
  const options = useMemo(
    () => getOptions(currentWord, vocabulary),
    [currentWord, vocabulary],
  )
  const progressPercent = Math.min(100, (session.reviewedToday / limit) * 100)

  function handleAnswer(selectedItem) {
    if (!currentWord || feedback) return

    const correct = selectedItem.id === currentWord.id
    updateStorage(currentWord.id, correct ? 'good' : 'weak')
    const activity = recordDailyReview(currentWord.id)

    setSession((previous) => ({
      ...previous,
      reviewedToday: activity.itemIds.length,
      limitReached: activity.itemIds.length >= limit,
    }))
    setFeedback({ correct, selectedId: selectedItem.id })
  }

  function showNextWord() {
    setSession((previous) => ({ ...previous, items: previous.items.slice(1) }))
    setFeedback(null)
    setAudioError(false)
  }

  function handlePronunciation() {
    setAudioError(!speakEnglishWord(currentWord?.word))
  }

  function handleSaveSettings(event) {
    event.preventDefault()
    const nextLimit = saveDailyLimit(limitDraft)
    setLimit(nextLimit)
    setLimitDraft(nextLimit)
    setSession(getDailyPlan(vocabulary, new Date(), nextLimit))
    setFeedback(null)
    setAudioError(false)
    setShowSettings(false)
  }

  function renderEmptyState() {
    if (!session.hasVocabulary) {
      return (
        <section className="empty-state">
          <div className="empty-icon">＋</div>
          <h2>No vocabulary available</h2>
          <p>No words are available yet. Please try again later.</p>
        </section>
      )
    }

    if (session.reviewedToday >= limit) {
      return (
        <section className="empty-state">
          <div className="empty-icon success-icon">✓</div>
          <h2>Daily goal complete</h2>
          <p>You finished {session.reviewedToday} reviews today. Come back tomorrow or raise your limit in settings.</p>
          {session.deferredCount > 0 && <Badge variant="accent">{session.deferredCount} waiting</Badge>}
        </section>
      )
    }

    return (
      <section className="empty-state">
        <div className="empty-icon success-icon">✓</div>
        <h2>You’re all caught up</h2>
        <p>No words are due for practice right now. Your next reviews will appear automatically.</p>
      </section>
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">R</span>
          <div>
            <strong>RSR</strong>
            <span>Remember smarter</span>
          </div>
        </div>
        <nav className="header-actions" aria-label="App controls">
          <button type="button" className="icon-button" aria-label="Open word library" onClick={() => setShowLibrary((value) => !value)}>
            Aa
          </button>
          <button type="button" className="icon-button" aria-label="Open settings" onClick={() => setShowSettings((value) => !value)}>
            ⚙
          </button>
        </nav>
      </header>

      <section className="dashboard">
        <div className="intro-row">
          <div>
            <p className="eyebrow">Daily practice</p>
            <h1>Build your vocabulary</h1>
            <p className="subtitle">Review what is due, then let spaced repetition schedule the rest.</p>
          </div>
          <div className="goal-card">
            <span>{session.reviewedToday} of {limit} reviews today</span>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {showSettings && (
          <form className="panel settings-panel" onSubmit={handleSaveSettings}>
            <div>
              <p className="eyebrow">Settings</p>
              <h2>Daily review goal</h2>
              <p>Choose how many due words you want to practice each day.</p>
            </div>
            <label>
              <span>Daily review limit</span>
              <input
                type="number"
                min="1"
                max="100"
                value={limitDraft}
                onChange={(event) => setLimitDraft(event.target.value)}
                aria-label="Daily review limit"
              />
            </label>
            <div className="settings-actions">
              <Button variant="ghost" onClick={() => setShowSettings(false)}>Cancel</Button>
              <Button type="submit">Save settings</Button>
            </div>
          </form>
        )}

        {showLibrary && (
          <section className="panel library-panel">
            <div className="library-heading">
              <div>
                <p className="eyebrow">Word library</p>
                <h2>{vocabulary.length} words available</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowLibrary(false)}>Close</Button>
            </div>
            <div className="word-list">
              {vocabulary.map((item) => {
                const progress = getProgress(item.id)
                return (
                  <article className="word-row" key={item.id}>
                    <div>
                      <strong>{item.word}</strong>
                      <span dir="rtl">{item.translation}</span>
                    </div>
                    <Badge variant={isMemorized(progress) ? 'success' : progress ? 'accent' : 'default'}>
                      {isMemorized(progress) ? 'Memorized' : progress ? 'Learning' : 'New'}
                    </Badge>
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {!showLibrary && (currentWord ? (
          <section className="practice-card" aria-label="Daily word">
            <div className="question-copy">
              <Badge variant="accent">{currentWord.level}</Badge>
              <p className="question-label">Choose the Arabic translation</p>
              <div className="pronunciation-row">
                <h2>{currentWord.word}</h2>
                <button
                  type="button"
                  className="pronunciation-button"
                  aria-label={`Listen to ${currentWord.word}`}
                  title="Listen and repeat"
                  onClick={handlePronunciation}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11 5 6.8 8.5H3.5v7h3.3L11 19V5Zm4.2 3.1a5.5 5.5 0 0 1 0 7.8M18 5.5a9.2 9.2 0 0 1 0 13" />
                  </svg>
                </button>
              </div>
              <span className="listen-hint">Listen and repeat</span>
              <p>{currentWord.meaning}</p>
              {audioError && <p className="audio-error" role="status">Audio pronunciation is not supported by this browser.</p>}
            </div>

            <div className="options-grid">
              {options.map((option) => {
                const isCorrect = feedback && option.id === currentWord.id
                const isWrong = feedback && option.id === feedback.selectedId && !feedback.correct
                const classNames = ['answer-option', isCorrect ? 'correct' : '', isWrong ? 'wrong' : ''].filter(Boolean).join(' ')

                return (
                  <button
                    type="button"
                    className={classNames}
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    disabled={Boolean(feedback)}
                  >
                    {option.translation}
                  </button>
                )
              })}
            </div>

            {feedback && (
              <div className={`feedback ${feedback.correct ? 'feedback-correct' : 'feedback-wrong'}`} role="status">
                <div>
                  <strong>{feedback.correct ? 'Correct' : 'Keep learning'}</strong>
                  <span>{feedback.correct ? currentWord.example : `Correct answer: ${currentWord.translation}`}</span>
                </div>
                <Button onClick={showNextWord}>Next word</Button>
              </div>
            )}

            {!feedback && session.deferredCount > 0 && (
              <p className="queue-note">Your daily goal keeps this session focused. {session.deferredCount} more due words are saved for later.</p>
            )}
          </section>
        ) : renderEmptyState())}
      </section>
    </main>
  )
}

export default App