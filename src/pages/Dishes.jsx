import { Link, useNavigate } from 'react-router-dom'
import { DISHES } from '../data/dishes.js'
import { useAppState } from '../lib/AppState.jsx'
import DishImage from '../components/DishImage.jsx'
import { ALL_DAY_IDS, MAX_DISHES, distribute } from '../lib/planner.js'

export default function Dishes() {
  const { selectedDishIds, toggleDish, updateWeek, weekWords } = useAppState()
  const navigate = useNavigate()
  const count = selectedDishIds.length

  const goToPlan = () => {
    if (count === MAX_DISHES) {
      // Exactly 14 dishes fill the whole week, so no days need to be chosen.
      updateWeek({ days: ALL_DAY_IDS, plan: distribute(selectedDishIds, ALL_DAY_IDS) })
      navigate('/week')
    } else {
      navigate('/week/days')
    }
  }

  return (
    <section>
      <div className="section-head">
        <h1>Dishes</h1>
        <p className="muted">
          {count} of {MAX_DISHES} dishes chosen for {weekWords}
        </p>
      </div>

      <div className="dish-grid">
        {DISHES.map((dish) => {
          const selected = selectedDishIds.includes(dish.id)
          return (
            <article key={dish.id} className={`dish-card${selected ? ' selected' : ''}`}>
              <Link to={`/dishes/${dish.id}`} className="dish-card-link">
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
                  {selected ? `✓ Eat ${weekWords}` : `Eat ${weekWords}`}
                </button>
                <Link className="btn small-btn" to={`/dishes/${dish.id}`}>
                  More details
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      <div className="actions">
        {count > MAX_DISHES && (
          <p className="notice warn" role="alert">
            A week has at most {MAX_DISHES} meals (lunch and dinner). Please deselect{' '}
            {count - MAX_DISHES} {count - MAX_DISHES === 1 ? 'dish' : 'dishes'}.
          </p>
        )}
        {count === 0 && (
          <p className="muted">Choose some dishes for {weekWords} first.</p>
        )}
        <button
          type="button"
          className="btn primary"
          onClick={goToPlan}
          disabled={count === 0 || count > MAX_DISHES}
        >
          Continue to the week plan
        </button>
      </div>

      <div className="actions">
        {/* Placeholder: in the demo this button has no function yet. */}
        <button type="button" className="btn ghost" title="Coming later">
          + Add another dish
        </button>
      </div>
    </section>
  )
}
