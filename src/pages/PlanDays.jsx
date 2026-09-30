import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAppState } from '../lib/AppState.jsx'
import { DAYS, countStatus, distribute, sortDays } from '../lib/planner.js'

export default function PlanDays() {
  const { week, updateWeek } = useAppState()
  const navigate = useNavigate()
  const count = week.selectedDishIds.length
  const days = week.days
  const status = countStatus(count, days)

  if (count === 0) return <Navigate to="/dishes" replace />

  const toggleDay = (id) =>
    updateWeek((w) => ({
      days: w.days.includes(id) ? w.days.filter((d) => d !== id) : sortDays([...w.days, id]),
      plan: {},
    }))

  const createPlan = () => {
    updateWeek({ plan: distribute(week.selectedDishIds, days) })
    navigate('/week')
  }

  let hint = null
  if (status.state === 'noDays') hint = 'Choose the days you want to plan for.'
  if (status.state === 'tooFew')
    hint = `For ${days.length} ${days.length === 1 ? 'day' : 'days'} you need ${days.length * 2} dishes. You are missing ${status.missing} ${status.missing === 1 ? 'dish' : 'dishes'} – add a dish or plan one day fewer.`
  if (status.state === 'tooMany')
    hint = `${days.length} ${days.length === 1 ? 'day fits' : 'days fit'} ${days.length * 2} dishes. You chose ${status.over} too many – deselect ${status.over === 1 ? 'one' : 'some'} or add a day.`

  return (
    <section className="card form-card">
      <h1>For which days?</h1>
      <p>
        You chose {count} {count === 1 ? 'dish' : 'dishes'} – every day has one lunch and one dinner.
        Choose the days:
      </p>
      <div className="day-chips" role="group" aria-label="Days of the week">
        {DAYS.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`chip${days.includes(d.id) ? ' on' : ''}`}
            aria-pressed={days.includes(d.id)}
            onClick={() => toggleDay(d.id)}
          >
            {d.label}
          </button>
        ))}
      </div>
      {hint && <p className="notice warn" role="alert">{hint}</p>}
      <div className="row-actions">
        <Link className="btn" to="/dishes">Change dishes</Link>
        <button type="button" className="btn primary" onClick={createPlan} disabled={status.state !== 'ok'}>
          Create week plan
        </button>
      </div>
    </section>
  )
}
