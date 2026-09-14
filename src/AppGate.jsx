import { useState } from 'react'
import App from './App'
import { Button } from './shared/components'
import AuthForm from './features/auth/AuthForm'
import { AuthProvider } from './features/auth/AuthProvider'
import { useAuth } from './features/auth/AuthContext'
import { useVocabulary } from './features/vocabulary/useVocabulary'
import './features/auth/auth.css'

function AuthenticatedApplication() {
  const { initializationError, loading, session, signOut } = useAuth()
  const vocabularyState = useVocabulary(session?.user?.id ?? session?.user?.email ?? null)
  const [signOutError, setSignOutError] = useState(null)
  const [signingOut, setSigningOut] = useState(false)

  if (loading) {
    return (
      <main className="auth-shell">
        <p className="auth-status" role="status">Loading your account…</p>
      </main>
    )
  }

  if (initializationError) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <h1>Unable to start RSR</h1>
          <p className="auth-error" role="alert">{initializationError}</p>
        </section>
      </main>
    )
  }

  if (!session) return <AuthForm />

  async function handleSignOut() {
    if (signingOut) return
    setSigningOut(true)
    setSignOutError(null)

    try {
      const { error } = await signOut()
      if (error) setSignOutError(error.message)
    } catch (error) {
      setSignOutError(error.message)
    } finally {
      setSigningOut(false)
    }
  }

  let content

  if (vocabularyState.loading) {
    content = (
      <main className="auth-shell">
        <p className="auth-status" role="status">Loading vocabulary…</p>
      </main>
    )
  } else if (vocabularyState.error) {
    content = (
      <main className="auth-shell">
        <section className="auth-card">
          <h1>Unable to load vocabulary</h1>
          <p className="auth-error" role="alert">We could not load your vocabulary. Please try again.</p>
          <Button onClick={vocabularyState.retry}>Try again</Button>
        </section>
      </main>
    )
  } else {
    content = <App vocabulary={vocabularyState.vocabulary} />
  }

  return (
    <div className="authenticated-shell">
      <aside className="account-bar" aria-label="Account">
        <span>{session.user.email}</span>
        <button type="button" disabled={signingOut} onClick={handleSignOut}>Sign out</button>
        {signOutError && <span className="account-error" role="alert">{signOutError}</span>}
      </aside>
      {content}
    </div>
  )
}

export default function AppGate() {
  return (
    <AuthProvider>
      <AuthenticatedApplication />
    </AuthProvider>
  )
}
