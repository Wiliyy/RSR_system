import { useState } from 'react'
import { Button } from '../../shared/components'
import { useAuth } from './AuthContext'

export default function AuthForm() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const isSignUp = mode === 'sign-up'

  function changeMode(nextMode) {
    setMode(nextMode)
    setError(null)
    setMessage(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setMessage(null)

    const action = isSignUp ? signUp : signIn

    try {
      const { data, error: authError } = await action({ email: email.trim(), password })

      if (authError) {
        setError(authError.message)
      } else if (isSignUp && !data?.session) {
        setMessage('Check your email to confirm your account.')
      }
    } catch (authError) {
      setError(authError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-brand" aria-hidden="true">R</div>
        <p className="eyebrow">RSR vocabulary</p>
        <h1 id="auth-title">{isSignUp ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-subtitle">
          {isSignUp
            ? 'Create one account to keep your learning progress synchronized.'
            : 'Sign in to continue your synchronized learning session.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength="8"
              required
            />
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-message" role="status">{message}</p>}

          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? 'Please wait…' : isSignUp ? 'Create my account' : 'Sign in'}
          </Button>
        </form>

        <div className="auth-switch">
          <span>{isSignUp ? 'Already have an account?' : 'New to RSR?'}</span>
          <button
            type="button"
            disabled={submitting}
            onClick={() => changeMode(isSignUp ? 'sign-in' : 'sign-up')}
          >
            {isSignUp ? 'Sign in instead' : 'Create account'}
          </button>
        </div>
      </section>
    </main>
  )
}
