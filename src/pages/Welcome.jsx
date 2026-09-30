import { Link } from 'react-router-dom'
import { useAppState } from '../lib/AppState.jsx'

export default function Welcome() {
  const { user } = useAppState()

  return (
    <section className="card welcome">
      <h1>Willkommen!</h1>
      <p>
        Dieser Wochenplaner ist für vegane Familien gemacht. Du wählst Gerichte aus, die alle
        schon nährstoffmäßig abgestimmt sind, und die App verteilt sie auf deine Woche –
        mit Hinweis, wenn zwei kalziumreiche Gerichte am selben Tag landen.
      </p>
      <p>Am Ende bekommst du eine Einkaufsliste, umgerechnet auf deine Familie.</p>
      <Link className="btn primary" to={user ? '/gerichte' : '/login'}>Los geht's</Link>
    </section>
  )
}
