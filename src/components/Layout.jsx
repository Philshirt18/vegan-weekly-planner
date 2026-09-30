import { Link } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-leaf" aria-hidden="true">🌿</span> Veganer Wochenplaner
        </Link>
      </header>
      <main className="content">{children}</main>
      <footer className="footer">
        Alle Nährwerte sind Richtwerte und eine Orientierung – keine medizinische Beratung.
      </footer>
    </div>
  )
}
