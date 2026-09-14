import { useState } from 'react'
import App from './App'
import AuthForm from './features/auth/AuthForm'
import { AuthProvider } from './features/auth/AuthProvider'
import { useAuth } from './features/auth/AuthContext'
import './features/auth/auth.css'

function AuthenticatedApplication() {
  const { initializationError, loading, session, signOut } = useAuth()
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

  return (
    <div className="authenticated-shell">
      <aside className="account-bar" aria-label="Account">
        <span>{session.user.email}</span>
        <button type="button" disabled={signingOut} onClick={handleSignOut}>Sign out</button>
        {signOutError && <span className="account-error" role="alert">{signOutError}</span>}
      </aside>
      <App />
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
