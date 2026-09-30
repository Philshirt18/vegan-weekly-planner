import { Link } from 'react-router-dom'

export default function Welcome() {
  return (
    <section className="card welcome">
      <h1>Willkommen!</h1>
      <p>
        Dieser Wochenplaner ist für vegane Familien gemacht. Du wählst Gerichte aus, die alle
        schon nährstoffmäßig abgestimmt sind, und die App verteilt sie auf deine Woche –
        mit Hinweis, wenn zwei kalziumreiche Gerichte am selben Tag landen.
      </p>
      <p>Am Ende bekommst du eine Einkaufsliste, umgerechnet auf deine Familie.</p>
      <Link className="btn primary" to="/gerichte">Los geht's</Link>
    </section>
  )
}
