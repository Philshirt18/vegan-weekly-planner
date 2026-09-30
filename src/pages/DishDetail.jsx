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
  // Starting value of the portion picker: the family's portions (children up to 12 count half).
  const familyPortions = totalPortions(data.members) || 1
  const [portions, setPortions] = useState(familyPortions)

  if (!dish) {
    return (
      <section className="card">
        <p>This dish does not exist.</p>
        <Link className="btn" to="/dishes">Back to the dishes</Link>
      </section>
    )
  }

  const selected = selectedDishIds.includes(dish.id)
  const { protein, calcium, iron, vitaminC } = dish.nutrients

  return (
    <article className="detail">
      <Link to="/dishes" className="back">← All dishes</Link>
      <DishImage dish={dish} className="detail-image" />
      <h1>{dish.name}</h1>

      <button
        type="button"
        className={`btn ${selected ? 'selected' : 'primary'}`}
        onClick={() => toggleDish(dish.id)}
        aria-pressed={selected}
      >
        {selected ? '✓ Eat this week' : 'Eat this week'}
      </button>

      {dish.calciumRich && (
        <div className="focus-tag">
          <strong>High in calcium</strong>
          <span>Calcium is important for bones and teeth.</span>
        </div>
      )}
      {dish.ironRich && (
        <div className="focus-tag">
          <strong>High in iron, with vitamin C</strong>
          <span>Iron together with vitamin C is absorbed well.</span>
        </div>
      )}

      <h2>Nutrition <span className="muted small">(per adult portion, approximate)</span></h2>
      <ul className="nutrients">
        <li><strong>{protein} g</strong><span>Protein</span></li>
        <li className={dish.calciumRich ? 'highlight' : ''}><strong>{calcium} mg</strong><span>Calcium</span></li>
        <li className={dish.ironRich ? 'highlight' : ''}><strong>{iron} mg</strong><span>Iron</span></li>
        <li className={dish.ironRich ? 'highlight' : ''}><strong>{vitaminC} mg</strong><span>Vitamin C</span></li>
      </ul>

      <h2>Ingredients</h2>
      <div className="portion-picker">
        <span id="portion-label">Portions</span>
        <div className="stepper" role="group" aria-labelledby="portion-label">
          <button type="button" className="step-btn" aria-label="Half a portion less"
            onClick={() => setPortions((p) => Math.max(0.5, p - 0.5))} disabled={portions <= 0.5}>−</button>
          <strong aria-live="polite">{formatPortions(portions)}</strong>
          <button type="button" className="step-btn" aria-label="Half a portion more"
            onClick={() => setPortions((p) => Math.min(20, p + 0.5))} disabled={portions >= 20}>+</button>
        </div>
        {portions !== familyPortions && (
          <button type="button" className="link-btn" onClick={() => setPortions(familyPortions)}>
            Like my family ({formatPortions(familyPortions)})
          </button>
        )}
      </div>
      <p className="muted small">
        One portion equals one adult; a child up to 12 years counts as half.
      </p>
      <ul className="ingredients">
        {dish.ingredients.map((i) => (
          <li key={i.name}>{cookAmount(i, portions)} {i.name}</li>
        ))}
      </ul>

      <h2>Method</h2>
      <ol className="steps">
        {dish.steps.map((s, idx) => (
          <li key={idx}>{s}</li>
        ))}
      </ol>
    </article>
  )
}
