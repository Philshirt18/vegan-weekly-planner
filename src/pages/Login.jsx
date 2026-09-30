import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAppState } from '../lib/AppState.jsx'
import { isConfigured, signIn, signUp, authErrorMessage } from '../lib/firebase.js'

export default function Login() {
  const { user, data } = useAppState()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' oder 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={data.members.length ? '/gerichte' : '/profil'} replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'register') await signUp(email.trim(), password)
      else await signIn(email.trim(), password)
      navigate('/profil')
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (!isConfigured) {
    return (
      <section className="card">
        <h1>Firebase ist noch nicht eingerichtet</h1>
        <p>
          Die Anmeldung braucht ein Firebase-Projekt. Trage die Zugangswerte in die Datei
          <code> .env.local</code> ein (Vorlage: <code>.env.example</code>) und starte die App neu.
        </p>
      </section>
    )
  }

  return (
    <section className="card form-card">
      <h1>{mode === 'login' ? 'Anmelden' : 'Konto erstellen'}</h1>
      <form onSubmit={submit}>
        <label>
          E-Mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label>
          Passwort
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
          {busy ? 'Einen Moment …' : mode === 'login' ? 'Anmelden' : 'Konto erstellen'}
        </button>
      </form>
      <p className="muted switch">
        {mode === 'login' ? 'Noch kein Konto?' : 'Schon ein Konto?'}{' '}
        <button
          type="button"
          className="link-btn"
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
        >
          {mode === 'login' ? 'Konto erstellen' : 'Anmelden'}
        </button>
      </p>
    </section>
  )
}
