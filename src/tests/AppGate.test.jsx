import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AppGate from '../AppGate'

const { auth } = vi.hoisted(() => ({
  auth: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  },
}))

vi.mock('../shared/lib/supabase', () => ({
  supabase: { auth },
}))

describe('AppGate authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    })
  })

  it('requires a signed-out visitor to sign in', async () => {
    render(<AppGate />)

    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Build your vocabulary' })).not.toBeInTheDocument()
  })

  it('does not let a stale getSession response overwrite a newer auth state', async () => {
    let resolveGetSession
    let handleAuthStateChange
    auth.getSession.mockReturnValue(new Promise((resolve) => {
      resolveGetSession = resolve
    }))
    auth.onAuthStateChange.mockImplementation((callback) => {
      handleAuthStateChange = callback
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    })
    render(<AppGate />)

    act(() => {
      handleAuthStateChange('SIGNED_IN', { user: { email: 'newer@example.com' } })
    })
    await act(async () => {
      resolveGetSession({ data: { session: null }, error: null })
    })

    expect(await screen.findByText('newer@example.com')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Welcome back' })).not.toBeInTheDocument()
  })

  it('keeps an initialization error after INITIAL_SESSION reports no session', async () => {
    let handleAuthStateChange
    auth.getSession.mockResolvedValue({
      data: { session: null },
      error: { message: 'Session storage failed' },
    })
    auth.onAuthStateChange.mockImplementation((callback) => {
      handleAuthStateChange = callback
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    })
    render(<AppGate />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Session storage failed')
    act(() => {
      handleAuthStateChange('INITIAL_SESSION', null)
    })

    expect(screen.getByRole('alert')).toHaveTextContent('Session storage failed')
    expect(screen.queryByRole('heading', { name: 'Welcome back' })).not.toBeInTheDocument()
  })

  it('clears an initialization error after a successful auth-state recovery', async () => {
    let handleAuthStateChange
    auth.getSession.mockResolvedValue({
      data: { session: null },
      error: { message: 'Session storage failed' },
    })
    auth.onAuthStateChange.mockImplementation((callback) => {
      handleAuthStateChange = callback
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    })
    render(<AppGate />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Session storage failed')
    act(() => {
      handleAuthStateChange('SIGNED_IN', { user: { email: 'recovered@example.com' } })
    })

    expect(await screen.findByText('recovered@example.com')).toBeInTheDocument()
    expect(screen.queryByText('Session storage failed')).not.toBeInTheDocument()
  })

  it('transitions from an authenticated session to the sign-in form', async () => {
    let handleAuthStateChange
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    auth.onAuthStateChange.mockImplementation((callback) => {
      handleAuthStateChange = callback
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    })
    render(<AppGate />)

    expect(await screen.findByText('learner@example.com')).toBeInTheDocument()
    act(() => {
      handleAuthStateChange('SIGNED_OUT', null)
    })

    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
    expect(screen.queryByText('learner@example.com')).not.toBeInTheDocument()
  })

  it('submits an email and password sign-in', async () => {
    auth.signInWithPassword.mockResolvedValue({ data: {}, error: null })
    render(<AppGate />)

    fireEvent.change(await screen.findByLabelText('Email'), {
      target: { value: 'learner@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'correct-horse-battery-staple' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'learner@example.com',
        password: 'correct-horse-battery-staple',
      })
    })
  })

  it('shows a rejected sign-in and restores the form controls', async () => {
    auth.signInWithPassword.mockRejectedValue(new Error('Sign-in request failed'))
    render(<AppGate />)

    fireEvent.change(await screen.findByLabelText('Email'), {
      target: { value: 'learner@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'correct-horse-battery-staple' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Sign-in request failed')
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Create account' })).toBeEnabled()
  })

  it('shows confirmation instructions after sign-up', async () => {
    auth.signUp.mockResolvedValue({ data: { session: null }, error: null })
    render(<AppGate />)

    fireEvent.click(await screen.findByRole('button', { name: 'Create account' }))
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'new@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'a-secure-password' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create my account' }))

    expect(await screen.findByText('Check your email to confirm your account.')).toBeInTheDocument()
  })

  it('shows a rejected sign-up and restores the submit button', async () => {
    auth.signUp.mockRejectedValue(new Error('Sign-up request failed'))
    render(<AppGate />)

    fireEvent.click(await screen.findByRole('button', { name: 'Create account' }))
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'new@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'a-secure-password' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create my account' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Sign-up request failed')
    expect(screen.getByRole('button', { name: 'Create my account' })).toBeEnabled()
  })

  it('prevents switching auth mode while a request is pending', async () => {
    auth.signInWithPassword.mockReturnValue(new Promise(() => {}))
    render(<AppGate />)

    fireEvent.change(await screen.findByLabelText('Email'), {
      target: { value: 'learner@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'correct-horse-battery-staple' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByRole('button', { name: 'Create account' })).toBeDisabled()
  })

  it('renders the learning app for a session and signs out', async () => {
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    auth.signOut.mockResolvedValue({ error: null })
    render(<AppGate />)

    expect(await screen.findByRole('heading', { name: 'Build your vocabulary' })).toBeInTheDocument()
    expect(screen.getByText('learner@example.com')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))

    await waitFor(() => expect(auth.signOut).toHaveBeenCalledOnce())
  })

  it('prevents concurrent sign-out requests', async () => {
    let resolveSignOut
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    auth.signOut.mockReturnValue(new Promise((resolve) => {
      resolveSignOut = resolve
    }))
    render(<AppGate />)

    const signOutButton = await screen.findByRole('button', { name: 'Sign out' })
    fireEvent.click(signOutButton)
    fireEvent.click(signOutButton)

    expect(auth.signOut).toHaveBeenCalledOnce()
    expect(signOutButton).toBeDisabled()

    await act(async () => {
      resolveSignOut({ error: null })
    })
  })

  it('shows a rejected sign-out and allows retrying', async () => {
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    auth.signOut.mockRejectedValue(new Error('Sign-out request failed'))
    render(<AppGate />)

    fireEvent.click(await screen.findByRole('button', { name: 'Sign out' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Sign-out request failed')
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeEnabled()
  })
})
