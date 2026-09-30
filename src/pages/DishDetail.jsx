import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDish } from '../data/dishes.js'
import { useAppState } from '../lib/AppState.jsx'
import DishImage from '../components/DishImage.jsx'
import { totalPortions } from '../lib/nutrition.js'
import { cookAmount, formatPortions } from '../lib/recipe.js'

export default function DishDetail() {
  const { id } = useParams()
  const dish = getDish(id)
  const { data, selectedDishIds, toggleDish } = useAppState()
  // Startwert der Portionswahl: die Portionen der Familie (Kinder bis 12 Jahre zählen halb).
  const familyPortions = totalPortions(data.members) || 1
  const [portions, setPortions] = useState(familyPortions)

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

      {dish.calciumRich && (
        <div className="focus-tag">
          <strong>Kalziumreich</strong>
          <span>Kalzium ist wichtig für Knochen und Zähne.</span>
        </div>
      )}
      {dish.ironRich && (
        <div className="focus-tag">
          <strong>Eisenreich, mit Vitamin C</strong>
          <span>Eisen zusammen mit Vitamin C lässt sich gut aufnehmen.</span>
        </div>
      )}

      <h2>Nährstoffe <span className="muted small">(pro Erwachsenenportion, ungefähr)</span></h2>
      <ul className="nutrients">
        <li><strong>{protein} g</strong><span>Protein</span></li>
        <li className={dish.calciumRich ? 'highlight' : ''}><strong>{calcium} mg</strong><span>Kalzium</span></li>
        <li className={dish.ironRich ? 'highlight' : ''}><strong>{iron} mg</strong><span>Eisen</span></li>
        <li className={dish.ironRich ? 'highlight' : ''}><strong>{vitaminC} mg</strong><span>Vitamin C</span></li>
      </ul>

      <h2>Zutaten</h2>
      <div className="portion-picker">
        <span id="portion-label">Portionen</span>
        <div className="stepper" role="group" aria-labelledby="portion-label">
          <button type="button" className="step-btn" aria-label="Eine halbe Portion weniger"
            onClick={() => setPortions((p) => Math.max(0.5, p - 0.5))} disabled={portions <= 0.5}>−</button>
          <strong aria-live="polite">{formatPortions(portions)}</strong>
          <button type="button" className="step-btn" aria-label="Eine halbe Portion mehr"
            onClick={() => setPortions((p) => Math.min(20, p + 0.5))} disabled={portions >= 20}>+</button>
        </div>
        {portions !== familyPortions && (
          <button type="button" className="link-btn" onClick={() => setPortions(familyPortions)}>
            Wie meine Familie ({formatPortions(familyPortions)})
          </button>
        )}
      </div>
      <p className="muted small">
        Eine Portion entspricht einer erwachsenen Person, ein Kind bis 12 Jahre zählt halb.
      </p>
      <ul className="ingredients">
        {dish.ingredients.map((i) => (
          <li key={i.name}>{cookAmount(i, portions)} {i.name}</li>
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
