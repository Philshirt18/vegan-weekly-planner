import { Link } from 'react-router-dom'
import { DISHES } from '../data/dishes.js'
import { useAppState } from '../lib/AppState.jsx'
import DishImage from '../components/DishImage.jsx'

export default function Dishes() {
  const { selectedDishIds, toggleDish } = useAppState()

  return (
    <section>
      <div className="section-head">
        <h1>Gerichte</h1>
        <p className="muted">
          {selectedDishIds.length} von 14 Gerichten für diese Woche gewählt
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
        {/* Platzhalter: In der Demo hat dieser Button noch keine Funktion. */}
        <button type="button" className="btn ghost" title="Kommt später">
          + Weiteres Gericht hinzufügen
        </button>
      </div>
    </section>
  )
}
