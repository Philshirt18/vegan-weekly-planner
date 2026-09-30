import { Link, useNavigate } from 'react-router-dom'
import { useAppState } from '../lib/AppState.jsx'
import { signOutUser } from '../lib/firebase.js'

export default function Layout({ children }) {
  const { user, saveError } = useAppState()
  const navigate = useNavigate()

  const logout = async () => {
    await signOutUser()
    navigate('/')
  }

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-leaf" aria-hidden="true">🌿</span> Veganer Wochenplaner
        </Link>
        {user && (
          <nav className="nav">
            <Link to="/profil">Familie</Link>
            <Link to="/gerichte">Gerichte</Link>
            <Link to="/woche">Wochenplan</Link>
            <button type="button" className="link-btn" onClick={logout}>Abmelden</button>
          </nav>
        )}
      </header>
      <main className="content">
        {saveError && <p className="notice warn" role="alert">{saveError}</p>}
        {children}
      </main>
      <footer className="footer">
        Alle Nährwerte sind Richtwerte und eine Orientierung – keine medizinische Beratung.
      </footer>
    </div>
  )
}
