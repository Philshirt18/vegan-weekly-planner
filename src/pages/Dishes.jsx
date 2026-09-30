import { Link, useNavigate } from 'react-router-dom'
import { DISHES } from '../data/dishes.js'
import { useAppState } from '../lib/AppState.jsx'
import DishImage from '../components/DishImage.jsx'
import { ALL_DAY_IDS, MAX_DISHES, distribute } from '../lib/planner.js'

export default function Dishes() {
  const { selectedDishIds, toggleDish, update } = useAppState()
  const navigate = useNavigate()
  const count = selectedDishIds.length

  const goToPlan = () => {
    if (count === MAX_DISHES) {
      // Genau 14 Gerichte füllen die ganze Woche, dann müssen keine Tage gewählt werden.
      update({ days: ALL_DAY_IDS, plan: distribute(selectedDishIds, ALL_DAY_IDS) })
      navigate('/woche')
    } else {
      navigate('/woche/tage')
    }
  }

  return (
    <section>
      <div className="section-head">
        <h1>Gerichte</h1>
        <p className="muted">
          {count} von {MAX_DISHES} Gerichten für diese Woche gewählt
        </p>
      </div>

      <div className="dish-grid">
        {DISHES.map((dish) => {
          const selected = selectedDishIds.includes(dish.id)
          return (
            <article key={dish.id} className={`dish-card${selected ? ' selected' : ''}`}>
              <Link to={`/gerichte/${dish.id}`} className="dish-card-link">
                <DishImage dish={dish} />
                <span className="dish-name">{dish.name}</span>
              </Link>
              <div className="dish-card-actions">
                <button
                  type="button"
                  className={`btn small-btn ${selected ? 'selected' : 'primary'}`}
                  onClick={() => toggleDish(dish.id)}
                  aria-pressed={selected}
                >
                  {selected ? '✓ Diese Woche essen' : 'Diese Woche essen'}
                </button>
                <Link className="btn small-btn" to={`/gerichte/${dish.id}`}>
                  Mehr Details
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      <div className="actions">
        {count > MAX_DISHES && (
          <p className="notice warn" role="alert">
            Eine Woche hat höchstens {MAX_DISHES} Mahlzeiten (Mittag und Abend). Bitte wähle{' '}
            {count - MAX_DISHES} {count - MAX_DISHES === 1 ? 'Gericht' : 'Gerichte'} ab.
          </p>
        )}
        {count === 0 && (
          <p className="muted">Wähle zuerst Gerichte für diese Woche aus.</p>
        )}
        <button
          type="button"
          className="btn primary"
          onClick={goToPlan}
          disabled={count === 0 || count > MAX_DISHES}
        >
          Weiter zum Wochenplan
        </button>
      </div>

      <div className="actions">
        {/* Platzhalter: In der Demo hat dieser Button noch keine Funktion. */}
        <button type="button" className="btn ghost" title="Kommt später">
          + Weiteres Gericht hinzufügen
        </button>
      </div>
    </section>
  )
}
