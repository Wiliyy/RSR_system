import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AppGate from '../AppGate'
import vocabulary from '../data/vocabulary.json'

const { auth, from, order } = vi.hoisted(() => {
  const order = vi.fn()
  const select = vi.fn(() => ({ order }))
  const from = vi.fn(() => ({ select }))
  return {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from,
    order,
    select,
  }
})

vi.mock('../shared/lib/supabase', () => ({
  supabase: { auth, from },
}))

describe('AppGate authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    })
    order.mockResolvedValue({ data: vocabulary, error: null })
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

  it('loads the authenticated vocabulary from Supabase', async () => {
    const remoteVocabulary = vocabulary.slice(0, 4).map((item, index) => (
      index === 0 ? { ...item, word: 'database-word' } : item
    ))
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    order.mockResolvedValue({ data: remoteVocabulary, error: null })

    render(<AppGate />)

    expect(await screen.findByRole('heading', { name: 'database-word' })).toBeInTheDocument()
    expect(from).toHaveBeenCalledWith('vocabulary')
    expect(order).toHaveBeenCalledWith('id', { ascending: true })
  })

  it('ignores a stale vocabulary response after the account changes', async () => {
    let handleAuthStateChange
    let resolveVocabularyA
    let resolveVocabularyB
    const vocabularyA = vocabulary.slice(0, 4).map((item, index) => (
      index === 0 ? { ...item, word: 'account-a-word' } : item
    ))
    const vocabularyB = vocabulary.slice(0, 4).map((item, index) => (
      index === 0 ? { ...item, word: 'account-b-word' } : item
    ))
    auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'account-a', email: 'a@example.com' } } },
      error: null,
    })
    auth.onAuthStateChange.mockImplementation((callback) => {
      handleAuthStateChange = callback
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    })
    order
      .mockReturnValueOnce(new Promise((resolve) => {
        resolveVocabularyA = resolve
      }))
      .mockReturnValueOnce(new Promise((resolve) => {
        resolveVocabularyB = resolve
      }))

    render(<AppGate />)
    expect(await screen.findByText('a@example.com')).toBeInTheDocument()

    act(() => {
      handleAuthStateChange('SIGNED_IN', { user: { id: 'account-b', email: 'b@example.com' } })
    })
    expect(await screen.findByText('b@example.com')).toBeInTheDocument()
    await act(async () => {
      resolveVocabularyB({ data: vocabularyB, error: null })
    })
    expect(await screen.findByRole('heading', { name: 'account-b-word' })).toBeInTheDocument()

    await act(async () => {
      resolveVocabularyA({ data: vocabularyA, error: null })
    })
    expect(screen.queryByRole('heading', { name: 'account-a-word' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'account-b-word' })).toBeInTheDocument()
  })

  it('shows a loading state while the Supabase request is pending', async () => {
    let resolveVocabulary
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    order.mockReturnValue(new Promise((resolve) => {
      resolveVocabulary = resolve
    }))

    render(<AppGate />)

    expect(await screen.findByText('learner@example.com')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Loading vocabulary')
    await act(async () => {
      resolveVocabulary({ data: vocabulary, error: null })
    })
    expect(await screen.findByRole('heading', { name: 'Build your vocabulary' })).toBeInTheDocument()
  })

  it('keeps sign-out available and guarded while vocabulary is loading', async () => {
    let resolveSignOut
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    order.mockReturnValue(new Promise(() => {}))
    auth.signOut.mockReturnValue(new Promise((resolve) => {
      resolveSignOut = resolve
    }))

    render(<AppGate />)

    expect(await screen.findByText('learner@example.com')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Loading vocabulary')
    const signOutButton = screen.getByRole('button', { name: 'Sign out' })
    fireEvent.click(signOutButton)
    fireEvent.click(signOutButton)

    expect(auth.signOut).toHaveBeenCalledOnce()
    expect(signOutButton).toBeDisabled()

    await act(async () => {
      resolveSignOut({ error: null })
    })
  })

  it('hides Supabase error details and retries the request', async () => {
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    order
      .mockResolvedValueOnce({ data: null, error: { message: 'relation public.vocabulary does not exist' } })
      .mockResolvedValueOnce({ data: vocabulary, error: null })

    render(<AppGate />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('We could not load your vocabulary. Please try again.')
    expect(alert).not.toHaveTextContent('public.vocabulary')
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('heading', { name: 'Build your vocabulary' })).toBeInTheDocument()
    expect(order).toHaveBeenCalledTimes(2)
  })

  it('ignores a retry response made stale by an account change', async () => {
    let handleAuthStateChange
    let resolveRetry
    let resolveAccountB
    const retryVocabulary = vocabulary.slice(0, 4).map((item, index) => (
      index === 0 ? { ...item, word: 'stale-retry-word' } : item
    ))
    const accountBVocabulary = vocabulary.slice(0, 4).map((item, index) => (
      index === 0 ? { ...item, word: 'current-account-word' } : item
    ))
    auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'account-a', email: 'a@example.com' } } },
      error: null,
    })
    auth.onAuthStateChange.mockImplementation((callback) => {
      handleAuthStateChange = callback
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    })
    order
      .mockResolvedValueOnce({ data: null, error: { message: 'Temporary failure' } })
      .mockReturnValueOnce(new Promise((resolve) => {
        resolveRetry = resolve
      }))
      .mockReturnValueOnce(new Promise((resolve) => {
        resolveAccountB = resolve
      }))

    render(<AppGate />)
    fireEvent.click(await screen.findByRole('button', { name: 'Try again' }))
    await waitFor(() => expect(order).toHaveBeenCalledTimes(2))

    act(() => {
      handleAuthStateChange('SIGNED_IN', { user: { id: 'account-b', email: 'b@example.com' } })
    })
    await waitFor(() => expect(order).toHaveBeenCalledTimes(3))
    await act(async () => {
      resolveAccountB({ data: accountBVocabulary, error: null })
    })
    expect(await screen.findByRole('heading', { name: 'current-account-word' })).toBeInTheDocument()

    await act(async () => {
      resolveRetry({ data: retryVocabulary, error: null })
    })
    expect(screen.queryByRole('heading', { name: 'stale-retry-word' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'current-account-word' })).toBeInTheDocument()
  })

  it('keeps sign-out failure handling available when vocabulary loading fails', async () => {
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    order.mockResolvedValue({ data: null, error: { message: 'Database unavailable' } })
    auth.signOut.mockRejectedValue(new Error('Sign-out request failed'))

    render(<AppGate />)

    expect(await screen.findByRole('heading', { name: 'Unable to load vocabulary' })).toBeInTheDocument()
    expect(screen.getByText('learner@example.com')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))

    expect(await screen.findByText('Sign-out request failed')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeEnabled()
  })

  it('rejects a non-array vocabulary payload', async () => {
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    order.mockResolvedValue({ data: { id: 1 }, error: null })

    render(<AppGate />)

    expect(await screen.findByRole('heading', { name: 'Unable to load vocabulary' })).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it.each([
    ['row object', null],
    ['id', { ...vocabulary[0], id: '1' }],
    ['non-positive id', { ...vocabulary[0], id: 0 }],
    ['unsafe id', { ...vocabulary[0], id: Number.MAX_SAFE_INTEGER + 1 }],
    ['blank word', { ...vocabulary[0], word: '   ' }],
    ['word', { ...vocabulary[0], word: null }],
    ['lang', { ...vocabulary[0], lang: 'fr' }],
    ['translation', { ...vocabulary[0], translation: '   ' }],
    ['meaning', { ...vocabulary[0], meaning: '' }],
    ['example', { ...vocabulary[0], example: '\n' }],
    ['level', { ...vocabulary[0], level: 'expert' }],
    ['tags array', { ...vocabulary[0], tags: 'learning,word' }],
    ['tags cardinality', { ...vocabulary[0], tags: ['learning'] }],
    ['blank tag', { ...vocabulary[0], tags: ['learning', '   '] }],
    ['tag type', { ...vocabulary[0], tags: ['learning', 2] }],
  ])('rejects a vocabulary row with an invalid %s', async (_field, malformedRow) => {
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    order.mockResolvedValue({ data: [malformedRow], error: null })

    render(<AppGate />)

    expect(await screen.findByRole('heading', { name: 'Unable to load vocabulary' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Build your vocabulary' })).not.toBeInTheDocument()
  })

  it('rejects duplicate vocabulary ids', async () => {
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    order.mockResolvedValue({
      data: [vocabulary[0], { ...vocabulary[1], id: vocabulary[0].id }],
      error: null,
    })

    render(<AppGate />)

    expect(await screen.findByRole('heading', { name: 'Unable to load vocabulary' })).toBeInTheDocument()
  })

  it('rejects a resolved query result without an explicit error state', async () => {
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    order.mockResolvedValue({ data: vocabulary })

    render(<AppGate />)

    expect(await screen.findByRole('heading', { name: 'Unable to load vocabulary' })).toBeInTheDocument()
  })

  it.each([
    ['missing message', {}],
    ['empty message', { message: '' }],
    ['blank message', { message: '   ' }],
  ])('normalizes a Supabase error object with a %s', async (_kind, error) => {
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    order.mockResolvedValue({ data: null, error })

    render(<AppGate />)

    expect(await screen.findByRole('heading', { name: 'Unable to load vocabulary' })).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('We could not load your vocabulary.')
  })

  it.each([
    ['null', null],
    ['string', 'network failed'],
    ['object without a message', {}],
  ])('normalizes a %s vocabulary rejection into a completed failure', async (_kind, rejection) => {
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    order.mockRejectedValue(rejection)

    render(<AppGate />)

    expect(await screen.findByRole('heading', { name: 'Unable to load vocabulary' })).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows a database-neutral empty state when Supabase has no vocabulary', async () => {
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'learner@example.com' } } },
      error: null,
    })
    order.mockResolvedValue({ data: [], error: null })

    render(<AppGate />)

    expect(await screen.findByRole('heading', { name: 'No vocabulary available' })).toBeInTheDocument()
    expect(screen.getByText('No words are available yet. Please try again later.')).toBeInTheDocument()
    expect(screen.queryByText(/vocabulary\.json/)).not.toBeInTheDocument()
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
