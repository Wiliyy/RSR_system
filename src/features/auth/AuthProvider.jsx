import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../shared/lib/supabase'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initializationError, setInitializationError] = useState(null)

  useEffect(() => {
    let active = true
    let receivedAuthState = false

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active || receivedAuthState) return
      if (error) setInitializationError(error.message)
      setSession(data?.session ?? null)
      setLoading(false)
    }).catch((error) => {
      if (!active || receivedAuthState) return
      setInitializationError(error.message)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return
      receivedAuthState = true
      setSession(nextSession)
      if (event !== 'INITIAL_SESSION' || nextSession) setInitializationError(null)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({
    session,
    loading,
    initializationError,
    signIn: (credentials) => supabase.auth.signInWithPassword(credentials),
    signUp: (credentials) => supabase.auth.signUp(credentials),
    signOut: () => supabase.auth.signOut(),
  }), [initializationError, loading, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
