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
          <span className="brand-leaf" aria-hidden="true">🌿</span> Vegan Weekly Planner
        </Link>
        {user && (
          <nav className="nav">
            <Link to="/profile">Family</Link>
            <Link to="/dishes">Dishes</Link>
            <Link to="/week">Week plan</Link>
            <Link to="/shopping">Shopping</Link>
            <button type="button" className="link-btn" onClick={logout}>Sign out</button>
          </nav>
        )}
      </header>
      <main className="content">
        {saveError && <p className="notice warn" role="alert">{saveError}</p>}
        {children}
      </main>
      <footer className="footer">
        All nutrition values are guidelines for orientation – not medical advice.
      </footer>
    </div>
  )
}
