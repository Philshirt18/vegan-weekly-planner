import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAppState } from '../lib/AppState.jsx'
import { getDish } from '../data/dishes.js'
import { MEALS, MEAL_LABEL, calciumWarnings, dayLabel, sortDays } from '../lib/planner.js'

function DishCell({ dishId }) {
  const dish = getDish(dishId)
  if (!dish) return <span className="muted">–</span>
  return (
    <Link to={`/gerichte/${dish.id}`} className="plan-dish">
      {dish.name}
      {dish.calciumRich && <span className="mini-tag">Kalzium</span>}
      {dish.ironRich && <span className="mini-tag">Eisen</span>}
    </Link>
  )
}

export default function WeekPlan() {
  const { data } = useAppState()
  const [dismissed, setDismissed] = useState([])
  const plan = data.plan

  if (!plan || Object.keys(plan).length === 0) return <Navigate to="/gerichte" replace />

  const days = sortDays(Object.keys(plan))
  const warned = calciumWarnings(plan).filter((d) => !dismissed.includes(d))

  return (
    <section>
      <div className="section-head">
        <h1>Dein Wochenplan</h1>
        <p className="muted">Tippe auf ein Gericht, um Details und das Rezept zu sehen.</p>
      </div>

      <div className="plan">
        {days.map((day) => (
          <div key={day} className="card plan-day">
            <h2>{dayLabel(day)}</h2>
            {MEALS.map((meal) => (
              <div key={meal} className="plan-slot">
                <span className="slot-label">{MEAL_LABEL[meal]}</span>
                <DishCell dishId={plan[day][meal]} />
              </div>
            ))}
            {warned.includes(day) && (
              <div className="notice warn" role="alert">
                <p>
                  Mittag- und Abendessen sind an diesem Tag beide kalziumreich. Viel Kalzium in
                  einer Mahlzeit kann die Eisenaufnahme hemmen – vielleicht tauschst du eines gegen
                  ein eisenreiches Gericht.
                </p>
                <button type="button" className="btn small-btn" onClick={() => setDismissed([...dismissed, day])}>
                  Trotzdem so lassen
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="actions">
        <Link className="btn" to="/gerichte">Gerichte ändern</Link>{' '}
        <button type="button" className="btn primary" disabled title="Kommt im nächsten Schritt">
          Fertig
        </button>
      </div>
    </section>
  )
}
