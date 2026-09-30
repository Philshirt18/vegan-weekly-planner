import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAppState } from '../lib/AppState.jsx'
import { isConfigured, signIn, signUp, authErrorMessage } from '../lib/firebase.js'

export default function Login() {
  const { user, members } = useAppState()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={members.length ? '/dishes' : '/profile'} replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'register') await signUp(email.trim(), password)
      else await signIn(email.trim(), password)
      navigate('/profile')
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (!isConfigured) {
    return (
      <section className="card">
        <h1>Firebase is not set up yet</h1>
        <p>
          Signing in needs a Firebase project. Put the access values into the file
          <code> .env.local</code> (template: <code>.env.example</code>) and restart the app.
        </p>
      </section>
    )
  }

  return (
    <section className="card form-card">
      <h1>{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
      <form onSubmit={submit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </label>
        {error && <p className="notice warn" role="alert">{error}</p>}
        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? 'One moment …' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>
      <p className="muted switch">
        {mode === 'login' ? 'No account yet?' : 'Already have an account?'}{' '}
        <button
          type="button"
          className="link-btn"
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
        >
          {mode === 'login' ? 'Create account' : 'Sign in'}
        </button>
      </p>
    </section>
  )
}
