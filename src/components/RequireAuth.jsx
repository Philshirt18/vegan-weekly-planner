import { Navigate } from 'react-router-dom'
import { useAppState } from '../lib/AppState.jsx'

// Protects pages that need a sign-in.
export default function RequireAuth({ children }) {
  const { user, loadError } = useAppState()
  if (user === undefined) return <p className="muted">One moment …</p>
  if (!user) return <Navigate to="/login" replace />
  return (
    <>
      {loadError && <p className="notice warn" role="alert">{loadError}</p>}
      {children}
    </>
  )
}
