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

      <h2>How it works</h2>
      <ol className="how-it-works">
        <li>
          <strong>Add your family</strong>
          <span>Enter age, sex and weight so the app knows your guideline values.</span>
        </li>
        <li>
          <strong>Choose dishes</strong>
          <span>
            Pick up to 14 of the 17 vegan dishes. Each one is already balanced for protein, iron
            and calcium.
          </span>
        </li>
        <li>
          <strong>Get your week plan</strong>
          <span>
            The app spreads the dishes over lunch and dinner and lets you know about iron
            absorption. Drag dishes to swap them.
          </span>
        </li>
        <li>
          <strong>Shop smart</strong>
          <span>
            Get a shopping list scaled to your family, tick off what you have, and plan next week
            with the week switcher.
          </span>
        </li>
      </ol>

      <Link className="btn primary" to={user ? '/dishes' : '/login'}>Let's go</Link>
    </section>
  )
}
