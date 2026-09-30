import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAppState } from '../lib/AppState.jsx'
import { buildShoppingList, withoutChecked } from '../lib/shopping.js'

export default function Shopping() {
  const { data, update } = useAppState()
  const [stage, setStage] = useState('preview') // 'preview' = tick off what you have, 'final' = finished list

  if (!data.plan || Object.keys(data.plan).length === 0) return <Navigate to="/dishes" replace />

  const groups = buildShoppingList(data.plan, data.members)
  const checked = data.checkedIngredients
  const bought = data.boughtIngredients
  const toggleList = (field, list) => (key) =>
    update({ [field]: list.includes(key) ? list.filter((k) => k !== key) : [...list, key] })
  const toggle = toggleList('checkedIngredients', checked) // preview: already at home
  const toggleBought = toggleList('boughtIngredients', bought) // final list: in the cart

  if (stage === 'final') {
    const missing = withoutChecked(groups, checked)
    const total = missing.reduce((n, g) => n + g.items.length, 0)
    const inCart = missing.reduce((n, g) => n + g.items.filter((i) => bought.includes(i.key)).length, 0)
    return (
      <section>
        <div className="section-head">
          <h1>Your shopping list</h1>
          <p className="muted">
            This is what you still need for this week. Tick items off as you put them in your cart.
            {total > 0 && ` ${inCart} of ${total} done.`}
          </p>
        </div>

        {missing.length === 0 ? (
          <p className="card">You already have everything at home – nothing to buy. 🎉</p>
        ) : (
          <div className="shop-groups">
            {missing.map((g) => (
              <div key={g.category} className="card">
                <h2>{g.category}</h2>
                <ul className="shop-list">
                  {g.items.map((i) => (
                    <li key={i.key}>
                      <label className="check">
                        <input type="checkbox" checked={bought.includes(i.key)} onChange={() => toggleBought(i.key)} />
                        <span className="check-name">{i.name}</span>
                        <strong>{i.label}</strong>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="actions">
          <button type="button" className="btn" onClick={() => setStage('preview')}>Back to the preview</button>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="section-head">
        <h1>Shopping list preview</h1>
        <p className="muted">
          All ingredients for your week plan, scaled to your family. Tick off what you already
          have at home.
        </p>
      </div>

      <div className="shop-groups">
        {groups.map((g) => (
          <div key={g.category} className="card">
            <h2>{g.category}</h2>
            <ul className="shop-list">
              {g.items.map((i) => (
                <li key={i.key}>
                  <label className="check">
                    <input type="checkbox" checked={checked.includes(i.key)} onChange={() => toggle(i.key)} />
                    <span className="check-name">{i.name}</span>
                    <strong>{i.label}</strong>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="actions">
        <Link className="btn" to="/week">Back to the week plan</Link>{' '}
        <button type="button" className="btn primary" onClick={() => setStage('final')}>
          Create shopping list
        </button>
      </div>
    </section>
  )
}
