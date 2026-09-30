import { Link, useParams } from 'react-router-dom'
import { getDish } from '../data/dishes.js'
import { useAppState } from '../lib/AppState.jsx'
import DishImage from '../components/DishImage.jsx'

export default function DishDetail() {
  const { id } = useParams()
  const dish = getDish(id)
  const { selectedDishIds, toggleDish } = useAppState()

  if (!dish) {
    return (
      <section className="card">
        <p>Dieses Gericht gibt es nicht.</p>
        <Link className="btn" to="/gerichte">Zurück zu den Gerichten</Link>
      </section>
    )
  }

  const selected = selectedDishIds.includes(dish.id)
  const { protein, calcium, iron, vitaminC } = dish.nutrients

  return (
    <article className="detail">
      <Link to="/gerichte" className="back">← Alle Gerichte</Link>
      <DishImage dish={dish} className="detail-image" />
      <h1>{dish.name}</h1>

      <button
        type="button"
        className={`btn ${selected ? 'selected' : 'primary'}`}
        onClick={() => toggleDish(dish.id)}
        aria-pressed={selected}
      >
        {selected ? '✓ Diese Woche essen' : 'Diese Woche essen'}
      </button>

      <h2>Nährstoffe <span className="muted small">(pro Portion, ungefähr)</span></h2>
      <ul className="nutrients">
        <li><strong>{protein} g</strong><span>Protein</span></li>
        <li><strong>{calcium} mg</strong><span>Kalzium</span></li>
        <li><strong>{iron} mg</strong><span>Eisen</span></li>
        <li><strong>{vitaminC} mg</strong><span>Vitamin C</span></li>
      </ul>
      {dish.calciumRich && <p className="tag">Kalziumreich</p>}
      {dish.ironRich && <p className="tag">Eisenreich, mit Vitamin C</p>}

      <h2>Zutaten <span className="muted small">(pro Erwachsenenportion)</span></h2>
      <ul className="ingredients">
        {dish.ingredients.map((i) => (
          <li key={i.name}>{i.amount} {i.unit} {i.name}</li>
        ))}
      </ul>

      <h2>Anleitung</h2>
      <ol className="steps">
        {dish.steps.map((s, idx) => (
          <li key={idx}>{s}</li>
        ))}
      </ol>
    </article>
  )
}
