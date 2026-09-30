import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAppState } from '../lib/AppState.jsx'
import { DAYS, countStatus, distribute, sortDays } from '../lib/planner.js'

export default function PlanDays() {
  const { data, update } = useAppState()
  const navigate = useNavigate()
  const count = data.selectedDishIds.length
  const days = data.days
  const status = countStatus(count, days)

  if (count === 0) return <Navigate to="/gerichte" replace />

  const toggleDay = (id) => {
    const next = days.includes(id) ? days.filter((d) => d !== id) : sortDays([...days, id])
    update({ days: next, plan: {} })
  }

  const createPlan = () => {
    update({ plan: distribute(data.selectedDishIds, days) })
    navigate('/woche')
  }

  let hint = null
  if (status.state === 'noDays') hint = 'Wähle die Tage aus, für die du planen möchtest.'
  if (status.state === 'tooFew')
    hint = `Für ${days.length} Tage brauchst du ${days.length * 2} Gerichte. Dir ${status.missing === 1 ? 'fehlt 1 Gericht' : `fehlen ${status.missing} Gerichte`} – wähle ein Gericht dazu oder einen Tag weniger.`
  if (status.state === 'tooMany')
    hint = `Für ${days.length} Tage passen ${days.length * 2} Gerichte. Du hast ${status.over} ${status.over === 1 ? 'Gericht' : 'Gerichte'} zu viel gewählt – wähle ${status.over === 1 ? 'eins' : 'welche'} ab oder füge einen Tag hinzu.`

  return (
    <section className="card form-card">
      <h1>Für welche Tage?</h1>
      <p>
        Du hast {count} {count === 1 ? 'Gericht' : 'Gerichte'} gewählt – jeder Tag hat ein
        Mittag- und ein Abendessen. Wähle die Tage aus:
      </p>
      <div className="day-chips" role="group" aria-label="Wochentage">
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
        <Link className="btn" to="/gerichte">Gerichte ändern</Link>
        <button type="button" className="btn primary" onClick={createPlan} disabled={status.state !== 'ok'}>
          Wochenplan erstellen
        </button>
      </div>
    </section>
  )
}
