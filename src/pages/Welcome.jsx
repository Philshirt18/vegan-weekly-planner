import { Link } from 'react-router-dom'
import { useAppState } from '../lib/AppState.jsx'

export default function Welcome() {
  const { user } = useAppState()

  return (
    <section className="card welcome">
      <h1>Welcome!</h1>
      <p>
        This weekly planner is made for vegan families. You pick dishes that are already balanced
        for nutrients, and the app spreads them over your week – with a note about iron absorption
        when two calcium-rich dishes land on the same day.
      </p>
      <p>At the end you get a shopping list, scaled to your family.</p>
      <Link className="btn primary" to={user ? '/dishes' : '/login'}>Let's go</Link>
    </section>
  )
}
